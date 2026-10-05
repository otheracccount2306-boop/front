import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import CalendarManagementScreen from '../screens/admin/CalendarManagementScreen';
import EventFormScreen from '../screens/admin/EventFormScreen';
import EventsManagementScreen from '../screens/admin/EventsManagementScreen';
import NewsFormScreen from '../screens/admin/NewsFormScreen';
import NewsManagementScreen from '../screens/admin/NewsManagementScreen';
import ServiceFormScreen from '../screens/admin/ServiceFormScreen';
import ServicesManagementScreen from '../screens/admin/ServicesManagementScreen';
import SpaceFormScreen from '../screens/admin/SpaceFormScreen';
import SpacesManagementScreen from '../screens/admin/SpacesManagementScreen';
import SubjectFormScreen from '../screens/admin/SubjectFormScreen';
import SubjectsManagementScreen from '../screens/admin/SubjectsManagementScreen';
import UsersManagementScreen from '../screens/admin/UsersManagementScreen';
import AdminSidebar from './AdminSidebar';
import { SIDEBAR_MIN_WIDTH, SIDEBAR_WIDTH } from './tabItems';

const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();
const NewsStack = createNativeStackNavigator();
const EventsStack = createNativeStackNavigator();
const ServicesStack = createNativeStackNavigator();
const SpacesStack = createNativeStackNavigator();
const AcademicStack = createNativeStackNavigator();
const UsersStack = createNativeStackNavigator();

const stackOptions = { headerShown: false };

/**
 * @description Pila de la sección Dashboard.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila del dashboard
 */
const DashboardNavigator = () => (
  <DashboardStack.Navigator screenOptions={stackOptions}>
    <DashboardStack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
  </DashboardStack.Navigator>
);

/**
 * @description Pila de la sección Noticias: listado y formulario.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila de noticias
 */
const NewsNavigator = () => (
  <NewsStack.Navigator screenOptions={stackOptions}>
    <NewsStack.Screen name="NewsManagement" component={NewsManagementScreen} />
    <NewsStack.Screen name="NewsForm" component={NewsFormScreen} />
  </NewsStack.Navigator>
);

/**
 * @description Pila de la sección Eventos: listado y formulario.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila de eventos
 */
const EventsNavigator = () => (
  <EventsStack.Navigator screenOptions={stackOptions}>
    <EventsStack.Screen name="EventsManagement" component={EventsManagementScreen} />
    <EventsStack.Screen name="EventForm" component={EventFormScreen} />
  </EventsStack.Navigator>
);

/**
 * @description Pila de la sección Servicios: listado con pestañas y formulario.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila de servicios
 */
const ServicesNavigator = () => (
  <ServicesStack.Navigator screenOptions={stackOptions}>
    <ServicesStack.Screen name="ServicesManagement" component={ServicesManagementScreen} />
    <ServicesStack.Screen name="ServiceForm" component={ServiceFormScreen} />
  </ServicesStack.Navigator>
);

/**
 * @description Pila de la sección Espacios: listado y formulario.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila de espacios
 */
const SpacesNavigator = () => (
  <SpacesStack.Navigator screenOptions={stackOptions}>
    <SpacesStack.Screen name="SpacesManagement" component={SpacesManagementScreen} />
    <SpacesStack.Screen name="SpaceForm" component={SpaceFormScreen} />
  </SpacesStack.Navigator>
);

/**
 * @description Pila de la sección Académico: asignaturas, formulario de asignatura y calendario.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila académica
 */
const AcademicNavigator = () => (
  <AcademicStack.Navigator screenOptions={stackOptions}>
    <AcademicStack.Screen name="SubjectsManagement" component={SubjectsManagementScreen} />
    <AcademicStack.Screen name="SubjectForm" component={SubjectFormScreen} />
    <AcademicStack.Screen name="CalendarManagement" component={CalendarManagementScreen} />
  </AcademicStack.Navigator>
);

/**
 * @description Pila de la sección Usuarios.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {React.JSX.Element} Pila de usuarios
 */
const UsersNavigator = () => (
  <UsersStack.Navigator screenOptions={stackOptions}>
    <UsersStack.Screen name="UsersManagement" component={UsersManagementScreen} />
  </UsersStack.Navigator>
);

/**
 * @description Navegador del administrador. En web con ventana de 900 puntos o más muestra un menú
 *              lateral fijo; en móvil no hay barra de pestañas y el menú se abre desde la hamburguesa
 *              del encabezado de cada pantalla.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {React.JSX.Element} Navegador del panel administrativo
 */
const AdminNavigator = () => {
  const { width } = useWindowDimensions();
  const useSidebar = Platform.OS === 'web' && width >= SIDEBAR_MIN_WIDTH;

  return (
    <Tab.Navigator
      initialRouteName="AdminDashboardTab"
      tabBar={useSidebar ? (props) => <AdminSidebar {...props} /> : () => null}
      sceneContainerStyle={useSidebar ? { marginLeft: SIDEBAR_WIDTH } : undefined}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="AdminDashboardTab" component={DashboardNavigator} />
      <Tab.Screen name="AdminNewsTab" component={NewsNavigator} />
      <Tab.Screen name="AdminEventsTab" component={EventsNavigator} />
      <Tab.Screen name="AdminServicesTab" component={ServicesNavigator} />
      <Tab.Screen name="AdminSpacesTab" component={SpacesNavigator} />
      <Tab.Screen name="AdminAcademicTab" component={AcademicNavigator} />
      <Tab.Screen name="AdminUsersTab" component={UsersNavigator} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
