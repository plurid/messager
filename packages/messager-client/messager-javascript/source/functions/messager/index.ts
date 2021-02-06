// #region imports
    // #region external
    import {
        MessagerMetadata,
    } from '#data/interfaces';


    import {
        ENDPOINT,
        TOKEN,
    } from '#data/constants';


    import getGraphqlClient from '#services/graphql/client';

    import {
        PUBLISH,
        SEND,
        SUBSCRIBE,
    } from '#services/graphql/mutate';
    // #endregion external
// #endregion imports



// #region module
const getGlobalGraphqlClient = () => {
    if (!ENDPOINT || !TOKEN) {
        return;
    }

    const graphqlClient = getGraphqlClient(
        ENDPOINT,
        TOKEN,
    );

    return graphqlClient;
}


const messager = <T = any>(
    endpoint?: string,
    token?: string,
) => {
    const endpointURL = endpoint ?? ENDPOINT;
    const accessToken = token ?? TOKEN;


    const getSpecificGraphqlClient = () => {
        if (!endpointURL) {
            console.log('No messager endpoint.');
            return;
        }

        if (!accessToken) {
            console.log('No messager token.');
            return;
        }

        try {
            const globalGraphqlClient = getGlobalGraphqlClient();

            if (globalGraphqlClient) {
                return globalGraphqlClient;
            }

            const graphqlClient = getGraphqlClient(
                endpointURL,
                accessToken,
            );

            return graphqlClient;
        } catch (error) {
            console.log('Messager client error ', error);
            return;
        }
    }


    const publish = async (
        topic: string,
        data: T,
    ) => {
        const graphqlClient = getSpecificGraphqlClient();
        if (!graphqlClient) {
            return false;
        }

        try {
            const mutation = await graphqlClient.mutate({
                mutation: PUBLISH,
                variables: {
                    input: {
                        topic,
                        data: JSON.stringify(data),
                    },
                },
            });

            if (!mutation.data) {
                return false;
            }

            if (!mutation.data.messagerMutationPublish.status) {
                return false;
            }

            return true;
        } catch (error) {
            console.log('Messager publish error: ', error);
            return false;
        }
    }

    const subscribe = (
        topic: string,
        callback: (
            data: T,
            metadata: MessagerMetadata,
        ) => void,
    ) => {
        const graphqlClient = getSpecificGraphqlClient();
        if (!graphqlClient) {
            return;
        }

        try {
            const observable = graphqlClient.subscribe({
                query: SUBSCRIBE,
                variables: {
                    input: {
                        topic,
                    },
                },
            });

            observable.subscribe(result => {
                if (result.data) {
                    try {
                        const message: T = JSON.parse(result.data.message);
                        callback(
                            message,
                            {
                                sender: result.data.sender,
                            },
                        );
                    } catch (error) {
                        console.log('Messager subscribe error: ', error);
                    }
                }
            });

            return;
        } catch (error) {
            console.log('Messager subscribe error: ', error);
            return;
        }
    }

    const send = async (
        destination: string,
        data: T,
    ) => {
        const graphqlClient = getSpecificGraphqlClient();
        if (!graphqlClient) {
            return false;
        }

        try {
            const mutation = await graphqlClient.mutate({
                mutation: SEND,
                variables: {
                    input: {
                        destination,
                        data: JSON.stringify(data),
                    },
                },
            });

            if (!mutation.data) {
                return false;
            }

            if (!mutation.data.messagerMutationSend.status) {
                return false;
            }

            return true;
        } catch (error) {
            console.log('Messager send error: ', error);
            return false;
        }
    }


    return {
        publish,
        subscribe,
        send,
    };
};
// #endregion module



// #region exports
export default messager;
// #endregion exports
