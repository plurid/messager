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

    import {
        getAuthenticationMarkers,
    } from '~server/utilities';
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
            const authenticationMarkers = getAuthenticationMarkers(connectionRequest);

            const [
                _path,
                params,
            ] = connectionRequest?.url?.split('?') || [];

            const searchParams = new URLSearchParams(params);

            const token = searchParams.get('token');

            const ownerID = await getMessagerIDWithToken(
                token,
                authenticationMarkers,
            );
            if (!ownerID) {
                // not authorized
                websocketConnection.close();
                return;
            }

            const socketID = uuid.multiple(5);
            const webSocketsMessager = webSocketsManager.new(ownerID);

            webSocketsMessager.register(
                socketID,
                ownerID,
                websocketConnection,
            );

            websocketConnection.send(JSON.stringify({
                type: 'id',
                data: socketID,
            }));

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
