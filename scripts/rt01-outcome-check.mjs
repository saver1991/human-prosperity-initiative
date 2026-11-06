/**
 * Reproducible, offline F0-03-aligned synthetic outcome scenario audit.
 * No network, data-collection, causal-effect or person-level access.
 */
import {readFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {pathToFileURL} from "node:url";
import {getCandidateIndicator,toOutcomeIndicator} from "../research-tools/indicator-contract.mjs";
import {analyzeOutcomeScenario,simulateSyntheticOutcomes} from "../research-tools/outcome-evaluation.mjs";
const hash=s=>createHash("sha256").update(s).digest("hex");
export async function verifySyntheticOutcomeScenario({
 indicatorPath="research/F0-03-indicator-catalog-v0.1.csv",
 fixturePath="research/synthetic-outcome-scenario-v1.json"
}={}){
 const [rawCatalog,rawFixture]=await Promise.all([readFile(indicatorPath,"utf8"),readFile(fixturePath,"utf8")]);
 const fixture=JSON.parse(rawFixture);
 if(fixture.schemaVersion!=="1.0"||!fixture.statement?.startsWith("SYNTHETIC EXAMPLE ONLY"))
  throw Error("Expected explicitly synthetic template");
 const aligned=getCandidateIndicator(rawCatalog,fixture.scenario.indicatorId);
 const result=analyzeOutcomeScenario(fixture.scenario,toOutcomeIndicator(aligned));
 const simulation=simulateSyntheticOutcomes(fixture.simulation);
 return {
  kind:"hpi-rt01-2-synthetic-evaluation-report-v1.0",
  inputs:{indicatorCatalogSha256:hash(rawCatalog),fixtureSha256:hash(rawFixture)},
  indicatorSourceStatus:aligned.status,
  outcome:result,simulation,
  participantRecordsUsed:false,
  independentlyValidatedResearch:false,
  measuredProsperityImpact:false,
  publicationAuthority:"public Git source only; human methods review pending"
 };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)
 console.log(JSON.stringify(await verifySyntheticOutcomeScenario(),null,2));
