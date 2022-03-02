import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screen/Home';
import Search from '../screen/Search';
import Me from '../screen/Me';
import LogIn from '../screen/LogIn';
import TabHeaderTitle from '../components/nav/TabHeaderTitle.js';
import CreateAccount from '../screen/CreateAccount';
import AddCoffeeShop from '../screen/AddCoffeeShop';

const Stack = createStackNavigator();

export default function SharedStackNav({ screenName, isLoggedIn = false }) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'screen',
                headerBackTitleVisible: false, // 이전 화면 title 보일지 여부
                headerTintColor: 'white',
                headerStyle: {
                    shadowColor: 'rgba(255,255,255,0.8)',
                    backgroundColor: 'black',
                },
            }}
        >
            {screenName === 'Home' && (
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                        headerTitle: () => <TabHeaderTitle title="Home" />,
                    }}
                />
            )}
            {screenName === 'AddCoffeeShop' && isLoggedIn ? (
                <Stack.Screen
                    name="AddCoffeeShop"
                    component={AddCoffeeShop}
                    options={{
                        headerTitle: () => <TabHeaderTitle title="AddCoffeeShop" />,
                    }}
                />
            ) : null}
            {screenName === 'Search' && (
                <Stack.Screen
                    name="Search"
                    component={Search}
                    options={{
                        headerTitle: () => <TabHeaderTitle title="Search" />,
                    }}
                />
            )}
            {screenName === 'Me' && isLoggedIn ? (
                <Stack.Screen
                    name="Me"
                    component={Me}
                    options={{
                        headerTitle: () => <TabHeaderTitle title="My Profile" />,
                    }}
                />
            ) : (
                <Stack.Screen
                    name="LogIn"
                    component={LogIn}
                    options={{
                        headerTitle: () => <TabHeaderTitle title="Log In" />,
                    }}
                />
            )}
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
        </Stack.Navigator>
    );
}
