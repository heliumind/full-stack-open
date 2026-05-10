import { useState } from 'react';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

import patientService from '../../services/patients';
import type { Entry } from '../../types';

interface Props {
  patientId: string;
  onEntryAdded: (entry: Entry) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ patientId, onEntryAdded, onCancel }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const entry = {
      type: 'HealthCheck' as const,
      description,
      date,
      specialist,
      healthCheckRating: Number(healthCheckRating),
      diagnosisCodes: diagnosisCodes
        ? diagnosisCodes.split(',').map((c) => c.trim())
        : undefined,
    };

    try {
      const newEntry = await patientService.createEntry(patientId, entry);
      onEntryAdded(newEntry);
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.data) {
        const data = e.response.data;
        if (data.error && Array.isArray(data.error)) {
          setError(data.error.map((issue: { message: string; path: string[] }) =>
            `Value of ${issue.path.join('.')} incorrect: ${issue.message}`
          ).join('. '));
        } else if (typeof data === 'string') {
          setError(data);
        } else {
          setError('Unknown error');
        }
      } else {
        setError('Unknown error');
      }
    }
  };

  return (
    <Box sx={{ border: '2px dashed', borderRadius: 1, p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ pb: 1 }}>New HealthCheck entry</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Description"
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ pb: 1 }}
        />
        <TextField
          fullWidth
          label="Date"
          variant="standard"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ pb: 1 }}
        />
        <TextField
          fullWidth
          label="Specialist"
          variant="standard"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          sx={{ pb: 1 }}
        />
        <TextField
          fullWidth
          label="Healthcheck rating"
          variant="standard"
          value={healthCheckRating}
          onChange={(e) => setHealthCheckRating(e.target.value)}
          sx={{ pb: 1 }}
        />
        <TextField
          fullWidth
          label="Diagnosis codes"
          variant="standard"
          value={diagnosisCodes}
          onChange={(e) => setDiagnosisCodes(e.target.value)}
          sx={{ pb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="error" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddEntryForm;
