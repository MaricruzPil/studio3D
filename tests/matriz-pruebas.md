# Matriz funcional P-01…P-09

Los estados reflejan únicamente pruebas ejecutadas en este entorno. Las pruebas de Safari/iPhone, VR físico, lentes y publicación deben completarse con evidencia externa.

| ID | Objetivo | Procedimiento | Resultado esperado | Estado | Evidencia / entorno |
|---|---|---|---|---|---|
| P-01 | Inicio sin contenido | Abrir la aplicación sin seleccionar modalidad ni archivo | Visor vacío y controles dependientes deshabilitados | Pendiente | Requiere navegador |
| P-02 | Anaglifo | Seleccionar Anaglifo, cargar imagen, mover escala/brillo/contraste, Pan, pinch y restablecer | Imagen proporcional; valores restablecen escala, filtros y Pan | Pendiente | Requiere imagen y lentes para validación estereoscópica |
| P-03 | Imagen SBS | Cargar SBS, probar Full/Half, Mover X/Y, escala, paralaje, desnivel e intercambio | Ambas perspectivas correctas y calibración sincronizada | Pendiente | Requiere imagen SBS real |
| P-04 | Video SBS | Cargar MP4 compatible, reproducir, pausar, buscar, avanzar, retroceder, volumen y tiempo | Una fuente temporal y controles sincronizados | Pendiente | Requiere MP4 compatible |
| P-05 | Video dinámico | Mover horizontal y escala durante reproducción | El encuadre cambia sin reiniciar ni desincronizar el video | Pendiente | Corrección estática en `main.js`; falta prueba de navegador |
| P-06 | Sustitución | Cambiar imagen, video e imagen sin recargar; repetir tras error y VR | Solo queda un archivo activo; recursos anteriores liberados | Pendiente | Requiere navegador y DevTools |
| P-07 | Archivo inválido | Intentar extensión incorrecta, archivo vacío y MP4 no decodificable | Mensaje claro y posibilidad de continuar | Pendiente | Validación estática revisada; falta ejecución |
| P-08 | VR móvil | Entrar/salir con Imagen y Video SBS, rotar el dispositivo y conservar ajustes | Editor oculto, dos regiones, salida visible y calibración conservada | Pendiente | Requiere Safari/iPhone y visor |
| P-09 | Publicación HTTPS | Abrir GitHub Pages en escritorio y móvil; revisar consola, red y 404 | Tres módulos cargan sin errores | Pendiente | La publicación no fue verificada en este turno |

## Registro de calibración

| Archivo | Modalidad | Dispositivo | Resolución | Parámetros aplicados | Resultado visual | Evidencia |
|---|---|---|---|---|---|---|
| Pendiente | Anaglifo | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Pendiente | Imagen SBS | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |
| Pendiente | Video SBS | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |

## Incidencias documentadas

### Incidencia A — Selector Full/Half-SBS vacío

- **Síntoma:** Safari podía mostrar el selector sin valor después de elegir una modalidad.
- **Causa:** `main.js` convertía el valor textual mediante `Number('half')`, produciendo `NaN`.
- **Solución:** los `<select>` conservan su cadena y los rangos siguen convirtiéndose a número.
- **Verificación:** revisión de código y `node --check`; prueba Safari pendiente.

### Incidencia B — Navegación táctil interferida por preview

- **Síntoma:** el preview contextual podía activarse con punteros táctiles.
- **Causa:** los listeners de preview respondían a eventos de puntero sin distinguir mouse de touch.
- **Solución:** preview limitado a mouse/teclado y oculto en dispositivos coarse; los botones mantienen `click` y `touch-action: manipulation`.
- **Verificación:** revisión estática; prueba de toque único en iPhone pendiente.

### Incidencia C — Desplazamiento horizontal de Video SBS

- **Síntoma:** el slider `horizontal` no afectaba al renderer compartido.
- **Causa:** Video usa `horizontal`, mientras WebGL consume `panX`.
- **Solución:** adaptador localizado en `main.js`; no se cambió el contrato de Imagen SBS.
- **Verificación:** `node --check` y revisión de flujo; prueba visual de video pendiente.

### Incidencia D — Encuadre VR asimétrico

- **Síntoma:** en VR horizontal podía percibirse espacio negro desigual y controles sobre el ojo derecho.
- **Causa:** el fit vertical podía usar la altura total del canvas en lugar de la composición efectiva con bandas; además, los controles estaban anclados al borde derecho.
- **Solución:** el renderer usa `compositionH` de forma coherente para fit, cámara, límites y scissor; los controles VR se ubican en la línea media.
- **Verificación:** `node --check` y `git diff --check`; comparación en iPhone/Cardboard pendiente.

## Observaciones de seguridad y bienestar

Los archivos se procesan localmente y no se suben a un servidor. Retira las gafas ante mareo, fatiga o visión doble persistente. La calibración digital no modifica la IPD física.
