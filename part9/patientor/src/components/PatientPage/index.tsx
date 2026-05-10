import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import { Patient, Diagnosis, Gender } from '../../types';
import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnoses';

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
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    if (id) {
      patientService.getById(id).then(setPatient);
    }
    diagnosisService.getAll().then(setDiagnoses);
  }, [id]);

  if (!patient) {
    return null;
  }

  return (
    <Box sx={{ pt: 4 }}>
      <Divider />
      <Typography variant="h5" sx={{ pt: 2 }}>
        {patient.name}
        {genderId(patient.gender)}
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>

      <Typography variant="h6" sx={{ pt: 4 }}>entries</Typography>
      {patient.entries?.map((entry) => (
        <Box key={entry.id} sx={{ pb: 2 }}>
          <Typography>
            {entry.date} <em>{entry.description}</em>
          </Typography>
          {entry.diagnosisCodes && (
            <List sx={{ pl: 2, listStyleType: 'disc' }}>
              {entry.diagnosisCodes.map((code) => {
                const diagnosis = diagnoses.find((d) => d.code === code);
                return (
                  <ListItem key={code} disableGutters sx={{ display: 'list-item' }}>
                    <ListItemText
                      primary={`${code} ${diagnosis ? diagnosis.name : ''}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default PatientPage;
