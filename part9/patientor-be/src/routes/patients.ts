import express from 'express';
import { Response } from 'express';
import { PatientNonPII } from '../types';
import patientService from '../services/patientService';
import { toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res: Response<PatientNonPII[]>) => {
  res.json(patientService.getPatiensNonPII());
});

router.post('/', (req, res) => {
  try {
    const patient = toNewPatient(req.body);
    const newPatient = patientService.addPatient(patient);
    res.json(newPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong :(';
    if (error instanceof Error) {
      errorMessage = 'Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
