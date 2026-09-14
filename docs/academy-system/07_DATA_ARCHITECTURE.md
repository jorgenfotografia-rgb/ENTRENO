# Data Architecture V1.0

## Objetivo
Separar responsabilidades para que contenido, estado, catálogo, visuales y motor puedan evolucionar sin pisarse entre sí.

## Capas obligatorias
### CLIENTS
Personas permanentes. Contiene identidad humana, deportiva, comercial, lingüística, visual y relación con el local.

### VISITS
Situaciones temporales. Contiene apertura, contexto del día, facts, topics, intervenciones disponibles, readiness, acciones y memoria generada.

### MODULES
Currículum y competencias. Define qué se entrena, prerrequisitos, dificultad y qué visitas forman parte de cada módulo.

### CATALOG
Marcas, productos, categorías, ingredientes, formatos, aliases, nombres técnicos, customer terms y fuentes/auditoría.

### ENGINE
Única capa autorizada para controlar:
- navegación pedagógica;
- estado de conversación;
- facts descubiertos;
- topics abiertos;
- readiness;
- scoring;
- consecuencias;
- progreso;
- persistencia;
- memoria comercial.

### VISUALS
Identidades, imágenes y variantes de visita. Sólo presentación.

## Fuente de verdad
Debe existir una única fuente de verdad para el estado de una sesión. Evitar múltiples objetos normalizados/reemplazados durante una misma mutación.

## Regla de mutación
Las funciones de lectura no deben reemplazar o mutar silenciosamente el objeto de progreso. Las mutaciones deben ser explícitas, controladas y testeables.

## Separación de contenido y motor
Los archivos de escenario/visita no deben redefinir funciones globales del engine ni monkey-patchear renderers o handlers.

Los datos describen qué puede suceder. El engine decide cómo ejecutarlo.

## Terminología de catálogo
Los productos deben poder mapear:
- aliases
- synonyms
- ingredients
- technical_names
- customer_terms
- category_terms

Distinguir equivalencia exacta de relación ingrediente→producto. Un ingrediente puede pertenecer a múltiples productos.

## Estado persistente
La persistencia debe estar versionada y tener migraciones explícitas. Debe soportar reset controlado y evitar que datos legacy corrompan estados nuevos.

## Tests mínimos del engine
- inicio de visita;
- primera respuesta visible;
- una intervención sólo se procesa una vez;
- avance de estado;
- persistencia y recarga;
- decision readiness;
- consecuencia;
- completitud;
- reset;
- migración de storage;
- independencia de la capa visual.

## Service Worker
El cache no debe enmascarar despliegues ni impedir actualizar código. Versionar caches y probar estrategia de actualización.
