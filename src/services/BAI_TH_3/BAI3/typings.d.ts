declare module LichHen {
	export interface Record {
		id: string;
		ten_khach_hang: string;
		id_nhan_vien: string;
		id_dich_vu: string;
	}
}

declare module DanhGia {
	export interface Record {
		id: string;
		ten_khach_hang: string;
		id_lich_hen: string;
		id_nhan_vien: string;
		id_dich_vu: string;
		diem: string;
		binh_luan: string;
		phan_hoi_nhan_vien: string
	}
}

declare module DanhGiaNhanVien {
	export interface Record {
		id: string;
		ten: string
	}
}

