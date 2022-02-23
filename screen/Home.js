import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import CoffeeShopItem from '../components/CoffeeShopItem';
import ScreenLayout from '../components/ScreenLayout';

export const SEE_COFFEESHOPS_QUERY = gql`
    query SeeCoffeeShops($page: Int!) {
        seeCoffeeShops(page: $page) {
            categories {
                id
                name
            }
            id
            name
            user {
                username
                avatarURL
            }
            photo {
                url
            }
        }
    }
`;

export default function Home() {
    const [page, setPage] = useState(2);
    const { loading, data, refetch, fetchMore } = useQuery(SEE_COFFEESHOPS_QUERY, { variables: { page: 1 } });
    const [refreshing, setRefreshing] = useState(false);
    const [beforeItemLength, setBeforeItemLength] = useState(0);
    const RenderCoffeeShop = ({ item }) => <CoffeeShopItem {...item} />;

    const fetchMoreCoffeeShops = () => {
        if (beforeItemLength !== data?.seeCoffeeShops?.length) {
            fetchMore({ variables: { page } });
            setPage((page) => page + 1);
            setBeforeItemLength(data?.seeCoffeeShops?.length);
        }
    };

    return (
        <ScreenLayout loading={loading}>
            <FlatList
                onEndReachedThreshold={0.2}
                onEndReached={fetchMoreCoffeeShops}
                refreshing={refreshing}
                onRefresh={refetch}
                style={{ width: '100%' }}
                showsVerticalScrollIndicator={false}
                data={data?.seeCoffeeShops}
                keyExtractor={(item) => item.id + ''}
                renderItem={RenderCoffeeShop}
            />
        </ScreenLayout>
    );
}
