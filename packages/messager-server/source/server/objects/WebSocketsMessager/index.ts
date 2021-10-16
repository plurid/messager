// #region imports
    // #region libraries
    import {
        EventEmitter,
    } from 'events';
    // #endregion libraries
// #endregion imports



// #region module
class WebSocketsMessager extends EventEmitter {
    private sockets: Record<string, any> = {};


    constructor() {
        super();

        this.setup();
    }


    private setup() {
        this.on('received', () => {

        });

        this.on('send', () => {

        });
    }
}
// #endregion module



// #region exports
export default WebSocketsMessager;
// #endregion exports
