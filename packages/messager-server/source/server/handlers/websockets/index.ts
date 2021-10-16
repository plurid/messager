// #region imports
    // #region libraries
    import {
        Server,
    } from 'http';

    import {
        URLSearchParams,
    } from 'url';

    import {
        Socket,
    } from 'net';

    import WebSocket from 'ws';
    // #endregion libraries


    // #region external
    import {
        SOCKET_PATH,
    } from '~server/data/constants';
    // #endregion external
// #endregion imports



// #region module
const setupWebsockets = (
    server: Server,
) => {
    const websocketServer = new WebSocket.Server({
        noServer: true,
        path: SOCKET_PATH,
    });

    server.on('upgrade', (request, socket, head) => {
        websocketServer.handleUpgrade(request, socket as Socket, head, (websocket) => {
            websocketServer.emit('connection', websocket, request);
        });
    });

    websocketServer.on(
        'connection',
        (websocketConnection, connectionRequest) => {
            const [
                _path,
                params,
            ] = connectionRequest?.url?.split('?') || [];

            const searchParams = new URLSearchParams(params);

            const token = searchParams.get('token');
            if (!token) {
                websocketConnection.close();
                return;
            }

            websocketConnection.on('message', (message) => {
                const parsedMessage = JSON.parse(message.toString());
                console.log(parsedMessage);
            });
        }
    );
}
// #endregion module



// #region exports
export default setupWebsockets;
// #endregion exports
