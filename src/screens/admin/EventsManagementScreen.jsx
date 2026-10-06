import React, { useState } from 'react';
import { deleteEvent, listAllEvents } from '../../api/admin.api';
import AdminFab from '../../components/admin/AdminFab';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminListItem from '../../components/admin/AdminListItem';
import AdminListView from '../../components/admin/AdminListView';
import StatusBadge from '../../components/admin/StatusBadge';
import CategoryChips from '../../components/common/CategoryChips';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ScreenContainer from '../../components/common/ScreenContainer';
import useAdminActions from '../../hooks/useAdminActions';
import useFlash from '../../hooks/useFlash';
import useFocusRefresh from '../../hooks/useFocusRefresh';
import usePaginated from '../../hooks/usePaginated';
import { ALL_VALUE } from '../../utils/category.utils';
import { formatEventDateTime } from '../../utils/date.utils';

const STATUS_CHIPS = [
  { value: ALL_VALUE, label: 'Todos' },
  { value: 'ACTIVO', label: 'Activos' },
  { value: 'CONCLUIDO', label: 'Concluidos' },
  { value: 'CANCELADO', label: 'Cancelados' },
];

const EventsManagementScreen = ({ navigation, route }) => {
  const [status, setStatus] = useState(ALL_VALUE);
  const actions = useAdminActions();
  const [flash, setFlash] = useFlash(route, navigation, actions.clear);
  const list = usePaginated(
    (page) => listAllEvents({ status: status === ALL_VALUE ? undefined : status, page }),
    [status],
  );
  const [cancelTarget, setCancelTarget] = useState(null);
  useFocusRefresh(list.refresh);

  const actionsFor = (event) => {
    if (event.estado === 'CONCLUIDO') {
      return [];
    }
    const menu = [{ label: 'Editar', onPress: () => navigation.navigate('EventForm', { event }) }];
    if (event.estado === 'ACTIVO') {
      menu.push({ label: 'Cancelar evento', variant: 'danger', onPress: () => setCancelTarget(event) });
    }
    return menu;
  };

  return (
    <ScreenContainer header={<AdminHeader title="Eventos" subtitle="Eventos institucionales" />}>
      <CategoryChips chips={STATUS_CHIPS} selected={status} onSelect={setStatus} />
      <AdminListView
        data={list.items}
        keyExtractor={(item) => item.id}
        loading={list.loading}
        error={list.error}
        onRetry={list.refresh}
        success={actions.message || flash}
        failure={actions.error}
        refreshing={list.refreshing}
        onRefresh={list.refresh}
        onEndReached={list.loadMore}
        emptyIcon="calendar-outline"
        emptyMessage="No hay eventos con este filtro"
        renderItem={({ item }) => (
          <AdminListItem
            title={item.nombre}
            subtitle={`${formatEventDateTime(item.fechaHora)}${item.lugar ? ` · ${item.lugar}` : ''}`}
            meta={item.cupos !== null && item.cupos !== undefined ? `Cupos: ${item.cupos}` : undefined}
            badge={<StatusBadge status={item.estado} />}
            actions={actionsFor(item)}
          />
        )}
      />
      <AdminFab label="Crear evento" onPress={() => navigation.navigate('EventForm')} />
      <ConfirmDialog
        visible={Boolean(cancelTarget)}
        title="Cancelar evento"
        message={cancelTarget ? `"${cancelTarget.nombre}" dejará de mostrarse a los estudiantes.` : ''}
        confirmLabel="Cancelar evento"
        onCancel={() => setCancelTarget(null)}
        onConfirm={async () => {
          const target = cancelTarget;
          setCancelTarget(null);
          setFlash(null);
          if (await actions.run(() => deleteEvent(target.id), 'Evento cancelado correctamente.')) {
            list.refresh();
          }
        }}
      />
    </ScreenContainer>
  );
};

export default EventsManagementScreen;
