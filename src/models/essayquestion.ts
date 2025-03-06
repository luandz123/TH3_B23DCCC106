import { useState } from 'react';
import { getQuestions } from '@/services/EssayQuestion';
import { message } from 'antd';

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [row, setRow] = useState<any>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const getData = async () => {
    try {
      const response = await getQuestions();
      setData(response);
    } catch (error) {
      console.error('Lỗi:', error);
      message.error('Không thể tải dữ liệu câu hỏi');
    }
  };

  return {
    data,
    setData,
    row,
    setRow,
    visible,
    setVisible,
    isEdit,
    setIsEdit,
    getData,
  };
};