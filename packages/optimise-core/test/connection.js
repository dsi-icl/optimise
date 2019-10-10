export const connectAdmin = agent => connectAgent(agent, 'admin', 'admin');

export const connectUser = agent => connectAgent(agent, 'user', 'user');

export const connectAgent = (agent, user, pw) => new Promise((resolve, reject) => agent.post('/users/login')
    .set('Content-type', 'application/json')
    .send({
        username: user,
        pw
    })
    .then(({ statusCode }) => {
        if (statusCode === 200)
            return resolve();
        return reject(new Error(`The user '${user}' could not be logged in !`));
    }).catch(() => null));

export const disconnectAgent = agent => new Promise((resolve, reject) => agent.post('/users/logout')
    .then(({ statusCode }) => {
        if (statusCode === 200)
            return resolve();
        return reject(new Error('The previous user could not be logged out !'));
    }).catch(() => null));

export default { connectAdmin, connectUser, disconnectAgent };