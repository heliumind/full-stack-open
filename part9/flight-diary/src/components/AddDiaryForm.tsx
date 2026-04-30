import { useState } from 'react';
import type { NewDiary } from '../types';

type Props = { error: string; onSubmit: (newDiary: NewDiary) => void };

const AddDiaryForm = ({ error, onSubmit }: Props) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState('');
  const [visibility, setVisibility] = useState('');
  const [comment, setComment] = useState('');

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      date,
      weather,
      visibility,
      comment,
    });
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <div style={{ color: 'red' }}>{error}</div>
      <form onSubmit={addDiary}>
        <div>
          date
          <input
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          weather
          <input
            value={weather}
            onChange={({ target }) => setWeather(target.value)}
          />
        </div>
        <div>
          visibility
          <input
            value={visibility}
            onChange={({ target }) => setVisibility(target.value)}
          />
        </div>
        <div>
          comment
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default AddDiaryForm;
