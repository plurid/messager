// #region imports
    // #region libraries
    import {
        notifications,
    } from '@plurid/plurid-ui-state-react';
    // #endregion libraries


    // #region external
    import * as data from '../modules/data';
    import * as themes from '../modules/themes';
    import * as view from '../modules/view';
    // #endregion external
// #endregion imports



// #region module
const actions = {
    data: data.actions,
    themes: themes.actions,
    view: view.actions,
    notifications: notifications.actions,
};
// #endregion module



// #region exports
export default actions;
// #endregion exports
