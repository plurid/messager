// #region imports
    // #region libraries
    import {
        Express,
        Request,
        Response,
        NextFunction,
    } from 'express';

    import cors from 'cors';

    import {
        json as jsonParser,
    } from 'body-parser';
    import cookieParser from 'cookie-parser';
    // #endregion libraries


    // #region external
    import {
        MessagerLogic,
        MessagerRequest,
    } from '~server/data/interfaces';

    import {
        HEALTH_CHECK_ENDPOINT,

        Headers,
        ContentTypes,
    } from '~server/data/constants';
    // #endregion external
// #endregion imports



// #region module
const setupMiddleware = async (
    instance: Express,
    logic?: MessagerLogic,
) => {
    instance.use(
        cors({
            credentials: true,
            origin: (_: any, callback: any) => {
                return callback(null, true);
            },
        }),
        cookieParser(),
        /** Attach logic */
        (request, _, next) => {
            if (logic) {
                (request as MessagerRequest).messagerLogic = {
                    ...logic,
                };
            }

            next();
        },
        jsonParser({
            limit: '100mb',
        }),
    );

    instance.use((error: any, _: Request, response: Response, next: NextFunction) => {
        if (error) {
            response.status(400).end();
        } else {
            next();
        }
    });

    instance.post(
        HEALTH_CHECK_ENDPOINT,
        (request, response, next) => {
            response.setHeader(
                Headers.ContentType,
                ContentTypes.json,
            );

            response.end(
                JSON.stringify(
                    { status: true },
                ),
            );
        },
    );
}
// #endregion module



// #region exports
export default setupMiddleware;
// #endregion exports
