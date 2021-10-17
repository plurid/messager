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

    import ServerEventsMessager from '~server/objects/ServerEventsMessager';
    // #endregion external
// #endregion imports



// #region module
const serverEventsMessagers: Record<string, ServerEventsMessager | undefined> = {};


const handleGet = async (
    request: Request,
    response: Response,
) => {
    try {
        if (request.headers.accept !== 'text/event-stream') {
            response.status(400).end();
            return;
        }

        const {
            token,
        } = request.query;

        const messagerID = await getMessagerIDWithToken(token as string | undefined);
        if (!messagerID) {
            response.status(403).end();
            return;
        }

        const serverEventsMessager = new ServerEventsMessager(response);
        serverEventsMessagers[messagerID] = serverEventsMessager;
    } catch (error: any) {
        if (!response.headersSent) {
            response.status(500).end();
        }
    }
}


const handlePost = async (
    request: Request,
    response: Response,
) => {
    try {
        const {
            token,
        } = request.query;

        const messagerID = await getMessagerIDWithToken(token as string | undefined);
        if (!messagerID) {
            response.status(403).end();
            return;
        }

        const serverEventsMessager = serverEventsMessagers[messagerID];
        if (!serverEventsMessager) {
            response.status(404).end();
            return;
        }

        const sseID = uuid.multiple(3);
        const data = request.body.data;

        serverEventsMessager.send(sseID, data);

        response.end();
    } catch (error: any) {
        if (!response.headersSent) {
            response.status(500).end();
        }
    }
}
// #endregion module



// #region exports
export default {
    handleGet,
    handlePost,
};
// #endregion exports
