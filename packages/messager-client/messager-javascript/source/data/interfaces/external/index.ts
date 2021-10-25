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
     * Default: `'/socket'`
     */
    socketPath: string;

    /**
     * Path for server sent events.
     *
     * Default: `'/event'`
     */
    eventPath: string;

    /**
     * Path for direct notification.
     *
     * Default: `'/notify'`
     */
    notifyPath: string;

    /**
     * Use secure protocols.
     *
     * Default: `true`
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
     * Default: `100`
     */
    socketSendRetries: number;
    /**
     * Time to wait for the socket to be ready (in ms).
     *
     * Default: `500`
     */
    socketSendWait: number;

    /**
     * Number of attempts to resolve the queue before the connection is resolved.
     *
     * Default: `100`
     */
    queueRetries: number;
    /**
     * Number of milliseconds to wait in between queue resolution.
     *
     * Default: `500`
     */
    queueDelay: number;

    /**
     * Log internal state messages errors.
     *
     * If a `logger` options function is passed, it is considered `true`.
     *
     * Default: `false`
     */
    log: boolean;
    /**
     * Logger for internal state messages and errors.
     *
     * For the default to run, the `log` option must be `true`.
     *
     * Default: `console.log`
     */
    logger: MessagerLogger | undefined;
}


export type MessagerSubscribeAction<D = any> = (
    data: D,
) => void | Promise<void>;
// #endregion module
