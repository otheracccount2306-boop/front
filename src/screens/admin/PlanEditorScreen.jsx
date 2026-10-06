import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { clearSpaceGeometry, getAdminPlan, listAllSpaces, saveSpaceGeometry } from '../../api/admin.api';
import AdminHeader from '../../components/admin/AdminHeader';
import PlanDrawingEditor from '../../components/admin/map/PlanDrawingEditor';
import AppButton from '../../components/common/AppButton';
import AppIcon from '../../components/common/AppIcon';
import AppLoader from '../../components/common/AppLoader';
import CategoryChips from '../../components/common/CategoryChips';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import colors from '../../theme/colors';
import { fontSizes, radius, spacing } from '../../theme/typography';
import { getAdminErrorMessage } from '../../utils/admin.utils';
import { matchesTerm } from '../../utils/text.utils';

const FILTERS = [
  { value: 'PENDING', label: 'Sin ubicar' },
  { value: 'HERE', label: 'En este plano' },
  { value: 'ALL', label: 'Todos' },
];

const WIDE_LAYOUT = 900;

const shapesOf = (spaces, planId) =>
  Object.fromEntries(
    spaces
      .filter((space) => space.planoId === planId && space.geometria)
      .map((space) => [space.id, { geometria: space.geometria, codigo: space.codigo }]),
  );

