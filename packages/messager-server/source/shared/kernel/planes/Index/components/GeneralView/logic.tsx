// #region imports
    // #region libraries
    import React from 'react';

    import { AnyAction } from 'redux';
    import { ThunkDispatch } from 'redux-thunk';

    import {
        PluridIconStatistics,
        PluridIconLocked,
        PluridIconApps,
        PluridIconFrame,
        PluridIconInfo,
        PluridIconArrowRight,
        PluridIconDocuments,
        PluridIconExternalLink,
        PluridIconExit,
    } from '@plurid/plurid-icons-react';
    // #endregion libraries


    // #region external
    import messagerLogo from '../../assets/messager-logo.png';

    import Token from '~kernel-components/Token';
    import Project from '~kernel-components/Project';
    import Space from '~kernel-components/Space';

    import { AppState } from '~kernel-services/state/store';
    import selectors from '~kernel-services/state/selectors';
    import actions from '~kernel-services/state/actions';
    // #endregion external


    // #region internal
    import AnalyticsView from './components/AnalyticsView';
    import TokensView from './components/TokensView';
    import ProjectsView from './components/ProjectsView';
    import SpacesView from './components/SpacesView';
    import RecordsView from './components/RecordsView';

    import {
        StyledGeneralView,
        StyledGeneralSelectors,
        StyledGeneralSelectorItem,
        StyledGeneralMessager,
        StyledGeneralHelp,
        StyledGeneralHelpItem,
        StyledGeneralSelected,
    } from './styled';
    // #endregion internal
// #endregion imports



// #region module
export const generalSelectors = [
    // 'analytics',
    'tokens',
    // 'projects',
    // 'spaces',
    'records',
];

export const generalSelectorsIcons = {
    // analytics: PluridIconStatistics,
    tokens: PluridIconLocked,
    // projects: PluridIconApps,
    // spaces: PluridIconFrame,
    records: PluridIconInfo,
};


export const renderSelectedView = (
    stateIndexGeneralSelector: any,
    setGeneralView: any,
) => {
    switch (stateIndexGeneralSelector) {
        case 'analytics':
            return (
                <AnalyticsView />
            );
        case 'tokens':
            return (
                <TokensView
                    setGeneralView={setGeneralView}
                />
            );
        case 'projects':
            return (
                <ProjectsView
                    setGeneralView={setGeneralView}
                />
            );
        case 'spaces':
            return (
                <SpacesView
                    setGeneralView={setGeneralView}
                />
            );
        case 'records':
            return (
                <RecordsView
                    setGeneralView={setGeneralView}
                />
            );
        default:
            return (<></>);
    }
}


