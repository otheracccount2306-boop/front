import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import CampusMapView from '../../components/campus/map/CampusMapView';
import SpaceDetailModal from '../../components/campus/SpaceDetailModal';
import AppIcon from '../../components/common/AppIcon';
import AppLoader from '../../components/common/AppLoader';
import CategoryChips from '../../components/common/CategoryChips';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SearchBar from '../../components/common/SearchBar';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import { CAMPUS_MODULE_TABS } from '../../navigation/tabItems';
import { useMappedSpaceSearch, usePlanDetail, usePlans } from '../../hooks/useCampusMap';
import useSpaces from '../../hooks/useSpaces';
import colors from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import { ALL_VALUE } from '../../utils/category.utils';

/**
 * @description Etiqueta corta de un plano para los chips: piso si existe, si no el nombre.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} plan - Plano del listado
 * @returns {string} Texto del chip
 */
const planLabel = (plan) => plan.nombre || [plan.edificio, plan.piso].filter(Boolean).join(' · ');

/**
 * @description Pantalla del mapa interactivo del campus. El estudiante busca un salón por nombre o
 *              código (búsqueda local, funciona sin conexión) y la app envía su UUID al mapa, que
 *              ilumina el polígono y centra la vista. Si el salón está en otro plano, cambia de plano
 *              primero. Acepta route.params.spaceId para abrir el mapa ya enfocado en un espacio,
 *              por ejemplo desde el detalle de un espacio.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @param {Object} props.route - Ruta actual; route.params.spaceId es el espacio a mostrar
 * @returns {React.JSX.Element} Pantalla del mapa
 */
const CampusMapScreen = ({ navigation, route }) => {
  const requestedId = route.params ? route.params.spaceId : undefined;
  const { plans, loading: plansLoading, error: plansError, refresh } = usePlans();
  const { spaces } = useSpaces(ALL_VALUE);
  const [planId, setPlanId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState(null);
  const [notice, setNotice] = useState(null);
  const mapRef = useRef(null);

  const spacesById = useMemo(() => new Map(spaces.map((space) => [space.id, space])), [spaces]);
  const results = useMappedSpaceSearch(spaces, query);
  const currentPlan = plans.find((plan) => plan.id === planId);
  const { plan, loading: planLoading, error: planError } = usePlanDetail(
    planId,
    currentPlan ? currentPlan.actualizadoEn : null,
  );

  /**
   * @description Envía un espacio al mapa: cambia al plano donde está dibujado y lo ilumina.
   * @author Diego Luna <diego.luna@campusucc.edu.co>
   * @param {Object} space - Espacio con planoId y geometria
   * @returns {void}
   */
  const focusSpace = (space) => {
    setNotice(null);
    if (!space.planoId || !space.geometria) {
      setNotice(`${space.nombre} todavía no está ubicado en un plano.`);
      return;
    }
    setPlanId(space.planoId);
    setSelectedId(space.id);
    if (space.id === selectedId && mapRef.current) {
      // Mismo salón: se vuelve a enviar para repetir el centrado y el pulso.
      mapRef.current.highlight(space.id);
    }
  };

  // Plano inicial: el del espacio pedido por parámetro, o el primero de la lista.
  useEffect(() => {
    if (requestedId && spacesById.has(requestedId)) {
      focusSpace(spacesById.get(requestedId));
      navigation.setParams({ spaceId: undefined });
      return;
    }
    if (!planId && plans.length > 0) {
      setPlanId(plans[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedId, spacesById, plans]);

  const choose = (space) => {
    Keyboard.dismiss();
    setQuery('');
    focusSpace(space);
  };

  const chips = plans.map((item) => ({ value: item.id, label: planLabel(item) }));

  let map;
  if (planLoading && !plan) {
    map = <AppLoader fill />;
  } else if (plan) {
    map = (
      <CampusMapView
        ref={mapRef}
        plan={plan}
        selectedId={plan.id === planId ? selectedId : null}
        onSpacePress={(id) => {
          setSelectedId(id);
          setDetail(spacesById.get(id) || null);
        }}
        onNotFound={() => setNotice('Este espacio no aparece en el plano seleccionado.')}
      />
    );
  } else if (planError) {
    map = (
      <View style={styles.padded}>
        <ErrorBanner message={planError} />
      </View>
    );
  } else {
    map = <EmptyState icon="map-outline" message="Elige un plano para ver el mapa" />;
  }

  if (plansLoading) {
    return (
      <ScreenContainer header={<ScreenHeader title="Campus" subtitle="Mapa del campus" />}>
        <SegmentedTabs items={CAMPUS_MODULE_TABS} current="CampusMap" onChange={(name) => navigation.navigate(name)} />
        <AppLoader fill />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer header={<ScreenHeader title="Campus" subtitle="Mapa del campus" />}>
      <SegmentedTabs items={CAMPUS_MODULE_TABS} current="CampusMap" onChange={(name) => navigation.navigate(name)} />
      {plans.length === 0 ? (
        <View style={styles.fill}>
          {plansError ? (
            <View style={styles.padded}>
              <ErrorBanner message={plansError} onRetry={refresh} />
            </View>
          ) : (
            <EmptyState icon="map-outline" message="Aún no hay planos del campus" />
          )}
        </View>
      ) : (
        <>
          <SearchBar value={query} onChangeText={setQuery} placeholder="¿Qué salón buscas? Nombre o código" />
          {chips.length > 1 ? <CategoryChips chips={chips} selected={planId} onSelect={setPlanId} /> : null}
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
                        {[space.codigo, space.edificio, space.piso].filter(Boolean).join(' · ')}
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
        </>
      )}
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
});

export default CampusMapScreen;
