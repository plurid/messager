// #region module
export type MessagerAction =
    | MessagerPublish
    | MessagerSubscribe;

export interface MessagerPublish<D = any> {
    type: 'publish';
    topic: string;
    data: D;
}

export interface MessagerSubscribe {
    type: 'subscribe';
    topic: string;
}

export type MessagerSubscribeAction<D = any> = (
    data: D,
) => void | Promise<void>;



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



export interface MessagerQueuePublish {
    type: 'publish';
    topic: string;
    data: any;
}

export interface MessagerQueueSubscribe {
    type: 'subscribe';
    topic: string;
    action: MessagerSubscribeAction<any>;
}

export type MessagerQueueItem =
    | MessagerQueuePublish
    | MessagerQueueSubscribe;
// #endregion module
