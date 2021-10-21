// #region imports
    // #region external
    import {
        Token,
        ClientToken,
        Project,
        Space,
    } from '~server/data/interfaces';

    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
export const loadTokens = async (
    ownerID: string,
) => {
    const tokens: Token[] = await database.query(
        'tokens',
        'ownedBy',
        ownerID,
    );

    const clientTokens = tokens.map(token => {
        const {
            id,
            name,
            startsWith,
        } = token;

        const clientToken: ClientToken = {
            id,
            name,
            startsWith,
        };

        return clientToken;
    });

    return clientTokens;
}


export const loadProjects = async (
    ownerID: string,
) => {
    const projects: Project[] = await database.query(
        'projects',
        'ownedBy',
        ownerID,
    );

    return projects;
}


export const loadSpaces = async (
    ownerID: string,
) => {
    const spaces: Space[] = await database.query(
        'spaces',
        'ownedBy',
        ownerID,
    );

    return spaces;
}


export const loadRecords = async (
    ownerID: string,
) => {
    const records: any[] = await database.query(
        'records',
        'ownedBy',
        ownerID,
    );

    const modeledRecords = records.map(record => {
        const {
            type,
            sseID,
            data,
        } = record;

        return {
            id: Math.random() + '',
            type,
            sseID,
            data: {
                type: data.type,
                topic: data.topic,
                data: typeof data.data === 'string' ? data.data : JSON.stringify(data.data),
            },
        };
    });

    return modeledRecords;
}



const loadData = async (
    ownerID: string | undefined,
) => {
    if (!ownerID) {
        return {
            tokens: [],
            projects: [],
            spaces: [],
            records: [],
        };
    }

    const tokens = await loadTokens(
        ownerID,
    );

    const projects = await loadProjects(
        ownerID,
    );

    const spaces = await loadSpaces(
        ownerID,
    );

    const records = await loadRecords(
        ownerID,
    );


    const data = {
        tokens,
        projects,
        spaces,
        records,
    };

    return data;
}
// #endregion module



// #region exports
export default loadData;
// #endregion exports
