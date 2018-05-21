PRAGMA foreign_keys = ON;
.headers on


/*add check constaints*/
/*check if unique constriaints are right*/



/* user data */
CREATE TABLE users (
    id INTEGER PRIMARY KEY ASC,
    username TEXT NOT NULL, 
    real_name TEXT,
    pw TEXT NOT NULL,
    admin_priv NUMERIC,
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL /*0 or deletion time*/
    UNIQUE (username, deleted)
);

INSERT INTO users (
        username, real_name, pw, admin_priv, created_by_user, deleted
    )
    VALUES (
        'admin', 'admin', 'admin', 1, 1, 0
);

CREATE TABLE user_sessions (
    id INTEGER PRIMARY KEY ASC,
    user INTEGER NOT NULL REFERENCES users(id),
    session_start_date TEXT NOT NULL DEFAULT (datetime('now')),
    session_token TEXT NOT NULL,
    deleted NUMERIC NOT NULL /*0 or deletion time*/
);


/* patient basic data */
CREATE TABLE patients (
    id INTEGER PRIMARY KEY ASC,
    alias_id TEXT NOT NULL,
    study TEXT NOT NULL,
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL, /*0 or deletion time*/
    UNIQUE (alias_id, deleted)
);

CREATE TABLE patient_immunisation (
    id INTEGER PRIMARY KEY ASC,
    patient INTEGER NOT NULL REFERENCES patients(id),
    vaccine_name TEXT NOT NULL,
    immunisation_date TEXT NOT NULL,
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL, /*0 or deletion time*/
    UNIQUE (patient, vaccine_name, immunisation_date, deleted)
);

CREATE TABLE patient_demographic_data (
    id INTEGER PRIMARY KEY ASC,
    patient INTEGER NOT NULL REFERENCES patients(id),
    DOB TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other/prefer not to say')),
    dominant_hand TEXT NOT NULL CHECK (dominant_hand IN ('left', 'right', 'ambidextrous', 'amputated')),
    ethnicity TEXT NOT NULL CHECK (ethnicity IN ('white', 'black', 'chinese', 'other asian', 'native american', 'arab', 'persian', 'other mixed', 'unknown')),
    country_of_origin TEXT, /* CHECCCCCCCCCCCCCCK */
    alcohol_usage TEXT NOT NULL CHECK (alcohol_usage IN ('More than 3 units a day', 'Less than 3 units a day', 'Less than 3 units a week', 'No alcohol consumption', 'unknown')),
    smoking_history TEXT NOT NULL CHECK (smoking_history IN ('smoker', 'ex-smoker','never smoked', 'electronic cigarette', 'unknown')),
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL, /*0 or deletion time*/
    UNIQUE (patient, deleted)
);


CREATE TABLE patient_existing_or_familial_medical_conditions (
    id INTEGER PRIMARY KEY ASC,
    patient INTEGER NOT NULL REFERENCES patients(id),
    relation TEXT NOT NULL CHECK (relation in ('self', 'mother', 'father', 'sisters', 'brothers', 'zygotic twins', 'maternal grandparent', 'maternal cousin', 'maternal aunt/uncle', 'paternal grandparent', 'paternal cousin', 'paternal aunt/uncle')),
    condition_name TEXT NOT NULL, /*CHECCCCCCCK*/
    start_date TEXT,
    outcome TEXT NOT NULL,
    resolved_year NUMERIC,
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL, /*0 or deletion time*/
    UNIQUE (patient, relation, condition_name, start_date, deleted),
    CHECK (
        (outcome in ('ongoing', 'unknown', 'not applicable') AND resolved_year IS NULL)
        OR 
        (outcome in ('resolved') AND resolved_year < 2100 AND resolved_year > 1900)
    )
);


/* patient visits data */
CREATE TABLE visits (
    id INTEGER PRIMARY KEY ASC,
    patient INTEGER NOT NULL REFERENCES patients(id),
    visit_date TEXT NOT NULL,
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL, /*0 or deletion time*/
    UNIQUE (patient, visit_date, deleted)
);

CREATE TABLE available_fields_visits (
    id INTEGER PRIMARY KEY ASC,
    definition TEXT NOT NULL,
    idname TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('I', 'F', 'C', 'T', 'B')),  /*int, float, categorical, text, Bool*/
    unit TEXT,
    module TEXT,
    permitted_values TEXT,
    UNIQUE (idname, type, unit, module)
);

CREATE TABLE available_fields_tests (
    id INTEGER PRIMARY KEY ASC,
    definition TEXT NOT NULL,
    idname TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('I', 'F', 'C', 'T', 'B')),  /*int, float, categorical, text, Bool*/
    unit TEXT,
    module TEXT,
    test_type INTEGER NOT NULL REFERENCES available_fields_tests(id),
    permitted_values TEXT,
    UNIQUE (idname, type, unit, module)
);

CREATE TABLE available_fields_ce (
    id               INTEGER PRIMARY KEY ASC,
    definition       TEXT    NOT NULL,
    idname           TEXT    NOT NULL,
    type             TEXT    NOT NULL,
    unit             TEXT,
    module           TEXT,
    permitted_values TEXT,
    event_type       INTEGER REFERENCES available_clinical_event_types (id) 
);

