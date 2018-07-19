function connectAdmin(admin) {
    return new Promise(function (resolve, reject) {
        admin.post('/users/login')
            .set('Content-type', 'application/json')
            .send({
                username: 'admin',
                pw: 'admin'
            })
            .then(res => {
                if (res.statusCode === 200)
                    resolve();
                else
                    reject();
            });
    });
}

function connectUser(user) {
    return new Promise(function (resolve, reject) {
        user.post('/users/login')
            .set('Content-type', 'application/json')
            .send({
                username: 'user',
                pw: 'admin'
            })
            .then(res => {
                if (res.statusCode === 200)
                    resolve();
                else
                    reject();
            });
    });
}

function disconnectAgent(agent) {
    return new Promise(function (resolve, reject) {
        agent.post('/users/logout')
            .then(res => {
                if (res.statusCode === 200)
                    resolve();
                else
                    reject();
            });
    });
}

module.exports = { connectAdmin: connectAdmin, connectUser: connectUser, disconnectAgent: disconnectAgent };