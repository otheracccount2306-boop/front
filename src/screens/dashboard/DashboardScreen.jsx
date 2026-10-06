import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getSchedule } from "../../api/academic.api";
import { getEvents, getNews } from "../../api/news.api";
import ShowOnMapLink from "../../components/campus/ShowOnMapLink";
import AppIcon from "../../components/common/AppIcon";
import ScreenContainer from "../../components/common/ScreenContainer";
import ScreenHeader from "../../components/common/ScreenHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import useAuth from "../../hooks/useAuth";
import { openSpaceOnMap } from "../../navigation/campusLinks";
import { TAB_ITEMS } from "../../navigation/tabItems";
import useCacheStore from "../../store/cache.store";
import colors from "../../theme/colors";
import { cardShadow, fontSizes, radius, spacing } from "../../theme/typography";
import { categoryLabel } from "../../utils/category.utils";
import {
  findNextClass,
  formatEventDateTime,
  formatLongDate,
  formatTimeRange,
  getDayCode,
} from "../../utils/date.utils";
import { getErrorMessage } from "../../utils/error.utils";

const QUICK_ACCESS = TAB_ITEMS.filter((item) => item.name !== "InicioTab");
const IDLE = { data: null, error: null, loading: true };

/**
 * @description Ejecuta una solicitud y devuelve siempre un resultado { data, error } sin lanzar,
 *              para que la falla de un módulo no impida mostrar los demás.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {Promise} request - Solicitud a ejecutar
 * @returns {Promise<{ data: any, error: string|null, loading: boolean }>} Resultado aislado de la solicitud
 */
const isolate = (request) =>
  request
    .then((data) => ({ data, error: null, loading: false }))
    .catch((error) => ({
      data: null,
      error: getErrorMessage(error),
      loading: false,
    }));

/**
 * @description Pantalla de inicio. Muestra un saludo, acceso rápido a los cuatro módulos, la próxima
 *              clase de hoy, el próximo evento y la última noticia. Consulta los tres endpoints en
 *              paralelo con Promise.all y aísla los errores por tarjeta.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {Object} props - Props de navegación de React Navigation
 * @param {Object} props.navigation - Objeto de navegación
 * @returns {React.JSX.Element} Pantalla de inicio
 */
const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(IDLE);
  const [news, setNews] = useState(IDLE);
  const [events, setEvents] = useState(IDLE);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [scheduleResult, newsResult, eventsResult] = await Promise.all([
      isolate(getSchedule()),
      isolate(getNews({ page: 1 })),
      isolate(getEvents({ page: 1 })),
    ]);
    if (scheduleResult.data) {
      useCacheStore.getState().setSchedule(scheduleResult.data);
    }
    setSchedule(scheduleResult);
    setNews(newsResult);
    setEvents(eventsResult);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const nextClass = schedule.data ? findNextClass(schedule.data) : null;
  const nextEvent =
    events.data && events.data.content.length > 0
      ? events.data.content[0]
      : null;
  const lastNews =
    news.data && news.data.content.length > 0 ? news.data.content[0] : null;

  let classMessage = "No tienes más clases hoy.";
  if (schedule.data && schedule.data.length === 0) {
    classMessage = "No hay horario disponible para el periodo actual.";
  } else if (
    schedule.data &&
    !schedule.data.some((subject) => subject.dias.includes(getDayCode()))
  ) {
    classMessage = "Hoy no tienes clases programadas.";
  }

  return (
    <ScreenContainer
      header={
        <ScreenHeader
          title={`Hola, ${user ? user.nombre : ""}`}
          subtitle="¿Qué necesitas hoy?"
          right={
            <Pressable
              onPress={() => navigation.navigate("Profile")}
              hitSlop={10}
              accessibilityLabel="Mi perfil"
            >
              <AppIcon
                name="person-circle-outline"
                size={30}
                color={colors.white}
              />
            </Pressable>
          }
        />
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.grid}>
          {QUICK_ACCESS.map((item) => (
            <Pressable
              key={item.name}
              style={styles.tile}
              onPress={() => navigation.navigate(item.name)}
              accessibilityRole="button"
            >
              <View style={styles.tileCard}>
                <AppIcon name={item.icon} size={28} color={colors.primary} />
                <Text style={styles.tileLabel}>{item.label}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <DashboardCard
          title="Próxima clase hoy"
          icon="time-outline"
          loading={schedule.loading}
          error={schedule.error}
        >
          {nextClass ? (
            <View>
              <Text style={styles.primaryText}>{nextClass.nombre}</Text>
              <Text style={styles.secondaryText}>
                {formatTimeRange(nextClass.horaInicio, nextClass.horaFin)}
                {nextClass.aula ? ` · ${nextClass.aula}` : ""}
              </Text>
              {nextClass.espacioId ? (
                <ShowOnMapLink
                  onPress={() =>
                    openSpaceOnMap(navigation, nextClass.espacioId)
                  }
                  style={styles.mapLink}
                />
              ) : null}
            </View>
          ) : (
            <Text style={styles.secondaryText}>{classMessage}</Text>
          )}
        </DashboardCard>

        <DashboardCard
          title="Próximo evento"
          icon="calendar-outline"
          loading={events.loading}
          error={events.error}
        >
          {nextEvent ? (
            <View>
              <Text style={styles.primaryText}>{nextEvent.nombre}</Text>
              <Text style={styles.secondaryText}>
                {formatEventDateTime(nextEvent.fechaHora)}
                {nextEvent.lugar ? ` · ${nextEvent.lugar}` : ""}
              </Text>
            </View>
          ) : (
            <Text style={styles.secondaryText}>No hay eventos próximos.</Text>
          )}
        </DashboardCard>

        <DashboardCard
          title="Última noticia"
          icon="newspaper-outline"
          loading={news.loading}
          error={news.error}
          onPress={
            lastNews
              ? () =>
                  navigation.navigate("NoticiasTab", {
                    screen: "NewsDetail",
                    params: { id: lastNews.id },
                  })
              : undefined
          }
        >
          {lastNews ? (
            <View>
              <Text style={styles.primaryText}>{lastNews.titulo}</Text>
              <Text style={styles.secondaryText}>
                {categoryLabel(lastNews.categoria)} ·{" "}
                {formatLongDate(lastNews.publicadoEn)}
              </Text>
            </View>
          ) : (
            <Text style={styles.secondaryText}>
              Aún no hay noticias publicadas.
            </Text>
          )}
        </DashboardCard>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.md,
  },
  tile: {
    width: "50%",
    padding: spacing.xs,
  },
  tileCard: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    ...cardShadow,
  },
  tileLabel: {
    fontSize: fontSizes.body,
    fontWeight: "700",
    color: colors.gray1,
    marginTop: spacing.sm,
  },
  primaryText: {
    fontSize: fontSizes.body,
    fontWeight: "700",
    color: colors.gray1,
  },
  mapLink: {
    marginTop: spacing.sm,
  },
  secondaryText: {
    fontSize: fontSizes.body,
    color: colors.gray2,
    marginTop: 2,
  },
});

export default DashboardScreen;
