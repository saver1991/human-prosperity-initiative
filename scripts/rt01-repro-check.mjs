/**
 * RT-01 deterministic dry-run audit. No network access and no personal records.
 * Output is a reproducible, non-causal metadata/synthetic scenario report.
 */
import {readFile} from "node:fs/promises";
import {pathToFileURL} from "node:url";
import {auditEvidenceMetadata} from "../research-tools/evidence-provenance.mjs";
import {compareAggregateOutcomes} from "../research-tools/aggregate-outcomes.mjs";
export async function runAudit({ledgerPath="research/evidence-ledger.csv"}={}){
 const source=await readFile(ledgerPath,"utf8");
 const evidence=auditEvidenceMetadata(source,{sourcePath:ledgerPath});
 const synthetic=compareAggregateOutcomes({
  name:"Synthetic benefits completion example",
  sourceType:"synthetic",
  metric:"Confirmed receipt in fixed follow-up",
  followupDescription:"Illustrative nine-month follow-up; not actual HPI participants",
  control:{eligible:100,received:6,missingFollowup:0},
  comparison:{eligible:100,received:11,missingFollowup:0}
 });
 return {kind:"hpi-rt01-local-reproducibility-report-v0.1",evidence,synthetic,
  generatedWith:"node-standard-library-no-network",
  realWorldImpactMeasured:false,independentScientificReview:false,
  participantRecordsUsed:false};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 console.log(JSON.stringify(await runAudit(),null,2));
}
