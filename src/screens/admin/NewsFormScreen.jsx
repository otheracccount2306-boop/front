import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { createNews, updateNews } from '../../api/admin.api';
import { getNewsById } from '../../api/news.api';
import AdminFormField from '../../components/admin/AdminFormField';
import AdminFormSelect from '../../components/admin/AdminFormSelect';
import AdminHeader from '../../components/admin/AdminHeader';
import AppButton from '../../components/common/AppButton';
import AppLoader from '../../components/common/AppLoader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import useUnsavedGuard from '../../hooks/useUnsavedGuard';
import { spacing } from '../../theme/typography';
import { NEWS_CATEGORY_OPTIONS, emptyToNull, getAdminErrorMessage, isValidHttpUrl } from '../../utils/admin.utils';

const EMPTY = { titulo: '', resumen: '', contenido: '', categoria: '', imagenUrl: '', estado: 'BORRADOR' };

/**
 * @description Pantalla de creación y edición de noticias. Recibe newsId opcional: si viene, carga la
 *              noticia y entra en modo edición. Ofrece "Guardar borrador" y "Publicar"; una noticia ya
 *              publicada no puede volver a borrador, así que esa opción queda deshabilitada. Pide
 *              confirmación al salir con cambios sin guardar.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @param {Object} props.route - Ruta actual; route.params.newsId es el identificador a editar
 * @returns {React.JSX.Element} Formulario de noticia
 */
const NewsFormScreen = ({ navigation, route }) => {
  const newsId = route.params ? route.params.newsId : undefined;
  const [initial, setInitial] = useState(EMPTY);
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(Boolean(newsId));
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (!newsId) {
      return;
    }
    getNewsById(newsId)
      .then((news) => {
        const loaded = {
          titulo: news.titulo,
          resumen: news.resumen || '',
          contenido: news.contenido,
          categoria: news.categoria,
          imagenUrl: news.imagenUrl || '',
          estado: news.estado,
        };
        setInitial(loaded);
        setValues(loaded);
      })
      .catch((error) => setApiError(getAdminErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [newsId]);

  const wasPublished = initial.estado === 'PUBLICADO';
  const dirty = JSON.stringify(values) !== JSON.stringify(initial);
  const guard = useUnsavedGuard(navigation, dirty);

  const errors = {};
  if (!values.titulo.trim()) {
    errors.titulo = 'Ingresa el título';
  }
  if (!values.resumen.trim()) {
    errors.resumen = 'Ingresa un resumen';
  }
  if (!values.contenido.trim()) {
    errors.contenido = 'Ingresa el contenido';
  }
  if (!values.categoria) {
    errors.categoria = 'Elige una categoría';
  }
  if (values.imagenUrl.trim() && !isValidHttpUrl(values.imagenUrl.trim())) {
    errors.imagenUrl = 'Ingresa una URL válida que empiece con http:// o https://';
  }
  const valid = Object.keys(errors).length === 0;

  const setField = (field) => (text) => setValues((previous) => ({ ...previous, [field]: text }));
  const blur = (field) => () => setTouched((previous) => ({ ...previous, [field]: true }));
  const shown = (field) => (touched[field] ? errors[field] : undefined);

  const save = async (estado) => {
    setSaving(true);
    setApiError(null);
    const body = {
      titulo: values.titulo.trim(),
      resumen: values.resumen.trim(),
      contenido: values.contenido.trim(),
      categoria: values.categoria,
      imagenUrl: emptyToNull(values.imagenUrl),
      estado,
    };
    try {
      if (newsId) {
        await updateNews(newsId, body);
      } else {
        await createNews(body);
      }
      guard.allowExit();
      const action = newsId ? 'actualizada' : 'creada';
      navigation.navigate('NewsManagement', {
        flash: estado === 'PUBLICADO' ? `Noticia ${action} y publicada correctamente.` : `Borrador ${newsId ? 'actualizado' : 'guardado'} correctamente.`,
      });
    } catch (error) {
      setApiError(getAdminErrorMessage(error, { 409: 'Una noticia publicada no puede volver a borrador' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer
      header={<AdminHeader title={newsId ? 'Editar noticia' : 'Nueva noticia'} onBack={() => navigation.goBack()} />}
    >
      {loading ? (
        <AppLoader fill />
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ErrorBanner message={apiError} />
          <AdminFormField
            label="Título"
            required
            value={values.titulo}
            onChangeText={setField('titulo')}
            onBlur={blur('titulo')}
            error={shown('titulo')}
            maxLength={250}
            showCount
          />
          <AdminFormField
            label="Resumen"
            required
            value={values.resumen}
            onChangeText={setField('resumen')}
            onBlur={blur('resumen')}
            error={shown('resumen')}
            multiline
            maxLength={500}
            showCount
          />
          <AdminFormField
            label="Contenido"
            required
            value={values.contenido}
            onChangeText={setField('contenido')}
            onBlur={blur('contenido')}
            error={shown('contenido')}
            multiline
          />
          <AdminFormSelect
            label="Categoría"
            required
            value={values.categoria}
            onChange={(value) => {
              setField('categoria')(value);
              blur('categoria')();
            }}
            options={NEWS_CATEGORY_OPTIONS}
            error={shown('categoria')}
          />
          <AdminFormField
            label="URL de la imagen de portada"
            value={values.imagenUrl}
            onChangeText={setField('imagenUrl')}
            onBlur={blur('imagenUrl')}
            error={shown('imagenUrl')}
            placeholder="https://..."
            autoCapitalize="none"
            keyboardType="url"
            maxLength={500}
          />
          <AdminFormSelect
            label="Estado"
            value={values.estado}
            onChange={setField('estado')}
            options={[
              { value: 'BORRADOR', label: 'Borrador', disabled: wasPublished },
              { value: 'PUBLICADO', label: 'Publicado' },
            ]}
          />
          <View style={styles.actions}>
            <AppButton label="Cancelar" variant="outline" onPress={() => navigation.goBack()} style={styles.action} />
            <AppButton
              label="Guardar borrador"
              variant="outline"
              onPress={() => save('BORRADOR')}
              disabled={!valid || saving || wasPublished}
              style={styles.action}
            />
            <AppButton
              label={wasPublished ? 'Guardar cambios' : 'Publicar'}
              onPress={() => save('PUBLICADO')}
              disabled={!valid}
              loading={saving}
              style={styles.action}
            />
          </View>
        </ScrollView>
      )}
      <ConfirmDialog
        visible={guard.visible}
        title="Cambios sin guardar"
        message="Si sales ahora perderás los cambios de este formulario."
        confirmLabel="Salir sin guardar"
        onCancel={guard.cancelExit}
        onConfirm={guard.confirmExit}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  action: {
    flexGrow: 1,
    minWidth: 130,
    margin: spacing.xs,
  },
});

export default NewsFormScreen;
