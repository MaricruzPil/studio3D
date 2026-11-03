# Studio 3D

**Visualización, edición y calibración de contenido estereoscópico en la web.**

[**Abrir la aplicación**](https://maricruzpil.github.io/studio3D/) · [**Repositorio en GitHub**](https://github.com/MaricruzPil/studio3D)

StereoVision Studio 3D es una aplicación web desarrollada para el examen **Tema 2. Estereoscopía**. Permite importar archivos locales y ajustar la presentación de imágenes anaglifo rojo-cian, imágenes Side-by-Side (SBS) y videos SBS 3D desde una interfaz responsiva, sin modificar el archivo de origen.

El proyecto está dirigido a estudiantes, docentes y personas que necesitan examinar y calibrar material estereoscópico en una computadora o teléfono. Su propósito es **visualizar contenido que ya contiene información para cada ojo**; no convierte automáticamente fotografías o videos 2D en contenido 3D real.

## Funcionalidades

### Anaglifo rojo-cian

- Importación de imágenes **JPG/JPEG, PNG y WebP**.
- Ajustes en tiempo real de escala, brillo y contraste.
- Desplazamiento del encuadre (Pan) y zoom táctil mediante dos dedos.
- Opciones Ver original, Ajustar al visor, vista inmersiva y restablecimiento.
- **Exportación a PNG** de la imagen con la calibración visual aplicada.
- Visualización estereoscópica con lentes físicos rojo-cian y material anaglifo auténtico.

### Imagen SBS

- Importación de imágenes **JPG/JPEG, PNG, WebP y AVIF**, con un límite de **30 MB** para este módulo.
- Separación y representación de las perspectivas izquierda y derecha mediante recorte de textura con Three.js.
- Selección de formato Full-SBS / Half-SBS.
- Ajustes de paralaje, alineación vertical, escala y desplazamiento X/Y.
- Opción para intercambiar las perspectivas izquierda y derecha.
- Gestos Mover, Separar y zoom con dos dedos, además de vista previa ampliada.
- Modo VR para visualización en horizontal desde un teléfono.
- Exportación PNG y descarga de parámetros de calibración en JSON.

### Video SBS

- Importación de archivos **MP4 compatibles con el navegador**; para mayor compatibilidad se recomienda video H.264.
- Un único video de origen para mantener sincronizadas ambas perspectivas.
- Controles de reproducción, pausa, adelanto/retroceso, barra de progreso, volumen, tiempo actual y duración.
- Ajustes de desplazamiento horizontal y vertical, separación/paralaje y escala, incluso durante la reproducción.
- Gestos táctiles Mover, Separar y zoom con dos dedos.
- Modo VR con controles compactos para reproducir/pausar y salir.
- Exportación de video procesado, cuando el navegador admite `canvas.captureStream()` y `MediaRecorder`. El formato puede ser MP4 o WebM; la inclusión de audio depende del soporte del navegador.

## Modo VR y compatibilidad móvil

Los módulos Imagen SBS y Video SBS ofrecen un visor de dos regiones, una para cada ojo. Al entrar en VR se ocultan las herramientas de edición, se conserva la calibración y se muestra una indicación para colocar el teléfono horizontalmente cuando es necesario.

La aplicación solicita pantalla completa y bloqueo de orientación cuando el navegador lo permite. Cuando estas funciones están restringidas, utiliza una presentación alternativa dentro de la página. Para comprobar la profundidad se necesita contenido SBS auténtico y un visor para teléfono tipo Cardboard.

**Confort visual:** el paralaje digital no cambia la distancia interpupilar física ni sustituye la calibración óptica de las gafas. Interrumpe la visualización si se presenta mareo, fatiga o visión doble persistente.

## Cómo utilizar la aplicación

1. Abre el [sitio publicado](https://maricruzpil.github.io/studio3D/).
2. Selecciona Anaglifo, Imagen SBS o Video SBS.
3. Pulsa Seleccionar archivo y elige un contenido local compatible. En computadora también puedes arrastrarlo al visor.
4. Ajusta los parámetros del módulo. Puedes restablecerlos en cualquier momento.
5. Para Imagen SBS o Video SBS, entra en VR si deseas usar el teléfono con gafas apropiadas.
6. Utiliza las opciones de exportación si necesitas guardar el resultado procesado o, en Imagen SBS, descargar la calibración JSON.

Al sustituir un archivo se libera el contenido previo y los controles de calibración regresan a sus valores iniciales. Los formatos inválidos o incompatibles muestran mensajes de error recuperables.

## Tecnologías

| Tecnología | Uso en el proyecto |
| --- | --- |
| HTML5 | Estructura y controles de la interfaz |
| CSS3 | Diseño responsivo, estados visuales y estilos de sliders/botones |
| JavaScript (módulos ES) | Importación, estado, calibración y eventos |
| Three.js 0.180.0 | Renderizado WebGL de las dos perspectivas SBS |
| Canvas 2D | Generación de imágenes PNG con ajustes |
| HTMLVideoElement y VideoTexture | Reproducción y representación sincronizada de video SBS |
| MediaRecorder y captureStream | Exportación de video según soporte del navegador |
| Git y GitHub Pages | Control de versiones y publicación HTTPS |

Three.js se obtiene de un CDN mediante un `importmap` en `index.html`. Es necesaria una conexión a Internet para cargar esa dependencia en los módulos SBS. No se requiere instalar paquetes con npm ni ejecutar un proceso de compilación para utilizar el proyecto.

## Estructura principal

```text
StereoVision-Studio-3D/
├── index.html
├── README.md
├── .gitignore
└── assets/
    ├── css/
    │   └── styles.css
    ├── img/
    │   └── icon.png
    └── js/
        ├── main.js
        └── modules/
            ├── anaglyph.js
            ├── calibration.js
            ├── fileLoader.js
            ├── imageExport.js
            ├── imageSbs.js
            ├── sbsInteractions.js
            ├── videoExport.js
            ├── videoSbs.js
            └── vrMode.js
```

**Responsabilidades:** `main.js` coordina módulos y estados; `fileLoader.js` valida y libera archivos locales; `calibration.js` centraliza los ajustes; `anaglyph.js` maneja la vista rojo-cian; `imageSbs.js` contiene el renderizador estéreo compartido; `sbsInteractions.js` controla los gestos; `videoSbs.js` maneja el reproductor; `imageExport.js` y `videoExport.js` generan los archivos descargables; `vrMode.js` gestiona presentación inmersiva y orientación.

La estructura anterior muestra los archivos principales de la aplicación; no requiere una carpeta de demostraciones ni una carpeta de pruebas dentro del repositorio.

## Ejecución local

Necesitas un navegador moderno con soporte de módulos ES y, para Imagen/Video SBS, WebGL. Desde la raíz del proyecto, abre la terminal de VS Code y ejecuta:

```powershell
py -m http.server 5500
```

También puedes utilizar:

```powershell
python -m http.server 5500
```

Después visita **http://localhost:5500/**. Evita abrir `index.html` mediante `file://`, porque algunas funciones y módulos requieren un origen HTTP o HTTPS.

No se necesita backend, base de datos ni cuenta de usuario.

## Privacidad y límites

- Los archivos seleccionados se procesan localmente en el navegador y no se cargan a un servidor de la aplicación.
- El archivo original no se sobrescribe: la calibración afecta la representación y las exportaciones generan archivos nuevos.
- La aplicación no reconstruye profundidad a partir de una imagen o video 2D.
- La decodificación MP4, pantalla completa, bloqueo de orientación y exportación de video dependen de las capacidades del navegador y dispositivo.
- Los medios y la evidencia de prueba pueden mantenerse fuera del repositorio; el usuario proporciona sus propios archivos para utilizar el Studio.

## Validación

El proyecto se probó manualmente en computadora y teléfono, incluyendo carga y sustitución de archivos, controles de los tres módulos, recuperación frente a entradas inválidas, gestos, visualización VR y exportaciones.

## Desarrollo y apoyo de diseño

El proyecto fue desarrollado en **Visual Studio Code** para la exploración y refinamiento de la interfaz se empleó la skill **`frontend-design`** como herramienta de asistencia al diseño junto a Codex.

Esta skill no es una dependencia de ejecución de la aplicación y no es necesario incluir sus archivos en el repositorio.

## Publicación

- **Aplicación HTTPS:** https://maricruzpil.github.io/studio3D/
- **Código fuente:** https://github.com/MaricruzPil/studio3D
- **Rama principal:** `main`

La publicación se realiza mediante GitHub Pages. Los cambios integrados en `main` aparecerán en el sitio cuando termine el despliegue, siempre que GitHub Pages esté configurado para publicar esa rama o el flujo correspondiente.