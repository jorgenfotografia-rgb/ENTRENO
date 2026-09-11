window.MODULES=[
  {
    id:'m01',code:'M01',status:'active',contentStatus:'prepilot-reviewed',scenarioId:'m01',
    title:'Detectá la oportunidad.',
    subtitle:'Aprendé a identificar cuándo un producto puede entrar en la conversación, cuándo conviene cambiar de categoría y cuándo todavía no corresponde suplementar.',
    competence:'Detección de oportunidad',
    route:'Criterio comercial',
    productIds:['glutamina-300g'],
    technicalSourceIds:['glutamine-review-2026','jissn-ultra-2019'],
    clientCount:6,
    trainingPoints:[
      'Escuchar antes de recomendar.',
      'Separar objetivo de producto.',
      'Reconocer cuándo un producto puede entrar en la conversación sin volverlo una respuesta automática.',
      'Reconocer cuándo cambiar de categoría o cuándo todavía no ofrecer.'
    ],
    decisionActions:[
      {id:'ASK_MORE',label:'PREGUNTAR MÁS',hint:'Todavía necesito contexto.'},
      {id:'RECOMMEND_PRODUCT',labelFromProduct:true,prefix:'EVALUAR ',hint:'Puede tener lugar como complemento; no es una respuesta automática.'},
      {id:'RECOMMEND_CATEGORY',label:'OTRA CATEGORÍA',hint:'El objetivo apunta a otro tipo de solución.'},
      {id:'DEFER_SUPPLEMENT',label:'TODAVÍA NO',hint:'Primero hay una base que resolver.'}
    ]
  }
];
