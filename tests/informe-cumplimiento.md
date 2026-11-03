# Informe de cumplimiento — StereoVision Studio 3D

Fecha de revisión: 2026-11-02. Rama local: `feature/imagen-sbs`.

Este informe separa la evidencia estática disponible de las pruebas que requieren abrir la aplicación, usar archivos multimedia o contar con hardware. No representa una aprobación del 100 %.

## RN-01…RN-20

| Regla | Estado | Implementación | Archivo / función | Evidencia o pendiente |
|---|---|---|---|---|
| RN-01 | Parcial | Modalidad antes de importar | `main.js`, `selectMode`, `importFile` | Flujo visible; prueba P-01 pendiente |
| RN-02 | Parcial | Archivos locales y decodificación | `fileLoader.js`, `openLocalFile` | Revisión estática; ejecución pendiente |
| RN-03 | Parcial | JPG/PNG/WebP, AVIF SBS y MP4 | `fileLoader.js`, `validateSelection` | Tipos revisados; compatibilidad por navegador pendiente |
| RN-04 | Parcial | Errores recuperables | `main.js`, `setPhase`; `fileLoader.js` | Mensajes y reintento implementados; ejecución pendiente |
| RN-05 | Parcial | Un activo y liberación | `main.js`, `stopCurrent`; `releaseLocalFile` | Flujo revisado; DevTools pendiente |
| RN-06 | Parcial | Controles deshabilitados sin archivo | `main.js`, `updateUI` | Código revisado; P-01 pendiente |
| RN-07 | Parcial | Calibración visual sin modificar originales | `anaglyph.js`, `imageSbs.js` | Revisión estática; evidencia visual pendiente |
| RN-08 | Parcial | Defaults al importar | `calibration.js`, `resetValues` | Código revisado; sustitución pendiente |
| RN-09 | Parcial | Actualización en tiempo real | listeners de `main.js`, renderer y player | `node --check`; prueba funcional pendiente |
| RN-10 | Corregida estáticamente | Reset completo incluido Pan Anaglifo | `main.js`, `resetAnaglyphView` | Syntax check; prueba manual pendiente |
| RN-11 | Parcial | Correspondencia ocular por UV | `imageSbs.js`, `makeGeometry` | Revisión de geometría; prueba visual pendiente |
| RN-12 | Parcial | Intercambio de ojos | `imageSbs.js`, `draw` | Revisión de `swap`; prueba visual pendiente |
| RN-13 | Parcial | Proporciones y Half-SBS | `imageSbs.js`, `draw` | Código revisado; archivos reales pendientes |
| RN-14 | Parcial | Una fuente temporal de video | `videoSbs.js`, `attachPlayer` | Revisión estática; P-04/P-05 pendientes |
| RN-15 | Parcial | VR con dos regiones y editor oculto | `vrMode.js`, `imageSbs.js`, CSS VR | Revisión estática; dispositivo pendiente |
| RN-16 | Parcial | Salida VR conservando estado | `main.js`, `exitVR` | Código revisado; P-08 pendiente |
| RN-17 | Parcial | Gestos y orientación | `sbsInteractions.js`, `imageSbs.js` | Sintaxis revisada; iPhone pendiente |
| RN-18 | Parcial | `playsinline` y reproducción explícita | `fileLoader.js`, `videoSbs.js` | Código revisado; Safari pendiente |
| RN-19 | Comprobada estáticamente | Sin backend ni envío | arquitectura del proyecto | No hay API de subida ni dependencia de servidor |
| RN-20 | Pendiente | Publicación HTTPS | GitHub Pages | No se verificó la URL publicada en este turno |

## Actividades 1…23

