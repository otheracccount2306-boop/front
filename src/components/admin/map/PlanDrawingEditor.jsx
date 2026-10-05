import React from 'react';
import EmptyState from '../../common/EmptyState';

/**
 * @description Versión móvil del editor de planos. Dibujar polígonos requiere ratón y el lienzo del
 *              navegador (Leaflet.draw), así que en el móvil solo se indica dónde hacerlo. El panel web
 *              usa PlanDrawingEditor.web.jsx.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {React.JSX.Element} Aviso
 */
const PlanDrawingEditor = () => (
  <EmptyState icon="desktop-outline" message="El dibujo de espacios está disponible en el panel web, desde un computador." />
);

export default PlanDrawingEditor;
