// #region imports
    // #region external
    import {
        MessagerMessageTypes,
        MessagerQueueTypes,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region exports
export const NETWORK = {
    HTTP_PROTOCOL: 'http://',
    SECURE_HTTP_PROTOCOL: 'https://',

    SOCKET_PROTOCOL: 'ws://',
    SECURE_SOCKET_PROTOCOL: 'wss://',

    EVENT_READY: 1,
    SOCKET_READY: 1,

    HTTP_SUCCESS: 200,

    MESSAGER_KEY_HEADER: 'Messager-Key',
    CONTENT_TYPE_HEADER: 'Content-Type',

    POST_METHOD: 'POST',
};


const baseMessagerTypes: {
    NOTIFY: 'notify';
    PUBLISH: 'publish';
    SUBSCRIBE: 'subscribe';
    UNSUBSCRIBE: 'unsubscribe';
} = {
    NOTIFY: 'notify',
    PUBLISH: 'publish',
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe',
};


export const MESSAGE_TYPE: MessagerMessageTypes = {
    ID: 'id',
    ...baseMessagerTypes,
};

export const QUEUE_TYPE: MessagerQueueTypes = {
    ...baseMessagerTypes,
};


export const ERROR_MESSAGE = {
    WRONG: 'something went wrong',
};
// #endregion exports
