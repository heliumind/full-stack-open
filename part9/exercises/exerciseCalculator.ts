import { parseExArguments } from './utils';

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const getRatingDesc = (rating: number): string => {
  if (rating < 1.5) {
    return 'try harder';
  } else if (rating > 2.5) {
    return 'great job';
  } else {
    return 'not too bad but could be better';
  }
};

const calculateExercise = (hours: number[], target: number): Result => {
  const periodLength = hours.length;
  const trainingDays = hours.filter((h) => h !== 0).length;
  const average = hours.reduce((acc, h) => acc + h) / hours.length;
  const success = average >= target;
  const rating = Math.floor(
    Math.min(3, Math.max(1, 1 + 2 * (average / target)))
  );
  const ratingDescription = getRatingDesc(rating);

  return {
    periodLength,
    trainingDays,
    success,
    target,
    rating,
    ratingDescription,
    average,
  };
};

try {
  const { target, hours } = parseExArguments(process.argv);
  console.log(calculateExercise(hours, target));
} catch (error: unknown) {
  let errorMessage = 'Somehting bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.error(errorMessage);
}
