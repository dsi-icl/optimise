function connectAdmin(agent) {
    return connectAgent(agent, 'admin', 'admin');
}

function connectUser(agent) {
    return connectAgent(agent, 'user', 'user');
}

function connectAgent(agent, user, pw) {
    return new Promise(function (resolve, reject) {
        agent.post('/users/login')
            .set('Content-type', 'application/json')
            .send({
                username: user,
                pw: pw
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