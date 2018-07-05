const app = require('./app');

let server = app.listen(3000, () => { console.log('listening on port 3000!'); });

process.on('exit', function(){
    server.close(function (){
        if (process.env.NODE_ENV !== 'PROD')
            console.log('Quitting the server');
        process.exit();
    });
});