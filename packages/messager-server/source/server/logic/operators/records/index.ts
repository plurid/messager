// #region imports
    // #region external
    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
export const deregisterRecord = async (
    id: string,
    ownedBy: string,
) => {
    return deregisterRecords(
        [id],
        ownedBy,
    );
}


export const deregisterRecords = async (
    ids: string[],
    ownedBy: string,
) => {
    for (const id of ids) {
        database.obliterate(
            'records',
            {
                id,
                ownedBy,
            }
        );
    }
}


export const deregisterAllRecords = async (
    ownedBy: string,
) => {
    await database.obliterateAll(
        'records',
        {
            ownedBy,
        }
    );
}
// #endregion module
