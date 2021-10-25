// #region imports
    // #region external
    import {
        MessagerKinds,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region exports
export const MESSAGER_DEFAULTS = {
    SOCKET_PATH: '/socket',
    EVENT_PATH: '/event',
    NOTIFY_PATH: '/notify',
    SECURE: true,
    SOCKET_SEND_RETRIES: 100,
    SOCKET_SEND_WAIT: 500,
    QUEUE_RETRIES: 100,
    QUEUE_DELAY: 500,
    LOG: false,
};


export const MESSAGER_KIND: MessagerKinds = {
    SOCKET: 'socket',
    EVENT: 'event',
};
// #endregion exports
