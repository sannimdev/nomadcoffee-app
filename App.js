import React, { useState } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import CommonNav from './navigators/CommonNav';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client, { isLoggedInVar, KEY_TOKEN, tokenVar, cache } from './apollo';
import { ApolloProvider } from '@apollo/client';
import { AsyncStorageWrapper, persistCache } from 'apollo3-cache-persist';

export default function App() {
    const [loading, setLoading] = useState(true);
    const onFinish = () => setLoading(false);
    const preloadAssets = () => {
        const fontsToLoad = [Ionicons.font];
        const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
        const imagesToLoad = [require('./assets/logo.png')];
        const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
        return Promise.all([...fontPromises, ...imagePromises]);
    };
    const preload = async () => {
        const token = await AsyncStorage.getItem(KEY_TOKEN);
        if (token) {
            tokenVar(token);
            isLoggedInVar(true);
        }
        await persistCache({
            cache,
            storage: new AsyncStorageWrapper(AsyncStorage),
        });
        return preloadAssets();
    };

    if (loading) {
        return <AppLoading startAsync={preload} onFinish={onFinish} onError={console.warn} />;
    }

    return (
        <ApolloProvider client={client}>
            <NavigationContainer>
                <CommonNav />
            </NavigationContainer>
        </ApolloProvider>
    );
}
