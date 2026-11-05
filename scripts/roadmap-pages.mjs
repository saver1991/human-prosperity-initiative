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
