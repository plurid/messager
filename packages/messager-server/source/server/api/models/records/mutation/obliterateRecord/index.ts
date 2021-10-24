// #region imports
    // #region external
    import {
        Context,
        InputValueString,
    } from '~server/data/interfaces';

    import {
        deregisterRecord,
    } from '~server/logic/operators/records';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const obliterateRecordLogs = generateMethodLogs('obliterateRecord');


const obliterateRecord = async (
    input: InputValueString,
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
        obliterateRecordLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region input unpack
        const {
            value,
        } = input;
        // #endregion input unpack


        // #region private usage
        if (privateUsage) {
            logger.log(
                obliterateRecordLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    obliterateRecordLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            await deregisterRecord(
                value,
                privateOwnerIdentonym,
            );

            logger.log(
                obliterateRecordLogs.infoSuccessPrivateUsage,
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
                obliterateRecordLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            logger.log(
                obliterateRecordLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            await deregisterRecord(
                value,
                '',
            );

            return {
                status: true,
            };
        }
        // #endregion logic usage


        // #region public usage
        logger.log(
            obliterateRecordLogs.infoSuccess,
            logLevels.info,
        );

        await deregisterRecord(
            value,
            '',
        );

        return {
            status: true,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            obliterateRecordLogs.errorEnd,
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
export default obliterateRecord;
// #endregion exports