CREATE TABLE clinical_events (
    id INTEGER PRIMARY KEY ASC,
    patient INTEGER REFERENCES patients(id),
    recorded_during_visit INTEGER REFERENCES visits(id),
    type INTEGER NOT NULL REFERENCES available_clinical_event_types(id),
    date_start_date TEXT NOT NULL,
    end_date TEXT,
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL /*0 or deletion time*/
    CHECK (
        (patient IS NULL AND recorded_during_visit IS NOT NULL)
        OR
        (patient IS NOT NULL AND recorded_during_visit IS NULL)
    )
);

CREATE TABLE clinical_events_data (
    id INTEGER PRIMARY KEY ASC,
    clinical_event INTEGER NOT NULL REFERENCES clinical_events(id),
    field INTEGER NOT NULL REFERENCES available_fields(id),
    value TEXT NOT NULL,
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL, /*0 or deletion time*/
    UNIQUE(clinical_events, field, deleted)
);



CREATE TABLE treatments (
    id INTEGER PRIMARY KEY ASC,
    ordered_during_visit INTEGER NOT NULL REFERENCES visits(id),
    drug TEXT NOT NULL REFERENCES available_drugs(id),
    dose NUMERIC NOT NULL,
    unit TEXT NOT NULL CHECK (unit IN ('mg', 'cc')), /*CHECCCCCCK*/
    form TEXT NOT NULL CHECK (form IN ('oral', 'IV')), /*CHECCCCCCK*/
    times_per_day NUMERIC NOT NULL CHECK (times_per_day > 0),
    duration_weeks NUMERIC NOT NULL CHECK (duration_weeks > 0),
    terminated_date TEXT,
    terminated_reason TEXT CHECK (terminated_reason IN ('patient preference','disease progresssion', 'death', 'life threatening reaction to drug', 'permanent / serious disability', 'prolonged hospitalization')),
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL, /*0 or deletion time*/
    UNIQUE (ordered_during_visit, drug_name, deleted),
    CHECK (
        (terminated_date IS NULL AND terminated_reason IS NULL) OR
        (terminated_date IS NOT NULL AND terminated_reason IS NOT NULL)
    )
);

CREATE TABLE treatments_interruptions (
    id INTEGER PRIMARY KEY ASC,
    treatment INTEGER NOT NULL REFERENCES treatments(id),
    start_date TEXT NOT NULL,
    end_date TEXT,
    reason TEXT CHECK (reason IN ('pregnancy', 'convenience', 'adverse event', 'unknown')),
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL, /*0 or deletion time*/
    UNIQUE(treatment, start_date, deleted)
);

CREATE TABLE available_test_types (
    id INTEGER PRIMARY KEY ASC,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE available_drugs (
    id     INTEGER PRIMARY KEY ASC,
    name   TEXT NOT NULL,
    module TEXT
);

INSERT INTO available_test_types (name) VALUES ('Laboratory test');
INSERT INTO available_test_types (name) VALUES ('Evoked potential');
INSERT INTO available_test_types (name) VALUES ('MRI');
INSERT INTO available_test_types (name) VALUES ('Lumbar Puncture');


CREATE TABLE available_clinical_event_types (
    id INTEGER PRIMARY KEY ASC,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO available_clinical_event_types (name) VALUES ('Relapses');





CREATE TABLE ordered_tests (
    id INTEGER PRIMARY KEY ASC,
    ordered_during_visit INTEGER NOT NULL REFERENCES visits(id),
    type INTEGER NOT NULL REFERENCES available_test_types(id),
    expected_occur_date TEXT NOT NULL,
    actual_occurred_date TEXT NOT NULL,
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL, /*0 or deletion time*/
    UNIQUE(ordered_during_visit, type, expected_occur_date, deleted)
);



CREATE TABLE test_data (
    id INTEGER PRIMARY KEY ASC,
    test INTEGER NOT NULL REFERENCES ordered_tests(id),
    field INTEGER NOT NULL REFERENCES available_fields(id),
    value TEXT NOT NULL,
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL, /*0 or deletion time*/
    UNIQUE(test, field, deleted)
);


CREATE TABLE visit_collected_data (
    id INTEGER PRIMARY KEY ASC,
    visit INTEGER NOT NULL REFERENCES visits(id),
    field INTEGER NOT NULL REFERENCES available_fields(id),
    value TEXT NOT NULL,
    created_time TEXT NOT NULL DEFAULT (datetime('now')),
    created_by_user INTEGER NOT NULL REFERENCES users(id),
    deleted TEXT NOT NULL, /*0 or deletion time*/
    UNIQUE(visit, field, deleted)
);











/* test_____________________________________________________________________ */
INSERT INTO patients (
    alias_id, study, created_time, created_by_user, deleted
) VALUES ('hey', 'optimise', datetime('now'), 1, 0);


INSERT INTO patient_demographic_data (
    patient, DOB, gender, dominant_hand, ethnicity, country_of_origin, alcohol_usage, smoking_history, created_by_user, deleted
) VALUES (1, date('now'), 'male', 'right', 'white', 'd', 'More than 3 units a day', 'smoker', 1, 0);

INSERT INTO existing_or_familial_medical_conditions (
    patient, relation, condition_name, outcome, resolved_year, created_by_user, deleted
) VALUES (
    1, 'self', 'MS', 'resolved', 1988, 1, 0
);

INSERT INTO existing_or_familial_medical_conditions (
    patient, relation, condition_name, outcome, resolved_year, created_by_user, deleted
) VALUES (
    1, 'self', 'MS', 'unknown', null, 1, 0
);