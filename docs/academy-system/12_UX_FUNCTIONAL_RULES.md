# UX Functional Rules V1.0

Este documento define reglas funcionales de experiencia para Pitbull Academy. No reemplaza el sistema visual; establece cómo debe comportarse la aplicación.

## Principio mobile-first
La experiencia debe poder completarse cómodamente desde un teléfono. La unidad primaria de diseño es la pantalla móvil, no el escritorio reducido.

## Una acción dominante por pantalla
Cada pantalla debe tener una acción principal claramente identificable. Las acciones secundarias no deben competir visualmente con la tarea central.

## Densidad
Evitar scroll innecesario en pantallas de decisión o transición. El contenido explicativo extenso puede plegarse o vivir en capas secundarias.

El usuario no debe necesitar atravesar texto largo antes de empezar una práctica breve.

## Pantallas funcionales esperadas

### Home
Objetivo: continuar o iniciar entrenamiento y acceder a la biblioteca.
Debe mostrar progreso sin sobrecargar.

### Introducción de módulo
Objetivo: comprender en segundos qué competencia se va a entrenar.
Debe priorizar título, principio, máximo tres ideas clave y CTA.

### Mapa / selección de visita
Objetivo: identificar próximo cliente o visita disponible.
Debe comunicar progreso, bloqueo y revisión sin requerir explicación extensa.

### Presentación de visita
Objetivo: reconocer a la persona y recibir la situación inicial.
Debe separar información observable de cualquier información todavía oculta.

### Conversación
Objetivo: elegir la siguiente intervención.
Debe mantener contexto del cliente visible, conversación legible y opciones diferenciadas.
La respuesta más reciente debe quedar claramente visible después de cada acción.

### Decisión
Objetivo: decidir con la evidencia descubierta.
ASK_MORE o CLARIFY_REQUEST, cuando estén disponibles, deben distinguirse de decisiones terminales.

### Consecuencia
Objetivo: comprender qué produjo la decisión.
Orden recomendado: reacción del cliente -> lectura -> principio -> síntesis de score.

### Resultado
Objetivo: sintetizar desempeño y orientar siguiente práctica.
El score no debe sustituir la explicación del aprendizaje.

## TRAINING MODE
- Puede permitir corregir la última intervención o regresar cuando pedagógicamente sea útil.
- Debe hacer visible que el usuario está practicando.
- Puede ofrecer feedback intermedio breve.
- Una corrección no debe confundirse con la primera respuesta registrada si luego se compara desempeño.

## EVALUATION MODE
- Antes de empezar debe explicar que las intervenciones son definitivas.
- No debe sorprender al usuario con navegación irreversible no anunciada.
- No muestra feedback que revele la calidad de una respuesta durante la ejecución.

## Sharing
Siempre debe existir COPIAR RESULTADO como fallback confiable.

COMPARTIR puede invocar capacidades nativas del dispositivo cuando estén disponibles, pero la finalización de una sesión nunca debe depender de que el share sheet funcione.

El texto copiable debe ser compacto y consistente entre plataformas.

## Scroll y seguimiento conversacional
Después de una intervención, la aplicación debe llevar al usuario a la nueva respuesta sin esconder las opciones siguientes ni provocar saltos impredecibles.

No repetir una intervención ya utilizada salvo que la visita lo permita explícitamente por diseño.

## Prevención de doble acción
Los controles conversacionales deben protegerse contra doble tap o ejecución repetida mientras el estado está siendo actualizado.

## Progreso
El progreso visible debe derivar de una única fuente de verdad del engine. La capa visual nunca puede marcar una visita como completada por su cuenta.

## Continuidad
Cerrar, recargar o cambiar temporalmente de aplicación no debe duplicar preguntas ni corromper la visita activa. La recuperación del estado debe ser explícita y testeable.

## Identidad visual
El lenguaje oscuro/grafito puede mantenerse. Antes de sustituirlo por otro color, explorar profundidad tonal, contraste, jerarquía, superficies y presencia de personajes. El color de fondo no debe compensar problemas de densidad o arquitectura.

## Accesibilidad básica
- No bloquear zoom del navegador sin una razón justificada.
- Mantener targets táctiles amplios.
- No depender sólo del color para comunicar estado.
- Mantener contraste legible.
- Usar textos y estados accesibles para controles clave.

## Criterio de aceptación general
Si una persona necesita una explicación externa para entender cómo continuar, corregir, decidir o compartir, la interfaz debe revisarse antes de atribuir el problema al usuario.
