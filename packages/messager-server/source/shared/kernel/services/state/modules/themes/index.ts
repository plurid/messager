// #region imports
    // #region libraries
    import {
        themes,
    } from '@plurid/plurid-ui-state-react';
    // #endregion libraries
// #endregion imports



// #region module
const slice = themes.factory();

const {
    actions,
    reducer,
} = slice;

const {
    selectors,
} = themes;
// #endregion module



// #region exports
export {
    actions,
    reducer,
    selectors,
};
// #endregion exports
