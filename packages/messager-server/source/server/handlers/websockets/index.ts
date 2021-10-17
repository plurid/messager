// #region imports
    // #region libraries
    import {
        Socket,
    } from 'net';

    import {
        Server,
    } from 'http';

    import {
        URLSearchParams,
    } from 'url';

    import WebSocket from 'ws';

    import {
        data,
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        SOCKET_PATH,
    } from '~server/data/constants';

    import webSocketsMessager from '~server/services/webSocketsMessager';
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

            const socketID = uuid.multiple(3);

            webSocketsMessager.register(socketID, websocketConnection);

            websocketConnection.on('close', () => {
                webSocketsMessager.deregister(socketID);
            });

            websocketConnection.on('message', (message) => {
                const messageData = data.parse(message.toString());

                webSocketsMessager.emit(`received`, {
                    socketID,
                    message: messageData,
                });
            });
        }
    );
}
// #endregion module



// #region exports
export default setupWebsockets;
// #endregion exports
