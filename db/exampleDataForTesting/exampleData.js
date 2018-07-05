const exampleData = {
    'PATIENTS': [
        { id: 1, aliasId: 'chon', study: 'example', createdByUser: 1, deleted: '-' },
        { id: 2, aliasId: 'florian', study: 'example', createdByUser: 1, deleted: '-' },
        { id: 3, aliasId: 'eleni', study: 'example', createdByUser: 1, deleted: '-' },
        { id: 4, aliasId: 'chonnie', study: 'example', createdByUser: 1, deleted: '-' },
        { id: 5, aliasId: 'floriana', study: 'example', createdByUser: 1, deleted: '-' },
        { id: 6, aliasId: 'eleno', study: 'example', createdByUser: 1, deleted: '-' },
        { id: 7, aliasId: 'pm', study: 'example', createdByUser: 1, deleted: '-' }
    ],
    'PATIENT_DEMOGRAPHIC': [
        { id: 1, patient: 1, DOB: '1/1/2018', gender: 1, dominantHand: 2, ethnicity: 1, countryOfOrigin: 1, alcoholUsage: 1, smokingHistory: 1, createdByUser: 2, deleted: '1@xxxxxxxx' },
        { id: 2, patient: 1, DOB: '1/1/2018', gender: 1, dominantHand: 2, ethnicity: 1, countryOfOrigin: 1, alcoholUsage: 1, smokingHistory: 1, createdByUser: 2, deleted: '-' },
        { id: 3, patient: 2, DOB: '1/1/2001', gender: 2, dominantHand: 2, ethnicity: 2, countryOfOrigin: 3, alcoholUsage: 1, smokingHistory: 2, createdByUser: 2, deleted: '-' },
        { id: 4, patient: 3, DOB: '1/1/2001', gender: 2, dominantHand: 2, ethnicity: 2, countryOfOrigin: 4, alcoholUsage: 1, smokingHistory: 2, createdByUser: 1, deleted: '-' },
        { id: 5, patient: 4, DOB: '1/1/2011', gender: 2, dominantHand: 2, ethnicity: 4, countryOfOrigin: 1, alcoholUsage: 1, smokingHistory: 3, createdByUser: 1, deleted: '-' },
        { id: 6, patient: 5, DOB: '1/1/2001', gender: 4, dominantHand: 3, ethnicity: 2, countryOfOrigin: 2, alcoholUsage: 2, smokingHistory: 3, createdByUser: 1, deleted: '-' }
    ],
    'VISITS': [
        { id: 1, patient: 1, visitDate: '1/1/2031', type: 1, createdByUser: 1, deleted: '-' },
        { id: 2, patient: 1, visitDate: '1/2/2031', type: 1, createdByUser: 1, deleted: '-' },
        { id: 3, patient: 3, visitDate: '1/1/1931', type: 1, createdByUser: 2, deleted: '-' },
        { id: 4, patient: 7, visitDate: '1/1/1930', type: 1, createdByUser: 2, deleted: '-' }
    ],
    'VISIT_DATA': [
        { id: 1, visit: 1, field: 1, value: 150, createdByUser: 1, deleted: '1@xxxxxxxx' },
        { id: 2, visit: 2, field: 5, value: 60, createdByUser: 1, deleted: '-' },
        { id: 3, visit: 1, field: 6, value: 'NO', createdByUser: 2, deleted: '-' },
        { id: 4, visit: 3, field: 20, value: 'BOTH', createdByUser: 1, deleted: '-' },
        { id: 5, visit: 4, field: 18, value: 'NO', createdByUser: 1, deleted: '-' }
    ],
    'ORDERED_TESTS': [
        { id: 1, orderedDuringVisit: 1, type: 1, expectedOccurDate: '1/2/2031', createdByUser: 1, deleted: '-' },
        { id: 2, orderedDuringVisit: 3, type: 1, expectedOccurDate: '1/1/1932', createdByUser: 1, deleted: '-' },
        { id: 3, orderedDuringVisit: 2, type: 1, expectedOccurDate: '1/4/2031', createdByUser: 1, deleted: '-' }
    ],
    'TEST_DATA': [
        { id: 1, test: 1, field: 5, value: 'negative', createdByUser: 1, deleted: '-' },
        { id: 2, test: 1, field: 15, value: 'unknown', createdByUser: 1, deleted: '-' },
        { id: 3, test: 2, field: 34, value: 'positive', createdByUser: 1, deleted: '-' }
    ],
    'CLINICAL_EVENTS': [
        { id: 1, patient: 1, type: 1, dateStartDate: '1/4/919', createdByUser: 1, deleted: '-' },
        { id: 2, patient: 3, type: 1, dateStartDate: '1/4/921', createdByUser: 1, deleted: '-' },
        { id: 3, patient: 7, type: 1, dateStartDate: '1/4/39', createdByUser: 1, deleted: '-' }
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
        { id: 1, treatment: 1, startDate: '10/01/2017', endDate: '20/01/2018', reason: 2, createdByUser: 1, deleted: '-' },
        { id: 2, treatment: 1, startDate: '10/1/2019', createdByUser: 1, deleted: '-' }
    ],
    'MEDICAL_HISTORY': [
        { id: 1, patient: 3, relation: 1, conditionName: 1, outcome: 'ongoing', createdByUser: 1, deleted: '-' },
        { id: 2, patient: 4, relation: 1, conditionName: 1, outcome: 'resolved', createdByUser: 1, deleted: '1@xxxxxxxx' }
    ],
    'PATIENT_IMMUNISATION': [
        { id: 1, patient: 2, vaccineName: 'vaccine A', immunisationDate: '1/2/2018', createdByUser: 1, deleted: '-' },
        { id: 2, patient: 3, vaccineName: 'vaccine B', immunisationDate: '1/5/2005', createdByUser: 1, deleted: '1@xxxxxxxx' },
        { id: 3, patient: 3, vaccineName: 'vaccine C', immunisationDate: '1/6/2010', createdByUser: 1, deleted: '-' }
    ]
};

module.exports = exampleData;