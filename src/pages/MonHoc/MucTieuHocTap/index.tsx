import React, { useEffect, useState } from 'react';
import { Card, List, Form, Input, Button, InputNumber, Modal, message, Typography, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface StudyTarget {
  id: number;
  subjectName: string;
  monthlyGoal: number;
  currentProgress: number;
}

interface Subject {
  id: number;
  name: string;
  MHP: string;
}

const localStorageKeyTargets = 'study_targets';
const localStorageKeySubjects = 'study_subjects';

const MucTieuHocTap: React.FC = () => {
  const [targets, setTargets] = useState<StudyTarget[]>([]);
  const [subjectInput, setSubjectInput] = useState<string>('');
  // Không khởi tạo mặc định là 0, thay vào đó dùng undefined (để hiển thị ô trống)
  const [goalInput, setGoalInput] = useState<number | undefined>(undefined);
  const [progressInput, setProgressInput] = useState<number | undefined>(undefined);
  const [editingTarget, setEditingTarget] = useState<StudyTarget | null>(null);
  const [form] = Form.useForm();

  // Danh mục môn học (để chọn trong mục tiêu học tập)
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);

  // Load dữ liệu mục tiêu từ localStorage khi component mount
  useEffect(() => {
    const storedTargets = localStorage.getItem(localStorageKeyTargets);
    if (storedTargets) {
      setTargets(JSON.parse(storedTargets));
    }
  }, []);

  // Load danh mục môn học từ localStorage để sử dụng cho Select
  useEffect(() => {
    const storedSubjects = localStorage.getItem(localStorageKeySubjects);
    if (storedSubjects) {
      setAvailableSubjects(JSON.parse(storedSubjects));
    }
  }, []);

  // Lưu dữ liệu mục tiêu vào localStorage khi targets thay đổi
  useEffect(() => {
    localStorage.setItem(localStorageKeyTargets, JSON.stringify(targets));
  }, [targets]);

  // Thêm mục tiêu mới
  const addTarget = () => {
    if (!subjectInput.trim()) {
      message.error("Vui lòng chọn môn học!");
      return;
    }
    if (goalInput === undefined) {
      message.error("Vui lòng nhập mục tiêu học tập (giờ)!");
      return;
    }
    if (progressInput === undefined) {
      message.error("Vui lòng nhập tiến độ đã học (giờ)!");
      return;
    }
    const newTarget: StudyTarget = {
      id: Date.now(),
      subjectName: subjectInput,
      monthlyGoal: goalInput,
      currentProgress: progressInput,
    };
    setTargets([...targets, newTarget]);
    setSubjectInput('');
    // Đặt về undefined để ô hiển thị trống thay vì 0
    setGoalInput(undefined);
    setProgressInput(undefined);
    message.success("Thêm mục tiêu học tập thành công!");
  };

  // Xóa mục tiêu
  const deleteTarget = (id: number) => {
    setTargets(targets.filter(t => t.id !== id));
    message.success("Xóa mục tiêu thành công!");
  };

  // Bắt đầu chỉnh sửa mục tiêu
  const startEdit = (target: StudyTarget) => {
    setEditingTarget(target);
    form.setFieldsValue({
      subjectName: target.subjectName,
      monthlyGoal: target.monthlyGoal,
      currentProgress: target.currentProgress,
    });
  };

  // Lưu chỉnh sửa
  const saveEdit = async () => {
    try {
      const values = await form.validateFields();
      if (editingTarget) {
        setTargets(targets.map(t =>
          t.id === editingTarget.id ? { ...t, ...values } : t
        ));
        message.success("Cập nhật mục tiêu học tập thành công!");
      }
      setEditingTarget(null);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  // Hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingTarget(null);
    form.resetFields();
  };

  // Hiển thị trạng thái của mục tiêu
  const getStatus = (goal: number, progress: number) => {
    if (goal === 0) return <Text type="secondary">Chưa đặt mục tiêu</Text>;
    return progress >= goal 
      ? <Text strong style={{ color: 'green' }}>Đạt</Text>
      : <Text strong style={{ color: 'red' }}>Chưa đạt</Text>;
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
          Mục tiêu học tập
        </Title>
        <Select
          placeholder="Chọn môn học"
          value={subjectInput || undefined}
          onChange={(value) => setSubjectInput(value)}
          style={{ width: '100%', marginBottom: 12 }}
          options={availableSubjects.map((subj) => ({
            value: subj.name,
            label: subj.name,
          }))}
          allowClear
        />
        <InputNumber
          placeholder="Nhập mục tiêu học tập (giờ)"
          value={goalInput}
          onChange={(value) => setGoalInput(value as number | undefined)}
          style={{ width: '100%', marginBottom: 12 }}
        />
        <InputNumber
          placeholder="Nhập tiến độ đã học (giờ)"
          value={progressInput}
          onChange={(value) => setProgressInput(value as number | undefined)}
          style={{ width: '100%', marginBottom: 16 }}
        />
        <Button
          type="primary"
          onClick={addTarget}
          style={{
            width: '100%',
            marginBottom: 16,
            background: 'linear-gradient(90deg, #4b6cb7, #182848)',
            border: 'none',
          }}
          icon={<PlusCircleOutlined />}
        >
          Thêm mục tiêu học tập
        </Button>

        <List
          dataSource={targets}
          locale={{ emptyText: "Chưa có mục tiêu nào" }}
          renderItem={target => (
            <List.Item
              style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}
              actions={[
                <Button type="link" icon={<EditOutlined />} onClick={() => startEdit(target)} />,
                <Button type="link" danger icon={<DeleteOutlined />} onClick={() => deleteTarget(target.id)} />,
              ]}
            >
              <div style={{ fontSize: 16 }}>
                <Text strong>{target.subjectName}</Text> &nbsp;|&nbsp;
                <Text>Mục tiêu: {target.monthlyGoal} giờ</Text> &nbsp;-&nbsp;
                <Text>Tiến độ: {target.currentProgress} giờ</Text> &nbsp;=&nbsp;
                {getStatus(target.monthlyGoal, target.currentProgress)}
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
          title="Chỉnh sửa mục tiêu học tập"
          visible={!!editingTarget}
          onOk={saveEdit}
          onCancel={cancelEdit}
          okText="Lưu thay đổi"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Tên môn học"
              name="subjectName"
              rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
            >
              <Select
                placeholder="Chọn môn học"
                options={availableSubjects.map((subj) => ({
                  value: subj.name,
                  label: subj.name,
                }))}
                allowClear
              />
            </Form.Item>
            <Form.Item
              label="Mục tiêu (giờ)"
              name="monthlyGoal"
              rules={[{ required: true, message: 'Vui lòng nhập mục tiêu học tập' }]}
            >
              <InputNumber placeholder="Nhập mục tiêu (giờ)" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Tiến độ (giờ)"
              name="currentProgress"
              rules={[{ required: true, message: 'Vui lòng nhập tiến độ học tập' }]}
            >
              <InputNumber placeholder="Nhập tiến độ (giờ)" style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default MucTieuHocTap;