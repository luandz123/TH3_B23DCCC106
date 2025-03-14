declare namespace API {
  // Các loại trạng thái lịch hẹn
  type TrangThaiLichHen = 'da_xac_nhan' | 'cho_duyet' | 'hoan_thanh' | 'huy';

  // Item thống kê doanh thu
  interface DoanhThuItem {
    tong_doanh_thu: number;
    so_lan: number;
  }

  // Item thống kê lịch hẹn
  interface ThongKeItem {
    tong_so: number;
    hoan_thanh: number;
    huy: number;
    cho_duyet: number;
  }

  // Thống kê theo ngày
  interface ThongKeTheoNgay {
    ngay: string;
    tong_lich_hen: number;
    hoan_thanh: number;
    huy: number;
    cho_duyet: number;
    tong_doanh_thu: number;
    doanh_thu_nv001?: number;
    doanh_thu_nv002?: number;
    [key: string]: any; // Cho phép các trường doanh thu động theo nhân viên
  }

  // Thống kê doanh thu theo dịch vụ
  interface ThongKeDoanhThuDichVu {
    id_dich_vu: string;
    ten_dich_vu: string;
    tong_doanh_thu: number;
    so_lan: number;
  }

  // Thống kê doanh thu theo nhân viên
  interface ThongKeDoanhThuNhanVien {
    id_nhan_vien: string;
    ten_nhan_vien: string;
    tong_doanh_thu: number;
    so_lan: number;
  }

  // Thống kê chi tiết nhân viên theo dịch vụ
  interface ThongKeNhanVienDichVu {
    id_nhan_vien: string;
    id_dich_vu: string;
    ten_nhan_vien: string;
    ten_dich_vu: string;
    so_lan: number;
    tong_doanh_thu: number;
  }

  // Dữ liệu thống kê gửi đến client
  interface ThongKeTongHop {
    thong_ke_lich_hen: {
      theo_ngay: Record<string, ThongKeItem>;
      theo_thang: Record<string, ThongKeItem>;
    };
    thong_ke_doanh_thu: {
      theo_dich_vu: Record<string, DoanhThuItem>;
      theo_nhan_vien: Record<string, DoanhThuItem>;
    };
  }

  // Dữ liệu filter
  interface ThongKeFilter {
    tu_ngay?: string;
    den_ngay?: string;
    id_nhan_vien?: string;
    id_dich_vu?: string;
  }
}