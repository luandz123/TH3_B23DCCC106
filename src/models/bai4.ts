import { useState, useCallback } from 'react';
import { 
  getThongKe, 
  getDichVu, 
  getNhanVien,
  addThongKe,
  updateThongKe,
  deleteThongKeTheoNgay
} from '@/services/Bai_Th_3/Bai_4';

export default () => {
  // State của model
  const [thongKeData, setThongKeData] = useState<API.ThongKeTongHop>();
  const [dichVuList, setDichVuList] = useState<any[]>([]);
  const [nhanVienList, setNhanVienList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterValues, setFilterValues] = useState<API.ThongKeFilter>({});
  
  // State cho modal thêm/sửa
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<any>();

  // Xây dựng danh sách thống kê ngày từ dữ liệu gốc
  const buildThongKeTheoNgay = useCallback(() => {
    if (!thongKeData) return [];
    
    const result: API.ThongKeTheoNgay[] = [];
    const { thong_ke_lich_hen, thong_ke_doanh_thu } = thongKeData;
    
    // Chuyển đổi dữ liệu từ định dạng API sang định dạng hiển thị
    Object.entries(thong_ke_lich_hen.theo_ngay).forEach(([ngay, data]) => {
      const item: API.ThongKeTheoNgay = {
        ngay,
        tong_lich_hen: data.tong_so,
        hoan_thanh: data.hoan_thanh,
        huy: data.huy,
        cho_duyet: data.cho_duyet,
        tong_doanh_thu: 0,
      };
      
      // Thêm doanh thu cho nhân viên vào từng ngày
      Object.entries(thong_ke_doanh_thu.theo_nhan_vien).forEach(([id_nv, data_nv]) => {
        item[`doanh_thu_${id_nv}`] = data_nv.tong_doanh_thu / 30; // Chia đều doanh thu theo ngày (giả định)
        item.tong_doanh_thu += data_nv.tong_doanh_thu / 30;
      });
      
      result.push(item);
    });
    
    return result;
  }, [thongKeData]);

  // Xây dựng thống kê doanh thu theo dịch vụ
  const buildThongKeDoanhThuTheoDichVu = useCallback(() => {
    if (!thongKeData) return [];
    
    return Object.entries(thongKeData.thong_ke_doanh_thu.theo_dich_vu).map(([id_dich_vu, data]) => {
      // Tìm tên dịch vụ từ danh sách
      const dichVu = dichVuList.find(dv => dv.id === id_dich_vu);
      
      return {
        id_dich_vu,
        ten_dich_vu: dichVu?.ten || id_dich_vu,
        tong_doanh_thu: data.tong_doanh_thu,
        so_lan: data.so_lan,
      };
    });
  }, [thongKeData, dichVuList]);

  // Xây dựng thống kê doanh thu theo nhân viên
  const buildThongKeDoanhThuTheoNhanVien = useCallback(() => {
    if (!thongKeData) return [];
    
    return Object.entries(thongKeData.thong_ke_doanh_thu.theo_nhan_vien).map(([id_nhan_vien, data]) => {
      // Tìm tên nhân viên từ danh sách
      const nhanVien = nhanVienList.find(nv => nv.id === id_nhan_vien);
      
      return {
        id_nhan_vien,
        ten_nhan_vien: nhanVien?.ten || id_nhan_vien,
        tong_doanh_thu: data.tong_doanh_thu,
        so_lan: data.so_lan,
      };
    });
  }, [thongKeData, nhanVienList]);

  // Tính tổng doanh thu
  const getTongDoanhThu = useCallback(() => {
    if (!thongKeData) return 0;
    
    return Object.values(thongKeData.thong_ke_doanh_thu.theo_dich_vu)
      .reduce((sum, item) => sum + item.tong_doanh_thu, 0);
  }, [thongKeData]);

  // Lấy dữ liệu thống kê
  const fetchThongKe = useCallback(async (params?: API.ThongKeFilter) => {
    setLoading(true);
    try {
      const data = await getThongKe(params);
      setThongKeData(data);
      setFilterValues(params || {});
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu thống kê:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy danh sách dịch vụ và nhân viên
  const fetchInitialData = useCallback(async () => {
    try {
      const [dichVuData, nhanVienData] = await Promise.all([
        getDichVu(),
        getNhanVien()
      ]);
      setDichVuList(dichVuData);
      setNhanVienList(nhanVienData);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu ban đầu:', error);
    }
  }, []);

  // Thêm bản ghi thống kê
  const addThongKeRecord = useCallback(async (values: any) => {
    setLoading(true);
    try {
      const updatedData = await addThongKe(values);
      setThongKeData(updatedData);
      return true;
    } catch (error) {
      console.error('Lỗi khi thêm thống kê:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cập nhật bản ghi thống kê
  const updateThongKeRecord = useCallback(async (values: any) => {
    setLoading(true);
    try {
      await updateThongKe(values);
      await fetchThongKe(filterValues);
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật thống kê:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [filterValues, fetchThongKe]);

  // Xóa bản ghi thống kê
  const deleteThongKeRecord = useCallback(async (ngay: string) => {
    setLoading(true);
    try {
      const updatedData = await deleteThongKeTheoNgay(ngay);
      setThongKeData(updatedData);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa thống kê:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    thongKeData,
    dichVuList,
    nhanVienList,
    loading,
    filterValues,
    visible,
    setVisible,
    isEdit,
    setIsEdit,
    currentRecord,
    setCurrentRecord,
    buildThongKeTheoNgay,
    buildThongKeDoanhThuTheoDichVu,
    buildThongKeDoanhThuTheoNhanVien,
    getTongDoanhThu,
    fetchThongKe,
    fetchInitialData,
    addThongKeRecord,
    updateThongKeRecord,
    deleteThongKeRecord,
  };
};