const BRANDS=window.BRANDS||[];
const PRODUCTS=window.PRODUCTS||[];
const MODULES=window.MODULES||[];
const SCENARIOS=window.SCENARIOS||{};
const SOURCES=window.SOURCES||{};
const A=id=>`assets/${id}`;
const KEY='pitbull-academy-quality-pass-01';
const DEFAULT_MODULE_ID=(MODULES.find(m=>m.status==='active')||MODULES[0]||{}).id||null;

const blankModuleProgress=()=>({current:0,completed:[],chat:[],node:'start',discovered:[],rapport:62,results:[],bossCheck:null,pending:null,lostPending:null});
const fresh=()=>({view:'home',selectedModule:DEFAULT_MODULE_ID,selectedProduct:'glutamina-300g',catalogBrand:'all',moduleProgress:{}});

function migrate(raw={}){
  const next=Object.assign(fresh(),raw||{});
  next.moduleProgress=next.moduleProgress||{};
  if(DEFAULT_MODULE_ID&&!next.moduleProgress[DEFAULT_MODULE_ID]){
    const legacyKeys=['current','completed','chat','node','discovered','rapport','results','bossCheck','pending','lostPending'];
    const hasLegacy=legacyKeys.some(k=>Object.prototype.hasOwnProperty.call(raw,k));
    next.moduleProgress[DEFAULT_MODULE_ID]=hasLegacy?Object.assign(blankModuleProgress(),Object.fromEntries(legacyKeys.map(k=>[k,raw[k]]))):blankModuleProgress();
  }
  if(!next.selectedModule)next.selectedModule=DEFAULT_MODULE_ID;
  return next;
}
function load(){try{return migrate(JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return fresh()}}
let S=load();
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function reset(){localStorage.removeItem(KEY);S=fresh();ensureProgress();render()}
function tap(){try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}}
function el(id){return document.getElementById(id)}
function brandById(id){return BRANDS.find(b=>b.id===id)}
function productById(id){return PRODUCTS.find(p=>p.id===id)}
function moduleById(id){return MODULES.find(m=>m.id===id)}
function activeModule(){return moduleById(S.selectedModule)||moduleById(DEFAULT_MODULE_ID)||MODULES[0]}
function activeScenario(){const m=activeModule();return m?SCENARIOS[m.scenarioId]:null}
function ensureProgress(){const m=activeModule();if(!m)return blankModuleProgress();if(!S.moduleProgress[m.id])S.moduleProgress[m.id]=blankModuleProgress();return S.moduleProgress[m.id]}
function MP(){return ensureProgress()}
function C(){return activeScenario()?.clients||[]}
function current(){return C()[MP().current]}
function selectedProduct(){return productById(S.selectedProduct)||PRODUCTS[0]}
function discoveredSet(){return new Set(MP().discovered||[])}
function setPhoto(id,c){const node=el(id);if(!node||!c)return;node.src=A(`${c.id}.svg`);node.alt=c.name}
function productModules(p){return (p.moduleIds||[]).map(moduleById).filter(Boolean)}
function modulePrimaryProduct(m=activeModule()){return productById((m?.productIds||[])[0])}
function brandCount(){return new Set(PRODUCTS.map(p=>p.brandId).filter(Boolean)).size}

