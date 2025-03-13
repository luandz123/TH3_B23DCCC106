import axios from 'axios';
import { Employee, Service, Schedule } from '@/models/bai1';

// URL backend (ví dụ: json‑server chạy tại http://localhost:5000)
const BASE_URL = 'http://localhost:5000';
const EMPLOYEES_ENDPOINT = `${BASE_URL}/nhan_vien`;
const SERVICES_ENDPOINT = `${BASE_URL}/dich_vu`;

// --- Chuyển đổi từ DB sang model cho nhân viên ---
function transformEmployeeFromDB(data: any): Employee {
  let schedules: Schedule[] = [];
  Object.entries(data.lich_lam_viec || {}).forEach(([day, timeValue]) => {
    if (timeValue === "nghi") return;
    if (Array.isArray(timeValue)) {
      timeValue.forEach((t: string) => {
        const parts = t.split("-");
        if (parts.length === 2)
          schedules.push({ day, start: parts[0], end: parts[1] });
      });
    } else if (typeof timeValue === 'string') {
      const parts = timeValue.split("-");
      if (parts.length === 2)
        schedules.push({ day, start: parts[0], end: parts[1] });
    }
  });
  return {
    id: data.id,
    name: data.ten,
    dailyLimit: data.so_khach_toi_da_moi_ngay,
    schedules
  };
}

// --- Chuyển đổi từ model sang DB cho nhân viên ---
function transformEmployeeToDB(employee: Employee): any {
  const lichLamViec: Record<string, any> = {};
  employee.schedules.forEach(schedule => {
    const shift = `${schedule.start}-${schedule.end}`;
    if (lichLamViec[schedule.day]) {
      if (Array.isArray(lichLamViec[schedule.day])) {
        lichLamViec[schedule.day].push(shift);
      } else {
        lichLamViec[schedule.day] = [lichLamViec[schedule.day], shift];
      }
    } else {
      lichLamViec[schedule.day] = shift;
    }
  });
  return {
    id: employee.id,
    ten: employee.name,
    so_khach_toi_da_moi_ngay: employee.dailyLimit,
    lich_lam_viec: lichLamViec
  };
}

// --- Chuyển đổi cho dịch vụ ---
function transformServiceFromDB(data: any): Service {
  return {
    id: data.id,
    name: data.ten,
    price: data.gia,
    duration: parseInt(data.thoi_gian_thuc_hien) // "30p" -> 30
  };
}

function transformServiceToDB(service: Service): any {
  return {
    id: service.id,
    ten: service.name,
    gia: service.price,
    thoi_gian_thuc_hien: `${service.duration}p`
  };
}

// --- API nhân viên ---
export async function getEmployees(): Promise<Employee[]> {
  try {
    const response = await axios.get(EMPLOYEES_ENDPOINT);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(transformEmployeeFromDB);
  } catch (error) {
    console.error('Lỗi getEmployees:', error);
    return [];
  }
}

export async function addEmployee(employee: Employee): Promise<Employee> {
  try {
    const payload = transformEmployeeToDB(employee);
    const response = await axios.post(EMPLOYEES_ENDPOINT, payload);
    return transformEmployeeFromDB(response.data);
  } catch (error) {
    console.error('Lỗi addEmployee:', error);
    throw error;
  }
}

export async function updateEmployee(employee: Employee): Promise<Employee> {
  try {
    const payload = transformEmployeeToDB(employee);
    const response = await axios.put(`${EMPLOYEES_ENDPOINT}/${employee.id}`, payload);
    return transformEmployeeFromDB(response.data);
  } catch (error) {
    console.error('Lỗi updateEmployee:', error);
    throw error;
  }
}

export async function deleteEmployee(employeeId: string): Promise<void> {
  try {
    await axios.delete(`${EMPLOYEES_ENDPOINT}/${employeeId}`);
  } catch (error) {
    console.error('Lỗi deleteEmployee:', error);
    throw error;
  }
}

// --- API dịch vụ ---
export async function getServices(): Promise<Service[]> {
  try {
    const response = await axios.get(SERVICES_ENDPOINT);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(transformServiceFromDB);
  } catch (error) {
    console.error('Lỗi getServices:', error);
    return [];
  }
}

export async function addService(service: Service): Promise<Service> {
  try {
    const payload = transformServiceToDB(service);
    const response = await axios.post(SERVICES_ENDPOINT, payload);
    return transformServiceFromDB(response.data);
  } catch (error) {
    console.error('Lỗi addService:', error);
    throw error;
  }
}

export async function updateService(service: Service): Promise<Service> {
  try {
    const payload = transformServiceToDB(service);
    const response = await axios.put(`${SERVICES_ENDPOINT}/${service.id}`, payload);
    return transformServiceFromDB(response.data);
  } catch (error) {
    console.error('Lỗi updateService:', error);
    throw error;
  }
}

export async function deleteService(serviceId: string): Promise<void> {
  try {
    await axios.delete(`${SERVICES_ENDPOINT}/${serviceId}`);
  } catch (error) {
    console.error('Lỗi deleteService:', error);
    throw error;
  }
}