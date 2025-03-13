import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../auth/login';
import ForgetPassword from '../auth/forget-password';
import Register from '../auth/register';
import TabNavigator from '../dashboard/dashboard';
import ChatScreen from '../dashboard/group';

const Stack = createNativeStackNavigator<any>();


export function RootStack() {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Login" component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="register" component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="forgetPassword" component={ForgetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Dashboard" component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ChatScreen" component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
