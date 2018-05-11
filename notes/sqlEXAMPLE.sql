
////////////select all patients///
SELECT patients.id, patients.alias_id, patients.study, patient_demographic_data.DOB, patient_demographic_data.gender
FROM patients 
LEFT JOIN patient_demographic_data ON patients.id = patient_demographic_data.patient
WHERE patients.alias_id LIKE '%chon%';