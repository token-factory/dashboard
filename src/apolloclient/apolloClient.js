import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { withClientState } from 'apollo-link-state';
import introspectionQueryResultData from '../data/fragmentTypes.json';
import typeDefs from './schema';

import resolvers from './resolvers';
import { ApolloLink } from 'apollo-link';

const _nodeENV = process.env.NODE_ENV;

//default link options
const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
    },
    query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
    },
    mutate: {
        errorPolicy: 'all'
    }
};

const defaults = {
    networkStatus: {
        __typename: 'NetworkStatus',
        isConnected: false
    },
    notificationStatus: {
        __typename: 'Notification',
        title: '',
        message: '',
        kind: 0, //toast kind, 0: info, 1: sucess, 2: warning, 3: error
        popup: false,
        withoutHeader: false
    }
};

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
});

//TODO: should UI talks directly to the Graphql service instead of ingress?
const uri = _nodeENV === 'development'
    ? 'http://localhost:9000/token-factory'
    : '/token-factory';

const cache = new InMemoryCache({ fragmentMatcher });

//Apollo Links
const httpLink = createHttpLink({ uri: uri });

const stateLink = withClientState({
    cache,
    resolvers,
    typeDefs,
    defaults
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('authToken');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

export const apolloClient = new ApolloClient({
    cache: cache,
    link: ApolloLink.from([stateLink, authLink, httpLink]),
    defaultOptions
});

export default apolloClient;
