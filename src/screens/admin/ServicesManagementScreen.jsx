import React, { useState } from 'react';
import { deleteService, listAllServices, updateService } from '../../api/admin.api';
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
import { SERVICE_TYPES } from '../../utils/admin.utils';
import { categoryLabel } from '../../utils/category.utils';

const TABS = SERVICE_TYPES.map((type) => ({ name: type.name, label: type.label }));

const toPayload = (type, item, activo) =>
  type === 'faq'
    ? { pregunta: item.pregunta, respuesta: item.respuesta, categoria: item.categoria, activo }
    : {
        nombre: item.nombre,
        descripcion: item.descripcion,
        categoria: item.categoria,
        edificio: item.edificio,
        horario: item.horario,
        contacto: item.contacto,
        activo,
      };

const ServicesManagementScreen = ({ navigation, route }) => {
  const [type, setType] = useState('wellbeing');
  const actions = useAdminActions();
  const [flash, setFlash] = useFlash(route, navigation, actions.clear);
  const list = useRemoteResource(() => listAllServices(type), [type]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  useFocusRefresh(list.refresh);

  const execute = async (action, message) => {
    setFlash(null);
    if (await actions.run(action, message)) {
      list.refresh();
    }
  };

  const actionsFor = (item) => {
    const menu = [{ label: 'Editar', onPress: () => navigation.navigate('ServiceForm', { type, service: item }) }];
    menu.push({
      label: item.activo ? 'Desactivar' : 'Activar',
      onPress: () =>
        execute(
          () => updateService(type, item.id, toPayload(type, item, !item.activo)),
          item.activo ? 'Registro desactivado correctamente.' : 'Registro activado correctamente.',
        ),
    });
    if (item.activo) {
      menu.push({ label: 'Eliminar', variant: 'danger', onPress: () => setDeleteTarget(item) });
    }
    return menu;
  };

  return (
    <ScreenContainer header={<AdminHeader title="Servicios" subtitle="Bienestar, directorio y preguntas" />}>
      <SegmentedTabs items={TABS} current={type} onChange={setType} />
      <AdminListView
        data={list.data}
        keyExtractor={(item) => item.id}
        loading={list.loading}
        error={list.error}
        onRetry={list.refresh}
        success={actions.message || flash}
        failure={actions.error}
        onRefresh={list.refresh}
        emptyIcon="heart-outline"
        emptyMessage="No hay registros en esta sección"
        renderItem={({ item }) => (
          <AdminListItem
            title={type === 'faq' ? item.pregunta : item.nombre}
            subtitle={
              type === 'faq'
                ? `${categoryLabel(item.categoria)} · ${item.frecuencia} consultas`
                : categoryLabel(item.categoria)
            }
            meta={type === 'faq' ? undefined : [item.edificio, item.horario].filter(Boolean).join(' · ') || undefined}
            badge={<StatusBadge status={item.activo ? 'ACTIVO' : 'INACTIVO'} />}
            actions={actionsFor(item)}
          />
        )}
      />
      <AdminFab label="Crear registro" onPress={() => navigation.navigate('ServiceForm', { type })} />
      <ConfirmDialog
        visible={Boolean(deleteTarget)}
        title="Eliminar registro"
        message={
          deleteTarget
            ? `"${type === 'faq' ? deleteTarget.pregunta : deleteTarget.nombre}" dejará de mostrarse a los estudiantes. Podrás volver a activarlo después.`
            : ''
        }
        confirmLabel="Eliminar"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          const target = deleteTarget;
          setDeleteTarget(null);
          execute(() => deleteService(type, target.id), 'Registro eliminado correctamente.');
        }}
      />
    </ScreenContainer>
  );
};

export default ServicesManagementScreen;
