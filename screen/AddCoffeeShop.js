import React, { useEffect, useRef } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import AuthButton from '../components/auth/AuthButton';
import AuthLayout from '../components/auth/AuthLayout';
import { TextInput } from '../components/auth/AuthShared';
import useMe from '../hook/useMe';

const MUTATION_CREATE_COFFEESHOP = gql`
    mutation createCoffeeShop($name: String!, $latitude: String, $longitude: String) {
        createCoffeeShop(name: $name, latitude: $latitude, longitude: $longitude) {
            ok
            id
            error
        }
    }
`;

export const SEE_COFFEESHOP_QUERY = gql`
    query SeeCoffeeShop($id: Int!) {
        seeCoffeeShop(id: $id) {
            name
            longitude
            latitude
            isMine
        }
    }
`;

export default function AddCoffeeShop({ navigation }) {
    const { register, handleSubmit, setValue, getValues, watch } = useForm();
    watch();
    const { data: userData } = useMe();
    const [createCoffeeShop, { loading, error }] = useMutation(MUTATION_CREATE_COFFEESHOP, { update: onCompleted });

    const onNext = (nextOne) => {
        nextOne?.current?.focus();
    };

    const onValid = (data) => {
        if (loading) {
            return false;
        }
        createCoffeeShop({ variables: { ...data } });
    };
    const onCompleted = (cache, result) => {
        const {
            data: {
                createCoffeeShop: { ok, id, error },
            },
        } = result;
        if (!ok) {
            return setError('result', { message: error });
        }
        // cache 업데이트
        const { name, latitude = '', longitude = '' } = getValues();
        const user = userData?.me;
        const newCoffeeShop = {
            __typename: 'CoffeeShop',
            id,
            isMine: true,
            name,
            latitude,
            longitude,
            user: {
                ...user,
            },
        };
        cache.writeFragment({
            data: newCoffeeShop,
            fragment: gql`
                fragment NewCoffeeShop on CoffeeShop {
                    id
                    isMine
                    name
                    latitude
                    longitude
                    user {
                        username
                        avatarURL
                    }
                }
            `,
        });
        cache.modify({
            id: `ROOT_QUERY`,
            fields: {
                seeCoffeeShops: (prev) => [newCoffeeShop, ...prev],
            },
        });
        const { seeCoffeeShops = [] } = cache.readQuery({ query: SEE_COFFEESHOPS_QUERY });
        // navigate(routes.home);
        // window.location.reload();
    };

    useEffect(() => {
        register('name', { required: true });
        register('latitude');
        register('longitude');
        register('category');
    }, [register]);

    const coffeeShopNameRef = useRef();
    const latitudeRef = useRef();
    const longitudeRef = useRef();
    const categoryRef = useRef();

    return (
        <AuthLayout title="커피숍 등록하기">
            <TextInput
                autoFocus
                ref={coffeeShopNameRef}
                placeholder="커피숍 이름"
                placeholderTextColor="gray"
                returnKeyType="next"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                onChangeText={(text) => setValue('name', text)}
                onSubmitEditing={() => onNext(emailRef)}
            />
            <TextInput
                ref={latitudeRef}
                placeholder="위도"
                placeholderTextColor="gray"
                returnKeyType="next"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                onChangeText={(text) => setValue('latitude', text)}
                onSubmitEditing={() => onNext(usernameRef)}
            />
            <TextInput
                ref={longitudeRef}
                placeholder="경도"
                placeholderTextColor="gray"
                returnKeyType="next"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                onChangeText={(text) => setValue('longitude', text)}
                onSubmitEditing={() => onNext(passwordRef)}
            />
            <TextInput
                ref={categoryRef}
                placeholder="카테고리 (공백으로 구분)"
                placeholderTextColor="gray"
                returnKeyType="next"
                placeholderTextColor={'rgba(255,255,255,0.6)'}
                onChangeText={(text) => setValue('category', text)}
                onSubmitEditing={() => onNext(githubUsernameRef)}
                lastOne={true}
            />
            <AuthButton text="Create a new Coffee Shop" loading={loading} onPress={handleSubmit(onValid)} />
        </AuthLayout>
    );
}
