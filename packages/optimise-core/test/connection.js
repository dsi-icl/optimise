export const connectAdmin = agent => connectAgent(agent, 'admin', 'admin');

export const connectUser = agent => connectAgent(agent, 'user', 'user');

export const connectAgent = (agent, user, pw) => new Promise((resolve, reject) => agent
    .post('/users/login')
    .set('Content-type', 'application/json')
    .send({
        username: user,
        pw
    })
    .then(({ statusCode }) => {
        if (statusCode === 200)
            return true;
        return reject(new Error(`The user '${user}' could not be logged in !`));
    })
    .then(() => agent.get('/whoami'))
    .then(({ headers }) => {
        agent.__csrf = headers['csrf-token'];
        return agent.set('csrf-token', agent.__csrf);
    })
    .then(() => resolve())
    .catch(() => null));

export const disconnectAgent = agent => new Promise((resolve, reject) => {
    agent.set('csrf-token', agent.__csrf);
    agent.post('/users/logout')
        .then(({ statusCode }) => {
            if (statusCode === 200)
                return resolve();
            return reject(new Error('The previous user could not be logged out !'));
        }).catch(() => null);
});

export default { connectAdmin, connectUser, disconnectAgent };