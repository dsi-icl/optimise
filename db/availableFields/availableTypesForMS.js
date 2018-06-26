const availableTypes = {
    clinicalEvents: [
        { id: 1, name: 'Relapse' },
        { id: 2, name: 'Infection' },
        { id: 3, name: 'OpportunisticInfection' }
    ],
    tests: [
        { id: 1, name: 'Laboratory test' },
        { id: 2, name: 'Evoked potential' },
        { id: 3, name: 'MRI' },
        { id: 4, name: 'Lumbar Puncture' }
    ],
    visits: [
        { id: 1, value: 'In-patient' }
    ]
};

module.exports = availableTypes;