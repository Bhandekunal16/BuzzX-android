import * as React from 'react';
import { StyleSheet } from 'react-native';
import Chat from './chat';
import Group from './group';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
const { Navigator, Screen } = createBottomTabNavigator();


const BottomTabBar = ({ navigation, state }: { navigation: any, state: any }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Chats' />
        <BottomNavigationTab title='group' />
    </BottomNavigation>
);

const TabNavigator = () => (
    <Navigator tabBar={props => <BottomTabBar {...props} />}>
        <Screen name='chat' component={Chat} />
        <Screen name='group' component={Group} />
    </Navigator>
);

export default TabNavigator

