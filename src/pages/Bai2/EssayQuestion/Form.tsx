import React, { useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useModel } from 'umi';
import { addQuestion, updateQuestion } from '@/services/EssayQuestion';
import { DIFFICULTY_LEVELS } from '@/constants/difficulty';

interface Subject {
  id: number;
  tenMon: string;
  maMon: string;
}

interface KnowledgeBlock {
  id: number;
  tenKhoi: string;
}

interface FormProps {
  subjects: Subject[];
  knowledgeBlocks: KnowledgeBlock[];
}

const FormEssayQuestion: React.FC<FormProps> = ({
  subjects,
  knowledgeBlocks,
}) => {
  const [form] = Form.useForm();
  const { getData, row, isEdit, setVisible } = useModel('essayquestion');

  useEffect(() => {
    if (row && isEdit) {
      form.setFieldsValue(row);
    }
  }, [row, form, isEdit]);

  const onFinish = async (values: any) => {
    try {
      if (isEdit && row) {
        await updateQuestion(row.id, values);
        message.success('Cập nhật câu hỏi thành công!');
      } else {
        await addQuestion(values);
        message.success('Thêm câu hỏi thành công!');
      }
      getData();
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="noiDung"
        label="Nội dung câu hỏi"
        rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="monHocId"
        label="Môn học"
        rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
      >
        <Select placeholder="Chọn môn học">
          {subjects.map(subject => (
            <Select.Option key={subject.id} value={subject.id}>
              {subject.tenMon}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="khoiKienThucId"
        label="Khối kiến thức"
        rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
      >
        <Select placeholder="Chọn khối kiến thức">
          {knowledgeBlocks.map(block => (
            <Select.Option key={block.id} value={block.id}>
              {block.tenKhoi}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="mucDo"
        label="Mức độ"
        rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}
      >
        <Select placeholder="Chọn mức độ">
          {DIFFICULTY_LEVELS.map(level => (
            <Select.Option key={level.value} value={level.value}>
              {level.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? 'Cập nhật' : 'Thêm mới'}
        </Button>
        <Button 
          style={{ marginLeft: 8 }} 
          onClick={() => setVisible(false)}
        >
          Hủy
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormEssayQuestion;