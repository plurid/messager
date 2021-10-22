// #region imports
    // #region external
    import {
        Context,
        InputUpdateToken,
    } from '~server/data/interfaces';

    import {
        updateToken as updateTokenLogic,
    } from '~server/logic/operators/tokens';

    import {
        generateMethodLogs,
    } from '~server/utilities';
    // #endregion external
// #endregion imports



// #region module
export const updateTokenLogs = generateMethodLogs('updateToken');


const updateToken = async (
    input: InputUpdateToken,
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
        updateTokenLogs.infoStart,
        logLevels.info,
    );
    // #endregion log start


    try {
        // #region private usage
        if (privateUsage) {
            logger.log(
                updateTokenLogs.infoHandlePrivateUsage,
                logLevels.trace,
            );

            if (!privateOwnerIdentonym) {
                logger.log(
                    updateTokenLogs.infoEndPrivateUsage,
                    logLevels.info,
                );

                return {
                    status: false,
                };
            }

            const token = await updateTokenLogic(
                input,
            );
            if (!token) {
                return {
                    status: false,
                };
            }

            logger.log(
                updateTokenLogs.infoSuccessPrivateUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: token,
            };
        }
        // #endregion private usage


        // #region logic usage
        const logic = request.messagerLogic;

        if (customLogicUsage && logic) {
            logger.log(
                updateTokenLogs.infoHandleCustomLogicUsage,
                logLevels.trace,
            );

            const token = await updateTokenLogic(
                input,
            );
            if (!token) {
                return {
                    status: false,
                };
            }

            logger.log(
                updateTokenLogs.infoEndCustomLogicUsage,
                logLevels.info,
            );

            return {
                status: true,
                data: token,
            };
        }
        // #endregion logic usage


        // #region public usage
        const token = await updateTokenLogic(
            input,
        );
        if (!token) {
            return {
                status: false,
            };
        }

        logger.log(
            updateTokenLogs.infoSuccess,
            logLevels.info,
        );

        return {
            status: true,
            data: token,
        };
        // #endregion public usage
    } catch (error) {
        // #region error handle
        logger.log(
            updateTokenLogs.errorEnd,
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
export default updateToken;
// #endregion exports
