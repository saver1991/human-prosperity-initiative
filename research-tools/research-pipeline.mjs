/**
 * RT-01.3 offline, content-addressed open-science pipeline.
 * Consumes only explicitly allowlisted public HPI source files and a
 * deliberately fictional outcome fixture. No provider fetch, PII, credentials,
 * field interventions, uncontrolled code execution or unsupported causal claims.
 *
 * All outputs are deterministic for an identical source tree and Node 22 runtime.
 * Git commit publication provenance is separately provided by publication.json.
 */
import {createHash} from "node:crypto";
import {auditEvidenceMetadata} from "./evidence-provenance.mjs";
import {auditStructuredEvidence} from "./structured-evidence.mjs";
import {buildSourceCatalog} from "./source-catalog.mjs";
import {getCandidateIndicator,toOutcomeIndicator} from "./indicator-contract.mjs";
import {analyzeOutcomeScenario,simulateSyntheticOutcomes} from "./outcome-evaluation.mjs";

export const PIPELINE_VERSION="1.0.0";
export const INPUTS=Object.freeze({
 ledger:"research/evidence-ledger.csv",
 structured:"research/F0-02-structured-evidence-2026-11-06.csv",
 registry:"research/public-dataset-registry.json",
 indicators:"research/F0-03-indicator-catalog-v0.1.csv",
 fixture:"research/synthetic-outcome-scenario-v1.json",
 protocol:"docs/RT-01-3-reproducible-open-science-v1.md",
 corrections:"research/revision-log.json",
 softwareLicense:"LICENSE",
 docsLicense:"LICENSE-DOCS.md"
});
export const PUBLIC_OUTPUTS=Object.freeze({
 report:"research-pipeline-report.json",
 citations:"research-citation-manifest.json",
 dictionary:"research-data-dictionary.json",
 history:"research-revision-log.json",
 manifest:"research-pipeline-manifest.json"
});
export const sha256=v=>createHash("sha256").update(v).digest("hex");
export const canonical=v=>JSON.stringify(v,null,2)+"\n";
const yyyy=/^\d{4}-\d\d-\d\d$/;
function validateHistory(history){
 if(!history||Object.keys(history).some(k=>!["schemaVersion","entries","policy"].includes(k))||
   history.schemaVersion!=="1.0"||!Array.isArray(history.entries)||history.entries.length<1||
   history.entries.length>200||history.policy!=="append_only_reviewed_source_corrections")
  throw Error("Invalid revision/correction history");
 const seen=new Set();
 let previous="";
 for(const item of history.entries){
  if(!item||Object.keys(item).sort().join(",")!==
     "changeType,date,description,release,supersedes"||
     typeof item.release!=="string"||!/^rt01-3-v\d+$/.test(item.release)||
     seen.has(item.release)||!yyyy.test(item.date)||
     typeof item.description!=="string"||item.description.length<10||
     item.description.length>600||item.date<previous)
   throw Error("Non-monotonic, duplicate or malformed source correction entry");
  if(seen.size===0){
   if(item.changeType!=="initial_release"||item.supersedes!==null)
    throw Error("Initial revision cannot supersede an earlier release");
  }else if(item.changeType!=="correction"||item.supersedes===null||
    !seen.has(item.supersedes))throw Error("Correction must point to a preceding release");
  previous=item.date;
  seen.add(item.release);
 }
 return history;
}
function validateFixture(fixture){
 if(!fixture||fixture.schemaVersion!=="1.0"||
    !fixture.statement?.startsWith("SYNTHETIC EXAMPLE ONLY")||
    !fixture.scenario||fixture.scenario.sourceType!=="synthetic"||
    !fixture.simulation)
  throw Error("RT-01.3 only permits labelled synthetic outcome example");
 return fixture;
}
function dictionary(){
 return {
  schemaVersion:"1.0",scope:"public_aggregates_and_synthetic_only",
  inputSets:[
   {name:"evidence_ledger",path:INPUTS.ledger,entity:"citation_metadata",
    fields:["id","year","geography","domain","source_type","key_finding","limitations","url"],
    limitations:"URLs and study mentions not independently resolved or bias assessed"},
   {name:"structured_evidence",path:INPUTS.structured,entity:"abstract_level_study_family",
    fields:["source_id","study_title","study_family","extraction_depth","formal_risk_of_bias"],
    limitations:"34 source-level entries can include overlapping study families; no formal RoB assessment"},
   {name:"dataset_candidates",path:INPUTS.registry,entity:"public_dataset_metadata",
    fields:["id","url","licenseStatus","rightsReviewStatus","retrievedAt","expectedDataSha256","retraction"],
    limitations:"No third-party dataset payload downloaded or authorised"},
   {name:"synthetic_outcome_fixture",path:INPUTS.fixture,entity:"hypothetical_two_group_aggregate",
    fields:["scenarioId","sourceType","indicatorId","timeframe","reference","comparison","missingFollowup","harmsReported","costMinorUnits","strata"],
    limitations:"Fictional inputs, without personal records, causal effect or real-world validity"}
  ],
  resultSets:[
   {name:"source_audit",unit:"metadata_records",researchStatus:"not_independently_reviewed"},
   {name:"descriptive_outcomes",unit:"synthetic_observed_percentage_points",researchStatus:"not_a_causal_effect"},
   {name:"simulated_variation",unit:"synthetic_percentile_points",researchStatus:"not_a_real_world_confidence_interval"}
  ],
  suppressedSourceClasses:["participant_microdata","secrets","full_text_copyrighted_studies","unlicensed_dataset_payloads"],
  schemaApproval:"technical_only",
  independentResearchValidation:false
 };
}
export async function generateResearchArtifacts({load}={}){
 if(typeof load!=="function")throw Error("Required explicit source-file loader");
 const names=Object.values(INPUTS);
 const raw={};
 for(const path of names){
  const value=await load(path);
  if(typeof value!=="string"||!value||value.length>1_200_000)
   throw Error("Missing or oversized source input "+path);
  raw[path]=value;
 }
 if(!raw[INPUTS.softwareLicense].includes("MIT License")||
    !raw[INPUTS.docsLicense].includes("Creative Commons Attribution 4.0"))
  throw Error("Repository source licence declarations changed; manual review required");
 const registry=JSON.parse(raw[INPUTS.registry]);
 const fixture=validateFixture(JSON.parse(raw[INPUTS.fixture]));
 const history=validateHistory(JSON.parse(raw[INPUTS.corrections]));
 const evidence=auditEvidenceMetadata(raw[INPUTS.ledger]);
 const structured=auditStructuredEvidence(raw[INPUTS.structured]);
 const catalog=buildSourceCatalog({
  ledgerCsv:raw[INPUTS.ledger],
  structuredCsv:raw[INPUTS.structured],
  registry
 });
 const candidate=getCandidateIndicator(raw[INPUTS.indicators],fixture.scenario.indicatorId);
 const outcome=analyzeOutcomeScenario(fixture.scenario,toOutcomeIndicator(candidate));
 const simulation=simulateSyntheticOutcomes(fixture.simulation);
 const citations={
  schemaVersion:"1.0",kind:"hpi_metadata_citation_manifest",
  sourceHash:sha256(raw[INPUTS.ledger]),
  sourceCount:catalog.records.length,
  citations:catalog.records.map(r=>({
   id:r.id,titleOrType:r.titleOrType,sourceUrl:r.sourceUrl,
   year:r.year,geography:r.geography,doi:r.doi,
   citedAs:"external_source_metadata_not_republished_content",
   licenceStatus:r.licenseStatus,
   rightsReviewStatus:r.rightsReviewStatus,
   retractionStatus:r.retraction,
   fullTextRedistributed:false,
   independentSourceVerification:false
  })),
  disclaimer:"Publisher references are descriptive citations. A citation, DOI string or catalogue entry is not source verification, permission to redistribute contents or research peer review."
 };
 if(citations.citations.length!==catalog.totals.all)
  throw Error("Citation count not consistent with source catalogue");
 const report={
  schemaVersion:"1.0",kind:"hpi_open_science_pipeline_report",
  pipelineVersion:PIPELINE_VERSION,sourceScope:"only_public_metadata_and_synthetic_fixture",
  steps:[
   {id:"01",name:"source_schema_and_integrity",result:"passed"},
   {id:"02",name:"source_rights_and_citation_metadata",result:"metadata_only"},
   {id:"03",name:"draft_F0_03_descriptive_synthetic_outcomes",result:"synthetic_only"},
   {id:"04",name:"content_addressed_publication",result:"requires_merged_site_deployment"}
  ],
  sourceAudit:{
   publicReferenceCount:evidence.recordCount,
   structuredAbstractOrSummaryCount:structured.abstractsOrSummariesOnly,
   candidateStudyFamilies:structured.candidateStudyFamilyCount,
   formallyBiasReviewedCount:structured.formallyRiskOfBiasAssessed,
   curatedDatasetCandidateCount:catalog.totals.datasetCandidates,
   datasetFilesDownloaded:0,
   possibleNonIndependentFamilies:structured.possibleNonIndependentFamilies,
   rightsUnknownOrUnreviewedCount:catalog.records.filter(x=>
    x.licenseStatus==="unknown"||x.rightsReviewStatus==="not_reviewed").length
  },
  syntheticResult:{
   indicatorId:outcome.indicator.id,
   indicatorStatus:outcome.indicator.status,
   observedDifferencePercentagePoints:outcome.observedDifferencePercentagePoints,
   observedReferenceRate:outcome.reference.observedRate,
   observedComparisonRate:outcome.comparison.observedRate,
   missingnessSensitivity:outcome.missingnessSensitivity,
   independentBinomialAssumptionDeclared:outcome.independentBinomialAssumptionDeclared,
   conditionalUncertainty:outcome.uncertainty,
   syntheticSimulationQuantiles:simulation.simulatedVariationPercentiles,
   simulatedSeed:simulation.seed,
   simulatedIterations:simulation.iterations,
   causalInterpretation:outcome.causalInterpretation
  },
  caveats:{
   scientificSignoff:false,fieldwork:false,realWorldImpactMeasured:false,
   participantDataProcessed:false,externalDataPayloadImported:false,
   licenceReviewComplete:false,causalEffectEstablished:false,
   openResearchCodeLicence:"MIT",
   originalHpiDocumentationLicence:"CC-BY-4.0",
   thirdPartyContentLicences:"individual_source_review_required"
  }
 };
 const outputs={
  report:canonical(report),citations:canonical(citations),
  dictionary:canonical(dictionary()),history:canonical(history)
 };
 const manifest={
  schemaVersion:"1.0",kind:"hpi_content_addressed_research_manifest",
  pipelineVersion:PIPELINE_VERSION,project:"human-prosperity-initiative",
  reproducibleOn:"Node.js 22 standard library; no external network or API",
  sourceInputs:names.map(path=>({
   path,sha256:sha256(raw[path]),bytes:Buffer.byteLength(raw[path],"utf8")
  })),
  artifacts:Object.entries(outputs).map(([key,value])=>({
   path:PUBLIC_OUTPUTS[key],sha256:sha256(value),bytes:Buffer.byteLength(value,"utf8")
  })),
  correctionHistoryRelease:history.entries.at(-1).release,
  publicationCommit:"see_publication_json_revision",
  manifestFormat:"sha256_of_exact_canonical_utf8_bytes",
  promises:{
   deterministicForIdenticalSources:true,thirdPartyMaterialsRedistributed:false,
   realParticipantRecordsUsed:false,independentlyValidated:false
  }
 };
 outputs.manifest=canonical(manifest);
 return {outputs,report,manifest};
}
