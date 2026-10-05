import React, { useMemo, useState } from 'react';
import { createCalendarEvent, deleteCalendarEvent, listCalendarEvents, updateCalendarEvent } from '../../api/admin.api';
import AdminFab from '../../components/admin/AdminFab';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminListItem from '../../components/admin/AdminListItem';
import AdminListView from '../../components/admin/AdminListView';
import CalendarEventModal from '../../components/admin/CalendarEventModal';
import CategoryChips from '../../components/common/CategoryChips';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ScreenContainer from '../../components/common/ScreenContainer';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import useAdminActions from '../../hooks/useAdminActions';
import useFocusRefresh from '../../hooks/useFocusRefresh';
import useRemoteResource from '../../hooks/useRemoteResource';
import { getAdminErrorMessage } from '../../utils/admin.utils';
import { ALL_VALUE, categoryLabel } from '../../utils/category.utils';
import { formatLongDate } from '../../utils/date.utils';

const MODULE_TABS = [
  { name: 'SubjectsManagement', label: 'Asignaturas' },
  { name: 'CalendarManagement', label: 'Calendario' },
];

const CATEGORY_CHIPS = [
  { value: ALL_VALUE, label: 'Todos' },
  { value: 'INICIO_CLASES', label: 'Inicio clases' },
  { value: 'EXAMENES', label: 'Exámenes' },
  { value: 'RECESOS', label: 'Recesos' },
  { value: 'INSCRIPCIONES', label: 'Inscripciones' },
  { value: 'EVENTOS_ESPECIALES', label: 'Eventos' },
];

/**
 * @description Consulta todos los eventos del calendario sin filtros; la categoría se filtra en el
 *              dispositivo. Es una referencia estable para el hook de carga.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {Promise<Array>} Eventos del calendario
 */
const fetchAllCalendar = () => listCalendarEvents();

/**
 * @description Pantalla de gestión del calendario académico institucional. Lista los eventos con
 *              filtro por categoría y permite crear, editar y eliminar mediante un formulario en modal.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @returns {React.JSX.Element} Pantalla de gestión del calendario
 */
const CalendarManagementScreen = ({ navigation }) => {
  const [category, setCategory] = useState(ALL_VALUE);
  const list = useRemoteResource(fetchAllCalendar, []);
  const actions = useAdminActions();
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);
  useFocusRefresh(list.refresh);

  const events = useMemo(
    () =>
      list.data
        .filter((event) => category === ALL_VALUE || event.categoria === category)
        .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio)),
    [list.data, category],
  );

  const submit = async (data) => {
    try {
      if (editing) {
        await updateCalendarEvent(editing.id, data);
      } else {
        await createCalendarEvent(data);
      }
    } catch (error) {
      throw new Error(getAdminErrorMessage(error));
    }
    actions.clear();
    setNotice(editing ? 'Evento actualizado correctamente.' : 'Evento creado correctamente.');
    setEditing(undefined);
    list.refresh();
  };

  return (
    <ScreenContainer header={<AdminHeader title="Académico" subtitle="Calendario institucional" />}>
      <SegmentedTabs items={MODULE_TABS} current="CalendarManagement" onChange={(name) => navigation.navigate(name)} />
      <CategoryChips chips={CATEGORY_CHIPS} selected={category} onSelect={setCategory} />
      <AdminListView
        data={events}
        keyExtractor={(item) => item.id}
        loading={list.loading}
        error={list.error}
        onRetry={list.refresh}
        success={actions.message || notice}
        failure={actions.error}
        onRefresh={list.refresh}
        emptyIcon="calendar-outline"
        emptyMessage="No hay eventos en esta categoría"
        renderItem={({ item }) => (
          <AdminListItem
            title={item.nombre}
            subtitle={categoryLabel(item.categoria)}
            meta={`${formatLongDate(item.fechaInicio)}${item.fechaFin && item.fechaFin !== item.fechaInicio ? ` – ${formatLongDate(item.fechaFin)}` : ''}`}
            actions={[
              { label: 'Editar', onPress: () => setEditing(item) },
              { label: 'Eliminar', variant: 'danger', onPress: () => setDeleteTarget(item) },
            ]}
          />
        )}
      />
      <AdminFab label="Crear evento del calendario" onPress={() => setEditing(null)} />
      <CalendarEventModal
        visible={editing !== undefined}
        event={editing || null}
        onClose={() => setEditing(undefined)}
        onSubmit={submit}
      />
      <ConfirmDialog
        visible={Boolean(deleteTarget)}
        title="Eliminar evento"
        message={deleteTarget ? `"${deleteTarget.nombre}" dejará de mostrarse en el calendario de los estudiantes.` : ''}
        confirmLabel="Eliminar"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          const target = deleteTarget;
          setDeleteTarget(null);
          setNotice(null);
          if (await actions.run(() => deleteCalendarEvent(target.id), 'Evento eliminado correctamente.')) {
            list.refresh();
          }
        }}
      />
    </ScreenContainer>
  );
};

export default CalendarManagementScreen;
