# PRE-PILOT Feedback Report V1.0

Este documento incorpora al sistema normativo los hallazgos cualitativos obtenidos de vendedores que probaron Pitbull Academy Core V1.1 PRE-PILOT.

## Qué quedó validado

- La propuesta de practicar situaciones de mostrador se entiende y genera interés.
- El formato breve es valorado: la experiencia se percibe como rápida y abordable.
- El uso desde celular funciona como contexto natural de consumo.
- La mecánica general conversación -> decisión -> resultado se comprende.
- El resultado final despierta interés, pero no debe convertirse en el centro pedagógico.
- Los usuarios perciben valor en disponer de múltiples situaciones distintas y en poder repetir la práctica sin memorizar un único guion.

## Hallazgos que requieren cambio

### 1. Conversación demasiado limitada
Se reportó que tanto las preguntas como las respuestas se sienten limitantes. El modelo de opciones fijas debe evolucionar hacia rutas conversacionales múltiples construidas sobre hechos descubiertos y estado de la visita.

### 2. Ambigüedad de redacción
Algunas intervenciones producen confusión de comprensión lectora. La dificultad de Academy debe provenir de interpretar al cliente, nunca de descifrar una formulación ambigua.

### 3. Replay poco válido
Un usuario señaló que repetir el mismo ejercicio permitiría recordar las respuestas. Repetir un módulo debe seguir midiendo la competencia, no la memoria del contenido.

### 4. Retroceso no explicado
Un usuario informó que su primer caso salió mal porque no sabía que no podía volver atrás. La navegación debe diferenciar explícitamente TRAINING MODE y EVALUATION MODE.

### 5. Compartir resultados inconsistente
El comportamiento de compartir varió entre computadora y celular; en algunos dispositivos la acción no produjo un resultado útil. COPIAR RESULTADO debe existir como fallback universal. SHARE es una capacidad adicional, no una dependencia crítica.

### 6. Densidad mobile
Algunas pantallas exigen demasiado scroll para una interacción que debería ser rápida. La UX debe favorecer una acción dominante por pantalla y reducir contenido introductorio no esencial.

### 7. Fondo oscuro
Una opinión describió el fondo negro como visualmente vacío. Esto no invalida la identidad oscura. Debe evaluarse profundidad tonal, superficies, textura sutil e integración visual de clientes antes de modificar el lenguaje de marca.

## Requisitos normativos derivados

### Conversation Naturalness Rule
Toda intervención debe sonar plausible en un mostrador real. Una frase, una intención principal. Las opciones deben diferenciarse semánticamente de forma clara.

### Replay Validity Rule
Una nueva ejecución no debe reducirse a recordar la solución anterior. El sistema debe soportar múltiples visitas, variantes o selecciones de visitas que preserven la competencia mientras cambia la situación.

### Visit Variability Requirement
Una competencia debe poder aparecer en situaciones distintas, con clientes distintos y mediante rutas de descubrimiento diferentes.

### Training vs Evaluation Navigation
TRAINING puede permitir corregir la última intervención o volver con una indicación pedagógica clara. EVALUATION registra la primera intervención y debe avisar antes de comenzar que las decisiones son definitivas.

### Share Fallback Requirement
El resultado siempre debe poder copiarse como texto. El uso de Web Share API u otros shares nativos es secundario.

### Mobile Density Rule
Cada pantalla debe perseguir una acción dominante. El contenido secundario debe comprimirse, plegarse o moverse a una capa de detalle cuando interfiera con la tarea principal.

## Lectura general
El PRE-PILOT valida la utilidad del concepto y señala que el principal límite del prototipo está en el modelo conversacional, no en la idea de producto. La evolución prioritaria es construir conversaciones comerciales variables, naturales y evaluables alrededor de personas persistentes y visitas cambiantes.

## Uso
Estos hallazgos deben ser tratados como requisitos de producto durante la auditoría y migración. No constituyen todavía evidencia psicométrica ni validación para decisiones de RR. HH.
