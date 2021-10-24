// #region imports
    // #region libraries
    import {
        Response,
    } from 'express';


    import {
        DeonPure,
    } from '@plurid/deon';

    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import recordsBatcher from '~server/services/recordsBatcher';
    // #endregion external
// #endregion imports



// #region module
export const writeServerSendEvent = (
    response: Response,
    sseID: string,
    data: string,
) => {
    try {
        const eventString = data.replace(/\n/g, '\\n');

        response.write('id: ' + sseID + '\n', 'utf-8');
        response.write('data: ' + eventString + '\n\n', 'utf-8');

        // FORCED send data by flushing
        (response as any).flush();
    } catch (error) {
        return;
    }
}


class ServerEventsMessager {
    private deon = new DeonPure();

    private response;
    private topics: string[] = [];
    private ownedBy: string;


    constructor(
        ownerID: string,
        response: Response,
    ) {
        this.ownedBy = ownerID;
        this.response = response;

        this.response.setHeader('Cache-Control', 'no-cache');
        this.response.setHeader('Content-Type', 'text/event-stream');
        this.response.setHeader('Connection', 'keep-alive');

        // flush the headers to establish SSE with client
        this.response.flushHeaders();

        this.response.on('close', () => {
            // client dropped connection
            this.response.end();
        });
    }


    public send(
        sseID: string,
        data: {
            type: string,
            topic?: string,
            data: any,
        },
    ) {
        const eventData = this.deon.stringify(data);

        recordsBatcher.push({
            id: uuid.multiple(3),
            ownedBy: this.ownedBy,
            happenedAt: Date.now(),
            kind: 'event',
            sseID,
            data,
        });

        writeServerSendEvent(
            this.response,
            sseID,
            eventData,
        );
    }

    public subscribe(
        topic: string,
    ) {
        this.topics.push(topic);
    }

    public unsubscribe(
        topic: string,
    ) {
        this.topics = this.topics.filter(subscription => subscription !== topic);
    }

    public isSubscribed(
        topic: string,
    ) {
        return this.topics.includes(topic);
    }
}
// #endregion module



// #region exports
export default ServerEventsMessager;
// #endregion exports
