// #region imports
    // #region libraries
    import WebSocket from 'isomorphic-ws';

    import fetch from 'cross-fetch';

    import {
        DeonPure,
        DEON_MEDIA_TYPE,
    } from '@plurid/deon';
    // #endregion libraries


    // #region external
    import {
        MESSAGER_DEFAULTS,
        MESSAGER_KIND,
        NETWORK,
    } from '~data/constants';

    import {
        MessagerOptions,
        MessagerKind,
        MessagerMessage,
        MessagerPublish,
        MessagerSubscribe,
        MessagerSubscribeAction,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
class Messager {
    private deon = new DeonPure();

    private messagerID: undefined | string;
    private connection: undefined | EventSource | WebSocket;
    private endpoint: undefined | string;

    private options: MessagerOptions;
    private host: string;
    private token: string;
    private kind: MessagerKind;

    private subscribers: Record<string, MessagerSubscribeAction[] | undefined> = {};
    private queue: any[] = [];


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
                    const data = event.data.split('\\n').join('\n');

                    const message = this.deon.parseSynchronous(data);

                    this.handleMessage(
                        message,
                    );
                }

                this.connection.onopen = () => {
                    this.resolveQueue();
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
                    const message = this.deon.parseSynchronous(event.data.toString());

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
            this.logError('messager createConnection · something went wrong', error);

            return;
        }
    }

    private handleMessage(
        message: MessagerMessage,
    ) {
        try {
            if (message.type === 'id') {
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
                    // handler error
                    continue;
                }
            }
        } catch (error) {
            this.logError('messager handleMessage · misshaped message data', error);
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

        const headers = this.requestHeaders();

        const response = await fetch(endpoint, {
            method: NETWORK.POST_METHOD,
            body: this.deon.stringify(data),
            headers: {
                ...headers,
                'Content-Type': DEON_MEDIA_TYPE,
            },
        });

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
                await new Promise((resolve) => {
                    setTimeout(
                        () => {
                            resolve(true);
                        },
                        this.options.socketSendWait,
                    );
                });
            }
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
        const headers = {};
        if (this.options.key) {
            headers[NETWORK.MESSAGER_KEY_HEADER] = this.options.key;
        }

        return headers;
    }

    private resolveQueue() {
        if (this.queue.length === 0) {
            return;
        }

        for (const item of this.queue) {
            switch (item.type) {
                case 'subscribe':
                    this.subscribe(item.topic, item.action);
                    break;
                case 'publish':
                    this.publish(item.topic, item.data);
                    break;
            }
        }
    }

    private logError(
        message: string,
        error: any,
    ) {
        if (this.options.logger) {
            this.options.logger(message, error);
        } else {
            console.log(message, error);
        }
    }



    public identity() {
        return this.messagerID;
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
            if (!this.connection) {
                this.queue.push({
                    type: 'publish',
                    topic,
                    data,
                });

                // no connection error
                return;
            }


            const publish: MessagerPublish<D> = {
                type: 'publish',
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
                const message = this.deon.stringify(publish);

                this.socketSend(message);

                return;
            }
        } catch (error) {
            this.logError('messager publish · something went wrong', error);
            return;
        }
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
            if (!this.connection) {
                this.queue.push({
                    type: 'subscribe',
                    topic,
                    action,
                });

                // no connection error
                return;
            }


            if (!this.subscribers[topic]) {
                this.subscribers[topic] = [];
            }

            (this.subscribers[topic] as MessagerSubscribeAction[]).push(action);

            const subscribe: MessagerSubscribe = {
                type: 'subscribe',
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
                const message = this.deon.stringify(subscribe);

                this.socketSend(message);

                return;
            }
        } catch (error) {
            this.logError('messager subscribe · something went wrong', error);
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
            if (!this.connection) {
                // no connection error
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
            this.logError('messager notify · something went wrong', error);

            return false;
        }
    }

    public close() {
        try {
            if (!this.connection) {
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
            this.logError('messager close · connection misconfigured', error);
            return;
        }
    }
}
// #endregion module



// #region exports
export default Messager;
// #endregion exports
