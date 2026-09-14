# Master Client Card V1.0

La ficha de cliente describe quién es la persona de manera relativamente estable. No contiene la lógica de una visita concreta.

## 00 · Identificación
- client_id
- name
- base_age
- occupation
- active_status
- recurrence
- visual_version

## 01 · Human Identity
- occupation
- work_type
- everyday_environment
- responsibilities
- time_availability
- organization_style
- central_human_trait

No incluir objetivos deportivos temporales.

## 02 · Sports Context
- primary_discipline
- secondary_discipline
- experience_level
- habitual_frequency
- habitual_schedule
- habitual_duration
- sports_history
- relationship_to_training
- regularity
- planning_level

## 03 · Commercial & Linguistic Profile
- supplementation_knowledge
- knowledge_precision
- dominant_vocabulary
- information_source
- request_style
- confidence_level
- question_tendency
- price_sensitivity
- brand_sensitivity
- promo_sensitivity
- technical_explanation_tolerance
- conversational_style

## 04 · Internal Visual Identity
- approximate_height
- weight_range
- contexture
- visual_muscle
- visual_adiposity
- body_distribution
- posture
- face_shape
- hair
- facial_hair
- glasses
- distinguishing_traits
- usual_style
- visual_age

Regla: la morfología no determina automáticamente necesidad ni recomendación.

## 05 · Recognition Matrix
Tres anclas relativamente estables:
- facial_anchor
- distinctive_anchor
- body_presence_anchor

Elementos variables: ropa, accesorios, expresión, peinado circunstancial.

## 06 · Relationship with Store
- initial_relationship_level
- visit_frequency
- recurrence_probability
- buys_for_self
- buys_for_third_parties
- third_party_types
- expected_familiarity
- loyalty_type

Niveles: N0 UNKNOWN, N1 FAMILIAR FACE, N2 KNOWN CLIENT, N3 HABITUAL CLIENT.

## 07 · Commercial Memory
Tipos: identity, name, stable, sports, historical, relational.
Cada registro debe clasificarse STABLE, TEMPORARY o TO_CONFIRM.

## 08 · Purchase Recipient Capability
La ficha registra patrones posibles de compra, pero el destinatario real pertenece a cada visita: SELF, THIRD_PARTY, UNKNOWN o MIXED.

## 09 · Visual Representations
- FACE ID
- BODY ID
- ACADEMY CANON
- visit-specific visuals

## 10 · Visits
La ficha referencia visitas por ID. La situación detallada vive en MASTER VISIT CARD.
