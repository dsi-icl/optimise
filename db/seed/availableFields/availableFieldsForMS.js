const availableFields = {
    demoFields: [
        {
            'id': 1,
            'definition': 'DOB',
            'idname': 'dob',
            'type': 'D',
            'unit': '',
            'module': '',
            'permitted_values': null
        },
        {
            'id': 2,
            'definition': 'Gender',
            'idname': 'gender',
            'type': 'C',
            'unit': '',
            'module': '',
            'permitted_values': 'male,female,other/prefer not to say'
        },
        {
            'id': 3,
            'definition': 'Dominant Hand',
            'idname': 'dominantHand',
            'type': 'C',
            'unit': '',
            'module': '',
            'permitted_values': 'left,right,ambidextrous,amputated'
        },
        {
            'id': 4,
            'definition': 'Ethnicity',
            'idname': 'ethnicity',
            'type': 'C',
            'unit': '',
            'module': '',
            'permitted_values': 'white,black,chinese,other asian,native american,arab,persian,other mixed,unknown'
        },
        {
            'id': 5,
            'definition': 'Country of Origin',
            'idname': 'coo',
            'type': 'C',
            'unit': '',
            'module': '',
            'permitted_values': 'ASIA,EUROPE,AFRICA,AMERICAS'
        },
        {
            'id': 6,
            'definition': 'Alcohol Usage',
            'idname': 'alcholusage',
            'type': 'C',
            'unit': '',
            'module': '',
            'permitted_values': 'More than 3 units a day,Less than 3 units a day,Less than 3 units a week,No alcohol consumption,unknown'
        },
        {
            'id': 7,
            'definition': 'Smoking History',
            'idname': 'smoking',
            'type': 'C',
            'unit': '',
            'module': '',
            'permitted_values': 'smoker,ex-smoker,never smoked,electronic cigarette,unknown'
        }
    ],
    visitFields: [
        {
            'id': 1,
            'definition': 'Systolic Blood Pressure',
            'idname': 'visit_systolic_blood_pressure',
            'type': 'N',
            'unit': 'mmHg',
            'module': '',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 2,
            'definition': 'Heart Rate',
            'idname': 'visit_heart_rate',
            'type': 'N',
            'unit': 'bpm',
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 3,
            'definition': 'Diastolic Blood Pressure',
            'idname': 'visit_diastolic_blood_pressure',
            'type': 'N',
            'unit': 'mmHg',
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 4,
            'definition': 'Height',
            'idname': 'visit_height',
            'type': 'N',
            'unit': 'cm',
            'module': null,
            'permitted_values': '> 0, int',
            'reference_type': 1
        },
        {
            'id': 5,
            'definition': 'Weight',
            'idname': 'visit_weight',
            'type': 'N',
            'unit': 'kg',
            'module': null,
            'permitted_values': '> 0, int',
            'reference_type': 1
        },
        {
            'id': 6,
            'definition': 'Academic Concerns',
            'idname': 'visit_academic_concerns',
            'type': 'N',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 7,
            'definition': 'Higher function problem: cognitive problems',
            'idname': 'Higher_function_problem:_cognitive_problems',
            'type': 'B',
            'unit': '',
            'module': null,
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 8,
            'definition': 'Higher function problem: emotional lability',
            'idname': 'Higher_function_problem:_emotional_lability',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 9,
            'definition': 'Higher function problem: depression',
            'idname': 'Higher_function_problem:_depression',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 10,
            'definition': 'Higher function problem: fatgiue',
            'idname': 'Higher_function_problem:_fatgiue',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 11,
            'definition': 'Higher function problem: seizure',
            'idname': 'Higher_function_problem:_seizure',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 12,
            'definition': 'Cranial nerves: oscillopsia',
            'idname': 'Cranial_nerves:_oscillopsia',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 13,
            'definition': 'Cranial nerves: vertigo',
            'idname': 'Cranial_nerves:_vertigo',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 14,
            'definition': 'Cranial nerves: blurred vision',
            'idname': 'Cranial_nerves:_blurred_vision',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 15,
            'definition': 'Cranial nerves: double vision',
            'idname': 'Cranial_nerves:_double_vision',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 16,
            'definition': 'Cranial nerves: uncontrolled eye movements',
            'idname': 'Cranial_nerves:_uncontrolled_eye_movements',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 17,
            'definition': 'Cranial nerves: dysphagia',
            'idname': 'Cranial_nerves:_dysphagia',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 18,
            'definition': 'Cranial nerves: facial weakness',
            'idname': 'Cranial_nerves:_facial_weakness',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 19,
            'definition': 'Cranial nerves: greying of vision in one eye',
            'idname': 'Cranial_nerves:_greying_of_vision_in_one_eye',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 20,
            'definition': 'Cranial nerves: blindness in one eye',
            'idname': 'Cranial_nerves:_blindness_in_one_eye',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 21,
            'definition': 'Cranial nerves: facial pain',
            'idname': 'Cranial_nerves:_facial_pain',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 22,
            'definition': 'Cranial nerves: field defect / scotoma',
            'idname': 'Cranial_nerves:_field_defect_/_scotoma',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 23,
            'definition': 'Cranial nerves: facial hypoesthesia',
            'idname': 'Cranial_nerves:_facial_hypoesthesia',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 24,
            'definition': 'Motor: difficult walking',
            'idname': 'Motor:_difficult_walking',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 25,
            'definition': 'Motor: weakness upper limbs',
            'idname': 'Motor:_weakness_upper_limbs',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 26,
            'definition': 'Motor: weakness lower limbs',
            'idname': 'Motor:_weakness_lower_limbs',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 27,
            'definition': 'Motor: weakness lower limbs',
            'idname': 'Motor:_weakness_lower_limbs',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 28,
            'definition': 'Somatosensory: Lhermitte\'s sign',
            'idname': 'Somatosensory:_Lhermitte\'s_sign',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 29,
            'definition': 'Somatosensory: Heat intolerance',
            'idname': 'Somatosensory:_Heat_intolerance',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 30,
            'definition': 'Somatosensory: pain',
            'idname': 'Somatosensory:_pain',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 31,
            'definition': 'Somatosensory: paresthesia',
            'idname': 'Somatosensory:_paresthesia',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 32,
            'definition': 'Somatosensory: dysesthesia',
            'idname': 'Somatosensory:_dysesthesia',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 33,
            'definition': 'Somatosensory: anesthesia',
            'idname': 'Somatosensory:_anesthesia',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 34,
            'definition': 'Somatosensory: pruritus',
            'idname': 'Somatosensory:_pruritus',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 35,
            'definition': 'Somatosensory: pain',
            'idname': 'Somatosensory:_pain',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 36,
            'definition': 'Somatosensory: paresthesia',
            'idname': 'Somatosensory:_paresthesia',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 37,
            'definition': 'Somatosensory: dysesthesia',
            'idname': 'Somatosensory:_dysesthesia',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 38,
            'definition': 'Somatosensory: anesthesia',
            'idname': 'Somatosensory:_anesthesia',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 39,
            'definition': 'Somatosensory: pruritus',
            'idname': 'Somatosensory:_pruritus',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 40,
            'definition': 'autonomic: bladder urgency',
            'idname': 'autonomic:_bladder_urgency',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 41,
            'definition': 'autonomic: bladder frequency',
            'idname': 'autonomic:_bladder_frequency',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 42,
            'definition': 'autonomic: bladder incontinence',
            'idname': 'autonomic:_bladder_incontinence',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 43,
            'definition': 'autonomic: bladder hesitancy',
            'idname': 'autonomic:_bladder_hesitancy',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 44,
            'definition': 'autonomic: constipation',
            'idname': 'autonomic:_constipation',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 45,
            'definition': 'autonomic: bowel incontinence',
            'idname': 'autonomic:_bowel_incontinence',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 46,
            'definition': 'autonomic: problems with sexual function',
            'idname': 'autonomic:_problems_with_sexual_function',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 47,
            'definition': 'Higher function problem: information processing speed',
            'idname': 'Higher_function_problem:_information_processing_speed',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 48,
            'definition': 'Higher function problem: executive functions',
            'idname': 'Higher_function_problem:_executive_functions',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 49,
            'definition': 'Higher function problem: memory',
            'idname': 'Higher_function_problem:_memory',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 50,
            'definition': 'Higher function problem: verbal fluency',
            'idname': 'Higher_function_problem:_verbal_fluency',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 51,
            'definition': 'Higher function problem: seizure',
            'idname': 'Higher_function_problem:_seizure',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 52,
            'definition': 'Cranial nerves: nystagmus',
            'idname': 'Cranial_nerves:_nystagmus',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 53,
            'definition': 'Cranial nerves: red desaturation',
            'idname': 'Cranial_nerves:_red_desaturation',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 54,
            'definition': 'Cranial nerves: sixth nerve palsy',
            'idname': 'Cranial_nerves:_sixth_nerve_palsy',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 55,
            'definition': 'Cranial nerves: third nerve palsy',
            'idname': 'Cranial_nerves:_third_nerve_palsy',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 56,
            'definition': 'Cranial nerves: trigeminal neuralgia',
            'idname': 'Cranial_nerves:_trigeminal_neuralgia',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 57,
            'definition': 'Cranial nerves: trigeninal palsy',
            'idname': 'Cranial_nerves:_trigeninal_palsy',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 58,
            'definition': 'Cranial nerves: fourth nerve palsy',
            'idname': 'Cranial_nerves:_fourth_nerve_palsy',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 59,
            'definition': 'Cranial nerves: facial hypoesthesia',
            'idname': 'Cranial_nerves:_facial_hypoesthesia',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 60,
            'definition': 'Cranial nerves: hearing loss',
            'idname': 'Cranial_nerves:_hearing_loss',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 61,
            'definition': 'Motor: tremor postural upper limbs',
            'idname': 'Motor:_tremor_postural_upper_limbs',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 62,
            'definition': 'Motor: tremor intention upper limbs',
            'idname': 'Motor:_tremor_intention_upper_limbs',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 63,
            'definition': 'Motor: spasticity upper limbs',
            'idname': 'Motor:_spasticity_upper_limbs',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 64,
            'definition': 'Motor: spasticity lower limbs',
            'idname': 'Motor:_spasticity_lower_limbs',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 65,
            'definition': 'Motor: tendon reflexes: hyperreflexia: biceps right',
            'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_biceps_right',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '3,4',
            'reference_type': 1
        },
        {
            'id': 66,
            'definition': 'Motor: tendon reflexes: hyperreflexia: biceps left',
            'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_biceps_left',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '3,4',
            'reference_type': 1
        },
        {
            'id': 67,
            'definition': 'Motor: tendon reflexes: hyperreflexia: patella right',
            'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_patella_right',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '3,4',
            'reference_type': 1
        },
        {
            'id': 68,
            'definition': 'Motor: tendon reflexes: hyperreflexia: patella left',
            'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_patella_left',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '3,4',
            'reference_type': 1
        },
        {
            'id': 69,
            'definition': 'Motor: tendon reflexes: hyperreflexia: ankle right',
            'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_ankle_right',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '3,4',
            'reference_type': 1
        },
        {
            'id': 70,
            'definition': 'Motor: tendon reflexes: hyperreflexia: ankle left',
            'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_ankle_left',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '3,4',
            'reference_type': 1
        },
        {
            'id': 71,
            'definition': 'Motor: tendon reflexes: hyporeflexia: biceps right',
            'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_biceps_right',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '1,2',
            'reference_type': 1
        },
        {
            'id': 72,
            'definition': 'Motor: tendon reflexes: hyporeflexia: biceps left',
            'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_biceps_left',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '1,2',
            'reference_type': 1
        },
        {
            'id': 73,
            'definition': 'Motor: tendon reflexes: hyporeflexia: patella right',
            'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_patella_right',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '1,2',
            'reference_type': 1
        },
        {
            'id': 74,
            'definition': 'Motor: tendon reflexes: hyporeflexia: patella left',
            'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_patella_left',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '1,2',
            'reference_type': 1
        },
        {
            'id': 75,
            'definition': 'Motor: tendon reflexes: hyporeflexia: ankle right',
            'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_ankle_right',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '1,2',
            'reference_type': 1
        },
        {
            'id': 76,
            'definition': 'Motor: tendon reflexes: hyporeflexia: ankle left',
            'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_ankle_left',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '1,2',
            'reference_type': 1
        },
        {
            'id': 77,
            'definition': 'Motor: tendon reflexes: plantar response right',
            'idname': 'Motor:_tendon_reflexes:_plantar_response_right',
            'type': 'C',
            'unit': null,
            'module': 'MS',
            'permitted_values': 'NORMAL, ABNORMAL',
            'reference_type': 1
        },
        {
            'id': 78,
            'definition': 'Motor: tendon reflexes: plantar response left',
            'idname': 'Motor:_tendon_reflexes:_plantar_response_left',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'NORMAL, ABNORMAL',
            'reference_type': 1
        },
        {
            'id': 79,
            'definition': 'Cerebellar: Ataxia upper limb',
            'idname': 'Cerebellar:_Ataxia_upper_limb',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 80,
            'definition': 'Cerebellar: Ataxia lower limb',
            'idname': 'Cerebellar:_Ataxia_lower_limb',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 81,
            'definition': 'Cerebellar: Ataxia trunk',
            'idname': 'Cerebellar:_Ataxia_trunk',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LEFT, RIGHT, BOTH',
            'reference_type': 1
        },
        {
            'id': 82,
            'definition': 'Mobility: problem',
            'idname': 'Mobility:_problem',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': 'LIMITED AMBULATION, WHEELCHAIR BOUND, BEDRIDDEN',
            'reference_type': 1
        },
        {
            'id': 83,
            'definition': 'Mobility: using walking aid',
            'idname': 'Mobility:_using_walking_aid',
            'type': 'B',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 84,
            'definition': 'Expanded Disability Status Scale',
            'idname': 'Expanded_Disability_Status_Scale',
            'type': 'N',
            'unit': null,
            'module': null,
            'permitted_values': '0-10',
            'reference_type': 1
        },
        {
            'id': 85,
            'definition': 'EDMUS',
            'idname': 'EDMUS',
            'type': 'C',
            'unit': null,
            'module': null,
            'permitted_values': '0,1,2,3,4,5,6A,6B,7,8,9,10',
            'reference_type': 1
        },
        {
            'id': 86,
            'definition': '25 feet walk test first try',
            'idname': '25_feet_walk_test_first_try',
            'type': 'N',
            'unit': 'sec',
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 87,
            'definition': '25 feet walk test second try',
            'idname': '25_feet_walk_test_second_try',
            'type': 'N',
            'unit': 'sec',
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 88,
            'definition': 'Nine hole peg test: left: first try',
            'idname': 'Nine_hole_peg_test:_left:_first_try',
            'type': 'N',
            'unit': 'sec',
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 89,
            'definition': 'Nine hole peg test: left: second try',
            'idname': 'Nine_hole_peg_test:_left:_second_try',
            'type': 'N',
            'unit': 'sec',
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 90,
            'definition': 'Nine hole peg test: right: first try',
            'idname': 'Nine_hole_peg_test:_right:_first_try',
            'type': 'N',
            'unit': 'sec',
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 91,
            'definition': 'Nine hole peg test: right: second try',
            'idname': 'Nine_hole_peg_test:_right:_second_try',
            'type': 'N',
            'unit': 'sec',
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 92,
            'definition': 'Low contrast letter acuity: left ',
            'idname': 'Low_contrast_letter_acuity:_left_',
            'type': 'N',
            'unit': '/20',
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 93,
            'definition': 'Low contrast letter acuity: right',
            'idname': 'Low_contrast_letter_acuity:_right',
            'type': 'N',
            'unit': '/20',
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        },
        {
            'id': 94,
            'definition': 'symbol digit modality test',
            'idname': 'symbol_digit_modality_test',
            'type': 'N',
            'unit': null,
            'module': null,
            'permitted_values': null,
            'reference_type': 1
        }
    ],
    testFields: [
        {
            'id': 1,
            'definition': 'ANA',
            'idname': 'ANA',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 2,
            'definition': 'ANCA',
            'idname': 'ANCA',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 3,
            'definition': 'Anti-cardiolipin',
            'idname': 'Anti-cardiolipin',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 4,
            'definition': 'Anti-DNA',
            'idname': 'Anti-DNA',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 5,
            'definition': 'Anti-HCV antibody',
            'idname': 'Anti-HCV_antibody',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 6,
            'definition': 'Anti-HIV antibody',
            'idname': 'Anti-HIV_antibody',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 7,
            'definition': 'Anti-LKM',
            'idname': 'Anti-LKM',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 8,
            'definition': 'Anti-mitochondrial',
            'idname': 'Anti-mitochondrial',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 9,
            'definition': 'Anti-parietal cell antibodies',
            'idname': 'Anti-parietal_cell_antibodies',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 10,
            'definition': 'Anti-Ro',
            'idname': 'Anti-Ro',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 11,
            'definition': 'Anti-smooth muscle',
            'idname': 'Anti-smooth_muscle',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 12,
            'definition': 'anti-transglutaminase',
            'idname': 'anti-transglutaminase',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 13,
            'definition': 'anti-varicella',
            'idname': 'anti-varicella',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 14,
            'definition': 'AQP4',
            'idname': 'AQP4',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 15,
            'definition': 'GlyR',
            'idname': 'GlyR',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 16,
            'definition': 'HBV surface antigen',
            'idname': 'HBV_surface_antigen',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 17,
            'definition': 'hepatitis A',
            'idname': 'hepatitis_A',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 18,
            'definition': 'hepatitis B',
            'idname': 'hepatitis_B',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 19,
            'definition': 'hepatitis C',
            'idname': 'hepatitis_C',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 20,
            'definition': 'Jo1',
            'idname': 'Jo1',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 21,
            'definition': 'LA',
            'idname': 'LA',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 22,
            'definition': 'LUPUS anti-coagulant',
            'idname': 'LUPUS_anti-coagulant',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 23,
            'definition': 'MOG',
            'idname': 'MOG',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 24,
            'definition': 'Neutralising Anti-IFN antibody',
            'idname': 'Neutralising_Anti-IFN_antibody',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 25,
            'definition': 'Neutralising Anti-natalizumab antibody',
            'idname': 'Neutralising_Anti-natalizumab_antibody',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 26,
            'definition': 'NMDAR',
            'idname': 'NMDAR',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 27,
            'definition': 'NMO IgG',
            'idname': 'NMO_IgG',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 28,
            'definition': 'Plasma anti-JC virus',
            'idname': 'Plasma_anti-JC_virus',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 29,
            'definition': 'RNP',
            'idname': 'RNP',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 30,
            'definition': 'Scl70',
            'idname': 'Scl70',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 31,
            'definition': 'SM',
            'idname': 'SM',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 32,
            'definition': 'ANA: Flagged',
            'idname': 'ANA:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 33,
            'definition': 'ANCA: Flagged',
            'idname': 'ANCA:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 34,
            'definition': 'Anti-cardiolipin: Flagged',
            'idname': 'Anti-cardiolipin:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 35,
            'definition': 'Anti-DNA: Flagged',
            'idname': 'Anti-DNA:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 36,
            'definition': 'Anti-HCV antibody: Flagged',
            'idname': 'Anti-HCV_antibody:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 37,
            'definition': 'Anti-HIV antibody: Flagged',
            'idname': 'Anti-HIV_antibody:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 38,
            'definition': 'Anti-LKM: Flagged',
            'idname': 'Anti-LKM:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 39,
            'definition': 'Anti-mitochondrial: Flagged',
            'idname': 'Anti-mitochondrial:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 40,
            'definition': 'Anti-parietal cell antibodies: Flagged',
            'idname': 'Anti-parietal_cell_antibodies:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 41,
            'definition': 'Anti-Ro: Flagged',
            'idname': 'Anti-Ro:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 42,
            'definition': 'Anti-smooth muscle: Flagged',
            'idname': 'Anti-smooth_muscle:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 43,
            'definition': 'anti-transglutaminase: Flagged',
            'idname': 'anti-transglutaminase:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 44,
            'definition': 'anti-varicella: Flagged',
            'idname': 'anti-varicella:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 45,
            'definition': 'AQP4: Flagged',
            'idname': 'AQP4:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 46,
            'definition': 'GlyR: Flagged',
            'idname': 'GlyR:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 47,
            'definition': 'HBV surface antigen: Flagged',
            'idname': 'HBV_surface_antigen:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 48,
            'definition': 'hepatitis A: Flagged',
            'idname': 'hepatitis_A:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 49,
            'definition': 'hepatitis B: Flagged',
            'idname': 'hepatitis_B:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 50,
            'definition': 'hepatitis C: Flagged',
            'idname': 'hepatitis_C:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 51,
            'definition': 'Jo1: Flagged',
            'idname': 'Jo1:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 52,
            'definition': 'LA: Flagged',
            'idname': 'LA:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 53,
            'definition': 'LUPUS anti-coagulant: Flagged',
            'idname': 'LUPUS_anti-coagulant:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 54,
            'definition': 'MOG: Flagged',
            'idname': 'MOG:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 55,
            'definition': 'Neutralising Anti-IFN antibody: Flagged',
            'idname': 'Neutralising_Anti-IFN_antibody:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 56,
            'definition': 'Neutralising Anti-natalizumab antibody: Flagged',
            'idname': 'Neutralising_Anti-natalizumab_antibody:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 57,
            'definition': 'NMDAR: Flagged',
            'idname': 'NMDAR:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 58,
            'definition': 'NMO IgG: Flagged',
            'idname': 'NMO_IgG:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 59,
            'definition': 'Plasma anti-JC virus: Flagged',
            'idname': 'Plasma_anti-JC_virus:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 60,
            'definition': 'RNP: Flagged',
            'idname': 'RNP:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 61,
            'definition': 'Scl70: Flagged',
            'idname': 'Scl70:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 62,
            'definition': 'SM: Flagged',
            'idname': 'SM:_Flagged',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 1
        },
        {
            'id': 63,
            'definition': 'P100 Left: Abnormal',
            'idname': 'P100_Left:_Abnormal',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 2
        },
        {
            'id': 64,
            'definition': 'P100 Left: amplitude',
            'idname': 'P100_Left:_amplitude',
            'type': 'I',
            'unit': 'uV',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 2
        },
        {
            'id': 65,
            'definition': 'P100 Left: P100 latency',
            'idname': 'P100_Left:_P100_latency',
            'type': 'I',
            'unit': 'msec',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 2
        },
        {
            'id': 66,
            'definition': 'P100 right: Abnormal',
            'idname': 'P100_right:_Abnormal',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 2
        },
        {
            'id': 67,
            'definition': 'P100 right: amplitude',
            'idname': 'P100_right:_amplitude',
            'type': 'I',
            'unit': 'uV',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 2
        },
        {
            'id': 68,
            'definition': 'P100 right: P100 latency',
            'idname': 'P100_right:_P100_latency',
            'type': 'I',
            'unit': 'msec',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 2
        },
        {
            'id': 69,
            'definition': 'SEP left: upper extremity: abnormal',
            'idname': 'SEP_left:_upper_extremity:_abnormal',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 2
        },
        {
            'id': 70,
            'definition': 'SEP left: lower extremity: abnormal',
            'idname': 'SEP_left:_lower_extremity:_abnormal',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 2
        },
        {
            'id': 71,
            'definition': 'SEP right: upper extremity: abnormal',
            'idname': 'SEP_right:_upper_extremity:_abnormal',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 2
        },
        {
            'id': 72,
            'definition': 'SEP right: lower extremity: abnormal',
            'idname': 'SEP_right:_lower_extremity:_abnormal',
            'type': 'B',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 2
        },
        {
            'id': 73,
            'definition': 'Session Name',
            'idname': 'Session_Name',
            'type': 'T',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 3
        },
        {
            'id': 74,
            'definition': 'scans',
            'idname': 'scans',
            'type': 'BLOB',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 3
        },
        {
            'id': 75,
            'definition': 'scan type',
            'idname': 'scan_type',
            'type': 'C',
            'unit': '',
            'module': 'MS',
            'permitted_values': 'T1, T2',
            'reference_type': 3
        },
        {
            'id': 76,
            'definition': 'Morphology: region',
            'idname': 'Morphology:_region',
            'type': 'C',
            'unit': '',
            'module': 'MS',
            'permitted_values': 'BRAIN, SPINE',
            'reference_type': 3
        },
        {
            'id': 77,
            'definition': 'Morphology: T1 hypointense lesions',
            'idname': 'Morphology:_T1_hypointense_lesions',
            'type': 'C',
            'unit': '',
            'module': 'MS',
            'permitted_values': 'NEGATIVE,  POSITIVE, NOT REPORTED',
            'reference_type': 3
        },
        {
            'id': 78,
            'definition': 'Morphology: T2 hypointense lesions count',
            'idname': 'Morphology:_T2_hypointense_lesions_count',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 3
        },
        {
            'id': 79,
            'definition': 'Morphology: T2 hypointense lesions volume',
            'idname': 'Morphology:_T2_hypointense_lesions_volume',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 3
        },
        {
            'id': 80,
            'definition': 'Morphology: Gd enhancing lesions',
            'idname': 'Morphology:_Gd_enhancing_lesions',
            'type': 'C',
            'unit': '',
            'module': 'MS',
            'permitted_values': 'NONE, SINGLE, MULTIPLE, UNKNOWN',
            'reference_type': 3
        },
        {
            'id': 81,
            'definition': 'Morphology: Gd enhancing lesions volume',
            'idname': 'Morphology:_Gd_enhancing_lesions_volume',
            'type': 'N',
            'unit': '',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 3
        },
        {
            'id': 82,
            'definition': 'Summary',
            'idname': 'Summary',
            'type': 'C',
            'unit': '',
            'module': 'MS',
            'permitted_values': 'NORMAL, TRAUMATIC, ABNORMAL MS-TYPICAL, ABNORMAL MS-ATYPICAL',
            'reference_type': 4
        },
        {
            'id': 83,
            'definition': 'Total-protein',
            'idname': 'Total-protein',
            'type': 'N',
            'unit': 'mg/L',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 4
        },
        {
            'id': 84,
            'definition': 'Glucose',
            'idname': 'Glucose',
            'type': 'N',
            'unit': 'mg/L',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 4
        },
        {
            'id': 85,
            'definition': 'Q Albumin',
            'idname': 'Q_Albumin',
            'type': 'N',
            'unit': 'mg/L',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 4
        },
        {
            'id': 86,
            'definition': 'IgG',
            'idname': 'IgG',
            'type': 'N',
            'unit': 'mg/L',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 4
        },
        {
            'id': 87,
            'definition': 'Albumin',
            'idname': 'Albumin',
            'type': 'N',
            'unit': 'mg/L',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 4
        },
        {
            'id': 88,
            'definition': 'IgG index',
            'idname': 'IgG_index',
            'type': 'N',
            'unit': 'mg/L',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 4
        },
        {
            'id': 89,
            'definition': 'WCC',
            'idname': 'WCC',
            'type': 'N',
            'unit': 'mg/L',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 4
        },
        {
            'id': 90,
            'definition': 'Lymphocytes',
            'idname': 'Lymphocytes',
            'type': 'N',
            'unit': 'mg/L',
            'module': 'MS',
            'permitted_values': '',
            'reference_type': 4
        },
        {
            'id': 91,
            'definition': 'Oligoclonal Bands in CSF',
            'idname': 'Oligoclonal_Bands_in_CSF',
            'type': 'C',
            'unit': '',
            'module': 'MS',
            'permitted_values': 'TEST NOT DONE, NOT DETECTED,  DETECTED',
            'reference_type': 4
        }
    ],
    clinicalEvents: [
        {
            'id': 1,
            'name': 'Relapses'
        }
    ],
    testTypes: [
        {
            'id': 1,
            'name': 'Laboratory test'
        },
        {
            'id': 2,
            'name': 'Evoked potential'
        },
        {
            'id': 3,
            'name': 'MRI'
        },
        {
            'id': 4,
            'name': 'Lumbar Puncture'
        }
    ]
};

module.exports = availableFields;