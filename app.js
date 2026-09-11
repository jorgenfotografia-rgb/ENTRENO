const M=window.MODULE, C=window.CLIENTS;
const A=id=>`assets/${id}`;
const KEY='pitbull-academy-quality-pass-01';
const fresh=()=>({view:'home',current:0,completed:[],chat:[],node:'start',discovered:[],rapport:62,results:[],bossCheck:null,pending:null});
let S=load();

function load(){try{return Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return fresh()}}
function save(){localStorage.setItem(KEY,JSON.stringify({...S,discovered:[...S.discovered]}))}
function reset(){localStorage.removeItem(KEY);S=fresh();render()}
function tap(){try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}}
function el(id){return document.getElementById(id)}
function show(id){document.querySelectorAll('.screen').forEach(x=>x.hidden=true);el(id).hidden=false;S.view=id;save();window.scrollTo({top:0,behavior:'smooth'})}
function current(){return C[S.current]}
function discoveredSet(){return new Set(S.discovered||[])}

function render(){
  el('appcode').textContent=`PITBULL ACADEMY · ${M.code}`;
  el('moduleTitle').textContent=M.title;
  el('moduleSubtitle').textContent=M.subtitle;
  el('moduleMeta').textContent=`${M.clients} CLIENTES · ${M.category}`;
  el('moduleBrand').textContent=M.brand;
  el('moduleProgress').style.width=`${Math.round((S.completed.length/M.clients)*100)}%`;
  el('resumeText').textContent=S.completed.length?`${S.completed.length}/${M.clients} clientes completados`:'Listo para comenzar';
  renderMap();
  show(S.view && document.getElementById(S.view) ? S.view : 'home');
}

