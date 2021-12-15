const express = require('express');

const {
    installMessager,
} = require('../../build/index');



const main = async () => {
    const app = express();

    await installMessager(app);

    app.listen(56866, () => {
        console.log('Custom server running Messager started at http://localhost:56866');
    });
}

main();
