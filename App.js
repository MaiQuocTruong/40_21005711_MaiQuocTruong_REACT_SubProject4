import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProfileScreen from './screens/ProfileScreen';
import ForgetPassScreen from './screens/ForgetPassScreen';
import Management from './screens/Management';
import BillScreen from './screens/BillScreen';
import ProductScreen from './screens/ProductScreen';
import HomeScreen from './screens/HomeScreen';
import ElectronicsScreen from './screens/ElectronicsScreen';
import FreshScreen from './screens/FreshScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import ProductDetail from './screens/ProductDetail';
import PaymentScreen from './screens/PaymentScreen';
import PaymentSuccess from './screens/PaymentSuccess';
import CartScreen from './screens/CartScreen';
import { CartProvider } from './contexts/CartContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CartProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
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
        <Stack.Screen 
          name="SignUpScreen" 
          component={SignUpScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ForgetPassScreen" 
          component={ForgetPassScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Management" 
          component={Management} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="BillScreen"
          component={BillScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProductScreen"
          component={ProductScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Electronics" 
          component={ElectronicsScreen} 
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
        <Stack.Screen 
          name="Fresh" 
          component={FreshScreen} 
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
        <Stack.Screen 
          name="ProductDetailScreen" 
          component={ProductDetailScreen} 
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
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetail} 
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
        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
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
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen} 
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
        <Stack.Screen 
          name="PaymentSuccess" 
          component={PaymentSuccess} 
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