import React from 'react';
import { Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function DismissKeyboard({ children }) {
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    return (
        <TouchableWithoutFeedback style={{ height: '100%' }} onPress={dismissKeyboard} disabled={Platform.OS === 'web'}>
            {children}
        </TouchableWithoutFeedback>
    );
}
