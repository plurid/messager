// #region imports
    // #region external
    import {
        MessagerSubscribeAction,
    } from '../external';
    // #endregion external
// #endregion imports



// #region module
export type MessagerAction =
    | MessagerPublish
    | MessagerSubscribe;

export interface MessagerSubscribe {
    type: 'subscribe';
    topic: string;
}

export interface MessagerPublish<D = any> {
    type: 'publish';
    topic: string;
    data: D;
}



export interface MessagerMessageTypes {
    ID: 'id';
    SUBSCRIBE: 'subscribe';
    PUBLISH: 'publish';
    NOTIFY: 'notify';
}

export type MessagerMessageType =
    | 'id'
    | 'subscribe'
    | 'publish'
    | 'notify';

export interface MessagerMessage<D = any> {
    type: MessagerMessageType;
    topic?: string;
    data: D;
}



export interface MessagerQueueTypes {
    SUBSCRIBE: 'subscribe';
    PUBLISH: 'publish';
    NOTIFY: 'notify';
}

export interface MessagerQueueSubscribe {
    type: 'subscribe';
    topic: string;
    action: MessagerSubscribeAction<any>;
}

export interface MessagerQueuePublish {
    type: 'publish';
    topic: string;
    data: any;
}

export interface MessagerQueueNotify {
    type: 'notify';
    target: string;
    data: any;
}

export type MessagerQueueItem =
    | MessagerQueueSubscribe
    | MessagerQueuePublish
    | MessagerQueueNotify;
// #endregion module
