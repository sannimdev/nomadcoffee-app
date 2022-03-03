import { ApolloClient, makeVar } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from '@apollo/client/link/error';

export const KEY_TOKEN = 'token';
export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar('');
export const logUserIn = async (token) => {
    await AsyncStorage.setItem(KEY_TOKEN, token);
    isLoggedInVar(true);
    tokenVar(token);
};

export const logUserOut = async () => {
    await AsyncStorage.removeItem(KEY_TOKEN);
    isLoggedInVar(false);
    tokenVar(null);
};

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        console.log(`GraphQL Error`, graphQLErrors);
    }
    if (networkError) {
        console.log('Network Error', networkError);
    }
});

const httpUploadLink = createUploadLink({
    uri:
        process.env.NODE_ENV === 'production'
            ? 'https://nomadcoffee-2022.herokuapp.com/'
            : 'http://10.1.1.160:4000/graphql',
    credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            token: tokenVar() || '',
        },
    };
});

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                seeCoffeeShops: {
                    keyArgs: false,
                    merge(existing = [], incoming = []) {
                        return [...existing, ...incoming];
                    },
                },
            },
        },
    },
});

const client = new ApolloClient({
    link: authLink.concat(onErrorLink).concat(httpUploadLink),
    cache,
});

export default client;
