import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabIcon from '../components/nav/TabIcon';
import SharedStackNav from './SharedStackNav';

const Tabs = createBottomTabNavigator();

//  home, search, profile
export default function CommonNav() {
    return (
        <Tabs.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: 'black',
                    borderTopColor: 'rgba(255,255,255,0.2)',
                },
                tabBarActiveTintColor: 'white',
            }}
        >
            <Tabs.Screen
                name="HomeRoot"
                options={{
                    tabBarIcon: ({ focused, color /* size*/ }) => (
                        <TabIcon iconName="home" focused={focused} color={color} />
                    ),
                }}
            >
                {() => <SharedStackNav screenName="Home" />}
            </Tabs.Screen>
            <Tabs.Screen
                name="SearchRoot"
                options={{
                    tabBarIcon: ({ focused, color /* size*/ }) => (
                        <TabIcon iconName="search" focused={focused} color={color} />
                    ),
                }}
            >
                {() => <SharedStackNav screenName="Search" />}
            </Tabs.Screen>
            <Tabs.Screen
                name="MeRoot"
                options={{
                    tabBarIcon: ({ focused, color /* size*/ }) => (
                        <TabIcon iconName="person" focused={focused} color={color} />
                    ),
                }}
            >
                {() => <SharedStackNav screenName="Me" />}
            </Tabs.Screen>
        </Tabs.Navigator>
    );
}
