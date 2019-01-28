import express from 'express';

const app = express();
app.get('/api', (__unused__req, res) => {
    res.send({
        message: 'I am a server route and can also be hot reloaded!'
    });
});

export default app;