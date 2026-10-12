import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CampusMapView from '../../components/campus/map/CampusMapView';
import SpaceDetailModal from '../../components/campus/SpaceDetailModal';
import AppIcon from '../../components/common/AppIcon';
import AppLoader from '../../components/common/AppLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenHeader from '../../components/common/ScreenHeader';
import SearchBar from '../../components/common/SearchBar';
import { pickCampusPlan, useCampusSpaceSearch, usePlanDetail, usePlans } from '../../hooks/useCampusMap';
import useSpaces from '../../hooks/useSpaces';
import colors from '../../theme/colors';
import { useLayout } from '../../theme/layout';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import { ALL_VALUE, categoryLabel } from '../../utils/category.utils';

const TAP_START = 'tap';

const PANEL_WIDTH = 360;

const CampusMapScreen = ({ navigation, route }) => {
  const requestedId = route.params ? route.params.spaceId : undefined;
  const layout = useLayout();
  const wide = layout.isExpanded;
  const { plans, loading: plansLoading, error: plansError, refresh } = usePlans();
  const { spaces } = useSpaces(ALL_VALUE);
  const campus = useMemo(() => pickCampusPlan(plans), [plans]);
  const {
    plan,
    loading: planLoading,
    error: planError,
  } = usePlanDetail(campus ? campus.id : null, campus ? campus.actualizadoEn : null);
  const [selectedId, setSelectedId] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState(null);
  const [notice, setNotice] = useState(null);
  const [mapInfo, setMapInfo] = useState({ entradas: [], navegacion: false });
  const [start, setStart] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routing, setRouting] = useState(false);
  const mapRef = useRef(null);

  const spacesById = useMemo(() => new Map(spaces.map((space) => [space.id, space])), [spaces]);
  const results = useCampusSpaceSearch(spaces, query);
  const selected = selectedId ? spacesById.get(selectedId) : null;
  const entradas = mapInfo.entradas || [];
  const startOptions = [...entradas, { id: TAP_START, nombre: 'Tocar el mapa' }];
  const showSearch = wide || searchOpen;
  const searching = query.trim().length >= 2;

  const resetRoute = () => {
    setRouteInfo(null);
    setRouting(false);
    setStart(null);
    if (mapRef.current) {
      mapRef.current.clearRoute();
    }
  };

  const focusSpace = (space) => {
    setNotice(null);
    resetRoute();
    if (!space.geometria) {
      setNotice(`${space.nombre} todavía no está ubicado en el mapa.`);
      setDetail(space);
      return;
    }
    setSelectedId(space.id);
    if (space.id === selectedId && mapRef.current) {
      mapRef.current.highlight(space.id);
    }
  };

  useEffect(() => {
    if (requestedId && spacesById.has(requestedId)) {
      focusSpace(spacesById.get(requestedId));
      navigation.setParams({ spaceId: undefined });
    }
  }, [requestedId, spacesById]);

  const closeSearch = () => {
    Keyboard.dismiss();
    setQuery('');
    setSearchOpen(false);
  };

  const choose = (space) => {
    closeSearch();
    focusSpace(space);
  };

  const requestRoute = (startId) => {
    if (!selected || !mapRef.current) {
      return;
    }
    setStart(startId);
    setNotice(null);
    setRouteInfo(null);
    setRouting(true);
    mapRef.current.route(selected.id, startId);
  };

  const header = <ScreenHeader title="Campus" subtitle="Mapa del campus" />;

  if (plansLoading) {
    return (
      <View style={styles.root}>
        {header}
        <AppLoader fill />
      </View>
    );
  }

  if (!campus) {
    return (
      <View style={styles.root}>
        {header}
        <View style={styles.fill}>
          {plansError ? (
            <View style={styles.padded}>
              <ErrorBanner message={plansError} onRetry={refresh} />
            </View>
          ) : (
            <EmptyState icon="map-outline" message="Aún no hay mapa del campus" />
          )}
        </View>
      </View>
    );
  }

  let map;
  if (planLoading && !plan) {
    map = <AppLoader fill />;
  } else if (plan) {
    map = (
      <CampusMapView
        ref={mapRef}
        plan={plan}
        selectedId={selectedId}
        onReady={(info) => setMapInfo({ entradas: info.entradas || [], navegacion: Boolean(info.navegacion) })}
        onSpacePress={(id) => {
          setSelectedId(id);
          setNotice(null);
          resetRoute();
        }}
        onNotFound={() => setNotice('Este espacio no aparece en el mapa.')}
        onRoute={(info) => {
          setNotice(null);
          setRouting(false);
          setRouteInfo(info);
        }}
        onRouteError={(message) => {
          setRouting(false);
          setNotice(message);
        }}
      />
    );
  } else if (planError) {
    map = (
      <View style={styles.padded}>
        <ErrorBanner message={planError} />
      </View>
    );
  } else {
    map = <EmptyState icon="map-outline" message="El mapa del campus no está disponible" />;
  }

  const resultList = searching ? (
    <View style={wide ? styles.resultsPanel : styles.resultsFloating}>
      {results.length === 0 ? (
        <Text style={styles.noResults}>No encontramos espacios con esa búsqueda</Text>
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.resultsScroll}>
          {results.map((space) => (
            <Pressable
              key={space.id}
              onPress={() => choose(space)}
              style={({ pressed }) => [styles.result, pressed && styles.resultPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Ver ${space.nombre} en el mapa`}
            >
              <AppIcon
                name={space.ubicado ? 'location-outline' : 'help-circle-outline'}
                size={18}
                color={space.ubicado ? colors.primary : colors.gray3}
              />
              <View style={styles.resultText}>
                <Text style={styles.resultName} numberOfLines={1}>
                  {space.nombre}
                </Text>
                <Text style={styles.resultMeta} numberOfLines={1}>
                  {[
                    space.codigo,
                    space.edificio,
                    space.piso ? `Piso ${space.piso}` : null,
                    space.ubicado ? null : 'Sin ubicar',
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  ) : null;

  const selectedCard = selected ? (
    <View style={wide ? styles.panelCard : styles.sheet}>
      <View style={styles.sheetHeader}>
        <View style={styles.sheetTitle}>
          <Text style={styles.sheetName} numberOfLines={2}>
            {selected.nombre}
          </Text>
          <Text style={styles.sheetMeta} numberOfLines={2}>
            {[
              selected.codigo,
              categoryLabel(selected.categoria),
              selected.edificio,
              selected.piso ? `Piso ${selected.piso}` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </View>
        <Pressable
          onPress={() => setDetail(selected)}
          hitSlop={10}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Ver detalle"
        >
          <AppIcon name="information-circle-outline" size={24} color={colors.primary} />
        </Pressable>
      </View>
      {mapInfo.navegacion ? (
        <>
          <Text style={styles.sheetLabel}>Cómo llegar desde</Text>
          <ScrollView
            horizontal={!wide}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={wide ? styles.chipsWrap : styles.chips}
          >
            {startOptions.map((option) => (
              <Pressable
                key={option.id}
                onPress={() => requestRoute(option.id)}
                style={[styles.chip, start === option.id && styles.chipActive]}
                accessibilityRole="button"
              >
                <AppIcon
                  name={option.id === TAP_START ? 'hand-left-outline' : 'walk-outline'}
                  size={14}
                  color={start === option.id ? colors.white : colors.primary}
                />
                <Text style={[styles.chipText, start === option.id && styles.chipTextActive]} numberOfLines={1}>
                  {option.nombre}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          {routing && start === TAP_START ? (
            <Text style={styles.routeHint}>Toca en el mapa el punto donde estás</Text>
          ) : null}
          {routing && start !== TAP_START ? <Text style={styles.routeHint}>Calculando el camino…</Text> : null}
          {routeInfo ? (
            <View style={styles.routeRow}>
              <AppIcon name="footsteps-outline" size={18} color={colors.primary} />
              <Text style={styles.routeText}>
                {`${routeInfo.minutos} min caminando · ${routeInfo.distancia} m`}
                {routeInfo.piso && routeInfo.piso !== '1' ? ` · Sube al piso ${routeInfo.piso}` : ''}
              </Text>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  ) : null;

  const noticeBanner = notice ? (
    <View style={wide ? styles.panelNotice : styles.floatingNotice}>
      <ErrorBanner message={notice} variant="info" />
    </View>
  ) : null;

  const modal = (
    <SpaceDetailModal
      space={detail}
      onClose={() => setDetail(null)}
      onShowOnMap={(space) => {
        setDetail(null);
        focusSpace(space);
      }}
    />
  );

  if (wide) {
    return (
      <View style={styles.root}>
        {header}
        <View style={styles.split}>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Buscar un espacio</Text>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Nombre o código, por ejemplo Aula 2 101"
              style={styles.panelSearch}
            />
            {resultList}
            {!searching ? (
              <ScrollView contentContainerStyle={styles.panelBody}>
                {noticeBanner}
                {selectedCard || (
                  <Text style={styles.panelHint}>
                    Toca un espacio en el mapa o búscalo por su nombre para ver cómo llegar.
                  </Text>
                )}
              </ScrollView>
            ) : null}
          </View>
          <View style={styles.mapArea}>{map}</View>
        </View>
        {modal}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {header}
      <View style={styles.mapArea}>
        {map}
        {showSearch ? (
          <View style={styles.searchOverlay}>
            <View style={styles.searchRow}>
              <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder="Nombre o código del espacio"
                autoFocus
                style={styles.overlaySearch}
              />
              <Pressable
                onPress={closeSearch}
                hitSlop={10}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Cerrar búsqueda"
              >
                <AppIcon name="close" size={22} color={colors.gray1} />
              </Pressable>
            </View>
            {resultList}
          </View>
        ) : (
          <Pressable
            onPress={() => setSearchOpen(true)}
            style={({ pressed }) => [styles.searchPill, pressed && styles.resultPressed]}
            accessibilityRole="button"
            accessibilityLabel="Buscar un espacio"
          >
            <AppIcon name="search" size={16} color={colors.primary} />
            <Text style={styles.searchPillText}>Buscar</Text>
          </Pressable>
        )}
        {!showSearch ? noticeBanner : null}
      </View>
      {!showSearch ? selectedCard : null}
      {modal}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
  },
  padded: {
    margin: spacing.lg,
  },
  mapArea: {
    flex: 1,
  },
  split: {
    flex: 1,
    flexDirection: 'row',
  },
  panel: {
    width: PANEL_WIDTH,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.gray4,
  },
  panelTitle: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: colors.gray3,
    textTransform: 'uppercase',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  panelSearch: {
    marginTop: spacing.sm,
  },
  panelBody: {
    paddingBottom: spacing.xl,
  },
  panelHint: {
    fontSize: fontSizes.body,
    color: colors.gray2,
    marginHorizontal: spacing.lg,
    lineHeight: 20,
  },
  panelNotice: {
    marginHorizontal: spacing.lg,
  },
  panelCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.gray4,
    backgroundColor: colors.white,
  },
  resultsPanel: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: colors.gray4,
  },
  resultsFloating: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: spacing.xs,
    maxHeight: 360,
    ...cardShadow,
  },
  resultsScroll: {
    flexGrow: 0,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  resultPressed: {
    backgroundColor: colors.pale,
  },
  resultText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  resultName: {
    fontSize: fontSizes.body,
    fontWeight: '600',
    color: colors.gray1,
  },
  resultMeta: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginTop: 2,
  },
  noResults: {
    fontSize: fontSizes.body,
    color: colors.gray2,
    padding: spacing.lg,
  },
  searchPill: {
    position: 'absolute',
    top: spacing.md,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    backgroundColor: colors.white,
    ...cardShadow,
  },
  searchPillText: {
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  overlaySearch: {
    flex: 1,
    marginHorizontal: 0,
    marginVertical: spacing.sm,
    ...cardShadow,
  },
  closeButton: {
    width: 44,
    height: 44,
    marginLeft: spacing.sm,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...cardShadow,
  },
  floatingNotice: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray4,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetTitle: {
    flex: 1,
    marginRight: spacing.sm,
  },
  sheetName: {
    fontSize: fontSizes.section,
    fontWeight: '700',
    color: colors.gray1,
  },
  sheetMeta: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginTop: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetLabel: {
    fontSize: fontSizes.label,
    fontWeight: '700',
    color: colors.gray3,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  chips: {
    paddingVertical: spacing.xs,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.chip,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    maxWidth: 280,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: fontSizes.small,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  chipTextActive: {
    color: colors.white,
  },
  routeHint: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginTop: spacing.xs,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  routeText: {
    flex: 1,
    fontSize: fontSizes.body,
    fontWeight: '600',
    color: colors.gray1,
    marginLeft: spacing.sm,
  },
});

export default CampusMapScreen;
