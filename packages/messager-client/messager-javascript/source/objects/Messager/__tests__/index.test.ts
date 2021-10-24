// #region imports
    // #region external
    import Messager from '../index';
    // #endregion external
// #endregion imports



// #region module
describe('Messager', () => {
    it('works', (done) => {
        const messager = new Messager(
            // 'messager.plurid.cloud',
            'localhost:56865',
            '__TEST_MODE__',
            'socket',
            {
                secure: false,
            },
        );

        let value: boolean | undefined;

        interface Data {
            value: boolean;
        }

        messager.subscribe<Data>('some.topic', (data) => {
            // do things with data
            // console.log(data);

            value = data.value;
        });

        messager.publish<Data>(
            'some.topic',
            { value: true },
        );

        setTimeout(() => {
            messager.close();
        }, 1000);

        setTimeout(() => {
            expect(value).toBeTruthy();
            done();
        }, 2000);
    })
});
// #endregion module
