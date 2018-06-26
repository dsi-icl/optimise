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
        { id: 6, patient: 5, DOB: '1/1/2001', gender: 4, dominantHand: 3, ethnicity: 2, countryOfOrigin: 2, alcoholUsage: 2, smokingHistory: 3, createdByUser: 1, deleted: '-' },
        { id: 7, patient: 6, DOB: '1/1/2001', gender: 2, dominantHand: 2, ethnicity: 2, countryOfOrigin: 20, alcoholUsage: 1, smokingHistory: 2, createdByUser: 2, deleted: '-' },
    ],
    'VISITS': [
        { id: 1, patient: 1, visitDate: '1/1/2031', type: 1, createdByUser: 1, deleted: '-' },
        { id: 2, patient: 1, visitDate: '1/2/2031', type: 1, createdByUser: 1, deleted: '-' },
        { id: 3, patient: 3, visitDate: '1/1/1931', type: 1, createdByUser: 2, deleted: '-' },
    ],
    'ORDERED_TESTS': [
        { id: 1, orderedDuringVisit: 1, type: 1, expectedOccurDate: '1/2/3921', createdByUser: 1, deleted: '-' },
        { id: 2, orderedDuringVisit: 3, type: 1, expectedOccurDate: '1/1/3921', createdByUser: 1, deleted: '-' },
        { id: 3, orderedDuringVisit: 2, type: 1, expectedOccurDate: '1/4/3921', createdByUser: 1, deleted: '-' },
    ],
    'TREATMENTS': [
        { id: 1, orderedDuringVisit: 1, drug: 1, dose: 2, unit: 'cc', form: 'IV', timesPerDay: 2, durationWeeks: 1, createdByUser: 2, deleted: '-' }
    ]
};

module.exports = exampleData;