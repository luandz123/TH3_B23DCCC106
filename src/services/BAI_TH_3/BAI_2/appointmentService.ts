import axios from "axios";
const API_URL = "http://localhost:5000/lich_hen";

export const getAppointments = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addAppointment = async (appointment: any) => {
    const response = await axios.post(API_URL, appointment);
    return response.data;
};

export const updateAppointmentStatus = async (id: any, status: any) => {
    await axios.patch(`${API_URL}/${id}`, { trangThai: status });
};

export const deleteAppointment = async (id: any) => {
    await axios.delete(`${API_URL}/${id}`);
};
