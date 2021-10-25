// #region imports
    // #region external
    import {
        DatabaseType,
    } from '~server/data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const DATABASE_TYPE = (process.env.MESSAGER_DATABASE_TYPE as DatabaseType | undefined)
    || 'mongo';


export const LOG_LEVEL = process.env.MESSAGER_LOG_LEVEL || '7';
export const QUIET = process.env.MESSAGER_QUIET === 'true';

export const logLevel = QUIET
    ? 0
    : parseInt(LOG_LEVEL);


export const CUSTOM_LOGIC_USAGE = process.env.MESSAGER_CUSTOM_LOGIC_USAGE === 'true';


export const PRIVATE_USAGE = process.env.MESSAGER_PRIVATE_USAGE === 'true'
export const PRIVATE_OWNER_IDENTONYM = process.env.MESSAGER_PRIVATE_OWNER_IDENTONYM || '';
export const PRIVATE_OWNER_KEY = process.env.MESSAGER_PRIVATE_OWNER_KEY || '';
export const PRIVATE_TOKEN = process.env.MESSAGER_PRIVATE_TOKEN || '';


export const MONGO_USERNAME = process.env.MESSAGER_MONGO_USERNAME || '';
export const MONGO_PASSWORD = process.env.MESSAGER_MONGO_PASSWORD || '';
export const MONGO_ADDRESS = process.env.MESSAGER_MONGO_ADDRESS || '';
export const MONGO_CONNECTION_STRING = process.env.MESSAGER_MONGO_CONNECTION_STRING || '';
export const MONGO_DATABASE = process.env.MESSAGER_MONGO_DATABASE || 'messager';


export const TEST_MODE = process.env.MESSAGER_TEST_MODE === 'true';
export const TEST_MODE_TOKEN = process.env.MESSAGER_TEST_MODE_TOKEN || '__TEST_MODE__';



export const OPTIMIZATION_BATCH_WRITE_SIZE = parseInt(process.env.MESSAGER_OPTIMIZATION_BATCH_WRITE_SIZE || '') || 1000;
export const OPTIMIZATION_BATCH_WRITE_TIME = parseInt(process.env.MESSAGER_OPTIMIZATION_BATCH_WRITE_TIME || '') || 5000;



export const EVENT_PATH = process.env.MESSAGER_EVENT_PATH || '/event';
export const SOCKET_PATH = process.env.MESSAGER_SOCKET_PATH || '/socket';
export const NOTIFY_PATH = process.env.MESSAGER_NOTIFY_PATH || '/notify';
// #endregion module
