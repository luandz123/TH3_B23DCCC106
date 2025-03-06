import React, { useEffect, useState } from 'react';
import { List, Button, Input, Modal, Form, message, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Subject {
  id: number;
  name: string;
  MHP: string;
}

const localStorageKey = 'study_subjects';

const DanhMucMonHoc: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [input, setInput] = useState('');
  const [inputMHP, setInputMHP] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [form] = Form.useForm();

  // Load danh mục môn học từ localStorage khi component mount
  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      setSubjects(JSON.parse(stored));
    }
  }, []);

  // Lưu danh mục môn học vào localStorage khi subjects thay đổi
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(subjects));
  }, [subjects]);

  // Thêm môn học mới
  const addSubject = () => {
    if (!input.trim()) {
      message.error('Tên môn học không được để trống!');
      return;
    }
    const newSubject: Subject = { id: Date.now(), name: input, MHP: inputMHP };
    setSubjects([...subjects, newSubject]);
    setInput('');      // Clear input tên môn học
    setInputMHP('');   // Clear input mã học phần
    message.success('Thêm môn học thành công!');
  };

  // Xóa môn học
  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
    message.success('Xóa môn học thành công!');
  };

  // Bắt đầu sửa: hiển thị modal sửa với thông tin của môn học đang chọn
  const startEdit = (subject: Subject) => {
    setEditingSubject(subject);
    form.setFieldsValue({ name: subject.name, MHP: subject.MHP });
  };

  // Lưu thay đổi sau khi sửa
  const saveEdit = async () => {
    try {
      const values = await form.validateFields();
      if (editingSubject) {
        setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, name: values.name, MHP: values.MHP } : s));
        message.success('Cập nhật môn học thành công!');
      }
      setEditingSubject(null);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  // Hủy chỉnh sửa môn học
  const cancelEdit = () => {
    setEditingSubject(null);
    form.resetFields();
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
      }}
    >
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
        }}
        bodyStyle={{ padding: 24 }}
      >
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: 24 }}>
          Quản lý danh mục môn học
        </h1>
        <Input
          placeholder="Nhập tên môn học"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={addSubject}
          style={{ marginBottom: 12, borderRadius: 4 }}
        />
        <Input
          placeholder="Nhập mã học phần"
          value={inputMHP}
          onChange={(e) => setInputMHP(e.target.value)}
          onPressEnter={addSubject}
          style={{ marginBottom: 12, borderRadius: 4 }}
        />
        <Button
          type="primary"
          onClick={addSubject}
          style={{
            width: '100%',
            marginBottom: 16,
            background: 'linear-gradient(90deg, #4b6cb7, #182848)',
            border: 'none',
          }}
        >
          Thêm môn học
        </Button>

        <List
          dataSource={subjects}
          locale={{ emptyText: "Chưa có môn học nào" }}
          renderItem={subject => (
            <List.Item
              style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => startEdit(subject)}
                />,
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deleteSubject(subject.id)}
                />,
              ]}
            >
              <div style={{ fontSize: 16 }}>
                <strong style={{ color: '#182848' }}>{subject.name}</strong>
                &nbsp;|&nbsp;
                <em style={{ color: '#4b6cb7' }}>{subject.MHP}</em>
              </div>
            </List.Item>
          )}
          style={{
            background: '#fff',
            borderRadius: 4,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        />

        <Modal
          title="Sửa môn học"
          visible={!!editingSubject}
          onOk={saveEdit}
          onCancel={cancelEdit}
          okText="Lưu thay đổi"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Tên môn học"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
            >
              <Input placeholder="Nhập tên môn học" />
            </Form.Item>
            <Form.Item
              label="Mã học phần"
              name="MHP"
              rules={[{ required: true, message: 'Vui lòng nhập mã học phần' }]}
            >
              <Input placeholder="Nhập mã học phần" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default DanhMucMonHoc;