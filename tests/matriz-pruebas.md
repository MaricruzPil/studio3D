# Matriz funcional P-01…P-09

| ID | Objetivo | Procedimiento | Resultado esperado | Resultado observado | Estado funcional | Entorno | Evidencia |
|---|---|---|---|---|---|---|---|
| P-01 | Inicio sin contenido | Abrir la aplicación sin seleccionar modalidad ni archivo. | Visor vacío; controles dependientes deshabilitados; no hay errores bloqueantes. | El flujo inicial se considera funcional según el reporte manual; falta captura del estado inicial. | PARCIAL | Computadora Windows y teléfono iPhone, según reporte | Reporte manual del estudiante; captura pendiente. |
| P-02 | Anaglifo | Seleccionar Anaglifo, cargar una imagen, ajustar escala/brillo/contraste, usar Pan y pinch-to-zoom, restablecer y exportar. | Imagen rojo-cian proporcional; controles sincronizados; Pan, zoom, restablecimiento y exportación conservan su comportamiento. | Anaglifo y sus correcciones recientes fueron reportados como funcionales; A10, A11 y E01 quedaron aprobadas manualmente. | APROBADA | Computadora Windows y teléfono iPhone, según reporte | Reporte manual de revalidación; falta captura o vídeo. |
| P-03 | Imagen SBS | Cargar una imagen SBS, probar Full/Half-SBS, Mover X/Y, escala, paralaje, desnivel, intercambio y Ajustar al visor. | Ambas perspectivas conservan proporciones; la calibración se refleja en preview y VR; el archivo original no cambia. | Imagen SBS fue reportada como funcional, incluida la sustitución de contenido I19; falta evidencia detallada de cada parámetro. | APROBADA | Computadora Windows y teléfono iPhone, según reporte | Reporte manual; captura de Full/Half y VR pendiente. |
| P-04 | Video SBS | Cargar un MP4 compatible, reproducir, pausar, buscar, cambiar volumen/tiempo y usar los controles SBS. | Una fuente temporal; reproducción y controles sincronizados; calibración sin modificar el archivo. | Video SBS y reproducción fueron reportados como funcionales; no se aportó registro de códec, audio ni controles individuales. | APROBADA | Computadora Windows y teléfono iPhone, según reporte | Reporte manual; vídeo de reproducción pendiente. |
| P-05 | Calibración dinámica de video | Ajustar Mover/Separar, horizontal, escala y demás controles durante la reproducción. | El encuadre cambia en tiempo real sin reiniciar ni desincronizar el vídeo. | La corrección de Mover/Separar fue revalidada y V12 quedó aprobada manualmente. | APROBADA | Computadora Windows y teléfono iPhone, según reporte | V12 reportada como aprobada; captura antes/después pendiente. |
| P-06 | Sustitución y liberación | Cambiar imagen, vídeo e imagen sin recargar; repetir después de un error y salir de VR. | Solo queda un activo; recursos, listeners y superficies anteriores se liberan; el nuevo estado inicia limpio. | La sustitución de contenidos fue reportada como funcional; no hay evidencia de DevTools para memoria, listeners o WebGL. | PARCIAL | Computadora Windows y teléfono iPhone, según reporte | I19 reportada como aprobada; evidencia técnica pendiente. |
| P-07 | Archivos inválidos | Intentar extensiones no admitidas, archivo vacío y vídeo no decodificable. | Mensaje comprensible, recuperación del estado y posibilidad de continuar sin romper la aplicación. | El manejo de errores forma parte del flujo reportado; no se aportó una ejecución documentada de cada caso inválido. | PARCIAL | Computadora Windows y teléfono iPhone, según reporte | Capturas de errores pendientes. |
| P-08 | VR móvil | Entrar y salir de VR con Imagen SBS y Video SBS, rotar el dispositivo y conservar ajustes. | Editor oculto; dos regiones correctamente separadas; salida visible; calibración conservada; orientación gestionada. | Los gestos VR fueron reportados como funcionales y R09 quedó aprobada manualmente; no hay evidencia de gafas ni de cada orientación. | APROBADA | Teléfono iPhone, Safari/Chrome móvil según reporte | R09 reportada como aprobada; captura o vídeo VR pendiente. |
| P-09 | Publicación HTTPS | Abrir GitHub Pages en escritorio y móvil; revisar carga de módulos, consola, red y rutas. | La aplicación publicada carga los tres módulos sin errores bloqueantes y bajo HTTPS. | La URL publicada fue reportada como accesible y funcional; no se entregaron capturas de consola/red ni comprobación independiente de la publicación. | PARCIAL | GitHub Pages; computadora Windows y teléfono iPhone, según reporte | URL reportada: https://maricruzpil.github.io/studio3D/; evidencia de DevTools pendiente. |

## Incidencias encontradas y corregidas

### INC-01 — Superficie táctil incompleta en Video SBS

- **Síntoma:** el gesto podía mover o ampliar la imagen de Imagen SBS, pero no actuar de forma equivalente sobre el preview de Video SBS.
- **Causa:** `sbs-gesture-surface` estaba disponible solo para Imagen SBS.
- **Corrección:** se habilitó la superficie de interacción para Video SBS cuando el vídeo está listo, sin cambiar los contratos de Anaglifo.
- **Validación:** V14 fue reportada como aprobada manualmente; falta captura o vídeo.

### INC-02 — Mover/Separar horizontal no llegaba al renderer de Video SBS

- **Síntoma:** el control horizontal no producía el desplazamiento esperado.
- **Causa:** el control de Video SBS usa `horizontal`, mientras el renderer compartido consume `panX`.
- **Corrección:** `main.js` adapta el valor de Video SBS al parámetro común antes de dibujar.
- **Validación:** V12 fue reportada como aprobada manualmente; falta evidencia visual antes/después.

### INC-03 — Exportación PNG de Anaglifo incompleta

- **Síntoma:** el PNG exportado no reflejaba todos los ajustes visibles del visor.
- **Causa:** el Pan expresado en píxeles CSS no se convertía a coordenadas nativas de la imagen exportada.
- **Corrección:** la exportación convierte la escala del visor y el desplazamiento a coordenadas del bitmap antes de componer el PNG.
- **Validación:** A10, A11 y E01 fueron reportadas como aprobadas manualmente.
