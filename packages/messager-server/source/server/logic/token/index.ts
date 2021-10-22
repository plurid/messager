// #region imports
    // #region external
    import {
        TEST_MODE,
        TEST_MODE_TOKEN,
        PRIVATE_OWNER_IDENTONYM,
    } from '~server/data/constants';

    import database from '~server/services/database';
    import tokensCacher from '~server/services/tokensCacher';
    // #endregion external
// #endregion imports



// #region module
export const getMessagerIDWithToken = async (
    token: string | undefined | null,
    authenticationMarkers?: any,
): Promise<string | undefined> => {
    if (TEST_MODE) {
        if (token !== TEST_MODE_TOKEN) {
            return;
        }

        return PRIVATE_OWNER_IDENTONYM || TEST_MODE_TOKEN;
    }


    if (!token) {
        return;
    }


    const cachedTokenOwner = tokensCacher.get(token);
    if (cachedTokenOwner) {
        return cachedTokenOwner;
    }


    const tokenData = await database.get(
        'tokens',
        token,
    );
    if (!tokenData) {
        return;
    }


    const ownerID = tokenData.ownedBy;

    tokensCacher.set(token, ownerID);

    return ownerID;
}
// #endregion module
