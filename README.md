# StereoVision Studio 3D

Proyecto web estático de la práctica **Tema 2. Estereoscopía**. Repositorio independiente del proyecto anterior [StereoLab / visor-sbs](https://github.com/MaricruzPil/visor-sbs). Esta base está preparada para adaptar después el diseño visual definitivo.

## Funciones incluidas en este primer entregable

1. Elegir antes de importar el módulo **anaglifo rojo-cian**, **imagen SBS** o **video SBS**.
2. Importar archivos locales JPG/JPEG, PNG, WebP o MP4 según el módulo; rechazar errores habituales con mensajes recuperables.
3. Visualizar un anaglifo con controles **escala, brillo, contraste, restablecer**.
4. Visualizar imágenes SBS con **recorte UV izquierda/derecha real**, escala, desplazamiento X relativo, alineación vertical, intercambio de ojos y restablecer.
5. Visualizar un video SBS con **una sola fuente HTMLVideoElement** y **THREE.VideoTexture**, controles de reproducción, búsqueda, tiempo y volumen, además de escala y desplazamiento.
6. Modo VR responsivo para SBS imagen y video: oculta el editor, muestra dos vistas, avisa si el dispositivo está vertical y permite salir con botón táctil. Fullscreen y orientación se solicitan cuando el navegador lo permita; hay alternativa CSS.
7. Solo un archivo activo; al sustituirlo se detiene el video, se libera la textura y se revoca la URL temporal. Calibración reiniciada con el siguiente archivo.
8. Sin cuenta, servidor backend, base de datos o almacenamiento de los archivos del usuario.

El diseño es intencionalmente **neutro y provisional**: no determina la estética final del proyecto.

## Estructura

```text
StereoVision-Studio-3D/
├── index.html
├── README.md
├── .gitignore
├── assets/
│   ├── css/styles.css
│   ├── img/
│   ├── media/demo-anaglifo.png
│   ├── media/demo-sbs.jpg
│   ├── media/demo-sbs.mp4
│   └── js/
│       ├── main.js
│       └── modules/
│           ├── fileLoader.js      # tipos, decodificación y liberación de recursos
│           ├── anaglyph.js       # imagen anaglifo y filtros visuales
│           ├── imageSbs.js       # WebGL, textura, recorte UV y dos vistas
│           ├── videoSbs.js       # reproducción sincronizada de MP4 SBS
│           ├── calibration.js    # parámetros y restablecimiento
│           └── vrMode.js         # modo inmersivo y orientación
└── tests/matriz-pruebas.md
```

## Ejecutar localmente (Windows / VS Code)

1. Descomprime la carpeta y ábrela en VS Code.
2. Abre la terminal en la raíz del proyecto.
3. Ejecuta `py -m http.server 5500` (o `python -m http.server 5500`).
4. En el navegador visita `http://localhost:5500`.
5. Selecciona un módulo **antes** de importar el archivo correspondiente.
6. Utiliza los archivos de prueba de `assets/media/`: `demo-anaglifo.png` en anaglifo, `demo-sbs.jpg` en imagen SBS y `demo-sbs.mp4` en video SBS.

**Importante:** no abras `index.html` con `file://`; usa HTTP/HTTPS. Three.js se carga desde un **CDN fijado a versión 0.180.0**. Internet es necesario para los módulos SBS que dependen de este CDN; el archivo del usuario no se transmite al CDN. Los módulos anaglifo e interfaz básica no requieren esa descarga.

## Publicación en un repositorio nuevo

1. En GitHub crea un repositorio **público nuevo y vacío** llamado `StereoVision-Studio-3D` (sin inicializar con README, pues este paquete ya lo incluye).
2. Dentro de esta carpeta, ejecuta:

```bash
git init
git add .
git commit -m "Base modular de StereoVision Studio 3D"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/StereoVision-Studio-3D.git
git push -u origin main
```

3. En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root)**.
4. Verifica `https://TU_USUARIO.github.io/StereoVision-Studio-3D/` desde computadora y teléfono.

Las rutas internas son relativas y aptas para GitHub Pages en un subdirectorio.

## Fundamento estereoscópico

- Un archivo SBS **ya debe contener dos perspectivas diferentes**. El programa no crea profundidad a partir de una imagen plana.
- La mitad izquierda de la fuente se presenta al ojo izquierdo y la mitad derecha al derecho, salvo que se active **Intercambiar ojos**.
- El anaglifo requiere gafas físicas rojo-cian; los filtros CSS de brillo/contraste solo cambian la representación.
- El desplazamiento digital horizontal es distinto de la distancia interpupilar física. No fuerces la visión doble.
- El modo VR es una división visual de pantalla para visor de móvil; **no** añade corrección óptica de lentes Cardboard.
- En contenido Half-SBS comprimido horizontalmente, el visor presenta la proporción codificada: se puede ampliar más adelante con un ajuste de *tipo de SBS* si se necesita compensar la compresión. La práctica no obliga a reconstruir formatos específicos.

## Probar y documentar

Revisa `tests/matriz-pruebas.md`. Deben completarse evidencias **reales** P-01…P-09, observaciones del teléfono, capturas, archivos y al menos dos incidencias encontradas y sus soluciones. Los tres archivos de `assets/media` son demostraciones **sintéticas originales** creadas con proyección desde dos posiciones de cámara; para la evaluación se aconseja además conseguir material estereoscópico real y verificarlo con las gafas.

## Estado y pendientes

Esta entrega es una **base funcional de primera iteración**, no una declaración de aprobación de todas las pruebas. Pendientes de verificar en dispositivo real: reproducción y decodificación de MP4 según códecs, comodidad y orden ocular en Cardboard, permisos de pantalla completa, funcionamiento de WebGL/CDN en GitHub Pages, rendimiento y controles táctiles. El área de visualización usa proporción y márgenes sin estiramientos arbitrarios. Los avisos de error permiten reintentar con otro archivo.

No se han copiado archivos del repositorio StereoLab en esta base. Si se desea conservar funciones adicionales de `viewer.js`, `scene.js` o `controls.js`, se pueden adaptar más adelante sin afectar la separación de módulos.
