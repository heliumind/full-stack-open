import patientsData from '../../data/patients';
import { Patient, PatientNonPII } from '../types';

const patients: Patient[] = patientsData;

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

const addPatient = () => {
  return null;
};

export default { getPatients, getPatiensNonPII, addPatient };