function enterAcademy(){tap();const splash=el('splash');if(!splash)return;splash.classList.add('splash-out');window.setTimeout(()=>{splash.hidden=true;splash.classList.remove('splash-out')},220)}
function syncTopline(view){
  const m=activeModule();
  const libraryMode=view==='catalog'||view==='product';
  const moduleMode=['module','map','case','chat','decision','reaction','bossCheck','final','review'].includes(view);
  el('appcode').textContent=libraryMode?'PITBULL ACADEMY · BIBLIOTECA':moduleMode&&m?`PITBULL ACADEMY · ${m.code}`:'PITBULL ACADEMY';
  el('moduleMeter').style.visibility=moduleMode?'visible':'hidden';
}
function show(id,{scroll=true}={}){document.querySelectorAll('.screen').forEach(x=>x.hidden=true);el(id).hidden=false;S.view=id;syncTopline(id);save();if(scroll)window.scrollTo({top:0,behavior:'smooth'})}
function updateMeter(){const m=activeModule(),p=MP();if(!m)return;const total=activeScenario()?.clients?.length||m.clientCount||0,done=p.completed.length,pct=total?Math.max(0,Math.min(1,done/total)):0;el('moduleMeter').style.setProperty('--p',`${pct*360}deg`);el('moduleMeterText').textContent=`${done}/${total}`}

function render(){
  ensureProgress();
  renderHome();
  updateMeter();
  renderMap();
  renderCatalog();
  resumeView();
}
function renderHome(){
  const m=activeModule(),p=MP(),total=activeScenario()?.clients?.length||m?.clientCount||0;
  if(!m)return;
  el('moduleTitle').textContent=m.title;
  el('moduleSubtitle').textContent=m.subtitle;
  el('moduleMeta').textContent=`${m.code} · ${total} CASOS`;
  el('moduleScope').textContent=`COMPETENCIA · ${m.competence}`;
  el('moduleProgress').style.width=`${total?Math.round((p.completed.length/total)*100):0}%`;
  el('resumeText').textContent=p.completed.length?`${p.completed.length}/${total} casos completados`:'Listo para comenzar';
  el('moduleCta').textContent=p.completed.length?'CONTINUAR ENTRENAMIENTO':'ENTRAR AL MÓDULO';
  el('productCount').textContent=PRODUCTS.length;
  el('brandCount').textContent=brandCount();
}
function resumeView(){
  const v=S.view||'home';
  if(v==='home'||v==='module'||v==='map'||v==='catalog'){if(v==='catalog')renderCatalog();if(v==='module')renderModule();show(v,{scroll:false});return}
  if(v==='product'){renderProduct(false);return}
  if(v==='case'){renderCase(false);return}
  if(v==='chat'&&MP().chat?.length){renderChat({scroll:false});return}
  if(v==='decision'){renderDecision();show('decision',{scroll:false});return}
  if(v==='reaction'){if(MP().pending){renderReaction({scroll:false});return}if(MP().lostPending){renderLostReaction({scroll:false});return}}
  if(v==='bossCheck'){renderBossCheck({scroll:false});return}
  if(v==='final'&&MP().results?.length){final({scroll:false});return}
  if(v==='review'&&MP().results?.length){review({scroll:false});return}
  show('home',{scroll:false});
}
function chooseModule(id){if(!moduleById(id))return;S.selectedModule=id;ensureProgress();save();renderHome();updateMeter()}
function openModule(){tap();renderModule();show('module')}
function startModule(){tap();renderMap();show('map')}
function renderModule(){
  const m=activeModule(),p=modulePrimaryProduct(m);if(!m)return;
  el('moduleEyebrow').textContent=`${m.code} · ${m.competence}`;
  el('moduleHeading').textContent=m.title;
  if(p){el('moduleProductImage').src=p.image;el('moduleProductImage').alt=p.name;el('moduleProductBrand').textContent=brandById(p.brandId)?.name||p.brandId;el('moduleProductName').textContent=p.name;el('moduleProductNote').textContent=`Producto de referencia · ${p.category}`}
  el('moduleTrainingPoints').innerHTML=(m.trainingPoints||[]).map(x=>`<div class="point">${x}</div>`).join('');
  el('moduleStatusNote').textContent=m.contentStatus==='audited'?'Contenido auditado para entrenamiento.':'Contenido de entrenamiento en revisión. La auditoría documental se completa antes de marcar el módulo como definitivo.';
}

