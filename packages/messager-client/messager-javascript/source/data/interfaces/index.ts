// #region module
export type MessagerType =
    | 'socket'
    | 'event';

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
     * default: `'/notification'`
     */
    notifyPath: string;

    /**
     * Use secure protocols.
     *
     * default: `true`
     */
    secure: boolean;
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



export interface MessagerMessage<D = any> {
    type: string;
    topic?: string;
    data: D;
}
// #endregion module
