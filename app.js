const M=window.MODULE, C=window.CLIENTS, P=window.PRODUCTS||[];
const A=id=>`assets/${id}`;
const KEY='pitbull-academy-quality-pass-01';
const fresh=()=>({view:'home',current:0,completed:[],chat:[],node:'start',discovered:[],rapport:62,results:[],bossCheck:null,pending:null,lostPending:null,selectedProduct:'glutamina-300g'});
let S=load();

function load(){try{return Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return fresh()}}
function save(){localStorage.setItem(KEY,JSON.stringify({...S,discovered:[...(S.discovered||[])]}))}
function reset(){localStorage.removeItem(KEY);S=fresh();render()}
function tap(){try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}}
function el(id){return document.getElementById(id)}
function enterAcademy(){
  tap();
  const splash=el('splash');
  if(!splash)return;
  splash.classList.add('splash-out');
  window.setTimeout(()=>{splash.hidden=true;splash.classList.remove('splash-out')},220);
}
function syncTopline(view){
  const productMode=view==='catalog'||view==='product';
  el('appcode').textContent=productMode?'PITBULL ACADEMY · PRODUCTOS':`PITBULL ACADEMY · ${M.code}`;
  el('moduleMeter').style.visibility=productMode?'hidden':'visible';
}
function show(id,{scroll=true}={}){
  document.querySelectorAll('.screen').forEach(x=>x.hidden=true);
  el(id).hidden=false;
  S.view=id;
  syncTopline(id);
  save();
  if(scroll)window.scrollTo({top:0,behavior:'smooth'});
}
function current(){return C[S.current]}
function selectedProduct(){return P.find(p=>p.id===S.selectedProduct)||P[0]}
function discoveredSet(){return new Set(S.discovered||[])}
function setPhoto(id,c){const node=el(id);if(!node)return;node.src=A(`${c.id}.svg`);node.alt=c.name}
function updateMeter(){const done=S.completed.length,total=M.clients||6,pct=Math.max(0,Math.min(1,done/total));el('moduleMeter').style.setProperty('--p',`${pct*360}deg`);el('moduleMeterText').textContent=`${done}/${total}`}

function render(){
  el('moduleTitle').textContent=M.title;
  el('moduleSubtitle').textContent=M.subtitle;
  el('moduleMeta').textContent=`${M.clients} CLIENTES · ${M.category}`;
  el('moduleBrand').textContent=M.brand;
  el('moduleProgress').style.width=`${Math.round((S.completed.length/M.clients)*100)}%`;
  el('resumeText').textContent=S.completed.length?`${S.completed.length}/${M.clients} clientes completados`:'Listo para comenzar';
  if(el('productCount'))el('productCount').textContent=P.length;
  updateMeter();renderMap();renderCatalog();resumeView();
}
function resumeView(){
  const v=S.view||'home';
  if(v==='home'||v==='module'||v==='map'||v==='catalog'){if(v==='catalog')renderCatalog();show(v,{scroll:false});return}
  if(v==='product'){renderProduct(false);return}
  if(v==='case'){renderCase(false);return}
  if(v==='chat'&&S.chat?.length){renderChat({scroll:false});return}
  if(v==='decision'){show('decision',{scroll:false});return}
  if(v==='reaction'){if(S.pending){renderReaction({scroll:false});return}if(S.lostPending){renderLostReaction({scroll:false});return}}
  if(v==='bossCheck'){renderBossCheck({scroll:false});return}
  if(v==='final'&&S.results?.length){final({scroll:false});return}
  if(v==='review'&&S.results?.length){review({scroll:false});return}
  show('home',{scroll:false});
}
function openModule(){tap();show('module')}
function startModule(){tap();show('map')}

