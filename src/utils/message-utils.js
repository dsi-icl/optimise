const ErrorMessage = {
    CREATIONFAIL: 'Could\'t create entry',
    DELETEFAIL: 'Couldn\'t delete entry',
    UPDATEFAIL: 'Couldn\'t update entry',
    GETFAIL: 'Couldn\'t find the requested entry',
    NOTFOUND: 'Requested entry not found',
    ERASEFAILED: 'Couldn\'t erase entry'
};

const UserRelatedErrorMessage = {
    MISSINGARGUMENT: 'The request is missing some arguments',
    WRONGARGUMENTS: 'Wrong value in the given arguments',
    BADPASSWORD: 'The password provided doesn\'t match',
    BADCREDENTIALS: 'Invalid credentials',
    NORIGHTS: 'Unauthorized to do this action',
    INVALIDDATE: 'The date provided is not valid',
    WRONGPATH: 'The requested url doesn\'t exists',
    INVALIDQUERY: 'The query string can only have one parameter "id"'
};

module.exports = { errorMessages: ErrorMessage, userError: UserRelatedErrorMessage };