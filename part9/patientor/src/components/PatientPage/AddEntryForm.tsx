import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';

import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnoses';
import type { Diagnosis, Entry } from '../../types';

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
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [error, setError] = useState('');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    diagnosisService.getAll().then(setDiagnoses);
  }, []);

  const buildEntry = () => {
    const base = {
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
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

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const typeSpecificFields = () => {
    switch (entryType) {
      case 'HealthCheck':
        return (
          <FormControl fullWidth sx={{ pb: 1 }}>
            <InputLabel variant="standard">Healthcheck rating</InputLabel>
            <Select
              variant="standard"
              value={healthCheckRating}
              onChange={(e) => setHealthCheckRating(e.target.value)}
            >
              <MenuItem value="0">Healthy (0)</MenuItem>
              <MenuItem value="1">Low Risk (1)</MenuItem>
              <MenuItem value="2">High Risk (2)</MenuItem>
              <MenuItem value="3">Critical Risk (3)</MenuItem>
            </Select>
          </FormControl>
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
            <Typography sx={{ pt: 1 }}>Sick leave</Typography>
            <TextField
              fullWidth
              label="start"
              type="date"
              variant="standard"
              value={sickLeaveStart}
              onChange={(e) => setSickLeaveStart(e.target.value)}
              sx={{ pb: 1 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="end"
              type="date"
              variant="standard"
              value={sickLeaveEnd}
              onChange={(e) => setSickLeaveEnd(e.target.value)}
              sx={{ pb: 1 }}
              InputLabelProps={{ shrink: true }}
            />
          </>
        );
      case 'Hospital':
        return (
          <>
            <TextField
              fullWidth
              label="Discharge date"
              type="date"
              variant="standard"
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
              sx={{ pb: 1 }}
              InputLabelProps={{ shrink: true }}
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
          type="date"
          variant="standard"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={{ pb: 1 }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          label="Specialist"
          variant="standard"
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
          sx={{ pb: 1 }}
        />
        <FormControl fullWidth sx={{ pb: 1 }}>
          <InputLabel>Diagnosis codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={handleDiagnosisChange}
            input={<OutlinedInput label="Diagnosis codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((code) => (
                  <Chip key={code} label={code} size="small" />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {d.code} {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {typeSpecificFields()}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
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
