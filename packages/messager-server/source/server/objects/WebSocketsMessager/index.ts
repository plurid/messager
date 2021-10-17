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
    private sockets: Record<string, WebSocket> = {};


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

                // send the message to all the subscribers
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
}
// #endregion module



// #region exports
export default WebSocketsMessager;
// #endregion exports
