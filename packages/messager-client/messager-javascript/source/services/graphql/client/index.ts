// #region imports
    // #region libraries
    import fetch from 'cross-fetch';

    import {
        ApolloClient,
        HttpLink,
        InMemoryCache,
    } from '@apollo/client/core';
    // #endregion libraries


    // #region external
    import {
        ENDPOINT,
        TOKEN,
    } from '#data/constants';
    // #endregion external
// #endregion imports



// #region module
const client = (
    uri: string,
    token: string,
) => {
    const httpLink = new HttpLink({
        uri,
        credentials: 'include',
        fetch,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    return new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
    });
};


const getGlobalGraphqlClient = () => {
    if (!ENDPOINT || !TOKEN) {
        return;
    }

    const graphqlClient = client(
        ENDPOINT,
        TOKEN,
    );

    return graphqlClient;
}

const globalGraphqlClient = getGlobalGraphqlClient();
// #endregion module



// #region exports
export {
    globalGraphqlClient,
};

export default client;
// #endregion exports
