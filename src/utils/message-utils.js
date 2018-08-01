const ErrorMessage = {
    CREATIONFAIL: 'Couldn\'t create entry',
    DELETEFAIL: 'Couldn\'t delete entry',
    UPDATEFAIL: 'Couldn\'t update entry',
    GETFAIL: 'Couldn\'t fetch the entry',
    NOTFOUND: 'Couldn\'t find the entry',
    ERASEFAILED: 'Couldn\'t erase entry',
    SEEDUPDATEERROR: 'Errored while updating seed file: table is empty'
};

// Array because of mement.invalidAt()
const DateError = [
    'The given year is invalid',
    'The given month is invalid',
    'The given day is invalid',
    'The given hours is invalid',
    'The given minutes is invalid',
    'The given seconds is invalid',
    'The given miliseconds is invalid'
];

const DateErrorIndex = {
    YEAR: 0,
    MONTH: 1,
    DAY: 2,
    HOURS: 3,
    MINUTES: 4,
    SECONDS: 5,
    MILISECONDS: 6
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
    FREQANDINTERVALMUSTCOPRESENT: '"Frequency" and "Interval Unit" must be both present or missing',
    NOPATIENTDATA: 'There is no patient data in the database to export'
};

const DataControllerMessageRelated = {
    VISIT: 'Couldn\'t  find your visit',
    CLINICALEVENT: 'Couldn\'t find your clinical event',
    TEST: 'Couldn\'t find your test',
    OVERLAPERROR: 'Fields in "add" and "update" cannot have overlap',
    INVALIDFIELD: 'Impossible to add or update this field because the provided type is not of the same type as the field ',
    MISSINGVALUE: 'Missing arguments : Please provide at least "add" or "update" field and an id (number) for ', //add datatype id here
    BOOLEANFIELD: 'Value can only be 1 or 0 for the field ', //add field ID
    CHARFIELD: /* Add field ID*/ ' only accepts values ', // add permitted value
    INTEGERFIELD: 'Value type is "integer" for the field ', //add field
    NUMBERFIELD: 'Value type is "number" for the field ', //add field
    UNKNOWNFIELD: 'The field linked to this data is unknown',
    FIELDNOTFOUND: 'One or more of the requested field(s) cannot be found',
    UPDATEIMPOSSIBLE: 'One of the requested "update" cannot be performed',
    ADDIMPOSSIBLE: 'One of the the requested "add" cannot be performed',
    SUCESS: 'Successfuly added entries.',
    ERROR: 'An error occured while creating the entry'
};

module.exports = { errorMessages: ErrorMessage, userError: UserRelatedErrorMessage, dataMessage: DataControllerMessageRelated, dateError: DateError, dateErrorIndex: DateErrorIndex };