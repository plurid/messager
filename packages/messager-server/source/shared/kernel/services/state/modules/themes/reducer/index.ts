// #region imports
    // #region libraries
    import {
        themes,
    } from '@plurid/plurid-ui-state-react';
    // #endregion libraries


    // #region external
    import initialState from '../initial';
    // #endregion external
// #endregion imports



// #region module
const reducer = themes.metareducer(initialState);
// #endregion module



// #region exports
export default reducer;
// #endregion exports
