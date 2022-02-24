import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabIcon from '../components/nav/TabIcon';
import SharedStackNav from './SharedStackNav';
import useMe from '../hook/useMe';
import { Image } from 'react-native';
import { defaultAvatar } from '../components/CoffeeShopItem';

const Tabs = createBottomTabNavigator();

//  home, search, profile
export default function CommonNav() {
    const { data } = useMe();
    console.log(data);
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
                    tabBarIcon: ({ focused, color /* size*/ }) =>
                        data?.me?.avatarURL ? (
                            <Image
                                source={{ uri: data.me.avatarURL || defaultAvatar }}
                                style={{ width: 25, height: 25, borderRadius: 12.5 }}
                            />
                        ) : (
                            <TabIcon iconName="person" focused={focused} color={color} />
                        ),
                }}
            >
                {() => <SharedStackNav screenName="Me" />}
            </Tabs.Screen>
        </Tabs.Navigator>
    );
}
