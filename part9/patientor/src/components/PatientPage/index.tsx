import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Divider, Typography } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import { Entry, Patient, Gender } from '../../types';
import patientService from '../../services/patients';
import EntryDetails from './EntryDetails';
import AddEntryForm from './AddEntryForm';

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
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (id) {
      patientService.getById(id).then(setPatient);
    }
  }, [id]);

  if (!patient) {
    return null;
  }

  const handleEntryAdded = (entry: Entry) => {
    setPatient({
      ...patient,
      entries: (patient.entries ?? []).concat(entry),
    });
    setShowForm(false);
  };

  return (
    <Box sx={{ pt: 4 }}>
      <Divider />
      <Typography variant="h5" sx={{ pt: 2 }}>
        {patient.name}
        {genderId(patient.gender)}
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>

      {showForm ? (
        <AddEntryForm
          patientId={patient.id}
          onEntryAdded={handleEntryAdded}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <Button variant="contained" sx={{ mt: 2, mb: 2 }} onClick={() => setShowForm(true)}>
          Add New Entry
        </Button>
      )}

      <Typography variant="h6" sx={{ pt: 2 }}>entries</Typography>
      {patient.entries?.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} />
      ))}
    </Box>
  );
};

export default PatientPage;
