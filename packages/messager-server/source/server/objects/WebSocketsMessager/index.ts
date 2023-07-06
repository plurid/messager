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
    private owner: string;
    private publisherSocket: string = '';

    private sockets: Record<string, WebSocket | undefined> = {};
    private status: Record<string, boolean> = {};
    private ownings: Record<string, string> = {};
    private intervals: Record<string, NodeJS.Timeout> = {};
    private subscribers: Record<string, string[] | undefined> = {};


    constructor(
        owner: string,
    ) {
        super();

        this.owner = owner;

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

        const subscribers = this.subscribers[topic];
        if (!subscribers || subscribers.length === 0) {
            return;
        }

        for (const socketID of subscribers) {
            const socket = this.sockets[socketID];
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                continue;
            }

            const deon = new DeonPure();
            const socketData = deon.stringify({
                topic,
                data: message.data,
            });

            socket.send(socketData);
        }

        recordsBatcher.push({
            id: uuid.multiple(3),
            ownedBy: this.owner,
            happenedAt: Date.now(),
            kind: 'socket',
            socketID: this.publisherSocket,
            data: {
                ...message,
            },
        });
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
        this.publisherSocket = socketID;
        this.sockets[socketID] = socket;
        this.status[socketID] = true;
        this.ownings[socketID] = ownerID;
        this.intervals[socketID] = setInterval(() => {
            if (!this.sockets[socketID] || this.sockets[socketID]!.readyState !== WebSocket.OPEN) {
                clearInterval(this.intervals[socketID]);
                return;
            }

            this.status[socketID] = false;
            this.sockets[socketID]!.ping();
        }, PING_INTERVAL);

        this.sockets[socketID]!.on('pong', () => {
            this.status[socketID] = true;
        });
    }

    public deregister(
        socketID: string,
    ) {
        delete this.sockets[socketID];
        delete this.status[socketID];
        delete this.ownings[socketID];
        clearInterval(this.intervals[socketID]);
    }
}
// #endregion module



// #region exports
export default WebSocketsMessager;
// #endregion exports
