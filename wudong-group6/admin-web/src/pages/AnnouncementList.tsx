import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message, Popconfirm } from 'antd';
import { getAnnouncementList, createAnnouncement, updateAnnouncement, deleteAnnouncement, Announcement } from '../api/announcement';

const AnnouncementList: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [form] = Form.useForm();

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await getAnnouncementList();
      setAnnouncements(res.data || []);
    } catch (err) {
      message.error('获取公告列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAdd = () => {
    setEditingAnnouncement(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    form.setFieldsValue(announcement);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAnnouncement(id);
      message.success('删除成功');
      fetchAnnouncements();
    } catch (err) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id, values);
        message.success('更新成功');
      } else {
        await createAnnouncement(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchAnnouncements();
    } catch (err) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '内容', dataIndex: 'content', key: 'content', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (status === 1 ? '上架' : '下架'),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Announcement) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>新增公告</Button>
      </div>
      <Table columns={columns} dataSource={announcements} loading={loading} rowKey="id" />
      
      <Modal
        title={editingAnnouncement ? '编辑公告' : '新增公告'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AnnouncementList;