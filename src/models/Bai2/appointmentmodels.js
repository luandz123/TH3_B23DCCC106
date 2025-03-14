export const AppointmentStatus = {
    CHO_DUYET: "cho_duyet",
    DA_XAC_NHAN: "da_xac_nhan",
    HOAN_THANH: "hoan_thanh",
    HUY: "huy"
};

export class Appointment {
    constructor(id, tenKhachHang, soDienThoai, idNhanVien, idDichVu, ngay, gio, trangThai) {
        this.id = id;
        this.tenKhachHang = tenKhachHang;
        this.soDienThoai = soDienThoai;
        this.idNhanVien = idNhanVien;
        this.idDichVu = idDichVu;
        this.ngay = ngay;
        this.gio = gio;
        this.trangThai = trangThai || AppointmentStatus.CHO_DUYET;
    }
}
