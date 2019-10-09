const ErrorMessage = {
    CREATIONFAIL: 'Couldn\'t create entry',
    DELETEFAIL: 'Couldn\'t delete entry',
    UPDATEFAIL: 'Couldn\'t update entry',
    GETFAIL: 'Couldn\'t fetch the entry',
    NOTFOUND: 'Couldn\'t find the entry',
    ERASEFAILED: 'Couldn\'t erase entry',
    SEARCHFAIL: 'Couldn\'t search the database'
};

const UserRelatedErrorMessage = {
    MISSINGARGUMENT: 'The request is missing some arguments',
    WRONGARGUMENTS: 'Wrong value in the given arguments',
    BADPASSWORD: 'The password provided doesn\'t match this account',
    BADCREDENTIALS: 'Invalid credentials',
    NORIGHTS: 'Unauthorized to do this action',
    INVALIDDATE: 'The date provided is not valid',
    WRONGPATH: 'The requested url doesn\'t exists',
    INVALIDQUERY: 'The query string should be comprised of "value" or "field"+"value"',
    NODATAAVAILABLE: 'No patient data available',
    FREQANDINTERVALMUSTCOPRESENT: '"Frequency" and "Interval Unit" must be both present or missing'
};

export default { errorMessages: ErrorMessage, userError: UserRelatedErrorMessage };