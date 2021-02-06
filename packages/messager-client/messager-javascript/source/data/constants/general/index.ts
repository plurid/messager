// #region imports
    // #region external
    // #endregion external
// #endregion imports



// #region module
const ENDPOINT = process.env.MESSAGER_ENDPOINT || '';
const TOKEN = process.env.MESSAGER_TOKEN || '';

const PROJECT = process.env.MESSAGER_PROJECT || '';
const SPACE = process.env.MESSAGER_SPACE || '';


const CALL_CONTEXT = process.env.MESSAGER_CALL_CONTEXT === 'true';
const REPOSITORY_PROVIDER = process.env.MESSAGER_REPOSITORY_PROVIDER || '';
const REPOSITORY_NAME = process.env.MESSAGER_REPOSITORY_NAME || '';
const REPOSITORY_COMMIT = process.env.MESSAGER_REPOSITORY_COMMIT || 'latest';
const REPOSITORY_BRANCH = process.env.MESSAGER_REPOSITORY_BRANCH || 'master';
const REPOSITORY_BASEPATH = process.env.MESSAGER_REPOSITORY_BASEPATH || '__MATCH_CUT__';


const DEFAULT_CALL_DEPTH = 0;
// #endregion module



// #region exports
export {
    ENDPOINT,
    TOKEN,

    PROJECT,
    SPACE,

    CALL_CONTEXT,
    REPOSITORY_PROVIDER,
    REPOSITORY_BRANCH,
    REPOSITORY_COMMIT,
    REPOSITORY_NAME,
    REPOSITORY_BASEPATH,

    DEFAULT_CALL_DEPTH,
};
// #endregion exports
