import { useState, useEffect } from 'react';
import diaryService from './diaryService';
import { type NewDiary, type Diary } from './types';
import FlightDiary from './components/Diary';
import AddNewDiary from './components/NewDiary';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    diaryService.getAll().then((initialDiaries) => setDiaries(initialDiaries));
  }, []);

  const diaryCreation = (newDiary: NewDiary) => {
    diaryService.create(newDiary).then((returnedDiary) => {
      setDiaries(diaries.concat(returnedDiary));
    });
  };

  return (
    <div>
      <AddNewDiary onSubmit={diaryCreation} />
      <h2>Diary Entries</h2>
      {diaries.map((diary) => (
        <FlightDiary diary={diary} />
      ))}
    </div>
  );
};

export default App;
