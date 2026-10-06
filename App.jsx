import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => (
  <SafeAreaProvider>
    <RootNavigator />
  </SafeAreaProvider>
);

export default App;
