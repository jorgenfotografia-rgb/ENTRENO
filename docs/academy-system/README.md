# Pitbull Academy · System Specification

Este directorio contiene la dirección normativa actual de producto, pedagogía, contenido, UX y arquitectura para la evolución de Pitbull Academy.

## Orden de lectura
1. `00_PRODUCT_VISION.md`
2. `01_PEDAGOGICAL_SYSTEM.md`
3. `02_MASTER_CLIENT_CARD.md`
4. `03_MASTER_VISIT_CARD.md`
5. `04_SCORING_ENGINE.md`
6. `05_CURRICULUM_MODULE_SYSTEM.md`
7. `06_VISUAL_CLIENT_UNIVERSE.md`
8. `07_DATA_ARCHITECTURE.md`
9. `08_M01_REFERENCE_SPEC.md`
10. `09_MIGRATION_RULES.md`
11. `10_PILOT_FEEDBACK_V1.md`
12. `11_CONVERSATION_EDITORIAL_BIBLE.md`
13. `12_UX_FUNCTIONAL_RULES.md`

## Jerarquía
Cuando el comportamiento legacy contradiga estos documentos, debe tratarse como deuda de migración y no como definición del producto futuro.

Los hallazgos del PRE-PILOT forman parte de los requisitos de producto cuando han sido convertidos en reglas normativas dentro de estos documentos.

## Estado
- Product Vision: V1.0
- Pedagogical System: V1.0
- Master Client Card: V1.0
- Master Visit Card: V1.0
- Scoring Engine: V1.0 conceptual
- Curriculum / Module System: V1.1
- Visual Client Universe: V1.0
- Data Architecture: V1.0 target
- M01 Reference Spec: V2.0 con seis visitas canónicas y política de replay
- Migration Rules: V1.0
- PRE-PILOT Feedback: V1.0
- Conversation Editorial Bible: V1.0
- UX Functional Rules: V1.0

## Primer uso en Codex
La primera tarea debe ser una auditoría del repositorio SIN modificar código. El objetivo es comparar implementación actual vs especificación, identificar deuda técnica y proponer un plan de migración incremental y testeable.

Usar `CODEX_PHASE_0_PROMPT.md` para iniciar esa auditoría.
