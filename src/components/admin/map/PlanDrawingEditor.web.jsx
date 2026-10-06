import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import colors from '../../../theme/colors';

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
.plan-editor.hide-codes .space-code { display: none; }
`;

let cssInjected = false;

const injectEditorCss = () => {
  if (cssInjected) {
    return;
  }
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(EDITOR_CSS));
  document.head.appendChild(style);
  cssInjected = true;
};

const textLabel = (text) => {
  const span = document.createElement('span');
  span.textContent = text || '';
  return span;
};

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

const PlanDrawingEditor = ({ plan, shapes, selectedId, onSelect, onDraw, onEdit, onRemove }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const groupRef = useRef(null);
  const layersRef = useRef(new Map());
  const propsRef = useRef({});
  propsRef.current = { selectedId, onSelect, onDraw, onEdit, onRemove };

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
    const codesZoom = map.getZoom() + (Math.max(plan.ancho, plan.alto) > 3000 ? 1.5 : 0);
    const toggleCodes = () => {
      const wrapper = containerRef.current && containerRef.current.parentElement;
      if (wrapper) {
        wrapper.classList.toggle('hide-codes', map.getZoom() < codesZoom);
      }
    };
    map.on('zoomend', toggleCodes);
    toggleCodes();

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
