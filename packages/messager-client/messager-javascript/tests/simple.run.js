const runner = require('@plurid/runner').default;

const Messager = require('../distribution').default;



const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


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
        const topic = 'some.topic';

        await delay(1000);

        console.log('subscribe');
        messager.subscribe(topic, (data) => {
            // console.log(data);
            check('works', data.value, true);
        });
        await delay(1000);

        console.log('publish 1');
        messager.publish(
            topic,
            { value: true },
        );

        await delay(10_000);

        console.log('publish 2');
        messager.publish(
            topic,
            { value: true },
        );

        await delay(1000);
        messager.close();
    },
);
