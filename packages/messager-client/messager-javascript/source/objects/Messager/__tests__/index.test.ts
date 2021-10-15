// #region imports
    // #region external
    import Messager from '../index';
    // #endregion external
// #endregion imports



// #region module
describe('Messager', () => {
    it('works', async () => {
        const messager = new Messager(
            // 'messager.plurid.cloud',
            'localhost:6655',
            'token',
        );

        let value: boolean | undefined;

        interface Data {
            value: boolean;
        }

        messager.subscribe<Data>('some.topic', (data) => {
            // do things with data
            console.log(data);

            value = data.value;
        });

        messager.publish<Data>(
            'some.topic',
            { value: true },
        );

        setTimeout(() => {
            expect(value).toBeTruthy();
        }, 1000);
    })
});
// #endregion module
