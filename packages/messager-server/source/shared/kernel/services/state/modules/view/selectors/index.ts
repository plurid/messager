// #region imports
    // #region external
    import {
        AppState,
    } from '../../../store';
    // #endregion external
// #endregion imports



// #region module
const getLoading = (state: AppState) => state.view.loading;
const getIndexView = (state: AppState) => state.view.indexView;
const getIndexGeneralView = (state: AppState) => state.view.indexGeneralView;
const getIndexGeneralSelector = (state: AppState) => state.view.indexGeneralSelector;
const getIndexEditTokenID = (state: AppState) => state.view.indexEditTokenID;
const getViewCompactSelectors = (state: AppState) => state.view.compactSelectors;
const getViewOwnerID = (state: AppState) => state.view.ownerID;
const getViewUsageType = (state: AppState) => state.view.usageType;



const selectors = {
    getLoading,
    getIndexView,
    getIndexGeneralView,
    getIndexGeneralSelector,
    getViewCompactSelectors,
    getIndexEditTokenID,
    getViewOwnerID,
    getViewUsageType,
};
// #endregion module



// #region exports
export default selectors;
// #endregion exports
