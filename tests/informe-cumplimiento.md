# Informe de cumplimiento — StereoVision Studio 3D

## 1. Introducción

StereoVision Studio 3D es una aplicación web local para trabajar con contenido estereoscópico real mediante tres módulos: Anaglifo rojo-cian, Imagen SBS y Video SBS. Permite importar archivos desde el dispositivo, calibrar la representación sin modificar el original, reproducir vídeo, usar gestos táctiles, entrar en un modo VR y exportar resultados cuando corresponde.

## 2. Requisitos funcionales RN-01…RN-20

| Regla | Requisito | Implementación | Archivo/función | Estado | Evidencia o pendiente |
|---|---|---|---|---|---|
| RN-01 | Seleccionar modalidad antes de importar | La modalidad activa determina el renderer y los controles. | `assets/js/main.js`, `selectMode`, `importFile` | APROBADA | Flujo reportado como funcional; captura de inicio pendiente. |
| RN-02 | Importar y decodificar archivos locales | Se usan `File`, `URL.createObjectURL` y decodificación de imagen/vídeo sin subida. | `assets/js/modules/fileLoader.js`, `openLocalFile` | APROBADA | Código revisado y flujo manual reportado; falta vídeo de importación. |
| RN-03 | Aceptar formatos definidos | Se validan imágenes admitidas, AVIF para SBS y vídeo MP4 según el loader. | `fileLoader.js`, `validateSelection` | PARCIAL | Tipos revisados; falta registrar navegador, códec y casos de formato. |
| RN-04 | Gestionar errores recuperables | Los errores pasan a estados visibles y permiten continuar o reintentar. | `main.js`, `setPhase`; `fileLoader.js` | PARCIAL | Manejo revisado y reportado; faltan capturas de entradas inválidas. |
| RN-05 | Mantener un activo y liberar el anterior | Se detiene la modalidad vigente y se liberan URLs, texturas, vídeo y superficies asociadas. | `main.js`, `stopCurrent`; `fileLoader.js`, `releaseLocalFile` | PARCIAL | Sustitución I19 reportada como aprobada; DevTools/memoria/listeners pendientes. |
| RN-06 | Deshabilitar controles sin contenido | La interfaz sincroniza disponibilidad con el estado de carga. | `main.js`, `updateUI`; `calibration.js`, `syncControls` | APROBADA | Código revisado y comportamiento inicial reportado; captura pendiente. |
| RN-07 | No modificar originales | Los ajustes se aplican al preview, canvas o renderer y no al archivo local. | `anaglyph.js`, `imageSbs.js`, `videoSbs.js` | APROBADA | Arquitectura y flujo manual reportados; evidencia visual pendiente. |
| RN-08 | Restablecer defaults al importar | La calibración se inicializa por modalidad y el nuevo archivo comienza con sus valores correspondientes. | `calibration.js`, `resetValues`; `main.js` | APROBADA | Código revisado y sustitución reportada; captura pendiente. |
| RN-09 | Actualizar en tiempo real | Sliders y gestos actualizan calibración y renderer/player durante la interacción. | listeners de `main.js`, `calibration.js`, renderers | APROBADA | Funcionamiento general reportado; no es una prueba automatizada. |
| RN-10 | Restablecer ajustes completos | El reset devuelve controles, filtros, Pan y calibración a sus valores definidos. | `main.js`, `resetAnaglyphView`, `resetValues` | APROBADA | Revalidación manual reportada; captura antes/después pendiente. |
| RN-11 | Mantener correspondencia ocular | Imagen SBS usa regiones UV y composición separadas para cada ojo. | `assets/js/modules/imageSbs.js`, `makeGeometry`, `draw` | APROBADA | Imagen SBS/VR reportados como funcionales; comparación visual pendiente. |
| RN-12 | Intercambiar perspectivas | El estado `swap` invierte las regiones destinadas a cada ojo. | `imageSbs.js`, `draw` | APROBADA | Funcionalidad reportada; captura de intercambio pendiente. |
| RN-13 | Conservar proporciones y Half-SBS | El renderer calcula composición, UV, cámara, viewport y límites sin estirar el contenedor. | `imageSbs.js`, `draw`, `resize` | APROBADA | Full/Half y VR reportados como funcionales; archivo de prueba y captura pendientes. |
| RN-14 | Mantener sincronía temporal de vídeo | Un único elemento de vídeo alimenta reproducción, controles y preview SBS. | `videoSbs.js`, `attachPlayer` | APROBADA | Reproducción reportada; códec, audio y captura pendientes. |
| RN-15 | Mostrar dos regiones en VR y ocultar editor | VR aplica estado visual, regiones SBS y controles compactos. | `vrMode.js`, `imageSbs.js`, estilos VR | APROBADA | Gestos VR reportados como funcionales; evidencia física pendiente. |
| RN-16 | Salir de VR conservando estado | La salida abandona el modo inmersivo sin descartar calibración vigente. | `main.js`, `exitVR`; `vrMode.js` | APROBADA | Conservación reportada; captura de entrada/salida pendiente. |
| RN-17 | Responder a gestos y orientación | Pointer Events, pinch, Pan, transición de uno/dos dedos y redimensionamiento se gestionan por modalidad. | `sbsInteractions.js`, `anaglyph.js`, `imageSbs.js` | APROBADA | V14 y R09 reportadas como aprobadas; Safari/iPhone no verificado por Codex. |
| RN-18 | Considerar restricciones móviles de vídeo | El vídeo usa `playsInline` y reproducción explícita según las restricciones del navegador. | `fileLoader.js`, `videoSbs.js` | PARCIAL | Implementación revisada y móvil reportado; versión/códec Safari pendientes. |
| RN-19 | No subir archivos a backend | El procesamiento ocurre en el navegador y no hay API de subida. | arquitectura del proyecto; `fileLoader.js` | APROBADA | Revisión estática de imports y flujo local. |
| RN-20 | Publicar bajo HTTPS | La aplicación está disponible mediante GitHub Pages con URL HTTPS. | configuración publicada / GitHub Pages | PARCIAL | Acceso reportado; faltan capturas de consola, red, rutas y comprobación independiente. |


