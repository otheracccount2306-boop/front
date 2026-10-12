import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarScreen from '../screens/academic/CalendarScreen';
import PersonalClassFormScreen from '../screens/academic/PersonalClassFormScreen';
import ScheduleScreen from '../screens/academic/ScheduleScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
import CampusMapScreen from '../screens/campus/CampusMapScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import NewsDetailScreen from '../screens/news/NewsDetailScreen';
import EventsScreen from '../screens/news/EventsScreen';
import NewsScreen from '../screens/news/NewsScreen';
import DirectoryScreen from '../screens/services/DirectoryScreen';
import FAQScreen from '../screens/services/FAQScreen';
import WellbeingScreen from '../screens/services/WellbeingScreen';
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
    <AcademicStack.Screen name="PersonalClassForm" component={PersonalClassFormScreen} />
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
 * @description Pila de la pestaña Campus: el mapa (con la búsqueda por nombre como opción).
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila de Campus
 */
const CampusNavigator = () => (
  <CampusStack.Navigator screenOptions={stackOptions}>
    <CampusStack.Screen name="CampusMap" component={CampusMapScreen} />
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
 * @description Navegador principal con cinco secciones (Inicio, Académico, Servicios, Campus y
 *              Noticias). No hay barra inferior: en el celular y en ventanas angostas se navega con el
 *              menú de hamburguesa del encabezado (ScreenHeader → StudentDrawer), igual que en el
 *              panel del administrador; en web con ventana ancha el menú queda fijo a la izquierda.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {React.JSX.Element} Navegador principal
 */
const MainNavigator = () => {
  const { width } = useWindowDimensions();
  const useSidebar = Platform.OS === 'web' && width >= SIDEBAR_MIN_WIDTH;

  return (
    <Tab.Navigator
      initialRouteName="InicioTab"
      tabBar={useSidebar ? (props) => <WebSidebar {...props} /> : () => null}
      sceneContainerStyle={useSidebar ? { marginLeft: SIDEBAR_WIDTH } : undefined}
      screenOptions={{ headerShown: false }}
    >
      {TAB_ITEMS.map((item) => (
        <Tab.Screen key={item.name} name={item.name} component={TAB_COMPONENTS[item.name]} options={{ title: item.label }} />
      ))}
    </Tab.Navigator>
  );
};

export default MainNavigator;
