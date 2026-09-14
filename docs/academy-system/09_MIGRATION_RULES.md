# Migration Rules V1.0

## Objetivo
Migrar Pitbull Academy desde el prototipo actual hacia la arquitectura pedagógica V1.0 sin perder estabilidad ni UX útil.

## Orden obligatorio
1. Auditar.
2. Estabilizar engine y estado.
3. Separar responsabilidades.
4. Agregar tests.
5. Introducir nuevo modelo de datos.
6. Migrar M01.
7. Expandir visuales y currículum.

## Antes de modificar
Codex debe leer todo `/docs/academy-system/` y revisar el repositorio actual completo.

## Conservar cuando aporte valor
- identidad visual general;
- navegación y jerarquía útiles;
- Biblioteca como concepto;
- mapa secuencial de visitas si sigue siendo compatible;
- consecuencia y revisión final;
- persistencia local mientras no exista backend;
- activos visuales y contenido que puedan migrarse.

## Reemplazar o refactorizar
- lógica de engine dentro de archivos de escenario;
- monkey patches de funciones globales;
- árbol conversacional rígido como modelo definitivo;
- scoring binario basado sólo en answer === action;
- acoplamiento entre visuales y estado pedagógico;
- normalización que sustituya referencias de estado durante una mutación;
- resets temporales de debugging como solución permanente;
- service worker que dificulte comprobar despliegues.

## Restricciones
- No hacer una reescritura total sin justificarla.
- Preferir migración incremental y reversible.
- No cambiar simultáneamente engine, modelo pedagógico y diseño visual si puede evitarse.
- No inventar comportamiento pedagógico ausente de la especificación.
- No convertir supuestos en requisitos sin señalarlos.

## Fase 0 · Auditoría
Sin cambios de código. Entregar:
- mapa de arquitectura actual;
- flujo real de estado y persistencia;
- responsabilidades mezcladas;
- deuda técnica;
- regresiones conocidas y causas probables;
- riesgos de service worker/cache;
- código reutilizable;
- propuesta de arquitectura destino;
- plan incremental por fases;
- estrategia de tests.

## Fase 1 · Estabilización
Objetivo: que el prototipo actual sea confiable antes de migrarlo.
- una sola fuente de verdad para progreso;
- handlers estables;
- conversación sin duplicados;
- persistencia predecible;
- cache actualizable;
- tests básicos.

No migrar aún el nuevo currículum.

## Fase 2 · Separación
Extraer responsabilidades en módulos claros: engine, state/persistence, clients, visits, modules, catalog y visuals.

## Fase 3 · Nuevo modelo
Implementar facts, topics, readiness, memory, terminology mapping y score ledger sin cambiar innecesariamente la UX.

## Fase 4 · M01
Migrar M01 a Master Visit Card y Scoring Engine V1.0 usando `08_M01_REFERENCE_SPEC.md` y las visitas definitivas.

## Criterio de aceptación
Cada fase debe dejar el repositorio ejecutable, testeable y más simple de razonar que antes.
