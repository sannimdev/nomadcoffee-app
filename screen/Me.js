import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { logUserOut } from '../apollo';
import AuthButton from '../components/auth/AuthButton';
import AuthLayout from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/AuthShared';

const ME_QUERY = gql`
    query me {
        me {
            id
            name
            email
            username
            githubUsername
            avatarURL
        }
    }
`;

export default function CreateAccount({ navigation }) {
    const [myProfile, setMyProfile] = useState({});
    const fields = ['name', 'email', 'username', 'githubUsername', 'avatarURL'];
    const { register, handleSubmit, setValue, getValues, watch } = useForm();
    const onCompleted = (data) => {
        const {
            createUser: { ok },
        } = data;
        if (ok) {
            const { username, password } = getValues();
            navigation.navigate('LogIn', { username, password });
        }
    };
    const onLoadCompleted = (data) => {
        const { me } = data;
        if (me) {
            setMyProfile({ ...me });
        }
    };
    const { loading: queryLoading } = useQuery(ME_QUERY, { onCompleted: onLoadCompleted });
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
            {myProfile?.avatarURL && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                    <Image style={{ width: 150, height: 150, borderRadius: '50%' }} source={myProfile.avatarURL} />
                </View>
            )}
            <TextInput
                autoFocus
                ref={nameRef}
                value={myProfile?.name || ''}
                placeholder="Name"
                placeholderTextColor="gray"
                returnKeyType="next"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                onChangeText={(text) => setValue('name', text)}
                onSubmitEditing={() => onNext(emailRef)}
            />
            <TextInput
                ref={emailRef}
                value={myProfile?.email || ''}
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
                value={myProfile?.username || ''}
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
                value={myProfile?.githubUsername || ''}
                placeholder="Github Username (Optional)"
                placeholderTextColor="gray"
                returnKeyType="done"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                onChangeText={(text) => setValue('githubUsername', text)}
                onSubmitEditing={handleSubmit(onValid)}
                lastOne={true}
            />
            <AuthButton text="Update My Profile" loading={queryLoading} onPress={handleSubmit(onValid)} />
            <TouchableOpacity onPress={() => logUserOut()}>
                <Text style={{ marginTop: 10, color: 'white', textAlign: 'center' }}>로그아웃</Text>
            </TouchableOpacity>
        </AuthLayout>
    );
}
