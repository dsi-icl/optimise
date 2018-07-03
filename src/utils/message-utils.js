const ErrorMessage = {
    CREATIONFAIL:'Could\'t create entry',
    DELETEFAIL:'Couldn\'t delete entry',
    UPDATEFAIL:'Couldn\'t update entry',
    GETFAIL:'Couldn\'t find the requested entry',
    NOTFOUND:'Requested entry not found'
}

const UserRelatedErrorMessage = {
    MISSINGARGUMENT:'The request is missing some arguments',
    WRONGARGUMENTS:'Wrong value in the given arguments',
    BADPASSWORD:'The password provided doesn\'t match',
    BADCREDENTIALS:'Invalid credentials',
    NORIGHTS:'Unauthorized to do this action'
}

module.exports = {errorMessages:ErrorMessage, userError:UserRelatedErrorMessage};