import express from 'express';
import type { Response } from 'express';
import type { Diagnosis } from '../types';
import diagnosesService from '../services/diagnosisService';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.json(diagnosesService.getDiagnoses());
});

router.post('/', (_req, res) => {
  res.send('Saving a diagnosis!');
});

export default router;
