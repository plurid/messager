// #region imports
    // #region internal
    import * as Types from '../types';

    import initialState from '../initial';
    // #endregion internal
// #endregion imports



// #region module
export const addEntity = (
    state: Types.State,
    action: Types.AddEntityAction,
): Types.State => {
    const {
        type,
        data,
    } = action.payload;

    const newState = {
        ...state,
    };

    let tokens = [
        ...newState.tokens,
    ];
    let projects = [
        ...newState.projects,
    ];
    let spaces = [
        ...newState.spaces,
    ];
    let records = [
        ...newState.records,
    ];


    switch (type) {
        case 'token':
            tokens = [
                ...tokens,
                {
                    ...data,
                },
            ];
            break;
        case 'project':
            projects = [
                ...projects,
                {
                    ...data,
                },
            ];
            break;
        case 'space':
            spaces = [
                ...spaces,
                {
                    ...data,
                },
            ];
            break;
        case 'record':
            records = [
                ...records,
                {
                    ...data,
                },
            ];
            break;
    }

    return {
        ...newState,
        tokens: [
            ...tokens,
        ],
        projects: [
            ...projects,
        ],
        spaces: [
            ...spaces,
        ],
        records: [
            ...records,
        ],
    };
}


export const removeEntity = (
    state: Types.State,
    action: Types.RemoveEntityAction,
): Types.State => {
    const {
        id,
        type,
    } = action.payload;

    const newState = {
        ...state,
    };

    let tokens = [
        ...newState.tokens,
    ];
    let projects = [
        ...newState.projects,
    ];
    let spaces = [
        ...newState.spaces,
    ];
    let records = [
        ...newState.records,
    ];


    switch (type) {
        case 'token':
            tokens = tokens.filter(
                token => token.id !== id
            );
            break;
        case 'project':
            projects = projects.filter(
                project => project.id !== id
            );
            break;
        case 'space':
            spaces = spaces.filter(
                space => space.id !== id
            );
            break;
        case 'record':
            records = records.filter(
                record => record.id !== id
            );
            break;
    }

    return {
        ...newState,
        tokens: [
            ...tokens,
        ],
        projects: [
            ...projects,
        ],
        spaces: [
            ...spaces,
        ],
        records: [
            ...records,
        ],
    };
}


export const addEntities = (
    state: Types.State,
    action: Types.AddEntitiesAction,
): Types.State => {
    const {
        type,
        data,
        push,
    } = action.payload;

    const newState = {
        ...state,
    };


    let analytics = {
        ...newState.analytics,
    };
    let tokens = [
        ...newState.tokens,
    ];
    let projects = [
        ...newState.projects,
    ];
    let spaces = [
        ...newState.spaces,
    ];
    let records = [
        ...newState.records,
    ];


    switch (type) {
        case 'analytics.entries':
            analytics = {
                ...analytics,
                entries: {
                    ...data,
                },
            };
            break;
        case 'analytics.faults':
            analytics = {
                ...analytics,
                faults: {
                    ...data,
                },
            };
            break;
        case 'analytics.size':
            analytics = {
                ...analytics,
                size: {
                    ...data,
                },
            };
            break;
        case 'tokens':
            tokens = [
                ...data,
            ];
            break;
        case 'projects':
            projects = [
                ...data,
            ];
            break;
        case 'spaces':
            spaces = [
                ...data,
            ];
            break;
        case 'records':
            records = [
                ...data,
            ];
            break;
    }

    return {
        ...newState,
        analytics: {
            ...analytics,
        },
        tokens: [
            ...tokens,
        ],
        projects: [
            ...projects,
        ],
        spaces: [
            ...spaces,
        ],
        records: [
            ...records,
        ],
    };
}


export const removeEntities = (
    state: Types.State,
    action: Types.RemoveEntitiesAction,
): Types.State => {
    const {
        type,
        ids,
    } = action.payload;

    const newState = {
        ...state,
    };

    return {
        ...newState,
    };
}


export const clearData = (
    state: Types.State,
    action: Types.ClearDataAction,
): Types.State => {
    return {
        ...initialState,
    };
}



const resolvers = {
    addEntity,
    removeEntity,
    addEntities,
    removeEntities,
    clearData,
};
// #endregion module



// #region exports
export default resolvers;
// #endregion exports
