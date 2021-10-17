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
    // #endregion external
// #endregion imports



// #region module
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

        const ownerID = await getMessagerIDWithToken(token as string | undefined);
        if (!ownerID) {
            response.status(403).end();
            return;
        }

        const messagerID = uuid.multiple(4);

        const serverEventsMessager = serverEventsManager.new(ownerID, messagerID, response);
        const sseID = uuid.multiple(5);

        serverEventsMessager.send(sseID, {
            type: 'id',
            data: messagerID,
        });
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

        const ownerID = await getMessagerIDWithToken(token as string | undefined);
        if (!ownerID) {
            response.status(403).end();
            return;
        }

        const {
            messagerID,
            type,
            topic,
            data,
        } = request.body;

        const serverEventsMessager = serverEventsManager.get(ownerID, messagerID);
        if (!serverEventsMessager) {
            response.status(404).end();
            return;
        }

        switch (type) {
            case 'subscribe': {
                serverEventsMessager.subscribe(topic);
                break;
            }
            case 'publish': {
                const serverEventsMessagers = serverEventsManager.getAll(ownerID);
                if (!serverEventsMessagers) {
                    return;
                }

                for (const serverEventsMessager of Object.values(serverEventsMessagers)) {
                    if (!serverEventsMessager) {
                        continue;
                    }

                    if (serverEventsMessager.isSubscribed(topic)) {
                        const sseID = uuid.multiple(5);

                        serverEventsMessager.send(sseID, data);
                    }
                }
                break;
            }
        }

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
