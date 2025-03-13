import React from "react";
import AppointmentList from "./AppointmentList";
import Dashboard from "./Dashboard";

function App() {
    return (
        <div>
            <h1>Hệ Thống Đặt Lịch</h1>
            <Dashboard />
            <AppointmentList />
        </div>
    );
}
export default App;
