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


export type MessagerLogger<E = any> = (
    message: string,
    error?: E,
) => void;


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
     *
     * Used by `socket` connections.
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

    /**
     * Logger for errors.
     */
    logger: MessagerLogger | undefined;

    /**
     * Number of attempts to resolve the queue before the connection is resolved.
     *
     * Default: `10`
     */
    queueRetries: number;
    /**
     * Number of milliseconds to wait in between queue resolution.
     *
     * Default: `500`
     */
    queueDelay: number;
}
// #endregion module
