const runner = require('@plurid/runner').default;

const Messager = require('../distribution').default;



runner(
    async (
        check,
    ) => {
        const messager = new Messager(
            'localhost:56865',
            '__TEST_MODE__',
            'socket',
            {
                log: true,
                secure: false,
            },
        );

        await new Promise((resolve) => {
            messager.subscribe('some.topic', (data) => {
                // console.log(data);
                check('works', data.value, true);

                messager.close();

                resolve(true);
            });

            messager.publish(
                'some.topic',
                { value: true },
            );
        });
    },
);
