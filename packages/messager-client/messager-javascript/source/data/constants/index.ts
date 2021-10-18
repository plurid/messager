// #region imports
    // #region external
    import {
        MessagerKinds,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region exports
export const messagerKind: MessagerKinds = {
    socket: 'socket',
    event: 'event',
};


export const NETWORK = {
    HTTP_PROTOCOL: 'http://',
    SECURE_HTTP_PROTOCOL: 'https://',

    SOCKET_PROTOCOL: 'ws://',
    SECURE_SOCKET_PROTOCOL: 'wss://',

    SUCCESS: 200,
};
// #endregion exports
