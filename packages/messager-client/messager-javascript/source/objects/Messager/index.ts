export type MessagerType = 'socket' | 'event';

export interface MessagerOptions {
    /**
     * Path to connect on the host.
     *
     * default: '/'
     */
    path: string;
}

export type MessagerSubscribeAction<D = any> = (
    data: D,
) => void;



class Messager {
    private connection: undefined | EventSource | WebSocket;

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
            path: options?.path || '/',
        };

        return resolvedOptions;
    }

    private createConnection() {
        if (
            typeof window !== 'undefined'
            && this.kind === 'event'
        ) {
            const endpoint = this.host + this.options.path + `?token=${this.token || ''}`;

            this.connection = new EventSource(
                endpoint,
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
                this.handleEventData(event.data);
            }

            return;
        }


        if (
            typeof window !== 'undefined'
            && this.kind === 'socket'
        ) {
            const endpoint = 'ws://' + this.host + this.options.path + `?token=${this.token || ''}`;

            this.connection = new WebSocket(endpoint);

            this.connection.addEventListener('message', (event) => {
                this.handleEventData(event.data);
            });
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
                // event connection cannot publish
                return;
            }

            const eventData = {
                topic,
                data,
            };

            const eventDataString = JSON.stringify(eventData);

            if (typeof window !== 'undefined') {
                (this.connection as WebSocket).send(eventDataString);
                return;
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



const messager = new Messager(
    'messager.plurid.cloud',
    'token',
);


messager.publish(
    'topic',
    { data: true },
);

messager.subscribe<boolean>('topic', (data) => {
    // do things with data
});
