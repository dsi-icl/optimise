PRAGMA foreign_keys = ON;
.headers on


/*add check constaints*/
/*check if unique constriaints are right*/



/* user data */
CREATE TABLE USERS (
    id INTEGER PRIMARY KEY ASC,
    username TEXT NOT NULL, 
    realName TEXT,
    pw TEXT NOT NULL,
    adminPriv NUMERIC,
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE (username, deleted)
);

CREATE TABLE USER_SESSION (
    id INTEGER PRIMARY KEY ASC,
    user INTEGER NOT NULL REFERENCES USERS(id),
    sessionStartDate TEXT NOT NULL DEFAULT (datetime('now')),
    sessionToken TEXT NOT NULL,
    deleted TEXT /*NULL or deletion time*/
);


/* patient basic data */
CREATE TABLE PATIENTS (
    id INTEGER PRIMARY KEY ASC,
    aliasId TEXT NOT NULL,
    study TEXT NOT NULL,
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE (aliasId, deleted)
);

CREATE TABLE PATIENT_IMMUNISATION (
    id INTEGER PRIMARY KEY ASC,
    patient INTEGER NOT NULL REFERENCES PATIENTS(id),
    vaccineName TEXT NOT NULL,
    immunisationDate TEXT NOT NULL,
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE (patient, vaccineName, immunisationDate, deleted)
);

CREATE TABLE PATIENT_DEMOGRAPHIC (
    id INTEGER PRIMARY KEY ASC,
    patient INTEGER NOT NULL REFERENCES PATIENTS(id),
    DOB TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other/prefer not to say')), /* Will link to a list table */
    dominantHand TEXT NOT NULL CHECK (dominantHand IN ('left', 'right', 'ambidextrous', 'amputated')), /* Will link to a list table */
    ethnicity TEXT NOT NULL CHECK (ethnicity IN ('white', 'black', 'chinese', 'other asian', 'native american', 'arab', 'persian', 'other mixed', 'unknown')), /* Will link to a list table */
    countryOfOrigin TEXT, /* CHECCCCCCCCCCCCCCK */ /* Will link to a list table */
    alcoholUsage TEXT NOT NULL CHECK (alcoholUsage IN ('More than 3 units a day', 'Less than 3 units a day', 'Less than 3 units a week', 'No alcohol consumption', 'unknown')),
    smokingHistory TEXT NOT NULL CHECK (smokingHistory IN ('smoker', 'ex-smoker','never smoked', 'electronic cigarette', 'unknown')),
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE (patient, deleted)
);


CREATE TABLE MEDICAL_HISTORY (
    id INTEGER PRIMARY KEY ASC,
    patient INTEGER NOT NULL REFERENCES PATIENTS(id),
    relation TEXT NOT NULL CHECK (relation in ('self', 'mother', 'father', 'sisters', 'brothers', 'zygotic twins', 'maternal grandparent', 'maternal cousin', 'maternal aunt/uncle', 'paternal grandparent', 'paternal cousin', 'paternal aunt/uncle')),
    conditionName TEXT NOT NULL, /*CHECCCCCCCK*/
    startDate TEXT,
    outcome TEXT NOT NULL,
    resolvedYear NUMERIC,
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE (patient, relation, conditionName, startDate, deleted),
    CHECK (
        (outcome in ('ongoing', 'unknown', 'not applicable') AND resolvedYear IS NULL)
        OR 
        (outcome in ('resolved') AND resolvedYear < 2100 AND resolvedYear > 1900) /* Need to change */
    )
);


/* patient visits data */
CREATE TABLE VISITS (
    id INTEGER PRIMARY KEY ASC,
    patient INTEGER NOT NULL REFERENCES PATIENTS(id),
    visitDate TEXT NOT NULL,
    type INTERGER NOT NULL DEFAULT(1),
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE (patient, visitDate, deleted)
);

