import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Space, Divider } from 'antd';
import { useModel } from 'umi';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { DIFFICULTY_LEVELS } from '@/constants/difficulty';
import axios from 'axios';

const { Option } = Select;
const BASE_URL = 'http://localhost:3000';

const FormExam: React.FC = () => {
  const [form] = Form.useForm();
  const { row, isEdit, createExam, updateExam, setVisible } = useModel('exammanagement');
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [knowledgeBlocks, setKnowledgeBlocks] = useState<any[]>([]);

  // Load subjects and knowledge blocks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, blocksRes] = await Promise.all([
          axios.get(`${BASE_URL}/monHoc`),
          axios.get(`${BASE_URL}/khoiKienThuc`)
        ]);
        setSubjects(subjectsRes.data || []);
        setKnowledgeBlocks(blocksRes.data || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Set form values if editing
  useEffect(() => {
    if (isEdit && row) {
      form.setFieldsValue({
        tenDeThi: row.tenDeThi,
        monHocId: row.monHocId,
        moTa: row.moTa,
        thoiGian: row.thoiGian,
        cauTruc: row.cauTruc || [{}]
      });
      setSelectedSubject(row.monHocId);
    } else {
      form.resetFields();
      setSelectedSubject(null);
    }
  }, [isEdit, row, form]);

  const onFinish = (values: any) => {
    if (isEdit) {
      updateExam(values);
    } else {
      createExam(values);
    }
  };

  const handleSubjectChange = (value: number) => {
    setSelectedSubject(value);
    form.setFieldsValue({ cauTruc: [{}] });
  };

  // Filter knowledge blocks by subject if needed
  const filteredBlocks = selectedSubject 
    ? knowledgeBlocks.filter(block => block.monHocId === selectedSubject)
    : knowledgeBlocks;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="tenDeThi"
        label="Tên đề thi"
        rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
      >
        <Input placeholder="Nhập tên đề thi" />
      </Form.Item>

      <Form.Item
        name="monHocId"
        label="Môn học"
        rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
      >
        <Select placeholder="Chọn môn học" onChange={(value) => handleSubjectChange(value as number)}>
          {subjects.map((subject) => (
            <Option key={subject.id} value={subject.id}>
              {subject.tenMon}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="moTa"
        label="Mô tả"
      >
        <Input.TextArea placeholder="Mô tả về đề thi" rows={3} />
      </Form.Item>

      <Form.Item
        name="thoiGian"
        label="Thời gian làm bài (phút)"
        rules={[{ required: true, message: 'Vui lòng nhập thời gian làm bài' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập thời gian làm bài (phút)" />
      </Form.Item>

      <Divider orientation="left">Cấu trúc đề thi</Divider>

      <Form.List name="cauTruc" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'khoiKienThucId']}
                  rules={[{ required: true, message: 'Chọn khối kiến thức' }]}
                >
                  <Select 
                    placeholder="Khối kiến thức" 
                    style={{ width: 200 }}
                    disabled={!selectedSubject}
                  >
                    {filteredBlocks.map((block) => (
                      <Option key={block.id} value={block.id}>
                        {block.tenKhoi}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item
                  {...restField}
                  name={[name, 'mucDo']}
                  rules={[{ required: true, message: 'Chọn mức độ' }]}
                >
                  <Select placeholder="Mức độ" style={{ width: 150 }}>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <Option key={level.value} value={level.value}>
                        {level.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                
                <Form.Item
                  {...restField}
                  name={[name, 'soCau']}
                  rules={[{ required: true, message: 'Nhập số câu' }]}
                >
                  <InputNumber min={1} placeholder="Số câu" style={{ width: 100 }} />
                </Form.Item>
                
                {fields.length > 1 ? (
                  <MinusCircleOutlined onClick={() => remove(name)} />
                ) : null}
              </Space>
            ))}
            
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                disabled={!selectedSubject}
              >
                Thêm cấu trúc
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <div className='form-footer'>
        <Button type="primary" htmlType="submit">
          {isEdit ? 'Cập nhật' : 'Tạo đề thi'}
        </Button>
        <Button onClick={() => setVisible(false)}>Hủy</Button>
      </div>
    </Form>
  );
};

export default FormExam;