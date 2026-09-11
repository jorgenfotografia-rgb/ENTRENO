# PITBULL ACADEMY · PRODUCT QUALITY PASS 02

PWA mobile-first para entrenamiento comercial de vendedores de suplementación.

## Principio de producto
- Academy es el sistema estable.
- Las marcas y productos viven como contenido variable dentro de cada módulo.
- La interfaz prioriza claridad, jerarquía y sensación de app antes que recursos de campaña.
- Tiby The Boss aparece sólo en momentos de alto valor: Boss Check y Boss Review.

## Quality Pass 02
- Packshot restaurado en la ficha de producto.
- Indicador superior convertido en progreso real del módulo (0/6 → 6/6).
- Sistema visual de clientes reemplaza las iniciales provisionales por avatares vectoriales consistentes.
- Estados bloqueado / activo / completado refinados para conservar legibilidad.
- Corrección de microtipografía en la pantalla de consecuencia.
- Touch targets y estados de foco mejorados.
- Gameplay y scoring se mantienen sin cambios.
- Caché PWA actualizado para distribuir los nuevos recursos en instalaciones existentes.

## Arquitectura
- `index.html` — shell de la app
- `styles.css` — sistema visual
- `app.js` — navegación, persistencia y scoring
- `data/module.js` — módulo / producto actual
- `data/clients.js` — casos y árboles conversacionales
- `manifest.webmanifest` + `service-worker.js` — instalación PWA y caché offline
- `assets/` — producto, Tiby, iconos y sistema visual de clientes

## Estado de contenido
El contenido técnico de Glutamina continúa siendo provisional. La auditoría documental se realizará antes de convertir el módulo en material formativo definitivo.

## Archivo ENTRENO
La última versión del proyecto anterior se conserva en la rama `archive-entreno-v0.3`.
