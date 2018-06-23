const exampleData = {
    patients: [
        { id: 1, aliasId: 'chon', study: 'example', createdByUser: 1 },
        { id: 2, aliasId: 'florian', study: 'example', createdByUser: 1 },
        { id: 3, aliasId: 'eleni', study: 'example', createdByUser: 1 },
        { id: 4, aliasId: 'chonnie', study: 'example', createdByUser: 1 },
        { id: 5, aliasId: 'floriana', study: 'example', createdByUser: 1 },
        { id: 6, aliasId: 'eleno', study: 'example', createdByUser: 1 },
    ],
    patientDemographic: [
        { id: 1, patient: 1, DOB: '1/1/2018', gender: 1, dominantHand: 2, ethnicity: 1, alcoholUsage: 1, smokingHistory: 1, createdByUser: 2, deleted: '1@xxxxxxxx' },
        { id: 2, patient: 1, DOB: '1/1/2018', gender: 1, dominantHand: 2, ethnicity: 1, alcoholUsage: 1, smokingHistory: 1, createdByUser: 2 },
        { id: 3, patient: 2, DOB: '1/1/2001', gender: 2, dominantHand: 2, ethnicity: 2, alcoholUsage: 1, smokingHistory: 2, createdByUser: 2 },
        { id: 4, patient: 3, DOB: '1/1/2001', gender: 2, dominantHand: 2, ethnicity: 2, alcoholUsage: 1, smokingHistory: 2, createdByUser: 1 },
        { id: 5, patient: 4, DOB: '1/1/2011', gender: 2, dominantHand: 2, ethnicity: 4, alcoholUsage: 1, smokingHistory: 3, createdByUser: 1 },
        { id: 6, patient: 5, DOB: '1/1/2001', gender: 4, dominantHand: 3, ethnicity: 2, alcoholUsage: 2, smokingHistory: 3, createdByUser: 1 },
        { id: 7, patient: 6, DOB: '1/1/2001', gender: 2, dominantHand: 2, ethnicity: 2, alcoholUsage: 1, smokingHistory: 2, createdByUser: 2 },
    ]
};

module.exports = exampleData;