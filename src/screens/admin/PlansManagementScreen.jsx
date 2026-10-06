import React, { useState } from 'react';
import { deletePlan, listAllPlans, updatePlan } from '../../api/admin.api';
import AdminFab from '../../components/admin/AdminFab';
import AdminFormField from '../../components/admin/AdminFormField';
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
import { ADMIN_SPACES_TABS, matchesPlanName } from '../../utils/admin.utils';

const fetchAllPlans = () => listAllPlans();

const drawnLabel = (count) => (count === 1 ? '1 espacio ubicado' : `${count} espacios ubicados`);

const deleteWarning = (plan) => {
  const count = plan.espaciosDibujados || 0;
  const spaces =
    count === 0
      ? 'No tiene espacios ubicados.'
      : `${count === 1 ? '1 espacio ubicado quedará' : `${count} espacios ubicados quedarán`} sin ubicar en el mapa (siguen en el catálogo y se pueden volver a dibujar en otro plano).`;
  const route = plan.navegacion ? ' También se borran los caminos del mapa del estudiante.' : '';
  return `"${plan.nombre}" se borrará definitivamente con su imagen. ${spaces}${route} Esta acción no se puede deshacer. Si solo quieres ocultarlo, usa "Desactivar".`;
};

const PlansManagementScreen = ({ navigation, route }) => {
  const actions = useAdminActions();
  const [flash, setFlash] = useFlash(route, navigation, actions.clear);
  const list = useRemoteResource(fetchAllPlans, []);
  const [deletion, setDeletion] = useState(null);
  const [typedName, setTypedName] = useState('');
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
    menu.push({
      label: 'Eliminar',
      variant: 'danger',
      onPress: () => {
        setTypedName('');
        setDeletion({ plan, step: 1 });
      },
    });
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
        visible={Boolean(deletion) && deletion.step === 1}
        title="¿Eliminar este plano?"
        message={deletion ? deleteWarning(deletion.plan) : ''}
        confirmLabel="Continuar"
        onCancel={() => setDeletion(null)}
        onConfirm={() => setDeletion((current) => ({ ...current, step: 2 }))}
      />
      <ConfirmDialog
        visible={Boolean(deletion) && deletion.step === 2}
        title="Confirma la eliminación"
        message={deletion ? `Escribe el nombre del plano para eliminarlo definitivamente: ${deletion.plan.nombre}` : ''}
        confirmLabel="Eliminar definitivamente"
        confirmDisabled={!deletion || !matchesPlanName(typedName, deletion.plan.nombre)}
        onCancel={() => setDeletion(null)}
        onConfirm={() => {
          const target = deletion.plan;
          const typed = typedName;
          setDeletion(null);
          execute(() => deletePlan(target.id, typed), `"${target.nombre}" se eliminó definitivamente.`);
        }}
      >
        <AdminFormField
          label="Nombre del plano"
          value={typedName}
          onChangeText={setTypedName}
          placeholder={deletion ? deletion.plan.nombre : ''}
          autoCapitalize="none"
          testID="confirm-plan-name"
        />
      </ConfirmDialog>
    </ScreenContainer>
  );
};

export default PlansManagementScreen;
