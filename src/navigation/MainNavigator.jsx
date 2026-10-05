import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppIcon from '../components/common/AppIcon';
import CalendarScreen from '../screens/academic/CalendarScreen';
import ScheduleScreen from '../screens/academic/ScheduleScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
import CampusSearchScreen from '../screens/campus/CampusSearchScreen';
import CampusSpacesScreen from '../screens/campus/CampusSpacesScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import NewsDetailScreen from '../screens/news/NewsDetailScreen';
import EventsScreen from '../screens/news/EventsScreen';
import NewsScreen from '../screens/news/NewsScreen';
import DirectoryScreen from '../screens/services/DirectoryScreen';
import FAQScreen from '../screens/services/FAQScreen';
import WellbeingScreen from '../screens/services/WellbeingScreen';
import colors from '../theme/colors';
import { fontSizes } from '../theme/typography';
import { SIDEBAR_MIN_WIDTH, SIDEBAR_WIDTH, TAB_ITEMS } from './tabItems';
import WebSidebar from './WebSidebar';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const AcademicStack = createNativeStackNavigator();
const ServicesStack = createNativeStackNavigator();
const CampusStack = createNativeStackNavigator();
const NewsStack = createNativeStackNavigator();

const stackOptions = { headerShown: false };

/**
 * @description Pila de la pestaña Inicio: Dashboard y Perfil.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila de Inicio
 */
const HomeNavigator = () => (
  <HomeStack.Navigator screenOptions={stackOptions}>
    <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
    <HomeStack.Screen name="Profile" component={ProfileScreen} />
  </HomeStack.Navigator>
);

/**
 * @description Pila de la pestaña Académico: Horario y Calendario.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila de Académico
 */
const AcademicNavigator = () => (
  <AcademicStack.Navigator screenOptions={stackOptions}>
    <AcademicStack.Screen name="Schedule" component={ScheduleScreen} />
    <AcademicStack.Screen name="Calendar" component={CalendarScreen} />
  </AcademicStack.Navigator>
);

/**
 * @description Pila de la pestaña Servicios: Bienestar, Directorio y Preguntas frecuentes.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila de Servicios
 */
const ServicesNavigator = () => (
  <ServicesStack.Navigator screenOptions={stackOptions}>
    <ServicesStack.Screen name="Wellbeing" component={WellbeingScreen} />
    <ServicesStack.Screen name="Directory" component={DirectoryScreen} />
    <ServicesStack.Screen name="Faq" component={FAQScreen} />
  </ServicesStack.Navigator>
);

/**
 * @description Pila de la pestaña Campus: Espacios y Búsqueda.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila de Campus
 */
const CampusNavigator = () => (
  <CampusStack.Navigator screenOptions={stackOptions}>
    <CampusStack.Screen name="CampusSpaces" component={CampusSpacesScreen} />
    <CampusStack.Screen name="CampusSearch" component={CampusSearchScreen} />
  </CampusStack.Navigator>
);

/**
 * @description Pila de la pestaña Noticias: Noticias, Detalle de noticia y Eventos.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila de Noticias
 */
const NewsNavigator = () => (
  <NewsStack.Navigator screenOptions={stackOptions}>
    <NewsStack.Screen name="News" component={NewsScreen} />
    <NewsStack.Screen name="NewsDetail" component={NewsDetailScreen} />
    <NewsStack.Screen name="Events" component={EventsScreen} />
  </NewsStack.Navigator>
);

const TAB_COMPONENTS = {
  InicioTab: HomeNavigator,
  AcademicoTab: AcademicNavigator,
  ServiciosTab: ServicesNavigator,
  CampusTab: CampusNavigator,
  NoticiasTab: NewsNavigator,
};

/**
 * @description Navegador principal con cinco pestañas (Inicio, Académico, Servicios, Campus y
 *              Noticias). En web con ventana ancha la barra inferior se reemplaza por un menú lateral.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {React.JSX.Element} Navegador de pestañas
 */
const MainNavigator = () => {
  const { width } = useWindowDimensions();
  const useSidebar = Platform.OS === 'web' && width >= SIDEBAR_MIN_WIDTH;

  return (
    <Tab.Navigator
      initialRouteName="InicioTab"
      tabBar={useSidebar ? (props) => <WebSidebar {...props} /> : undefined}
      sceneContainerStyle={useSidebar ? { marginLeft: SIDEBAR_WIDTH } : undefined}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray3,
        tabBarLabelStyle: { fontSize: fontSizes.label, fontWeight: '600' },
        tabBarStyle: { borderTopColor: colors.gray4, backgroundColor: colors.white },
      }}
    >
      {TAB_ITEMS.map((item) => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={TAB_COMPONENTS[item.name]}
          options={{
            tabBarLabel: item.label,
            tabBarIcon: ({ color, size }) => <AppIcon name={item.icon} size={size} color={color} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MainNavigator;
