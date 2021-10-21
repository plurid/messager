// #region imports
    // #region external
    import {
        AppState,
    } from '../../../store';
    // #endregion external
// #endregion imports



// #region module
const getAnalyticsEntries = (state: AppState) => state.data.analytics.entries;
const getAnalyticsFaults = (state: AppState) => state.data.analytics.faults;
const getAnalyticsSize = (state: AppState) => state.data.analytics.size;

const getTokens = (state: AppState) => state.data.tokens;
const getProjects = (state: AppState) => state.data.projects;
const getSpaces = (state: AppState) => state.data.spaces;
const getRecords = (state: AppState) => state.data.records;


const selectors = {
    getAnalyticsEntries,
    getAnalyticsFaults,
    getAnalyticsSize,

    getTokens,
    getProjects,
    getSpaces,
    getRecords,
};
// #endregion module



// #region exports
export default selectors;
// #endregion exports
