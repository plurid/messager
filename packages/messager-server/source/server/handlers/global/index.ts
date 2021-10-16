// #region imports
    // #region libraries
    import {
        Application,
    } from 'express';

    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import ServerEventsMessager from '~server/objects/ServerEventsMessager';

    import database from '~server/services/database';
    // #endregion external
// #endregion imports



// #region module
const serverEventsMessagers: Record<string, ServerEventsMessager> = {};


const setup = async (
    instance: Application,
) => {
    try {
        await database.initialize();


        instance.get('/event', (request, response) => {
            if (
                request.headers.accept &&
                request.headers.accept == 'text/event-stream'
            ) {
                const serverEventsMessager = new ServerEventsMessager(response);

                // get from request token
                const messagerID = 'one';

                serverEventsMessagers[messagerID] = serverEventsMessager;
            }
        });

        instance.post('/event', (request, response) => {
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
        });
    } catch (error) {
        return;
    }
}
// #endregion module



// #region exports
export default setup;
// #endregion exports
