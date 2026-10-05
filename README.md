# Frontend — App de Orientación Estudiantil UCC

Universidad Cooperativa de Colombia · Campus Santa Marta. Trabajo de grado de Ingeniería de Software, 2026.

Un solo código fuente en React Native (0.73) que corre en Android, iOS y navegador web (react-native-web). Consume la API del backend (`../backend`).

## Puesta en marcha (web)

Requiere Node 20 o superior y el backend corriendo (por defecto en `http://localhost:8080`).

```
npm install
npm run web
```

Abre `http://localhost:3000`. Para generar el paquete de producción: `npm run build:web` (queda en `dist/`).

La URL del backend se toma de la variable `API_BASE_URL`; si no existe usa `http://localhost:8080/api/v1` (`http://10.0.2.2:8080/api/v1` en el emulador de Android):

```
API_BASE_URL=https://mi-servidor/api/v1 npm run build:web
```

El backend acepta cualquier origen por defecto. En producción defina `CORS_ALLOWED_ORIGINS` en el backend con la URL de esta app.

## Mapa del campus

La pestaña **Campus → Mapa** muestra el plano del edificio con Leaflet (`L.CRS.Simple`, sin GPS ni teselas) dentro de un WebView. Funciona **sin conexión**: Leaflet va incrustado en el HTML (`npm install` lo genera con `scripts/build-campus-map.js`; también `npm run build:map`), el listado de planos se cachea como el resto de módulos y cada plano (imagen y polígonos) se guarda en su propia clave de AsyncStorage. Solo se vuelve a descargar un plano cuando cambia su `actualizadoEn`.

El estudiante busca un salón por nombre o código (búsqueda local) o pulsa **Ver en el mapa** en el detalle de un espacio. La app envía el UUID al mapa con `injectJavaScript` → `window.highlightSpace(uuid)`, que ilumina el polígono y centra la vista; si el salón está en otro plano, primero cambia de plano. En web, el mismo HTML va en un `iframe` y la app usa `postMessage` (`CampusMapView.web.jsx`).

En el panel, **Espacios → Planos** permite subir la imagen del plano (se optimiza en el navegador) y abrir el editor: se elige un espacio de la lista y se dibuja con la herramienta de polígono o rectángulo de Leaflet.draw. Cada trazo, edición de vértices o borrado se guarda solo en la API como GeoJSON; **Exportar GeoJSON** descarga una copia. El editor necesita ratón, así que en móvil muestra un aviso.

Archivos principales: `src/components/campus/map/` (plantilla HTML, `buildMapHtml`, `CampusMapView`), `src/screens/campus/CampusMapScreen.jsx`, `src/hooks/useCampusMap.js`, `src/components/admin/map/` y `src/screens/admin/Plan*.jsx`.

Para Android e iOS, `react-native-webview` es un módulo nativo: después de copiar las carpetas `android/` e `ios/` (ver más abajo), ejecute `pod install` en iOS.

## Pruebas

```
npm test
```

Cubren las utilidades (fechas, horarios de atención, validaciones, errores, debounce), los stores y el interceptor JWT (renovación de token, cola de solicitudes simultáneas, sesión expirada, modo sin conexión).

## Panel administrativo

Un usuario con rol `ADMINISTRADOR` ve el panel en lugar de la app de estudiante; el cambio se hace en `RootNavigator` según `user.rol`. El panel gestiona noticias, eventos, servicios (bienestar, directorio y preguntas frecuentes), espacios, asignaturas, calendario académico y usuarios. En web con ventana ancha usa un menú lateral fijo y en móvil un cajón que se abre con la hamburguesa del encabezado.

Necesita los endpoints de administración del backend (ver `backend/README.md`, sección "Endpoints de administración"): los documentos de partida pedían listar borradores, archivadas, cancelados e inactivos, y el backend original solo devolvía contenido público.

Decisiones que se apartan de `PROMPT_ADMIN.md`:

- **Sin "Eliminar" duplicado.** En noticias, "Archivar" y "Eliminar" son la misma operación del backend (`DELETE`, eliminación lógica), y en eventos "Cancelar" y "Eliminar" también. Se muestra una sola acción con el nombre correcto. En servicios, espacios y asignaturas sí hay "Activar/Desactivar" (reversible, con `activo`) y "Eliminar" (oculta el registro; se puede reactivar después).
- **Tipo `department`.** El panel usa `department`; `admin.api.js` lo traduce a `departments`, que es lo que espera la ruta del backend.
- **Días de la asignatura.** Se eligen con casillas y se envían como arreglo (`["LUNES","MIERCOLES"]`), que es lo que recibe la API, no como texto separado por comas.
- **Fecha y hora.** No se usan librerías de selección de fecha: se escriben como `AAAA-MM-DD` y `HH:mm` con validación.
- **Selectores.** En web es un `select` HTML nativo; en móvil una lista modal propia. `Picker` ya no forma parte de React Native.
- **Menú de acciones.** Es una hoja modal en web y en móvil, en lugar de un desplegable en web.
- **Errores de autoprotección.** El backend responde 403 (no 422) cuando el administrador intenta cambiar su propio rol o cuenta; la interfaz ya no le ofrece esas acciones.
- **Dashboard.** Los seis contadores se calculan con los listados del backend; "Servicios activos" suma Bienestar, Directorio y FAQ, y "Asignaturas del periodo actual" cuenta las activas del periodo más reciente.

