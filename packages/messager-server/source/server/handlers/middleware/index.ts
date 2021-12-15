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
        raw as rawParser,
        json as jsonParser,
    } from 'body-parser';
    import cookieParser from 'cookie-parser';

    import {
        DeonPure,
        DEON_MEDIA_TYPE,
    } from '@plurid/deon';
    // #endregion libraries


    // #region external
    import {
        MessagerLogic,
        MessagerRequest,
    } from '~server/data/interfaces';

    import {
        MESSAGE_SIZE,
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

        /** Deon parsing */
        rawParser({
            type: DEON_MEDIA_TYPE,
            limit: MESSAGE_SIZE,
        }),
        (request, _response, next) => {
            if (request.header('content-type') === DEON_MEDIA_TYPE) {
                const deon = new DeonPure();
                const body = request.body.toString();
                const result = deon.parseSynchronous(body);
                request.body = result;
            }

            next();
        },

        jsonParser({
            limit: MESSAGE_SIZE,
        }),
    );

    instance.use(
        (error: any, _request: Request, response: Response, next: NextFunction) => {
            if (error) {
                response.status(400).end();
            } else {
                next();
            }
        },
    );

    instance.post(
        HEALTH_CHECK_ENDPOINT,
        (_request, response, _next) => {
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
