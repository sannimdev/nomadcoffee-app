import React, { useState } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Asset } from 'expo-asset';

export default function App() {
    const [loading, setLoading] = useState(true);
    const onFinish = () => setLoading(false);
    const preload = () => {
        const fontsToLoad = [Ionicons.font];
        const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));
        const imagesToLoad = [require('./assets/logo.png')];
        const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
        return Promise.all([...fontPromises, ...imagePromises]);
    };

    if (loading) {
        return <AppLoading startAsync={preload} onFinish={onFinish} onError={console.warn} />;
    }

    return (
        <View style={styles.container}>
            <Text>Nomad Coffee!</Text>
            <Ionicons name="md-checkmark-circle" size={32} color="green" />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
