import React, { useEffect, useState } from "react";
import { getAppointments, addAppointment, deleteAppointment } from "../../services/BAI_TH_3/BAI_2/appointmentService";
import { getEmployees } from "../../services/BAI_TH_3/BAI_2/employeeService"
import { Table, Button, Modal, Form, Input, DatePicker, TimePicker, Select, message } from "antd";
import moment from "moment";
import title from "@/locales/vi-VN/global/title";
import AppointmentModal from "./AppointmentModal";
const { Option } = Select;

const AppointmentList = () => {
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

    const handleDelete = async (id) => {
        await deleteAppointment(id);
        setAppointments(appointments.filter((appt) => appt.id !== id));
        message.success("Xóa lịch hẹn thành công!");
    };
    const columns = [
        {
            title: "Khách hàng",
            dataIndex: "tenkhachhang",
            key: "tenkhachhang",
        },
        {
            title: "Ngày",
            dataIndex: "ngay",
            key: "ngay",
        },
        {
            title: "Giờ",
            dataIndex: "gio",
            key: "gio",
        },
        {
            title: "Nhân viên",
            render: (record) => {
                console.log(record)
                const nhan_vien = employee.find((item) => item.id === record.id_nhan_vien);
                console.log(nhan_vien?.ten);
                return nhan_vien?.ten
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "trang_thai",
            key: "trang_thai",
            render: (text) => (
                <span style={{ color: text === "cho_duyet" ? "orange" : "green" }}>
                    {text === "cho_duyet" ? "Chờ duyệt" : "Đã xác nhận"}
                </span>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Button type="link" danger onClick={() => handleDelete(record.id)}>
                    Xóa
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h2>📅 Quản lý lịch hẹn</h2>
            <AppointmentModal />
            <Table columns={columns} dataSource={appointments} loading={loading} rowKey="id" style={{ marginTop: 20 }} />
        </div>
    );
};

export default AppointmentList;
