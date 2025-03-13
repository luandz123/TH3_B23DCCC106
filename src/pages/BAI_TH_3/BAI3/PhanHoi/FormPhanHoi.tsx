import { Button, Form, Input } from 'antd';
import axios from 'axios';
import { history, useModel } from 'umi';

const FormPhanHoi = () => {
    const { idDanhGia ,setVisible } = useModel('bai3')
    console.log(idDanhGia)
    return (
        <>
            <h3>Đánh giá dịch vụ</h3>
            <Form
                onFinish={(values) => {
                    console.log('🚀 ~ RandomUser ~ values:', values);
                    axios.patch(`http://localhost:3000/danh_gia/${idDanhGia}`,{phan_hoi_nhan_vien:values.phan_hoi_nhan_vien})
                    history.push('/phan-hoi-danh-gia');
                    setVisible(false)
                    history.push('/danh-gia');
                }}
            >
                <Form.Item
                    label='Phản hồi'
                    name='phan_hoi_nhan_vien'
                    rules={[{ required: true, message: 'Please input your balance!' }]}
                >
                    <Input />
                </Form.Item>

                <div className='form-footer'>
                    <Button htmlType='submit' type='primary'>
                        Phản hồi
                    </Button>
                    <Button onClick={() => setVisible(false)}>Cancel</Button>
                </div>
            </Form>
        </>
    )
}

export default FormPhanHoi
