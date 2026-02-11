import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients';
import { NewPatient, Patient, PatientNonPII } from '../types';
import { toNewPatient } from '../utils';

const patients: Patient[] = patientsData.map((p) => {
  const patient = toNewPatient(p) as Patient;
  patient.id = p.id;
  return patient;
});

const getPatients = (): Patient[] => {
  return patients;
};

const getPatiensNonPII = (): PatientNonPII[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };

  patients.push(newPatient);
  return newPatient;
};

export default { getPatients, getPatiensNonPII, addPatient };
