// #region imports
    // #region libraries
    import {
        Request,
        Response,
    } from 'express';

    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        getMessagerIDWithToken
    } from '~server/logic/token';

    import serverEventsManager from '~server/services/serverEventsManager';
    import webSocketsManager from '~server/services/webSocketsManager';
    // #endregion external
// #endregion imports



// #region module
const handlePost = async (
    request: Request,
    response: Response,
) => {
    try {
        const {
            token,
        } = request.query;

        const ownerID = await getMessagerIDWithToken(token as string | undefined);
        if (!ownerID) {
            response.status(403).end();
            return;
        }


        const {
            from,
            target,
            data,
        } = request.body;

        const notifyData = {
            type: 'notify',
            from,
            data,
        };


        const serverEventsMessager = serverEventsManager.get(ownerID, target);
        if (serverEventsMessager) {
            const sseID = uuid.multiple(5);

            serverEventsMessager.send(
                sseID,
                notifyData,
            );

            response.end();
            return;
        }


        const webSocketsMessager = webSocketsManager.get(ownerID);
        if (webSocketsMessager) {
            webSocketsMessager.emit('received', {
                socketID: from,
                message: data.parse(notifyData),
            });

            response.end();
            return;
        }


        response.status(404).end();
    } catch (error: any) {
        if (!response.headersSent) {
            response.status(500).end();
        }
    }
}
// #endregion module



// #region exports
export default {
    handlePost,
} as any;
// #endregion exports