## 3. Resumen de pruebas P-01…P-09

La matriz completa está en [`tests/matriz-pruebas.md`](matriz-pruebas.md). Los estados son los mismos en ambos documentos:

| Prueba | Estado | Resumen |
|---|---|---|
| P-01 | PARCIAL | Inicio funcional reportado; captura pendiente. |
| P-02 | APROBADA | Anaglifo y exportación revalidados manualmente. |
| P-03 | APROBADA | Imagen SBS, Full/Half y sustitución reportados como funcionales. |
| P-04 | APROBADA | Video SBS y reproducción reportados como funcionales. |
| P-05 | APROBADA | Mover/Separar e interacción dinámica revalidados. |
| P-06 | PARCIAL | Sustitución aprobada visualmente; liberación técnica pendiente. |
| P-07 | PARCIAL | Manejo general reportado; casos inválidos sin evidencia detallada. |
| P-08 | APROBADA | Gestos VR reportados como aprobados; evidencia física pendiente. |
| P-09 | PARCIAL | GitHub Pages reportado accesible; DevTools pendiente. |


## 5. Arquitectura y responsabilidades

| Archivo/módulo | Responsabilidad |
|---|---|
| `assets/js/main.js` | Estado global, selección de modalidad, ciclo de vida, controles, exportación y coordinación entre módulos. |
| `assets/js/modules/fileLoader.js` | Validación, decodificación, URLs locales, `playsInline` y liberación del archivo activo. |
| `assets/js/modules/calibration.js` | Defaults, estado por modalidad, sincronización de controles y serialización de ajustes. |
| `assets/js/modules/anaglyph.js` | Composición rojo-cian, filtros, transformación, Pan, pinch y reset. |
| `assets/js/modules/imageSbs.js` | Renderer Three.js, dos escenas/meshes, UV Full/Half-SBS, viewports, proporciones y resize. |
| `assets/js/modules/videoSbs.js` | Elemento de vídeo único, reproducción, pausa, seek, volumen y tiempo. |
| `assets/js/modules/sbsInteractions.js` | Pointer Events compartidos, Pan, pinch, transición de uno/dos dedos y modos Mover/Separar. |
| `assets/js/modules/vrMode.js` | Estado visual VR, orientación, pantalla completa y salida. |
| `assets/js/modules/imageExport.js` | Exportación PNG y conversión de calibración del visor a coordenadas del bitmap. |
| `assets/js/modules/videoExport.js` | Captura del stream procesado mediante `captureStream`/`MediaRecorder` cuando el navegador lo admite. |

Three.js se utiliza para la composición SBS. En Half-SBS, las regiones UV siguen ocupando sus mitades del archivo, mientras la geometría/cámara recompone la proporción visual. El vídeo mantiene una única fuente temporal y la presenta en regiones oculares separadas.

## 6. Validación técnica y compatibilidad

### Reporte manual del estudiante

Se reporta funcionamiento en computadora Windows y teléfono iPhone, navegación entre los tres módulos, gestos táctiles, VR, reproducción, calibración, sustitución, exportación y publicación en GitHub Pages. Los casos concretos aprobados se conservan en la matriz como reporte manual, no como evidencia generada en esta sesión.

