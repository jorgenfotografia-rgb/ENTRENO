# Master Visit Card V1.0

La visita describe qué sucede hoy con un cliente permanente.

CLIENTE PERMANENTE + VISITA TEMPORAL + ESTADO DE CONOCIMIENTO DEL VENDEDOR

## Identificación
Campos base: visit_id, client_id, module_id, visit_number, difficulty, mode, relationship_level y chronology_index.

## Situación de entrada
Campos: opening_line, visible_context, initial_mood, stated_request, requested_term, initial_confidence e initial_information_level.

Regla: el pedido declarado no equivale automáticamente a la necesidad.

## Comprador y usuario final
Separar buyer de end_user. El destinatario de cada visita puede ser SELF, THIRD_PARTY, UNKNOWN o MIXED. El motor puede conocer este dato antes que el vendedor, pero debe mantenerlo oculto hasta que sea descubierto.

## Hechos de la visita
Cada hecho debe incluir id, type, importance, known_at_start, discoverable_by, required_for_decision y memory_after_visit.

Tipos:
- STABLE: dato relativamente estable.
- TEMPORARY: válido para esta visita o etapa.
- CRITICAL: debe confirmarse antes de determinadas decisiones.
- CONTEXTUAL: mejora la lectura sin ser siempre obligatorio.

## Intervenciones
Cada intervención del vendedor puede registrar: id, text, topics, relevance, timing rules, discovery value, relationship effect, assumption risk, reveals, opens_topics, closes_topics y client_response.

La calidad de una pregunta depende del estado de la conversación, no sólo del texto de la pregunta.

## Estado conversacional
La arquitectura definitiva no debe depender de un árbol rígido start/deep/last. El estado se construye desde discovered_facts, used_interventions, open_topics, relationship_state, rapport y decision_readiness.

Un mismo hecho puede descubrirse por distintas rutas naturales.

## Topics
Ejemplos: recipient, goal, training, diet, recovery, energy, experience, budget, product, brand, ingredient.

## Condiciones para decidir
Una acción se evalúa en función de la información disponible. Recomendar una categoría puede requerir recipient + goal; recomendar un producto concreto puede exigir además basic_context.

## Acciones comunes
ASK_MORE, CLARIFY_REQUEST, RECOMMEND_CATEGORY, RECOMMEND_PRODUCT, DEFER_SUPPLEMENT y REFER_PROFESSIONAL.

ASK_MORE no cierra la visita.

## Consecuencia
Debe derivar de la acción, los hechos descubiertos, la calidad del recorrido y el nivel de relación. Una misma acción puede resultar bien fundamentada, aceptable, prematura o inadecuada según el contexto.

## Memoria generada
Cada visita puede producir registros con memory_type, memory_value, confidence y status (STABLE, TEMPORARY o TO_CONFIRM).

Regla: recordar sirve para preguntar mejor; nunca para asumir.
