// #region imports
    // #region external
    import {
        AuthenticationMarkers,
        Token,
    } from '~server/data/interfaces';

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
    authenticationMarkers?: AuthenticationMarkers,
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


    const query: Token[] | undefined = await database.query(
        'tokens',
        'value',
        token,
    );
    if (!query) {
        return;
    }
    const tokenData = query[0];
    if (!tokenData) {
        return;
    }


    if (tokenData.useIPs) {
        if (!authenticationMarkers?.ip) {
            return;
        }

        if (!tokenData.ips.includes(authenticationMarkers.ip)) {
            return;
        }
    }

    if (tokenData.useOrigins) {
        if (!authenticationMarkers?.origin) {
            return;
        }

        if (!tokenData.origins.includes(authenticationMarkers.origin)) {
            return;
        }
    }

    if (tokenData.useKey) {
        if (!authenticationMarkers?.key) {
            return;
        }

        if (authenticationMarkers.key !== tokenData.key) {
            return;
        }
    }


    const ownerID = tokenData.ownedBy;

    tokensCacher.set(token, ownerID);

    return ownerID;
}
// #endregion module
