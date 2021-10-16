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
    import ServerEventsMessager from '~server/objects/ServerEventsMessager';
    // #endregion external
// #endregion imports



// #region module
const serverEventsMessagers: Record<string, ServerEventsMessager> = {};


const handleGet = async (
    request: Request,
    response: Response,
) => {
    if (request.headers.accept !== 'text/event-stream') {
        response.status(400).end();
        return;
    }


    const {
        token,
    } = request.query;

    if (!token) {
        response.status(401).end();
        return;
    }

    const serverEventsMessager = new ServerEventsMessager(response);

    // get from request token
    const messagerID = 'one';

    serverEventsMessagers[messagerID] = serverEventsMessager;
}


const handlePost = async (
    request: Request,
    response: Response,
) => {
    const {
        token,
    } = request.query;

    if (!token) {
        response.status(401).end();
        return;
    }

    // get from request token
    const messagerID = 'one';

    const serverEventsMessager = serverEventsMessagers[messagerID];

    if (!serverEventsMessager) {
        response.status(404).end();
        return;
    }

    const sseID = uuid.multiple(3);
    const data = request.body.data;

    serverEventsMessager.send(sseID, data);

    response.end();
}
// #endregion module



// #region exports
export default {
    handleGet,
    handlePost,
};
// #endregion exports