## Usuarios de prueba

Con el script `backend/db/datos_prueba.sql` cargado, la contraseña de todos es `Test1234!`:

| Correo | Rol | Notas |
|---|---|---|
| admin@campusucc.edu.co | ADMINISTRADOR | Entra al panel administrativo |
| juan.perez@campusucc.edu.co | ESTUDIANTE | 5 materias matriculadas |
| maria.lopez@campusucc.edu.co | ESTUDIANTE | 2 materias |
| carlos.garcia@campusucc.edu.co | ESTUDIANTE | Sin matrículas: prueba el estado vacío |

## Android e iOS

Este repositorio no incluye las carpetas nativas `android/` e `ios/`. Para ejecutar en móvil:

1. Genere un proyecto base de la misma versión y copie sus carpetas nativas aquí:
   `npx @react-native-community/cli init UCCOrientacion --version 0.73.11`
2. Registre las fuentes de los íconos (react-native-vector-icons):
   - Android: en `android/app/build.gradle` agregue `apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")`.
   - iOS: agregue `Ionicons.ttf` a `UIAppFonts` en `Info.plist` y ejecute `pod install`.
3. `npm run android` o `npm run ios`.

La versión web fue probada de punta a punta en un navegador. La versión nativa no se ha ejecutado todavía en un dispositivo o emulador.

## Estructura

```
index.js / index.web.js   puntos de entrada (móvil / web)
App.jsx                   raíz: área segura + RootNavigator
webpack.config.js         build web, alias react-native → react-native-web
src/theme                 colors.js (única fuente de colores) y typography.js
src/api                   client.js (Axios + interceptor JWT) y un archivo por módulo
src/store                 auth.store.js y cache.store.js (Zustand)
src/hooks                 lógica de datos por pantalla
src/utils                 storage, fechas, validaciones, errores, debounce
src/components            componentes propios (sin librerías de UI de terceros)
src/navigation            Root / Auth / Main (barra inferior o menú lateral en web ancha)
src/screens               una carpeta por módulo
```

## Decisiones que se apartan de los documentos

- **Formato de error.** `CONTEXT_FRONT.md` describe `{ success:false, error, code }`, pero el backend responde `{ success:false, data, message }`. El cliente lee `message` y, si no existe, `error`.
- **Cuenta bloqueada con tiempo restante.** El backend siempre responde 401 genérico, sin revelar que la cuenta está bloqueada, así que la app no puede saber el tiempo real. Lo aproxima contando 5 fallos seguidos con el mismo correo en el dispositivo y mostrando una cuenta regresiva de 15 minutos. Es una estimación: no ve los fallos hechos desde otros dispositivos.
- **Tokens en AsyncStorage.** AsyncStorage **no cifra** los datos: en web es `localStorage` y en móvil un archivo. El prompt pide "AsyncStorage cifrado", pero cifrar de verdad exige otra librería (`react-native-keychain` en móvil) que no está en el stack. Si el trabajo lo requiere, es el cambio de seguridad más importante pendiente.
- **Caché del calendario.** Se agregó `@ucc_orientacion/cache_calendar` porque `PROMPT_FRONT.md` pide caché en el calendario, aunque no figura en la lista de claves. También `@ucc_orientacion/login_lock` para el bloqueo aproximado.
- **Contacto de servicios.** El backend solo tiene un campo libre `contacto`. La app detecta si es un correo (abre el cliente de correo) o un teléfono (abre el marcador).
- **Horario Abierto/Cerrado.** Se calcula interpretando el texto libre del campo `horario` (por ejemplo "Lunes a Viernes 8:00 AM – 5:00 PM"). Si el texto no se puede interpretar, no se muestra la etiqueta.
- **Sin pantalla de restablecer contraseña.** El flujo pide solo la pantalla de recuperación. En desarrollo el backend imprime el token en su consola, no envía correo, así que un usuario final todavía no puede completar el restablecimiento desde la app.
- **Menú lateral en web.** Con ventanas de 900 puntos o más, la barra inferior se reemplaza por un menú lateral.
- **Sin `Alert.alert`.** No funciona en react-native-web; el cierre de sesión usa un diálogo propio (`ConfirmDialog`).
