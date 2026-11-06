/**
 * RT-01.4: fail-closed technical publication policy, not GDPR or ethics certification.
 */
const classes=["synthetic","public_reference_metadata","approved_public_aggregate"];
const forbidden=["direct_identifiers","pseudonymised_personal_data","sensitive_person_level",
 "unlicensed_third_party_payload","unverified_nonpublic_aggregate","individual_entitlement_decisions"];
const stages=["software_built","technical_tests_passed","research_validated","real_world_effect_measured"];
const hex=/^[a-f0-9]{64}$/;
const only=(obj,fields,context)=>{
 if(!obj||typeof obj!=="object"||Array.isArray(obj))throw Error(context+" not object");
 if(Object.keys(obj).some(x=>!fields.includes(x)))throw Error(context+" unexpected field");
};
export function validateResearchGovernance(p){
 only(p,["schemaVersion","reviewedAt","scope","publicationPolicy","permittedClasses",
  "prohibitedClasses","reviewedSoftwareLicenses","thirdPartyRights","science","privacy",
  "safeguarding","accessibility","fundingAndInstitution","publicationStages",
  "approvalPolicy","publicAssets","decisionGates","policySources"],"governance");
 if(p.schemaVersion!=="1.0"||!/^2026-\d\d-\d\d$/.test(p.reviewedAt)||
  p.scope!=="technical_public_research_only"||p.publicationPolicy!=="deny_by_default")
  throw Error("Governance requires dated deny-by-default policy");
 if(p.permittedClasses?.length!==classes.length||
  [...new Set(p.permittedClasses.map(x=>x.id))].sort().join(",")!==[...classes].sort().join(",")||
  p.prohibitedClasses?.length!==forbidden.length||
  [...new Set(p.prohibitedClasses)].sort().join(",")!==[...forbidden].sort().join(","))
  throw Error("Missing required classification");
 if(p.permittedClasses.some(x=>!x.publication||!x.identifiability))
  throw Error("Incomplete public classification");
 const pending=[p.thirdPartyRights?.redistributionApproved,p.thirdPartyRights?.rightsOwnerVerified,
  p.science?.peerReviewCompleted,p.science?.causalClaimsApproved,p.science?.measuredBeneficiaryImpact,
  ...["dataControllerNamed","lawfulBasisApproved","dpiaCompleted","necessityAssessmentCompleted",
    "crossBorderAssessmentCompleted","retentionPolicyApproved","breachResponseApproved"].map(x=>p.privacy?.[x]),
  ...["independentEthicsReview","participantRecruitmentApproved","localPartnerReview","harmEscalationApproved"].map(x=>p.safeguarding?.[x]),
  ...["registeredLegalEntity","trusteesApproved","externalGrantAuthority"].map(x=>p.fundingAndInstitution?.[x]),
  p.accessibility?.realScreenReaderVerified,p.accessibility?.realBrowserZoomVerified];
 if(pending.some(v=>v!==false))throw Error("Unapproved human decisions cannot be self-certified");
 if(p.thirdPartyRights?.status!=="pending_individual_source_review"||
  p.science?.frameworkStatus!=="proposed_not_validated"||
  p.accessibility?.automatedPlaywrightAxe!==true||
  p.accessibility?.languageVersions?.join(",")!=="en,it"||
  p.accessibility?.offlineDownloadOption!==true||
  p.accessibility?.lowBandwidthStaticPages!==true)throw Error("Incorrect evidence and accessibility status");
 if(p.reviewedSoftwareLicenses?.length!==2||
  p.reviewedSoftwareLicenses[0].id!=="MIT"||
  p.reviewedSoftwareLicenses[0].path!=="LICENSE"||
  p.reviewedSoftwareLicenses[1].id!=="CC-BY-4.0"||
  p.reviewedSoftwareLicenses[1].path!=="LICENSE-DOCS.md"||
  p.reviewedSoftwareLicenses.some(x=>x.status!=="repository_declaration_verified"))
  throw Error("Missing declared HPI-authored licences");
 if(p.publicationStages?.join(",")!==stages.join(",")||
  Object.keys(p.approvalPolicy||{}).sort().join(",")!==[...stages].sort().join(","))
  throw Error("Publication approval stages invalid");
 if(p.publicAssets?.length!==3||
  p.publicAssets.some(x=>!["synthetic","public_reference_metadata"].includes(x.class)||
    x.impactStage!=="technical_tests_passed")||
  [...new Set(p.publicAssets.map(x=>x.path))].sort().join(",")!==
   ["/research/source-catalog","/research/outcome-lab","/research/reproducibility"].sort().join(","))
  throw Error("Unexpected or overstated public research asset");
 if(p.decisionGates?.length!==8||p.decisionGates.some((x,i)=>x.id!=="G-0"+(i+1)||
  x.state!=="pending"||!x.topic||!x.authority))throw Error("External governance must remain pending");
 if(p.policySources?.length<3||p.policySources.some(x=>!/^https:\/\//.test(x)))
  throw Error("Governance sources missing");
 return p;
}
export function assessResearchPublication(p,input){
 validateResearchGovernance(p);
 only(input,["class","origin","scenarioType","hasPersonalRows","hasThirdPartyPayload",
  "licenseReview","reidentificationReview","sourceDigest","purpose"],"publication request");
 const reasons=[];
 if(typeof input.purpose!=="string"||!input.purpose.trim()||input.purpose.length>200)
  reasons.push("missing_scoped_purpose");
 if(!classes.includes(input.class)||forbidden.includes(input.class))reasons.push("data_class_not_public");
 if(input.hasPersonalRows!==false)reasons.push("individual_records_not_allowed");
 if(input.hasThirdPartyPayload!==false)reasons.push("third_party_payload_not_allowed");
 if(input.class==="synthetic"){
  if(input.origin!=="synthetic"||input.scenarioType!=="synthetic"||
   input.licenseReview!=="not_applicable"||input.reidentificationReview!=="not_applicable")
   reasons.push("synthetic_origin_or_label_mismatch");
 }else if(input.class==="public_reference_metadata"){
  if(input.origin!=="publisher_metadata"||input.scenarioType!=="none"||
   input.licenseReview!=="metadata_only"||input.reidentificationReview!=="not_applicable")
   reasons.push("metadata_must_not_imply_rights_or_approval");
 }else if(input.class==="approved_public_aggregate"){
  if(input.origin!=="source_controlled_public_aggregate"||
   input.licenseReview!=="independently_approved"||
   input.reidentificationReview!=="independently_approved"||
   !hex.test(input.sourceDigest||""))reasons.push("missing_aggregate_disclosure_and_rights_checks");
  reasons.push("aggregate_external_approvals_not_recorded");
 }
 return {decision:reasons.length?"DENY":"ALLOW_METADATA_OR_SYNTHETIC_ONLY",
  reasons,scientificValidation:false,beneficiaryImpactMeasured:false,
  legalDataUseApproval:false,disclosureReviewCompleted:false};
}
export function governanceStatus(p){
 validateResearchGovernance(p);
 return {schemaVersion:"1.0",kind:"hpi_rt01_4_public_governance_status",
  policyReviewedAt:p.reviewedAt,publicationPolicy:p.publicationPolicy,
  categories:{software:"implemented",tests:"automated_only",
   sourceRights:"pending_external_review",independentScience:"pending",
   participantStudy:"not_authorised",realWorldImpact:"not_measured",
   realScreenReader:"not_tested"},
  approvedPublicAssetPaths:p.publicAssets.map(x=>x.path),
  pendingExternalDecisions:p.decisionGates.map(x=>({id:x.id,topic:x.topic,
   authority:x.authority,status:x.state})),
  softwareLicence:"MIT for original HPI source only",
  originalDocumentationLicence:"CC BY 4.0 for original HPI-authored content only",
  externalDatasetRedistributionAuthorised:false,
  participantRecruitmentAuthorised:false,
  dataProtectionComplianceCertified:false,
  accessibilityCertified:false,
  independentScientificValidation:false,
  realWorldImpactMeasured:false,
  note:"Technical source checks cannot prove anonymisation, permission to reuse third-party data, legal or ethical compliance, real AT accessibility or scientific effects."};
}
