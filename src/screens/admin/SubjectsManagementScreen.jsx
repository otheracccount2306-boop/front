import React, { useMemo, useState } from 'react';
import { deleteSubject, listSubjects, updateSubject } from '../../api/admin.api';
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
import { formatDays, getSubjectConflictMessage } from '../../utils/admin.utils';
import { formatTimeRange } from '../../utils/date.utils';

const MODULE_TABS = [
  { name: 'SubjectsManagement', label: 'Asignaturas' },
  { name: 'CalendarManagement', label: 'Calendario' },
];

const fetchAllSubjects = () => listSubjects();

const roomMeta = (subject) => {
  if (!subject.aula) {
    return '';
  }
  return ` · ${subject.aula}${subject.espacioId ? ' (en el mapa)' : ' (no está en el mapa)'}`;
};

const SubjectsManagementScreen = ({ navigation, route }) => {
  const [period, setPeriod] = useState(null);
  const actions = useAdminActions();
  const [flash, setFlash] = useFlash(route, navigation, actions.clear);
  const list = useRemoteResource(fetchAllSubjects, []);
  const [deleteTarget, setDeleteTarget] = useState(null);
  useFocusRefresh(list.refresh);

  const periods = useMemo(
    () => [...new Set(list.data.map((subject) => subject.periodoAcademico))].sort().reverse(),
    [list.data],
  );
  const selectedPeriod = period && periods.includes(period) ? period : periods[0];
  const subjects = useMemo(
    () => list.data.filter((subject) => subject.periodoAcademico === selectedPeriod),
    [list.data, selectedPeriod],
  );

  const execute = async (action, message, overrides) => {
    setFlash(null);
    if (await actions.run(action, message, overrides)) {
      list.refresh();
    }
  };

  const toRequest = (subject, activo) => ({
    nombre: subject.nombre,
    codigo: subject.codigo,
    docente: subject.docente,
    aula: subject.aula,
    dias: subject.dias,
    horaInicio: subject.horaInicio,
    horaFin: subject.horaFin,
    periodoAcademico: subject.periodoAcademico,
    activo,
  });

  const actionsFor = (subject) => {
    const menu = [
      { label: 'Editar', onPress: () => navigation.navigate('SubjectForm', { subject }) },
      {
        label: subject.activo ? 'Desactivar' : 'Activar',
        onPress: async () => {
          setFlash(null);
          const ok = await actions.run(
            () => updateSubject(subject.id, toRequest(subject, !subject.activo)),
            subject.activo ? 'Asignatura desactivada correctamente.' : 'Asignatura activada correctamente.',
            getSubjectConflictMessage,
          );
          if (ok) {
            list.refresh();
          }
        },
      },
    ];
    if (subject.activo) {
      menu.push({ label: 'Eliminar', variant: 'danger', onPress: () => setDeleteTarget(subject) });
    }
    return menu;
  };

  return (
    <ScreenContainer header={<AdminHeader title="Académico" subtitle="Asignaturas y horarios" />}>
      <SegmentedTabs items={MODULE_TABS} current="SubjectsManagement" onChange={(name) => navigation.navigate(name)} />
      {periods.length > 0 ? (
        <CategoryChips
          chips={periods.map((value) => ({ value, label: `Periodo ${value}` }))}
          selected={selectedPeriod}
          onSelect={setPeriod}
        />
      ) : null}
      <AdminListView
        data={subjects}
        keyExtractor={(item) => item.id}
        loading={list.loading}
        error={list.error}
        onRetry={list.refresh}
        success={actions.message || flash}
        failure={actions.error}
        onRefresh={list.refresh}
        emptyIcon="school-outline"
        emptyMessage="No hay asignaturas en este periodo"
        renderItem={({ item }) => (
          <AdminListItem
            title={item.nombre}
            subtitle={`${item.codigo}${item.docente ? ` · ${item.docente}` : ''}`}
            meta={`${formatDays(item.dias)} · ${formatTimeRange(item.horaInicio, item.horaFin)}${roomMeta(item)}`}
            badge={<StatusBadge status={item.activo ? 'ACTIVO' : 'INACTIVO'} />}
            actions={actionsFor(item)}
          />
        )}
      />
      <AdminFab label="Crear asignatura" onPress={() => navigation.navigate('SubjectForm')} />
      <ConfirmDialog
        visible={Boolean(deleteTarget)}
        title="Eliminar asignatura"
        message={
          deleteTarget
            ? `"${deleteTarget.nombre}" dejará de aparecer en los horarios de los estudiantes. Podrás volver a activarla después.`
            : ''
        }
        confirmLabel="Eliminar"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          const target = deleteTarget;
          setDeleteTarget(null);
          execute(() => deleteSubject(target.id), 'Asignatura eliminada correctamente.');
        }}
      />
    </ScreenContainer>
  );
};

export default SubjectsManagementScreen;
