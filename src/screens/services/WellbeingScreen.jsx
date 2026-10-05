import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import AppLoader from '../../components/common/AppLoader';
import CategoryChips from '../../components/common/CategoryChips';
import EmptyState from '../../components/common/EmptyState';
import ErrorBanner from '../../components/common/ErrorBanner';
import ScreenContainer from '../../components/common/ScreenContainer';
import ScreenHeader from '../../components/common/ScreenHeader';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import ServiceRow from '../../components/services/ServiceRow';
import useServices from '../../hooks/useServices';
import colors from '../../theme/colors';
import { spacing } from '../../theme/typography';
import { ALL_VALUE, WELLBEING_CHIPS } from '../../utils/category.utils';

const MODULE_TABS = [
  { name: 'Wellbeing', label: 'Bienestar' },
  { name: 'Directory', label: 'Directorio' },
  { name: 'Faq', label: 'Preguntas' },
];

/**
 * @description Pantalla de servicios de bienestar con filtro por categoría. Cada servicio muestra su
 *              ubicación, horario, si está abierto o cerrado según la hora del dispositivo y su contacto.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @returns {React.JSX.Element} Pantalla de bienestar
 */
const WellbeingScreen = ({ navigation }) => {
  const [category, setCategory] = useState(ALL_VALUE);
  const { services, loading, error, refresh } = useServices(category);

  return (
    <ScreenContainer header={<ScreenHeader title="Servicios" subtitle="Bienestar universitario" />}>
      <SegmentedTabs items={MODULE_TABS} current="Wellbeing" onChange={(name) => navigation.navigate(name)} />
      <CategoryChips chips={WELLBEING_CHIPS} selected={category} onSelect={setCategory} />
      {error ? (
        <View style={styles.banner}>
          <ErrorBanner message={error} onRetry={refresh} />
        </View>
      ) : null}
      {loading ? (
        <AppLoader fill />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(service) => service.id}
          renderItem={({ item }) => <ServiceRow service={item} />}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} colors={[colors.primary]} />}
          ListEmptyComponent={error ? null : <EmptyState icon="heart-outline" message="No hay servicios en esta categoría" />}
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: spacing.lg,
  },
  list: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
});

export default WellbeingScreen;
