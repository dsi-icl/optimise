export default {
    searchPatientById: {
        fetching: false,
        error: false,
        result: []
    },
    createPatient: { patientId: '' },
    patientProfile: {
        fetching: true,
        data: {}
    },
    availableFields: {
        fetching: true,
        demoFields: [],
        visitFields: [],
        VSFields: [],
        testFields: [],
        clinicalEventTypes: [],
        testTypes: [],
        drugs: [],
        diagnoses: [],
        relations: [],
        CEFields: [],
        medicalConditions: [],
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
    }
};