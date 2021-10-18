// #region imports
    // #region libraries
    import {
        WebSocket,
    } from 'ws';

    import fetch from 'cross-fetch';

    import {
        data,
    } from '@plurid/plurid-functions';

    // import Deon from '@plurid/deon';
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
    // private deon = new Deon();

    private messagerID: undefined | string;
    private connection: undefined | EventSource | WebSocket;
    private endpoint: undefined | string;

    private options: MessagerOptions;
    private host: string;
    private token: string;
    private kind: MessagerKind;

    private subscribers: Record<string, MessagerSubscribeAction[]> = {};


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
        };

        return resolvedOptions;
    }

    private createConnection() {
        if (this.connection) {
            return;
        }

        if (
            typeof window !== 'undefined'
            && this.kind === MESSAGER_KIND.EVENT
        ) {
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
                const message = data.parse(event.data);

                this.handleMessage(
                    message,
                );
            }

            return;
        }


        if (this.kind === MESSAGER_KIND.SOCKET) {
            const protocol = this.options.secure ? NETWORK.SECURE_SOCKET_PROTOCOL : NETWORK.SOCKET_PROTOCOL;
            this.endpoint = this.generateEndpoint(protocol, this.options.socketPath);

            this.connection = new WebSocket(this.endpoint);

            this.connection.addEventListener('message', (event) => {
                const message = data.parse(event.data.toString());

                this.handleMessage(
                    message,
                );
            });

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
            // misshaped message data
            return;
        }
    }

    private async eventSend(
        data: any,
        endpoint = this.endpoint,
    ) {
        if (
            !endpoint
            || !this.messagerID
        ) {
            return;
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                ...data,
            }),
        });

        return response;
    }

    private async socketSend(
        message: string,
    ) {
        let retries = 0;
        let trySend = true;

        while (trySend) {
            if ((this.connection as WebSocket).readyState === 1) {
                (this.connection as WebSocket).send(message);
                trySend = false;
                retries += 1;
            } else {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 500);
                });
            }

            if (retries > 100) {
                break;
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
                // const message = this.deon.stringify(publish);
                const message = JSON.stringify(publish);

                this.socketSend(message);

                return;
            }
        } catch (error) {
            // something went wrong
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
                // no connection error
                return;
            }

            if (!this.subscribers[topic]) {
                this.subscribers[topic] = [];
            }


            this.subscribers[topic].push(action);

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
                // const message = this.deon.stringify(subscribe);
                const message = JSON.stringify(subscribe);

                this.socketSend(message);

                return;
            }
        } catch (error) {
            // something went wrong
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
            // connection misconfigured
            return;
        }
    }
}
// #endregion module



// #region exports
export default Messager;
// #endregion exports
