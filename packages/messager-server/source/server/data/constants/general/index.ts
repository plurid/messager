// #region imports
    // #region libraries
    import path from 'path';
    // #endregion libraries
// #endregion imports



// #region module
export const PORT = parseInt(process.env.PORT || '') || 56865;


export const COOKIE_PRIVATE_TOKEN = 'PVTTKN';

export const HEALTH_CHECK_ENDPOINT = '/service-check/health';


export const BASE_PATH = process.env.DELOG_BASE_PATH || process.cwd();
export const BASE_PATH_PROJECTS = '/data/projects/';


export const projectsPath = path.join(BASE_PATH, BASE_PATH_PROJECTS);
// #endregion module
