import express, { Response, Request } from 'express';
import { NewPatient, Patient, PatientNonPII } from '../types';
import patientService from '../services/patientService';
import { errorMiddleware, newPatientParser } from '../middleware/patients';

const router = express.Router();

router.get('/', (_req, res: Response<PatientNonPII[]>) => {
  res.json(patientService.getPatiensNonPII());
});

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const newPatient = patientService.addPatient(req.body);
    res.json(newPatient);
  },
);

router.use(errorMiddleware);

export default router;
