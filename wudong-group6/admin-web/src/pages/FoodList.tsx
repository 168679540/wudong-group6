import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, Image, Popconfirm, message, Rate } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { getAdminRestaurantList, createRestaurant, updateRestaurant, deleteRestaurant, updateRestaurantStatus, Restaurant } from '../api/restaurant';

const FoodList: React.FC = () => {
  const [data, setData] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchData = (page = 1, pageSize = 10) => {
    setLoading(true);
    getAdminRestaurantList({ page, pageSize }).then((r: any) => {
      if (r.success) { setData(r.data || []); setPagination(prev => ({ ...prev, current: page, total: r.total || 0 })); }
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: 1, avgPrice: 0, rating: 5 }); setModalOpen(true); };
  const openEdit = (r: Restaurant) => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); };

  const handleSave = async () => {
    try {
      const vals = await form.validateFields(); setSaving(true);
      if (editing) { await updateRestaurant({ ...vals, id: editing.id }); message.success('更新成功'); }
      else { await createRestaurant(vals); message.success('创建成功'); }
      setModalOpen(false); fetchData();
    } catch (e: any) { if (!e?.errorFields) message.error('保存失败'); } finally { setSaving(false); }
  };

  const handleToggle = async (r: Restaurant) => {
    await updateRestaurantStatus(r.id, r.status === 1 ? 0 : 1);
    message.success(r.status === 1 ? '已下架' : '已上架'); fetchData();
  };
  const handleDelete = async (id: number) => { await deleteRestaurant(id); message.success('已删除'); fetchData(); };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 50 },
    { title: '图片', dataIndex: 'coverImage', width: 70, render: (v: string) => <Image src={v} width={50} height={50} style={{ borderRadius: 6, objectFit: 'cover' }} fallback="https://via.placeholder.com/50" /> },
    { title: '名称', dataIndex: 'name', ellipsis: true },
    { title: '地址', dataIndex: 'address', ellipsis: true },
    { title: '人均', dataIndex: 'avgPrice', width: 80, render: (v: number) => <span style={{ color: '#f5222d', fontWeight: 'bold' }}>¥{v}</span> },
    { title: '评分', dataIndex: 'rating', width: 100, render: (v: number) => <Rate disabled value={v} allowHalf style={{ fontSize: 14 }} /> },
    { title: '状态', dataIndex: 'status', width: 60, render: (v: number) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '上架' : '下架'}</Tag> },
    { title: '操作', width: 200, render: (_: any, r: Restaurant) => (
      <Space size="small">
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>编辑</Button>
        <Button size="small" icon={r.status === 1 ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => handleToggle(r)}>{r.status === 1 ? '下架' : '上架'}</Button>
        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />}>删除</Button></Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>食·餐饮美食管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增餐厅</Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" size="middle" pagination={{ ...pagination, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => fetchData(p, ps) }} />
      <Modal title={editing ? '编辑餐厅' : '新增餐厅'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSave} confirmLoading={saving} width={640}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="餐厅名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item name="avgPrice" label="人均(元)" rules={[{ required: true }]} style={{ width: 140 }}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="rating" label="评分" style={{ width: 180 }}><InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="status" label="状态" style={{ width: 100 }}><Select options={[{ value: 1, label: '上架' }, { value: 0, label: '下架' }]} /></Form.Item>
          </Space>
          <Form.Item name="address" label="地址"><Input /></Form.Item>
          <Form.Item name="coverImage" label="封面图URL"><Input /></Form.Item>
          <Form.Item name="description" label="餐厅介绍"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default FoodList;
