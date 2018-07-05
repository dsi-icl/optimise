//import {Map} from 'immutable';

export default {
    createPatient: { patientId: '' },
    patientProfile: {
        fetching: false, 
        data: {
            'patientId': 'chons',
            'demographicData': {
                'DOB': '14/7/1994',
                'gender': 'male',
                'dominant_hand': 'left',
                'ethnicity': 'chinese',
                'country_of_origin': 'macau',
                'alcohol_usage': 'More than 3 units a day',
                'smoking_history': 'unknown'
            },
            'immunisations': [
                {
                    'vaccine_name': 'BCG',
                    'immunisation_date': '14/7/1997'
                }
            ],
            'medicalHistory': [
                {
                    'relation': 'self',
                    'condition_name': 'MS',
                    'start_date': '1/6/1025',
                    'outcome': 'resolved',
                    'resolved_year': 1954
                },
                {
                    'relation': 'self',
                    'condition_name': 'Pneumonia',
                    'start_date': '2015',
                    'outcome': 'resolved',
                    'resolved_year': 2016
                },
                {
                    'relation': 'self',
                    'condition_name': 'Pneumonia',
                    'start_date': '2014',
                    'outcome': 'unknown',
                    'resolved_year': null
                }
            ],
            'visits': [
                {
                    'visitId': 10,
                    'visitDate': '4/7/2000',
                    'data': []
                },
                {
                    'visitId': 1,
                    'visitDate': '4/7/2010',
                    'data': []
                },
                {
                    'visitId': 2,
                    'visitDate': '4/1/2010',
                    'data': []
                },
                {
                    'visitId': 3,
                    'visitDate': '4/6/2010',
                    'data': []
                }
            ],
            'tests': [
                {
                    'testId': 1,
                    'ordered_during_visit': 10,
                    'type': 2,
                    'expected_occur_date': '5/6/1',
                    'data': [
                        {
                            'field': 64,
                            'value': '13'
                        },
                        {
                            'field': 65,
                            'value': '12'
                        },
                        {   'field': 86,
                            'value' : '123' },
                        {
                            'field': 91,
                            'value' : 'TEST NOT DONE'
                        }
                    ]
                }
            ],
            'treatments': [
                {
                    'id': 1,
                    'ordered_during_visit': 1,
                    'drug': '2',
                    'dose': 2,
                    'unit': 'cc',
                    'form': 'oral',
                    'times_per_day': 2,
                    'duration_weeks': 4,
                    'terminated_date': null,
                    'terminated_reason': null,
                    'interruptions': [
                        {
                            'reason': 'pregnancy',
                            'start_date': 'dsafsaf',
                            'end_date': 'dsafsdf'
                        },
                        {
                            'reason': 'pregnancy',
                            'start_date': 'fdsaf',
                            'end_date': 'dsaf'
                        },
                        {
                            'reason': 'pregnancy',
                            'start_date': 't45325',
                            'end_date': '432532'
                        }
                    ]
                },
                {
                    'id': 2,
                    'ordered_during_visit': 1,
                    'drug': '1',
                    'dose': 2,
                    'unit': 'cc',
                    'form': 'oral',
                    'times_per_day': 2,
                    'duration_weeks': 7,
                    'terminated_date': null,
                    'terminated_reason': null,
                    'interruptions': []
                },
                {
                    'id': 3,
                    'ordered_during_visit': 10,
                    'drug': '1',
                    'dose': 2,
                    'unit': 'cc',
                    'form': 'oral',
                    'times_per_day': 3,
                    'duration_weeks': 3,
                    'terminated_date': null,
                    'terminated_reason': null,
                    'interruptions': []
                }
            ],
            'clinicalEvents': [
                {
                    'id': 3,
                    'recorded_during_visit': 10,
                    'type': 1,
                    'date_start_date': '4/7/2100',
                    'end_date': null,
                    'data': []
                }
            ]
        }
    },
    availableFields: {
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
                'type': 2,
                'unit': 'mmHg',
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 2,
                'definition': 'Heart Rate',
                'idname': 'visit_heart_rate',
                'type': 2,
                'unit': 'bpm',
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 3,
                'definition': 'Diastolic Blood Pressure',
                'idname': 'visit_diastolic_blood_pressure',
                'type': 2,
                'unit': 'mmHg',
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 4,
                'definition': 'Height',
                'idname': 'visit_height',
                'type': 2,
                'unit': 'cm',
                'module': null,
                'permittedValues': '> 0, int',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 5,
                'definition': 'Weight',
                'idname': 'visit_weight',
                'type': 2,
                'unit': 'kg',
                'module': null,
                'permittedValues': '> 0, int',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 6,
                'definition': 'Academic Concerns',
                'idname': 'visit_academic_concerns',
                'type': 2,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 7,
                'definition': 'Higher function problem: cognitive problems',
                'idname': 'Higher_function_problem:_cognitive_problems',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 8,
                'definition': 'Higher function problem: emotional lability',
                'idname': 'Higher_function_problem:_emotional_lability',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 9,
                'definition': 'Higher function problem: depression',
                'idname': 'Higher_function_problem:_depression',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 10,
                'definition': 'Higher function problem: fatigue',
                'idname': 'Higher_function_problem:_fatigue',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 11,
                'definition': 'Higher function problem: seizure',
                'idname': 'Higher_function_problem:_seizure',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 12,
                'definition': 'Cranial nerves: oscillopsia',
                'idname': 'Cranial_nerves:_oscillopsia',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 13,
                'definition': 'Cranial nerves: vertigo',
                'idname': 'Cranial_nerves:_vertigo',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 14,
                'definition': 'Cranial nerves: blurred vision',
                'idname': 'Cranial_nerves:_blurred_vision',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 15,
                'definition': 'Cranial nerves: double vision',
                'idname': 'Cranial_nerves:_double_vision',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 16,
                'definition': 'Cranial nerves: uncontrolled eye movements',
                'idname': 'Cranial_nerves:_uncontrolled_eye_movements',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 17,
                'definition': 'Cranial nerves: dysphagia',
                'idname': 'Cranial_nerves:_dysphagia',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 18,
                'definition': 'Cranial nerves: facial weakness',
                'idname': 'Cranial_nerves:_facial_weakness',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 19,
                'definition': 'Cranial nerves: greying of vision in one eye',
                'idname': 'Cranial_nerves:_greying_of_vision_in_one_eye',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 20,
                'definition': 'Cranial nerves: blindness in one eye',
                'idname': 'Cranial_nerves:_blindness_in_one_eye',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 21,
                'definition': 'Cranial nerves: facial pain',
                'idname': 'Cranial_nerves:_facial_pain',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 22,
                'definition': 'Cranial nerves: field defect / scotoma',
                'idname': 'Cranial_nerves:_field_defect_/_scotoma',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 23,
                'definition': 'Cranial nerves: facial hypoesthesia',
                'idname': 'Cranial_nerves:_facial_hypoesthesia',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 24,
                'definition': 'Motor: difficulty walking',
                'idname': 'Motor:_difficulty_walking',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 25,
                'definition': 'Motor: weakness upper limbs',
                'idname': 'Motor:_weakness_upper_limbs',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 26,
                'definition': 'Motor: weakness lower limbs',
                'idname': 'Motor:_weakness_lower_limbs',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 27,
                'definition': 'Motor: weakness lower limbs',
                'idname': 'Motor:_weakness_lower_limbs',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 28,
                'definition': 'Somatosensory: Lhermitte\'s sign',
                'idname': 'Somatosensory:_Lhermitte\'s_sign',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 29,
                'definition': 'Somatosensory: Heat intolerance',
                'idname': 'Somatosensory:_Heat_intolerance',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 30,
                'definition': 'Somatosensory: pain',
                'idname': 'Somatosensory:_pain',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 31,
                'definition': 'Somatosensory: paresthesia',
                'idname': 'Somatosensory:_paresthesia',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 32,
                'definition': 'Somatosensory: dysesthesia',
                'idname': 'Somatosensory:_dysesthesia',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 33,
                'definition': 'Somatosensory: anesthesia',
                'idname': 'Somatosensory:_anesthesia',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 34,
                'definition': 'Somatosensory: pruritus',
                'idname': 'Somatosensory:_pruritus',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 35,
                'definition': 'Somatosensory: pain',
                'idname': 'Somatosensory:_pain',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 36,
                'definition': 'Somatosensory: paresthesia',
                'idname': 'Somatosensory:_paresthesia',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 37,
                'definition': 'Somatosensory: dysesthesia',
                'idname': 'Somatosensory:_dysesthesia',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 38,
                'definition': 'Somatosensory: anesthesia',
                'idname': 'Somatosensory:_anesthesia',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 39,
                'definition': 'Somatosensory: pruritus',
                'idname': 'Somatosensory:_pruritus',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 40,
                'definition': 'Autonomic: bladder urgency',
                'idname': 'Autonomic:_bladder_urgency',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 41,
                'definition': 'Autonomic: bladder frequency',
                'idname': 'Autonomic:_bladder_frequency',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 42,
                'definition': 'Autonomic: bladder incontinence',
                'idname': 'Autonomic:_bladder_incontinence',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 43,
                'definition': 'Autonomic: bladder hesitancy',
                'idname': 'Autonomic:_bladder_hesitancy',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 44,
                'definition': 'Autonomic: constipation',
                'idname': 'Autonomic:_constipation',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 45,
                'definition': 'Autonomic: bowel incontinence',
                'idname': 'Autonomic:_bowel_incontinence',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 46,
                'definition': 'Autonomic: problems with sexual function',
                'idname': 'Autonomic:_problems_with_sexual_function',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 47,
                'definition': 'Higher function problem: information processing speed',
                'idname': 'Higher_function_problem:_information_processing_speed',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 48,
                'definition': 'Higher function problem: executive functions',
                'idname': 'Higher_function_problem:_executive_functions',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 49,
                'definition': 'Higher function problem: memory',
                'idname': 'Higher_function_problem:_memory',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 50,
                'definition': 'Higher function problem: verbal fluency',
                'idname': 'Higher_function_problem:_verbal_fluency',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 51,
                'definition': 'Higher function problem: seizure',
                'idname': 'Higher_function_problem:_seizure',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 52,
                'definition': 'Cranial nerves: nystagmus',
                'idname': 'Cranial_nerves:_nystagmus',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': 'YES,NO,UNKNOWN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 53,
                'definition': 'Cranial nerves: red desaturation',
                'idname': 'Cranial_nerves:_red_desaturation',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 54,
                'definition': 'Cranial nerves: sixth nerve palsy',
                'idname': 'Cranial_nerves:_sixth_nerve_palsy',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 55,
                'definition': 'Cranial nerves: third nerve palsy',
                'idname': 'Cranial_nerves:_third_nerve_palsy',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 56,
                'definition': 'Cranial nerves: trigeminal neuralgia',
                'idname': 'Cranial_nerves:_trigeminal_neuralgia',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 57,
                'definition': 'Cranial nerves: trigeninal palsy',
                'idname': 'Cranial_nerves:_trigeninal_palsy',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 58,
                'definition': 'Cranial nerves: fourth nerve palsy',
                'idname': 'Cranial_nerves:_fourth_nerve_palsy',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 59,
                'definition': 'Cranial nerves: facial hypoesthesia',
                'idname': 'Cranial_nerves:_facial_hypoesthesia',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 60,
                'definition': 'Cranial nerves: hearing loss',
                'idname': 'Cranial_nerves:_hearing_loss',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 61,
                'definition': 'Motor: tremor postural upper limbs',
                'idname': 'Motor:_tremor_postural_upper_limbs',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 62,
                'definition': 'Motor: tremor intention upper limbs',
                'idname': 'Motor:_tremor_intention_upper_limbs',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 63,
                'definition': 'Motor: spasticity upper limbs',
                'idname': 'Motor:_spasticity_upper_limbs',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 64,
                'definition': 'Motor: spasticity lower limbs',
                'idname': 'Motor:_spasticity_lower_limbs',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 65,
                'definition': 'Motor: tendon reflexes: hyperreflexia: biceps right',
                'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_biceps_right',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '3,4',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 66,
                'definition': 'Motor: tendon reflexes: hyperreflexia: biceps left',
                'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_biceps_left',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '3,4',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 67,
                'definition': 'Motor: tendon reflexes: hyperreflexia: patella right',
                'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_patella_right',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '3,4',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 68,
                'definition': 'Motor: tendon reflexes: hyperreflexia: patella left',
                'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_patella_left',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '3,4',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 69,
                'definition': 'Motor: tendon reflexes: hyperreflexia: ankle right',
                'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_ankle_right',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '3,4',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 70,
                'definition': 'Motor: tendon reflexes: hyperreflexia: ankle left',
                'idname': 'Motor:_tendon_reflexes:_hyperreflexia:_ankle_left',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '3,4',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 71,
                'definition': 'Motor: tendon reflexes: hyporeflexia: biceps right',
                'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_biceps_right',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '1,2',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 72,
                'definition': 'Motor: tendon reflexes: hyporeflexia: biceps left',
                'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_biceps_left',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '1,2',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 73,
                'definition': 'Motor: tendon reflexes: hyporeflexia: patella right',
                'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_patella_right',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '1,2',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 74,
                'definition': 'Motor: tendon reflexes: hyporeflexia: patella left',
                'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_patella_left',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '1,2',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 75,
                'definition': 'Motor: tendon reflexes: hyporeflexia: ankle right',
                'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_ankle_right',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '1,2',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 76,
                'definition': 'Motor: tendon reflexes: hyporeflexia: ankle left',
                'idname': 'Motor:_tendon_reflexes:_hyporeflexia:_ankle_left',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '1,2',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 77,
                'definition': 'Motor: tendon reflexes: plantar response right',
                'idname': 'Motor:_tendon_reflexes:_plantar_response_right',
                'type': 3,
                'unit': null,
                'module': 'MS',
                'permittedValues': 'NORMAL, ABNORMAL',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 78,
                'definition': 'Motor: tendon reflexes: plantar response left',
                'idname': 'Motor:_tendon_reflexes:_plantar_response_left',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'NORMAL, ABNORMAL',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 79,
                'definition': 'Cerebellar: Ataxia upper limb',
                'idname': 'Cerebellar:_Ataxia_upper_limb',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 80,
                'definition': 'Cerebellar: Ataxia lower limb',
                'idname': 'Cerebellar:_Ataxia_lower_limb',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 81,
                'definition': 'Cerebellar: Ataxia trunk',
                'idname': 'Cerebellar:_Ataxia_trunk',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LEFT,RIGHT,BOTH',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 82,
                'definition': 'Mobility: problem',
                'idname': 'Mobility:_problem',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': 'LIMITED AMBULATION, WHEELCHAIR BOUND, BEDRIDDEN',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 83,
                'definition': 'Mobility: using walking aid',
                'idname': 'Mobility:_using_walking_aid',
                'type': 5,
                'unit': null,
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 84,
                'definition': 'Expanded Disability Status Scale',
                'idname': 'Expanded_Disability_Status_Scale',
                'type': 2,
                'unit': null,
                'module': null,
                'permittedValues': '0-10',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 85,
                'definition': 'EDMUS',
                'idname': 'EDMUS',
                'type': 3,
                'unit': null,
                'module': null,
                'permittedValues': '0,1,2,3,4,5,6A,6B,7,8,9,10',
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 86,
                'definition': '25 feet walk test first try',
                'idname': '25_feet_walk_test_first_try',
                'type': 2,
                'unit': 'sec',
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 87,
                'definition': '25 feet walk test second try',
                'idname': '25_feet_walk_test_second_try',
                'type': 2,
                'unit': 'sec',
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 88,
                'definition': 'Nine hole peg test: left: first try',
                'idname': 'Nine_hole_peg_test:_left:_first_try',
                'type': 2,
                'unit': 'sec',
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 89,
                'definition': 'Nine hole peg test: left: second try',
                'idname': 'Nine_hole_peg_test:_left:_second_try',
                'type': 2,
                'unit': 'sec',
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 90,
                'definition': 'Nine hole peg test: right: first try',
                'idname': 'Nine_hole_peg_test:_right:_first_try',
                'type': 2,
                'unit': 'sec',
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 91,
                'definition': 'Nine hole peg test: right: second try',
                'idname': 'Nine_hole_peg_test:_right:_second_try',
                'type': 2,
                'unit': 'sec',
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 92,
                'definition': 'Low contrast letter acuity: left ',
                'idname': 'Low_contrast_letter_acuity:_left_',
                'type': 2,
                'unit': '/20',
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 93,
                'definition': 'Low contrast letter acuity: right',
                'idname': 'Low_contrast_letter_acuity:_right',
                'type': 2,
                'unit': '/20',
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 94,
                'definition': 'symbol digit modality test',
                'idname': 'symbol_digit_modality_test',
                'type': 2,
                'unit': null,
                'module': null,
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            }
        ],
        testFields: [
            {
                'id': 1,
                'definition': 'ANA',
                'idname': 'ANA',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 2,
                'definition': 'ANCA',
                'idname': 'ANCA',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 3,
                'definition': 'Anti-cardiolipin',
                'idname': 'Anti-cardiolipin',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 4,
                'definition': 'Anti-DNA',
                'idname': 'Anti-DNA',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 5,
                'definition': 'Anti-HCV antibody',
                'idname': 'Anti-HCV_antibody',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 6,
                'definition': 'Anti-HIV antibody',
                'idname': 'Anti-HIV_antibody',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 7,
                'definition': 'Anti-LKM',
                'idname': 'Anti-LKM',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 8,
                'definition': 'Anti-mitochondrial',
                'idname': 'Anti-mitochondrial',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 9,
                'definition': 'Anti-parietal cell antibodies',
                'idname': 'Anti-parietal_cell_antibodies',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 10,
                'definition': 'Anti-Ro',
                'idname': 'Anti-Ro',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 11,
                'definition': 'Anti-smooth muscle',
                'idname': 'Anti-smooth_muscle',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 12,
                'definition': 'anti-transglutaminase',
                'idname': 'anti-transglutaminase',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 13,
                'definition': 'anti-varicella',
                'idname': 'anti-varicella',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 14,
                'definition': 'AQP4',
                'idname': 'AQP4',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 15,
                'definition': 'GlyR',
                'idname': 'GlyR',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 16,
                'definition': 'HBV surface antigen',
                'idname': 'HBV_surface_antigen',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 17,
                'definition': 'hepatitis A',
                'idname': 'hepatitis_A',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 18,
                'definition': 'hepatitis B',
                'idname': 'hepatitis_B',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 19,
                'definition': 'hepatitis C',
                'idname': 'hepatitis_C',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 20,
                'definition': 'Jo1',
                'idname': 'Jo1',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 21,
                'definition': 'LA',
                'idname': 'LA',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 22,
                'definition': 'LUPUS anti-coagulant',
                'idname': 'LUPUS_anti-coagulant',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 23,
                'definition': 'MOG',
                'idname': 'MOG',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 24,
                'definition': 'Neutralising Anti-IFN antibody',
                'idname': 'Neutralising_Anti-IFN_antibody',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 25,
                'definition': 'Neutralising Anti-natalizumab antibody',
                'idname': 'Neutralising_Anti-natalizumab_antibody',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 26,
                'definition': 'NMDAR',
                'idname': 'NMDAR',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 27,
                'definition': 'NMO IgG',
                'idname': 'NMO_IgG',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 28,
                'definition': 'Plasma anti-JC virus',
                'idname': 'Plasma_anti-JC_virus',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 29,
                'definition': 'RNP',
                'idname': 'RNP',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 30,
                'definition': 'Scl70',
                'idname': 'Scl70',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 31,
                'definition': 'SM',
                'idname': 'SM',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 32,
                'definition': 'ANA: Flagged',
                'idname': 'ANA:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 33,
                'definition': 'ANCA: Flagged',
                'idname': 'ANCA:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 34,
                'definition': 'Anti-cardiolipin: Flagged',
                'idname': 'Anti-cardiolipin:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 35,
                'definition': 'Anti-DNA: Flagged',
                'idname': 'Anti-DNA:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 36,
                'definition': 'Anti-HCV antibody: Flagged',
                'idname': 'Anti-HCV_antibody:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 37,
                'definition': 'Anti-HIV antibody: Flagged',
                'idname': 'Anti-HIV_antibody:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 38,
                'definition': 'Anti-LKM: Flagged',
                'idname': 'Anti-LKM:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 39,
                'definition': 'Anti-mitochondrial: Flagged',
                'idname': 'Anti-mitochondrial:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 40,
                'definition': 'Anti-parietal cell antibodies: Flagged',
                'idname': 'Anti-parietal_cell_antibodies:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 41,
                'definition': 'Anti-Ro: Flagged',
                'idname': 'Anti-Ro:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 42,
                'definition': 'Anti-smooth muscle: Flagged',
                'idname': 'Anti-smooth_muscle:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 43,
                'definition': 'Anti-transglutaminase: Flagged',
                'idname': 'Anti-transglutaminase:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 44,
                'definition': 'Anti-varicella: Flagged',
                'idname': 'Anti-varicella:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 45,
                'definition': 'AQP4: Flagged',
                'idname': 'AQP4:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 46,
                'definition': 'GlyR: Flagged',
                'idname': 'GlyR:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 47,
                'definition': 'HBV surface antigen: Flagged',
                'idname': 'HBV_surface_antigen:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 48,
                'definition': 'Hepatitis A: Flagged',
                'idname': 'Hepatitis_A:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 49,
                'definition': 'Hepatitis B: Flagged',
                'idname': 'Hepatitis_B:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 50,
                'definition': 'Hepatitis C: Flagged',
                'idname': 'Hepatitis_C:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 51,
                'definition': 'Jo1: Flagged',
                'idname': 'Jo1:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 52,
                'definition': 'LA: Flagged',
                'idname': 'LA:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 53,
                'definition': 'LUPUS anti-coagulant: Flagged',
                'idname': 'LUPUS_anti-coagulant:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 54,
                'definition': 'MOG: Flagged',
                'idname': 'MOG:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 55,
                'definition': 'Neutralising Anti-IFN antibody: Flagged',
                'idname': 'Neutralising_Anti-IFN_antibody:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 56,
                'definition': 'Neutralising Anti-natalizumab antibody: Flagged',
                'idname': 'Neutralising_Anti-natalizumab_antibody:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 57,
                'definition': 'NMDAR: Flagged',
                'idname': 'NMDAR:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 58,
                'definition': 'NMO IgG: Flagged',
                'idname': 'NMO_IgG:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 59,
                'definition': 'Plasma anti-JC virus: Flagged',
                'idname': 'Plasma_anti-JC_virus:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 60,
                'definition': 'RNP: Flagged',
                'idname': 'RNP:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 61,
                'definition': 'Scl70: Flagged',
                'idname': 'Scl70:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 62,
                'definition': 'SM: Flagged',
                'idname': 'SM:_Flagged',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '1',
                'deleted': '-'
            },
            {
                'id': 63,
                'definition': 'P100 Left: Abnormal',
                'idname': 'P100_Left:_Abnormal',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '2',
                'deleted': '-'
            },
            {
                'id': 64,
                'definition': 'P100 Left: amplitude',
                'idname': 'P100_Left:_amplitude',
                'type': 1,
                'unit': 'uV',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '2',
                'deleted': '-'
            },
            {
                'id': 65,
                'definition': 'P100 Left: P100 latency',
                'idname': 'P100_Left:_P100_latency',
                'type': 1,
                'unit': 'msec',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '2',
                'deleted': '-'
            },
            {
                'id': 66,
                'definition': 'P100 right: Abnormal',
                'idname': 'P100_right:_Abnormal',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '2',
                'deleted': '-'
            },
            {
                'id': 67,
                'definition': 'P100 right: amplitude',
                'idname': 'P100_right:_amplitude',
                'type': 1,
                'unit': 'uV',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '2',
                'deleted': '-'
            },
            {
                'id': 68,
                'definition': 'P100 right: P100 latency',
                'idname': 'P100_right:_P100_latency',
                'type': 1,
                'unit': 'msec',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '2',
                'deleted': '-'
            },
            {
                'id': 69,
                'definition': 'SEP left: upper extremity: abnormal',
                'idname': 'SEP_left:_upper_extremity:_abnormal',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '2',
                'deleted': '-'
            },
            {
                'id': 70,
                'definition': 'SEP left: lower extremity: abnormal',
                'idname': 'SEP_left:_lower_extremity:_abnormal',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '2',
                'deleted': '-'
            },
            {
                'id': 71,
                'definition': 'SEP right: upper extremity: abnormal',
                'idname': 'SEP_right:_upper_extremity:_abnormal',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '2',
                'deleted': '-'
            },
            {
                'id': 72,
                'definition': 'SEP right: lower extremity: abnormal',
                'idname': 'SEP_right:_lower_extremity:_abnormal',
                'type': 5,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '2',
                'deleted': '-'
            },
            {
                'id': 73,
                'definition': 'Session Name',
                'idname': 'Session_Name',
                'type': 4,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '3',
                'deleted': '-'
            },
            {
                'id': 74,
                'definition': 'Scans',
                'idname': 'Scans',
                'type': 6,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '3',
                'deleted': '-'
            },
            {
                'id': 75,
                'definition': 'scan type',
                'idname': 'scan_type',
                'type': 3,
                'unit': null,
                'module': 'MS',
                'permittedValues': 'T1, T2',
                'referenceType': '3',
                'deleted': '-'
            },
            {
                'id': 76,
                'definition': 'Morphology: region',
                'idname': 'Morphology:_region',
                'type': 3,
                'unit': null,
                'module': 'MS',
                'permittedValues': 'BRAIN, SPINE',
                'referenceType': '3',
                'deleted': '-'
            },
            {
                'id': 77,
                'definition': 'Morphology: T1 hypointense lesions',
                'idname': 'Morphology:_T1_hypointense_lesions',
                'type': 3,
                'unit': null,
                'module': 'MS',
                'permittedValues': 'NEGATIVE,  POSITIVE, NOT REPORTED',
                'referenceType': '3',
                'deleted': '-'
            },
            {
                'id': 78,
                'definition': 'Morphology: T2 hypointense lesions count',
                'idname': 'Morphology:_T2_hypointense_lesions_count',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '3',
                'deleted': '-'
            },
            {
                'id': 79,
                'definition': 'Morphology: T2 hypointense lesions volume',
                'idname': 'Morphology:_T2_hypointense_lesions_volume',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '3',
                'deleted': '-'
            },
            {
                'id': 80,
                'definition': 'Morphology: Gd enhancing lesions',
                'idname': 'Morphology:_Gd_enhancing_lesions',
                'type': 3,
                'unit': null,
                'module': 'MS',
                'permittedValues': 'NONE, SINGLE, MULTIPLE, UNKNOWN',
                'referenceType': '3',
                'deleted': '-'
            },
            {
                'id': 81,
                'definition': 'Morphology: Gd enhancing lesions volume',
                'idname': 'Morphology:_Gd_enhancing_lesions_volume',
                'type': 2,
                'unit': null,
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '3',
                'deleted': '-'
            },
            {
                'id': 82,
                'definition': 'Summary',
                'idname': 'Summary',
                'type': 3,
                'unit': null,
                'module': 'MS',
                'permittedValues': 'NORMAL, TRAUMATIC, ABNORMAL MS-TYPICAL, ABNORMAL MS-ATYPICAL',
                'referenceType': '4',
                'deleted': '-'
            },
            {
                'id': 83,
                'definition': 'Total-protein',
                'idname': 'Total-protein',
                'type': 2,
                'unit': 'mg/L',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '4',
                'deleted': '-'
            },
            {
                'id': 84,
                'definition': 'Glucose',
                'idname': 'Glucose',
                'type': 2,
                'unit': 'mg/L',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '4',
                'deleted': '-'
            },
            {
                'id': 85,
                'definition': 'Q Albumin',
                'idname': 'Q_Albumin',
                'type': 2,
                'unit': 'mg/L',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '4',
                'deleted': '-'
            },
            {
                'id': 86,
                'definition': 'IgG',
                'idname': 'IgG',
                'type': 2,
                'unit': 'mg/L',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '4',
                'deleted': '-'
            },
            {
                'id': 87,
                'definition': 'Albumin',
                'idname': 'Albumin',
                'type': 2,
                'unit': 'mg/L',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '4',
                'deleted': '-'
            },
            {
                'id': 88,
                'definition': 'IgG index',
                'idname': 'IgG_index',
                'type': 2,
                'unit': 'mg/L',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '4',
                'deleted': '-'
            },
            {
                'id': 89,
                'definition': 'WCC',
                'idname': 'WCC',
                'type': 2,
                'unit': 'mg/L',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '4',
                'deleted': '-'
            },
            {
                'id': 90,
                'definition': 'Lymphocytes',
                'idname': 'Lymphocytes',
                'type': 2,
                'unit': 'mg/L',
                'module': 'MS',
                'permittedValues': null,
                'referenceType': '4',
                'deleted': '-'
            },
            {
                'id': 91,
                'definition': 'Oligoclonal Bands in CSF',
                'idname': 'Oligoclonal_Bands_in_CSF',
                'type': 3,
                'unit': null,
                'module': 'MS',
                'permittedValues': 'TEST NOT DONE, NOT DETECTED, DETECTED',
                'referenceType': '4',
                'deleted': '-'
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
        ],
        dataTypes: [
            {
                'id': 1,
                'value': 'I'
            },
            {
                'id': 2,
                'value': 'F'
            },
            {
                'id': 3,
                'value': 'C'
            },
            {
                'id': 4,
                'value': 'T'
            },
            {
                'id': 5,
                'value': 'B'
            },
            {
                'id': 6,
                'value': 'BLOB'
            }
        ]
    }
};

//export default Map(initialState);