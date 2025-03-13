import React, { useEffect, useState } from "react";
import { getAppointments, addAppointment, deleteAppointment } from "../../services/BAI_TH_3/BAI_2/appointmentService";
import { getEmployees } from "../../services/BAI_TH_3/BAI_2/employeeService"
import { Table, Button, Modal, Form, Input, DatePicker, TimePicker, Select, message } from "antd";
import moment from "moment";
import title from "@/locales/vi-VN/global/title";
const { Option } = Select;
const AppointmentModal = () => {
    const [appointments, setAppointments] = useState([]);
    const [employee, setEmployee] = useState([])
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();



    useEffect(() => {
        fetchAppointments();
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true)
        const data = await getEmployees();
        console.log(data)
        setEmployee(data)
        setLoading(false)
    }
    const fetchAppointments = async () => {
        setLoading(true);
        const data = await getAppointments();
        console.log(data)
        setAppointments(data);
        setLoading(false);
    };


    const isDuplicateAppointment = (newAppt) => {
        return appointments.some(
            (appt) =>
                appt.id_nhan_vien === newAppt.id_nhan_vien &&
                appt.ngay === newAppt.ngay &&
                appt.gio === newAppt.gio
        );
    };

    const handleAddAppointment = async (values) => {
        const newAppt = {
            id: `lh${Date.now()}`,
            ...values,
            ngay: values.ngay.format("YYYY-MM-DD"),
            gio: values.gio.format("HH:mm"),
            trangThai: "cho_duyet",
        };
        if (isDuplicateAppointment(newAppt)) {
            message.error("Lịch hẹn bị trùng! Vui lòng chọn thời gian khác.");
            return;
        }
        await addAppointment(newAppt);
        setAppointments([...appointments, newAppt]);
        setModalVisible(false);
        form.resetFields()
        message.success("Đặt lịch thành công!");
    };
    return (<>
        <Button type="primary" onClick={() => {
            setModalVisible(true)
        }}> Đặt lịch hẹn</Button>
        <Modal
            title="Đặt lịch hẹn"
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
        >
            <Form form={form} onFinish={handleAddAppointment} layout="vertical">
                <Form.Item name="tenkhachhang" label="Tên khách hàng" rules={[{ required: true, message: "Nhập tên khách hàng" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="so_dien_thoai" label="Số điện thoại" rules={[{ required: true, message: "Nhập số điện thoại" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="id_nhan_vien" label="Nhân viên" rules={[{ required: true, message: "Chọn nhân viên" }]}>
                    <Select>
                        <Option value="nv001">Nguyễn Văn A</Option>
                        <Option value="nv002">Trần Thị B</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="id_dich_vu" label="Dịch vụ" rules={[{ required: true, message: "Chọn dịch vụ" }]}>
                    <Select>
                        <Option value="dv001">Cắt tóc nam</Option>
                        <Option value="dv002">Massage thư giãn</Option>
                        <Option value="dv003">Khám bệnh tổng quát</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="ngay" label="Ngày" rules={[{ required: true, message: "Chọn ngày" }]}>
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item name="gio" label="Giờ" rules={[{ required: true, message: "Chọn giờ" }]}>
                    <TimePicker format="HH:mm" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">✅ Xác nhận</Button>
                </Form.Item>
            </Form>
        </Modal>
    </>)
}
export default AppointmentModal