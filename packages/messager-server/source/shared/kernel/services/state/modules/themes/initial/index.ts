// #region imports
    // #region libraries
    import {
        plurid,
    } from '@plurid/plurid-themes';

    import {
        themes,
    } from '@plurid/plurid-ui-state-react';
    // #endregion libraries
// #endregion imports



// #region module
const initialState: themes.Types.State = {
    general: plurid,
    interaction: plurid,
};
// #endregion module



// #region exports
export default initialState;
// #endregion exports
