import type { Diary } from '../types';

type DiaryProps = {
  diary: Diary;
};

const Diary = ({ diary }: DiaryProps) => (
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
