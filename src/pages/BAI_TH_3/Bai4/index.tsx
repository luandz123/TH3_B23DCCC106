import React, { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Space, DatePicker, Select, Row, Col, Tabs, Statistic, message, Popconfirm, Form, Modal, Input, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';
import { Column } from '@ant-design/charts';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const ThongKeIndexPage: React.FC = () => {
  // State management
  const [visible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [filterDate, setFilterDate] = useState<[moment.Moment, moment.Moment]>([moment().subtract(30, 'days'), moment()]);
  const [filterNhanVien, setFilterNhanVien] = useState<string | undefined>(undefined);
  const [filterDichVu, setFilterDichVu] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();

  // Connect to model using useModel
  const { initialState } = useModel('@@initialState');
  
  // Mock data from db.json
  const [thongKe, setThongKe] = useState<any>(null);
  const [nhanVienList, setNhanVienList] = useState<any[]>([]);
  const [dichVuList, setDichVuList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real app, we would fetch from API
      // For now, we'll simulate loading from db.json
      const response = await fetch('/db.json');
      const data = await response.json();
      
      setNhanVienList(data.nhan_vien || []);
      setDichVuList(data.dich_vu || []);
      setThongKe(data.thong_ke || {});
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Có lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format data for tables and charts
  const thongKeTheoNgayData = useMemo(() => {
    if (!thongKe?.thong_ke_lich_hen?.theo_ngay) return [];

    return Object.entries(thongKe.thong_ke_lich_hen.theo_ngay)
      .filter(([ngay]) => {
        // Apply date filter
        if (filterDate && filterDate[0] && filterDate[1]) {
          const date = moment(ngay);
          return date.isBetween(filterDate[0], filterDate[1], 'day', '[]');
        }
        return true;
      })
      .map(([ngay, data]: [string, any]) => {
        // Calculate revenue per employee for this day
        const nhanVienDoanhThu: Record<string, number> = {};
        
        if (thongKe?.thong_ke_doanh_thu?.theo_nhan_vien) {
          nhanVienList.forEach(nv => {
            // Simulate per-day revenue by distributing the total
            const nhanVienData = thongKe.thong_ke_doanh_thu.theo_nhan_vien[nv.id];
            if (nhanVienData) {
              // Simple distribution algorithm - just for demo
              const dayRatio = data.tong_so / 
                Object.values(thongKe.thong_ke_lich_hen.theo_ngay).reduce(
                  (sum: number, item: any) => sum + item.tong_so, 0
                );
              nhanVienDoanhThu[`doanh_thu_${nv.id}`] = Math.round(nhanVienData.tong_doanh_thu * dayRatio);
            } else {
              nhanVienDoanhThu[`doanh_thu_${nv.id}`] = 0;
            }
          });
        }

        // Calculate total revenue for this day
        const tongDoanhThu = Object.values(nhanVienDoanhThu).reduce(
          (sum: number, val: number) => sum + val, 0
        );

        return {
          key: ngay,
          ngay,
          tong_lich_hen: data.tong_so,
          hoan_thanh: data.hoan_thanh,
          cho_duyet: data.cho_duyet,
          huy: data.huy,
          tong_doanh_thu: tongDoanhThu,
          ...nhanVienDoanhThu
        };
      })
      .filter(record => {
        // Apply employee filter
        if (filterNhanVien) {
          const key = `doanh_thu_${filterNhanVien}`;
          return record[key] > 0;
        }
        return true;
      })
      .sort((a, b) => moment(a.ngay).diff(moment(b.ngay)));
  }, [thongKe, nhanVienList, filterDate, filterNhanVien]);

  // Thống kê doanh thu theo dịch vụ
  const thongKeDoanhThuTheoDichVuData = useMemo(() => {
    if (!thongKe?.thong_ke_doanh_thu?.theo_dich_vu) return [];

    return Object.entries(thongKe.thong_ke_doanh_thu.theo_dich_vu)
      .filter(([idDichVu]) => {
        if (filterDichVu) {
          return idDichVu === filterDichVu;
        }
        return true;
      })
      .map(([idDichVu, data]: [string, any]) => {
        const dichVu = dichVuList.find(dv => dv.id === idDichVu) || { ten: idDichVu, gia: 0 };
        
        return {
          key: idDichVu,
          id_dich_vu: idDichVu,
          ten_dich_vu: dichVu.ten,
          gia: dichVu.gia,
          tong_doanh_thu: data.tong_doanh_thu,
          so_lan: data.so_lan,
          trung_binh: data.so_lan > 0 ? Math.round(data.tong_doanh_thu / data.so_lan) : 0
        };
      })
      .sort((a, b) => b.tong_doanh_thu - a.tong_doanh_thu);
  }, [thongKe, dichVuList, filterDichVu]);

  // Tính tổng các cột
  const tableFooter = () => {
    const totals = {
      tong_lich_hen: 0,
      hoan_thanh: 0,
      huy: 0,
      cho_duyet: 0,
      tong_doanh_thu: 0,
    };

    // Tính tổng các trường cố định
    thongKeTheoNgayData.forEach(item => {
      totals.tong_lich_hen += item.tong_lich_hen || 0;
      totals.hoan_thanh += item.hoan_thanh || 0;
      totals.huy += item.huy || 0;
      totals.cho_duyet += item.cho_duyet || 0;
      totals.tong_doanh_thu += item.tong_doanh_thu || 0;
    });

    // Tính tổng cho từng nhân viên
    const nhanVienTotals: Record<string, number> = {};
    nhanVienList.forEach(nv => {
      const key = `doanh_thu_${nv.id}`;
      nhanVienTotals[key] = thongKeTheoNgayData.reduce((sum, item) => sum + (item[key] || 0), 0);
    });

    return [
      {
        key: 'total',
        ngay: 'Tổng cộng',
        tong_lich_hen: totals.tong_lich_hen,
        hoan_thanh: totals.hoan_thanh,
        huy: totals.huy,
        cho_duyet: totals.cho_duyet,
        tong_doanh_thu: totals.tong_doanh_thu,
        ...nhanVienTotals,
      },
    ];
  };

  // Cấu hình cột bảng thống kê theo ngày
  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'ngay',
      key: 'ngay',
      width: 120,
    },
    {
      title: 'Tổng lịch hẹn',
      dataIndex: 'tong_lich_hen',
      key: 'tong_lich_hen',
      width: 120,
      sorter: (a: any, b: any) => a.tong_lich_hen - b.tong_lich_hen,
    },
    {
      title: 'Hoàn thành',
      dataIndex: 'hoan_thanh',
      key: 'hoan_thanh',
      width: 120,
    },
    {
      title: 'Chờ duyệt',
      dataIndex: 'cho_duyet',
      key: 'cho_duyet',
      width: 120,
    },
    {
      title: 'Hủy',
      dataIndex: 'huy',
      key: 'huy',
      width: 120,
    },
    {
      title: 'Tổng doanh thu',
      dataIndex: 'tong_doanh_thu',
      key: 'tong_doanh_thu',
      width: 150,
      render: (value: number) => 
        <span>{value?.toLocaleString('vi-VN')} đ</span>,
      sorter: (a: any, b: any) => a.tong_doanh_thu - b.tong_doanh_thu,
    },
    ...nhanVienList.map(nv => ({
      title: `DT ${nv.ten}`,
      dataIndex: `doanh_thu_${nv.id}`,
      key: `doanh_thu_${nv.id}`,
      width: 140,
      render: (value: number) => 
        <span>{value?.toLocaleString('vi-VN')} đ</span>
    })),
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (text: string, record: any) => (
        record.ngay !== 'Tổng cộng' && (
          <Space size="small">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa?"
              onConfirm={() => handleDelete(record)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Space>
        )
      ),
    },
  ];

  // Cấu hình bảng thống kê doanh thu theo dịch vụ
  const dichVuColumns = [
    {
      title: 'Mã dịch vụ',
      dataIndex: 'id_dich_vu',
      key: 'id_dich_vu',
    },
    {
      title: 'Tên dịch vụ',
      dataIndex: 'ten_dich_vu',
      key: 'ten_dich_vu',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'gia',
      key: 'gia',
      render: (value: number) => 
        <span>{value?.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'Số lần',
      dataIndex: 'so_lan',
      key: 'so_lan',
    },
    {
      title: 'Tổng doanh thu',
      dataIndex: 'tong_doanh_thu',
      key: 'tong_doanh_thu',
      render: (value: number) => 
        <span>{value?.toLocaleString('vi-VN')} đ</span>,
      sorter: (a: any, b: any) => a.tong_doanh_thu - b.tong_doanh_thu,
    },
    {
      title: 'Trung bình/lần',
      dataIndex: 'trung_binh',
      key: 'trung_binh',
      render: (value: number) => 
        <span>{value?.toLocaleString('vi-VN')} đ</span>,
    },
  ];

  // Chart configurations
  const configChart = {
    data: thongKeTheoNgayData,
    xField: 'ngay',
    yField: 'tong_doanh_thu',
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      ngay: { alias: 'Ngày' },
      tong_doanh_thu: {
        alias: 'Doanh thu',
        formatter: (v: number) => `${v.toLocaleString('vi-VN')} đ`,
      },
    },
    color: '#1890ff',
  };

  const configPieChart = {
    appendPadding: 10,
    data: thongKeDoanhThuTheoDichVuData,
    angleField: 'tong_doanh_thu',
    colorField: 'ten_dich_vu',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  // Modal Form Handlers
  const handleAdd = () => {
    form.resetFields();
    setIsEdit(false);
    setCurrentRecord(null);
    setVisible(true);
  };

  const handleEdit = (record: any) => {
    form.setFieldsValue({
      ngay: record.ngay,
      tong_lich_hen: record.tong_lich_hen,
      hoan_thanh: record.hoan_thanh,
      cho_duyet: record.cho_duyet,
      huy: record.huy,
      tong_doanh_thu: record.tong_doanh_thu,
      ...nhanVienList.reduce((acc, nv) => {
        const key = `doanh_thu_${nv.id}`;
        acc[key] = record[key] || 0;
        return acc;
      }, {}),
    });
    setIsEdit(true);
    setCurrentRecord(record);
    setVisible(true);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEdit && currentRecord) {
        // Update existing record (in a real app, this would call an API)
        message.success('Cập nhật thành công');
      } else {
        // Add new record
        message.success('Thêm mới thành công');
      }
      
      setVisible(false);
      // In a real app, we would refresh data here
      // For now, we'll just simulate it with a timeout
      setLoading(true);
      setTimeout(() => {
        fetchData();
      }, 500);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleDelete = (record: any) => {
    // In a real app, this would call an API to delete the record
    message.success('Xóa thành công');
    // Refresh data
    setLoading(true);
    setTimeout(() => {
      fetchData();
    }, 500);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterDate([moment().subtract(30, 'days'), moment()]);
    setFilterNhanVien(undefined);
    setFilterDichVu(undefined);
  };

  return (
    <PageContainer>
      <Card className="filter-card" title="Bộ lọc thống kê" extra={
        <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
          Đặt lại bộ lọc
        </Button>
      }>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <div className="filter-item">
              <div className="filter-label">Khoảng thời gian:</div>
              <RangePicker
                value={filterDate}
                onChange={(dates) => setFilterDate(dates as [moment.Moment, moment.Moment])}
                style={{ width: '100%' }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <div className="filter-item">
              <div className="filter-label">Nhân viên:</div>
              <Select
                placeholder="Chọn nhân viên"
                style={{ width: '100%' }}
                value={filterNhanVien}
                onChange={setFilterNhanVien}
                allowClear
              >
                {nhanVienList.map(nv => (
                  <Option key={nv.id} value={nv.id}>{nv.ten}</Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <div className="filter-item">
              <div className="filter-label">Dịch vụ:</div>
              <Select
                placeholder="Chọn dịch vụ"
                style={{ width: '100%' }}
                value={filterDichVu}
                onChange={setFilterDichVu}
                allowClear
              >
                {dichVuList.map(dv => (
                  <Option key={dv.id} value={dv.id}>{dv.ten}</Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số lịch hẹn"
              value={tableFooter()[0].tong_lich_hen}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={tableFooter()[0].tong_doanh_thu}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              suffix="đ"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={tableFooter()[0].tong_lich_hen > 0 
                ? (tableFooter()[0].hoan_thanh / tableFooter()[0].tong_lich_hen) * 100 
                : 0}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thống kê lịch hẹn theo ngày" key="1">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Thêm mới
              </Button>
            </div>
            
            {thongKeTheoNgayData.length > 0 && <Column {...configChart} height={300} />}
            
            <Table
              columns={columns}
              dataSource={thongKeTheoNgayData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} bản ghi`,
              }}
              loading={loading}
              scroll={{ x: 'max-content' }}
              summary={() => (
                <Table.Summary fixed="bottom">
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={1}>Tổng cộng</Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>{tableFooter()[0].tong_lich_hen}</Table.Summary.Cell>
                    <Table.Summary.Cell index={2}>{tableFooter()[0].hoan_thanh}</Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>{tableFooter()[0].cho_duyet}</Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>{tableFooter()[0].huy}</Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      {tableFooter()[0].tong_doanh_thu?.toLocaleString('vi-VN')} đ
                    </Table.Summary.Cell>
                    {nhanVienList.map((nv, idx) => {
                      const key = `doanh_thu_${nv.id}`;
                      return (
                        <Table.Summary.Cell index={6 + idx} key={key}>
                          {tableFooter()[0][key]?.toLocaleString('vi-VN')} đ
                        </Table.Summary.Cell>
                      );
                    })}
                    <Table.Summary.Cell index={6 + nhanVienList.length}></Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </TabPane>
          <TabPane tab="Thống kê doanh thu theo dịch vụ" key="2">
            <Table
              columns={dichVuColumns}
              dataSource={thongKeDoanhThuTheoDichVuData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} dịch vụ`,
              }}
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={isEdit ? 'Chỉnh sửa thống kê' : 'Thêm mới thống kê'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleFormSubmit}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="ngay"
                label="Ngày"
                rules={[{ required: true, message: 'Vui lòng nhập ngày!' }]}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="tong_lich_hen"
                label="Tổng lịch hẹn"
                rules={[{ required: true, message: 'Vui lòng nhập tổng lịch hẹn!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="hoan_thanh"
                label="Hoàn thành"
                rules={[{ required: true, message: 'Vui lòng nhập số lịch hẹn hoàn thành!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="cho_duyet"
                label="Chờ duyệt"
                rules={[{ required: true, message: 'Vui lòng nhập số lịch hẹn chờ duyệt!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="huy"
                label="Hủy"
                rules={[{ required: true, message: 'Vui lòng nhập số lịch hẹn hủy!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="tong_doanh_thu"
                label="Tổng doanh thu"
                rules={[{ required: true, message: 'Vui lòng nhập tổng doanh thu!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
          </Row>
          
          <div className="form-section-title">Doanh thu theo nhân viên</div>
          <Row gutter={16}>
            {nhanVienList.map(nv => {
              const key = `doanh_thu_${nv.id}`;
              return (
                <Col span={8} key={nv.id}>
                  <Form.Item
                    name={key}
                    label={`DT ${nv.ten}`}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ThongKeIndexPage;