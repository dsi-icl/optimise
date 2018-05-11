//add avaiable fields
knex('available_fields')
    .insert({
        name: 'Systolic Blood Pressure',
        type: 'N',
        unit: 'mmHg',
        permitted_values: '>0' })
    .then(id => console.log(id))
    .catch(res => console.log(res));


//add available clinical event type
knex('available_fields')
    .insert({
        name: 'Relapses'})
    .then(id => console.log(id))
    .catch(res => console.log(res));

//add available test type
knex('available_test_types')
    .insert([
        {name: 'Laboratory test'},
        {name: 'Evoked potential'},
        {name: 'MRI'},
        {name: 'Lumbar Puncture'}])
    .then(id => console.log(id))   //return highest id
    .catch(res => console.log(res));













//select patients for list
knex('patients')
    .select('patients.id', 'patients.alias_id', 'patients.study', 'patient_demographic_data.DOB', 'patient_demographic_data.gender')
    .leftOuterJoin('patient_demographic_data', 'patients.id', 'patient_demographic_data.patient')
    .whereRaw('patients.alias_id LIKE "%chon%"')
    .then(res => console.log(res));


//create user
knex('users')
    .insert({
        username: 'flor',
        real_name: 'florian',
        pw: 'heyhey',
        admin_priv: 1,
        created_by_user: 1,
        deleted: 0 })
    .then(id => console.log(id))   //returns [id] of just created
    .catch(res => console.log(res));


//create patient
knex('patients')
    .insert({
        alias_id: 'florssdfsdfsdfsiana',
        study: 'optimise',
        created_by_user: 1,
        deleted: 0 })
    .then(id => console.log(id))   //returns [id] of just created
    .catch(res => console.log(res));

//add patient demographic data
knex('patient_demographic_data')
    .insert({
        patient: 1,
        DOB: '1/4/1995',
        gender: 'male',
        dominant_hand: 'left',
        ethnicity: 'chinese',
        country_of_origin: 'china',
        alcohol_usage: 'More than 3 units a day',
        smoking_history: 'unknown',
        created_by_user: 1,
        deleted: 0 })
    .then(id => console.log(id))
    .catch(res => console.log(res));


//add immunisation
knex('patient_immunisation')
    .insert({
        patient: 16,
        vaccine_name: 'BCG',
        immunisation_date: '5/2/1989',
        created_by_user: 1,
        deleted: 0 })
    .then(id => console.log(id))
    .catch(res => console.log(res));


//add existing medical conditions
knex('existing_or_familial_medical_conditions')
    .insert({
        patient: 15,
        relation: 'self',
        condition_name: 'MS',
        start_date: '1/6/1025',
        outcome: 'resolved',
        resolved_year: 1954,
        created_by_user: 1,
        deleted:0 })
    .then(id => console.log(id))
    .catch(res => console.log(res));

    /////FAIL///
    knex('existing_or_familial_medical_conditions')  //resolve year present but outcome is not resolved
        .insert({
        patient: 11,
        relation: 'self',
        condition_name: 'MS',
        start_date: '1/6/1025',
        outcome: 'unknown',
        resolved_year: 1954,
        created_by_user: 1,
        deleted:0 })
        .then(id => console.log(id))
        .catch(res => console.log(res));    
    
    knex('existing_or_familial_medical_conditions')  //resolve year present but outcome is not resolved
        .insert({
        patient: 11,
        relation: 'self',
        condition_name: 'MS',
        start_date: '1/6/1025',
        outcome: 'resolved',
        resolved_year: 1954,
        created_by_user: 1,
        deleted:0 })
        .then(id => console.log(id))
        .catch(res => console.log(res));
    

//add visit
knex('visits')
    .insert({
        patient: 12,
        visit_date: '4/7/2015',
        created_by_user: 1,
        deleted:0 })
    .then(id => console.log(id))
    .catch(res => console.log(res));

