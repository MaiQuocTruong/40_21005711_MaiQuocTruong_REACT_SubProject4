import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import { CartProvider } from './contexts/CartContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CartProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} // Ẩn header cho màn hình đăng nhập
        />
        <Stack.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{ 
            headerTitle: '',
            headerBackTitleVisible: false, 
            headerStyle: {
              elevation: 0, 
              shadowOpacity: 0, 
              borderBottomWidth: 0, 
            },
            header: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </CartProvider>
  );
}
