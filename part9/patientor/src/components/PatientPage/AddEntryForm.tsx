import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';

import patientService from '../../services/patients';
import type { Entry } from '../../types';

type EntryType = 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital';

interface Props {
  patientId: string;
  onEntryAdded: (entry: Entry) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ patientId, onEntryAdded, onCancel }: Props) => {
  const [entryType, setEntryType] = useState<EntryType>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [error, setError] = useState('');

  const buildEntry = () => {
    const base = {
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes
        ? diagnosisCodes.split(',').map((c) => c.trim())
        : undefined,
    };

    switch (entryType) {
      case 'HealthCheck':
        return { ...base, type: 'HealthCheck' as const, healthCheckRating: Number(healthCheckRating) };
      case 'OccupationalHealthcare':
        return {
          ...base,
          type: 'OccupationalHealthcare' as const,
          employerName,
          ...(sickLeaveStart || sickLeaveEnd
            ? { sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd } }
            : {}),
        };
      case 'Hospital':
        return {
          ...base,
          type: 'Hospital' as const,
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const newEntry = await patientService.createEntry(patientId, buildEntry());
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

  const typeSpecificFields = () => {
    switch (entryType) {
      case 'HealthCheck':
        return (
          <TextField
            fullWidth
            label="Healthcheck rating"
            variant="standard"
            value={healthCheckRating}
            onChange={(e) => setHealthCheckRating(e.target.value)}
            sx={{ pb: 1 }}
          />
        );
      case 'OccupationalHealthcare':
        return (
          <>
            <TextField
              fullWidth
              label="Employer name"
              variant="standard"
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
              sx={{ pb: 1 }}
            />
            <TextField
              fullWidth
              label="Sick leave start date"
              variant="standard"
              value={sickLeaveStart}
              onChange={(e) => setSickLeaveStart(e.target.value)}
              sx={{ pb: 1 }}
            />
            <TextField
              fullWidth
              label="Sick leave end date"
              variant="standard"
              value={sickLeaveEnd}
              onChange={(e) => setSickLeaveEnd(e.target.value)}
              sx={{ pb: 1 }}
            />
          </>
        );
      case 'Hospital':
        return (
          <>
            <TextField
              fullWidth
              label="Discharge date"
              variant="standard"
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
              sx={{ pb: 1 }}
            />
            <TextField
              fullWidth
              label="Discharge criteria"
              variant="standard"
              value={dischargeCriteria}
              onChange={(e) => setDischargeCriteria(e.target.value)}
              sx={{ pb: 1 }}
            />
          </>
        );
    }
  };

  return (
    <Box sx={{ border: '2px dashed', borderRadius: 1, p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ pb: 1 }}>New entry</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ pb: 1 }}>
          <InputLabel variant="standard">Entry type</InputLabel>
          <Select
            variant="standard"
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as EntryType)}
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
          </Select>
        </FormControl>
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
        {typeSpecificFields()}
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
