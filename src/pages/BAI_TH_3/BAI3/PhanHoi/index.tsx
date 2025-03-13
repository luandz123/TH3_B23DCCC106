import { Button, Modal, Table } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormDanhGia from './FormPhanHoi';
import { IColumn } from '@/components/Table/typing';

const DanhGiaDichVu = () => {
    const { setIdDanhGia,setRow,danhGia,getDanhGiaModel, getLichHenModel,getNhanVienModel,getDichVuModel, visible, setVisible } = useModel('bai3')

    useEffect(() => {
        getLichHenModel()
        getNhanVienModel()
        getDichVuModel()
        getDanhGiaModel()
    }, [])

const columns: IColumn<DanhGia.Record>[] = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'ten_khach_hang',
            key: 'age',
            width: 100,
            align: 'center',
        },
        {
            title: 'Số sao',
            dataIndex: 'diem',
            width: 200,
            align: 'center',
            
        },
        {
            title: 'Bình luận',
            dataIndex: 'binh_luan',
            width: 200,
            align: 'center',
            
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
                                setIdDanhGia(record.id)
                                // setRow(record);
                            }}
                        >
                            Phản hồi
                        </Button>
                    </div>
                );
            },
        },
    ];


    return (
        <div>
            <h1>Phản hồi đánh giá</h1>

            <Table dataSource={danhGia} columns={columns} />

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
