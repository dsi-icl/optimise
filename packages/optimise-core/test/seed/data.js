export default [
    [
        'USERS',
        [
            { id: 1, uuid: 'e86bdbe5-2aac-4ee3-a7fc-0c173b84ad0e', username: 'admin', realname: 'Administrator', email: 'e86bdbe5@optimise.local', pw: 'F+3ALY62PE1KbtDIWOH6ltD+x7u5eB7WVFxdCVLr5zCxhfJOBkYNS2vjDkhFz5u3Gs2aMx4DPKjJlRgfEl+S8A==', salt: '/Xf2ge3dL49Yjtf5QO8fMaNtkfA4wiKwjwLJAHG2Ozs=', iterations: 652, adminPriv: 1, createdByUser: 1 },
            { id: 2, uuid: '0f2d5565-0b0c-4f87-808a-7ace8756ef53', username: 'user', realname: 'User', email: '0f2d5565@optimise.local', pw: 'IpzYpIbldcTLNv+i2gnEZOw2ADVQeip/AfKVa8rQ0SyxHCpKRtWZW30Z7JDWWDj7SnDV2OwN8k7PLyB23vq1rQ==', salt: '3aG1PLR7PHN6G34dQ6sh9jfjsyGVx5v62JnDViSssnI=', iterations: 31387, adminPriv: 0, createdByUser: 1 }
        ]
    ],
    [
        'PATIENTS',
        [
            { id: 1, uuid: '1ac8d4fd-1120-4373-980a-29525e2f16c2', aliasId: 'chon', study: 'example', createdByUser: 2, deleted: '-', consent: true },
            { id: 2, uuid: '41a731d0-e3a3-44b9-8bee-5a9c0b806ba8', aliasId: 'florian', study: 'example', createdByUser: 1, deleted: '-', consent: true },
            { id: 3, uuid: 'b91e2cba-45cf-4f02-8363-b260072bf18f', aliasId: 'eleni', study: 'example', createdByUser: 1, deleted: '-', consent: true },
            { id: 4, uuid: 'bb4d6f9e-084f-43fb-9b88-32c207493196', aliasId: 'chonnie', study: 'example', createdByUser: 1, deleted: '-', consent: true },
            { id: 5, uuid: 'eb96b323-96ef-4ae8-a815-85fced965aea', aliasId: 'floriana', study: 'example', createdByUser: 1, deleted: '-', consent: false },
            { id: 6, uuid: '77d30cac-fbd6-4d41-ad88-4782243ea5c4', aliasId: 'eleno', study: 'example', createdByUser: 1, deleted: '-', consent: true },
            { id: 7, uuid: '9f7aff64-91ac-4457-8f2e-256515f83668', aliasId: 'pm', study: 'example', createdByUser: 1, deleted: '-', consent: true }
        ]
    ],
    [
        'PATIENT_PII',
        [
            { id: 1, patient: 1, firstName: 'Chon', surname: 'Jones', fullAddress: 'Flat 10 Mast House London', postcode: 'SW7 1', createdByUser: 1, deleted: '-' },
            { id: 2, patient: 3, firstName: 'Eleni', surname: 'Jones', fullAddress: 'Flat 20 Mast House London', postcode: 'SW7 2', createdByUser: 1, deleted: '-' },
        ]
    ],
    [
        'PATIENT_PREGNANCY',
        [
            { id: 1, patient: 3, startDate: '1531239767000', outcome: 2, createdByUser: 1, deleted: '-' },
            { id: 2, patient: 3, startDate: '1531239113000', outcome: 1, createdByUser: 1, deleted: '-' }
            // { id: 1, patient: 3, startDate: '1531239767000', meddra: 13688, outcome: 2, createdByUser: 1, deleted: '-' },
            // { id: 2, patient: 3, startDate: '1531239113000', meddra: 13688, outcome: 1, createdByUser: 1, deleted: '-' }
        ]
    ],
    [
        'PATIENT_IMMUNISATION',
        [
            { id: 1, patient: 2, vaccineName: 'vaccine A', immunisationDate: '1517443200000', createdByUser: 1, deleted: '-' },
            { id: 2, patient: 3, vaccineName: 'vaccine B', immunisationDate: '1114905600000', createdByUser: 1, deleted: '1@1531239113000' },
            { id: 3, patient: 3, vaccineName: 'vaccine C', immunisationDate: '1275350400000', createdByUser: 1, deleted: '-' }
        ]
    ],
    [
        'PATIENT_DEMOGRAPHIC',
        [
            { id: 1, patient: 1, DOB: '1531241613000', gender: 1, dominantHand: 2, ethnicity: 1, countryOfOrigin: 1, createdByUser: 2, deleted: '1@1531239113000' },
            { id: 2, patient: 1, DOB: '1531241613000', gender: 1, dominantHand: 2, ethnicity: 1, countryOfOrigin: 1, createdByUser: 2, deleted: '-' },
            { id: 3, patient: 2, DOB: '1531241643000', gender: 2, dominantHand: 2, ethnicity: 2, countryOfOrigin: 3, createdByUser: 2, deleted: '-' },
            { id: 4, patient: 3, DOB: '1531241643000', gender: 2, dominantHand: 2, ethnicity: 2, countryOfOrigin: 4, createdByUser: 1, deleted: '-' },
            { id: 5, patient: 4, DOB: '1531241666000', gender: 2, dominantHand: 2, ethnicity: 4, countryOfOrigin: 1, createdByUser: 1, deleted: '-' },
            { id: 6, patient: 5, DOB: '1531241666000', gender: 4, dominantHand: 3, ethnicity: 2, countryOfOrigin: 2, createdByUser: 1, deleted: '-' }
        ]
    ],
    [
        'PATIENT_DIAGNOSIS',
        [
            { id: 1, patient: 4, diagnosis: 1, diagnosisDate: '1531241525000', createdByUser: 2, deleted: '1@1531239113000' },
            { id: 2, patient: 4, diagnosis: 3, diagnosisDate: '1531241525000', createdByUser: 2, deleted: '-' },
            { id: 3, patient: 3, diagnosis: 3, diagnosisDate: '1531241525000', createdByUser: 2, deleted: '-' },
            { id: 4, patient: 2, diagnosis: 2, diagnosisDate: '1531241535000', createdByUser: 2, deleted: '-' },
            { id: 5, patient: 1, diagnosis: 6, diagnosisDate: '1533241525000', createdByUser: 2, deleted: '-' },
            { id: 6, patient: 2, diagnosis: 6, diagnosisDate: '1534241525000', createdByUser: 2, deleted: '-' }
        ]
    ],
    [
        'VISITS',
        [
            { id: 1, patient: 1, visitDate: '1514764800000', type: 1, createdByUser: 1, deleted: '-' },
            { id: 2, patient: 1, visitDate: '1517443200000', type: 1, createdByUser: 1, deleted: '-' },
            { id: 3, patient: 3, visitDate: '1517875200000', type: 1, createdByUser: 2, deleted: '-' },
            { id: 4, patient: 7, visitDate: '1517875200000', type: 1, createdByUser: 2, deleted: '-' }
        ]
    ],
    [
        'VISIT_REPORT',
        [
            { id: 1, visit: 1, report: 'Report test', createdByUser: 1, deleted: '-' }
        ]
    ],
    [
        'VISIT_DATA',
        [
            { id: 1, visit: 1, field: 1, value: 150, createdByUser: 1, deleted: '1@1531239113000' },
            { id: 2, visit: 2, field: 5, value: 60, createdByUser: 1, deleted: '-' },
            { id: 3, visit: 1, field: 18, value: 'NO', createdByUser: 1, deleted: '-' },
            { id: 4, visit: 3, field: 20, value: 'BOTH', createdByUser: 1, deleted: '-' },
            { id: 5, visit: 4, field: 18, value: 'NO', createdByUser: 1, deleted: '-' }
        ]
    ],
    [
        'ORDERED_TESTS',
        [
            { id: 1, orderedDuringVisit: 1, type: 1, expectedOccurDate: '1520294400000', createdByUser: 1, deleted: '-' },
            { id: 2, orderedDuringVisit: 3, type: 2, expectedOccurDate: '1517875200000', createdByUser: 1, deleted: '-' },
            { id: 3, orderedDuringVisit: 2, type: 1, expectedOccurDate: '1517443200000', createdByUser: 1, deleted: '-' },
            { id: 4, orderedDuringVisit: 2, type: 2, expectedOccurDate: '1517443200000', createdByUser: 1, deleted: '-' },
        ]
    ],
    [
        'TEST_DATA',
        [
            { id: 1, test: 1, field: 5, value: 100, createdByUser: 1, deleted: '-' },
            { id: 2, test: 1, field: 15, value: 150, createdByUser: 1, deleted: '-' },
            { id: 3, test: 2, field: 34, value: 10, createdByUser: 1, deleted: '-' },
            { id: 4, test: 4, field: 60, value: 0, createdByUser: 1, deleted: '-' }
        ]
    ],
    [
        'CLINICAL_EVENTS',
        [
            { id: 1, patient: 1, type: 1, dateStartDate: '1514764800000', createdByUser: 1, deleted: '-' },
            { id: 2, patient: 3, type: 1, dateStartDate: '1517443200000', createdByUser: 1, deleted: '-' },
            { id: 3, patient: 7, type: 1, dateStartDate: '1517875200000', createdByUser: 1, deleted: '-' },
            { id: 4, patient: 2, type: 3, dateStartDate: '1517875200000', createdByUser: 1, deleted: '-' },
            { id: 5, patient: 2, type: 2, dateStartDate: '1517776200000', createdByUser: 1, deleted: '-' }
            // { id: 1, patient: 1, type: 1, dateStartDate: '1514764800000', meddra: 1, createdByUser: 1, deleted: '-' },
            // { id: 2, patient: 3, type: 1, dateStartDate: '1517443200000', meddra: 1, createdByUser: 1, deleted: '-' },
            // { id: 3, patient: 7, type: 1, dateStartDate: '1517875200000', meddra: 2, createdByUser: 1, deleted: '-' },
            // { id: 4, patient: 2, type: 3, dateStartDate: '1517875200000', meddra: 2, createdByUser: 1, deleted: '-' },
            // { id: 5, patient: 2, type: 2, dateStartDate: '1517776200000', meddra: 2, createdByUser: 1, deleted: '-' }
        ]
    ],
    [
        'CLINICAL_EVENTS_DATA',
        [
            { id: 1, clinicalEvent: 1, field: 3, value: 'Yes', createdByUser: 1, deleted: '-' },
            { id: 2, clinicalEvent: 3, field: 2, value: 'unselected', createdByUser: 1, deleted: '-' },
            { id: 3, clinicalEvent: 2, field: 2, value: 'Yes', createdByUser: 1, deleted: '-' },
            { id: 4, clinicalEvent: 2, field: 4, value: 'unselected', createdByUser: 1, deleted: '-' },
            { id: 5, clinicalEvent: 2, field: 9, value: 'Moderate', createdByUser: 1, deleted: '-' },
            { id: 6, clinicalEvent: 1, field: 9, value: 'Severe', createdByUser: 1, deleted: '-' },
            { id: 7, clinicalEvent: 4, field: 19, value: 'PML', createdByUser: 1, deleted: '-' }
        ]
    ],
    [
        'TREATMENTS',
        [
            { id: 1, startDate: '1514768800000', orderedDuringVisit: 1, drug: 1, dose: 2, unit: 'cc', form: 'IV', times: 1, intervalUnit: 'year', createdByUser: 2, deleted: '-' },
            { id: 2, startDate: '1514428800000', orderedDuringVisit: 3, drug: 4, dose: 2, unit: 'cc', form: 'IV', times: 2, intervalUnit: 'day', createdByUser: 2, deleted: '-' }
        ]
    ],
    [
        'TREATMENTS_INTERRUPTIONS',
        [
            { id: 1, treatment: 1, startDate: '1484006400000', endDate: '1516406400000', reason: 2, createdByUser: 1, deleted: '-' },
            { id: 2, treatment: 1, startDate: '1514764800000', createdByUser: 1, deleted: '-' }
            // { id: 1, treatment: 1, startDate: '1484006400000', endDate: '1516406400000', reason: 2, meddra: 2, createdByUser: 1, deleted: '-' },
            // { id: 2, treatment: 1, startDate: '1514764800000', meddra: 1, createdByUser: 1, deleted: '-' }
        ]
    ],
    [
        'MEDICAL_HISTORY',
        [
            { id: 1, patient: 3, relation: 1, conditionName: 1, outcome: 'ongoing', createdByUser: 1, deleted: '-' },
            { id: 2, patient: 4, relation: 1, conditionName: 1, outcome: 'resolved', createdByUser: 1, deleted: '1@1531239113000' },
            { id: 3, patient: 6, relation: 3, conditionName: 3, outcome: 'unknown', createdByUser: 2, deleted: '-' }
        ]
    ]
];