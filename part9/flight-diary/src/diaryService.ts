import axios from 'axios';
import type { Diary, NewDiary } from './types';

const baseUrl = 'http://localhost:3000/api/diaries';

const getAll = async () => {
  const { data } = await axios.get<Diary[]>(baseUrl);
  return data;
};

const create = async (object: NewDiary) => {
  const { data } = await axios.post<Diary>(baseUrl, object);
  return data;
};

export default { getAll, create };
