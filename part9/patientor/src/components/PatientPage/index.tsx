import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import { Patient, Gender } from '../../types';
import patientService from '../../services/patients';

const genderId = (gender: Gender) => {
  switch (gender) {
    case 'female':
      return <FemaleIcon />;
    case 'male':
      return <MaleIcon />;
    default:
      return null;
  }
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) {
      patientService.getById(id).then(setPatient);
    }
  }, [id]);

  if (!patient) {
    return null;
  }

  return (
    <div>
      <Typography variant="h5">
        {patient.name}
        {genderId(patient.gender)}
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
    </div>
  );
};

export default PatientPage;
