import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, InputNumber, Select } from 'antd';
import moment from 'moment';

const { Option } = Select;

interface ThongKeFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  isEdit: boolean;
  initialValues?: any;
  nhanVienList: any[];
  dichVuList: any[];
}

const ThongKeForm: React.FC<ThongKeFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  isEdit,
  initialValues,
  nhanVienList,
  dichVuList,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        ngay: initialValues.ngay ? moment(initialValues.ngay) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        ngay: values.ngay.format('YYYY-MM-DD'),
      };
      onSubmit(formattedValues);
    });
  };

  return (
    <Modal
      title={isEdit ? 'Cập nhật thống kê' : 'Thêm thống kê mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          tong_lich_hen: 0,
          hoan_thanh: 0,
          cho_duyet: 0,
          huy: 0,
          doanh_thu_nhan_vien: 0,
          doanh_thu_dich_vu: 0,
        }}
      >
        <Form.Item
          label="Ngày"
          name="ngay"
          rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
        
        <Form.Item label="Tổng số lịch hẹn" name="tong_lich_hen">
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item label="Số lịch hẹn hoàn thành" name="hoan_thanh">
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item label="Số lịch hẹn chờ duyệt" name="cho_duyet">
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item label="Số lịch hẹn bị hủy" name="huy">
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>

        <Form.Item label="Nhân viên" name="id_nhan_vien">
          <Select placeholder="Chọn nhân viên">
            {nhanVienList.map(nv => (
              <Option key={nv.id} value={nv.id}>
                {nv.ten}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Doanh thu nhân viên" name="doanh_thu_nhan_vien">
          <InputNumber style={{ width: '100%' }} min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
        </Form.Item>

        <Form.Item label="Dịch vụ" name="id_dich_vu">
          <Select placeholder="Chọn dịch vụ">
            {dichVuList.map(dv => (
              <Option key={dv.id} value={dv.id}>
                {dv.ten} - {dv.gia.toLocaleString('vi-VN')} đ
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Doanh thu dịch vụ" name="doanh_thu_dich_vu">
          <InputNumber style={{ width: '100%' }} min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThongKeForm;