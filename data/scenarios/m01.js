(()=>{
  window.SCENARIOS=window.SCENARIOS||{};
  const mapAction={glutamine:'RECOMMEND_PRODUCT',other:'RECOMMEND_CATEGORY',none:'DEFER_SUPPLEMENT',ask:'ASK_MORE'};
  window.SCENARIOS.m01={
    id:'m01',
    clients:(window.CLIENTS||[]).map((c,i)=>({...c,answer:mapAction[c.answer]||c.answer,bossChallenge:i===5})),
    bossCheck:{
      afterCaseIndex:2,
      image:'tiby-boss-check.webp',
      title:'Lectura rápida.',
      prompt:'Duermo cuatro horas, entreno seis días y ya tomo whey + creatina. ¿Me sumás glutamina para recuperar?',
      options:[
        {text:'Primero necesito entender el descanso y la recuperación.',correct:true},
        {text:'Sí. Sumemos glutamina.',correct:false},
        {text:'Mejor agregaría otro suplemento.',correct:false}
      ],
      result:{
        goodTitle:'Bien leído.',
        badTitle:'Demasiado rápido.',
        goodText:'Dormir cuatro horas obliga a mirar primero la base antes de sumar un producto.',
        badText:'La carga de entrenamiento no convierte automáticamente a un suplemento en la respuesta cuando aparece una base claramente comprometida.'
      }
    }
  };
})();
