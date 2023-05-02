// #region imports
    // #region libraries
    import {
        notifications,
    } from '@plurid/plurid-ui-state-react';
    // #endregion libraries
// #endregion imports



// #region module
const slice = notifications.factory();

const {
    actions,
    reducer,
} = slice;

const {
    selectors,
} = notifications;
// #endregion module



// #region exports
export {
    actions,
    reducer,
    selectors,
};
// #endregion exports