function catalogProducts(){return S.catalogBrand==='all'?PRODUCTS:PRODUCTS.filter(p=>p.brandId===S.catalogBrand)}
function renderCatalogFilters(){
  const root=el('catalogFilters');if(!root)return;
  const ids=[...new Set(PRODUCTS.map(p=>p.brandId))];
  root.innerHTML=[{id:'all',name:'TODOS'},...ids.map(id=>({id,name:brandById(id)?.name||id}))].map(b=>`<button class="filter-chip ${S.catalogBrand===b.id?'is-active':''}" onclick="setCatalogBrand('${b.id}')">${b.name}</button>`).join('');
}
function setCatalogBrand(id){tap();S.catalogBrand=id;save();renderCatalog()}
function renderCatalog(){
  if(!el('productList'))return;
  renderCatalogFilters();
  const list=catalogProducts();
  el('catalogSummary').textContent=`${PRODUCTS.length} productos · ${brandCount()} ${brandCount()===1?'marca':'marcas'} · ${MODULES.filter(m=>m.status==='active').length} módulo activo`;
  el('productList').innerHTML=list.map(p=>{
    const brand=brandById(p.brandId)?.name||p.brandId,mods=productModules(p),active=mods.some(m=>m.status==='active');
    return `<button class="product-row" onclick="openProduct('${p.id}')">
      <span class="product-thumb"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.visibility='hidden'"></span>
      <span class="product-row-copy">
        <span class="product-row-meta">${brand} · ${p.category}</span>
        <strong>${p.name}</strong>
        <span class="small">${active?`${mods.find(m=>m.status==='active').code} · MÓDULO ACTIVO`:'CATÁLOGO'}</span>
      </span>
      <span class="product-row-arrow">→</span>
    </button>`;
  }).join('');
}
function openCatalog(){tap();renderCatalog();show('catalog')}
function openProduct(id){tap();S.selectedProduct=id;save();renderProduct(true)}
function renderProduct(scroll=true){
  const p=selectedProduct();if(!p){openCatalog();return}
  const img=el('productImage');img.src=p.image;img.alt=p.name;img.style.visibility='visible';img.onerror=()=>{img.style.visibility='hidden'};
  const brand=brandById(p.brandId),mods=productModules(p),active=mods.find(m=>m.status==='active');
  el('productBrand').textContent=brand?.name||p.brandId;
  el('productName').textContent=p.name;
  el('productSummary').textContent=p.catalogNote||'Producto incorporado a la biblioteca de Academy.';
  el('productCategory').textContent=p.category;
  el('productPresentation').textContent=p.presentation;
  el('productFormat').textContent=`${p.package} · ${p.type}`;
  el('productFlavors').textContent=(p.flavors||[]).join(' · ');
  el('productStatus').textContent=active?`${active.code} · MÓDULO ACTIVO`:'PRODUCTO INCORPORADO';
  el('productStatus').className=`product-status ${active?'is-active':''}`;
  const source=SOURCES[p.sourceId];
  el('productSource').textContent=source?`${source.name} · ${source.roleLabel}`:'Fuente de catálogo registrada';
  el('productAudit').textContent=p.auditStatus==='audited'?'Información técnica auditada':'Información técnica pendiente de auditoría';
  const btn=el('productModuleButton');btn.disabled=!active;btn.className=(active?'primary':'secondary')+' product-module-button';btn.innerHTML=active?`<span>ENTRAR AL MÓDULO ${active.code}</span><span>→</span>`:'<span>SIN MÓDULO ACTIVO</span><span>·</span>';
  show('product',{scroll});
}
function openProductModule(){const p=selectedProduct(),m=productModules(p).find(x=>x.status==='active');if(!m)return;chooseModule(m.id);openModule()}