function renderCatalog(){
  if(!el('productList'))return;
  el('productList').innerHTML=P.map(p=>{
    const active=p.status==='active';
    return `<button class="product-row" onclick="openProduct('${p.id}')">
      <span class="product-thumb"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.visibility='hidden'"></span>
      <span class="product-row-copy">
        <span class="product-row-meta">${active?`${p.module} · ACTIVO`:'BASE INCORPORADA'}</span>
        <strong>${p.name}</strong>
        <span class="small">${p.category}</span>
      </span>
      <span class="product-row-arrow">${active?'→':'›'}</span>
    </button>`;
  }).join('');
}
function openCatalog(){tap();renderCatalog();show('catalog')}
function openProduct(id){
  tap();S.selectedProduct=id;save();renderProduct(true);
}
function renderProduct(scroll=true){
  const p=selectedProduct();if(!p){openCatalog();return}
  const img=el('productImage');
  img.src=p.image;img.alt=p.name;img.style.visibility='visible';
  img.onerror=()=>{img.style.visibility='hidden'};
  el('productBrand').textContent=p.brand;
  el('productName').textContent=p.name;
  el('productSummary').textContent=p.summary;
  el('productCategory').textContent=p.category;
  el('productPresentation').textContent=p.presentation;
  el('productFormat').textContent=`${p.package} · ${p.type}`;
  el('productFlavors').textContent=p.flavors.join(' · ');
  const active=p.status==='active';
  el('productStatus').textContent=active?`${p.module} · MÓDULO ACTIVO`:'BASE INCORPORADA';
  el('productStatus').className=`product-status ${active?'is-active':''}`;
  const btn=el('productModuleButton');
  btn.disabled=!active;
  btn.className=(active?'primary':'secondary')+' product-module-button';
  btn.innerHTML=active?'<span>ENTRAR AL MÓDULO M01</span><span>→</span>':'<span>MÓDULO EN PREPARACIÓN</span><span>·</span>';
  show('product',{scroll});
}
function openProductModule(){
  const p=selectedProduct();
  if(!p||p.status!=='active')return;
  openModule();
}

