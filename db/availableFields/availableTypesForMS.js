const availableTypes = {
    clinicalEvents: [
        { id: 1, module: 'MS', name: 'Relapse' },
        { id: 2, module: 'MS', name: 'Infection' },
        { id: 3, module: 'MS', name: 'Opportunistic Infection' },
        { id: 4, module: 'MS', name: 'Death' },
        { id: 5, module: 'MS', name: 'Other SAE likely related to treatment or malignancies' }
    ],
    tests: [
        { id: 1, module: 'MS', name: 'Laboratory test' },
        { id: 2, module: 'MS', name: 'Evoked potential' },
        { id: 3, module: 'MS', name: 'MRI' },
        { id: 4, module: 'MS', name: 'Lumbar Puncture' }
    ],
    visits: [
        { id: 1, module: 'MS', value: 'Inpatient' },
        { id: 2, module: 'MS', value: 'Remote' }
    ]
};

module.exports = availableTypes;