function renderMap(){
  const m=activeModule(),clients=C(),p=MP();if(!m||!el('clientList'))return;updateMeter();
  el('mapMeta').textContent=`SIMULADOR · ${clients.length} CASOS`;
  el('clientList').innerHTML=clients.map((c,i)=>{
    const done=p.completed.includes(i),unlocked=i<=p.completed.length;
    return `<button class="cast-item" ${unlocked?'':'disabled'} onclick="startClient(${i})">
      <img class="client-photo" src="${A(c.id+'.svg')}" alt="${c.name}">
      <div><span class="num">${String(i+1).padStart(2,'0')} · ${done?'COMPLETADO':'CLIENTE'}</span><strong>${c.name}</strong><span class="small">${c.label}${c.bossChallenge?' · Boss Challenge':''}</span></div>
      <span class="arrow">${done?'✓':unlocked?'→':'·'}</span>
    </button>`;
  }).join('');
}
function startClient(i){tap();const p=MP();p.current=i;p.chat=[];p.node='start';p.discovered=[];p.rapport=62;p.pending=null;p.lostPending=null;save();renderCase(true)}
function renderCase(scroll=true){const p=MP(),c=current(),total=C().length,n=p.current+1;if(!c){renderMap();show('map',{scroll});return}setPhoto('caseAvatar',c);el('caseNum').textContent=`CASO ${String(n).padStart(2,'0')} DE ${String(total).padStart(2,'0')}`;el('caseName').textContent=c.name;el('caseAge').textContent=c.age;el('caseLabel').textContent=c.label;el('caseQuote').textContent=`“${c.intro}”`;show('case',{scroll})}
function beginChat(){tap();const p=MP(),c=current();if(!p.chat.length)p.chat=[{who:'client',text:c.intro}];save();renderChat()}
function rtxt(q){if(q>=8)return['La conversación gana confianza.','good'];if(q<=-15)return['La conversación se enfría.','bad'];if(q<0)return['La pregunta llega algo pronto.','bad'];return['La conversación continúa.','']}
function followConversation(){requestAnimationFrame(()=>{const bubbles=[...el('thread').querySelectorAll('.bubble')],last=bubbles[bubbles.length-1];if(last)last.scrollIntoView({behavior:'smooth',block:'center'})})}
function renderChat({scroll=true,follow=false}={}){
  const p=MP(),c=current();setPhoto('chatAvatar',c);el('chatName').textContent=c.name;el('chatLabel').textContent=c.label;
  el('thread').innerHTML=p.chat.map(m=>{const rx=m.q!==undefined?rtxt(m.q):null;return `<div class="bubble ${m.who==='client'?'client':'you'}">${m.text}</div>${rx?`<div class="reaction ${rx[1]}">${rx[0]}</div>`:''}`}).join('');
  const opts=c.nodes[p.node]||[];el('choices').innerHTML=opts.map((o,i)=>`<button class="choice" onclick="chooseLine(${i})">${o.t}</button>`).join('');
  const turns=p.chat.filter(x=>x.who==='you').length,ready=turns>=2;el('resolve').className=(ready?'primary':'secondary')+' resolve';el('resolve').innerHTML=`<span>${ready?'TOMAR DECISIÓN':'RESOLVER AHORA'}</span><span>→</span>`;save();show('chat',{scroll});if(follow)followConversation();
}
function chooseLine(i){tap();const p=MP(),c=current(),o=c.nodes[p.node][i],d=discoveredSet();p.chat.push({who:'you',text:o.t});p.chat.push({who:'client',text:o.r,q:o.q});o.facts.forEach(f=>d.add(f));p.discovered=[...d];p.rapport=Math.max(0,Math.min(100,p.rapport+o.q));p.node=o.next;save();if(p.rapport<22){lost();return}renderChat({scroll:false,follow:true})}
function actionLabel(a){const prod=modulePrimaryProduct();if(a.labelFromProduct&&prod)return prod.shortName?.toUpperCase()||prod.name.toUpperCase();return a.label}
function renderDecision(){const m=activeModule();el('decisionList').innerHTML=(m.decisionActions||[]).map(a=>`<button class="decision" onclick="decide('${a.id}')"><b>${actionLabel(a)}</b><span>${a.hint}</span></button>`).join('')}
function openDecision(){tap();renderDecision();show('decision')}
function calc(action){const p=MP(),c=current(),d=discoveredSet(),listen=Math.min(100,Math.round([...d].filter(x=>c.facts.includes(x)).length/Math.max(1,c.facts.length)*100));return{listen,criterion:action===c.answer?100:(action==='ASK_MORE'&&listen<67?78:35),conversation:p.rapport,recommendation:action===c.answer?100:(action==='ASK_MORE'&&listen<67?75:30)}}
function decide(action){tap();const p=MP(),c=current(),sc=calc(action),correct=action===c.answer,enough=sc.listen>=67;let strength,title,note,copy;if(correct&&enough&&sc.conversation>=55){strength='good';title='Buena lectura';note='La decisión coincide con el contexto que construiste.';copy=c.reaction.good}else if(correct&&!enough){strength='mid';title='Correcto, demasiado pronto';note='Llegaste a una buena acción con poco contexto.';copy=c.reaction.early}else if(action==='ASK_MORE'&&!enough){strength='mid';title='Buena pausa';note='Reconociste que todavía faltaba información.';copy=c.reaction.early}else{strength='bad';title='Revisá la lectura';note='La acción no responde bien al objetivo que venía mostrando.';copy=c.reaction.bad}p.pending={action,sc,correct,strength,title,note,copy};p.lostPending=null;save();renderReaction()}
function renderReaction({scroll=true}={}){const p=MP(),c=current(),o=p.pending;if(!o){renderMap();show('map',{scroll});return}setPhoto('reactAvatar',c);el('reactName').textContent=c.name;el('clientLine').textContent=`“${o.copy}”`;el('learning').className=`learning ${o.strength}`;el('resultTitle').textContent=o.title;el('resultNote').textContent=o.note;el('learnText').textContent=c.explain;el('reactionNext').onclick=commit;show('reaction',{scroll})}
function commit(){tap();const p=MP(),c=current(),o=p.pending;if(!o)return;p.results.push({i:p.current,name:c.name,action:o.action,correct:o.correct,scores:o.sc});if(!p.completed.includes(p.current))p.completed.push(p.current);p.pending=null;p.lostPending=null;save();updateMeter();const scenario=activeScenario();if(p.current===scenario.bossCheck?.afterCaseIndex&&p.bossCheck===null){renderBossCheck();return}if(p.current===C().length-1){final();return}renderMap();show('map')}
function lost(){const p=MP(),sc=calc('LOST');p.lostPending={scores:sc};p.pending=null;save();renderLostReaction()}
function renderLostReaction({scroll=true}={}){const c=current();setPhoto('reactAvatar',c);el('reactName').textContent=c.name;el('clientLine').textContent='“Lo voy a pensar. Gracias.”';el('learning').className='learning bad';el('resultTitle').textContent='Cliente perdido';el('resultNote').textContent='La conversación se volvió comercial antes de que el cliente sintiera que estabas intentando entenderlo.';el('learnText').textContent='La calidad de una recomendación también depende de cómo construís confianza.';el('reactionNext').onclick=commitLost;show('reaction',{scroll})}
function commitLost(){tap();const p=MP(),c=current(),lp=p.lostPending;if(!lp)return;p.results.push({i:p.current,name:c.name,action:'LOST',correct:false,scores:lp.scores});if(!p.completed.includes(p.current))p.completed.push(p.current);p.lostPending=null;save();updateMeter();const scenario=activeScenario();if(p.current===scenario.bossCheck?.afterCaseIndex&&p.bossCheck===null){renderBossCheck();return}if(p.current===C().length-1){final();return}renderMap();show('map')}
function renderBossCheck({scroll=true}={}){
  const p=MP(),bc=activeScenario()?.bossCheck;if(!bc){renderMap();show('map',{scroll});return}
  if(p.bossCheck===null){el('bossCheckBody').innerHTML=`<div class="boss-hero"><img src="${A(bc.image)}" alt="Tiby The Boss"><div class="boss-copy"><p class="eyebrow">THE BOSS CHECK</p><h2>${bc.title}</h2><p class="lead">“${bc.prompt}”</p><div class="choice-list">${bc.options.map((o,i)=>`<button class="choice" onclick="bossAnswer(${i})">${o.text}</button>`).join('')}</div><div class="signature">TIBY · THE BOSS</div></div></div>`}else{renderBossCheckResult(p.bossCheck)}show('bossCheck',{scroll})
}
function renderBossCheckResult(index){const bc=activeScenario().bossCheck,ok=bc.options[index]?.correct;el('bossCheckBody').innerHTML=`<div class="boss-hero"><img src="${A(bc.image)}" alt="Tiby The Boss"><div class="boss-copy"><p class="eyebrow">THE BOSS CHECK</p><h2>${ok?bc.result.goodTitle:bc.result.badTitle}</h2><p class="muted">${ok?bc.result.goodText:bc.result.badText}</p><div class="signature">TIBY · THE BOSS</div></div></div><div class="actions"><button class="primary" onclick="renderMap();show('map')"><span>SEGUIR</span><span>→</span></button></div>`}
function bossAnswer(index){tap();const p=MP();p.bossCheck=index;save();renderBossCheckResult(index)}
function final({scroll=true}={}){const p=MP(),rs=p.results,avg=k=>Math.round(rs.reduce((a,r)=>a+r.scores[k],0)/Math.max(1,rs.length));let l=avg('listen'),c=avg('criterion'),cv=avg('conversation'),r=avg('recommendation');const bc=activeScenario()?.bossCheck;if(bc&&p.bossCheck!==null&&bc.options[p.bossCheck]?.correct)c=Math.min(100,c+5);const total=Math.round(l*.27+c*.28+cv*.20+r*.25),rank=total>=90?'ASESOR':total>=80?'DETECTOR':total>=68?'OBSERVADOR':'NOVATO';el('overall').textContent=total;el('sListen').textContent=l;el('sCriterion').textContent=c;el('sConversation').textContent=cv;el('sRecommendation').textContent=r;el('rank').textContent=rank;const w=[['ESCUCHA',l],['CRITERIO',c],['CONVERSACIÓN',cv],['RECOMENDACIÓN',r]].sort((a,b)=>a[1]-b[1])[0][0];const verdict={ESCUCHA:'Sabés decidir mejor de lo que todavía sabés descubrir. Hacé aparecer la información antes de cerrar.',CRITERIO:'Escuchás señales, pero falta convertirlas en una decisión más precisa.',CONVERSACIÓN:'La lectura está, pero algunas preguntas llegan antes de tiempo.',RECOMENDACIÓN:'Entendés al cliente; ahora afiná la acción final.'}[w];el('reviewImage').src=A('tiby-boss-review.webp');el('verdict').textContent=`“${verdict}”`;show('final',{scroll})}
function review({scroll=true}={}){const p=MP(),actions=Object.fromEntries((activeModule().decisionActions||[]).map(a=>[a.id,actionLabel(a)]));actions.LOST='Cliente perdido';el('reviewList').innerHTML=p.results.map((x,i)=>{const n=Math.round((x.scores.listen+x.scores.criterion+x.scores.conversation+x.scores.recommendation)/4);return `<div class="review-item"><div class="review-top"><strong>${String(i+1).padStart(2,'0')} · ${x.name}</strong><span class="review-score">${n}</span></div><p class="small">${actions[x.action]||x.action} · ${x.correct?'lectura correcta':'a revisar'}</p></div>`}).join('');show('review',{scroll})}

window.addEventListener('DOMContentLoaded',render);
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}))}
