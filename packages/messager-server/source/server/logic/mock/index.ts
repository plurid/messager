// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        MessagerLogic,
    } from '~server/data/interfaces';

    import {
        logLevel,
    } from '~server/data/constants';

    import Logger from '~server/logic/persisters/logger';
    // #endregion external
// #endregion imports



// #region module
const messagerLogic: MessagerLogic = {
    getCurrentOwner: async () => {
        return {
            id: uuid.generate(),
            tokens: [],
            projects: [],
            spaces: [],
        };
    },
    checkOwnerToken: async (
        token: string,
    ) => {
        if (!token) {
            return false;
        }

        return true;
    },
    getOwnerToken: async (
        identonym,
        key,
    ) => {
        return {
            token: 'owner-token',
        };
    },

    logger: new Logger(logLevel),
};
// #endregion module



// #region exports
export default messagerLogic;
// #endregion exports
