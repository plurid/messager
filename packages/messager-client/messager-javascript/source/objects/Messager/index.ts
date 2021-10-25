// #region imports
    // #region libraries
    import WebSocket from 'isomorphic-ws';

    import fetch from 'cross-fetch';


    import {
        DeonPure,
        DEON_MEDIA_TYPE,
    } from '@plurid/deon';

    import {
        time,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        MESSAGER_DEFAULTS,
        MESSAGER_KIND,
        NETWORK,
        QUEUE_TYPE,
        MESSAGE_TYPE,
    } from '~data/constants';

    import {
        MessagerOptions,
        MessagerKind,
        MessagerQueueItem,
        MessagerMessage,
        MessagerPublish,
        MessagerSubscribe,
        MessagerSubscribeAction,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
class Messager {
    private messagerID: undefined | string;
    private connection: undefined | EventSource | WebSocket;
    private endpoint: undefined | string;

    private options: MessagerOptions;
    private host: string;
    private token: string;
    private kind: MessagerKind;

    private subscribers: Record<string, MessagerSubscribeAction[] | undefined> = {};
    private queue: MessagerQueueItem[] = [];


    constructor(
        host: string,
        token: string = '',
        kind: MessagerKind = MESSAGER_KIND.EVENT,
        options?: Partial<MessagerOptions>,
    ) {
        this.options = this.resolveOptions(options);

        this.host = host;
        this.token = token;
        this.kind = kind;

        this.createConnection();
    }


    private resolveOptions(
        options?: Partial<MessagerOptions>,
    ) {
        const resolvedOptions: MessagerOptions = {
            socketPath: options?.socketPath || MESSAGER_DEFAULTS.SOCKET_PATH,
            eventPath: options?.eventPath || MESSAGER_DEFAULTS.EVENT_PATH,
            notifyPath: options?.notifyPath || MESSAGER_DEFAULTS.NOTIFY_PATH,
            secure: options?.secure ?? MESSAGER_DEFAULTS.SECURE,
            key: options?.key || undefined,
            socketSendRetries: options?.socketSendRetries || MESSAGER_DEFAULTS.SOCKET_SEND_RETRIES,
            socketSendWait: options?.socketSendWait || MESSAGER_DEFAULTS.SOCKET_SEND_WAIT,
            logger: options?.logger || undefined,
            queueRetries: options?.queueDelay || MESSAGER_DEFAULTS.QUEUE_RETRIES,
            queueDelay: options?.queueDelay || MESSAGER_DEFAULTS.QUEUE_DELAY,
        };

        return resolvedOptions;
    }

    private createConnection() {
        try {
            if (this.connection) {
                return;
            }

            if (this.kind === MESSAGER_KIND.EVENT) {
                if (typeof window === 'undefined') {
                    // not running in browser
                    return;
                }

                const protocol = this.options.secure ? NETWORK.SECURE_HTTP_PROTOCOL : NETWORK.HTTP_PROTOCOL;
                this.endpoint = this.generateEndpoint(protocol, this.options.eventPath);

                this.connection = new EventSource(
                    this.endpoint,
                    {
                        withCredentials: true,
                    },
                );

                this.connection.onmessage = (
                    event,
                ) => {
                    const deon = new DeonPure();
                    const data = event.data.split('\\n').join('\n');

                    const message = deon.parseSynchronous(data);

                    this.handleMessage(
                        message,
                    );
                }

                this.connection.onopen = () => {
                    this.resolveQueue();
                }

                this.connection.onerror = (error) => {
                    this.logError('event connection · something went wrong', error);

                    this.close();
                }

                return;
            }


            if (this.kind === MESSAGER_KIND.SOCKET) {
                const protocol = this.options.secure ? NETWORK.SECURE_SOCKET_PROTOCOL : NETWORK.SOCKET_PROTOCOL;
                this.endpoint = this.generateEndpoint(protocol, this.options.socketPath);

                // const headers = this.requestHeaders();

                this.connection = new WebSocket(
                    this.endpoint,
                    // BUG
                    // {
                    //     headers,
                    // },
                );

                this.connection.addEventListener('message', (event) => {
                    const deon = new DeonPure();
                    const message = deon.parseSynchronous(event.data.toString());

                    this.handleMessage(
                        message,
                    );
                });

                this.connection.onopen = () => {
                    this.resolveQueue();
                }

                return;
            }
        } catch (error) {
            this.logError('createConnection · something went wrong', error);

            return;
        }
    }

    private handleMessage(
        message: MessagerMessage,
    ) {
        try {
            if (message.type === MESSAGE_TYPE.ID) {
                if (typeof message.data !== 'string') {
                    this.logError('handleMessage · misshaped id data');
                    return;
                }

                this.messagerID = message.data;
                return;
            }


            const {
                topic,
                data,
            } = message;
            if (!topic) {
                return;
            }

            const handlers = this.subscribers[topic];
            if (!handlers) {
                return;
            }

            for (const handler of handlers) {
                try {
                    handler(data);
                } catch(error) {
                    this.logError('handleMessage · handler error', error);
                    continue;
                }
            }
        } catch (error) {
            this.logError('handleMessage · misshaped message data', error);
            return;
        }
    }

    private async eventSend(
        data: Record<string, any>,
        endpoint = this.endpoint,
    ) {
        if (
            !endpoint
            || !this.messagerID
        ) {
            return;
        }

        const deon = new DeonPure();

        const headers = this.requestHeaders();
        const fetchHeaders: Record<string, string> = {
            ...headers,
        };
        fetchHeaders[NETWORK.CONTENT_TYPE_HEADER] = DEON_MEDIA_TYPE;

        const response = await fetch(endpoint, {
            method: NETWORK.POST_METHOD,
            body: deon.stringify(data),
            headers: {
                ...fetchHeaders,
            },
        });

        if (response.status !== NETWORK.SUCCESS) {
            this.logError('eventSend · could not send');
        }

        return response;
    }

    private async socketSend(
        message: string,
    ) {
        let retries = 0;
        let sent = false;

        while (
            !sent
            && retries < this.options.socketSendRetries
        ) {
            retries += 1;

            if ((this.connection as WebSocket).readyState === NETWORK.SOCKET_READY) {
                (this.connection as WebSocket).send(message);
                sent = true;
                break;
            } else {
                await time.delay(this.options.socketSendWait);
            }
        }

        if (!sent) {
            this.logError('socketSend · could not send');
        }
    }

    private generateEndpoint(
        protocol: string,
        path: string,
    ) {
        const endpoint = protocol + this.host + path + `?token=${this.token || ''}`;

        return endpoint;
    }

    private requestHeaders() {
        const headers: Record<string, string> = {};
        if (this.options.key) {
            headers[NETWORK.MESSAGER_KEY_HEADER] = this.options.key;
        }

        return headers;
    }

    private async resolveQueue() {
        if (this.queue.length === 0) {
            return;
        }

        let queueRetries = 0;

        while (!this.connectionResolved()) {
            await time.delay(this.options.queueDelay);
            queueRetries += 1;

            if (queueRetries > this.options.queueRetries) {
                break;
            }
        }

        if (!this.connectionResolved()) {
            this.logError('queue · could not handle queue');

            return;
        }

        for (const item of this.queue) {
            switch (item.type) {
                case QUEUE_TYPE.SUBSCRIBE:
                    this.subscribe(item.topic, item.action);
                    break;
                case QUEUE_TYPE.PUBLISH:
                    this.publish(item.topic, item.data);
                    break;
                case QUEUE_TYPE.NOTIFY:
                    this.notify(item.target, item.data);
                    break;
            }

            await time.delay(this.options.queueDelay);
        }

        this.queue = [];
    }

    private connectionResolved() {
        try {
            if (!this.connection) {
                return false;
            }

            if (!this.messagerID) {
                return false;
            }

            if (this.kind === MESSAGER_KIND.EVENT) {
                return (this.connection as EventSource).readyState === NETWORK.EVENT_READY;
            }

            if (this.kind === MESSAGER_KIND.SOCKET) {
                return (this.connection as WebSocket).readyState === NETWORK.SOCKET_READY;
            }

            return true;
        } catch (error) {
            this.logError('connectionResolved · connection misconfigured', error);

            return false;
        }
    }

    private logError<E = any>(
        message: string,
        error?: E,
    ) {
        const messageText = 'messager > ' + message;

        if (this.options.logger) {
            this.options.logger(messageText, error);
        } else {
            console.log(messageText, error);
        }
    }


    public identity() {
        return this.messagerID;
    }

    /**
     * Subscribe to a certain `topic`, and run the `action`
     * when the topic is updated.
     *
     * @param topic
     * @param action
     * @returns
     */
    public async subscribe<D = any>(
        topic: string,
        action: MessagerSubscribeAction<D>,
    ) {
        try {
            if (!this.connectionResolved()) {
                this.queue.push({
                    type: QUEUE_TYPE.SUBSCRIBE,
                    topic,
                    action,
                });

                return;
            }


            if (!this.subscribers[topic]) {
                this.subscribers[topic] = [];
            }

            (this.subscribers[topic] as MessagerSubscribeAction[]).push(action);

            const subscribe: MessagerSubscribe = {
                type: MESSAGE_TYPE.SUBSCRIBE,
                topic,
            };


            if (this.kind === MESSAGER_KIND.EVENT) {
                this.eventSend({
                    messagerID: this.messagerID,
                    ...subscribe,
                });

                return;
            }


            if (this.kind === MESSAGER_KIND.SOCKET) {
                const deon = new DeonPure();
                const message = deon.stringify(subscribe);

                this.socketSend(message);

                return;
            }
        } catch (error) {
            this.logError('subscribe · something went wrong', error);
            return;
        }
    }

    /**
     * Publish the `data` under a certain `topic`.
     *
     * @param topic
     * @param data
     * @returns
     */
    public async publish<D = any>(
        topic: string,
        data: D,
    ) {
        try {
            if (!this.connectionResolved()) {
                this.queue.push({
                    type: QUEUE_TYPE.PUBLISH,
                    topic,
                    data,
                });

                return;
            }


            const publish: MessagerPublish<D> = {
                type: MESSAGE_TYPE.PUBLISH,
                topic,
                data,
            };


            if (this.kind === MESSAGER_KIND.EVENT) {
                this.eventSend({
                    messagerID: this.messagerID,
                    ...publish,
                });

                return;
            }


            if (this.kind === MESSAGER_KIND.SOCKET) {
                const deon = new DeonPure();
                const message = deon.stringify(publish);

                this.socketSend(message);

                return;
            }
        } catch (error) {
            this.logError('publish · something went wrong', error);
            return;
        }
    }

    /**
     * Send a `data` notification to a certain `target`.
     *
     * @param target
     * @param data
     * @returns
     */
    public async notify<D = any>(
        target: string,
        data: D,
    ) {
        try {
            if (!this.connectionResolved()) {
                this.queue.push({
                    type: QUEUE_TYPE.NOTIFY,
                    target,
                    data,
                });

                return false;
            }


            const protocol = this.options.secure ? NETWORK.SECURE_HTTP_PROTOCOL : NETWORK.HTTP_PROTOCOL;
            const endpoint = this.generateEndpoint(protocol, this.options.notifyPath);

            const response = await this.eventSend(
                {
                    from: this.messagerID,
                    target,
                    data,
                },
                endpoint,
            );
            if (!response) {
                return false;
            }

            return response.status === NETWORK.SUCCESS;
        } catch (error) {
            this.logError('notify · something went wrong', error);

            return false;
        }
    }

    public close() {
        try {
            if (!this.connectionResolved()) {
                return;
            }

            if (this.kind === MESSAGER_KIND.EVENT) {
                (this.connection as EventSource).close();
                return;
            }

            if (this.kind === MESSAGER_KIND.SOCKET) {
                (this.connection as WebSocket).close();
                return;
            }
        } catch (error) {
            this.logError('close · connection misconfigured', error);

            return;
        }
    }
}
// #endregion module



// #region exports
export default Messager;
// #endregion exports
