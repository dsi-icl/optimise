/*eslint no-console: "off"*/
const app = require('./app');

let server = app.listen(3030, () => { console.log('listening on port 3030!'); });

process.on('exit', function () {
    server.close(function () {
        if (process.env.NODE_ENV !== 'production')
            console.log('Quitting the server');
        process.exit();
    });
});
