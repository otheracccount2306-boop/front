import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import colors from '../../../theme/colors';
import AppLoader from '../../common/AppLoader';
import { buildMapHtml, parseMapMessage } from './buildMapHtml';

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
