# Scoring Engine V1.0

La puntuación comienza con la primera interacción, no con la decisión final.

## Métricas visibles
### ESCUCHA
Mide el valor de la información relevante descubierta, no la cantidad de preguntas.

### LECTURA
Mide qué tan bien interpretó el vendedor lo descubierto: necesidad, categoría, contradicciones, vocabulario y contexto.

### CONVERSACIÓN
Mide relevancia, timing, rapport, redundancia, eficiencia y riesgo de asumir.

### DECISIÓN
Mide la calidad de la acción final respecto del contexto disponible.

## Principio de ponderación
Propuesta inicial:
- Escucha: 25%
- Lectura: 30%
- Conversación: 20%
- Decisión: 25%

Lectura tiene mayor peso porque sintetiza el objetivo central de Academy.

## Hechos ponderados
Los hechos pueden tener distinto peso. Descubrir destinatario u objetivo puede valer más que descubrir preferencia de sabor o presupuesto.

## Calidad de decisión
Una acción puede clasificarse como:
- Excelente: apropiada y bien fundamentada.
- Aceptable: razonable con información secundaria faltante.
- Prematura: potencialmente correcta pero insuficientemente fundamentada.
- Incorrecta: no responde al contexto.

## Penalizaciones de alta importancia
Ejemplos:
- asumir destinatario;
- ignorar un dato clave ya descubierto;
- inferir necesidad a partir de apariencia física;
- afirmar propiedades no respaldadas por el catálogo auditado;
- recomendar sin comprender la necesidad;
- insistir con suplementación cuando otra base requiere prioridad.

Una penalización importante puede limitar la calificación máxima de la visita aunque la acción final resulte acertada.

## Conductas positivas
El motor puede reconocer internamente:
- verify_before_assume
- efficient_discovery
- terminology_translation
- memory_used_well
- correct_restraint

No tienen que mostrarse siempre como medallas.

## Evidencia del score
Todo score debe ser auditable. El engine debe poder conservar un ledger de eventos que explique el resultado, por ejemplo:
- hecho relevante descubierto;
- intervención pertinente;
- información repetida;
- supuesto no verificado;
- traducción correcta;
- decisión fundamentada.

No implementar números mágicos imposibles de rastrear.

## Feedback
La consecuencia pedagógica debe priorizar:
1. respuesta/reacción del cliente;
2. lectura de lo que ocurrió;
3. principio transferible;
4. score como síntesis, no como explicación principal.

## Estado
V1.0 es un modelo pedagógico, no una escala psicométricamente validada para decisiones de RR. HH.
