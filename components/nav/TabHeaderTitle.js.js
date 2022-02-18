import React from 'react';
import { Image, Text, View } from 'react-native';

export default function TabHeaderTitle({ title }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                <Image
                    style={{
                        marginTop: 5,
                        maxWidth: 20,
                        maxHeight: 20,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        marginRight: 5,
                    }}
                    resizeMode="contain"
                    source={require('../../assets/logo.png')}
                />
                <Text style={{ color: 'white', fontSize: 20 }}>{title || 'Nomad Coffee'}</Text>
            </View>
        </View>
    );
}
