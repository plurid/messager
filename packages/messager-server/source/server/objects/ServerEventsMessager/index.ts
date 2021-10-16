// #region imports
    // #region libraries
    import {
        Response,
    } from 'express';
    // #endregion libraries
// #endregion imports



// #region module
export const writeServerSendEvent = (
    response: Response,
    sseID: string,
    data: string,
) => {
    try {
        response.write('id: ' + sseID + '\n', 'utf-8');
        response.write('data: ' + data + '\n\n', 'utf-8');

        // FORCED send data by flushing
        (response as any).flush();
    } catch (error) {
        return;
    }
}


class ServerEventsMessager {
    private response;


    constructor(
        response: Response,
    ) {
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
        data: string,
    ) {
        writeServerSendEvent(
            this.response,
            sseID,
            data,
        );
    }
}
// #endregion module



// #region exports
export default ServerEventsMessager;
// #endregion exports
