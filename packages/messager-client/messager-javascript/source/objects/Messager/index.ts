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
        MessagerOptions,
        MessagerType,
        MessagerSubscribeAction,
        MessagerSocketSubscribe,
        MessagerSocketPublish,
        MessagerMessageData,
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
    private kind: MessagerType;

    private subscribers: Record<string, MessagerSubscribeAction[]> = {};


    constructor(
        host: string,
        token: string = '',
        kind: MessagerType = 'event',
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
            socketPath: options?.socketPath || '/socket',
            eventPath: options?.eventPath || '/event',
            secure: options?.secure ?? true,
        };

        return resolvedOptions;
    }

    private createConnection() {
        if (
            typeof window !== 'undefined'
            && this.kind === 'event'
        ) {
            const protocol = this.options.secure ? 'https://' : 'http://';

            this.endpoint = protocol + this.host + this.options.eventPath + `?token=${this.token || ''}`;

            this.connection = new EventSource(
                this.endpoint,
                {
                    withCredentials: true,
                },
            );

            this.connection.onerror = () => {

            }

            this.connection.onopen = () => {

            }

            this.connection.onmessage = (
                event,
            ) => {
                const message = data.parse(event.data);

                if (message?.type === 'id') {
                    this.messagerID = message.data;
                    return;
                }

                this.handleMessageData(
                    message,
                );
            }

            return;
        }


        if (this.kind === 'socket') {
            const protocol = this.options.secure ? 'wss://' : 'ws://';

            this.endpoint = protocol + this.host + this.options.socketPath + `?token=${this.token || ''}`;

            this.connection = new WebSocket(this.endpoint);

            this.connection.addEventListener('message', (event) => {
                const message = data.parse(event.data.toString());

                this.handleMessageData(
                    message,
                );
            });

            return;
        }
    }

    private handleMessageData(
        messageData: MessagerMessageData,
    ) {
        try {
            const {
                topic,
                data,
            } = messageData;

            const handlers = this.subscribers[topic];

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


    public async publish<D = any>(
        topic: string,
        data: D,
    ) {
        try {
            if (!this.connection) {
                // no connection error
                return;
            }

            const publish: MessagerSocketPublish<D> = {
                type: 'publish',
                topic,
                data,
            };


            if (this.kind === 'event') {
                if (
                    !this.endpoint
                    || !this.messagerID
                ) {
                    return;
                }

                fetch(this.endpoint, {
                    method: 'POST',
                    body: JSON.stringify({
                        messagerID: this.messagerID,
                        ...publish,
                    }),
                });

                return;
            }


            if (this.kind === 'socket') {
                // const message = this.deon.stringify(publish);
                const message = JSON.stringify(publish);

                let trySend = true;

                while (trySend) {
                    if ((this.connection as WebSocket).readyState === 1) {
                        (this.connection as WebSocket).send(message);
                        trySend = false;
                    } else {
                        await new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(true);
                            }, 1000);
                        });
                    }
                }

                return;
            }
        } catch (error) {
            return;
        }
    }

    public async subscribe<D = any>(
        topic: string,
        action: MessagerSubscribeAction<D>,
    ) {
        if (!this.connection) {
            // no connection error
            return;
        }

        if (!this.subscribers[topic]) {
            this.subscribers[topic] = [];
        }

        this.subscribers[topic].push(action);

        const subscribe: MessagerSocketSubscribe = {
            type: 'subscribe',
            topic,
        };


        if (this.kind === 'event') {
            if (
                !this.endpoint
                || !this.messagerID
            ) {
                return;
            }

            fetch(this.endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    messagerID: this.messagerID,
                    ...subscribe,
                }),
            });

            return;
        }


        if (this.kind === 'socket') {
            // const message = this.deon.stringify(subscribe);
            const message = JSON.stringify(subscribe);

            let trySend = true;

            while (trySend) {
                if ((this.connection as WebSocket).readyState === 1) {
                    (this.connection as WebSocket).send(message);
                    trySend = false;
                } else {
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(true);
                        }, 1000);
                    });
                }
            }

            return;
        }
    }

    public close() {
        if (!this.connection) {
            return;
        }

        if (this.kind === 'event') {
            (this.connection as EventSource).close();
            return;
        }

        if (this.kind === 'socket') {
            (this.connection as WebSocket).close();
            return;
        }
    }
}
// #endregion module



// #region exports
export default Messager;
// #endregion exports
