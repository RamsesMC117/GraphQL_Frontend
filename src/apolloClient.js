import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://192.168.239.191:4000/graphql', // URL de tu servidor GraphQL
    cache: new InMemoryCache(),
});

export default client;
