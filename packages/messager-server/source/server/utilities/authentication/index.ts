// #region imports
    // #region libraries
    import {
        IncomingMessage,
    } from 'http';

    import {
        Request,
    } from 'express';
    // #endregion libraries


    // #region external
    import {
        AuthenticationMarkers,
    } from '~server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const getAuthenticationMarkers = (
    request: IncomingMessage | Request,
) => {
    const ip = request.socket.remoteAddress;
    const origin = request.headers['origin'];
    const key = request.headers['messager-key'];

    const authenticationMarkers: AuthenticationMarkers = {
        ip,
        origin,
        key: typeof key === 'string' ? key : undefined,
    };

    return authenticationMarkers;
}
// #endregion module
