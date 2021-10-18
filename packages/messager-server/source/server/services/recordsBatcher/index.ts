// #region imports
    // #region libraries
    import {
        Batcher,
    } from '@plurid/plurid-data-structures';
    // #endregion libraries


    // #region external
    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
const recordsBatcher = new Batcher<any>(
    async (
        records,
    ) => {
        database.storeBatch(
            'records',
            records,
        );
    },
);
// #endregion module



// #region exports
export default recordsBatcher;
// #endregion exports
