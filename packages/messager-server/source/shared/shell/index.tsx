// #region imports
    // #region libraries
    import React from 'react';

    import {
        PluridComponent,
    } from '@plurid/plurid-react';
    // #endregion libraries


    // #region internal
    import {
        GlobalStyle,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface ShellProperties {
}

const Shell: React.FC<ShellProperties> = (
    properties,
) => {
    // #region properties
    const {
        children,
    } = properties;
    // #endregion properties


    // #region render
    return (
        <>
            <GlobalStyle />

            {children}
        </>
    );
    // #endregion render
}


const shell: PluridComponent = {
    kind: 'react',
    element: Shell,
};
// #endregion module



// #region exports
export default shell;
// #endregion exports
