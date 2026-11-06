/**
 * RT-01.2 binding to the public F0-03 V0.1 indicator catalogue.
 * F0-03 descriptors are proposed, never independently validated by this tool.
 */
import {parseCsv} from "../scripts/site-content.mjs";
export const INDICATOR_FIELDS=[
 "id","dimension","domain","indicator_name","operational_definition","unit",
 "denominator_or_population","data_source","collection_time","analysis_role",
 "data_sensitivity","limitations","status"
];
export function getCandidateIndicator(csv,id){
 if(typeof csv!=="string"||csv.length>100_000)throw Error("Invalid indicator source");
 const rows=parseCsv(csv);
 if(rows[0].length!==INDICATOR_FIELDS.length||
  rows[0].some((x,i)=>x!==INDICATOR_FIELDS[i]))
  throw Error("F0-03 indicator schema mismatch");
 if(rows.length<2||rows.length>500)throw Error("Indicator catalog empty or unexpectedly large");
 const ids=new Set();
 let matching=null;
 for(const row of rows.slice(1).filter(x=>x.some(Boolean))){
  if(row.length!==INDICATOR_FIELDS.length||
    !/^HPI-[A-Z]-\d\d$/.test(row[0])||ids.has(row[0]))
   throw Error("Invalid/duplicated F0-03 indicator ID");
  ids.add(row[0]);
  if(row[12]!=="proposed_not_validated")throw Error("Indicator status must remain independently unvalidated");
  if(row[0]===id)matching={
   id:row[0],unit:row[5],domain:row[2],status:row[12],
   publicCatalogTitle:row[3],scientificSignoff:false,
   dataSensitivity:row[10]
  };
 }
 if(!matching)throw Error("Indicator not found in F0-03 public source");
 return matching;
}
export function toOutcomeIndicator(candidate){
 if(!candidate||candidate.scientificSignoff!==false||
   candidate.status!=="proposed_not_validated")
  throw Error("Only draft F0-03 indicators may be compared descriptively");
 return {id:candidate.id,unit:candidate.unit,status:candidate.status,
  domain:candidate.domain};
}
