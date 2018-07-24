const exampleData = {
    'PATIENTS': [
        { id: 1, aliasId: 'chon', study: 'example', createdByUser: 1, deleted: '-', consent: true },
        { id: 2, aliasId: 'florian', study: 'example', createdByUser: 1, deleted: '-', consent: true },
        { id: 3, aliasId: 'eleni', study: 'example', createdByUser: 1, deleted: '-', consent: true },
        { id: 4, aliasId: 'chonnie', study: 'example', createdByUser: 1, deleted: '-', consent: true },
        { id: 5, aliasId: 'floriana', study: 'example', createdByUser: 1, deleted: '-', consent: true },
        { id: 6, aliasId: 'eleno', study: 'example', createdByUser: 1, deleted: '-', consent: true },
        { id: 7, aliasId: 'pm', study: 'example', createdByUser: 1, deleted: '-', consent: true }
    ],
    'PATIENT_PII': [
        { id: 1, patient: 1, firstName: 'Chon', surname: 'Jones', fullAddress: 'Flat 10 Mast House London', postcode: 'SW7 1', createdByUser: 1, deleted: '-' },
        { id: 2, patient: 3, firstName: 'Eleni', surname: 'Jones', fullAddress: 'Flat 20 Mast House London', postcode: 'SW7 2', createdByUser: 1, deleted: '-' },
    ],
    'PATIENT_PREGNANCY': [
        { id: 1, patient: 3, startDate: '1531239767000', meddra: 13688, outcome: 2, createdByUser: 1, deleted: '-' },
        { id: 2, patient: 3, startDate: '1531239113000', meddra: 13688, outcome: 1, createdByUser: 1, deleted: '-' }
    ],
    'PATIENT_IMMUNISATION': [
        { id: 1, patient: 2, vaccineName: 'vaccine A', immunisationDate: '1517443200000', createdByUser: 1, deleted: '-' },
        { id: 2, patient: 3, vaccineName: 'vaccine B', immunisationDate: '1114905600000', createdByUser: 1, deleted: '1@1531239113000' },
        { id: 3, patient: 3, vaccineName: 'vaccine C', immunisationDate: '1275350400000', createdByUser: 1, deleted: '-' }
    ],
    'PATIENT_DEMOGRAPHIC': [
        { id: 1, patient: 1, DOB: '1531241613000', gender: 1, dominantHand: 2, ethnicity: 1, countryOfOrigin: 1, alcoholUsage: 1, smokingHistory: 1, createdByUser: 2, deleted: '1@1531239113000' },
        { id: 2, patient: 1, DOB: '1531241613000', gender: 1, dominantHand: 2, ethnicity: 1, countryOfOrigin: 1, alcoholUsage: 1, smokingHistory: 1, createdByUser: 2, deleted: '-' },
        { id: 3, patient: 2, DOB: '1531241643000', gender: 2, dominantHand: 2, ethnicity: 2, countryOfOrigin: 3, alcoholUsage: 1, smokingHistory: 2, createdByUser: 2, deleted: '-' },
        { id: 4, patient: 3, DOB: '1531241643000', gender: 2, dominantHand: 2, ethnicity: 2, countryOfOrigin: 4, alcoholUsage: 1, smokingHistory: 2, createdByUser: 1, deleted: '-' },
        { id: 5, patient: 4, DOB: '1531241666000', gender: 2, dominantHand: 2, ethnicity: 4, countryOfOrigin: 1, alcoholUsage: 1, smokingHistory: 3, createdByUser: 1, deleted: '-' },
        { id: 6, patient: 5, DOB: '1531241666000', gender: 4, dominantHand: 3, ethnicity: 2, countryOfOrigin: 2, alcoholUsage: 2, smokingHistory: 3, createdByUser: 1, deleted: '-' }
    ],
    'PATIENT_DIAGNOSIS': [
        { id: 1, patient: 4, diagnosis: 3, diagnosisDate: '1531241525000', createdByUser: 2, deleted: '1@1531239113000' },
        { id: 2, patient: 4, diagnosis: 3, diagnosisDate: '1531241525000', createdByUser: 2, deleted: '-' },
        { id: 3, patient: 3, diagnosis: 3, diagnosisDate: '1531241525000', createdByUser: 2, deleted: '-' }
    ],
    'VISITS': [
        { id: 1, patient: 1, visitDate: '1514764800000', type: 1, createdByUser: 1, deleted: '-' },
        { id: 2, patient: 1, visitDate: '1517443200000', type: 1, createdByUser: 1, deleted: '-' },
        { id: 3, patient: 3, visitDate: '1517875200000', type: 1, createdByUser: 2, deleted: '-' },
        { id: 4, patient: 7, visitDate: '1517875200000', type: 1, createdByUser: 2, deleted: '-' }
    ],
    'VISIT_DATA': [
        { id: 1, visit: 1, field: 1, value: 150, createdByUser: 1, deleted: '1@1531239113000' },
        { id: 2, visit: 2, field: 5, value: 60, createdByUser: 1, deleted: '-' },
        { id: 3, visit: 1, field: 6, value: 'NO', createdByUser: 1, deleted: '-' },
        { id: 4, visit: 3, field: 20, value: 'BOTH', createdByUser: 1, deleted: '-' },
        { id: 5, visit: 4, field: 18, value: 'NO', createdByUser: 1, deleted: '-' }
    ],
    'ORDERED_TESTS': [
        { id: 1, orderedDuringVisit: 1, type: 1, expectedOccurDate: '1520294400000', createdByUser: 1, deleted: '-' },
        { id: 2, orderedDuringVisit: 3, type: 1, expectedOccurDate: '1517875200000', createdByUser: 1, deleted: '-' },
        { id: 3, orderedDuringVisit: 2, type: 1, expectedOccurDate: '1517443200000', createdByUser: 1, deleted: '-' },
        { id: 4, orderedDuringVisit: 2, type: 2, expectedOccurDate: '1517443200000', createdByUser: 1, deleted: '-' },
    ],
    'TEST_DATA': [
        { id: 1, test: 1, field: 5, value: 'negative', createdByUser: 1, deleted: '-' },
        { id: 2, test: 1, field: 15, value: 'unknown', createdByUser: 1, deleted: '-' },
        { id: 3, test: 2, field: 34, value: 'positive', createdByUser: 1, deleted: '-' },
        { id: 4, test: 4, field: 66, value: true, createdByUser: 1, deleted: '-' }
    ],
    'CLINICAL_EVENTS': [
        { id: 1, patient: 1, type: 1, dateStartDate: '1514764800000', meddra: 1, createdByUser: 1, deleted: '-' },
        { id: 2, patient: 3, type: 1, dateStartDate: '1517443200000', meddra: 1, createdByUser: 1, deleted: '-' },
        { id: 3, patient: 7, type: 1, dateStartDate: '1517875200000', meddra: 2, createdByUser: 1, deleted: '-' }
    ],
    'CLINICAL_EVENTS_DATA': [
        { id: 1, clinicalEvent: 1, field: 3, value: 'YES', createdByUser: 1, deleted: '-' },
        { id: 2, clinicalEvent: 3, field: 2, value: 'UNKNOWN', createdByUser: 1, deleted: '-' },
        { id: 3, clinicalEvent: 2, field: 2, value: 'YES', createdByUser: 1, deleted: '-' },
        { id: 4, clinicalEvent: 2, field: 4, value: 'UNKNOWN', createdByUser: 1, deleted: '-' }
    ],
    'TREATMENTS': [
        { id: 1, orderedDuringVisit: 1, drug: 1, dose: 2, unit: 'cc', form: 'IV', timesPerDay: 2, durationWeeks: 1, createdByUser: 2, deleted: '-' },
        { id: 2, orderedDuringVisit: 3, drug: 4, dose: 2, unit: 'cc', form: 'IV', timesPerDay: 2, durationWeeks: 1, createdByUser: 2, deleted: '-' }
    ],
    'TREATMENTS_INTERRUPTIONS': [
        { id: 1, treatment: 1, startDate: '1484006400000', endDate: '1516406400000', reason: 2, meddra: 2, createdByUser: 1, deleted: '-' },
        { id: 2, treatment: 1, startDate: '1514764800000', meddra: 1, createdByUser: 1, deleted: '-' }
    ],
    'MEDICAL_HISTORY': [
        { id: 1, patient: 3, relation: 1, conditionName: 1, outcome: 'ongoing', createdByUser: 1, deleted: '-' },
        { id: 2, patient: 4, relation: 1, conditionName: 1, outcome: 'resolved', createdByUser: 1, deleted: '1@1531239113000' },
        { id: 3, patient: 6, relation: 3, conditionName: 3, outcome: 'unknown', createdByUser: 2, deleted: '-' }
    ]
};

module.exports = exampleData;