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

export type MessagerSubscribeAction<D = any> = (
    data: D,
) => void;



export type MessagerSocketAction =
    | MessagerSocketPublish
    | MessagerSocketSubscribe;

export interface MessagerSocketPublish<D = any> {
    type: 'publish';
    topic: string;
    data: D;
}

export interface MessagerSocketSubscribe {
    type: 'subscribe';
    topic: string;
}


export interface MessagerMessageData<D = any> {
    type: string;
    topic: string;
    data: D;
}
// #endregion module
