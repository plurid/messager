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

    import {
        getMessagerIDWithToken
    } from '~server/logic/token';

    import webSocketsManager from '~server/services/webSocketsManager';
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
        async (websocketConnection, connectionRequest) => {
            const [
                _path,
                params,
            ] = connectionRequest?.url?.split('?') || [];

            const searchParams = new URLSearchParams(params);

            const token = searchParams.get('token');

            const messagerID = await getMessagerIDWithToken(token);
            if (!messagerID) {
                // not authorized
                websocketConnection.close();
                return;
            }

            const webSocketsMessager = webSocketsManager.new(messagerID);

            const socketID = messagerID + uuid.multiple(3);

            webSocketsMessager.register(socketID, websocketConnection);

            websocketConnection.on('close', () => {
                webSocketsMessager.deregister(socketID);
            });

            websocketConnection.on('message', (message) => {
                webSocketsMessager.emit('received', {
                    socketID,
                    message: data.parse(message.toString()),
                });
            });
        }
    );
}
// #endregion module



// #region exports
export default setupWebsockets;
// #endregion exports
