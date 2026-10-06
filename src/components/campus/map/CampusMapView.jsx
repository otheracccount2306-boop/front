import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import colors from '../../../theme/colors';
import AppLoader from '../../common/AppLoader';
import { buildMapHtml, parseMapMessage } from './buildMapHtml';

/**
 * @description Mapa interactivo del campus en un WebView, sin conexión: Leaflet con L.CRS.Simple sobre
 *              la imagen estática del plano. Para iluminar un salón, la app le envía su UUID con
 *              injectJavaScript a la función global window.highlightSpace del mapa, que pinta el
 *              polígono y centra la vista. Si el mapa aún no cargó, el pedido espera a que esté listo.
 *              La versión web es CampusMapView.web.jsx (iframe), con la misma interfaz.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.plan - Plano completo (imagen, ancho, alto y espacios con geometría)
 * @param {string|null} [props.selectedId] - UUID del espacio a iluminar; al cambiar se envía al mapa
 * @param {Function} [props.onSpacePress] - Recibe el UUID del salón que el estudiante tocó en el mapa
 * @param {Function} [props.onNotFound] - Recibe el UUID pedido cuando no está dibujado en este plano
 * @param {Function} [props.onReady] - Recibe { floors, entradas, navegacion } cuando el mapa terminó de cargar
 * @param {Function} [props.onRoute] - Recibe el resumen del camino { distancia, minutos, piso, nombre, desde }
 * @param {Function} [props.onRouteError] - Recibe el mensaje cuando no se pudo trazar el camino
 * @param {Function} [props.onPickStart] - Se ejecuta cuando el mapa espera que el estudiante toque su ubicación
 * @param {React.Ref} ref - Expone highlight(uuid), route(uuid, inicio), clearRoute(), clear() y fit()
 * @returns {React.JSX.Element} Mapa del plano
 */
const CampusMapView = forwardRef(
  ({ plan, selectedId, onSpacePress, onNotFound, onReady, onRoute, onRouteError, onPickStart }, ref) => {
    const webViewRef = useRef(null);
    const readyRef = useRef(false);
    const html = useMemo(() => buildMapHtml(plan), [plan]);

    const run = useCallback((script) => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`${script};true;`);
      }
    }, []);

    const highlight = useCallback(
      (id) => {
        if (!id) {
          run('window.clearHighlight && window.clearHighlight()');
          return;
        }
        // JSON.stringify deja el UUID como literal de texto seguro dentro del script inyectado.
        run(`window.highlightSpace && window.highlightSpace(${JSON.stringify(String(id))})`);
      },
      [run],
    );

    useImperativeHandle(
      ref,
      () => ({
        highlight,
        route: (id, start) =>
          run(
            `window.routeTo && window.routeTo(${JSON.stringify(String(id))}, ${JSON.stringify(start || 'principal')})`,
          ),
        clearRoute: () => run('window.clearRoute && window.clearRoute()'),
        clear: () => run('window.clearHighlight && window.clearHighlight()'),
        fit: () => run('window.fitPlan && window.fitPlan()'),
      }),
      [highlight, run],
    );

    // Cada vez que cambia el salón buscado se envía su UUID al mapa (si ya está listo).
    useEffect(() => {
      if (readyRef.current) {
        highlight(selectedId);
      }
    }, [selectedId, highlight]);

    const handleMessage = (event) => {
      const message = parseMapMessage(event.nativeEvent.data);
      if (!message) {
        return;
      }
      if (message.type === 'ready') {
        readyRef.current = true;
        if (selectedId) {
          highlight(selectedId);
        }
        if (onReady) {
          onReady(message.payload);
        }
      } else if (message.type === 'spacePress' && onSpacePress) {
        onSpacePress(message.payload.id);
      } else if (message.type === 'notFound' && onNotFound) {
        onNotFound(message.payload.id);
      } else if (message.type === 'route' && onRoute) {
        onRoute(message.payload);
      } else if (message.type === 'routeError' && onRouteError) {
        onRouteError(message.payload.message);
      } else if (message.type === 'pickStart' && onPickStart) {
        onPickStart();
      }
    };

    return (
      <View style={styles.container}>
        <WebView
          key={plan.id}
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html, baseUrl: '' }}
          onMessage={handleMessage}
          onLoadStart={() => {
            readyRef.current = false;
          }}
          javaScriptEnabled
          domStorageEnabled={false}
          cacheEnabled={false}
          setSupportMultipleWindows={false}
          allowsBackForwardNavigationGestures={false}
          scrollEnabled={false}
          bounces={false}
          overScrollMode="never"
          startInLoadingState
          renderLoading={() => <AppLoader fill />}
          style={styles.webview}
        />
      </View>
    );
  },
);

CampusMapView.displayName = 'CampusMapView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default CampusMapView;
