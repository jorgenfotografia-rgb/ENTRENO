(()=>{
  window.SCENARIOS=window.SCENARIOS||{};
  const mapAction={glutamine:'RECOMMEND_PRODUCT',other:'RECOMMEND_CATEGORY',none:'DEFER_SUPPLEMENT',ask:'ASK_MORE'};
  const pilotVisual='assets/client-ref-camila.svg';
  const overrides={
    tomas:{reaction:{good:'Sí, ahora entiendo por qué puede entrar en la conversación. Quiero saber qué lugar tendría dentro de lo que ya hago.',early:'Puede ser una opción, pero todavía no me queda claro por qué la evaluarías en mi caso.',bad:'No sé… siento que todavía no entendimos bien lo que estoy buscando.'},explain:'El contexto permite evaluar glutamina como complemento, pero no convertirla en una recomendación automática. La evidencia sobre recuperación y rendimiento en personas activas es heterogénea; primero importa entender carga, objetivo y bases.'},
    matias:{reaction:{good:'Ahí sí me cierra: no por estar en definición, sino porque primero entendiste mi carga y lo que quiero resolver.',early:'Puede ser una opción, pero todavía siento que faltó entender mejor mi situación.',bad:'No me queda claro por qué eso responde a lo que te conté.'},explain:'La definición por sí sola no justifica el producto. Con carga elevada, recuperación como preocupación y bases planificadas, la glutamina puede evaluarse como complemento, sin asumir un beneficio garantizado.'},
    federico:{reaction:{good:'Bien. Entiendo que la estás evaluando por mi contexto y no sólo porque quiero sumar algo.',early:'Puede ser, pero esperaba que conectaras mejor la opción con mi preparación.',bad:'No me convence. Siento que estás generalizando.'},explain:'Hay una necesidad explícita de recuperación, alta carga y bases cubiertas. Eso habilita a evaluar un complemento; no convierte a la glutamina en una recomendación rutinaria ni garantiza mejorar rendimiento o recuperación.'}
  };

  window.SCENARIOS.m01={
    id:'m01',
    clients:(window.CLIENTS||[]).map((c,i)=>{const extra=overrides[c.id]||{};return {...c,...extra,visual:{face:pilotVisual,encounter:pilotVisual,chat:pilotVisual,reaction:pilotVisual},reaction:{...c.reaction,...(extra.reaction||{})},answer:mapAction[c.answer]||c.answer,bossChallenge:i===5};}),
    bossCheck:{afterCaseIndex:2,image:'tiby-boss-check.webp',title:'Lectura rápida.',prompt:'Duermo cuatro horas, entreno seis días y ya tomo whey + creatina. ¿Me sumás glutamina para recuperar?',options:[{text:'Primero necesito entender el descanso y la recuperación.',correct:true},{text:'Sí. Sumemos glutamina.',correct:false},{text:'Mejor agregaría otro suplemento.',correct:false}],result:{goodTitle:'Bien leído.',badTitle:'Demasiado rápido.',goodText:'Dormir cuatro horas obliga a mirar primero la base antes de evaluar otro producto.',badText:'La carga de entrenamiento no convierte automáticamente a un suplemento en la respuesta cuando aparece una base claramente comprometida.'}}
  };

  // PRE-PILOT V1.1.8 · VISUAL CLIENT PILOT.
  // La capa visual no interviene en el motor de conversación.
  window.addEventListener('DOMContentLoaded',()=>{
    const baseCommit=window.commit;
    const clientVisual=(c,kind='face')=>c?.visual?.[kind]||c?.visual?.face||A(`${c.id}.svg`);
    window.clientVisual=clientVisual;
    window.setPhoto=function(id,c,kind='face'){const node=el(id);if(!node||!c)return;node.src=clientVisual(c,kind);node.alt=`${c.name} · referencia visual piloto`};

    const clientList=el('clientList');
    if(clientList&&!el('visualPilotNote')){
      const note=document.createElement('div');
      note.id='visualPilotNote';
      note.className='visual-pilot-note';
      note.innerHTML='<strong>VISUAL PILOT</strong><span>La misma referencia de Camila se usa temporalmente en todos los clientes para validar la experiencia visual.</span>';
      clientList.parentNode.insertBefore(note,clientList);
    }

    const decisionList=el('decisionList');
    if(decisionList&&!el('decisionPerson')){
      const person=document.createElement('div');
      person.id='decisionPerson';
      person.className='decision-person';
      person.innerHTML='<img id="decisionAvatar" class="client-photo decision-photo" alt=""><div><span>CLIENTE EN CURSO</span><strong id="decisionName"></strong><small id="decisionLabel"></small></div>';
      decisionList.parentNode.insertBefore(person,decisionList);
    }

    window.renderMap=function(){
      const m=activeModule(),clients=C(),p=MP();if(!m||!el('clientList'))return;updateMeter();
      el('mapMeta').textContent=`SIMULADOR · ${clients.length} CASOS`;
      el('clientList').innerHTML=clients.map((c,i)=>{
        const done=p.completed.includes(i),unlocked=i<=p.completed.length;
        const action=done?`reviewCompletedCase(${i})`:`startClient(${i})`;
        return `<button class="cast-item ${done?'is-complete':''}" ${unlocked?'':'disabled'} onclick="${action}">
          <img class="client-photo" src="${clientVisual(c,'face')}" alt="${c.name} · referencia visual piloto">
          <div><span class="num">${String(i+1).padStart(2,'0')} · ${done?'COMPLETADO':'CLIENTE'}</span><strong>${c.name}</strong><span class="small">${c.label}${!done&&c.bossChallenge?' · Boss Challenge':''}</span>${done?'<span class="review-tag">REVISAR CASO</span>':''}</div>
          <span class="arrow">${done?'✓':unlocked?'→':'·'}</span>
        </button>`;
      }).join('');
    };

    const commitAfterConsequence=()=>{
      const p=MP(),o=p.pending;if(!o)return;
      if(o.unlockAt&&Date.now()<o.unlockAt)return;
      baseCommit();
    };
    window.commitAcademyDecision=commitAfterConsequence;

    window.renderReaction=function({scroll=true}={}){
      const p=MP(),c=current(),o=p.pending;
      if(!o){renderMap();show('map',{scroll});return}
      setPhoto('reactAvatar',c,'reaction');
      el('reactName').textContent=c.name;
      el('clientLine').textContent=`“${o.copy}”`;
      el('learning').className=`learning ${o.strength}`;
      el('resultTitle').textContent=o.title;
      el('resultNote').textContent=o.note;
      el('learnText').textContent=c.explain;
      const next=el('reactionNext');
      next.onclick=commitAfterConsequence;
      next.disabled=true;
      next.innerHTML='<span>CONTINUAR</span><span>→</span>';
      show('reaction',{scroll});
      const wait=Math.max(0,(o.unlockAt||Date.now())-Date.now());
      window.setTimeout(()=>{if(MP().pending===o)next.disabled=false},wait);
    };

    const runDecision=action=>{
      if(action==='ASK_MORE'){tap();renderChat({scroll:true});return}
      tap();
      const p=MP(),c=current();if(!c)return;
      const sc=calc(action),correct=action===c.answer,turns=(p.chat||[]).filter(x=>x.who==='you').length,enough=sc.listen>=67;
      let strength,title,note,copy;
      if(turns===0){
        sc.listen=0;sc.criterion=correct?55:20;sc.recommendation=correct?45:15;
        strength=correct?'mid':'bad';
        title=correct?'Dirección posible, sin contexto':'Decidiste demasiado pronto';
        note=correct?'La acción podría alinearse con el objetivo, pero llegaste a ella sin hacer una sola pregunta.':'Elegiste una acción antes de entender qué estaba intentando resolver el cliente.';
        copy=correct?c.reaction.early:c.reaction.bad;
      }else if(correct&&enough&&sc.conversation>=55){strength='good';title='Buena lectura';note='La acción coincide con el contexto que construiste.';copy=c.reaction.good}
      else if(correct&&!enough){strength='mid';title='Buena dirección, demasiado pronto';note='La acción puede tener sentido, pero todavía faltaba contexto.';copy=c.reaction.early}
      else{strength='bad';title='Revisá la lectura';note='La acción no responde bien al objetivo que venía mostrando.';copy=c.reaction.bad}
      p.pending={action,sc,correct,strength,title,note,copy,unlockAt:Date.now()+700};
      p.lostPending=null;save();renderReaction();
    };

    window.academyDecision=runDecision;
    window.decide=runDecision;
    window.renderDecision=function(){
      const m=activeModule(),c=current();
      if(c){setPhoto('decisionAvatar',c,'face');el('decisionName').textContent=c.name;el('decisionLabel').textContent=c.label}
      const actions=m?.decisionActions||[];
      el('decisionList').innerHTML=actions.map(a=>`<button type="button" class="decision" onclick="event.preventDefault();event.stopPropagation();academyDecision('${a.id}');return false"><b>${actionLabel(a)}</b><span>${a.hint}</span></button>`).join('');
    };
  });
})();