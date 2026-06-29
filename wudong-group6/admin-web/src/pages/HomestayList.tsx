import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, Image, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { getAdminHomestayList, createHomestay, updateHomestay, deleteHomestay, updateHomestayStatus, Homestay } from '../api/homestay';

const HomestayList: React.FC = () => {
  const [data, setData] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Homestay | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchData = (page = 1, pageSize = 10) => {
    setLoading(true);
    getAdminHomestayList({ page, pageSize }).then((r: any) => {
      if (r.success) { setData(r.data || []); setPagination(prev => ({ ...prev, current: page, total: r.total || 0 })); }
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: 1, pricePerNight: 0, roomCount: 1 }); setModalOpen(true); };
  const openEdit = (h: Homestay) => { setEditing(h); form.setFieldsValue(h); setModalOpen(true); };

  const handleSave = async () => {
    try { const vals = await form.validateFields(); setSaving(true);
      if (editing) { await updateHomestay({ ...vals, id: editing.id }); message.success('更新成功'); }
      else { await createHomestay(vals); message.success('创建成功'); }
      setModalOpen(false); fetchData();
    } catch (e: any) { if (!e?.errorFields) message.error('保存失败'); } finally { setSaving(false); }
  };
  const handleToggle = async (h: Homestay) => { await updateHomestayStatus(h.id, h.status === 1 ? 0 : 1); message.success(h.status === 1 ? '已下架' : '已上架'); fetchData(); };
  const handleDelete = async (id: number) => { await deleteHomestay(id); message.success('已删除'); fetchData(); };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 50 },
    { title: '图片', dataIndex: 'coverImage', width: 70, render: (v: string) => <Image src={v} width={50} height={50} style={{ borderRadius: 6, objectFit: 'cover' }} fallback="https://via.placeholder.com/50" /> },
    { title: '名称', dataIndex: 'name', ellipsis: true },
    { title: '地址', dataIndex: 'address', ellipsis: true },
    { title: '价格/晚', dataIndex: 'pricePerNight', width: 90, render: (v: number) => <span style={{ color: '#f5222d', fontWeight: 'bold' }}>¥{v}</span> },
    { title: '房间数', dataIndex: 'roomCount', width: 70 },
    { title: '设施', dataIndex: 'amenities', ellipsis: true },
    { title: '状态', dataIndex: 'status', width: 60, render: (v: number) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '上架' : '下架'}</Tag> },
    { title: '操作', width: 200, render: (_: any, r: Homestay) => (
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
        <h2>住·民宿住宿管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增民宿</Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" size="middle" pagination={{ ...pagination, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => fetchData(p, ps) }} />
      <Modal title={editing ? '编辑民宿' : '新增民宿'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSave} confirmLoading={saving} width={640}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="民宿名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item name="pricePerNight" label="价格/晚(元)" rules={[{ required: true }]} style={{ width: 160 }}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="roomCount" label="房间数" rules={[{ required: true }]} style={{ width: 100 }}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="status" label="状态" style={{ width: 100 }}><Select options={[{ value: 1, label: '上架' }, { value: 0, label: '下架' }]} /></Form.Item>
          </Space>
          <Form.Item name="address" label="地址"><Input /></Form.Item>
          <Form.Item name="amenities" label="设施(逗号分隔)"><Input placeholder="WiFi,空调,停车场,观景台" /></Form.Item>
          <Form.Item name="coverImage" label="封面图URL"><Input /></Form.Item>
          <Form.Item name="description" label="民宿介绍"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default HomestayList;
