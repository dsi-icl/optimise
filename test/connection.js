function connectAdmin(admin) {
    return new Promise(function (resolve, __unused__reject) {
        admin.post('/users/login')
            .set('Content-type', 'application/json')
            .send({
                username: 'admin',
                pw: 'admin'
            })
            .then(res => {
                expect(res.statusCode).toBe(200);
                resolve();
            });
    })
}

function connectUser(user) {
    return new Promise(function (resolve, __unused__reject) {
        user.post('/users/login')
            .set('Content-type', 'application/json')
            .send({
                username: 'pm',
                pw: 'admin'
            })
            .then(res => {
                expect(res.statusCode).toBe(200);
                resolve();
            });
    })
}

module.exports = { connectAdmin: connectAdmin, connectUser: connectUser};