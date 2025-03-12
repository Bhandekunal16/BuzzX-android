import * as React from 'react';
import { StyleSheet } from 'react-native';
import Chat from './chat';
import Group from './group';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
const { Navigator, Screen } = createBottomTabNavigator();


const BottomTabBar = ({ navigation, state }: { navigation: any, state: any }) => (
    <BottomNavigation
        style={styles.tab}
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Chats' />
        <BottomNavigationTab title='Group' />
    </BottomNavigation>
);

const TabNavigator = () => (
    <Navigator tabBar={props => <BottomTabBar {...props} />}>
        <Screen name='Chats' component={Chat} />
        <Screen name='Group' component={Group} />
    </Navigator>
);

export default TabNavigator

const styles = StyleSheet.create({
    tab: {

    }
});