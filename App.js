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
      </Stack.Navigator>
    </NavigationContainer>
    </CartProvider>
  );
}
