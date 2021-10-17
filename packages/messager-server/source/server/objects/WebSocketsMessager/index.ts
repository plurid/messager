// #region imports
    // #region libraries
    import {
        EventEmitter,
    } from 'events';

    import {
        WebSocket,
    } from 'ws';
    // #endregion libraries
// #endregion imports



// #region module
class WebSocketsMessager extends EventEmitter {
    private sockets: Record<string, WebSocket | undefined> = {};
    private subscribers: Record<string, string[] | undefined> = {};


    constructor() {
        super();

        this.setup();
    }


    private setup() {
        this.on('received', (data) => {
            try {
                const {
                    socketID,
                    message,
                } = data;

                const {
                    type,
                    topic,
                } = message;

                switch (type) {
                    case 'subscribe':
                        if (!this.subscribers[topic]) {
                            this.subscribers[topic] = [];
                        }
                        this.subscribers[topic]?.push(socketID);
                        break;
                    case 'publish':
                        if (this.subscribers[topic]) {
                            for (const socketID of this.subscribers[topic] as string[]) {
                                const socket = this.sockets[socketID];
                                if (socket) {
                                    socket.send(JSON.stringify({
                                        topic,
                                        data: message.data,
                                    }));
                                }
                            }
                        }
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
