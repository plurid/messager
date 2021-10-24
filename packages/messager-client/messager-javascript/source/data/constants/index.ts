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
};


export const MESSAGER_KIND: MessagerKinds = {
    SOCKET: 'socket',
    EVENT: 'event',
};


export const NETWORK = {
    HTTP_PROTOCOL: 'http://',
    SECURE_HTTP_PROTOCOL: 'https://',

    SOCKET_PROTOCOL: 'ws://',
    SECURE_SOCKET_PROTOCOL: 'wss://',

    EVENT_READY: 1,
    SOCKET_READY: 1,

    SUCCESS: 200,

    MESSAGER_KEY_HEADER: 'Messager-Key',

    POST_METHOD: 'POST',
};
// #endregion exports
