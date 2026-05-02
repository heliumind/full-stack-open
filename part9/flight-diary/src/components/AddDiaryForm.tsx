import { useState } from 'react';
import { type NewDiary, Weather, Visibility } from '../types';

type Props = { error: string; onSubmit: (newDiary: NewDiary) => void };

const AddDiaryForm = ({ error, onSubmit }: Props) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState(Weather.Cloudy);
  const [visibility, setVisibility] = useState(Visibility.Good);
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
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          weather &nbsp;
          {Object.values(Weather).map((weather) => (
            <span>
              <label>{weather.toString()}</label>
              <input
                type="radio"
                name="weather"
                onChange={() => setWeather(weather)}
              />
            </span>
          ))}
        </div>
        <div>
          visibility &nbsp;
          {Object.values(Visibility).map((visibility) => (
            <span>
              <label>{visibility.toString()}</label>
              <input
                type="radio"
                name="weather"
                onChange={() => setVisibility(visibility)}
              />
            </span>
          ))}
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
