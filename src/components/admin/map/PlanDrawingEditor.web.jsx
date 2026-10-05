import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import colors from '../../../theme/colors';

/**
 * Textos de la barra de Leaflet.draw en español. Solo se usan polígono y rectángulo, más editar y
 * borrar; el resto de herramientas está desactivado.
 */
const applySpanishLabels = () => {
  const local = L.drawLocal;
  local.draw.toolbar.buttons.polygon = 'Dibujar el espacio (polígono)';
  local.draw.toolbar.buttons.rectangle = 'Dibujar el espacio (rectángulo)';
  local.draw.toolbar.actions = { title: 'Cancelar el dibujo', text: 'Cancelar' };
  local.draw.toolbar.finish = { title: 'Terminar el polígono', text: 'Terminar' };
  local.draw.toolbar.undo = { title: 'Borrar el último punto', text: 'Deshacer punto' };
  local.draw.handlers.polygon.tooltip = {
    start: 'Haz clic en una esquina del salón.',
    cont: 'Haz clic en la siguiente esquina.',
    end: 'Haz clic en el primer punto para cerrar el salón.',
  };
  local.draw.handlers.polyline.error = '<strong>Error:</strong> los bordes no se pueden cruzar.';
  local.draw.handlers.rectangle.tooltip = { start: 'Haz clic y arrastra para dibujar el salón.' };
  local.draw.handlers.simpleshape.tooltip = { end: 'Suelta el botón para terminar.' };
  local.edit.toolbar.actions.save = { title: 'Guardar los cambios', text: 'Guardar' };
  local.edit.toolbar.actions.cancel = { title: 'Descartar los cambios', text: 'Cancelar' };
  local.edit.toolbar.actions.clearAll = { title: 'Quitar todos', text: 'Quitar todos' };
  local.edit.toolbar.buttons.edit = 'Mover vértices de los espacios';
  local.edit.toolbar.buttons.editDisabled = 'No hay espacios dibujados';
  local.edit.toolbar.buttons.remove = 'Quitar espacios del plano';
  local.edit.toolbar.buttons.removeDisabled = 'No hay espacios dibujados';
  local.edit.handlers.edit.tooltip = {
    text: 'Arrastra los vértices para ajustar el salón.',
    subtext: 'Pulsa Cancelar para deshacer.',
  };
  local.edit.handlers.remove.tooltip = { text: 'Haz clic en un espacio para quitarlo.' };
};

/** Estilos propios del editor: etiquetas de código y barra deshabilitada sin espacio elegido. */
const EDITOR_CSS = `
.plan-editor .space-code {
  background: ${colors.white};
  border: 1px solid ${colors.gray4};
  border-radius: 6px;
  color: ${colors.gray1};
  font-size: 11px;
  font-weight: 700;
  padding: 1px 5px;
  box-shadow: none;
}
.plan-editor .space-code::before { display: none; }
.plan-editor.no-selection .leaflet-draw-draw-polygon,
.plan-editor.no-selection .leaflet-draw-draw-rectangle {
  opacity: 0.35;
  pointer-events: none;
}
.plan-editor .leaflet-container { background: ${colors.background}; cursor: default; }
`;

let cssInjected = false;

/**
 * @description Inserta una sola vez la hoja de estilos del editor.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {void}
 */
const injectEditorCss = () => {
  if (cssInjected) {
    return;
  }
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(EDITOR_CSS));
  document.head.appendChild(style);
  cssInjected = true;
};

/**
 * @description Crea un nodo de texto para una etiqueta: los nombres vienen de la base de datos y no
 *              deben interpretarse como HTML.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} text - Texto de la etiqueta
 * @returns {HTMLElement} Elemento span con el texto
 */
const textLabel = (text) => {
  const span = document.createElement('span');
  span.textContent = text || '';
  return span;
};

/**
 * @description Ajusta los vértices al rectángulo de la imagen para que nunca se guarde un polígono
 *              fuera del plano, aunque el clic haya caído en el borde gris.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} geometry - GeoJSON Polygon producido por Leaflet ([x, y] = [lng, lat])
 * @param {number} ancho - Ancho del plano en píxeles
 * @param {number} alto - Alto del plano en píxeles
 * @returns {Object} GeoJSON Polygon dentro de la imagen
 */
export const clampToPlan = (geometry, ancho, alto) => ({
  type: 'Polygon',
  coordinates: geometry.coordinates.map((ring) =>
    ring.map(([x, y]) => [
      Math.round(Math.min(ancho, Math.max(0, x)) * 100) / 100,
      Math.round(Math.min(alto, Math.max(0, y)) * 100) / 100,
    ]),
  ),
});

const idleStyle = () => ({ color: colors.primary, weight: 2, fillColor: colors.light, fillOpacity: 0.25 });
const selectedStyle = () => ({ color: colors.primaryDark, weight: 3, fillColor: colors.accent, fillOpacity: 0.5 });

/**
 * @description Editor visual de planos (solo web) con Leaflet + Leaflet.draw sobre L.CRS.Simple. Muestra
 *              la imagen del plano y los polígonos ya guardados; el administrador elige un espacio en
 *              la lista y lo dibuja con la herramienta de polígono o rectángulo. Cada trazo, edición o
 *              borrado se convierte en GeoJSON y se entrega a los callbacks, que lo guardan en la API
 *              sin que el administrador vea ni escriba código.
 *              Es un componente controlado: dibuja exactamente lo que llega en `shapes`.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.plan - Plano con imagen, ancho y alto
 * @param {Object<string, {geometria: Object, codigo: string}>} props.shapes - Polígonos por UUID de espacio
 * @param {string|null} props.selectedId - Espacio elegido en la lista; habilita el dibujo
 * @param {Function} props.onSelect - Recibe el UUID del polígono en el que se hizo clic
 * @param {Function} props.onDraw - Recibe la geometría GeoJSON del nuevo trazo del espacio elegido
 * @param {Function} props.onEdit - Recibe [{ id, geometria }] con los polígonos modificados
 * @param {Function} props.onRemove - Recibe [id] de los espacios quitados del plano
 * @returns {React.JSX.Element} Lienzo del editor
 */
const PlanDrawingEditor = ({ plan, shapes, selectedId, onSelect, onDraw, onEdit, onRemove }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const groupRef = useRef(null);
  const layersRef = useRef(new Map());
  const propsRef = useRef({});
  propsRef.current = { selectedId, onSelect, onDraw, onEdit, onRemove };

  // Mapa: se crea una vez por plano.
  useEffect(() => {
    injectEditorCss();
    applySpanishLabels();

    const bounds = L.latLngBounds([0, 0], [plan.alto, plan.ancho]);
    const map = L.map(containerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -6,
      maxZoom: 4,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      attributionControl: false,
      maxBounds: bounds.pad(0.5),
    });
    L.imageOverlay(plan.imagen, bounds).addTo(map);
    map.fitBounds(bounds);

    const group = L.featureGroup().addTo(map);
    const draw = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polygon: { allowIntersection: false, showArea: false, showLength: false, shapeOptions: selectedStyle() },
        rectangle: { showArea: false, shapeOptions: selectedStyle() },
        polyline: false,
        circle: false,
        circlemarker: false,
        marker: false,
      },
      edit: { featureGroup: group, remove: true },
    });
    map.addControl(draw);

    const geometryOf = (layer) => clampToPlan(layer.toGeoJSON().geometry, plan.ancho, plan.alto);

    map.on(L.Draw.Event.CREATED, (event) => {
      const { selectedId: target, onDraw: handle } = propsRef.current;
      // La capa nueva no se agrega al mapa: el padre guarda y la redibuja desde `shapes`.
      if (target) {
        handle(geometryOf(event.layer));
      }
    });
    map.on(L.Draw.Event.EDITED, (event) => {
      const changes = [];
      event.layers.eachLayer((layer) => changes.push({ id: layer.spaceId, geometria: geometryOf(layer) }));
      if (changes.length > 0) {
        propsRef.current.onEdit(changes);
      }
    });
    map.on(L.Draw.Event.DELETED, (event) => {
      const ids = [];
      event.layers.eachLayer((layer) => ids.push(layer.spaceId));
      if (ids.length > 0) {
        propsRef.current.onRemove(ids);
      }
    });

    // Si el plano se veía completo, al cambiar el tamaño del lienzo se vuelve a encuadrar.
    const resize = new ResizeObserver(() => {
      const wasWhole = map.getBounds().contains(bounds);
      map.invalidateSize();
      if (wasWhole) {
        map.fitBounds(bounds, { animate: false });
      }
    });
    resize.observe(containerRef.current);

    mapRef.current = map;
    groupRef.current = group;
    layersRef.current = new Map();
    return () => {
      resize.disconnect();
      map.remove();
      mapRef.current = null;
      groupRef.current = null;
    };
  }, [plan.id, plan.imagen, plan.ancho, plan.alto]);

  // Polígonos: se sincronizan con `shapes` sin rehacer el mapa.
  useEffect(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    const layers = layersRef.current;
    layers.forEach((layer, id) => {
      const shape = shapes[id];
      if (!shape || layer.geometryKey !== JSON.stringify(shape.geometria)) {
        group.removeLayer(layer);
        layers.delete(id);
      }
    });
    Object.entries(shapes).forEach(([id, shape]) => {
      if (layers.has(id) || !shape.geometria) {
        return;
      }
      const layer = L.geoJSON(shape.geometria).getLayers()[0];
      if (!layer) {
        return;
      }
      layer.spaceId = id;
      layer.geometryKey = JSON.stringify(shape.geometria);
      layer.bindTooltip(textLabel(shape.codigo), { permanent: true, direction: 'center', className: 'space-code' });
      layer.on('click', () => propsRef.current.onSelect(id));
      group.addLayer(layer);
      layers.set(id, layer);
    });
  }, [shapes, plan.id]);

  // Selección: resalta el espacio elegido y habilita o no las herramientas de dibujo.
  useEffect(() => {
    layersRef.current.forEach((layer, id) => {
      layer.setStyle(id === selectedId ? selectedStyle() : idleStyle());
      if (id === selectedId) {
        layer.bringToFront();
      }
    });
    const selected = selectedId ? layersRef.current.get(selectedId) : null;
    if (selected && mapRef.current && !mapRef.current.getBounds().contains(selected.getBounds())) {
      mapRef.current.flyToBounds(selected.getBounds(), { padding: [60, 60], maxZoom: 1, duration: 0.4 });
    }
  }, [selectedId, shapes]);

  return (
    <View style={styles.container}>
      {/* La clase va en un contenedor externo: Leaflet agrega sus propias clases al div del mapa. */}
      <div className={`plan-editor${selectedId ? '' : ' no-selection'}`} style={canvasStyle}>
        <div ref={containerRef} style={canvasStyle} />
      </div>
    </View>
  );
};

const canvasStyle = { position: 'absolute', inset: 0 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 420,
    backgroundColor: colors.background,
  },
});

export default PlanDrawingEditor;
