interface MultiplyValues {
  value1: number;
  value2: number;
}

interface ExerciseValues {
  target: number;
  hours: number[];
}

export const parseBmiArguments = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const parseExArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) {
    throw new Error('Not enough arguments');
  }

  const inputs = args.slice(2).map(Number);
  if (inputs.some(isNaN)) {
    throw new Error('Provided values were not numbers!');
  }

  return {
    target: inputs[0],
    hours: inputs.slice(1),
  };
};