function renderMap(){
  updateMeter();
  el('clientList').innerHTML=C.map((c,i)=>{
    const done=S.completed.includes(i),unlocked=i<=S.completed.length;
    return `<button class="cast-item" ${unlocked?'':'disabled'} onclick="startClient(${i})">
      <img class="client-photo" src="${A(c.id+'.svg')}" alt="${c.name}">
      <div><span class="num">${String(i+1).padStart(2,'0')} · ${done?'COMPLETADO':'CLIENTE'}</span><strong>${c.name}</strong><span class="small">${c.label}${i===5?' · Boss Challenge':''}</span></div>
      <span class="arrow">${done?'✓':unlocked?'→':'·'}</span>
    </button>`;
  }).join('');
}
function startClient(i){tap();S.current=i;S.chat=[];S.node='start';S.discovered=[];S.rapport=62;S.pending=null;S.lostPending=null;save();renderCase(true)}
function renderCase(scroll=true){
  const c=current(),total=M.clients||6,n=S.current+1;
  setPhoto('caseAvatar',c);
  el('caseNum').textContent=`CASO ${String(n).padStart(2,'0')} DE ${String(total).padStart(2,'0')}`;
  el('caseName').textContent=c.name;el('caseAge').textContent=c.age;el('caseLabel').textContent=c.label;el('caseQuote').textContent=`“${c.intro}”`;
  show('case',{scroll});
}
function beginChat(){tap();const c=current();if(!S.chat.length)S.chat=[{who:'client',text:c.intro}];save();renderChat()}
function rtxt(q){if(q>=8)return['La conversación gana confianza.','good'];if(q<=-15)return['La conversación se enfría.','bad'];if(q<0)return['La pregunta llega algo pronto.','bad'];return['La conversación continúa.','']}
function followConversation(){
  requestAnimationFrame(()=>{
    const bubbles=[...el('thread').querySelectorAll('.bubble')],last=bubbles[bubbles.length-1];
    if(last)last.scrollIntoView({behavior:'smooth',block:'center'});
  });
}
function renderChat({scroll=true,follow=false}={}){
  const c=current();setPhoto('chatAvatar',c);el('chatName').textContent=c.name;el('chatLabel').textContent=c.label;
  el('thread').innerHTML=S.chat.map(m=>{const rx=m.q!==undefined?rtxt(m.q):null;return `<div class="bubble ${m.who==='client'?'client':'you'}">${m.text}</div>${rx?`<div class="reaction ${rx[1]}">${rx[0]}</div>`:''}`}).join('');
  const opts=c.nodes[S.node]||[];
  el('choices').innerHTML=opts.map((o,i)=>`<button class="choice" onclick="chooseLine(${i})">${o.t}</button>`).join('');
  const turns=S.chat.filter(x=>x.who==='you').length,ready=turns>=2;
  el('resolve').className=(ready?'primary':'secondary')+' resolve';
  el('resolve').innerHTML=`<span>${ready?'TOMAR DECISIÓN':'RESOLVER AHORA'}</span><span>→</span>`;
  save();show('chat',{scroll});
  if(follow)followConversation();
}
function chooseLine(i){
  tap();const c=current(),o=c.nodes[S.node][i],d=discoveredSet();
  S.chat.push({who:'you',text:o.t});S.chat.push({who:'client',text:o.r,q:o.q});o.facts.forEach(f=>d.add(f));S.discovered=[...d];S.rapport=Math.max(0,Math.min(100,S.rapport+o.q));S.node=o.next;save();
  if(S.rapport<22){lost();return}
  renderChat({scroll:false,follow:true});
}
function openDecision(){tap();show('decision')}
function calc(action){const c=current(),d=discoveredSet(),listen=Math.min(100,Math.round([...d].filter(x=>c.facts.includes(x)).length/c.facts.length*100));return{listen,criterion:action===c.answer?100:(action==='ask'&&listen<67?78:35),conversation:S.rapport,recommendation:action===c.answer?100:(action==='ask'&&listen<67?75:30)}}
function decide(action){tap();const c=current(),sc=calc(action),correct=action===c.answer,enough=sc.listen>=67;let strength,title,note,copy;if(correct&&enough&&sc.conversation>=55){strength='good';title='Buena lectura';note='La decisión coincide con el contexto que construiste.';copy=c.reaction.good}else if(correct&&!enough){strength='mid';title='Correcto, demasiado pronto';note='Llegaste a una buena acción con poco contexto.';copy=c.reaction.early}else if(action==='ask'&&!enough){strength='mid';title='Buena pausa';note='Reconociste que todavía faltaba información.';copy=c.reaction.early}else{strength='bad';title='Revisá la lectura';note='La acción no responde bien al objetivo que venía mostrando.';copy=c.reaction.bad}S.pending={action,sc,correct,strength,title,note,copy};S.lostPending=null;save();renderReaction()}
function renderReaction({scroll=true}={}){const c=current(),o=S.pending;if(!o){renderMap();show('map',{scroll});return}setPhoto('reactAvatar',c);el('reactName').textContent=c.name;el('clientLine').textContent=`“${o.copy}”`;el('learning').className=`learning ${o.strength}`;el('resultTitle').textContent=o.title;el('resultNote').textContent=o.note;el('learnText').textContent=c.explain;el('reactionNext').onclick=commit;show('reaction',{scroll})}
function commit(){tap();const c=current(),o=S.pending;if(!o)return;S.results.push({i:S.current,name:c.name,action:o.action,correct:o.correct,scores:o.sc});if(!S.completed.includes(S.current))S.completed.push(S.current);S.pending=null;S.lostPending=null;save();updateMeter();if(S.current===2&&S.bossCheck===null){renderBossCheck();return}if(S.current===5){final();return}renderMap();show('map')}
function lost(){const c=current(),sc=calc('lost');S.lostPending={scores:sc};S.pending=null;save();renderLostReaction()}
function renderLostReaction({scroll=true}={}){const c=current();setPhoto('reactAvatar',c);el('reactName').textContent=c.name;el('clientLine').textContent='“Lo voy a pensar. Gracias.”';el('learning').className='learning bad';el('resultTitle').textContent='Cliente perdido';el('resultNote').textContent='La conversación se volvió comercial antes de que el cliente sintiera que estabas intentando entenderlo.';el('learnText').textContent='La calidad de una recomendación también depende de cómo construís confianza.';el('reactionNext').onclick=commitLost;show('reaction',{scroll})}
function commitLost(){tap();const c=current(),lp=S.lostPending;if(!lp)return;S.results.push({i:S.current,name:c.name,action:'lost',correct:false,scores:lp.scores});if(!S.completed.includes(S.current))S.completed.push(S.current);S.lostPending=null;save();updateMeter();if(S.current===2&&S.bossCheck===null){renderBossCheck();return}if(S.current===5){final();return}renderMap();show('map')}
function renderBossCheck({scroll=true}={}){if(S.bossCheck===null){el('bossCheckBody').innerHTML=`<div class="boss-hero"><img src="${A('tiby-boss-check.webp')}" alt="Tiby The Boss"><div class="boss-copy"><p class="eyebrow">THE BOSS CHECK</p><h2>Lectura rápida.</h2><p class="lead">“Duermo cuatro horas, entreno seis días y ya tomo whey + creatina. ¿Me sumás glutamina para recuperar?”</p><div class="choice-list"><button class="choice" onclick="bossAnswer(true)">Primero necesito entender el descanso y la recuperación.</button><button class="choice" onclick="bossAnswer(false)">Sí. Sumemos glutamina.</button><button class="choice" onclick="bossAnswer(false)">Mejor agregaría otro suplemento.</button></div><div class="signature">TIBY · THE BOSS</div></div></div>`}else{renderBossCheckResult(S.bossCheck)}show('bossCheck',{scroll})}
function renderBossCheckResult(ok){el('bossCheckBody').innerHTML=`<div class="boss-hero"><img src="${A('tiby-boss-check.webp')}" alt="Tiby The Boss"><div class="boss-copy"><p class="eyebrow">THE BOSS CHECK</p><h2>${ok?'Bien leído.':'Demasiado rápido.'}</h2><p class="muted">${ok?'Dormir cuatro horas obliga a mirar primero la base antes de sumar un producto.':'La carga de entrenamiento no convierte automáticamente a glutamina en la respuesta cuando aparece una base claramente comprometida.'}</p><div class="signature">TIBY · THE BOSS</div></div></div><div class="actions"><button class="primary" onclick="renderMap();show('map')"><span>SEGUIR</span><span>→</span></button></div>`}
function bossAnswer(ok){tap();S.bossCheck=ok;save();renderBossCheckResult(ok)}
function final({scroll=true}={}){const rs=S.results,avg=k=>Math.round(rs.reduce((a,r)=>a+r.scores[k],0)/Math.max(1,rs.length));let l=avg('listen'),c=avg('criterion'),cv=avg('conversation'),r=avg('recommendation');if(S.bossCheck===true)c=Math.min(100,c+5);const total=Math.round(l*.27+c*.28+cv*.20+r*.25),rank=total>=90?'ASESOR':total>=80?'DETECTOR':total>=68?'OBSERVADOR':'NOVATO';el('overall').textContent=total;el('sListen').textContent=l;el('sCriterion').textContent=c;el('sConversation').textContent=cv;el('sRecommendation').textContent=r;el('rank').textContent=rank;const w=[['ESCUCHA',l],['CRITERIO',c],['CONVERSACIÓN',cv],['RECOMENDACIÓN',r]].sort((a,b)=>a[1]-b[1])[0][0];const verdict={ESCUCHA:'Sabés decidir mejor de lo que todavía sabés descubrir. Hacé aparecer la información antes de cerrar.',CRITERIO:'Escuchás señales, pero falta convertirlas en una decisión más precisa.',CONVERSACIÓN:'La lectura está, pero algunas preguntas llegan antes de tiempo.',RECOMENDACIÓN:'Entendés al cliente; ahora afiná la acción final.'}[w];el('reviewImage').src=A('tiby-boss-review.webp');el('verdict').textContent=`“${verdict}”`;show('final',{scroll})}
function review({scroll=true}={}){const labels={glutamine:'Glutamina',other:'Otra categoría',none:'Todavía no',ask:'Preguntar más',lost:'Cliente perdido'};el('reviewList').innerHTML=S.results.map((x,i)=>{const n=Math.round((x.scores.listen+x.scores.criterion+x.scores.conversation+x.scores.recommendation)/4);return `<div class="review-item"><div class="review-top"><strong>${String(i+1).padStart(2,'0')} · ${x.name}</strong><span class="review-score">${n}</span></div><p class="small">${labels[x.action]||x.action} · ${x.correct?'lectura correcta':'a revisar'}</p></div>`}).join('');show('review',{scroll})}
window.addEventListener('DOMContentLoaded',render);
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));}
