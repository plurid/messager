// #region imports
    // #region libraries
    import {
        Server,
    } from 'http';


    import PluridServer, {
        PluridServerMiddleware,
        PluridServerService,
        PluridServerPartialOptions,
        PluridServerTemplateConfiguration,
    } from '@plurid/plurid-react-server';
    // #endregion libraries


    // #region external
    import {
        routes,
        shell,
    } from '~shared/index';

    import {
        APPLICATION_ROOT,
    } from '~shared/data/constants';

    import helmet from '~kernel-services/helmet';

    import reduxStore from '~kernel-services/state/store';
    import reduxContext from '~kernel-services/state/context';

    import apolloClient from '~kernel-services/graphql/client';
    // #endregion external


    // #region internal
    import {
        PORT,
        EVENT_PATH,
        SOCKET_PATH,
    } from './data/constants';

    import preserves from './preserves';

    import setupHandlers from './handlers';
    import setupWebsockets from './handlers/websockets';

    import * as Models from './api/models';
    // #endregion internal
// #endregion imports



// #region module
// #region constants
/** ENVIRONMENT */
const watchMode = process.env.PLURID_WATCH_MODE === 'true';
const isProduction = process.env.ENV_MODE === 'production';
const buildDirectory = process.env.PLURID_BUILD_DIRECTORY || 'build';

const applicationRoot = APPLICATION_ROOT;
const openAtStart = watchMode
    ? false
    : isProduction
        ? false
        : true;
const debug = isProduction
    ? 'info'
    : 'error';


/** Custom styles to be loaded into the template. */
const styles: string[] = [
    //
];


/** Express-like middleware. */
const middleware: PluridServerMiddleware[] = [
    //
];


/** Services to be used in the application. */
const services: PluridServerService[] = [
    {
        name: 'Apollo',
        package: '@apollo/client',
        provider: 'ApolloProvider',
        properties: {
            client: apolloClient,
        },
    },
    {
        name: 'Redux',
        package: 'react-redux',
        provider: 'Provider',
        properties: {
            store: reduxStore({}),
            context: reduxContext,
        },
    },
];


const options: PluridServerPartialOptions = {
    serverName: 'Messager Server',
    buildDirectory,
    open: openAtStart,
    debug,
    ignore: [
        EVENT_PATH,
        SOCKET_PATH,
    ],
};

const template: PluridServerTemplateConfiguration = {
    root: applicationRoot,
};
// #endregion constants


// #region server
const messagerServer = new PluridServer({
    helmet,
    routes,
    preserves,
    shell,
    styles,
    middleware,
    services,
    options,
    template,
});


const messagerSetup = async (
    callback?: () => Promise<Server>,
) => {
    const successfulSetup = await setupHandlers(
        messagerServer,
    );

    if (successfulSetup && callback) {
        const server = await callback();

        setupWebsockets(server);
    }

    return successfulSetup;
}
// #endregion server
// #endregion module



// #region run
/**
 * If the file is called directly, as in `node build/index.js`,
 * it will run the server.
 *
 * The check is in place so that the server can also be imported
 * for programmatic usage.
 */
if (require.main === module) {
    messagerSetup(
        async () => {
            const server = messagerServer.start(PORT);

            return server;
        },
    );
}
// #endregion run



// #region exports
export * from './data/interfaces';

export {
    messagerSetup,
    Models,
};

export default messagerServer;
// #endregion exports
