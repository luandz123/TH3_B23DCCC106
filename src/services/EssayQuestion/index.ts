import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const getQuestions = async () => {
  const res = await axios.get(`${BASE_URL}/cauHoi`);
  return res.data;
};

export const addQuestion = async (data: any) => {
  const res = await axios.post(`${BASE_URL}/cauHoi`, data);
  return res.data;
};

export const updateQuestion = async (id: number, data: any) => {
  const res = await axios.put(`${BASE_URL}/cauHoi/${id}`, data);
  return res.data;
};

export const deleteQuestion = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/cauHoi/${id}`);
  return res.data;
};

export const getSubjects = async () => {
  const res = await axios.get(`${BASE_URL}/monHoc`);
  return res.data;
};

export const getKnowledgeBlocks = async () => {
  const res = await axios.get(`${BASE_URL}/khoiKienThuc`);
  return res.data;
};