// #region imports
    // #region external
    import {
        TEST_MODE,
        TEST_MODE_TOKEN,
    } from '~server/data/constants';
    // #endregion external
// #endregion imports



// #region module
export const getMessagerIDWithToken = async (
    token: string | undefined | null,
): Promise<string | undefined> => {
    if (TEST_MODE) {
        if (token !== TEST_MODE_TOKEN) {
            return;
        }

        return TEST_MODE_TOKEN;
    }

    return 'one';
}
// #endregion module
