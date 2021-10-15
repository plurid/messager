// #region imports
    // #region external
    import Messager from '../index';
    // #endregion external
// #endregion imports



// #region module
describe('Messager', () => {
    it('works', () => {
        const messager = new Messager(
            // 'messager.plurid.cloud',
            'localhost:6655',
            'token',
        );

        messager.publish(
            'topic',
            { data: true },
        );

        messager.subscribe<boolean>('topic', (data) => {
            // do things with data
        });
    })
});
// #endregion module
