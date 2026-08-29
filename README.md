# ENTRENO V0.3

PWA funcional del proyecto **ENTRENO**.

## Qué cambia en V0.3

- El objetivo semanal deja de ser fijo.
- En el primer uso, cada persona elige **2, 3, 4, 5 o 6 entrenamientos por semana**.
- El objetivo queda guardado en `localStorage` y puede modificarse desde **Opciones**.
- Los entrenamientos y puntos de V0.1/V0.2 se conservan.
- La racha deja de medir días consecutivos y pasa a medir **semanas consecutivas en las que se cumplió el objetivo elegido**.
- Se mantienen los **100 puntos** por completar el objetivo semanal.
- La recompensa de una misma semana continúa acreditándose una sola vez.

## Principio de producto

> ENTRENO no premia entrenar todos los días. Premia cumplir aquello que te propusiste.

El flujo central de esta versión es:

**Elegir objetivo → entrenar → completar semana → ganar puntos → construir racha de constancia.**

## Persistencia

Durante esta etapa, toda la información sigue guardándose únicamente en el dispositivo mediante `localStorage`:

- objetivo semanal,
- entrenamientos,
- semanas premiadas,
- puntos.

No hay todavía cuenta de usuario ni sincronización entre dispositivos.

## Publicación

GitHub Pages publica este repositorio desde la rama `main` y la carpeta raíz `/`.

## Próximos escalones posibles

- historial de semanas cumplidas,
- reglas para cambios de objetivo entre semanas,
- catálogo de recompensas de prueba,
- primera acción de canje,
- usuarios y base de datos sincronizada.