function openModule(){tap();show('module')}
function startModule(){tap();show('map')}
function renderMap(){
  el('clientList').innerHTML=C.map((c,i)=>{
    const done=S.completed.includes(i), unlocked=i<=S.completed.length;
    return `<button class="cast-item" ${unlocked?'':'disabled'} onclick="startClient(${i})">
      <img src="${A(c.id+'.jpg')}" alt="">
      <div><span class="num">${String(i+1).padStart(2,'0')} · ${done?'COMPLETADO':'CLIENTE'}</span><strong>${c.name}</strong><span class="small">${c.label}${i===5?' · Boss Challenge':''}</span></div>
      <span class="arrow">${done?'✓':unlocked?'→':'·'}</span>
    </button>`;
  }).join('');
}
function startClient(i){
  tap();S.current=i;S.chat=[];S.node='start';S.discovered=[];S.rapport=62;S.pending=null;save();
  const c=current();el('caseAvatar').src=A(c.id+'.jpg');el('caseNum').textContent=`CLIENTE ${String(i+1).padStart(2,'0')} · ${i+1}/6`;
  el('caseName').textContent=c.name;el('caseAge').textContent=c.age;el('caseLabel').textContent=c.label;el('caseQuote').textContent=`“${c.intro}”`;
  show('case');
}
function beginChat(){tap();const c=current();S.chat=[{who:'client',text:c.intro}];save();renderChat()}
function rtxt(q){if(q>=8)return['La conversación gana confianza.','good'];if(q<=-15)return['La conversación se enfría.','bad'];if(q<0)return['La pregunta llega algo pronto.','bad'];return['La conversación continúa.','']}
function renderChat(){
  const c=current();el('chatAvatar').src=A(c.id+'.jpg');el('chatName').textContent=c.name;el('chatLabel').textContent=c.label;
  el('thread').innerHTML=S.chat.map(m=>{let rx=m.q!==undefined?rtxt(m.q):null;return `<div class="bubble ${m.who==='client'?'client':'you'}">${m.text}</div>${rx?`<div class="reaction ${rx[1]}">${rx[0]}</div>`:''}`}).join('');
  const opts=c.nodes[S.node]||[];
  el('choices').innerHTML=opts.map((o,i)=>`<button class="choice" onclick="chooseLine(${i})">${o.t}</button>`).join('');
  const turns=S.chat.filter(x=>x.who==='you').length;
  el('resolve').className='secondary resolve'+(turns<2?' is-early':'');
  el('resolve').innerHTML=`<span>RESOLVER CASO</span><span>${turns<2?'cuando estés listo':'→'}</span>`;
  save();show('chat')
}
function chooseLine(i){
  tap();const c=current(),o=c.nodes[S.node][i],d=discoveredSet();
  S.chat.push({who:'you',text:o.t});S.chat.push({who:'client',text:o.r,q:o.q});o.facts.forEach(f=>d.add(f));S.discovered=[...d];S.rapport=Math.max(0,Math.min(100,S.rapport+o.q));S.node=o.next;save();
  if(S.rapport<22){lost();return} renderChat()
}
function openDecision(){tap();show('decision')}
function calc(action){
  const c=current(),d=discoveredSet(),listen=Math.min(100,Math.round([...d].filter(x=>c.facts.includes(x)).length/c.facts.length*100));
  return {listen,criterion:action===c.answer?100:(action==='ask'&&listen<67?78:35),conversation:S.rapport,recommendation:action===c.answer?100:(action==='ask'&&listen<67?75:30)}
}
function decide(action){
  tap();const c=current(),sc=calc(action),correct=action===c.answer,enough=sc.listen>=67;
  let strength,title,note,copy;
  if(correct&&enough&&sc.conversation>=55){strength='good';title='Buena lectura';note='La decisión coincide con el contexto que construiste.';copy=c.reaction.good}
  else if(correct&&!enough){strength='mid';title='Correcto, demasiado pronto';note='Llegaste a una buena acción con poco contexto.';copy=c.reaction.early}
  else if(action==='ask'&&!enough){strength='mid';title='Buena pausa';note='Reconociste que todavía faltaba información.';copy=c.reaction.early}
  else{strength='bad';title='Revisá la lectura';note='La acción no responde bien al objetivo que venía mostrando.';copy=c.reaction.bad}
  S.pending={action,sc,correct,strength,title,note,copy};save();renderReaction()
}
function renderReaction(){
  const c=current(),o=S.pending;el('reactAvatar').src=A(c.id+'.jpg');el('reactName').textContent=c.name;el('clientLine').textContent=`“${o.copy}”`;
  el('learning').className=`learning ${o.strength}`;el('resultTitle').textContent=o.title;el('resultNote').textContent=o.note;el('learnText').textContent=c.explain;show('reaction')
}
function commit(){
  tap();const c=current(),o=S.pending;S.results.push({i:S.current,name:c.name,action:o.action,correct:o.correct,scores:o.sc});if(!S.completed.includes(S.current))S.completed.push(S.current);S.pending=null;save();
  if(S.current===2&&S.bossCheck===null){renderBossCheck();return}
  if(S.current===5){final();return} renderMap();show('map')
}
function lost(){
  const c=current(),sc=calc('lost');S.results.push({i:S.current,name:c.name,action:'lost',correct:false,scores:sc});if(!S.completed.includes(S.current))S.completed.push(S.current);S.pending=null;save();
  el('reactAvatar').src=A(c.id+'.jpg');el('reactName').textContent=c.name;el('clientLine').textContent='“Lo voy a pensar. Gracias.”';el('learning').className='learning bad';el('resultTitle').textContent='Cliente perdido';el('resultNote').textContent='La conversación se volvió comercial antes de que el cliente sintiera que estabas intentando entenderlo.';el('learnText').textContent='La calidad de una recomendación también depende de cómo construís confianza.';
  el('reactionNext').onclick=()=>{if(S.current===2&&S.bossCheck===null)renderBossCheck();else if(S.current===5)final();else{renderMap();show('map')}};show('reaction')
}
function renderBossCheck(){
  el('bossCheckImage').src=A('tiby-boss-check.jpg');show('bossCheck')
}
function bossAnswer(ok){
  tap();S.bossCheck=ok;save();el('bossCheckBody').innerHTML=`<div class="boss-hero"><img src="${A('tiby-boss-check.jpg')}" alt=""><div class="boss-copy"><p class="eyebrow">THE BOSS CHECK</p><h2>${ok?'Bien leído.':'Demasiado rápido.'}</h2><p class="muted">${ok?'Dormir cuatro horas obliga a mirar primero la base antes de sumar un producto.':'La carga de entrenamiento no convierte automáticamente a glutamina en la respuesta cuando aparece una base claramente comprometida.'}</p><div class="signature">TIBY · THE BOSS</div></div></div><div class="actions"><button class="primary" onclick="renderMap();show('map')"><span>SEGUIR</span><span>→</span></button></div>`
}
function final(){
  const rs=S.results,avg=k=>Math.round(rs.reduce((a,r)=>a+r.scores[k],0)/Math.max(1,rs.length));
  let l=avg('listen'),c=avg('criterion'),cv=avg('conversation'),r=avg('recommendation');if(S.bossCheck)c=Math.min(100,c+5);
  const total=Math.round(l*.27+c*.28+cv*.20+r*.25),rank=total>=90?'ASESOR':total>=80?'DETECTOR':total>=68?'OBSERVADOR':'NOVATO';
  el('overall').textContent=total;el('sListen').textContent=l;el('sCriterion').textContent=c;el('sConversation').textContent=cv;el('sRecommendation').textContent=r;el('rank').textContent=rank;
  const w=[['ESCUCHA',l],['CRITERIO',c],['CONVERSACIÓN',cv],['RECOMENDACIÓN',r]].sort((a,b)=>a[1]-b[1])[0][0];
  const verdict={ESCUCHA:'Sabés decidir mejor de lo que todavía sabés descubrir. Hacé aparecer la información antes de cerrar.',CRITERIO:'Escuchás señales, pero falta convertirlas en una decisión más precisa.',CONVERSACIÓN:'La lectura está, pero algunas preguntas llegan antes de tiempo.',RECOMENDACIÓN:'Entendés al cliente; ahora afiná la acción final.'}[w];
  el('reviewImage').src=A('tiby-boss-review.jpg');el('verdict').textContent=`“${verdict}”`;save();show('final')
}
function review(){
  const labels={glutamine:'Glutamina',other:'Otra categoría',none:'Todavía no',ask:'Preguntar más',lost:'Cliente perdido'};
  el('reviewList').innerHTML=S.results.map((x,i)=>{const n=Math.round((x.scores.listen+x.scores.criterion+x.scores.conversation+x.scores.recommendation)/4);return `<div class="review-item"><div class="review-top"><strong>${String(i+1).padStart(2,'0')} · ${x.name}</strong><span class="review-score">${n}</span></div><p class="small">${labels[x.action]||x.action} · ${x.correct?'lectura correcta':'a revisar'}</p></div>`}).join('');show('review')
}
window.addEventListener('DOMContentLoaded',render);

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));}
