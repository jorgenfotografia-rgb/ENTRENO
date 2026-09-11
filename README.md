# PITBULL ACADEMY · CORE V1

PWA mobile-first para entrenamiento comercial de vendedores de suplementación.

## Definición de producto
Pitbull Academy es la plataforma interna de formación comercial de Pitbull Suplementos. La plataforma no pertenece a una marca de suplementos específica: las marcas, categorías y productos funcionan como contenido variable dentro de Academy.

## Principios
- Academy es el sistema estable.
- Las marcas y productos son contenido multimarca.
- Los módulos entrenan competencias comerciales, no catálogos de producto.
- El flujo principal es: cliente → investigar → decidir → consecuencia → aprendizaje.
- Tiby The Boss aparece sólo en momentos de alto valor: Boss Check y Boss Review.
- Incorporar un producto a la biblioteca no equivale a aprobar su información técnica para entrenamiento.

## Academy Core V1
- Home generalizada: deja de presentarse como una experiencia centrada en Glutamina.
- El progreso superior sólo aparece dentro de un módulo; Home y Biblioteca pertenecen al nivel general de Academy.
- Biblioteca multimarca con registro separado de marcas y productos.
- Filtro por marca preparado para escalar cuando ingresen nuevas marcas.
- Fichas de producto separan datos de catálogo de control informativo.
- Registro de fuentes para distinguir referencias de catálogo de fuentes técnicas auditadas.
- Registro de módulos independiente de productos.
- Motor de decisiones generalizado con acciones reutilizables: preguntar más, recomendar producto, orientar a otra categoría o no suplementar todavía.
- Estado de progreso separado por módulo y migración automática del progreso previo de M01.
- M01 Glutamina se conserva como primer módulo activo, no como arquitectura de la aplicación.

## Arquitectura
- `index.html` — shell de Academy y pantallas.
- `styles.css` — sistema visual base.
- `core-v1.css` — capa de interfaz general / multimarca.
- `app.js` — navegación, persistencia, motor de módulos, scoring y biblioteca.
- `data/brands.js` — registro de marcas.
- `data/products.js` — catálogo de productos sin lógica pedagógica.
- `data/modules.js` — competencias, acciones y relaciones módulo-producto.
- `data/sources.js` — registro y rol de las fuentes.
- `data/scenarios/m01.js` — configuración del escenario M01 y Boss Check.
- `data/clients.js` — dataset conversacional heredado de M01; se mantiene como capa compatible durante la migración.
- `manifest.webmanifest` + `service-worker.js` — instalación PWA y caché offline.
- `assets/` — producto, Tiby, iconos y sistema visual de clientes.

## Biblioteca actual
La primera carga contiene productos Pitbull Suplementos obtenidos como base de catálogo desde Nutribull. La arquitectura permite incorporar Star Nutrition, ENA, Optimum Nutrition, BSN u otras marcas sin modificar el motor de Academy.

## Control informativo
Flujo objetivo para contenido formativo:
`FUENTE → AUDITORÍA → CONTENIDO ACADEMY → QA → PUBLICADO`

Las fuentes tipo retailer pueden servir para inventario, presentación, sabores e imágenes. Claims, funciones, recomendaciones y criterios de uso deben pasar por auditoría documental antes de convertirse en material formativo definitivo.

## M01
`Detectá la oportunidad` continúa siendo el único módulo activo. Utiliza Glutamina como producto de referencia para entrenar detección de necesidad, cambio de categoría y reconocimiento de bases insuficientes.

## Persistencia
El progreso se guarda localmente por dispositivo. Core V1 migra automáticamente el progreso histórico del módulo inicial al nuevo esquema `moduleProgress`, evitando reiniciar el avance de los usuarios existentes.

## URL
`https://jorgenfotografia-rgb.github.io/pitbull-academy/`

## Archivo ENTRENO
La última versión del proyecto anterior se conserva en la rama `archive-entreno-v0.3`.
