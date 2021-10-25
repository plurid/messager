const Messager = require('../distribution').default;


const messager = new Messager(
    'localhost:56865',
    '__TEST_MODE__',
    'socket',
    {
        log: true,
        secure: false,
    },
);


messager.subscribe('some.topic', (data) => {
    console.log(data);

    messager.close();
});


messager.publish(
    'some.topic',
    { value: true },
);
