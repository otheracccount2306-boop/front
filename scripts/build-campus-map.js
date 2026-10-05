/**
 * @description Genera src/components/campus/map/campusMapTemplate.generated.js: la plantilla del mapa
 *              del campus con Leaflet (JS y CSS) incrustado, para que el WebView funcione sin conexión
 *              y sin depender de un CDN. Se ejecuta en postinstall y con `npm run build:map`.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mapDir = path.join(root, 'src', 'components', 'campus', 'map');
const templatePath = path.join(mapDir, 'campusMap.template.html');
const outputPath = path.join(mapDir, 'campusMapTemplate.generated.js');
const leafletDir = path.dirname(require.resolve('leaflet/package.json', { paths: [root] }));

const read = (file) => fs.readFileSync(file, 'utf8');

// Un "</script" dentro del código incrustado cerraría la etiqueta antes de tiempo.
const escapeScript = (code) => code.replace(/<\/script/gi, '<\\/script');

const html = read(templatePath)
  .replace('/*__LEAFLET_CSS__*/', () => read(path.join(leafletDir, 'dist', 'leaflet.css')))
  .replace('/*__LEAFLET_JS__*/', () => escapeScript(read(path.join(leafletDir, 'dist', 'leaflet.js'))));

if (html.includes('__LEAFLET_')) {
  throw new Error('No se reemplazaron los marcadores de Leaflet en la plantilla del mapa');
}

const banner = '// Archivo generado por scripts/build-campus-map.js. No editar: modificar campusMap.template.html.\n';
fs.writeFileSync(outputPath, `${banner}export default ${JSON.stringify(html)};\n`);
console.log(`Mapa del campus generado (${Math.round(html.length / 1024)} KB): ${path.relative(root, outputPath)}`);
