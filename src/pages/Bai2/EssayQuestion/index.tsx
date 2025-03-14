import React, { useEffect, useState } from 'react';
import { Button, Modal, Table, Card, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useModel } from 'umi';
import FormEssayQuestion from './Form';
import { deleteQuestion, getSubjects, getKnowledgeBlocks } from '@/services/EssayQuestion';
import { DIFFICULTY_LEVELS, DifficultyLevel } from '@/constants/difficulty';

interface Question {
  id: number;
  noiDung: string;
  monHocId: number;
  khoiKienThucId: number;
  mucDo: string;
}

interface Subject {
  id: number;
  tenMon: string;
  maMon: string;
}

interface KnowledgeBlock {
  id: number;
  tenKhoi: string;
}

const EssayQuestion: React.FC = () => {
  const { data, getData, setRow, isEdit, setVisible, setIsEdit, visible } = useModel('essayquestion');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [knowledgeBlocks, setKnowledgeBlocks] = useState<KnowledgeBlock[]>([]);

  useEffect(() => {
    getData();
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [subjectsData, knowledgeData] = await Promise.all([
        getSubjects(),
        getKnowledgeBlocks()
      ]);
      setSubjects(subjectsData);
      setKnowledgeBlocks(knowledgeData);
    } catch (error) {
      console.error('Error:', error);
      message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteQuestion(id);
      getData();
      message.success('Xóa câu hỏi thành công');
    } catch (error) {
      console.error('Error:', error);
      message.error('Không thể xóa câu hỏi. Vui lòng thử lại sau.');
    }
  };
  const columns: ColumnsType<Question> = [
    {
      title: 'Mã câu hỏi',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Môn học',
      dataIndex: 'monHocId',
      key: 'monHocId',
      width: 200,
      render: (monHocId: number) => {
        const subject = subjects.find(s => s.id === monHocId);
        return subject?.tenMon || '';
      },
      // Add filters for subjects
      filters: subjects.map(subject => ({
        text: subject.tenMon,
        value: subject.id,
      })),
      onFilter: (value: string | number | boolean, record: Question) => 
        record.monHocId === value,
    },
    {
      title: 'Nội dung',
      dataIndex: 'noiDung',
      key: 'noiDung',
      width: 400,
      ellipsis: true,
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'khoiKienThucId',
      key: 'khoiKienThucId',
      width: 150,
      render: (khoiKienThucId: number) => {
        const block = knowledgeBlocks.find(k => k.id === khoiKienThucId);
        return block?.tenKhoi || '';
      },
      // Add filters for knowledge blocks
      filters: knowledgeBlocks.map(block => ({
        text: block.tenKhoi,
        value: block.id,
      })),
      onFilter: (value: string | number | boolean, record: Question) => 
        record.khoiKienThucId === value,
    },
    {
      title: 'Mức độ',
      dataIndex: 'mucDo',
      key: 'mucDo',
      width: 120,
      render: (mucDo: string) => {
        const level = DIFFICULTY_LEVELS.find(l => l.value === mucDo);
        return level?.label || mucDo;
      },
      filters: DIFFICULTY_LEVELS.map(level => ({
        text: level.label,
        value: level.value,
      })),
      onFilter: (value: string | number | boolean, record: Question) => 
        record.mucDo === String(value),
    },
  
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_: unknown, record: Question) => (
        <div>
          <Button
            onClick={() => {
              setVisible(true);
              setRow(record);
              setIsEdit(true);
            }}
          >
            Sửa
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            type="primary"
            danger
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card style={{ margin: 24 }}>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
          setIsEdit(false);
          setRow(null);
        }}
        style={{ marginBottom: 16 }}
      >
        Thêm câu hỏi
      </Button>

      <Table 
        dataSource={data} 
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} câu hỏi`
        }}
      />

      <Modal
        destroyOnClose
        footer={false}
        title={isEdit ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
        visible={visible}
        onCancel={() => setVisible(false)}
        width={720}
      >
        <FormEssayQuestion
          subjects={subjects}
          knowledgeBlocks={knowledgeBlocks}
        />
      </Modal>
    </Card>
  );
};

export default EssayQuestion;