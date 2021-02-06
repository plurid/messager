// #region module
const defaultLogger = (
    message: string,
    error?: any,
) => {
    if (error) {
        console.log(message + ' ', error);
        return;
    }

    console.log(message);
}
// #endregion module



// #region exports
export default defaultLogger;
// #endregion exports
