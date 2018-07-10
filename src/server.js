/*eslint no-console: "off"*/
/*eslint no-var: "off"*/
const app = require('./app');

let portSelected = 3030;

if (process.argv.length >= 3) {
    portSelected = parseInt(process.argv[2]);
}

let server = app.listen(portSelected, () => { console.log(`listening on port ${portSelected}!`); });

process.on('exit', function () {
    server.close(function () {
        if (process.env.NODE_ENV !== 'production')
            console.log('Quitting the server');
        process.exit();
    });
});
