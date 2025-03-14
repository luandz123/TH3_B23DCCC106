import React, { useEffect, useState } from "react";
import { getAppointments } from "../../services/BAI_TH_3/BAI_2/appointmentService";

const Dashboard = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const data = await getAppointments();
        setAppointments(data);
    };

    return (
        <div>
            <h2>Thống kê</h2>
            <p>Tổng số lịch hẹn: {appointments.length}</p>
        </div>
    );
};

export default Dashboard;
