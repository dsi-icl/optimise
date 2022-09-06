export const examplePregnancyData = [
    {
        id: 1,
        meddra: null,
        outcome: null,
        outcomeDate: null,
        patient: 22,
        startDate: '1612871504797.0',
        deleted: '-',
        dataEntries: [
            {
                id: 1,
                pregnancyId: 1,
                date: '1612881504797.0',
                deleted: '-',
                dataType: 'baseline',
                LMP: '1612881504797.0',
                maternalAgeAtLMP: 24,
                EDD: '1612881504797.0',
                ART: 'None',
                numOfFoetuses: 1,
                folicAcidSuppUsed: 'yes',
                folicAcidSuppUsedStartDate: '1612881504797.0',
                illicitDrugUse: 'no',
                imaging: [
                    {
                        id: 1,
                        pregnancyDataId: 1,
                        date: '1612881504797.0',
                        deleted: '-',
                        mode: 'unknown',
                        result: 'good'
                    },
                    {
                        id: 2,
                        pregnancyDataId: 1,
                        date: '1612891503797.0',
                        deleted: '-',
                        mode: 'unknown',
                        result: 'good'
                    }
                ]
            },
            {
                id: 2,
                pregnancyId: 1,
                date: '1612991504797.0',
                deleted: '-',
                dataType: 'followup',
                EDD: '1612881504797.0',
                numOfFoetuses: 1,
                folicAcidSuppUsed: 'yes',
                folicAcidSuppUsedStartDate: '1612881504797.0',
                illicitDrugUse: 'no',
                imaging: [
                    {
                        id: 3,
                        pregnancyDataId: 2,
                        date: '1612881504797.0',
                        deleted: '-',
                        mode: 'unknown',
                        result: 'good'
                    }
                ]
            },
            {
                id: 3,
                pregnancyId: 1,
                date: '1613993504797.0',
                deleted: '-',
                dataType: 'term',
                inductionOfDelivery: 'yes',
                lengthOfPregnancy: 40,
                pregnancyOutcome: 'healthy',
                congenitalAbnormality: 'none',
                modeOfDelivery: 'caesaraen',
                useOfEpidural: 'no',
                birthWeight: 30,
                sexOfBaby: 'male',
                APGAR0: 5,
                APGAR5: 10,
                everBreastFed: 'yes',
                breastfeedStart: '1613993504797.0',
                exclusiveBreastfeedEnd: '1613993504797.0',
                mixedBreastfeedEnd: '1613993504797.0',
                admission12: 'yes',
                admission36: 'no',
                admission60: 'no',
                developmentalOutcome: 'good',
            }
        ]
    },
    {
        id: 2,
        meddra: null,
        outcome: null,
        outcomeDate: null,
        patient: 22,
        startDate: '16128715024797.0',
        deleted: '-',
        dataEntries: [
            {
                id: 4,
                pregnancyId: 2,
                date: '1612881504797.0',
                deleted: '-',
                dataType: 'baseline',
                LMP: '1612881504797.0',
                maternalAgeAtLMP: 24,
                EDD: '1612881504797.0',
                ART: 'None',
                numOfFoetuses: 1,
                folicAcidSuppUsed: 'yes',
                folicAcidSuppUsedStartDate: '1612881504797.0',
                illicitDrugUse: 'no',
                imaging: [
                    {
                        id: 4,
                        pregnancyDataId: 4,
                        date: '1612881504797.0',
                        deleted: '-',
                        mode: 'unknown',
                        result: 'good'
                    },
                    {
                        id: 5,
                        pregnancyDataId: 4,
                        date: '1612891503797.0',
                        deleted: '-',
                        mode: 'unknown',
                        result: 'good'
                    }
                ]
            },
            {
                id: 5,
                pregnancyId: 2,
                date: '1612991504797.0',
                deleted: '-',
                dataType: 'followup',
                EDD: '1612881504797.0',
                numOfFoetuses: 1,
                folicAcidSuppUsed: 'yes',
                folicAcidSuppUsedStartDate: '1612881504797.0',
                illicitDrugUse: 'no',
                imaging: [
                    {
                        id: 6,
                        pregnancyDataId: 5,
                        date: '1612881504797.0',
                        deleted: '-',
                        mode: 'unknown',
                        result: 'good'
                    }
                ]
            }
        ]
    }
];

export function addEntryToPregnancy(pregnancyId) {
    const template = {
        id: Math.random() * 5,
        pregnancyId: 1,
        date: '1612881504797.0',
        deleted: '-',
        dataType: 'followup',
        LMP: '1612881504797.0',
        maternalAgeAtLMP: 24,
        EDD: '1612881504797.0',
        ART: 'None',
        numOfFoetuses: 1,
        folicAcidSuppUsed: 'yes',
        folicAcidSuppUsedStartDate: '1612881504797.0',
        illicitDrugUse: 'no',
        imaging: []
    };
    for (let i = 0 ; i < examplePregnancyData.length; i++) {
        const each = examplePregnancyData[i];
        if (each.id === pregnancyId) {
            examplePregnancyData[i].dataEntries.push(template);
        }
    }
}

export function addPregnancy() {

}
