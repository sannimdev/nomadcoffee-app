import React, { useEffect } from 'react';
import { ReactNativeFile } from 'apollo-upload-client';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, FlatList, Image, Option } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { palette } from '../palette';
import DismissKeyboard from '../components/DismissKeyboard';
import { gql, useMutation, useQuery } from '@apollo/client';
import SelectDropdown from 'react-native-select-dropdown';

const UPLOAD_COFFEESHOP_PHOTO = gql`
    mutation uploadCoffeeShopPhoto($photo: Upload!, $shopId: Int!) {
        uploadCoffeeShopPhoto(photo: $photo, shopId: $shopId) {
            id
            url
            shop {
                id
            }
        }
    }
`;

const SEE_ALL_COFFEESHOPS_QUERY = gql`
    query SeeAllCoffeeShops {
        seeAllCoffeeShops {
            id
            name
        }
    }
`;

const Container = styled.View`
    flex: 1;
    background-color: black;
    padding: 0px 50px;
`;
const Photo = styled.Image`
    height: 350px;
`;

const HeaderRightText = styled.Text`
    color: ${palette.blue};
    font-size: 16px;
    font-weight: 600;
    margin-right: 7px;
`;

const ImageContainer = styled.TouchableOpacity``;

export default function UploadForm({ route, navigation }) {
    const { register, handleSubmit, setValue, watch, getValues } = useForm();
    const {
        params: { files = [] },
    } = route;
    const onUploaded = (cache, result) => {
        const {
            data: { uploadCoffeeShopPhoto },
        } = result;
        if (uploadCoffeeShopPhoto.id) {
            cache.modify({
                id: 'ROOT_QUERY',
                fields: {
                    seeCoffeeShops(prev) {
                        return [uploadCoffeeShopPhoto, ...prev];
                    },
                },
            });
            navigation.goBack();
            navigation.goBack();
        }
    };
    const [uploadCoffeeShopPhotoMutation, { loading, error }] = useMutation(UPLOAD_COFFEESHOP_PHOTO, {
        update: onUploaded,
    });

    const CoffeeShopDropDown = (coffeeShops) => (
        <SelectDropdown
            data={coffeeShops.map((shop) => shop.name)}
            onSelect={(selectedItem, index) => {
                setValue('shopId', parseInt(coffeeShops[index].id));
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
            }}
        />
    );
    useQuery(SEE_ALL_COFFEESHOPS_QUERY, {
        onCompleted: ({ seeAllCoffeeShops }) => {
            register('shopId', { required: true });
            setValue('shopId', Array.isArray(seeAllCoffeeShops) ? seeAllCoffeeShops[0].id : 1);
            navigation.setOptions({
                headerTitle: () => CoffeeShopDropDown(seeAllCoffeeShops),
            });
        },
    });

    const HeaderRight = () => (
        <TouchableOpacity onPress={handleSubmit(onValid)}>
            <HeaderRightText>Next</HeaderRightText>
        </TouchableOpacity>
    );
    const HeaderRightLoading = () => <ActivityIndicator size="small" color="white" style={{ marginRight: 10 }} />;
    useEffect(() => {
        register('shopId');
    }, [register]);
    watch();

    useEffect(() => {
        navigation.setOptions({
            headerRight: loading ? HeaderRightLoading : HeaderRight,
            ...(loading && { headerLeft: () => null }),
        });
    }, [loading]);
    const onValid = ({ caption }) => {
        const { shopId } = getValues();
        files
            .filter((f) => f?.uri)
            .forEach((f) => {
                const photo = new ReactNativeFile({
                    uri: f.uri,
                    name: `${shopId}.jpg`,
                    type: 'image/jpeg',
                });
                uploadCoffeeShopPhotoMutation({
                    variables: {
                        photo,
                        shopId,
                    },
                });
            });
    };

    const numColumns = 3;
    const renderItem = ({ item: photo }) => (
        <ImageContainer>
            <Image source={{ uri: photo.uri }} style={{ width: 300 / numColumns, height: 100 }} />
        </ImageContainer>
    );

    return (
        <DismissKeyboard>
            <Container>
                <FlatList
                    data={files}
                    numColumns={numColumns}
                    keyExtractor={(photo) => photo.id}
                    renderItem={renderItem}
                />
            </Container>
        </DismissKeyboard>
    );
}
