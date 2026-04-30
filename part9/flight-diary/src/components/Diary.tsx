import type { Diary as DiaryEntry } from '../types';

type DiaryProps = {
  diary: DiaryEntry;
};

export const Diary = ({ diary }: DiaryProps) => (
  <div>
    <h3>{diary.date}</h3>
    <p>
      visibility: {diary.visibility}
      <br />
      weather: {diary.weather}
    </p>
  </div>
);

export default Diary;
