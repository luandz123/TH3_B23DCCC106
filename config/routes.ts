import path from "path";

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      // ...existing code...
    ],
  },

  ///////////////////////////////////
  // DEFAULT MENU
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: './TrangChu',
    icon: 'HomeOutlined',
  },
  {
    path: '/random-user',
    name: 'RandomUser',
    component: './RandomUser',
    icon: 'ArrowsAltOutlined',
  },
  {
    path : '/todolist',
    name : 'Todolist',
    component : './Todolist',
    icon : 'CheckSquareOutlined'
    
  },
  {
    path: '/monhoc/danh-muc-mon-hoc',
    name: 'Danh mục môn học',
    component: './MonHoc/DanhMucMonHoc',
    icon: 'BookOutlined', // Đảm bảo icon BookOutlined đã được import/config trong dự án
  },
  {
    path: '/monhoc/muc-tieu-hoc-tap',
    name: 'Mục tiêu học tập',
    component: './MonHoc/MucTieuHocTap',
    icon: 'ReadOutlined', // Đảm bảo icon ReadOutlined đã được import/config trong dự án
  },
  {
    path: '/essay-question',
    name: 'Quản lý câu hỏi',
    component: '@/pages//Bai2/EssayQuestion',
  },
  

  // ...existing code...
];