CREATE TABLE AVAILABLE_FIELDS_VISITS (
    id INTEGER PRIMARY KEY ASC,
    definition TEXT NOT NULL,
    idname TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('I', 'F', 'C', 'T', 'B')),  /*int, float, categorical, text, Bool*/
    unit TEXT,
    module TEXT,
    permittedValues TEXT,
    referenceType INTEGER NOT NULL DEFAULT(1),
    UNIQUE (idname, type, unit, module)
);

CREATE TABLE AVAILABLE_FIELDS_TESTS (
    id INTEGER PRIMARY KEY ASC,
    definition TEXT NOT NULL,
    idname TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('I', 'F', 'C', 'T', 'B')),  /*int, float, categorical, text, Bool*/
    unit TEXT,
    module TEXT,
    referenceType INTEGER NOT NULL REFERENCES AVAILABLE_TEST_TYPES(id),
    permittedValues TEXT,
    UNIQUE (idname, type, unit, module)
);

CREATE TABLE AVAILABLE_FIELDS_CE (
    id               INTEGER PRIMARY KEY ASC,
    definition       TEXT    NOT NULL,
    idname           TEXT    NOT NULL,
    type             TEXT    NOT NULL,
    unit             TEXT,
    module           TEXT,
    permitted_values TEXT,
    reference_type       INTEGER REFERENCES AVAILABLE_CLINICAL_EVENT_TYPES (id) 
);

CREATE TABLE CLINICAL_EVENTS (
    id INTEGER PRIMARY KEY ASC,
    recordedDuringVisit INTEGER REFERENCES VISITS(id),
    type INTEGER NOT NULL REFERENCES AVAILABLE_CLINICAL_EVENT_TYPES(id),
    dateStartDate TEXT NOT NULL,
    endDate TEXT,
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT /*NULL or deletion time*/
);

CREATE TABLE CLINICAL_EVENTS_DATA (
    id INTEGER PRIMARY KEY ASC,
    clinicalEvent INTEGER NOT NULL REFERENCES CLINICAL_EVENTS(id),
    field INTEGER NOT NULL REFERENCES AVAILABLE_FIELDS_CE(id),
    value TEXT NOT NULL,
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE(clinicalEvent, field, deleted)
);

CREATE TABLE TREATMENTS (
    id INTEGER PRIMARY KEY ASC,
    orderedDuringVisit INTEGER NOT NULL REFERENCES VISITS(id),
    drug TEXT NOT NULL REFERENCES AVAILABLE_DRUGS(id),
    dose NUMERIC NOT NULL,
    unit TEXT NOT NULL CHECK (unit IN ('mg', 'cc')), /*CHECCCCCCK*/
    form TEXT NOT NULL CHECK (form IN ('oral', 'IV')), /*CHECCCCCCK*/
    timesPerDay NUMERIC NOT NULL CHECK (timesPerDay > 0),
    durationWeeks NUMERIC NOT NULL CHECK (durationWeeks > 0),
    terminatedDate TEXT,
    terminatedReason TEXT CHECK (terminatedReason IN ('patient preference','disease progresssion', 'death', 'life threatening reaction to drug', 'permanent / serious disability', 'prolonged hospitalization')),
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE (orderedDuringVisit, drug, deleted),
    CHECK (
        (terminatedDate IS NULL AND terminatedReason IS NULL) OR
        (terminatedDate IS NOT NULL AND terminatedReason IS NOT NULL)
    )
);

CREATE TABLE TREATMENTS_INTERRUPTIONS (
    id INTEGER PRIMARY KEY ASC,
    TREATMENT INTEGER NOT NULL REFERENCES TREATMENTS(id),
    startDate TEXT NOT NULL,
    endDate TEXT,
    reason TEXT CHECK (reason IN ('pregnancy', 'convenience', 'adverse event', 'unknown')),
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE(treatment, startDate, deleted)
);

