import { useState, useEffect } from 'react';
import diaryService from './diaryService';
import { type NewDiary, type Diary } from './types';
import FlightDiary from './components/Diary';
import AddDiaryForm from './components/AddDiaryForm';
import { isAxiosError } from 'axios';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDiaries = async () => {
      const initialDiaries = await diaryService.getAll();
      setDiaries(initialDiaries);
    };

    fetchDiaries();
  }, []);

  const submitNewDiary = async (newDiary: NewDiary) => {
    try {
      const returnedDiary = await diaryService.create(newDiary);
      setDiaries(diaries.concat(returnedDiary));
    } catch (e: unknown) {
      if (isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === 'string') {
          console.error(e.response.data);
          setError(e.response.data);
        } else {
          setError('Unrecognized axios error');
        }
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    } finally {
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div>
      <AddDiaryForm error={error} onSubmit={submitNewDiary} />
      <h2>Diary Entries</h2>
      {diaries.map((diary) => (
        <FlightDiary diary={diary} />
      ))}
    </div>
  );
};

export default App;
