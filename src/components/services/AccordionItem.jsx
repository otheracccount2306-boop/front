import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, spacing } from '../../theme/typography';
import AppCard from '../common/AppCard';
import AppIcon from '../common/AppIcon';

/**
 * @description Acordeón de una pregunta frecuente: la pregunta se muestra en negrita y la
 *              respuesta aparece al tocar. Empieza colapsado.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.question - Texto de la pregunta
 * @param {string} props.answer - Texto de la respuesta
 * @returns {React.JSX.Element} Acordeón
 */
const AccordionItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <AppCard style={styles.card}>
      <Pressable
        onPress={() => setExpanded((previous) => !previous)}
        style={styles.header}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <Text style={styles.question}>{question}</Text>
        <AppIcon name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
      </Pressable>
      {expanded ? (
        <View style={styles.answerWrapper}>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      ) : null}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  question: {
    flex: 1,
    fontSize: fontSizes.body,
    fontWeight: '700',
    color: colors.gray1,
    marginRight: spacing.md,
  },
  answerWrapper: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray4,
  },
  answer: {
    fontSize: fontSizes.body,
    color: colors.gray2,
    lineHeight: 20,
  },
});

export default AccordionItem;
