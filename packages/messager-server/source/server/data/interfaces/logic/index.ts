// #region imports
    // #region external
    import {
        MessagerOwner,
        OwnerToken,
    } from '../general';

    import {
        Logger,
    } from '../logger';
    // #endregion external
// #endregion imports



// #region module
export interface MessagerLogic {
    getCurrentOwner: () => Promise<MessagerOwner>;
    checkOwnerToken: (
        token: string,
    ) => Promise<boolean>;
    getOwnerToken: (
        identonym: string,
        key: string,
    ) => Promise<OwnerToken>;
    logger: Logger;
}
// #endregion module
