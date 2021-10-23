// #region imports
    // #region libraries
    import React, {
        useRef,
    } from 'react'

    import { AnyAction } from 'redux';
    import { connect } from 'react-redux';
    import { ThunkDispatch } from 'redux-thunk';


    import {
        Theme,
    } from '@plurid/plurid-themes';

    import {
        PluridReactComponent,
    } from '@plurid/plurid-react';

    import {
        notifications,
    } from '@plurid/plurid-ui-state-react';
    // #endregion libraries


    // #region external
    import Head from '~kernel-components/Head';

    import {
        Notifications,
    } from '~kernel-services/styled';

    import { AppState } from '~kernel-services/state/store';
    import StateContext from '~kernel-services/state/context';
    import selectors from '~kernel-services/state/selectors';
    import actions from '~kernel-services/state/actions';
    // #endregion external


    // #region internal
    import {
        GlobalStyle,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export interface ShellOwnProperties {
}

export interface ShellStateProperties {
    stateNotifications: notifications.Types.Notification[];
    stateGeneralTheme: Theme;
}

export interface ShellDispatchProperties {
}

export type ShellProperties =
    & ShellOwnProperties
    & ShellStateProperties
    & ShellDispatchProperties;


const Shell: React.FC<ShellProperties> = (
    properties,
) => {
    // #region properties
    const {
        // #region required
            // #region values
            children,
            // #endregion values

            // #region methods
            // #endregion methods
        // #endregion required

        // #region state
        stateNotifications,
        stateGeneralTheme,
        // stateOwnerIdentonym,
        // #endregion state
    } = properties;
    // #endregion properties


    // #region references
    const topContainer = useRef<HTMLDivElement>(null);
    // #endregion references


    // #region render
    const Common = (
        <>
            <GlobalStyle
                theme={stateGeneralTheme}
            />

            <Head />

            <div
                ref={topContainer}
            />

            {stateNotifications.length > 0 && (
                <Notifications
                    selectors={selectors}
                    context={StateContext}
                />
            )}
        </>
    );

    return (
        <>
            {Common}

            {children}
        </>
    );
    // #endregion render
}


const mapStateToProperties = (
    state: AppState,
): ShellStateProperties => ({
    stateNotifications: selectors.notifications.getAll(state),
    stateGeneralTheme: selectors.themes.getGeneralTheme(state),
});


const mapDispatchToProperties = (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
): ShellDispatchProperties => ({
});


const ConnectedShell = connect(
    mapStateToProperties,
    mapDispatchToProperties,
    null,
    {
        context: StateContext,
    },
)(Shell);


const shell: PluridReactComponent = ConnectedShell;
// #endregion module



// #region exports
export default shell;
// #endregion exports
