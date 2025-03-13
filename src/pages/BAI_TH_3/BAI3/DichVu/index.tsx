import { Button, Modal, Table } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormDanhGia from './FormDanhGia';
import { IColumn } from '@/components/Table/typing';
import Item from 'antd/lib/list/Item';

const DanhGiaDichVu = () => {
    const { setRow, lichHen, getLichHenModel,nhanVien,getNhanVienModel,dichVu,getDichVuModel, visible, setVisible } = useModel('bai3')

    useEffect(() => {
        getLichHenModel()
        getNhanVienModel()
        getDichVuModel()
    }, [])

const columns: IColumn<LichHen.Record>[] = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'ten_khach_hang',
            key: 'age',
            width: 100,
            align: 'center',
        },
        {
            title: 'Tên dịch vụ',
            width: 200,
            align: 'center',
            render: (record) => {
                const dich_vu = dichVu.find((item: { id: number, ten: string }) => item.id === record.id_dich_vu) as { id: number, ten: string } | undefined;
                return dich_vu?.ten
            }
            
        },
        {
            title: 'Tên nhân viên',
            width: 200,
            align: 'center',
            render: (record) => {
                const nhan_vien = nhanVien.find((item: { id: number, ten: string }) => item.id === record.id_nhan_vien) as { id: number, ten: string } | undefined;
                return nhan_vien?.ten
            }
            
        },
        {
            title: 'Thời gian',
            width: 200,
            align: 'center',
            render: (record) => {
                return record.gio + " - " + record.ngay
            }
            
        },
        {
            title: 'Đánh giá',
            width: 200,
            align: 'center',
            render: (record) => {
                return (
                    <div>
                        <Button
                        type='primary'
                                onClick={() => {
                                setVisible(true);
                                setRow(record)
                                // setRow(record);
                            }}
                        >
                            Đánh giá
                        </Button>
                    </div>
                );
            },
        },
    ];


    return (
        <div>
            <h1>Đánh giá dịch vụ</h1>

            <Table dataSource={lichHen} columns={columns} />

            <Modal
                destroyOnClose
                footer={false}
                visible={visible}
                onOk={() => { }}
                onCancel={() => {
                    setVisible(false);
                }}
            >
                <FormDanhGia />
            </Modal>
        </div>
  )
}

export default DanhGiaDichVu
