// #region imports
    // #region libraries
    import ttypescript from 'ttypescript';
    import resolve from '@rollup/plugin-node-resolve';
    import commonjs from '@rollup/plugin-commonjs';
    import typescript from 'rollup-plugin-typescript2';
    // #endregion libraries

    // #region external
    import pkg from '../package.json';
    // #endregion external
// #endregion imports



// #region module
export default {
    input: './source/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
        },
        {
            file: pkg.module,
            format: 'es',
            exports: 'named',
        },
    ],
    external: [
        '@apollo/client',
        '@plurid/deon',
        '@plurid/plurid-functions',
        'cross-fetch',
        'graphql',
        'graphql-tag',
        'subscriptions-transport-ws',
        'ws',
    ],
    watch: {
        include: 'source/**',
    },
    plugins: [
        typescript({
            typescript: ttypescript,
            tsconfig: './tsconfig.json',
        }),
        resolve({
            preferBuiltins: true,
        }),
        commonjs(),
    ],
};
// #endregion module
