// #region imports
    // #region libraries
    import {
        Batcher,
    } from '@plurid/plurid-data-structures';
    // #endregion libraries


    // #region external
    import {
        Record,
    } from '~server/data/interfaces';

    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
const recordsBatcher = new Batcher<Record>(
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
