import { gql, useMutation } from '@apollo/client';
import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import AuthButton from '../components/auth/AuthButton';
import AuthLayout from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/AuthShared';

const CREATE_USER_MUTATION = gql`
    mutation createUser(
        $username: String!
        $email: String!
        $name: String!
        $password: String!
        $githubUsername: String
    ) {
        createUser(
            username: $username
            email: $email
            name: $name
            password: $password
            githubUsername: $githubUsername
        ) {
            ok
            error
        }
    }
`;

export default function CreateAccount({ navigation }) {
    const { register, handleSubmit, setValue, getValues } = useForm();
    const onCompleted = (data) => {
        const {
            createUser: { ok },
        } = data;
        if (ok) {
            const { username, password } = getValues();
            navigation.navigate('LogIn', { username, password });
        }
    };
    const [createUserMutation, { loading }] = useMutation(CREATE_USER_MUTATION, { onCompleted });
    const usernameRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const githubUsernameRef = useRef();

    const onNext = (nextOne) => {
        nextOne?.current?.focus();
    };

    const onValid = (data) => {
        if (!loading) {
            createUserMutation({
                variables: {
                    ...data,
                },
            });
        }
    };

    useEffect(() => {
        register('name', { required: true });
        register('email', { required: true });
        register('username', { required: true });
        register('password', { required: true });
        register('githubUsername');
    }, [register]);
    return (
        <AuthLayout>
            <TextInput
                autoFocus
                ref={nameRef}
                placeholder="Name"
                placeholderTextColor="gray"
                returnKeyType="next"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                onChangeText={(text) => setValue('name', text)}
                onSubmitEditing={() => onNext(emailRef)}
            />
            <TextInput
                ref={emailRef}
                placeholder="Email"
                placeholderTextColor="gray"
                keyboardType="email-address"
                returnKeyType="next"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                onChangeText={(text) => setValue('email', text)}
                onSubmitEditing={() => onNext(usernameRef)}
            />
            <TextInput
                ref={usernameRef}
                placeholder="Username"
                placeholderTextColor="gray"
                returnKeyType="next"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                onChangeText={(text) => setValue('username', text)}
                onSubmitEditing={() => onNext(passwordRef)}
            />
            <TextInput
                ref={passwordRef}
                placeholder="Password"
                placeholderTextColor="gray"
                secureTextEntry
                returnKeyType="next"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                onChangeText={(text) => setValue('password', text)}
                onSubmitEditing={() => onNext(githubUsernameRef)}
            />
            <TextInput
                ref={githubUsernameRef}
                placeholder="Github Username (Optional)"
                placeholderTextColor="gray"
                returnKeyType="done"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                onChangeText={(text) => setValue('githubUsername', text)}
                onSubmitEditing={handleSubmit(onValid)}
                lastOne={true}
            />
            <AuthButton text="Create Account" loading={loading} onPress={handleSubmit(onValid)} />
        </AuthLayout>
    );
}
