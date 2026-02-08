import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercise } from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).send({ error: 'malformatted parameters' });
  }

  res.send({ weight, height, bmi: calculateBmi(height, weight) });
});

app.post('/exercises', (req, res) => {
  const { target, daily_exercises } = req.body;

  if (!target || !daily_exercises) {
    res.status(400).json({
      error: 'parameters missing',
    });
  }

  const hours: number[] = daily_exercises.map(Number);

  if (isNaN(Number(target)) || hours.some(isNaN)) {
    res.status(400).json({
      error: 'malformatted parameters',
    });
  }

  res.json(calculateExercise(hours, Number(target)));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
