// #region imports
    // #region libraries
    import {
        IncomingMessage,
    } from 'http';

    import {
        Request,
    } from 'express';
    // #endregion libraries
// #endregion imports



// #region module
export const getAuthenticationMarkers = (
    request: IncomingMessage | Request,
) => {
    const ip = request.socket.remoteAddress;
    const origin = request.headers['origin'];
    const key = request.headers['messager-key'];

    const authenticationMarkers = {
        ip,
        origin,
        key: typeof key === 'string' ? key : undefined,
    };

    return authenticationMarkers;
}
// #endregion module
