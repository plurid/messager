// #region imports
    // #region external
    import {
        Context,
    } from '~server/data/interfaces';

    import {
        deregisterRecords,
    } from '~server/logic/operators/records';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const obliterateRecordsLogs = generateMethodLogs('obliterateRecords');


const obliterateRecords = async (
    input: any,
    context: Context,
) => {
    // #region context unpack
    const {
        request,

        privateUsage,
        privateOwnerIdentonym,

        customLogicUsage,

        logger,
        logLevels,
    } = context;
    // #endregion context unpack


    // #region log start
    logger.log(
        obliterateRecordsLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region input unpack
        const {
            ids,
        } = input;
        // #endregion input unpack


        // #region private usage
        if (privateUsage) {
            logger.log(
                obliterateRecordsLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    obliterateRecordsLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            await deregisterRecords(
                ids,
                privateOwnerIdentonym,
            );

            logger.log(
                obliterateRecordsLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.messagerLogic;

        if (customLogicUsage && logic) {
            logger.log(
                obliterateRecordsLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            logger.log(
                obliterateRecordsLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            await deregisterRecords(
                ids,
                '',
            );

            return {
                status: true,
            };
        }
        // #endregion logic usage


        // #region public usage
        logger.log(
            obliterateRecordsLogs.infoSuccess,
            logLevels.info,
        );

        await deregisterRecords(
            ids,
            '',
        );

        return {
            status: true,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            obliterateRecordsLogs.errorEnd,
            logLevels.error,
            error,
        );

        return {
            status: false,
        };
        // #endregion error handle
    }
}
// #endregion module



// #region exports
export default obliterateRecords;
// #endregion exports
