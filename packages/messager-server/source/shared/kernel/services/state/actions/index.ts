// #region imports
    // #region external
    import modules from '~kernel-services/state/modules';
    // #endregion external
// #endregion imports



// #region module
const actions = {
    data: modules.data.actions,
    notifications: modules.notifications.actions,
    view: modules.view.actions,
    themes: modules.themes.actions,
};
// #endregion module



// #region exports
export default actions;
// #endregion exports
