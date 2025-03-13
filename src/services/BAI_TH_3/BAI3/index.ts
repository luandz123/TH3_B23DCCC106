import axios from 'axios';

export const getLichHen = async () => {
    const res = await axios.get('http://localhost:3000/lich_hen');
    return res;
};

export const getNhanVien = async () => {
    const res = await axios.get('http://localhost:3000/nhan_vien');
    return res;
};

export const getDichVu = async () => {
    const res = await axios.get('http://localhost:3000/dich_vu');
    return res;
};

export const getDanhGia = async () => {
    const res = await axios.get('http://localhost:3000/danh_gia');
    return res;
};