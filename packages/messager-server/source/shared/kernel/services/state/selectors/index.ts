// #region imports
    // #region libraries
    import {
        notifications,
        themes,
    } from '@plurid/plurid-ui-state-react';
    // #endregion libraries


    // #region external
    import modules from '../modules';
    // #endregion external
// #endregion imports



// #region module
const selectors = {
    data: modules.data.selectors,
    themes: modules.themes.selectors,
    view: modules.view.selectors,
    notifications: modules.notifications.selectors,
};
// #endregion module



// #region exports
export default selectors;
// #endregion exports
