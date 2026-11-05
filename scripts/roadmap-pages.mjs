import {escapeHtml,slug} from "./site-content.mjs";

// Static, accessible first-party pages from an independently validated, dated
// public data contract. Never interpret task completion as participant impact.
const safe=escapeHtml;
const LANES=[
 {id:"now",value:"Now",number:"01",name:"Now",subtitle:"Current work",description:"Active foundational science and public infrastructure work."},
 {id:"next",value:"Next",number:"02",name:"Next",subtitle:"Coming next",description:"Defined workstreams and review gates. Order does not imply guaranteed delivery dates."},
 {id:"later",value:"Later",number:"03",name:"Later",subtitle:"Long-term research",description:"Ambitions conditioned on sound evidence, partners, ethics and community legitimacy."}
];
export const STATUS_LABEL={
 planned:"Planned",in_progress:"In progress",review:"Review pending",
 documented:"Published draft",complete:"Technical delivery complete",
 aspirational:"Aspirational",long_term:"Long term",unknown:"Not verified",blocked:"Blocked"
};
function statusBadge(state){
 return '<span class="rp-status rp-status--'+safe(state)+'">'+safe(STATUS_LABEL[state]||"Not verified")+'</span>';
}
function evidenceLink(item,detailsEnabled){
 if(detailsEnabled)return '<a class="rp-card-action" href="/initiatives/'+safe(slug(item.id))+'">Explore initiative <span aria-hidden="true">↗</span></a>';
 if(item.deliverables.length){
  const p=item.deliverables[0];
  return '<a class="rp-card-action" href="'+safe(p.url)+'">Read published work <span aria-hidden="true">↗</span></a>';
 }
 return item.issue?'<a class="rp-card-action" href="/activity#issue-'+item.issue+'">View public work <span aria-hidden="true">↗</span></a>':
 '<a class="rp-card-action" href="/mission">Read our mission <span aria-hidden="true">↗</span></a>';
}
function card(item,{detailsEnabled}){
 const epics=item.epics.length;
 const tasks=item.epics.reduce((n,e)=>n+e.tasks.length,0);
 const detail=epics?'<span>'+epics+' workstream'+(epics===1?"":"s")+' · '+tasks+' described task'+(tasks===1?"":"s")+'</span>':
  '<span>Research horizon · no approved study</span>';
 return '<article class="rp-card" id="initiative-'+safe(slug(item.id))+'">'+
  '<div class="rp-card-top"><span class="rp-id">'+safe(item.id)+'</span>'+statusBadge(item.status)+'</div>'+
  '<div class="rp-card-type">'+safe(item.kind==="platform"?"Website & operations":"Science & governance")+'</div>'+
  '<h4>'+safe(item.name)+'</h4><p class="rp-card-desc">'+safe(item.summary)+'</p>'+
  '<div class="rp-card-gate"><span>DECISION GATE</span><p>'+safe(item.gate)+'</p></div>'+
  '<div class="rp-card-footer"><span class="rp-card-count">'+detail+'</span>'+evidenceLink(item,detailsEnabled)+'</div>'+
  '</article>';
}
function section(lane,items,opts){
 const buckets=[
  {key:"research",label:"Scientific programme"},
  {key:"platform",label:"Public website & operations"}
 ].filter(b=>items.some(i=>i.kind===b.key));
 const groups=buckets.map(group=>
  '<div class="rp-track"><div class="rp-track-head"><h3>'+safe(group.label)+'</h3><span>'+items.filter(x=>x.kind===group.key).length+' initiative'+(items.filter(x=>x.kind===group.key).length===1?"":"s")+'</span></div>'+
  '<div class="rp-cards">'+items.filter(x=>x.kind===group.key).map(i=>card(i,opts)).join("")+'</div></div>'
 ).join("");
 return '<section class="rp-lane" id="'+lane.id+'" aria-labelledby="stage-'+lane.id+'">'+
  '<div class="rp-stage-head"><span class="rp-stage-num">'+lane.number+'</span><div><span class="rp-kicker">'+safe(lane.subtitle)+'</span><h2 id="stage-'+lane.id+'">'+lane.name+'</h2><p>'+safe(lane.description)+'</p></div>'+
  '<span class="rp-stage-total">'+items.length+' initiatives</span></div>'+groups+'</section>';
}
export function renderRoadmapOverview(model,{detailsEnabled=false}={}){
 const initiatives=model.initiatives;
 const workstream=initiatives.find(x=>x.id==="WEB-02");
 const taskCount=workstream?.epics.reduce((n,e)=>n+e.tasks.length,0)||0;
 const epics=workstream?.epics.length||0;
 return '<div class="rp-dashboard">'+
 '<section class="rp-lede" aria-labelledby="rp-intro-title"><div class="rp-lede-copy"><span class="rp-overline">PUBLIC PROGRAMME / TRANSPARENT DELIVERY</span>'+
 '<h2 id="rp-intro-title">Every initiative. <em>Every open question.</em></h2>'+
 '<p>Follow what we are building, what has been published, and what still needs independent scrutiny. Project activity is not evidence of improved human prosperity.</p>'+
 '<div class="rp-shortcuts"><a href="#now">Now</a><a href="#next">Next</a><a href="#later">Later</a><a href="/activity">Issue activity ↗</a></div></div>'+
 '<aside class="rp-summary" aria-label="Public roadmap figures">'+
 '<div><strong>'+initiatives.length+'</strong><span>Tracked initiatives</span></div>'+
 '<div><strong>'+epics+'</strong><span>WEB-02 epics</span></div>'+
 '<div><strong>'+taskCount+'</strong><span>WEB-02 defined tasks</span></div>'+
 '<p>These are counts of published work items, <strong>not</strong> beneficiary or impact metrics.</p></aside></section>'+
 '<div class="rp-disclosure" role="note"><strong>What these statuses mean:</strong> Versioned editorial snapshot reviewed '+safe(model.reviewedAt)+'. '+
 'GitHub Issues are authoritative for task state; this view does not automatically sync issue closures. '+
 'Independent research approval, ethical clearance and verified participant outcomes are <strong>not established</strong>. '+
 '<a href="/library/docs/web-02-public-roadmap-data-contract">How progress is reported ↗</a></div>'+
 '<nav class="rp-stage-nav" aria-label="Roadmap stages"><a href="#now">01 · Now</a><a href="#next">02 · Next</a><a href="#later">03 · Later</a></nav>'+
 LANES.map(lane=>section(lane,initiatives.filter(x=>x.horizon===lane.value),{detailsEnabled})).join("")+
 '<section class="rp-bottom" aria-labelledby="rp-bottom-title"><div><span class="rp-overline">OPEN RESEARCH · AUDITABLE WORK</span><h2 id="rp-bottom-title">Progress should withstand scrutiny.</h2><p>Read the original roadmap, examine published research, or review the underlying issue history. We distinguish software delivery, draft science, independent review and outcomes.</p>'+
 '<div class="rp-bottom-links"><a href="/library/docs/roadmap-source">Read source roadmap ↗</a><a href="/research">Browse research on HPI ↗</a><a href="/activity">Current public issue states ↗</a></div></div>'+
 '<div class="rp-version"><span>Public information snapshot</span><strong>'+safe(model.reviewedAt)+'</strong><small>Site revision: '+safe(model.publishedRevision==="local-build"?"local working tree":model.publishedRevision.slice(0,9))+'</small><small>No live task editing · No reported participant outcomes</small></div></section>'+
 '</div>';
}

