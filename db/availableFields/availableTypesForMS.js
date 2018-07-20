const availableTypes = {
    clinicalEvents: [
        { id: 1, name: 'Relapse' },
        { id: 2, name: 'Infection' },
        { id: 3, name: 'Opportunistic Infection' },
        { id: 4, name: 'Death' },
        { id: 5, name: 'Other SAE likely related to treatment and malignancies' }
    ],
    tests: [
        { id: 1, name: 'Laboratory test' },
        { id: 2, name: 'Evoked potential' },
        { id: 3, name: 'MRI' },
        { id: 4, name: 'Lumbar Puncture' }
    ],
    visits: [
        { id: 1, name: 'In-patient' },
        { id: 2, name: 'Remote' }
    ]
};

module.exports = availableTypes;