import React, { useState } from 'react';
import { deletePlan, listAllPlans, updatePlan } from '../../api/admin.api';
import AdminFab from '../../components/admin/AdminFab';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminListItem from '../../components/admin/AdminListItem';
import AdminListView from '../../components/admin/AdminListView';
import StatusBadge from '../../components/admin/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ScreenContainer from '../../components/common/ScreenContainer';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import useAdminActions from '../../hooks/useAdminActions';
import useFlash from '../../hooks/useFlash';
import useFocusRefresh from '../../hooks/useFocusRefresh';
import useRemoteResource from '../../hooks/useRemoteResource';
import { ADMIN_SPACES_TABS } from '../../utils/admin.utils';

/**
 * @description Consulta todos los planos. Es una referencia estable para el hook de carga.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {Promise<Array>} Planos de cualquier estado
 */
const fetchAllPlans = () => listAllPlans();

/**
 * @description Texto de la cantidad de espacios dibujados en un plano.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {number} count - Espacios con polígono
 * @returns {string} Texto para la lista
 */
const drawnLabel = (count) => (count === 1 ? '1 espacio ubicado' : `${count} espacios ubicados`);

/**
 * @description Pantalla de gestión de planos del campus. Lista los planos, activos e inactivos, y
 *              permite crearlos, editarlos, abrir el editor para dibujar los espacios, activarlos o
 *              desactivarlos y eliminarlos (eliminación lógica que conserva los polígonos).
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @param {Object} props.route - Ruta actual; route.params.flash trae el mensaje del formulario
 * @returns {React.JSX.Element} Pantalla de planos
 */
const PlansManagementScreen = ({ navigation, route }) => {
  const actions = useAdminActions();
  const [flash, setFlash] = useFlash(route, navigation, actions.clear);
  const list = useRemoteResource(fetchAllPlans, []);
  const [deleteTarget, setDeleteTarget] = useState(null);
  useFocusRefresh(list.refresh);

  const execute = async (action, message) => {
    setFlash(null);
    if (await actions.run(action, message)) {
      list.refresh();
    }
  };

  const actionsFor = (plan) => {
    const menu = [
      { label: 'Dibujar espacios', onPress: () => navigation.navigate('PlanEditor', { planId: plan.id }) },
      { label: 'Editar datos', onPress: () => navigation.navigate('PlanForm', { planId: plan.id }) },
      {
        label: plan.activo ? 'Desactivar' : 'Activar',
        onPress: () =>
          execute(
            () =>
              updatePlan(plan.id, {
                nombre: plan.nombre,
                edificio: plan.edificio,
                piso: plan.piso,
                imagen: null,
                activo: !plan.activo,
              }),
            plan.activo ? 'Plano desactivado correctamente.' : 'Plano activado correctamente.',
          ),
      },
    ];
    if (plan.activo) {
      menu.push({ label: 'Eliminar', variant: 'danger', onPress: () => setDeleteTarget(plan) });
    }
    return menu;
  };

  return (
    <ScreenContainer header={<AdminHeader title="Espacios" subtitle="Planos del campus" />}>
      <SegmentedTabs items={ADMIN_SPACES_TABS} current="PlansManagement" onChange={(name) => navigation.navigate(name)} />
      <AdminListView
        data={list.data}
        keyExtractor={(item) => item.id}
        loading={list.loading}
        error={list.error}
        onRetry={list.refresh}
        success={actions.message || flash}
        failure={actions.error}
        onRefresh={list.refresh}
        emptyIcon="map-outline"
        emptyMessage="Aún no hay planos. Crea uno con la imagen del piso."
        renderItem={({ item }) => (
          <AdminListItem
            title={item.nombre}
            subtitle={[item.edificio, item.piso].filter(Boolean).join(' · ') || `${item.ancho} × ${item.alto} px`}
            meta={drawnLabel(item.espaciosDibujados)}
            badge={<StatusBadge status={item.activo ? 'ACTIVO' : 'INACTIVO'} />}
            onPress={() => navigation.navigate('PlanEditor', { planId: item.id })}
            actions={actionsFor(item)}
          />
        )}
      />
      <AdminFab label="Crear plano" onPress={() => navigation.navigate('PlanForm')} />
      <ConfirmDialog
        visible={Boolean(deleteTarget)}
        title="Eliminar plano"
        message={
          deleteTarget
            ? `"${deleteTarget.nombre}" dejará de mostrarse en el mapa. Los espacios dibujados se conservan y podrás volver a activarlo.`
            : ''
        }
        confirmLabel="Eliminar"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          const target = deleteTarget;
          setDeleteTarget(null);
          execute(() => deletePlan(target.id), 'Plano eliminado correctamente.');
        }}
      />
    </ScreenContainer>
  );
};

export default PlansManagementScreen;
