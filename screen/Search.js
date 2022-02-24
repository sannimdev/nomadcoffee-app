import React, { useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { View, TouchableOpacity, useWindowDimensions, FlatList, Image } from 'react-native';
import styled from 'styled-components/native';
import DismissKeyboard from '../components/DismissKeyboard';
import { defaultCafeImage } from '../components/CoffeeShopItem';

const Input = styled.TextInput`
    background-color: rgba(255, 255, 255, 1);
    width: ${(props) => props.width / 2};
    color: black;
    padding: 5px 10px;
    border-radius: 7px;
`;

const SEARCH_COFFEESHOPS = gql`
    query searchCoffeeShops($keyword: String!) {
        searchCoffeeShops(keyword: $keyword) {
            id
            photo {
                url
            }
        }
    }
`;

const MessageContainer = styled.View`
    justify-content: center;
    align-items: center;
`;
const MessageText = styled.Text`
    color: white;
`;

export default function Search({ navigation }) {
    const numColumns = 3;
    const { width } = useWindowDimensions();
    const { setValue, register, watch, handleSubmit } = useForm();
    const [startQueryFn, { loading, data, called }] = useLazyQuery(SEARCH_COFFEESHOPS, {
        variables: { keyword: watch('keyword') },
    });

    const onValid = ({ keyword }) => {
        startQueryFn({
            variables: { keyword },
        });
    };
    const SearchBox = () => (
        <Input
            width={width}
            style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
            placeholderTextColor="black"
            placeholder="Search CoffeeShops"
            autoCapitalize="none"
            returnKeyLabel="Search"
            returnKeyType="search"
            autoCorrect={false}
            onChangeText={(text) => setValue('keyword', text)}
            onSubmitEditing={handleSubmit(onValid)}
        />
    );
    useEffect(() => {
        navigation.setOptions({
            headerTitle: SearchBox,
        });
        register('keyword', { required: true, minLength: 2 });
    }, []);

    useEffect(() => {
        if (data) console.log(data, '데이터');
    }, [data]);

    const renderItem = ({ item: coffeeShop }) => (
        <TouchableOpacity>
            <Image
                source={{ uri: coffeeShop?.photo?.url || defaultCafeImage }}
                style={{ width: width / numColumns, height: 150, backgroundColor: 'white' }}
            />
        </TouchableOpacity>
    );
    watch();

    return (
        <DismissKeyboard>
            <View style={{ backgroundColor: 'black', flex: 1 }}>
                {loading ? (
                    <MessageContainer>
                        <MessageText>커피숍 불러오는 중...</MessageText>
                    </MessageContainer>
                ) : null}
                {!called ? (
                    <MessageContainer>
                        <MessageText>검색어를 입력하세요www</MessageText>
                    </MessageContainer>
                ) : null}
                {data?.searchCoffeeShops !== undefined && data?.searchCoffeeShops.length === 0 ? (
                    <MessageContainer>
                        <MessageText>검색 결과가 없습니다</MessageText>
                    </MessageContainer>
                ) : (
                    <FlatList
                        numColumns={numColumns}
                        data={data?.searchCoffeeShops}
                        keyExtractor={(coffeeShop) => coffeeShop.id + ''}
                        renderItem={renderItem}
                    />
                )}
            </View>
        </DismissKeyboard>
    );
}
