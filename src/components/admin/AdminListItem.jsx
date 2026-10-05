import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { cardShadow, fontSizes, radius, spacing } from '../../theme/typography';
import AppIcon from '../common/AppIcon';
import ActionMenu from './ActionMenu';

/**
 * @description Fila genérica de los listados del panel: título, subtítulo, línea de detalle, badge
 *              de estado y un ícono de menú que abre el ActionMenu cuando hay acciones disponibles.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Texto principal de la fila
 * @param {string} [props.subtitle] - Texto secundario
 * @param {string} [props.meta] - Línea de detalle adicional
 * @param {React.ReactNode} [props.badge] - Badge de estado
 * @param {Array<{ label: string, onPress: Function, variant?: 'default'|'danger' }>} [props.actions] - Acciones del menú
 * @param {Function} [props.onPress] - Acción al tocar la fila
 * @returns {React.JSX.Element} Fila de listado
 */
const AdminListItem = ({ title, subtitle, meta, badge, actions = [], onPress }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Pressable disabled={!onPress} onPress={onPress} style={styles.row}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        {badge ? <View style={styles.badge}>{badge}</View> : null}
      </View>
      {actions.length > 0 ? (
        <Pressable
          onPress={() => setMenuVisible(true)}
          hitSlop={10}
          style={styles.menuButton}
          accessibilityRole="button"
          accessibilityLabel={`Acciones de ${title}`}
        >
          <AppIcon name="ellipsis-vertical" size={20} color={colors.gray2} />
        </Pressable>
      ) : null}
      <ActionMenu actions={actions} visible={menuVisible} onClose={() => setMenuVisible(false)} title={title} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.gray1,
  },
  subtitle: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginTop: 2,
  },
  meta: {
    fontSize: fontSizes.small,
    color: colors.gray3,
    marginTop: 2,
  },
  badge: {
    marginTop: spacing.sm,
  },
  menuButton: {
    paddingLeft: spacing.md,
    paddingVertical: spacing.xs,
  },
});

export default AdminListItem;
