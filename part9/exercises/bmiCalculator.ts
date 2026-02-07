import { parseBmiArguments } from './utils';

const calculateBmi = (height: number, weight: number): string => {
  const height_cm = height / 100;
  const bmi = weight / (height_cm * height_cm);
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi > 25) {
    return 'Overweight';
  } else {
    return 'Normal range';
  }
};

try {
  if (require.main === module) {
    const { value1, value2 } = parseBmiArguments(process.argv);
    console.log(calculateBmi(value1, value2));
  }
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.error(errorMessage);
}

export { calculateBmi };
