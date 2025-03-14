import { request } from 'umi';

// Lấy dữ liệu thống kê tổng hợp
export async function getThongKe(params?: API.ThongKeFilter) {
  return request<API.ThongKeTongHop>('/api/thong-ke', {
    method: 'GET',
    params,
  }).catch(() => {
    // Mock API khi không có API thật
    return mockGetThongKe(params);
  });
}

// Lấy danh sách dịch vụ
export async function getDichVu() {
  return request('/api/dich-vu', {
    method: 'GET',
  }).catch(() => {
    // Mock API
    return request('/dich_vu');
  });
}

// Lấy danh sách nhân viên
export async function getNhanVien() {
  return request('/api/nhan-vien', {
    method: 'GET',
  }).catch(() => {
    // Mock API
    return request('/nhan_vien');
  });
}

// Mock API khi backend chưa sẵn sàng
export async function mockGetThongKe(params?: API.ThongKeFilter) {
  console.log('Filter params:', params);
  
  // Lấy dữ liệu từ db.json 
  return request<API.ThongKeTongHop>('/thong_ke');
}

// Thêm bản ghi thống kê mới
export async function addThongKe(data: any) {
  const current = await mockGetThongKe();
  let targetDate = data.ngay;
  
  // Thêm vào thống kê theo ngày
  if (!current.thong_ke_lich_hen.theo_ngay[targetDate]) {
    current.thong_ke_lich_hen.theo_ngay[targetDate] = {
      tong_so: data.tong_lich_hen || 0,
      hoan_thanh: data.hoan_thanh || 0,
      huy: data.huy || 0,
      cho_duyet: data.cho_duyet || 0
    };
  }
  
  // Thêm vào thống kê doanh thu theo dịch vụ
  if (data.id_dich_vu && data.doanh_thu_dich_vu) {
    if (!current.thong_ke_doanh_thu.theo_dich_vu[data.id_dich_vu]) {
      current.thong_ke_doanh_thu.theo_dich_vu[data.id_dich_vu] = {
        tong_doanh_thu: 0,
        so_lan: 0
      };
    }
    current.thong_ke_doanh_thu.theo_dich_vu[data.id_dich_vu].tong_doanh_thu += data.doanh_thu_dich_vu;
    current.thong_ke_doanh_thu.theo_dich_vu[data.id_dich_vu].so_lan += 1;
  }

  // Thêm vào thống kê doanh thu theo nhân viên
  if (data.id_nhan_vien && data.doanh_thu_nhan_vien) {
    if (!current.thong_ke_doanh_thu.theo_nhan_vien[data.id_nhan_vien]) {
      current.thong_ke_doanh_thu.theo_nhan_vien[data.id_nhan_vien] = {
        tong_doanh_thu: 0,
        so_lan: 0
      };
    }
    current.thong_ke_doanh_thu.theo_nhan_vien[data.id_nhan_vien].tong_doanh_thu += data.doanh_thu_nhan_vien;
    current.thong_ke_doanh_thu.theo_nhan_vien[data.id_nhan_vien].so_lan += 1;
  }

  // Trong môi trường thực tế, ở đây sẽ có API POST để lưu trữ dữ liệu
  console.log('Thêm thống kê mới:', data);
  
  return current;
}

// Cập nhật bản ghi
export async function updateThongKe(data: any) {
  // Trong môi trường thực tế, ở đây sẽ có API PUT
  console.log('Cập nhật thống kê:', data);
  
  return data;
}

// Xóa bản ghi
export async function deleteThongKeTheoNgay(ngay: string) {
  const current = await mockGetThongKe();
  
  // Xóa dữ liệu ngày khỏi thống kê
  if (current.thong_ke_lich_hen.theo_ngay[ngay]) {
    delete current.thong_ke_lich_hen.theo_ngay[ngay];
  }

  // Trong môi trường thực tế, ở đây sẽ có API DELETE
  console.log('Đã xóa thống kê ngày:', ngay);
  
  return current;
}