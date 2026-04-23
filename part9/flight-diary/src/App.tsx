import { useState, useEffect } from 'react';
import diaryService from './diaryService';
import type { Diary } from './types';
import FlightDiary from './components/Diary';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    diaryService.getAll().then((initialDiaries) => setDiaries(initialDiaries));
  }, []);

  return (
    <div>
      <h2>Diary Entries</h2>
      {diaries.map((diary) => (
        <FlightDiary diary={diary} />
      ))}
    </div>
  );
};

export default App;
