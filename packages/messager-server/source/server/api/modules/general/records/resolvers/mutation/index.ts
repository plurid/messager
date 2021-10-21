// #region imports
    // #region external
    import {
        Context,
        InputOf,
        InputValueString,
    } from '~server/data/interfaces';

    import {
        Records,
    } from '~server/api/models';
    // #endregion external
// #endregion imports



// #region exports
export default {
    obliterateAllRecords: (
        _: any,
        __: InputOf<any>,
        context: Context,
    ) => Records.Mutation.obliterateAllRecords(
        context,
    ),
    obliterateRecord: (
        _: any,
        { input }: InputOf<InputValueString>,
        context: Context,
    ) => Records.Mutation.obliterateRecord(
        input,
        context,
    ),
    obliterateRecords: (
        _: any,
        { input }: InputOf<any>,
        context: Context,
    ) => Records.Mutation.obliterateRecords(
        input,
        context,
    ),
};
// #endregion exports
