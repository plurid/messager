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
    response.write('id: ' + sseID + '\n');
    response.write('data: ' + data + '\n\n');
}


class ServerEventsMessager {
    private response;


    constructor(
        response: Response,
    ) {
        this.response = response;
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
