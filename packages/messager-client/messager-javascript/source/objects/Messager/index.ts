// #region imports
    // #region libraries
    import {
        data,
    } from '@plurid/plurid-functions';

    import Deon from '@plurid/deon';
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
    private deon = new Deon();

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

                this.handleMessageData(
                    message,
                );
            }

            return;
        }


        if (this.kind === 'socket') {
            const protocol = this.options.secure ? 'wss://' : 'ws://';

            this.endpoint = protocol + this.host + this.options.socketPath + `?token=${this.token || ''}`;

            if (typeof window === 'undefined') {
                // browser socket
                this.connection = new WebSocket(this.endpoint);

                this.connection.addEventListener('message', (event) => {
                    const message = data.parse(event.data);

                    this.handleMessageData(
                        message,
                    );
                });

                return;
            } else {
                // nodejs socket

            }
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


    public publish<D = any>(
        topic: string,
        data: D,
    ) {
        try {
            if (!this.connection) {
                // no connection error
                return;
            }


            if (this.kind === 'event') {
                // POSTs to this.endoint with the topic/data
                return;
            }

            if (this.kind === 'socket') {
                const publish: MessagerSocketPublish<D> = {
                    type: 'publish',
                    topic,
                    data,
                };

                // const message = this.deon.stringify(publish);
                const message = JSON.stringify(publish);

                if (typeof window !== 'undefined') {
                    (this.connection as WebSocket).send(message);
                    return;
                }
            }
        } catch (error) {
            return;
        }
    }

    public subscribe<D = any>(
        topic: string,
        action: MessagerSubscribeAction<D>,
    ) {
        if (!this.connection) {
            // no connection error
            return;
        }

        this.subscribers[topic].push(action);

        const subscribe: MessagerSocketSubscribe = {
            type: 'subscribe',
            topic,
        };


        if (this.kind === 'event') {
            // POSTs to this.endoint with the topic
            return;
        }

        if (this.kind === 'socket') {
            // const message = this.deon.stringify(subscribe);
            const message = JSON.stringify(subscribe);

            (this.connection as WebSocket).send(message);
            return;
        }
    }
}
// #endregion module



// #region exports
export default Messager;
// #endregion exports
