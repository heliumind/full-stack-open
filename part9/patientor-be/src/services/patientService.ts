import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients';
import type { NewPatient, Patient, PatientNonPII, Entry } from '../types';
import { toNewPatient, toNewEntry } from '../utils';

const patients: Patient[] = patientsData.map((p) => {
  const patient = toNewPatient(p) as Patient;
  patient.id = p.id;

  patient.entries = (p.entries ?? []).map((e) => {
    const entry = toNewEntry(e) as Entry;

    entry.id = e.id;

    return entry;
  });

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

const findById = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...patient,
  };

  patients.push(newPatient);
  return newPatient;
};

export default { getPatients, getPatiensNonPII, findById, addPatient };
