const express = require('express');

const {
    messagerMiddleware,
} = require('../../build/index');



const app = express();

messagerMiddleware(app);


app.listen(56866, () => {
    console.log('Custom server running Messager started at http://localhost:56866');
});