const downloadGeoJson = (plan, spaces) => {
  const collection = {
    type: 'FeatureCollection',
    properties: { planoId: plan.id, nombre: plan.nombre, ancho: plan.ancho, alto: plan.alto, crs: 'L.CRS.Simple (px)' },
    features: spaces.map((space) => ({
      type: 'Feature',
      id: space.id,
      properties: { id: space.id, codigo: space.codigo, nombre: space.nombre, categoria: space.categoria },
      geometry: space.geometria,
    })),
  };
  const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `plano-${(plan.nombre || plan.id).replace(/[^\w-]+/g, '_')}.geojson`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const PlanEditorScreen = ({ navigation, route }) => {
  const planId = route.params.planId;
  const { width } = useWindowDimensions();
  const wide = width >= WIDE_LAYOUT;
  const [plan, setPlan] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('PENDING');
  const [query, setQuery] = useState('');
  const [floor, setFloor] = useState('ALL');
  const [status, setStatus] = useState({ kind: 'idle', message: null });

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const [loadedPlan, loadedSpaces] = await Promise.all([getAdminPlan(planId), listAllSpaces()]);
      setPlan(loadedPlan);
      setSpaces(loadedSpaces);
    } catch (error) {
      setLoadError(getAdminErrorMessage(error));
    }
  }, [planId]);

  useEffect(() => {
    load();
  }, [load]);

  const floors = useMemo(() => {
    const set = new Set(spaces.filter((space) => space.planoId === planId && space.piso).map((space) => space.piso));
    return [...set].sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0) || a.localeCompare(b));
  }, [spaces, planId]);
  const onFloor = (space) => floor === 'ALL' || String(space.piso || '') === floor;
  const shapes = useMemo(
    () =>
      shapesOf(
        spaces.filter((space) => floor === 'ALL' || String(space.piso || '') === floor),
        planId,
      ),
    [spaces, planId, floor],
  );
  const selected = spaces.find((space) => space.id === selectedId) || null;

  const visible = useMemo(
    () =>
      spaces.filter((space) => {
        if (!onFloor(space) || !matchesTerm(space, ['nombre', 'codigo', 'edificio', 'piso'], query)) {
          return false;
        }
        if (filter === 'PENDING') {
          return !space.geometria;
        }
        if (filter === 'HERE') {
          return space.planoId === planId;
        }
        return true;
      }),
    [spaces, filter, query, planId, floor],
  );

  const replaceSpace = (updated) =>
    setSpaces((previous) => previous.map((space) => (space.id === updated.id ? { ...space, ...updated } : space)));

  const persist = async (task, done) => {
    setStatus({ kind: 'saving', message: 'Guardando…' });
    try {
      const updated = await task();
      updated.forEach(replaceSpace);
      setStatus({ kind: 'saved', message: done });
      return true;
    } catch (error) {
      setStatus({ kind: 'error', message: getAdminErrorMessage(error) });
      load();
      return false;
    }
  };

  const handleDraw = async (geometria) => {
    if (!selected) {
      return;
    }
    const target = selected;
    const moved = target.planoId && target.planoId !== planId;
    const replaced = target.planoId === planId && target.geometria;
    const saved = await persist(
      async () => [await saveSpaceGeometry(target.id, planId, geometria)],
      moved
        ? `${target.codigo} se movió a este plano.`
        : `${target.codigo} quedó ${replaced ? 'actualizado' : 'ubicado'}.`,
    );
    if (saved && filter === 'PENDING') {
      const next = visible.find((space) => space.id !== target.id);
      setSelectedId(next ? next.id : null);
    }
  };

  const handleEdit = (changes) =>
    persist(
      async () => {
        const results = [];
        for (const change of changes) {
          results.push(await saveSpaceGeometry(change.id, planId, change.geometria));
        }
        return results;
      },
      changes.length === 1 ? 'Forma actualizada.' : `${changes.length} formas actualizadas.`,
    );

  const handleRemove = (ids) =>
    persist(
      async () => {
        const results = [];
        for (const id of ids) {
          results.push(await clearSpaceGeometry(id));
        }
        return results;
      },
      ids.length === 1 ? 'Espacio quitado del plano.' : `${ids.length} espacios quitados del plano.`,
    );

  if (loadError && !plan) {
    return (
      <ScreenContainer header={<AdminHeader title="Dibujar espacios" onBack={() => navigation.goBack()} />}>
        <View style={styles.padded}>
          <ErrorBanner message={loadError} onRetry={load} />
        </View>
      </ScreenContainer>
    );
  }
  if (!plan) {
    return (
      <ScreenContainer header={<AdminHeader title="Dibujar espacios" onBack={() => navigation.goBack()} />}>
        <AppLoader fill />
      </ScreenContainer>
    );
  }

  const drawnCount = Object.keys(shapes).length;
  const statusColor = { saving: colors.gray2, saved: colors.success, error: colors.error, idle: colors.gray2 }[
    status.kind
  ];

  const panel = (
    <View style={[styles.panel, wide ? styles.panelWide : styles.panelNarrow]}>
      <Text style={styles.steps}>
        1. Elige un espacio · 2. Dibújalo con el polígono o el rectángulo de la barra del plano · 3. Se guarda solo.
      </Text>
      <View style={styles.statusRow}>
        <AppIcon
          name={status.kind === 'error' ? 'alert-circle-outline' : 'cloud-done-outline'}
          size={16}
          color={statusColor}
        />
        <Text style={[styles.status, { color: statusColor }]} numberOfLines={2}>
          {status.message ||
            `${drawnCount} ${drawnCount === 1 ? 'espacio ubicado' : 'espacios ubicados'} en este plano`}
        </Text>
      </View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar espacio por nombre o código"
        placeholderTextColor={colors.gray3}
        style={styles.search}
      />
      <CategoryChips chips={FILTERS} selected={filter} onSelect={setFilter} />
      {floors.length > 1 ? (
        <CategoryChips
          chips={[
            { value: 'ALL', label: 'Todos los pisos' },
            ...floors.map((piso) => ({ value: piso, label: `Piso ${piso}` })),
          ]}
          selected={floor}
          onSelect={setFloor}
        />
      ) : null}
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {filter === 'PENDING' ? 'Todos los espacios ya están ubicados.' : 'No hay espacios con ese filtro.'}
          </Text>
        }
        renderItem={({ item }) => {
          const here = item.planoId === planId && item.geometria;
          const elsewhere = item.planoId && item.planoId !== planId;
          const active = item.id === selectedId;
          return (
            <Pressable
              onPress={() => setSelectedId(active ? null : item.id)}
              style={[styles.item, active && styles.itemActive]}
              accessibilityRole="button"
            >
              <View style={[styles.dot, here ? styles.dotHere : elsewhere ? styles.dotElsewhere : styles.dotPending]} />
              <View style={styles.itemText}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.codigo} · {item.nombre}
                </Text>
                <Text style={styles.itemMeta} numberOfLines={1}>
                  {here ? 'En este plano' : elsewhere ? 'En otro plano' : 'Sin ubicar'}
                  {item.activo ? '' : ' · Inactivo'}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
      {selected && selected.planoId === planId && selected.geometria ? (
        <AppButton
          label={`Quitar ${selected.codigo} del plano`}
          variant="danger"
          onPress={() => handleRemove([selected.id])}
          style={styles.panelButton}
        />
      ) : null}
      {Platform.OS === 'web' ? (
        <AppButton
          label="Exportar GeoJSON"
          variant="outline"
          disabled={drawnCount === 0}
          onPress={() =>
            downloadGeoJson(
              plan,
              spaces.filter((space) => shapes[space.id]),
            )
          }
          style={styles.panelButton}
        />
      ) : null}
    </View>
  );

  return (
    <ScreenContainer
      bodyStyle={styles.fullWidth}
      header={
        <AdminHeader
          title="Dibujar espacios"
          subtitle={`${plan.nombre} · ${plan.ancho} × ${plan.alto} px`}
          onBack={() => navigation.goBack()}
        />
      }
    >
      <View style={[styles.body, wide ? styles.bodyWide : styles.bodyNarrow]}>
        <View style={styles.canvas}>
          <View style={[styles.selectionBar, !selected && styles.selectionBarIdle]}>
            <Text style={styles.selectionText} numberOfLines={1}>
              {selected
                ? `Dibujando: ${selected.codigo} · ${selected.nombre}`
                : 'Elige un espacio de la lista para dibujarlo'}
            </Text>
          </View>
          <PlanDrawingEditor
            plan={plan}
            shapes={shapes}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDraw={handleDraw}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        </View>
        {panel}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  padded: {
    padding: spacing.lg,
  },
  fullWidth: {
    maxWidth: '100%',
  },
  body: {
    flex: 1,
  },
  bodyWide: {
    flexDirection: 'row',
  },
  bodyNarrow: {
    flexDirection: 'column',
  },
  canvas: {
    flex: 1,
  },
  selectionBar: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray4,
  },
  selectionBarIdle: {
    backgroundColor: colors.white,
  },
  selectionText: {
    fontSize: fontSizes.small,
    fontWeight: '700',
    color: colors.gray1,
  },
  panel: {
    backgroundColor: colors.white,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  panelWide: {
    width: 340,
    borderLeftWidth: 1,
    borderLeftColor: colors.gray4,
  },
  panelNarrow: {
    maxHeight: '50%',
    borderTopWidth: 1,
    borderTopColor: colors.gray4,
  },
  steps: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  status: {
    flex: 1,
    fontSize: fontSizes.small,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  search: {
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray4,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.body,
    color: colors.gray1,
  },
  list: {
    flex: 1,
  },
  empty: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    padding: spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  itemActive: {
    backgroundColor: colors.pale,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  dotHere: {
    backgroundColor: colors.primary,
  },
  dotElsewhere: {
    backgroundColor: colors.light,
  },
  dotPending: {
    backgroundColor: colors.gray4,
  },
  itemText: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSizes.body,
    color: colors.gray1,
    fontWeight: '600',
  },
  itemMeta: {
    fontSize: fontSizes.small,
    color: colors.gray2,
  },
  panelButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
});

export default PlanEditorScreen;
