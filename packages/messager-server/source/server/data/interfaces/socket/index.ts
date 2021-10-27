// #region imports
    // #region libraries
    import {
        MessagerSubscribe,
        MessagerUnsubscribe,
        MessagerPublish,
    } from '@plurid/messager/distribution/data/interfaces/internal';
    // #endregion libraries
// #endregion imports



// #region module
export interface SocketSubscribe {
    socketID: string;
    message: MessagerSubscribe;
}

export interface SocketUnsubscribe {
    socketID: string;
    message: MessagerUnsubscribe;
}

export interface SocketPublish {
    socketID: string;
    message: MessagerPublish;
}
// #endregion module
