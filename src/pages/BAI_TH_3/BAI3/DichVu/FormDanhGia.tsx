import { Button, Form, Input } from 'antd';
import axios from 'axios';
import { history, useModel } from 'umi';

const FormDanhGia = () => {
    const { row,setRow,setVisible } = useModel('bai3')
    console.log(row)
    return (
        <>
            <h3>Phản hồi đánh giá</h3>
            <Form
                onFinish={(values) => {
                    console.log('🚀 ~ RandomUser ~ values:', values);
                    const data = {
                        id_lich_hen: row?.id,
                        id_nhan_vien: row?.id_nhan_vien,
                        ten_khach_hang: row?.ten_khach_hang,
                        diem: values.diem,
                        binh_luan: values.binh_luan,
                        phan_hoi_nhan_vien: ""
                    }
                    console.log(data)
                    axios.post('http://localhost:3000/danh_gia', data)
                    .then(res => {
                        console.log(res.data);
                    })
                    .catch(err => {	
                        console.log(err);
                    })
                    setVisible(false)
                    history.push('/phan-hoi-danh-gia');
                }}
            >
                <Form.Item
                    label='Số sao'
                    name='diem'
                    rules={[{ required: true, message: 'Nhập số sao từ 1 đến 5!' }]}
                >
                    <Input type='number' />
                </Form.Item>

                <Form.Item
                    label='Bình luận'
                    name='binh_luan'
                    rules={[{ required: true, message: 'Please input your balance!' }]}
                >
                    <Input />
                </Form.Item>

                <div className='form-footer'>
                    <Button htmlType='submit' type='primary'>
                        Đánh giá
                    </Button>
                    <Button onClick={() => setVisible(false)}>Cancel</Button>
                </div>
            </Form>
        </>
    )
}

export default FormDanhGia
