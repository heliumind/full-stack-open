import express from 'express';
import { Response } from 'express';
import { PatientNonPII } from '../types';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res: Response<PatientNonPII[]>) => {
  res.json(patientService.getPatiensNonPII());
});

router.post('/', (_req, res) => {
  res.send('Saved a patient!');
});

export default router;
