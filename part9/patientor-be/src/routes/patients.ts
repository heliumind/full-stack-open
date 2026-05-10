import type { Response, Request } from 'express';
import express from 'express';
import type { NewEntry, NewPatient, Patient, PatientNonPII, Entry } from '../types';
import patientService from '../services/patientService';
import { errorMiddleware, newEntryParser, newPatientParser } from '../middleware/patients';

const router = express.Router();

router.get('/', (_req, res: Response<PatientNonPII[]>) => {
  res.json(patientService.getPatiensNonPII());
});

router.get('/:id', (req, res: Response<Patient>) => {
  const patient = patientService.findById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const newPatient = patientService.addPatient(req.body);
    res.json(newPatient);
  },
);

router.post(
  '/:id/entries',
  newEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
    const entry = patientService.addEntry(req.params.id, req.body);
    if (entry) {
      res.json(entry);
    } else {
      res.sendStatus(404);
    }
  },
);

router.use(errorMiddleware);

export default router;
