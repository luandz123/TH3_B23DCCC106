import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, Space, Select, TimePicker } from 'antd';
import { Employee } from '@/models/bai1';
import type { Moment } from 'moment';
import moment from 'moment';

interface EmployeeFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: Employee) => void;
  isEdit: boolean;
  data?: Employee;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ visible, onCancel, onSubmit, isEdit, data }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit && data) {
      // Chuyển các giá trị giờ từ chuỗi sang moment để TimePicker hiển thị đúng
      const schedulesWithMoment = (data.schedules || []).map(s => ({
        ...s,
        start: moment(s.start, "HH:mm"),
        end: moment(s.end, "HH:mm")
      }));
      form.setFieldsValue({ ...data, schedules: schedulesWithMoment });
    } else {
      form.resetFields();
    }
  }, [isEdit, data, form, visible]);

  const handleOk = () => {
    form.validateFields().then(values => {
      // Chuyển moment về chuỗi "HH:mm" trước khi submit
      const schedules = (values.schedules || []).map((s: { day: string; start: Moment; end: Moment }) => ({
        ...s,
        start: s.start.format("HH:mm"),
        end: s.end.format("HH:mm")
      }));
      // Nếu ở chế độ sửa, hợp nhất data cũ với dữ liệu mới để giữ lại các trường như id
      const employee = isEdit && data ? { ...data, ...values, schedules } : { ...values, schedules };
      onSubmit(employee);
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={visible}
      title={isEdit ? "Sửa nhân viên" : "Thêm nhân viên"}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="name" 
          label="Tên" 
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item 
          name="dailyLimit" 
          label="Số khách/ngày" 
          rules={[{ required: true, message: 'Vui lòng nhập số khách' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số khách" />
        </Form.Item>
        <Form.List name="schedules">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'day']}
                    fieldKey={[(fieldKey ?? name), 'day']}
                    rules={[{ required: true, message: 'Chọn ngày' }]}
                  >
                    <Select style={{ width: 120 }} placeholder="Chọn ngày">
                      <Select.Option value="Thứ 2">Thứ 2</Select.Option>
                      <Select.Option value="Thứ 3">Thứ 3</Select.Option>
                      <Select.Option value="Thứ 4">Thứ 4</Select.Option>
                      <Select.Option value="Thứ 5">Thứ 5</Select.Option>
                      <Select.Option value="Thứ 6">Thứ 6</Select.Option>
                      <Select.Option value="Thứ 7">Thứ 7</Select.Option>
                      <Select.Option value="Chủ nhật">Chủ nhật</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'start']}
                    fieldKey={[(fieldKey ?? name), 'start']}
                    rules={[{ required: true, message: 'Chọn giờ bắt đầu' }]}
                  >
                    <TimePicker format="HH:mm" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'end']}
                    fieldKey={[(fieldKey ?? name), 'end']}
                    rules={[{ required: true, message: 'Chọn giờ kết thúc' }]}
                  >
                    <TimePicker format="HH:mm" />
                  </Form.Item>
                  <Button type="link" onClick={() => remove(name)}>Xóa</Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Thêm lịch làm việc
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default EmployeeForm;