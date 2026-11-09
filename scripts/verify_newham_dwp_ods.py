#!/usr/bin/env python3
"""Reproduce NEW-02's minimal Newham cells from the pinned official DWP ODS.

Usage:
    python3 scripts/verify_newham_dwp_ods.py --fetch
    python3 scripts/verify_newham_dwp_ods.py /path/to/publisher.ods

Python standard library only. The full third-party workbook is never committed.
Read-only public-source data; NOT validation of real eligibility or HPI-B-01.
"""
from __future__ import annotations
import argparse
import hashlib
import io
import json
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

URL = "https://assets.publishing.service.gov.uk/media/6900969fa6048928d3fc2ae5/households-potentially-eligible-for-pension-credit-2023-to-2024.ods"
SHA256 = "89f5a5fa831f21c4661d6e73ccb76878959e6ea721fb459b43aa3d9bcd96765c"
NAMESPACES = {
    "table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
    "text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
    "office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
}
T = "{" + NAMESPACES["table"] + "}"
O = "{" + NAMESPACES["office"] + "}"


def parse_cells(row: ET.Element) -> list[str]:
    values: list[str] = []
    for cell in row:
        if cell.tag not in (T + "table-cell", T + "covered-table-cell"):
            continue
        repeated = int(cell.get(T + "number-columns-repeated", "1"))
        if repeated > 1024:
            if values:
                break  # Unused blank trailing columns in an ODS document.
            raise ValueError("Unexpected repeated columns before content")
        paragraphs = cell.findall(".//text:p", NAMESPACES)
        rendered = " ".join("".join(p.itertext()) for p in paragraphs).strip()
        content = rendered or cell.get(O + "value", "")
        values.extend([content] * repeated)
    while values and not values[-1]:
        values.pop()
    return values


def sheet(root: ET.Element, sheet_name: str) -> list[tuple[int, list[str]]]:
    tables = [t for t in root.findall(".//table:table", NAMESPACES)
              if t.get(T + "name") == sheet_name]
    if len(tables) != 1:
        raise ValueError("Expected one official DWP sheet " + sheet_name)
    rows: list[tuple[int, list[str]]] = []
    physical_row = 0
    for row in tables[0].findall("table:table-row", NAMESPACES):
        repeated = int(row.get(T + "number-rows-repeated", "1"))
        if repeated < 1:
            raise ValueError("Invalid ODS row repetition")
        physical_row += repeated
        values = parse_cells(row)
        if physical_row <= 6 or (len(values) >= 2 and values[1] == "Newham"):
            rows.append((physical_row, values))
    return rows


def official_newham_row(root: ET.Element, name: str, expected_header: list[str],
                        expected_row: int, expected_values: list[str]) -> dict:
    rows = sheet(root, name)
    header = next((vals for _, vals in rows if vals == expected_header), None)
    if header is None:
        raise ValueError("DWP source schema has drifted in sheet " + name)
    matches = [(row, vals) for row, vals in rows
               if len(vals) > 1 and vals[1] == "Newham"]
    if len(matches) != 1:
        raise ValueError("Newham must appear exactly once in " + name)
    row_no, values = matches[0]
    if row_no != expected_row or values != expected_values or values[0] != "London":
        raise ValueError("DWP Newham row, geography or values drifted in " + name)
    return {"sheet": name, "physicalRow": row_no, "columns": ["A", "B", "C", "D", "E", "F"][:len(values)],
            "headers": header, "values": values}


def verify(raw: bytes) -> dict:
    actual_hash = hashlib.sha256(raw).hexdigest()
    if actual_hash != SHA256:
        raise ValueError("Official source changed or hash mismatch: " + actual_hash)
    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        if archive.testzip() is not None:
            raise ValueError("ODS ZIP CRC failed")
        root = ET.fromstring(archive.read("content.xml"))
    caseload = official_newham_row(
        root, "3a",
        ["Region", "Local Authority", "All eligible",
         "Potentially eligible households", "Eligible households in receipt",
         "Receipt-rate (caseload)"],
        109, ["London", "Newham", "11,300", "2,500", "8,800", "78%"])
    expenditure = official_newham_row(
        root, "3b",
        ["Region", "Local Authority", "Estimated amount unclaimed (£)",
         "Total amount claimed (£m)", "Receipt-rate (expenditure)"],
        110, ["London", "Newham", "8,328,000", "51,337,000", "86%"])
    if 8800 + 2500 != 11300 or round(100 * 8800 / 11300) != 78:
        raise ValueError("Reported DWP caseload arithmetic inconsistent")
    return {
        "publisher": "Department for Work and Pensions",
        "publicationDate": "2025-10-30",
        "period": "2023/24",
        "odsSourceUrl": URL,
        "binarySha256": actual_hash,
        "binaryBytes": len(raw),
        "geography": "Newham, London",
        "onsCode": "E09000025",
        "onsCodeSource": "https://www.ons.gov.uk/explore-local-statistics/areas/E09000025-newham",
        "caseload": caseload,
        "expenditure": expenditure,
        "methodologicalUnit": "households; annual administrative-modelled potential eligibility, not verified HPI participants",
        "validForHPI_B_01": False,
        "hpiPrimaryNumerator": None,
        "hpiPrimaryDenominator": None,
        "scientificApproval": False,
        "fieldAuthorised": False,
        "warnings": [
            "Source rounds household counts; 8,800 / 11,300 supports 78% only approximately.",
            "Savings and housing costs are not fully observed; potential eligibility may be misclassified.",
            "Not comparable to GB FYE2025 official survey-based 62% take-up rate.",
            "The sheet 3b headline contains (£m), but the raw displayed amount is 51,337,000; do not infer/correct the monetary unit or publish a cost-benefit claim.",
            "No independently verified participant cohort, actual benefit-award payment or control group is available."
        ]
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", nargs="?", type=Path)
    parser.add_argument("--fetch", action="store_true")
    arguments = parser.parse_args()
    if arguments.fetch == (arguments.path is not None):
        parser.error("Specify exactly one of --fetch or local ODS path")
    if arguments.fetch:
        request = urllib.request.Request(URL, headers={
            "User-Agent": "HPI-NEW-02-public-statistics-verification/1.0"})
        with urllib.request.urlopen(request, timeout=30) as response:
            raw = response.read(1000000)
            if response.status != 200 or len(raw) >= 1000000:
                raise ValueError("DWP data not safely retrievable")
    else:
        raw = arguments.path.read_bytes()
    print(json.dumps(verify(raw), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
