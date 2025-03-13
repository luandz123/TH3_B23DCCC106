import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { Service } from '@/models/bai1';

interface ServiceFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: Service) => void;
  isEdit: boolean;
  data?: Service;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ visible, onCancel, onSubmit, isEdit, data }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit && data) {
      // Nếu đang sửa, đưa dữ liệu cũ vào form
      form.setFieldsValue(data);
    } else {
      form.resetFields();
    }
  }, [isEdit, data, form, visible]);

  const handleOk = () => {
    form.validateFields().then(values => {
      // Nếu sửa, hợp nhất dữ liệu cũ với dữ liệu mới
      const service = isEdit && data ? { ...data, ...values } : values;
      onSubmit(service);
      form.resetFields();
    });
  };

  return (
    <Modal
      visible={visible}
      title={isEdit ? "Sửa dịch vụ" : "Thêm dịch vụ"}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="name" 
          label="Tên dịch vụ" 
          rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
        >
          <Input placeholder="Nhập tên dịch vụ" />
        </Form.Item>

        <Form.Item 
          name="price" 
          label="Giá" 
          rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            placeholder="Nhập giá dịch vụ"
            formatter={value => `${value} đ`}
            parser={((value: string | undefined) => value ? parseFloat(value.replace(/[^\d]/g, '')) : 0) as any}
          />
        </Form.Item>

        <Form.Item 
          name="duration" 
          label="Thời gian thực hiện (phút)" 
          rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            placeholder="Nhập thời gian thực hiện"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServiceForm;