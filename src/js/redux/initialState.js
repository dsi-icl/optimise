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
                'definition': 'DOB',
                'idname': 'dob',
                'type': 'D',
                'unit': '',
                'module': '',
                'permittedValues': null
            },
            {
                'id': 2,
                'definition': 'Gender',
                'idname': 'gender',
                'type': 'C',
                'unit': '',
                'module': '',
                'permittedValues': 'male,female,other/prefer not to say'
            },
            {
                'id': 3,
                'definition': 'Dominant Hand',
                'idname': 'dominantHand',
                'type': 'C',
                'unit': '',
                'module': '',
                'permittedValues': 'left,right,ambidextrous,amputated'
            },
            {
                'id': 4,
                'definition': 'Ethnicity',
                'idname': 'ethnicity',
                'type': 'C',
                'unit': '',
                'module': '',
                'permittedValues': 'white,black,chinese,other asian,native american,arab,persian,other mixed,unknown'
            },
            {
                'id': 5,
                'definition': 'Country of Origin',
                'idname': 'coo',
                'type': 'C',
                'unit': '',
                'module': '',
                'permittedValues': 'ASIA,EUROPE,AFRICA,AMERICAS'
            },
            {
                'id': 6,
                'definition': 'Alcohol Usage',
                'idname': 'alcholusage',
                'type': 'C',
                'unit': '',
                'module': '',
                'permittedValues': 'More than 3 units a day,Less than 3 units a day,Less than 3 units a week,No alcohol consumption,unknown'
            },
            {
                'id': 7,
                'definition': 'Smoking History',
                'idname': 'smoking',
                'type': 'C',
                'unit': '',
                'module': '',
                'permittedValues': 'smoker,ex-smoker,never smoked,electronic cigarette,unknown'
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