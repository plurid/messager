const Messager = require('../distribution').default;



const topic = 'some.topic';


const main = async () => {
    const publisher = new Messager(
        'localhost:56865',
        '__TEST_MODE__',
        'socket',
        {
            log: true,
            secure: false,
        },
    );

    setInterval(() => {
        publisher.publish(
            topic,
            { value: "onetwothreefourfivesixseveneightnineten" },
        );
    }, 1000);

    for (let i = 0; i <= 100; i++) {
        const subscriber = new Messager(
            'localhost:56865',
            '__TEST_MODE__',
            'socket',
            {
                log: true,
                secure: false,
            },
        );

        subscriber.subscribe(topic, (_data) => {
            console.log(i);
        });
    }
}

main();
