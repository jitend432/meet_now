/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/store';


function App() {

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
      <AppNavigator/>
      </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}



export default App;
