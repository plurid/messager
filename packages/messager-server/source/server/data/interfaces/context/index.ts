// #region imports
    // #region libraries
    import {
        Request,
        Response,
        Application,
    } from 'express';
    // #endregion libraries


    // #region external
    import {
        ClientToken,
        Project,
        Space,
        Record,
    } from '../general';

    import {
        MessagerLogic,
    } from '../logic';

    import {
        Logger,
        LogLevels,
    } from '../logger';
    // #endregion external
// #endregion imports



// #region module
export interface Context {
    request: MessagerRequest;
    response: Response;

    instance: Application;

    tokens: ClientToken[];
    projects: Project[];
    spaces: Space[];
    records: Record[];

    customLogicUsage: boolean;

    privateUsage: boolean;
    privateOwnerIdentonym: string | undefined;

    logger: Logger;
    logLevel: number;
    logLevels: LogLevels;
}


export type MessagerRequest = Request & {
    messagerLogic: MessagerLogic | undefined;
    rawBody: string | undefined;
}
// #endregion module