| # | Actividad | Estado | Evidencia / pendiente |
|---:|---|---|---|
| 1 | Problema, usuarios y alcance | Parcial | README actualizado; documento académico original no está en el workspace |
| 2 | Material estereoscópico auténtico | Pendiente | Requiere material externo y evidencia |
| 3 | Entorno HTTP y estructura modular | Comprobada estáticamente | README, módulos ES y servidor local documentado |
| 4 | Interfaz responsiva | Parcial | CSS revisado; prueba visual pendiente |
| 5 | Separación de responsabilidades | Comprobada estáticamente | `main.js` y módulos especializados |
| 6 | Estados del sistema | Parcial | `empty/loading/ready/error/VR` en `main.js`; flujo pendiente |
| 7 | Importación | Parcial | `fileLoader.js`; ejecución pendiente |
| 8 | Validación y errores | Parcial | `validateSelection` y decodificación; ejecución pendiente |
| 9 | Sustitución y liberación | Parcial | `stopCurrent`, `releaseLocalFile`, `clearTexture`; DevTools pendiente |
| 10 | Anaglifo | Parcial | Funcionalidad existente y reset corregido; lentes pendientes |
| 11 | Imagen SBS | Parcial | Renderer y controles existentes; prueba visual pendiente |
| 12 | Calibración SBS | Parcial | Estado compartido y gestos; dispositivo pendiente |
| 13 | Reset e intercambio | Parcial | Código revisado; prueba manual pendiente |
| 14 | Video SBS | Parcial | Fuente única y adaptador horizontal; MP4 pendiente |
| 15 | Controles multimedia | Parcial | `attachPlayer`; ejecución pendiente |
| 16 | Calibración dinámica de video | Corregida estáticamente | `rendererSettings` adapta `horizontal` a `panX`; prueba visual pendiente |
| 17 | Video móvil | Pendiente | Requiere Safari/iPhone |
| 18 | Modo VR | Parcial | CSS y `vrMode.js`; visor físico pendiente |
| 19 | Orientación y proporciones | Parcial | Resize/visualViewport en renderer; rotación real pendiente |
| 20 | Prueba con gafas | Pendiente | Hardware no disponible |
| 21 | Matriz funcional | Comprobada documentalmente | `tests/matriz-pruebas.md` actualizada |
| 22 | Entornos diferentes | Pendiente | Falta escritorio, Safari iPhone y GitHub Pages |
| 23 | Registro de calibraciones/incidencias | Comprobada documentalmente | Matriz e informe incluyen tablas e incidencias reales |

## P-01…P-09

| Prueba | Estado actual | Evidencia |
|---|---|---|
| P-01 | Pendiente | `tests/matriz-pruebas.md`; requiere navegador |
| P-02 | Pendiente | Requiere imagen y lentes rojo-cian |
| P-03 | Pendiente | Requiere SBS real y comparación visual |
| P-04 | Pendiente | Requiere MP4 decodificable |
| P-05 | Pendiente | Adaptador implementado; falta reproducción real |
| P-06 | Pendiente | Requiere DevTools para verificar recursos |
| P-07 | Pendiente | Validación estática revisada; falta ejecución |
| P-08 | Pendiente | Requiere Safari/iPhone y visor VR |
| P-09 | Pendiente | Requiere abrir GitHub Pages y revisar consola/red |

## Comprobaciones ejecutadas en este entorno

```text
node --check assets/js/main.js
node --check assets/js/modules/calibration.js
node --check assets/js/modules/imageSbs.js
node --check assets/js/modules/sbsInteractions.js
node --check assets/js/modules/anaglyph.js
node --check assets/js/modules/videoSbs.js
node --check assets/js/modules/vrMode.js
git diff --check
```

Todas las comprobaciones anteriores finalizaron correctamente. También se revisó que los imports locales existan y que no haya cambios en `anaglyph.js`, `videoSbs.js` ni `vrMode.js` en la última intervención previa; Video SBS recibió únicamente el adaptador requerido en `main.js`.

## Riesgos y pendientes

- La reproducción depende del códec admitido por el navegador.
- Fullscreen, orientación bloqueada, WebGL/CDN y `visualViewport` deben probarse en Safari iPhone.
- La comodidad binocular requiere lentes rojo-cian y visor Cardboard reales.
- GitHub Pages puede estar sirviendo otra rama o commit; debe verificarse externamente.
- No se ejecutaron commits, merges ni pushes.
