import type { NewEntry, NewPatient } from './types';
import { Gender, HealthCheckRating } from './types';
import { z } from 'zod';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string().regex(/[\w_]+/g),
  gender: z.enum(Gender),
  occupation: z.string(),
});

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.enum(HealthCheckRating),
});

const SickLeaveSchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: SickLeaveSchema.optional(),
});

const DischargeSchema = z.object({
  date: z.iso.date(),
  criteria: z.string(),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: DischargeSchema,
});

/* ---------- Union ---------- */

export const NewEntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
  HospitalEntrySchema,
]);

/* ---------- Parser ---------- */

export const toNewEntry = (object: unknown): NewEntry => {
  return NewEntrySchema.parse(object);
};

export const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};
