window.MODULES=[
  {
    id:'m01',code:'M01',status:'active',contentStatus:'provisional',scenarioId:'m01',
    title:'Detectá la oportunidad.',
    subtitle:'Aprendé a identificar cuándo un producto puede responder al objetivo del cliente, cuándo conviene cambiar de categoría y cuándo todavía no corresponde suplementar.',
    competence:'Detección de oportunidad',
    route:'Criterio comercial',
    productIds:['glutamina-300g'],
    clientCount:6,
    trainingPoints:[
      'Escuchar antes de recomendar.',
      'Separar objetivo de producto.',
      'Reconocer cuándo cambiar de categoría.',
      'Reconocer cuándo todavía no ofrecer.'
    ],
    decisionActions:[
      {id:'ASK_MORE',label:'PREGUNTAR MÁS',hint:'Todavía necesito contexto.'},
      {id:'RECOMMEND_PRODUCT',labelFromProduct:true,hint:'La necesidad puede responder al producto de referencia.'},
      {id:'RECOMMEND_CATEGORY',label:'OTRA CATEGORÍA',hint:'El objetivo apunta a otro tipo de solución.'},
      {id:'DEFER_SUPPLEMENT',label:'TODAVÍA NO',hint:'Primero hay una base que resolver.'}
    ]
  }
];
