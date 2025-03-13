// import { getLichHen,getDichVu,getNhanVien, getDanhGia } from "@/services/RandomUser";
import { getLichHen,getDichVu,getNhanVien, getDanhGia } from "@/services/BAI_TH_3/BAI3";
import { useState } from "react";

export default () => {
    const [lichHen,setLichHen] = useState([])
    const [nhanVien,setNhanVien] = useState([])
    const [dichVu,setDichVu] = useState([])
    const [danhGia,setDanhGia] = useState([])
    const [visible, setVisible] = useState<boolean>(false);
    const [row,setRow] = useState<LichHen.Record>() //Id để đánh giá
    const [idDanhGia,setIdDanhGia] = useState<string>("")


    const getLichHenModel = async () => {
        const res = await getLichHen(); //Lấy danh sách lịch hẹn thức từ api
        const data = res?.data
        const filteredData = data.filter((item: { trang_thai: string; }) => item.trang_thai === "hoan_thanh");
        setLichHen(filteredData ?? []);
    }

    const getNhanVienModel = async () => {
        const res = await getNhanVien(); //Lấy danh sách lịch hẹn thức từ api
        const data = res?.data
        setNhanVien(data ?? []);
    }

    const getDichVuModel = async () => {
        const res = await getDichVu(); //Lấy danh sách lịch hẹn thức từ api
        const data = res?.data
        setDichVu(data ?? []);
    }

    const getDanhGiaModel = async () => {
        const res = await getDanhGia(); //Lấy danh sách lịch hẹn thức từ api
        const data = res?.data
        setDanhGia(data ?? []);
    }

    return {
        lichHen,getLichHenModel,
        nhanVien,getNhanVienModel,
        dichVu,getDichVuModel,
        danhGia,getDanhGiaModel,
        visible,setVisible,
        row,setRow,
        idDanhGia,setIdDanhGia
        
    }
}