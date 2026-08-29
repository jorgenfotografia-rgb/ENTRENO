# TU TIEMPO · Android POC V0.1

Prueba técnica del concepto **EL TIEMPO COMO VALOR**.

## Qué demuestra

La app pide el permiso especial de Android **Acceso de uso** y mide el tiempo en que
el teléfono estuvo en estado `SCREEN_INTERACTIVE` desde el momento en que la
persona decide empezar.

No mide pasos, puntos, rachas ni recompensas. El producto es el contador.

## Flujo

1. `¿QUERÉS SABERLO?`
2. Permiso `Acceso de uso`.
3. `00:00:00` + advertencia de inicio.
4. Contador real del teléfono.

El timestamp de inicio se guarda localmente en `SharedPreferences`. No hay login,
servidor, analítica ni permiso de Internet.

## Fuente de datos

- Android `UsageStatsManager`
- Para intervalos recientes: `UsageEvents.Event.SCREEN_INTERACTIVE` /
  `SCREEN_NON_INTERACTIVE`.
- Para intervalos largos: `queryEventStats()` como respaldo agregado.

**Importante:** V0.1 es una prueba técnica. Antes de afirmar precisión a escala de
meses/años debemos validar el comportamiento del historial en distintos fabricantes
y versiones de Android.

## Escala visual

- Menos de 1 día: `HH:MM:SS`
- Días: `2 DÍAS` + reloj residual
- Semanas: `3 SEMANAS`
- Meses: `2 MESES · 1 semana · 2 días · 22 horas`
- Años: `1 AÑO · ...`

Para duración, V0.1 usa:
- 1 semana = 7 días
- 1 mes = 30 días
- 1 año = 365 días

## Compilación

Requiere JDK 17, Android SDK 36, Android Gradle Plugin 8.13.2 y Gradle 8.13.

En la rama `time-mirror-poc`, GitHub Actions compila automáticamente el APK debug
y publica el artefacto **TU-TIEMPO-V0.1-POC**.

## Privacidad V0.1

La aplicación no declara permiso de Internet y `android:allowBackup` está
desactivado. El dato se procesa y conserva localmente en el dispositivo.
