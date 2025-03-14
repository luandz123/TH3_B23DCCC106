import { useState } from 'react';
import axios from 'axios';

// --- Định nghĩa kiểu dữ liệu ---
export interface Schedule {
  day: string;    // Ví dụ: "Thứ 2", "Thứ 3", ...
  start: string;  // Ví dụ: "09:00"
  end: string;    // Ví dụ: "17:00"
}

export interface Employee {
  id: string;
  name: string;
  dailyLimit: number; // Số khách tối đa phục vụ mỗi ngày
  schedules: Schedule[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // Thời gian thực hiện (phút)
}

// --- Custom hook quản lý state và thao tác dữ liệu cho Employee và Service ---
export const useBai1 = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Lấy danh sách nhân viên từ API (ví dụ: json-server chạy tại http://localhost:5000)
  const getEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/nhan_vien");
      setEmployees(response.data);
    } catch (error) {
      console.error("Lỗi getEmployees:", error);
    }
  };

  // Lấy danh sách dịch vụ từ API
  const getServices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dich_vu");
      setServices(response.data);
    } catch (error) {
      console.error("Lỗi getServices:", error);
    }
  };

  return {
    employees,
    setEmployees,
    services,
    setServices,
    selectedEmployee,
    setSelectedEmployee,
    selectedService,
    setSelectedService,
    isEdit,
    setIsEdit,
    getEmployees,
    getServices,
  };
};