function humanTaskStatus(status){
 if(status==="complete")return "Technical task completed";
 if(status==="documented")return "Public evidence documented";
 if(status==="in_progress")return "In progress";
 if(status==="review")return "Review pending";
 return STATUS_LABEL[status]||"Not verified";
}
function taskRow(t){
 const isAccepted=t.status==="complete"||t.status==="documented";
 const proof=t.evidence?'<a href="'+safe(t.evidence)+'" target="_blank" rel="noopener noreferrer" class="rp-evidence-action">View acceptance evidence on GitHub ↗</a>':"";
 return '<li class="rp-task-row"><span aria-hidden="true" class="rp-task-icon '+(isAccepted?"is-accepted":"")+'">'+(isAccepted?"✓":"○")+'</span>'+
 '<div class="rp-task-body"><div class="rp-task-meta"><span class="rp-task-id">'+safe(t.id)+'</span>'+
 '<span class="rp-task-status">'+safe(humanTaskStatus(t.status))+'</span></div>'+
 '<p>'+safe(t.title)+'</p>'+proof+'</div></li>';
}
function epicPanel(e){
 const done=e.tasks.filter(t=>t.status==="complete").length;
 const activity=e.issue?'<a class="rp-epic-history" href="/activity#issue-'+e.issue+'">Read the latest public issue state on HPI ↗</a>':"";
 const external=e.issue?'<a class="rp-epic-edit" href="https://github.com/saver1991/human-prosperity-initiative/issues/'+e.issue+'" target="_blank" rel="noopener noreferrer">Discuss or propose edits on GitHub (external) ↗</a>':"";
 return '<article class="rp-epic" id="epic-'+safe(slug(e.id))+'">'+
 '<div class="rp-epic-heading"><div><span class="rp-epic-id">'+safe(e.id)+'</span>'+
 '<h3>'+safe(e.title)+'</h3></div>'+statusBadge(e.status)+'</div>'+
 '<p class="rp-epic-brief">'+e.tasks.length+' defined task'+(e.tasks.length===1?"":"s")+
  (done?"; "+done+" accepted technical task"+(done===1?"":"s"):"")+
  ' in the dated public snapshot. Issue checklists and discussion remain authoritative.</p>'+
 (e.tasks.length?'<ol class="rp-task-list">'+e.tasks.map(taskRow).join("")+'</ol>':
 '<p class="rp-no-tasks">No approved tasks have been defined for this horizon.</p>')+
 '<div class="rp-epic-links">'+activity+external+'</div></article>';
}
export function renderInitiativeDetail(item,model){
 const tasks=item.epics.reduce((n,e)=>n+e.tasks.length,0);
 const complete=item.epics.reduce((n,e)=>n+e.tasks.filter(t=>t.status==="complete").length,0);
 const documents=item.deliverables.length?'<div class="rp-doc-links">'+item.deliverables.map(d=>
  '<a href="'+safe(d.url)+'"><span>'+safe(d.label)+'</span><span aria-hidden="true">↗</span></a>'
 ).join("")+'</div>':
 '<p>No study publications or validated evidence are available for this future research horizon.</p>';
 const list=item.epics.length?item.epics.map(epicPanel).join(""):
 '<p class="rp-no-epics">This is a long-term research aspiration. There are currently no authorised epics, studies or participant interventions.</p>';
 const navigate=model.initiatives.filter(x=>x.id!==item.id)
 .filter(x=>x.horizon===item.horizon).slice(0,3);
 return '<div class="rp-detail">'+
 '<nav class="rp-detail-nav" aria-label="Initiative navigation"><a href="/roadmap">← All initiatives</a><a href="/activity">Latest public issue activity ↗</a></nav>'+
 '<section class="rp-detail-overview" aria-labelledby="detail-overview-title"><div class="rp-detail-intro">'+
 '<span class="rp-overline">'+safe(item.kind==="platform"?"PUBLIC INFRASTRUCTURE":"SCIENTIFIC PROGRAMME")+' / '+safe(item.id)+'</span>'+
 '<h2 id="detail-overview-title">What this initiative is here to achieve.</h2>'+
 '<p>'+safe(item.summary)+'</p>'+
 '<div class="rp-detail-metadata"><div><span>Priority</span><strong>'+safe(item.priority)+'</strong></div>'+
 '<div><span>Horizon</span><strong>'+safe(item.horizon)+'</strong></div>'+
 '<div><span>Workstreams</span><strong>'+item.epics.length+'</strong></div>'+
 '<div><span>Defined tasks</span><strong>'+tasks+'</strong></div></div></div>'+
 '<aside class="rp-detail-state" aria-label="Current work status"><span class="rp-overline">PUBLIC STATUS</span>'+
 statusBadge(item.status)+
 '<p>This is an editorial status reviewed '+safe(model.reviewedAt)+'. It is not a live GitHub issue synchronisation.</p>'+
 '<div class="rp-detail-verified"><span>TECHNICAL ACCEPTANCE</span><strong>'+complete+' / '+tasks+'</strong>'+
 '<p>Tasks marked complete with linked acceptance evidence. Other task states are shown separately; this is not a scientific impact percentage.</p></div>'+
 '<div class="rp-detail-verified"><span>HUMAN PROSPERITY OUTCOMES</span><strong>Not verified</strong>'+
 '<p>No measured, independently established population impact is reported for this initiative.</p></div></aside></section>'+
 '<section class="rp-review-gate" aria-labelledby="rp-decision-heading"><span class="rp-overline">DECISION / REVIEW GATE</span>'+
 '<h2 id="rp-decision-heading">What still needs to be demonstrated</h2><p>'+safe(item.gate)+'</p></section>'+
 '<div class="rp-detail-grid"><div class="rp-epic-column"><div class="rp-section-head"><span class="rp-overline">DELIVERY WORK BREAKDOWN</span>'+
 '<h2 id="rp-epics-heading">Epics &amp; tasks</h2><p>Task descriptions are a dated, versioned public summary. '+ 
 'For status changes since that snapshot, follow the linked HPI public issue activity; an issue marked closed is not automatically a scientific review approval.</p></div>'+
 '<section aria-labelledby="rp-epics-heading">'+list+'</section></div>'+
 '<aside class="rp-detail-sidebar"><section class="rp-doc-card" aria-labelledby="rp-docs-heading"><span class="rp-overline">FIRST-PARTY SOURCES</span>'+
 '<h2 id="rp-docs-heading">Documents &amp; evidence</h2>'+documents+
 '<p class="rp-side-disclaimer">HPI publishes research and working proposals directly from the versioned repository. An available document is not proof that an intervention works.</p></section>'+
 '<section class="rp-doc-card" aria-labelledby="rp-provenance-heading"><span class="rp-overline">TRACEABILITY</span>'+
 '<h2 id="rp-provenance-heading">Snapshot provenance</h2><dl><dt>Reviewed on</dt><dd>'+safe(model.reviewedAt)+'</dd>'+
 '<dt>Source revision</dt><dd><code>'+safe(model.publishedRevision.slice(0,12))+'</code></dd>'+
 '<dt>Issue authority</dt><dd>Public HPI GitHub issues; not live-synchronised here</dd>'+
 '<dt>Institutional status</dt><dd>Working name · Not incorporated</dd></dl>'+
 (item.issue?'<a href="/activity#issue-'+item.issue+'">Open the initiative in public activity ↗</a>':'')+
 '</section></aside></div>'+
 '<section class="rp-related" aria-labelledby="rp-related-heading"><div><span class="rp-overline">CONTINUE EXPLORING</span>'+
 '<h2 id="rp-related-heading">The wider roadmap</h2><p>Related initiatives at the same planning horizon.</p></div>'+
 '<div class="rp-related-links">'+navigate.map(x=>
  '<a href="/initiatives/'+safe(slug(x.id))+'"><span>'+safe(x.id)+'</span>'+safe(x.name)+' <span aria-hidden="true">↗</span></a>'
 ).join("")+'<a href="/roadmap">Browse all roadmap initiatives ↗</a></div></section>'+
 '</div>';
}
