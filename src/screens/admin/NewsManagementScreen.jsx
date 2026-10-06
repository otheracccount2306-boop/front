import React, { useState } from 'react';
import { deleteNews, listAllNews, updateNews } from '../../api/admin.api';
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
import { ALL_VALUE, categoryLabel } from '../../utils/category.utils';
import { formatLongDate } from '../../utils/date.utils';

const STATUS_CHIPS = [
  { value: ALL_VALUE, label: 'Todas' },
  { value: 'PUBLICADO', label: 'Publicadas' },
  { value: 'BORRADOR', label: 'Borradores' },
  { value: 'ARCHIVADO', label: 'Archivadas' },
];

const toNewsRequest = (news, estado) => ({
  titulo: news.titulo,
  resumen: news.resumen,
  contenido: news.contenido,
  categoria: news.categoria,
  imagenUrl: news.imagenUrl,
  estado,
});

const NewsManagementScreen = ({ navigation, route }) => {
  const [status, setStatus] = useState(ALL_VALUE);
  const actions = useAdminActions();
  const [flash, setFlash] = useFlash(route, navigation, actions.clear);
  const list = usePaginated(
    (page) => listAllNews({ status: status === ALL_VALUE ? undefined : status, page }),
    [status],
  );
  const [archiveTarget, setArchiveTarget] = useState(null);
  useFocusRefresh(list.refresh);

  const execute = async (action, message) => {
    setFlash(null);
    if (await actions.run(action, message)) {
      list.refresh();
    }
  };

  const actionsFor = (news) => {
    if (news.estado === 'ARCHIVADO') {
      return [];
    }
    const menu = [{ label: 'Editar', onPress: () => navigation.navigate('NewsForm', { newsId: news.id }) }];
    if (news.estado === 'BORRADOR') {
      menu.push({
        label: 'Publicar',
        onPress: () => execute(() => updateNews(news.id, toNewsRequest(news, 'PUBLICADO')), 'Noticia publicada correctamente.'),
      });
    }
    menu.push({ label: 'Archivar', variant: 'danger', onPress: () => setArchiveTarget(news) });
    return menu;
  };

  return (
    <ScreenContainer header={<AdminHeader title="Noticias" subtitle="Publicaciones institucionales" />}>
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
        emptyIcon="newspaper-outline"
        emptyMessage="No hay noticias con este filtro"
        renderItem={({ item }) => (
          <AdminListItem
            title={item.titulo}
            subtitle={`${categoryLabel(item.categoria)} · ${formatLongDate(item.publicadoEn || item.creadoEn)}`}
            badge={<StatusBadge status={item.estado} />}
            actions={actionsFor(item)}
          />
        )}
      />
      <AdminFab label="Crear noticia" onPress={() => navigation.navigate('NewsForm')} />
      <ConfirmDialog
        visible={Boolean(archiveTarget)}
        title="Archivar noticia"
        message={
          archiveTarget
            ? `"${archiveTarget.titulo}" dejará de mostrarse a los estudiantes y no podrá volver a editarse.`
            : ''
        }
        confirmLabel="Archivar"
        onCancel={() => setArchiveTarget(null)}
        onConfirm={() => {
          const target = archiveTarget;
          setArchiveTarget(null);
          execute(() => deleteNews(target.id), 'Noticia archivada correctamente.');
        }}
      />
    </ScreenContainer>
  );
};

export default NewsManagementScreen;
