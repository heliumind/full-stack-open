import { Box, Typography } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';

import type { Entry, HealthCheckRating } from '../../types';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const HealthRatingIcon = ({ rating }: { rating: HealthCheckRating }) => {
  switch (rating) {
    case 0:
      return <FavoriteIcon sx={{ color: 'green' }} />;
    case 1:
      return <FavoriteIcon sx={{ color: 'yellow' }} />;
    case 2:
      return <FavoriteIcon sx={{ color: 'orange' }} />;
    case 3:
      return <FavoriteIcon sx={{ color: 'red' }} />;
    default:
      return null;
  }
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      return (
        <Box sx={{ border: 1, borderRadius: 1, p: 1, mb: 2 }}>
          <Typography>{entry.date} <MedicalServicesIcon /></Typography>
          <Typography><em>{entry.description}</em></Typography>
          <HealthRatingIcon rating={entry.healthCheckRating} />
          <Typography>diagnose by {entry.specialist}</Typography>
        </Box>
      );
    case 'OccupationalHealthcare':
      return (
        <Box sx={{ border: 1, borderRadius: 1, p: 1, mb: 2 }}>
          <Typography>{entry.date} <WorkIcon /> <em>{entry.employerName}</em></Typography>
          <Typography><em>{entry.description}</em></Typography>
          <Typography>diagnose by {entry.specialist}</Typography>
        </Box>
      );
    case 'Hospital':
      return (
        <Box sx={{ border: 1, borderRadius: 1, p: 1, mb: 2 }}>
          <Typography>{entry.date} <LocalHospitalIcon /></Typography>
          <Typography><em>{entry.description}</em></Typography>
          <Typography>discharged {entry.discharge.date}: {entry.discharge.criteria}</Typography>
          <Typography>diagnose by {entry.specialist}</Typography>
        </Box>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
