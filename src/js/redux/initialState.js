export default {
    searchPatient: {
        fetching: false,
        error: false,
        result: [],
        currentSearch: ''
    },
    createPatient: { patientId: '' },
    patientProfile: {
        fetching: true,
        data: {},
        currentPatient: null
    },
    availableFields: {
        fetching: true,
        demoFields: [],
        demoFields_Hash: [],
        visitFields: [],
        visitFields_Hash: [],
        VSFields: [],
        VSFields_Hash: [],
        testFields: [],
        clinicalEventTypes: [],
        clinicalEventTypes_Hash: [],
        testTypes: [],
        testTypes_Hash: [],
        drugs: [],
        drugs_Hash: [],
        interruptionReasons: [],
        interruptionReasons_Hash: [],
        allMeddra: [],
        pregnancyOutcomes: [],
        pregnancyOutcomes_Hash: [],
        diagnoses: [],
        diagnoses_Hash: [],
        relations: [],
        relations_Hash: [],
        clinicalEventFields: [],
        clinicalEventFields_Hash: [],
        medicalConditions: [],
        medicalConditions_Hash: [],
        inputTypes: [     //'I', 'F', 'BLOB' etc
            {
                'id': 1,
                'value': 'I'
            },
            {
                'id': 2,
                'value': 'F'
            },
            {
                'id': 3,
                'value': 'C'
            },
            {
                'id': 4,
                'value': 'T'
            },
            {
                'id': 5,
                'value': 'B'
            },
            {
                'id': 6,
                'value': 'BLOB'
            }
        ]
    },
    login: {
        loggedIn: false,
        initialCheckingStatus: true,
        loggingIn: false,
        loginFailed: false,
        username: ''
    },
    meddra: {
        result: []
    },
    log: {
        fetching: true,
        error: false,
        result: []
    },
    getAllUsers: {
        fetching: true,
        error: false,
        result: []
    },
    erasePatient: {
        requesting: false,
        success: false,
        error: false
    },
    appLevelError: {},
    alert: {}
};