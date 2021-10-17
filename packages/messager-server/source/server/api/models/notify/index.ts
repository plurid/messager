// #region imports
    // #region libraries
    import {
        Request,
        Response,
    } from 'express';
    // #endregion libraries


    // #region external
    import {
        getMessagerIDWithToken
    } from '~server/logic/token';
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
            target,
            data,
        } = request.body;

        // identify target and send data

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
    handlePost,
};
// #endregion exports
