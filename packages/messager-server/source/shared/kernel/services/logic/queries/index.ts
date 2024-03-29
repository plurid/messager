// #region imports
    // #region libraries
    import { AnyAction } from 'redux';
    import { ThunkDispatch } from 'redux-thunk';

    import {
        graphql,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        InputQuery,
    } from '~server/data/interfaces';

    import {
        AnalyticsRecordsCount,
    } from '~kernel-data/interfaces';

    import client from '~kernel-services/graphql/client';

    import {
        GET_CURRENT_OWNER,
        GET_USAGE_TYPE,
        GET_ANALYTICS_LAST_PERIOD,
        GET_ANALYTICS_SIZE,
        GET_RECORDS,
        VERIFY_UNIQUE_ID,
    } from '~kernel-services/graphql/query';

    import actions from '~kernel-services/state/actions';
    // #endregion external
// #endregion imports



// #region module
/**
 * Get current owner.
 *
 * @param dispatch
 */
const getCurrentOwner = async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
    const dispatchSetOwnerID: typeof actions.view.setViewOwnerID = (
        payload,
    ) => dispatch(
        actions.view.setViewOwnerID(payload),
    );
    const dispatchDataAddEntities: typeof actions.data.addEntities = (
        payload,
    ) => dispatch(
        actions.data.addEntities(payload),
    );

    try {
        const query = await client.query({
            query: GET_CURRENT_OWNER,
            fetchPolicy: 'no-cache',
        });

        const response = query.data.getCurrentOwner;

        if (!response.status) {
            return false;
        }

        const {
            id,
            analytics,
            tokens,
            projects,
        } = graphql.deleteTypenames(response.data);

        const {
            entries,
            faults,
            size,
        } = analytics;

        dispatchSetOwnerID(id);

        dispatchDataAddEntities({
            type: 'analytics.entries',
            data: entries,
        });
        dispatchDataAddEntities({
            type: 'analytics.faults',
            data: faults,
        });
        dispatchDataAddEntities({
            type: 'analytics.size',
            data: size,
        });
        dispatchDataAddEntities({
            type: 'tokens',
            data: tokens,
        });
        dispatchDataAddEntities({
            type: 'projects',
            data: projects,
        });

        return true;
    } catch (error) {
        return false;
    }
}


/**
 * Get current owner and return true if set.
 *
 * @param setViewUsageType
 */
const getUsageType = async (
    setViewUsageType: typeof actions.view.setViewUsageType,
) => {
    const query = await client.query({
        query: GET_USAGE_TYPE,
    });

    const response = query.data.getUsageType;

    if (response.status) {
        const usageType = response.data;
        setViewUsageType(usageType);

        switch (usageType) {
            case 'PRIVATE_USAGE':
                return 'private';
            case 'PUBLIC':
                return 'general';
            case 'CUSTOM_LOGIC':
                return 'general';
        }
    }

    return;
}


const getProjects = async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
) => {
    const dispatchDataAddEntities: typeof actions.data.addEntities = (
        payload,
    ) => dispatch(
        actions.data.addEntities(payload),
    );

    try {
        const query = await client.query({
            query: GET_CURRENT_OWNER,
            fetchPolicy: 'no-cache',
        });

        const response = query.data.getCurrentOwner;

        if (!response.status) {
            return false;
        }

        const {
            projects,

        } = graphql.deleteTypenames(response.data);

        dispatchDataAddEntities({
            type: 'projects',
            data: projects,
        });

        return true;
    } catch (error) {
        return false;
    }
}


/**
 * Get analytics last period.
 *
 * @param dispatch
 */
const getAnalyticsLastPeriod = async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    input: any,
) => {
    const dispatchDataAddEntities: typeof actions.data.addEntities = (
        payload,
    ) => dispatch(
        actions.data.addEntities(payload),
    );

    try {
        const {
            project,
            period,
            type,
        } = input;

        const query = await client.query({
            query: GET_ANALYTICS_LAST_PERIOD,
            variables: {
                input,
            },
            fetchPolicy: 'no-cache',
        });

        const response = query.data.getAnalyticsLastPeriod;

        if (!response.status) {
            return false;
        }

        const {
            fatal,
            error,
            warn,
            info,
            debug,
            trace,
        } = graphql.deleteTypenames(response.data);

        switch (type) {
            case 'entries': {
                const entries: AnalyticsRecordsCount = {
                    project,
                    period,
                    data: [
                        { name: 'fatal', value: fatal, },
                        { name: 'error', value: error, },
                        { name: 'warn', value: warn, },
                        { name: 'info', value: info, },
                        { name: 'debug', value: debug, },
                        { name: 'trace', value: trace, },
                    ],
                };

                dispatchDataAddEntities({
                    type: 'analytics.entries',
                    data: entries,
                });

                break;
            }
            case 'faults': {
                const faults: AnalyticsRecordsCount = {
                    project,
                    period,
                    data: [
                        { name: 'fatal', value: fatal, },
                        { name: 'error', value: error, },
                        { name: 'warn', value: warn, },
                    ],
                };

                dispatchDataAddEntities({
                    type: 'analytics.faults',
                    data: faults,
                });
                break;
            }
        }

        return true;
    } catch (error) {
        return false;
    }
}


/**
 * Get analytics size.
 *
 * @param dispatch
 */
const getAnalyticsSize = async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    input: any,
) => {
    const dispatchDataAddEntities: typeof actions.data.addEntities = (
        payload,
    ) => dispatch(
        actions.data.addEntities(payload),
    );

    try {
        const query = await client.query({
            query: GET_ANALYTICS_SIZE,
            variables: {
                input,
            },
            fetchPolicy: 'no-cache',
        });

        const response = query.data.getAnalyticsSize;

        if (!response.status) {
            return false;
        }

        const {
            project,
            value,
        } = graphql.deleteTypenames(response.data);

        dispatchDataAddEntities({
            type: 'analytics.size',
            data: {
                project,
                value,
            },
        });

        return true;
    } catch (error) {
        return false;
    }
}


const getRecords = async (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    pagination?: InputQuery,
) => {
    const dispatchDataAddEntities: typeof actions.data.addEntities = (
        payload,
    ) => dispatch(
        actions.data.addEntities(payload),
    );

    try {
        const input = {
            count: pagination?.count,
            start: pagination?.start,
        };

        const query = await client.query({
            query: GET_RECORDS,
            fetchPolicy: 'no-cache',
            variables: {
                input,
            },
        });

        const response = query.data.getRecords;

        if (!response.status) {
            return false;
        }

        const records = graphql.deleteTypenames(response.data);

        dispatchDataAddEntities({
            type: 'records',
            data: records,
            push: pagination ? 'CONCATENATE' : '',
        });

        return true;
    } catch (error) {
        return false;
    }
}


const verifyUniqueID = async (
    input: any,
) => {
    try {
        const query = await client.query({
            query: VERIFY_UNIQUE_ID,
            variables: {
                input,
            },
            fetchPolicy: 'no-cache',
        });

        const response = query.data.verifyUniqueID;

        if (!response.status) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}
// #endregion module



// #region exports
export {
    getCurrentOwner,
    getUsageType,
    getProjects,
    getRecords,
    getAnalyticsLastPeriod,
    getAnalyticsSize,
    verifyUniqueID,
};
// #endregion exports
