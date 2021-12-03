export const initialState = {

    searchPatient: {
        fetching: false,
        error: false,
        result: [],
        currentSearchType: '',
        currentSearchString: ''
    },
    createPatient: { patientId: '' },
    patientProfile: {
        fetching: true,
        data: {},
        currentPatient: null,
        historyFilter: {}
    },
    availableFields: {
        fetching: true,
        demoFields: null,
        visitSections: null,
        visitSections_Hash: null,
        demoFields_Hash: null,
        visitFields: null,
        visitFields_Hash: null,
        VSFields: null,
        VSFields_Hash: null,
        testFields: null,
        clinicalEventTypes: null,
        clinicalEventTypes_Hash: null,
        testTypes: null,
        testTypes_Hash: null,
        drugs: null,
        drugs_Hash: null,
        interruptionReasons: null,
        interruptionReasons_Hash: null,
        allMeddra: null,
        meddra_Hash: null,
        meddra_Tree: null,
        pregnancyOutcomes: null,
        pregnancyOutcomes_Hash: null,
        diagnoses: null,
        diagnoses_Hash: null,
        relations: null,
        relations_Hash: null,
        clinicalEventFields: null,
        clinicalEventFields_Hash: null,
        medicalConditions: null,
        medicalConditions_Hash: null,
        icd11: null,
        icd11_Hash: null,
        icd11_Tree: null,
        concomitantMedsList: null,
        concomitantMedsList_hash: null,
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
                'value': 'D'
            },
            {
                'id': 7,
                'value': 'BLOB'
            }
        ],
        inputTypes_Hash: [
            {
                1: 'I',
                2: 'F',
                3: 'C',
                4: 'T',
                5: 'B',
                6: 'D',
                7: 'BLOB'
            }
        ]
    },
    login: {
        loggedIn: false,
        initialCheckingStatus: true,
        loggingIn: false,
        loginFailed: false,
        id: -1,
        username: '',
        remote_control: ''
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
    alert: {},
    edssCalc: { display: false },
    baselineVisitFrontPage: { display: false },
    followupVisitFrontPage: { display: false },
    uploadMeddra: {
        requesting: false,
        error: undefined,
        success: false
    },
    serverInfo: {
        version: ''
    },
    syncInfo: {
        config: {},
        status: {
            syncing: true
        }
    }
};

export default initialState;