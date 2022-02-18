import React, { useRef, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { Text, TouchableOpacity } from 'react-native';
import AuthButton from '../components/auth/AuthButton';
import AuthLayout from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/AuthShared';
import { logUserIn } from '../apollo';

const LOGIN_MUTATION = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            ok
            token
            error
        }
    }
`;

export default function LogIn({ navigation, route: { params } }) {
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            username: 'andooroid',
            password: '1234',
        },
    });
    const onCompleted = async (data) => {
        const {
            login: { ok, token },
        } = data;
        if (ok) {
            await logUserIn(token);
        }
    };
    const [logInMutation, { loading }] = useMutation(LOGIN_MUTATION, { onCompleted });
    const passwordRef = useRef();
    const onNext = (nextOne) => {
        nextOne?.current?.focus();
    };
    const onValid = (data) => {
        if (!loading) {
            logInMutation({
                variables: {
                    ...data,
                },
            });
        }
    };
    useEffect(() => {
        register('username', { required: true });
        register('password', { required: true });
    }, [register]);
    useEffect(() => {
        if (params) {
            setValue('username', params.username);
            setValue('password', params.password);
        }
    }, [params]);

    return (
        <AuthLayout>
            <TextInput
                autoFocus
                value={watch('username')}
                placeholder="Username"
                placeholderTextColor="gray"
                autoCapitalize="none"
                returnKeyType="next"
                placeholderTextColor={'rgba(255,255,255,0.5)'}
                onSubmitEditing={() => onNext(passwordRef)}
                onChangeText={(text) => setValue('username', text)}
            />
            <TextInput
                ref={passwordRef}
                value={watch('password')}
                placeholder="Password"
                placeholderTextColor="gray"
                secureTextEntry
                returnKeyType="done"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                lastOne={true}
                onChangeText={(text) => setValue('password', text)}
                onSubmitEditing={handleSubmit(onValid)}
            />
            <AuthButton
                text="Log In"
                disabled={!watch('username') || !watch('password')}
                onPress={handleSubmit(onValid)}
            />
            <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
                <Text style={{ marginTop: 10, color: 'white', textAlign: 'center' }}>회원가입</Text>
            </TouchableOpacity>
        </AuthLayout>
    );
}
