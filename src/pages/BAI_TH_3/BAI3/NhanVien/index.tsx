import { IColumn } from '@/components/Table/typing'
import { StarOutlined } from '@ant-design/icons'
import { Table } from 'antd'
import React, { useEffect } from 'react'
import { useModel } from 'umi'

const DanhGiaNhanVien = () => {
    const { nhanVien, getNhanVienModel, danhGia,getDanhGiaModel } = useModel('bai3')
    useEffect(() => {
        getNhanVienModel()
        getDanhGiaModel()
    }, [])

    const columns: IColumn<DanhGiaNhanVien.Record>[] = [
        {
            title: 'Tên nhân viên',
            dataIndex: 'ten',
            width: 100,
            align: 'center',
        },
        {
            title: 'Số sao trung bình',
            width: 200,
            align: 'center',
            render: (record) => {
                const data = danhGia.filter((item: { id_nhan_vien: number }) => item.id_nhan_vien === record.id)
                let total = 0
                if(data.length>1) {
                    total = data.reduce((sum, review: { diem: string }) => sum + parseFloat(review.diem), 0);
                }
                console.log(Number((total / data.length).toFixed(1)))
                return (
                    <>
                        { Number((total / data.length).toFixed(1))}
                        <StarOutlined />
                    </>
                );
            }
            
        },
    ];

    return (
        <div>
            <h1>Đánh giá trung bình của mỗi nhân viên</h1>
            <Table dataSource={nhanVien} columns={columns} />
        </div>
    )
}

export default DanhGiaNhanVien
