import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import colors from "../../theme/colors";
import { fontSizes, spacing } from "../../theme/typography";
import AppIcon from "../common/AppIcon";

/**
 * @description Enlace compacto "Ver en mapa" para abrir un espacio en el mapa del campus. Se usa
 *              en las tarjetas de clases para llevar al estudiante a su salón.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onPress - Se ejecuta al tocar el enlace
 * @param {string} [props.label] - Texto del enlace
 * @param {Object} [props.style] - Estilo adicional
 * @returns {React.JSX.Element} Enlace al mapa
 */
const ShowOnMapLink = ({ onPress, label = "Ver en mapa", style }) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.link, pressed && styles.pressed, style]}
  >
    <AppIcon name="map-outline" size={15} color={colors.primary} />
    <Text style={styles.text}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  link: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    color: colors.primary,
    fontSize: fontSizes.small,
    fontWeight: "700",
    marginLeft: spacing.xs,
  },
});

export default ShowOnMapLink;
