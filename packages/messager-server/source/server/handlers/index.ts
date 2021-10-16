// #region imports
    // #region libraries
    import PluridServer from '@plurid/plurid-react-server';
    // #endregion libraries


    // #region external
    import {
        MessagerLogic,
    } from '~server/data/interfaces';
    // #endregion external


    // #region internal
    import setupGlobal from './global';
    import setupMiddleware from './middleware';
    import setupGraphQL from './graphql';
    // #endregion internal
// #endregion imports



// #region module
const setupHandlers = async (
    server: PluridServer,
    logic?: MessagerLogic,
) => {
    const instance = server.instance();

    await setupMiddleware(
        instance,
        logic,
    );

    await setupGlobal(
        instance,
    );

    await setupGraphQL(
        instance,
        logic,
    );

    return true;
}
// #endregion module



// #region exports
export default setupHandlers;
// #endregion exports
