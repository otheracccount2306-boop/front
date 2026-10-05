import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  listAllEvents,
  listAllNews,
  listAllServices,
  listAllSpaces,
  listSubjects,
  listUsers,
} from '../../api/admin.api';
import AdminHeader from '../../components/admin/AdminHeader';
import AppIcon from '../../components/common/AppIcon';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ScreenContainer from '../../components/common/ScreenContainer';
import useAdminLogout from '../../hooks/useAdminLogout';
import useAuth from '../../hooks/useAuth';
import useFocusRefresh from '../../hooks/useFocusRefresh';
import colors from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';

const CARDS = [
  { key: 'users', label: 'Usuarios activos', icon: 'people-outline' },
  { key: 'news', label: 'Noticias publicadas', icon: 'newspaper-outline' },
  { key: 'events', label: 'Eventos activos', icon: 'calendar-outline' },
  { key: 'services', label: 'Servicios activos', icon: 'heart-outline' },
  { key: 'spaces', label: 'Espacios registrados', icon: 'map-outline' },
  { key: 'subjects', label: 'Asignaturas del periodo actual', icon: 'school-outline' },
];

const COUNTERS = {
  users: async () => (await listUsers({ active: true, page: 1 })).totalElements,
  news: async () => (await listAllNews({ status: 'PUBLICADO' })).totalElements,
  events: async () => (await listAllEvents({ status: 'ACTIVO' })).totalElements,
  services: async () => {
    const lists = await Promise.all(['wellbeing', 'department', 'faq'].map((type) => listAllServices(type)));
    return lists.flat().filter((service) => service.activo).length;
  },
  spaces: async () => (await listAllSpaces()).length,
  subjects: async () => {
    const all = await listSubjects();
    const current = all.map((subject) => subject.periodoAcademico).sort().pop();
    return all.filter((subject) => subject.periodoAcademico === current && subject.activo).length;
  },
};

/**
 * @description Pantalla inicial del panel administrativo. Muestra seis contadores (usuarios activos,
 *              noticias publicadas, eventos activos, servicios activos, espacios registrados y
 *              asignaturas del periodo actual) consultados en paralelo con Promise.all. Si un contador
 *              falla muestra "—" sin afectar a los demás. Incluye cierre de sesión con confirmación.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {React.JSX.Element} Dashboard administrativo
 */
const AdminDashboardScreen = () => {
  const { user } = useAuth();
  const logout = useAdminLogout();
  const [values, setValues] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const entries = await Promise.all(
      CARDS.map(({ key }) =>
        COUNTERS[key]()
          .then((value) => [key, value])
          .catch(() => [key, null]),
      ),
    );
    setValues(Object.fromEntries(entries));
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useFocusRefresh(load);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <ScreenContainer
      header={
        <AdminHeader
          title="Dashboard"
          subtitle={`Hola, ${user ? user.nombre : ''}`}
          rightAction={
            <Pressable onPress={logout.open} hitSlop={10} accessibilityLabel="Cerrar sesión">
              <AppIcon name="log-out-outline" size={26} color={colors.white} />
            </Pressable>
          }
        />
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.primary]} />}
      >
        <View style={styles.grid}>
          {CARDS.map((card) => {
            const value = values[card.key];
            let display = '…';
            if (value === null) {
              display = '—';
            } else if (value !== undefined) {
              display = String(value);
            }
            return (
              <View key={card.key} style={styles.cell}>
                <View style={styles.card} accessibilityLabel={`${card.label}: ${display}`}>
                  <AppIcon name={card.icon} size={22} color={colors.gray3} />
                  <Text style={styles.number}>{display}</Text>
                  <Text style={styles.label}>{card.label}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <ConfirmDialog
        visible={logout.visible}
        title="Cerrar sesión"
        message="¿Seguro que quieres cerrar tu sesión de administrador?"
        confirmLabel="Cerrar sesión"
        loading={logout.loading}
        onCancel={logout.close}
        onConfirm={logout.confirm}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  cell: {
    width: '50%',
    padding: spacing.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    minHeight: 130,
    ...cardShadow,
  },
  number: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  label: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginTop: spacing.xs,
  },
});

export default AdminDashboardScreen;
