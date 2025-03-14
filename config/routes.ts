export default [
  {
    path: '/user',
    layout: false,
    routes: [
      // ...existing user-related routes...
    ],
  },
  /////////////////////////////////////
  // DEFAULT MENU
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: './TrangChu',
    icon: 'HomeOutlined',
  },
  {
    path: '/gioi-thieu',
    name: 'About',
    component: './TienIch/GioiThieu',
    hideInMenu: true,
  },
  // {
  //   path: '/random-user',
  //   name: 'RandomUser',
  //   component: './RandomUser',
  //   icon: 'ArrowsAltOutlined',
  // },
  {
    name: "Đánh giá",
    routes: [
      {
        path: '/danh-gia-nhan-vien',
        name: 'Đánh giá trung bình',
        component: './BAI_TH_3/BAI3/NhanVien',
        icon: 'ArrowsAltOutlined',
      },
      {
        path: '/danh-gia-dich-vu',
        name: 'Đánh giá dịch vụ',
        component: './BAI_TH_3/BAI3/DichVu',
        icon: 'ArrowsAltOutlined',
      },
      {
        path: '/phan-hoi-danh-gia',
        name: 'Phản hồi đánh giá',
        component: './BAI_TH_3/BAI3/PhanHoi',
        icon: 'ArrowsAltOutlined',
      },
    ],
  },
  {
    path: '/quan-ly-nv-dv',
    name: 'Quản lý NV & DV',
    component: './BAI_TH_3',
    icon: 'TeamOutlined',
  },
  {
    path: '/todolist',
    name: 'Todolist',
    component: './todolist',
    icon: 'CheckSquareOutlined',
  },
  {
    path: '/quanlylichhen',
    name: 'Quản lý lịch hẹn',
    component: './BAI_2/Quanlylichhen.js',
  },
  {
    path: '/random-user',
    name: 'RandomUser',
    component: './RandomUser',
    icon: 'ArrowsAltOutlined',
  },
  {
    path: '/monhoc/danh-muc-mon-hoc',
    name: 'Danh mục môn học',
    component: './MonHoc/DanhMucMonHoc',
    icon: 'BookOutlined',
  },
  {
    path: '/monhoc/muc-tieu-hoc-tap',
    name: 'Mục tiêu học tập',
    component: './MonHoc/MucTieuHocTap',
    icon: 'ReadOutlined',
  },
  {
    path: '/essay-question',
    name: 'Quản lý câu hỏi',
    component: '@/pages//Bai2/EssayQuestion',
  },
  {
    path: '/thong-ke',
    name: 'Thống kê',
    component: './Bai_TH_3/bai4/index',
    icon: 'BarChartOutlined',
  },
  // ...existing code...
];