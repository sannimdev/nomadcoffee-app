import React from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, View, Text } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: black;
    padding: 0 40px;
`;

const Logo = styled.Image`
    max-width: 50%;
    width: 25px;
    height: 25px;
    margin-bottom: 20px;
`;

export default function AuthLayout({ children }) {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    return (
        <TouchableWithoutFeedback style={{ height: '100%' }} onPress={dismissKeyboard} disabled={Platform.OS === 'web'}>
            <Container>
                <KeyboardAvoidingView
                    style={{ width: '100%', justifyContent: 'center' }}
                    behavior="position"
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Logo resizeMode="contain" source={require('../../assets/logo.png')} />
                        <Text style={{ marginLeft: 10, color: 'white' }}>Nomad Coffee</Text>
                    </View>
                    {children}
                </KeyboardAvoidingView>
            </Container>
        </TouchableWithoutFeedback>
    );
}