CREATE TABLE AVAILABLE_TEST_TYPES (
    id INTEGER PRIMARY KEY ASC,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE AVAILABLE_DRUGS (
    id     INTEGER PRIMARY KEY ASC,
    name   TEXT NOT NULL,
    module TEXT
);

CREATE TABLE AVAILABLE_CLINICAL_EVENT_TYPES (
    id INTEGER PRIMARY KEY ASC,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE ORDERED_TESTS (
    id INTEGER PRIMARY KEY ASC,
    orderedDuringVisit INTEGER NOT NULL REFERENCES VISITS(id),
    type INTEGER NOT NULL REFERENCES AVAILABLE_TEST_TYPES(id),
    expectedOccurDate TEXT NOT NULL,
    actualOccurredDate TEXT,
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE(orderedDuringVisit, type, expectedOccurDate, deleted)
);

CREATE TABLE TEST_DATA (
    id INTEGER PRIMARY KEY ASC,
    test INTEGER NOT NULL REFERENCES orderedTests(id),
    field INTEGER NOT NULL REFERENCES availableFields(id),
    value TEXT NOT NULL,
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE(test, field, deleted)
);


CREATE TABLE VISIT_DATA (
    id INTEGER PRIMARY KEY ASC,
    visit INTEGER NOT NULL REFERENCES VISITS(id),
    field INTEGER NOT NULL REFERENCES AVAILABLE_FIELDS_VISITS(id),
    value TEXT NOT NULL,
    createdTime TEXT NOT NULL DEFAULT (datetime('now')),
    createdByUser INTEGER NOT NULL REFERENCES USERS(id),
    deleted TEXT, /*NULL or deletion time*/
    UNIQUE(visit, field, deleted)
);

CREATE TABLE LOG_ACTIONS (
    id INTEGER PRIMARY KEY ASC,
    router TEXT NOT NULL,
    method TEXT NOT NULL,
    user TEXT NOT NULL,
    body TEXT,
    createdTime TEXT NOT NULL DEFAULT (datetime('now'))
);

/* INSERTIONS */
/* Insert admin user with password 'admin' */
INSERT INTO USERS (
        username, realName, pw, adminPriv, createdByUser, deleted
    )
    VALUES (
        'admin', 'admin', 'a92e2c29eccc56ea49ed627a2656c4d5be74c29d80bd31709dd8b196a7f30825', 1, 1, NULL
);

INSERT INTO AVAILABLE_TEST_TYPES (name) VALUES ('Laboratory test');
INSERT INTO AVAILABLE_TEST_TYPES (name) VALUES ('Evoked potential');
INSERT INTO AVAILABLE_TEST_TYPES (name) VALUES ('MRI');
INSERT INTO AVAILABLE_TEST_TYPES (name) VALUES ('Lumbar Puncture');

INSERT INTO AVAILABLE_DRUGS (name) VALUES ('Daclizumab');
INSERT INTO AVAILABLE_DRUGS (name) VALUES ('Alemtuzumab');
INSERT INTO AVAILABLE_DRUGS (name) VALUES ('Avonex');
INSERT INTO AVAILABLE_DRUGS (name) VALUES ('Betaferon');


INSERT INTO AVAILABLE_CLINICAL_EVENT_TYPES (name) VALUES ('Relapses');

/* test_____________________________________________________________________ */
INSERT INTO PATIENTS (
    aliasId, study, createdTime, createdByUser, deleted
) VALUES ('hey', 'optimise', datetime('now'), 1, NULL);

INSERT INTO PATIENT_DEMOGRAPHIC (
    patient, DOB, gender, dominantHand, ethnicity, countryOfOrigin, alcoholUsage, smokingHistory, createdByUser, deleted
) VALUES (1, date('now'), 'male', 'right', 'white', 'd', 'More than 3 units a day', 'smoker', 1, NULL);

INSERT INTO MEDICAL_HISTORY (
    patient, relation, conditionname, outcome, resolvedyear, createdByUser, deleted
) VALUES (
    1, 'self', 'MS', 'resolved', 1988, 1, NULL
);

INSERT INTO MEDICAL_HISTORY (
    patient, relation, conditionName, outcome, resolvedYear, createdByUser, deleted
) VALUES (
    1, 'self', 'MS', 'unknown', NULL, 1, NULL
);