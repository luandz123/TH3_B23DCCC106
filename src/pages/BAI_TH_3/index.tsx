import React, { useEffect, useState } from 'react';
import { Tabs, Table, Button, Space, message } from 'antd';
import { 
  getEmployees, 
  addEmployee, 
  updateEmployee, 
  deleteEmployee, 
  getServices, 
  addService, 
  updateService, 
  deleteService 
} from '@/services/BAI_TH_3/BAI1';
import { Employee, Service, Schedule } from '@/models/bai1';
import EmployeeForm from './EmployeeForm';
import ServiceForm from './ServiceForm';

const { TabPane } = Tabs;

const BAI_TH_3: React.FC = () => {
  // Employee management states
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditEmployee, setIsEditEmployee] = useState(false);

  // Service management states
  const [services, setServices] = useState<Service[]>([]);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditService, setIsEditService] = useState(false);

  // Fetch initial data for employees and services
  useEffect(() => {
    fetchEmployees();
    fetchServices();
  }, []);

  // Employee CRUD operations
  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách nhân viên');
    }
  };

  const handleEmployeeSubmit = async (employee: Employee) => {
    try {
      if (isEditEmployee) {
        await updateEmployee(employee);
        message.success('Cập nhật nhân viên thành công');
      } else {
        await addEmployee(employee);
        message.success('Thêm nhân viên thành công');
      }
      await fetchEmployees();
      resetEmployeeForm();
    } catch (error) {
      message.error('Lỗi khi lưu nhân viên');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployee(id);
      message.success('Xóa nhân viên thành công');
      await fetchEmployees();
    } catch (error) {
      message.error('Lỗi khi xóa nhân viên');
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployee(true);
    setEmployeeModalVisible(true);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsEditEmployee(false);
    setEmployeeModalVisible(true);
  };

  const resetEmployeeForm = () => {
    setEmployeeModalVisible(false);
    setSelectedEmployee(null);
    setIsEditEmployee(false);
  };

  const employeeColumns = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Số khách/ngày', dataIndex: 'dailyLimit' },
    {
      title: 'Lịch làm việc',
      dataIndex: 'schedules',
      render: (schedules: Schedule[]) =>
        schedules?.map((sch, index) => (
          <div key={index}>
            {sch.day}: {sch.start} - {sch.end}
          </div>
        ))
    },
    {
      title: 'Hành động',
      render: (_: any, record: Employee) => (
        <Space>
          <Button type="link" onClick={() => handleEditEmployee(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDeleteEmployee(record.id)}>
            Xóa
          </Button>
        </Space>
      )
    }
  ];

  // Service CRUD operations
  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách dịch vụ');
    }
  };

  const handleServiceSubmit = async (service: Service) => {
    try {
      if (isEditService) {
        await updateService(service);
        message.success('Cập nhật dịch vụ thành công');
      } else {
        await addService(service);
        message.success('Thêm dịch vụ thành công');
      }
      await fetchServices();
      resetServiceForm();
    } catch (error) {
      message.error('Lỗi khi lưu dịch vụ');
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteService(id);
      message.success('Xóa dịch vụ thành công');
      await fetchServices();
    } catch (error) {
      message.error('Lỗi khi xóa dịch vụ');
    }
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsEditService(true);
    setServiceModalVisible(true);
  };

  const handleAddService = () => {
    setSelectedService(null);
    setIsEditService(false);
    setServiceModalVisible(true);
  };

  const resetServiceForm = () => {
    setServiceModalVisible(false);
    setSelectedService(null);
    setIsEditService(false);
  };

  const serviceColumns = [
    { title: 'Tên dịch vụ', dataIndex: 'name' },
    { title: 'Giá', dataIndex: 'price', render: (price: number) => `${price} đ` },
    { title: 'Thời gian (phút)', dataIndex: 'duration' },
    {
      title: 'Hành động',
      render: (_: any, record: Service) => (
        <Space>
          <Button type="link" onClick={() => handleEditService(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDeleteService(record.id)}>
            Xóa
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs defaultActiveKey="employee">
        <TabPane tab="Nhân viên" key="employee">
          <Button type="primary" style={{ marginBottom: 16 }} onClick={handleAddEmployee}>
            Thêm nhân viên
          </Button>
          <Table dataSource={employees} columns={employeeColumns} rowKey="id" />
        </TabPane>
        <TabPane tab="Dịch vụ" key="service">
          <Button type="primary" style={{ marginBottom: 16 }} onClick={handleAddService}>
            Thêm dịch vụ
          </Button>
          <Table dataSource={services} columns={serviceColumns} rowKey="id" />
        </TabPane>
      </Tabs>

      <EmployeeForm
        visible={employeeModalVisible}
        onCancel={resetEmployeeForm}
        onSubmit={handleEmployeeSubmit}
        isEdit={isEditEmployee}
        data={selectedEmployee || undefined}
      />

      <ServiceForm
        visible={serviceModalVisible}
        onCancel={resetServiceForm}
        onSubmit={handleServiceSubmit}
        isEdit={isEditService}
        data={selectedService || undefined}
      />
    </div>
  );
};

export default BAI_TH_3;