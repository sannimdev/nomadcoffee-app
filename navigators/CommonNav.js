import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import TabsNav from '../components/nav/TabsNav';
import UploadNav from '../components/nav/UploadNav';
import UploadForm from '../screen/UploadForm';

const Stack = createStackNavigator();

//  home, search, profile
export default function CommonNav() {
    return (
        <Stack.Navigator screenOptions={{ mode: 'modal' }}>
            <Stack.Screen name="Tabs" options={{ headerShown: false }} component={TabsNav} />
            <Stack.Screen name="Upload" options={{ headerShown: false }} component={UploadNav} />
            <Stack.Screen
                name="UploadForm"
                options={{
                    headerBackTitleVisible: false,
                    headerBackImage: ({ tintColor }) => <Ionicons color={tintColor} name="close" size={28} />,
                    title: 'Upload',
                    headerTintColor: 'white',
                    headerStyle: {
                        backgroundColor: 'black',
                    },
                }}
                component={UploadForm}
            />
        </Stack.Navigator>
    );
}
