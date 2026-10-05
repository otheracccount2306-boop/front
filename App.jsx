import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';

/**
 * @description Componente raíz de la aplicación. Provee el área segura y monta el navegador raíz,
 *              que decide entre las pantallas de autenticación y las principales.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {React.JSX.Element} Aplicación
 */
const App = () => (
  <SafeAreaProvider>
    <RootNavigator />
  </SafeAreaProvider>
);

export default App;
