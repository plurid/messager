// #region imports
    // #region external
    import {
        MessagerConfiguration,
        MessagerMetadata,
    } from '~data/interfaces';


    import {
        ENDPOINT,
        TOKEN,
    } from '~data/constants';


    import getGraphqlClient, {
        globalGraphqlClient,
    } from '~services/graphql/client';

    import {
        PUBLISH,
        SEND,
        SUBSCRIBE,
    } from '~services/graphql/mutate';

    import defaultLogger from '~services/logger';
    // #endregion external
// #endregion imports



// #region module
const messager = <T = any>(
    configuration?: MessagerConfiguration,
) => {
    const endpointURL = configuration?.endpoint ?? ENDPOINT;
    const accessToken = configuration?.token ?? TOKEN;
    const activeLogger = configuration?.logger || defaultLogger;


    const getSpecificGraphqlClient = () => {
        if (!endpointURL) {
            activeLogger(
                'No messager endpoint.',
            );
            return;
        }

        if (!accessToken) {
            activeLogger(
                'No messager token.',
            );
            return;
        }

        try {
            if (globalGraphqlClient
                && !configuration?.endpoint
                && !configuration?.token
            ) {
                return globalGraphqlClient;
            }

            const graphqlClient = getGraphqlClient(
                endpointURL,
                accessToken,
            );

            return graphqlClient;
        } catch (error) {
            activeLogger(
                'Messager client error.',
                error,
            );
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
            activeLogger(
                'Messager publish error.',
                error,
            );
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
                        activeLogger(
                            'Messager subscribe error.',
                            error,
                        );
                    }
                }
            });

            return;
        } catch (error) {
            activeLogger(
                'Messager subscribe error.',
                error,
            );
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
            activeLogger(
                'Messager send error.',
                error,
            );
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
