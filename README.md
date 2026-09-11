# PITBULL ACADEMY · PRODUCT QUALITY PASS 03

PWA mobile-first para entrenamiento comercial de vendedores de suplementación.

## Principio de producto
- Academy es el sistema estable.
- Las marcas y productos viven como contenido variable dentro de cada módulo.
- La interfaz prioriza claridad, jerarquía y sensación de app antes que recursos de campaña.
- Tiby The Boss aparece sólo en momentos de alto valor: Boss Check y Boss Review.

## Quality Pass 03
- Pantalla 00 de acceso integrada: `PITBULL ACADEMY → ENTRAR`.
- La portada vuelve a aparecer al abrir o reabrir Academy; al tocar `ENTRAR` se recupera exactamente el punto guardado del usuario.
- El progreso local sigue siendo individual por dispositivo mediante `localStorage`.
- El encabezado de cada caso pasa a `CASO XX DE 06`, separando el caso actual del progreso completado del módulo.
- `RESOLVER CASO · cuando estés listo` se reemplaza por una acción siempre disponible: `RESOLVER AHORA →`.
- Tras dos intervenciones, la acción escala visualmente a `TOMAR DECISIÓN →`.
- La conversación deja de saltar al inicio después de cada respuesta y acompaña automáticamente el último intercambio.
- Se mantiene intacto el scoring y la lógica pedagógica.
- Caché PWA actualizado para instalaciones existentes.

## Quality Pass 02
- Packshot restaurado en la ficha de producto.
- Indicador superior convertido en progreso real del módulo (0/6 → 6/6).
- Sistema visual de clientes reemplaza las iniciales provisionales por avatares vectoriales consistentes.
- Estados bloqueado / activo / completado refinados para conservar legibilidad.
- Corrección de microtipografía en la pantalla de consecuencia.
- Touch targets y estados de foco mejorados.

## Arquitectura
- `index.html` — shell de la app + pantalla 00
- `styles.css` — sistema visual
- `app.js` — navegación, persistencia y scoring
- `data/module.js` — módulo / producto actual
- `data/clients.js` — casos y árboles conversacionales
- `manifest.webmanifest` + `service-worker.js` — instalación PWA y caché offline
- `assets/` — producto, Tiby, iconos y sistema visual de clientes

## Renombrado del repositorio
El proyecto está preparado para migrar de `ENTRENO` a `pitbull-academy`. El manifest usa `start_url` y `scope` relativos (`./`), por lo que no depende de la ruta anterior.

URL objetivo después del renombrado:
`https://jorgenfotografia-rgb.github.io/pitbull-academy/`

## Estado de contenido
El contenido técnico de Glutamina continúa siendo provisional. La auditoría documental se realizará antes de convertir el módulo en material formativo definitivo.

## Archivo ENTRENO
La última versión del proyecto anterior se conserva en la rama `archive-entreno-v0.3`.