export const renderGeneralView = (
    state: AppState,
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    openManual: any,
    logout: any,
    findEntityByID: any,
    mouseOverSelectors: any,
    setMouseOverSelectors: any,
    setCompactSelectors: any,
    selectedView: any,
    setSelectedView: any,
    setGeneralView: any,
) => {
    const stateGeneralTheme = selectors.themes.getGeneralTheme(state);
    const stateInteractionTheme = selectors.themes.getInteractionTheme(state);
    const stateIndexGeneralSelector = selectors.view.getIndexGeneralSelector(state);
    const stateIndexGeneralView = selectors.view.getIndexGeneralView(state);
    const stateViewCompactSelectors = selectors.view.getViewCompactSelectors(state);
    const stateViewOwnerID = selectors.view.getViewOwnerID(state);
    const stateViewUsageType = selectors.view.getViewUsageType(state);

    const dispatchAddEntity = (
        payload: any,
    ) => dispatch(
        actions.data.addEntity(payload),
    );
    // const dispatchViewSetEditID = (
    //     payload: any,
    // ) => dispatch (
    //     actions.view.setEditID(payload),
    // );


    switch (stateIndexGeneralView) {
        case 'general':
            return (
                <StyledGeneralView
                    compactSelectors={stateViewCompactSelectors}
                >
                    <StyledGeneralSelectors
                        onMouseEnter={() => setMouseOverSelectors(true)}
                        onMouseLeave={() => setMouseOverSelectors(false)}
                        theme={stateGeneralTheme}
                        compactSelectors={stateViewCompactSelectors}
                        viewUsageType={stateViewUsageType}
                    >
                        <StyledGeneralMessager
                            compactSelectors={stateViewCompactSelectors}
                        >
                            {!stateViewCompactSelectors && (
                                <>
                                    <div>
                                        <img
                                            src={messagerLogo}
                                            alt="messager"
                                            height={30}
                                            onClick={() => setCompactSelectors(true)}
                                        />
                                    </div>

                                    <div>
                                        messager
                                    </div>
                                </>
                            )}

                            {stateViewCompactSelectors
                            && mouseOverSelectors
                            && (
                                <PluridIconArrowRight
                                    atClick={() => setCompactSelectors(false)}
                                />
                            )}
                        </StyledGeneralMessager>

                        <ul>
                            {generalSelectors.map(selector => {
                                const Icon = generalSelectorsIcons[selector];

                                return (
                                    <StyledGeneralSelectorItem
                                        key={selector}
                                        onClick={() => setSelectedView(selector)}
                                        theme={stateGeneralTheme}
                                        selected={selector === stateIndexGeneralSelector}
                                        compactSelectors={stateViewCompactSelectors}
                                    >
                                        <Icon />

                                        {!stateViewCompactSelectors && (
                                            <div>
                                                {selector}
                                            </div>
                                        )}
                                    </StyledGeneralSelectorItem>
                                );
                            })}
                        </ul>

                        <StyledGeneralHelp>
                            {mouseOverSelectors && (
                                <ul>
                                    <StyledGeneralHelpItem
                                        onClick={() => openManual()}
                                        compactSelectors={stateViewCompactSelectors}
                                    >
                                        <PluridIconDocuments />

                                        {!stateViewCompactSelectors && (
                                            <>
                                                <div>
                                                    manual
                                                </div>

                                                <PluridIconExternalLink />
                                            </>
                                        )}
                                    </StyledGeneralHelpItem>

                                    {stateViewUsageType === 'PRIVATE_USAGE' && (
                                        <StyledGeneralHelpItem
                                            onClick={() => logout()}
                                            compactSelectors={stateViewCompactSelectors}
                                        >
                                            <PluridIconExit />

                                            {!stateViewCompactSelectors && (
                                                <>
                                                    <div>
                                                        logout ({stateViewOwnerID})
                                                    </div>

                                                    <div />
                                                </>
                                            )}
                                        </StyledGeneralHelpItem>
                                    )}
                                </ul>
                            )}
                        </StyledGeneralHelp>
                    </StyledGeneralSelectors>

                    <StyledGeneralSelected>
                        {selectedView}
                    </StyledGeneralSelected>
                </StyledGeneralView>
            );
        case 'generate-token':
            return (
                <Token
                    theme={stateInteractionTheme}
                    action={(token) => {
                        dispatchAddEntity({
                            type: 'token',
                            data: token,
                        });

                        setGeneralView('general');
                    }}
                    cancel={() => setGeneralView('general')}
                />
            );
        case 'generate-project':
            return (
                <Project
                    theme={stateInteractionTheme}
                    action={(project) => {
                        dispatchAddEntity({
                            type: 'project',
                            data: project,
                        });

                        setGeneralView('general');
                    }}
                    cancel={() => setGeneralView('general')}
                />
            );
        case 'generate-space':
            return (
                <Space
                    theme={stateInteractionTheme}
                    action={(space) => {
                        dispatchAddEntity({
                            type: 'space',
                            data: space,
                        });

                        setGeneralView('general');
                    }}
                    cancel={() => setGeneralView('general')}
                />
            );
        default:
            return (
                <></>
            );
    }
}
// #endregion module
