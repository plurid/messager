// #region imports
    // #region libraries
    import {
        Application,
    } from 'express';
    // #endregion libraries


    // #region external
    import {
        EVENT_PATH,
        NOTIFY_PATH,
    } from '~server/data/constants';

    import database from '~server/services/database';

    import {
        Events,
        Notify,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region module
const setup = async (
    instance: Application,
) => {
    try {
        await database.initialize();

        instance.get(EVENT_PATH, Events.handleGet);
        instance.post(EVENT_PATH, Events.handlePost);

        instance.post(NOTIFY_PATH, Notify.handlePost);
    } catch (error: any) {
        return;
    }
}
// #endregion module



// #region exports
export default setup;
// #endregion exports
