import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import { categoryIcon } from '../../utils/category.utils';
import { getContactAction, openContact } from '../../utils/contact.utils';
import { isOpenNow } from '../../utils/date.utils';
import AppBadge from '../common/AppBadge';
import AppCard from '../common/AppCard';
import AppIcon from '../common/AppIcon';

/**
 * @description Fila de un servicio de bienestar o de una dependencia del directorio, con ícono de
 *              categoría, ubicación, horario, badge Abierto/Cerrado según la hora del dispositivo
 *              y enlace de contacto (marcador o cliente de correo).
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.service - Servicio o dependencia
 * @returns {React.JSX.Element} Fila de servicio
 */
const ServiceRow = ({ service }) => {
  const open = isOpenNow(service.horario);
  const contact = getContactAction(service.contacto);

  return (
    <AppCard style={styles.card}>
      <View style={styles.icon}>
        <AppIcon name={categoryIcon(service.categoria)} size={22} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{service.nombre}</Text>
          {open === null ? null : <AppBadge label={open ? 'Abierto' : 'Cerrado'} variant={open ? 'success' : 'warning'} />}
        </View>
        {service.descripcion ? (
          <Text style={styles.description} numberOfLines={3}>
            {service.descripcion}
          </Text>
        ) : null}
        {service.edificio ? (
          <View style={styles.meta}>
            <AppIcon name="location-outline" size={14} color={colors.gray2} />
            <Text style={styles.metaText}>{service.edificio}</Text>
          </View>
        ) : null}
        {service.horario ? (
          <View style={styles.meta}>
            <AppIcon name="time-outline" size={14} color={colors.gray2} />
            <Text style={styles.metaText}>{service.horario}</Text>
          </View>
        ) : null}
        {contact ? (
          <Pressable
            style={styles.meta}
            disabled={!contact.url}
            onPress={() => openContact(contact)}
            accessibilityRole={contact.url ? 'link' : 'text'}
          >
            <AppIcon
              name={contact.type === 'phone' ? 'call-outline' : 'mail-outline'}
              size={14}
              color={contact.url ? colors.primary : colors.gray2}
            />
            <Text style={[styles.metaText, contact.url ? styles.link : null]}>{contact.label}</Text>
          </Pressable>
        ) : null}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.pale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.gray1,
    marginRight: spacing.sm,
  },
  description: {
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  metaText: {
    flex: 1,
    fontSize: fontSizes.small,
    color: colors.gray2,
    marginLeft: spacing.xs,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});

export default ServiceRow;
