// #region imports
    // #region libraries
    import {
        EventEmitter,
    } from 'events';

    import {
        WebSocket,
    } from 'ws';


    import {
        DeonPure,
    } from '@plurid/deon';

    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        SocketPublish,
        SocketSubscribe,
        SocketUnsubscribe,
    } from '~server/data/interfaces';

    import {
        PING_INTERVAL,
    } from '~server/data/constants';

    import recordsBatcher from '~server/services/recordsBatcher';
    // #endregion external
// #endregion imports



// #region module
class WebSocketsMessager extends EventEmitter {
    private sockets: Record<string, WebSocket | undefined> = {};
    private subscribers: Record<string, string[] | undefined> = {};
    private ownings: Record<string, string> = {};
    private intervals: Record<string, NodeJS.Timeout> = {};


    constructor() {
        super();

        this.setup();
    }


    private subscribe(
        data: SocketSubscribe,
    ) {
        const {
            socketID,
            message,
        } = data;

        const {
            topic,
        } = message;

        if (!this.subscribers[topic]) {
            this.subscribers[topic] = [];
        }
        this.subscribers[topic]?.push(socketID);
    }

    private unsubscribe(
        data: SocketUnsubscribe,
    ) {
        const {
            socketID,
            message,
        } = data;

        const {
            topic,
        } = message;

        if (this.subscribers[topic]) {
            this.subscribers[topic] = this.subscribers[topic]?.filter(topicSocketID => topicSocketID !== socketID);
        }
    }

    private publish(
        data: SocketPublish,
    ) {
        const {
            message,
        } = data;

        const {
            topic,
        } = message;

        if (this.subscribers[topic]) {
            for (const socketID of this.subscribers[topic] as string[]) {
                const socket = this.sockets[socketID];
                if (socket) {
                    const owner = this.ownings[socketID];

                    recordsBatcher.push({
                        id: uuid.multiple(3),
                        ownedBy: owner,
                        happenedAt: Date.now(),
                        kind: 'socket',
                        socketID,
                        data: {
                            ...message,
                        },
                    });

                    const deon = new DeonPure();
                    const socketData = deon.stringify({
                        topic,
                        data: message.data,
                    });

                    socket.send(socketData);
                }
            }
        }
    }

    private setup() {
        this.on('received', (data) => {
            try {
                const {
                    message,
                } = data;

                const {
                    type,
                } = message;

                switch (type) {
                    case 'subscribe':
                        this.subscribe(data);
                        break;
                    case 'unsubscribe':
                        this.unsubscribe(data);
                        break;
                    case 'publish':
                        this.publish(data);
                        break;
                }
            } catch (error) {
                return;
            }
        });
    }


    public register(
        socketID: string,
        ownerID: string,
        socket: WebSocket,
    ) {
        this.sockets[socketID] = socket;
        this.ownings[socketID] = ownerID;
        this.intervals[socketID] = setInterval(() => {
            socket.ping();
        }, PING_INTERVAL);
    }

    public deregister(
        socketID: string,
    ) {
        delete this.sockets[socketID];
        delete this.ownings[socketID];
        clearInterval(this.intervals[socketID]);
    }
}
// #endregion module



// #region exports
export default WebSocketsMessager;
// #endregion exports
