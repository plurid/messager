const http = require('http');
const fs = require('fs');


http.createServer((request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.write(fs.readFileSync(__dirname + '/index.html'));
    response.end();
}).listen(8080, () => {
    console.log('events test server started at http://localhost:8080');
});
