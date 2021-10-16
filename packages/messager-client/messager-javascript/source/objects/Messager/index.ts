// #region imports
    // #region libraries
    import {
        data,
    } from '@plurid/plurid-functions';

    import Deon from '@plurid/deon';
    // #endregion libraries
// #endregion imports



// #region module
export type MessagerType = 'socket' | 'event';

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
     * Use secure protocols.
     *
     * default: `true`
     */
    secure: boolean;
}

export type MessagerSubscribeAction<D = any> = (
    data: D,
) => void;



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
            socketPath: options?.socketPath || '/',
            eventPath: options?.eventPath || '/',
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
                const eventData = data.parse(event.data);

                this.handleEventData(
                    eventData,
                );
            }

            return;
        }


        if (
            typeof window !== 'undefined'
            && this.kind === 'socket'
        ) {
            const protocol = this.options.secure ? 'wss://' : 'ws://';

            this.endpoint = protocol + this.host + this.options.socketPath + `?token=${this.token || ''}`;

            this.connection = new WebSocket(this.endpoint);

            this.connection.addEventListener('message', (event) => {
                const eventData = data.parse(event.data);

                this.handleEventData(
                    eventData,
                );
            });

            return;
        }
    }

    private handleEventData(
        eventData: {
            topic: string,
            data: any,
        },
    ) {
        try {
            const {
                topic,
                data,
            } = eventData;

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
            // misshaped event data
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
                const eventData = {
                    topic,
                    data,
                };

                const eventDataString = this.deon.stringify(eventData);

                if (typeof window !== 'undefined') {
                    (this.connection as WebSocket).send(eventDataString);
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
    }
}
// #endregion module



// #region exports
export default Messager;
// #endregion exports
