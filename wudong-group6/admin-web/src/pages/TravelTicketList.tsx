import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, Image, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { getAdminTicketList, createTicket, updateTicket, deleteTicket, updateTicketStatus, Ticket } from '../api/ticket';
import request from '../api/request';
import { Row, Col, Card, Statistic } from 'antd';
import { TrophyOutlined, DatabaseOutlined, DollarOutlined } from '@ant-design/icons';

const TravelTicketList: React.FC = () => {
  const [data, setData] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ticket | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchData = (page = 1, pageSize = 10) => {
    setLoading(true);
    getAdminTicketList({ page, pageSize }).then((r: any) => {
      if (r.success) { setData(r.data || []); setPagination(prev => ({ ...prev, current: page, total: r.total || 0 })); }
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); loadStats(); }, []);

  const [stat, setStat] = useState<any>({ totalStock: 0, avgPrice: 0, topRated: [] });
  const loadStats = () => { request.get('/ticket/stats').then((r: any) => { if (r.success) setStat(r.data); }).catch(() => {}); };

  const openCreate = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: 1, type: '门票', price: 0, stock: 9999 }); setModalOpen(true); };
  const openEdit = (t: Ticket) => { setEditing(t); form.setFieldsValue(t); setModalOpen(true); };

  const handleSave = async () => {
    try { const vals = await form.validateFields(); setSaving(true);
      if (editing) { await updateTicket({ ...vals, id: editing.id }); message.success('更新成功'); }
      else { await createTicket(vals); message.success('创建成功'); }
      setModalOpen(false); fetchData();
    } catch (e: any) { if (!e?.errorFields) message.error('保存失败'); } finally { setSaving(false); }
  };
  const handleToggle = async (t: Ticket) => { await updateTicketStatus(t.id, t.status === 1 ? 0 : 1); message.success(t.status === 1 ? '已下架' : '已上架'); fetchData(); };
  const handleDelete = async (id: number) => { await deleteTicket(id); message.success('已删除'); fetchData(); };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 50 },
    { title: '图片', dataIndex: 'coverImage', width: 70, render: (v: string) => <Image src={v} width={50} height={50} style={{ borderRadius: 6, objectFit: 'cover' }} fallback="https://via.placeholder.com/50" /> },
    { title: '名称', dataIndex: 'name', ellipsis: true },
    { title: '类型', dataIndex: 'type', width: 70, render: (v: string) => <Tag color={v === '门票' ? 'blue' : 'orange'}>{v}</Tag> },
    { title: '价格', dataIndex: 'price', width: 80, render: (v: number) => <span style={{ color: '#f5222d', fontWeight: 'bold' }}>¥{v}</span> },
    { title: '库存', dataIndex: 'stock', width: 60 },
    { title: '状态', dataIndex: 'status', width: 60, render: (v: number) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '上架' : '下架'}</Tag> },
    { title: '操作', width: 200, render: (_: any, r: Ticket) => (
      <Space size="small">
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>编辑</Button>
        <Button size="small" icon={r.status === 1 ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => handleToggle(r)}>{r.status === 1 ? '下架' : '上架'}</Button>
        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />}>删除</Button></Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      {stat.totalStock > 0 && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}><Card size="small"><Statistic title="总库存" value={stat.totalStock} suffix="张" prefix={<DatabaseOutlined />} /></Card></Col>
          <Col span={8}><Card size="small"><Statistic title="均价" value={stat.avgPrice} suffix="元" precision={0} prefix={<DollarOutlined />} /></Card></Col>
          <Col span={8}><Card size="small" title={<><TrophyOutlined /> 评分最高</>}>{stat.topRated?.slice(0, 2).map((t: any, i: number) => <div key={i} style={{ fontSize: 12 }}>🏆 {t.name} ⭐{Number(t.rating).toFixed(1)}</div>)}</Card></Col>
        </Row>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>行·线路门票管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增票务</Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" size="middle" pagination={{ ...pagination, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => fetchData(p, ps) }} />
      <Modal title={editing ? '编辑票务' : '新增票务'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSave} confirmLoading={saving} width={640}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item name="type" label="类型" rules={[{ required: true }]} style={{ width: 120 }}><Select options={[{ value: '门票', label: '门票' }, { value: '路线', label: '路线' }]} /></Form.Item>
            <Form.Item name="price" label="价格(元)" rules={[{ required: true }]} style={{ width: 140 }}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="stock" label="库存" rules={[{ required: true }]} style={{ width: 100 }}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="status" label="状态" style={{ width: 100 }}><Select options={[{ value: 1, label: '上架' }, { value: 0, label: '下架' }]} /></Form.Item>
          </Space>
          <Form.Item name="coverImage" label="封面图URL"><Input /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default TravelTicketList;
