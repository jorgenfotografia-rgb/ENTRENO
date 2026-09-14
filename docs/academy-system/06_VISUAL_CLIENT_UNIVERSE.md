# Visual Client Universe V1.0

## Propósito
La imagen del cliente tiene función pedagógica: reconocimiento, continuidad, memoria y contexto observable. No es decoración.

## Sistema visual por cliente
### FACE ID
Rostro y hombros. Identidad neutral y consistente.

### BODY ID
Cuerpo completo. Morfología plausible y coherente con la ficha interna.

### ACADEMY CANON
Representación principal dentro de la aplicación, con personalidad y contexto sin caer en estilización publicitaria.

### VISIT VISUALS
Variaciones controladas de una misma identidad según visita: ropa, expresión, accesorios y contexto.

## Dirección estética
- Realismo fotográfico documental-comercial.
- Personas que podrían entrar al local mañana.
- Luz naturalista o de estudio discreto.
- Imperfecciones normales y cuerpos plausibles.
- Ropa cotidiana.
- Evitar estética de publicidad fitness o casting de modelos.

## Identity Lock
Una vez aprobada la identidad de un cliente, los rasgos faciales centrales deben permanecer estables entre visitas. La continuidad visual tiene prioridad sobre la novedad estética.

## Recognition Matrix
Cada cliente debe tener tres anclas relativamente estables:
- facial;
- distintiva;
- corporal/presencia.

Ropa, accesorios y expresión son variables y no deberían cargar por sí solos con el reconocimiento.

## Regla crítica
La apariencia nunca debe transformarse automáticamente en una inferencia de necesidad, objetivo, salud, disciplina o producto. Puede motivar una pregunta; no puede sustituir la confirmación.

## Relación y reconocimiento
- N0 UNKNOWN: primera visita.
- N1 FAMILIAR FACE: se espera reconocer que ya vino.
- N2 KNOWN CLIENT: puede esperarse recuerdo de cierto contexto.
- N3 HABITUAL CLIENT: puede esperarse reconocimiento de nombre y algunos datos estables.

## Arquitectura
La capa visual puede leer estado para saber qué mostrar, pero no debe modificar progreso, conversación, scoring ni memoria. VISUALS es una dependencia de presentación, no una fuente de verdad pedagógica.

## Método de producción recomendado
Generar un cliente por vez:
1. FACE ID
2. BODY ID basado en FACE ID
3. ACADEMY CANON basado en FACE + BODY
4. aprobar IDENTITY LOCK
5. generar VISIT VISUALS

No usar paneles compuestos como fuente canónica final.
