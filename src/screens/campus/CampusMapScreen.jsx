import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CampusMapView from '../../components/campus/map/CampusMapView';
import SpaceDetailModal from '../../components/campus/SpaceDetailModal';
import AppIcon from '../../components/common/AppIcon';
import AppLoader from '../../components/common/AppLoader';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SearchBar from '../../components/common/SearchBar';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import { pickCampusPlan, useMappedSpaceSearch, usePlanDetail, usePlans } from '../../hooks/useCampusMap';
import useSpaces from '../../hooks/useSpaces';
import { CAMPUS_MODULE_TABS } from '../../navigation/tabItems';
import colors from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import { ALL_VALUE, categoryLabel } from '../../utils/category.utils';

const TAP_START = 'tap';

const CampusMapScreen = ({ navigation, route }) => {
  const requestedId = route.params ? route.params.spaceId : undefined;
  const { plans, loading: plansLoading, error: plansError, refresh } = usePlans();
  const { spaces } = useSpaces(ALL_VALUE);
  const campus = useMemo(() => pickCampusPlan(plans), [plans]);
  const {
    plan,
    loading: planLoading,
    error: planError,
  } = usePlanDetail(campus ? campus.id : null, campus ? campus.actualizadoEn : null);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState(null);
  const [notice, setNotice] = useState(null);
  const [mapInfo, setMapInfo] = useState({ entradas: [], navegacion: false });
  const [start, setStart] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routing, setRouting] = useState(false);
  const mapRef = useRef(null);

  const spacesById = useMemo(() => new Map(spaces.map((space) => [space.id, space])), [spaces]);
  const results = useMappedSpaceSearch(spaces, query);
  const selected = selectedId ? spacesById.get(selectedId) : null;
  const entradas = mapInfo.entradas || [];
  const startOptions = [...entradas, { id: TAP_START, nombre: 'Tocar el mapa' }];

  const focusSpace = (space) => {
    setNotice(null);
    setRouteInfo(null);
    setRouting(false);
    if (mapRef.current) {
      mapRef.current.clearRoute();
    }
    if (!space.geometria) {
      setNotice(`${space.nombre} todavía no está ubicado en el mapa.`);
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

  const choose = (space) => {
    Keyboard.dismiss();
    setQuery('');
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
          setRouteInfo(null);
          setRouting(false);
          if (mapRef.current) {
            mapRef.current.clearRoute();
          }
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

  const header = <ScreenHeader title="Campus" subtitle="Mapa del campus" />;
  const tabs = (
    <SegmentedTabs items={CAMPUS_MODULE_TABS} current="CampusMap" onChange={(name) => navigation.navigate(name)} />
  );

  if (plansLoading) {
    return (
      <ScreenContainer header={header}>
        {tabs}
        <AppLoader fill />
      </ScreenContainer>
    );
  }

  if (!campus) {
    return (
      <ScreenContainer header={header}>
        {tabs}
        <View style={styles.fill}>
          {plansError ? (
            <View style={styles.padded}>
              <ErrorBanner message={plansError} onRetry={refresh} />
            </View>
          ) : (
            <EmptyState icon="map-outline" message="Aún no hay mapa del campus" />
          )}
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer header={header}>
      {tabs}
      <SearchBar value={query} onChangeText={setQuery} placeholder="¿Qué salón buscas? Nombre o código" />
      {notice ? (
        <View style={styles.padded}>
          <ErrorBanner message={notice} variant="info" />
        </View>
      ) : null}
      <View style={styles.mapArea}>
        {map}
        {results.length > 0 ? (
          <View style={styles.results}>
            {results.map((space) => (
              <Pressable
                key={space.id}
                onPress={() => choose(space)}
                style={({ pressed }) => [styles.result, pressed && styles.resultPressed]}
                accessibilityRole="button"
                accessibilityLabel={`Ver ${space.nombre} en el mapa`}
              >
                <AppIcon name="location-outline" size={16} color={colors.primary} />
                <View style={styles.resultText}>
                  <Text style={styles.resultName} numberOfLines={1}>
                    {space.nombre}
                  </Text>
                  <Text style={styles.resultMeta} numberOfLines={1}>
                    {[space.codigo, space.edificio, space.piso ? `Piso ${space.piso}` : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : null}
        {query.trim().length >= 2 && results.length === 0 ? (
          <View style={styles.results}>
            <Text style={styles.noResults}>No hay salones ubicados con esa búsqueda</Text>
          </View>
        ) : null}
      </View>
      {selected && results.length === 0 ? (
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitle}>
              <Text style={styles.sheetName} numberOfLines={1}>
                {selected.nombre}
              </Text>
              <Text style={styles.sheetMeta} numberOfLines={1}>
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
            <Pressable onPress={() => setDetail(selected)} accessibilityRole="button" accessibilityLabel="Ver detalle">
              <AppIcon name="information-circle-outline" size={24} color={colors.primary} />
            </Pressable>
          </View>
          {mapInfo.navegacion ? (
            <>
              <Text style={styles.sheetLabel}>Cómo llegar desde</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
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
              {routing && start !== TAP_START ? <Text style={styles.routeText}>Calculando el camino…</Text> : null}
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
      ) : null}
      <SpaceDetailModal space={detail} onClose={() => setDetail(null)} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  padded: {
    marginHorizontal: spacing.lg,
  },
  mapArea: {
    flex: 1,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray4,
  },
  results: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: spacing.xs,
    ...cardShadow,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  resultPressed: {
    backgroundColor: colors.pale,
  },
  resultText: {
    flex: 1,
    marginLeft: spacing.sm,
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
    fontSize: fontSizes.small,
    color: colors.gray2,
    padding: spacing.md,
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
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginRight: spacing.sm,
    maxWidth: 260,
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
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  routeText: {
    fontSize: fontSizes.body,
    fontWeight: '600',
    color: colors.gray1,
    marginLeft: spacing.xs,
    marginTop: spacing.xs,
  },
});

export default CampusMapScreen;
