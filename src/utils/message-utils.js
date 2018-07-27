const ErrorMessage = {
    CREATIONFAIL: 'Could\'t create entry',
    DELETEFAIL: 'Couldn\'t delete entry',
    UPDATEFAIL: 'Couldn\'t update entry',
    GETFAIL: 'Couldn\'t find the requested entry',
    NOTFOUND: 'Requested entry not found',
    ERASEFAILED: 'Couldn\'t erase entry',
    SEEDUPDATEERROR: 'Error while updating seed file: table is empty'
};

const UserRelatedErrorMessage = {
    MISSINGARGUMENT: 'The request is missing some arguments',
    WRONGARGUMENTS: 'Wrong value in the given arguments',
    BADPASSWORD: 'The password provided doesn\'t match',
    BADCREDENTIALS: 'Invalid credentials',
    NORIGHTS: 'Unauthorized to do this action',
    INVALIDDATE: 'The date provided is not valid',
    WRONGPATH: 'The requested url doesn\'t exists',
    INVALIDQUERY: 'The query string should be comprised of "value" or "field"+"value"'
};

const DataControllerMessageRelated = {
    VISIT: 'Cannot seem to find your visit.',
    CLINICALEVENT: 'Cannot seem to find your clinical event.',
    TEST: 'Cannot seem to find your test.',
    OVERLAPERROR: 'Fields in add and update cannot have overlaps.',
    INVALIDFIELD: 'Impossible to add or update this field because the entry type is not of the same type as the field ',
    MISSINGVALUE: 'Missing arguments : Please provide at least an add or update field and an id (number) for ', //add datatype id here
    BOOLEANFIELD: 'The allowed values are 1 or 0 for the field ', //add field ID
    CHARFIELD: /* Add field ID*/ ' only accepts values ', // add permitted value
    INTEGERFIELD: 'The allowed value type is integer for the field ', //add field
    NUMBERFIELD: 'The allowed value type is number for the field ', //add field
    UNKNOWNFIELD: 'The field is linked to that data is unknown. Night be a seed error',
    FIELDNOTFOUND: 'One of the requested field(s) cannot be found. Be sure the field exists in the database first.',
    UPDATEIMPOSSIBLE: 'One of the requested update is not present in the database',
    ADDIMPOSSIBLE: 'One of the the requested add is already present in the database',
    SUCESS: 'Successfuly added asked entries.',
    ERROR: 'An error occur while creating the data. Check furthermore if the update are present and that the add aren\'t already'
};

module.exports = { errorMessages: ErrorMessage, userError: UserRelatedErrorMessage, dataMessage: DataControllerMessageRelated };