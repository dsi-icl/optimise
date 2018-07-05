export default {
    createPatient: { patientId: '' },
    patientProfile: {
        fetching: true, 
        data: {}
    },
    availableFields: {
        fetching: true,
        demoFields: [
            {
                'id': 1,
                'name': 'placeholder'
            }
        ],
        visitFields: [],
        testFields: [],
        clinicalEventTypes: [], 
        testTypes: [],
        drugs: [
            {
                'id': 1,
                'name': 'placeholder'
            }
        ],
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
        loggingIn: false,
        loginFailed: false,
        token: ''
    }
}