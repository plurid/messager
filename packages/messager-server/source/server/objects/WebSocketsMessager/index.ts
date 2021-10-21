// #region imports
    // #region libraries
    import {
        EventEmitter,
    } from 'events';

    import {
        WebSocket,
    } from 'ws';
    // #endregion libraries


    // #region external
    import recordsBatcher from '~server/services/recordsBatcher';
    // #endregion external
// #endregion imports



// #region module
class WebSocketsMessager extends EventEmitter {
    private sockets: Record<string, WebSocket | undefined> = {};
    private subscribers: Record<string, string[] | undefined> = {};


    constructor() {
        super();

        this.setup();
    }


    private subscribe(
        data: any,
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

    private publish(
        data: any,
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
                    recordsBatcher.push({
                        type: 'socket',
                        socketID,
                        data: {
                            ...message,
                        },
                    });

                    socket.send(JSON.stringify({
                        topic,
                        data: message.data,
                    }));
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
        socket: WebSocket,
    ) {
        this.sockets[socketID] = socket;
    }

    public deregister(
        socketID: string,
    ) {
        delete this.sockets[socketID];
    }
}
// #endregion module



// #region exports
export default WebSocketsMessager;
// #endregion exports
