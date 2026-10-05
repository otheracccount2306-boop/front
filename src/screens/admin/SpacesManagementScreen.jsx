import React, { useMemo, useState } from 'react';
import { deleteSpace, listAllSpaces, updateSpace } from '../../api/admin.api';
import AdminFab from '../../components/admin/AdminFab';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminListItem from '../../components/admin/AdminListItem';
import AdminListView from '../../components/admin/AdminListView';
import StatusBadge from '../../components/admin/StatusBadge';
import CategoryChips from '../../components/common/CategoryChips';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ScreenContainer from '../../components/common/ScreenContainer';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import useAdminActions from '../../hooks/useAdminActions';
import useFlash from '../../hooks/useFlash';
import useFocusRefresh from '../../hooks/useFocusRefresh';
import useRemoteResource from '../../hooks/useRemoteResource';
import { ADMIN_SPACES_TABS } from '../../utils/admin.utils';
import { ALL_VALUE, SPACE_CHIPS, categoryLabel } from '../../utils/category.utils';

/**
 * @description Consulta todos los espacios sin filtros; el filtro por categoría se aplica en el
 *              dispositivo. Es una referencia estable para el hook de carga.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {Promise<Array>} Espacios de cualquier estado
 */
const fetchAllSpaces = () => listAllSpaces();

/**
 * @description Pantalla de gestión de espacios del campus. Lista todos los espacios, activos e
 *              inactivos, con filtro por categoría, y permite crear, editar, activar o desactivar y
 *              eliminar (eliminación lógica).
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @param {Object} props.route - Ruta actual; route.params.flash trae el mensaje del formulario
 * @returns {React.JSX.Element} Pantalla de gestión de espacios
 */
const SpacesManagementScreen = ({ navigation, route }) => {
  const [category, setCategory] = useState(ALL_VALUE);
  const actions = useAdminActions();
  const [flash, setFlash] = useFlash(route, navigation, actions.clear);
  const list = useRemoteResource(fetchAllSpaces, []);
  const [deleteTarget, setDeleteTarget] = useState(null);
  useFocusRefresh(list.refresh);

  const spaces = useMemo(
    () => list.data.filter((space) => category === ALL_VALUE || space.categoria === category),
    [list.data, category],
  );

  const execute = async (action, message) => {
    setFlash(null);
    if (await actions.run(action, message, { 409: 'El código ya existe, usa uno diferente' })) {
      list.refresh();
    }
  };

  const actionsFor = (space) => {
    const menu = [
      { label: 'Editar', onPress: () => navigation.navigate('SpaceForm', { space }) },
      {
        label: space.activo ? 'Desactivar' : 'Activar',
        onPress: () =>
          execute(
            () =>
              updateSpace(space.id, {
                nombre: space.nombre,
                codigo: space.codigo,
                categoria: space.categoria,
                edificio: space.edificio,
                piso: space.piso,
                descripcion: space.descripcion,
                referencia: space.referencia,
                activo: !space.activo,
              }),
            space.activo ? 'Espacio desactivado correctamente.' : 'Espacio activado correctamente.',
          ),
      },
    ];
    if (space.activo) {
      menu.push({ label: 'Eliminar', variant: 'danger', onPress: () => setDeleteTarget(space) });
    }
    return menu;
  };

  return (
    <ScreenContainer header={<AdminHeader title="Espacios" subtitle="Catálogo del campus" />}>
      <SegmentedTabs items={ADMIN_SPACES_TABS} current="SpacesManagement" onChange={(name) => navigation.navigate(name)} />
      <CategoryChips chips={SPACE_CHIPS} selected={category} onSelect={setCategory} />
      <AdminListView
        data={spaces}
        keyExtractor={(item) => item.id}
        loading={list.loading}
        error={list.error}
        onRetry={list.refresh}
        success={actions.message || flash}
        failure={actions.error}
        onRefresh={list.refresh}
        emptyIcon="map-outline"
        emptyMessage="No hay espacios en esta categoría"
        renderItem={({ item }) => (
          <AdminListItem
            title={item.nombre}
            subtitle={`${item.codigo} · ${categoryLabel(item.categoria)}`}
            meta={
              [item.edificio, item.piso, item.geometria ? 'En el mapa' : null].filter(Boolean).join(' · ') || undefined
            }
            badge={<StatusBadge status={item.activo ? 'ACTIVO' : 'INACTIVO'} />}
            actions={actionsFor(item)}
          />
        )}
      />
      <AdminFab label="Crear espacio" onPress={() => navigation.navigate('SpaceForm')} />
      <ConfirmDialog
        visible={Boolean(deleteTarget)}
        title="Eliminar espacio"
        message={
          deleteTarget
            ? `"${deleteTarget.nombre}" dejará de mostrarse a los estudiantes. Podrás volver a activarlo después.`
            : ''
        }
        confirmLabel="Eliminar"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          const target = deleteTarget;
          setDeleteTarget(null);
          execute(() => deleteSpace(target.id), 'Espacio eliminado correctamente.');
        }}
      />
    </ScreenContainer>
  );
};

export default SpacesManagementScreen;
