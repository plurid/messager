// #region imports
    // #region libraries
    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        Token,
        InputGenerateToken,
        InputUpdateToken,
    } from '~server/data/interfaces';

    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
const registerToken = async (
    input: InputGenerateToken,
    ownedBy: string,
) => {
    const id = uuid.generate();
    const value = uuid.generate() + uuid.generate();
    const startsWith = value.slice(0, 7);

    const token: Token = {
        id,
        name: input.name,
        value,
        ownedBy,
        startsWith,
        useOrigins: input.useOrigins,
        origins: input.origins || [],
        useIPs: input.useIPs,
        ips: input.ips || [],
        useKey: input.useKey,
        key: input.key || '',
    };

    await database.store(
        'tokens',
        id,
        token,
    );

    return token;
}


const updateToken = async (
    input: InputUpdateToken,
) => {
    const token: Token | undefined = await database.get(
        'tokens',
        input.tokenID,
    );
    if (!token) {
        return;
    }

    const updatedToken: Token = {
        ...token,
        name: input.name || token.name,
        useOrigins: input.useOrigins ?? token.useOrigins,
        origins: input.origins || token.origins,
        useIPs: input.useIPs ?? token.useIPs,
        ips: input.ips || token.ips,
        useKey: input.useKey ?? token.useKey,
        key: input.key || token.key,
    };

    return updatedToken;
}


const deregisterToken = async (
    id: string,
) => {
    try {
        await database.obliterate(
            'tokens',
            {
                id,
            },
        );
    } catch (error) {
        return;
    }
}
// #endregion module



// #region exports
export {
    registerToken,
    updateToken,
    deregisterToken,
};
// #endregion exports
