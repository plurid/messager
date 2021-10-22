// #region module
export type MessagerKindSocket = 'socket';
export type MessagerKindEvent = 'event';

export type MessagerKind =
    | MessagerKindSocket
    | MessagerKindEvent;

export interface MessagerKinds {
    SOCKET: MessagerKindSocket;
    EVENT: MessagerKindEvent;
}


export interface MessagerOptions {
    /**
     * Path for web sockets.
     *
     * default: `'/socket'`
     */
    socketPath: string;

    /**
     * Path for server sent events.
     *
     * default: `'/event'`
     */
    eventPath: string;

    /**
     * Path for direct notification.
     *
     * default: `'/notify'`
     */
    notifyPath: string;

    /**
     * Use secure protocols.
     *
     * default: `true`
     */
    secure: boolean;

    /**
     * Token-specific messager key.
     */
    key: string | undefined;

    /**
     * Number of retries for the socket to be ready.
     *
     * default: `100`
     */
    socketSendRetries: number;
    /**
     * Time to wait for the socket to be ready (in ms).
     *
     * default: `500`
     */
    socketSendWait: number;
}



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
// #endregion module
