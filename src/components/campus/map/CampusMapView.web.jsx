import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../../theme/colors';
import { APP_MESSAGE_SOURCE, buildMapHtml, parseMapMessage } from './buildMapHtml';

/**
 * @description Versión web de CampusMapView: react-native-webview no funciona en el navegador, así que
 *              el mismo HTML del mapa se muestra en un iframe (srcdoc) y la app le envía el UUID con
 *              postMessage. Tiene la misma interfaz que la versión móvil.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente (ver CampusMapView.jsx)
 * @param {React.Ref} ref - Expone highlight(uuid), clear() y fit()
 * @returns {React.JSX.Element} Mapa del plano
 */
const CampusMapView = forwardRef(
  ({ plan, selectedId, onSpacePress, onNotFound, onReady, onRoute, onRouteError, onPickStart }, ref) => {
    const frameRef = useRef(null);
    const readyRef = useRef(false);
    const html = useMemo(() => buildMapHtml(plan), [plan]);
    const callbacks = useRef({});
    callbacks.current = { onSpacePress, onNotFound, onReady, onRoute, onRouteError, onPickStart, selectedId };

    const post = useCallback((message) => {
      const frame = frameRef.current;
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage(JSON.stringify({ source: APP_MESSAGE_SOURCE, ...message }), '*');
      }
    }, []);

    const highlight = useCallback((id) => post(id ? { type: 'highlight', id: String(id) } : { type: 'clear' }), [post]);

    useImperativeHandle(
      ref,
      () => ({
        highlight,
        route: (id, start) => post({ type: 'route', id: String(id), start: start || 'principal' }),
        clearRoute: () => post({ type: 'clearRoute' }),
        clear: () => post({ type: 'clear' }),
        fit: () => post({ type: 'fit' }),
      }),
      [highlight, post],
    );

    useEffect(() => {
      readyRef.current = false;
    }, [html]);

    useEffect(() => {
      if (readyRef.current) {
        highlight(selectedId);
      }
    }, [selectedId, highlight]);

    useEffect(() => {
      const onMessage = (event) => {
        if (!frameRef.current || event.source !== frameRef.current.contentWindow) {
          return;
        }
        const message = parseMapMessage(event.data);
        if (!message) {
          return;
        }
        const current = callbacks.current;
        if (message.type === 'ready') {
          readyRef.current = true;
          if (current.selectedId) {
            highlight(current.selectedId);
          }
          if (current.onReady) {
            current.onReady(message.payload);
          }
        } else if (message.type === 'spacePress' && current.onSpacePress) {
          current.onSpacePress(message.payload.id);
        } else if (message.type === 'notFound' && current.onNotFound) {
          current.onNotFound(message.payload.id);
        } else if (message.type === 'route' && current.onRoute) {
          current.onRoute(message.payload);
        } else if (message.type === 'routeError' && current.onRouteError) {
          current.onRouteError(message.payload.message);
        } else if (message.type === 'pickStart' && current.onPickStart) {
          current.onPickStart();
        }
      };
      window.addEventListener('message', onMessage);
      return () => window.removeEventListener('message', onMessage);
    }, [highlight]);

    return (
      <View style={styles.container}>
        <iframe
          key={plan.id}
          ref={frameRef}
          title={`Plano ${plan.nombre || ''}`}
          srcDoc={html}
          sandbox="allow-scripts"
          style={frameStyle}
        />
      </View>
    );
  },
);

CampusMapView.displayName = 'CampusMapView';

const frameStyle = { border: 0, width: '100%', height: '100%', display: 'block', backgroundColor: colors.background };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
});

export default CampusMapView;
