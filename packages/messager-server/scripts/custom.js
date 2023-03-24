// Edit file based on the project requirements.


const esModules = [
    // add dependencies to be bundled as ES modules
    // string or (dependency: string): string
    'bson',
];


const externals = [
    // add dependencies to be left as external to the server
    // string or (dependency: string): string
    'bson',
];


const environment = {
    // add environment variables replacements for frontend, e.g.
    // 'process.env.ENV_NAME': JSON.stringify(process.env.ENV_NAME || ''),
    'process.env.MESSAGER_ENDPOINT_GRAPHQL': JSON.stringify(process.env.MESSAGER_ENDPOINT_GRAPHQL || ''),
};



exports.esModules = esModules;
exports.externals = externals;
exports.environment = environment;
