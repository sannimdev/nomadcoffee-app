import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View } from 'react-native';
import TabIcon from './TabIcon';
import SharedStackNav from '../../navigators/SharedStackNav';
import useMe from '../../hook/useMe';

const Tabs = createBottomTabNavigator();

export default function TabsNav() {
    const { data: userData } = useMe();

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
                {() => <SharedStackNav isLoggedIn={!!userData?.me} screenName="Home" />}
            </Tabs.Screen>
            {userData?.me && (
                <Tabs.Screen
                    name="AddCoffeeShopRoot"
                    options={{
                        tabBarIcon: ({ focused, color /* size*/ }) => (
                            <TabIcon iconName="cafe" focused={focused} color={color} />
                        ),
                    }}
                >
                    {() => <SharedStackNav isLoggedIn={!!userData?.me} screenName="AddCoffeeShop" />}
                </Tabs.Screen>
            )}
            {userData?.me && (
                <Tabs.Screen
                    name="Camera"
                    component={View}
                    listeners={({ navigation }) => {
                        return {
                            tabPress: (e) => {
                                e.preventDefault();
                                navigation.navigate('Upload');
                            },
                        };
                    }}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <TabIcon iconName={'camera'} color={color} focused={focused} />
                        ),
                    }}
                />
            )}
            <Tabs.Screen
                name="SearchRoot"
                options={{
                    tabBarIcon: ({ focused, color /* size*/ }) => (
                        <TabIcon iconName="search" focused={focused} color={color} />
                    ),
                }}
            >
                {() => <SharedStackNav isLoggedIn={!!userData?.me} screenName="Search" />}
            </Tabs.Screen>
            <Tabs.Screen
                name="MeRoot"
                options={{
                    tabBarIcon: ({ focused, color /* size*/ }) =>
                        userData?.me?.avatarURL ? (
                            <Image
                                source={{ uri: userData.me.avatarURL || defaultAvatar }}
                                style={{ width: 25, height: 25, borderRadius: 12 }}
                            />
                        ) : (
                            <TabIcon iconName="person" focused={focused} color={color} />
                        ),
                }}
            >
                {() => <SharedStackNav isLoggedIn={!!userData?.me} screenName="Me" />}
            </Tabs.Screen>
        </Tabs.Navigator>
    );
}
