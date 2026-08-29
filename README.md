# ENTRENO V0.2

PWA funcional del proyecto **ENTRENO**.

## Qué hace

- Registra como máximo un entrenamiento por día.
- Conserva los registros creados en V0.1.
- Calcula una racha diaria simple.
- Define una meta semanal fija de **3 entrenamientos** (lunes a domingo).
- Muestra progreso semanal **0/3, 1/3, 2/3, 3/3**.
- Otorga **100 puntos** una sola vez al completar la meta semanal.
- Guarda entrenamientos, semanas premiadas y puntos en `localStorage`.
- Muestra los últimos 7 días.
- Funciona como PWA instalable y con soporte offline básico.
- No requiere servidor, base de datos ni cuenta de usuario en esta etapa.

## Publicación

GitHub Pages publica este repositorio desde la rama `main` y la carpeta raíz `/`.

## Regla de prueba V0.2

**3 entrenamientos en una semana = +100 puntos.**

La semana se considera de lunes a domingo y la recompensa de una semana no puede duplicarse aunque la app se cierre o se vuelva a abrir.

## Próximo escalón posible

- objetivo semanal configurable,
- historial de semanas,
- catálogo de recompensas de prueba,
- primera acción de canje,
- posteriormente usuarios y base de datos sincronizada.
