import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getCategoryList, createCategory, updateCategory, deleteCategory, ProductCategory } from '../api/category';

const CategoryList: React.FC = () => {
  const [data, setData] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchData = () => {
    setLoading(true);
    getCategoryList({ pageSize: 50 }).then((r: any) => { if (r.success) setData(r.data || []); }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: 1, sortOrder: 0 }); setModalOpen(true); };
  const openEdit = (c: ProductCategory) => { setEditing(c); form.setFieldsValue(c); setModalOpen(true); };

  const handleSave = async () => {
    try {
      const vals = await form.validateFields();
      setSaving(true);
      if (editing) {
        const res: any = await updateCategory({ ...vals, id: editing.id });
        if (res.success) message.success('更新成功');
        else message.error(res.message || '更新失败');
      } else {
        const res: any = await createCategory(vals);
        if (res.success) message.success('创建成功');
        else message.error(res.message || '创建失败');
      }
      setModalOpen(false); fetchData();
    } catch (err: any) {
      if (err?.errorFields) return; // 表单校验失败
      message.error('保存失败，请检查后端是否已重启');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => { try { await deleteCategory(id); message.success('已删除'); fetchData(); } catch { message.error('删除失败'); } };

  const columns: any[] = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '分类名称', dataIndex: 'name' },
    { title: '排序', dataIndex: 'sortOrder', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80, render: (v: number) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '启用' : '禁用'}</Tag> },
    { title: '操作', width: 180, render: (_: any, r: ProductCategory) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>编辑</Button>
        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}><Button size="small" danger icon={<DeleteOutlined />}>删除</Button></Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>商品分类管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增分类</Button>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" size="middle" />
      <Modal title={editing ? '编辑分类' : '新增分类'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleSave} confirmLoading={saving}>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="分类名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="sortOrder" label="排序"><InputNumber /></Form.Item>
          <Form.Item name="status" label="状态"><Select options={[{ value: 1, label: '启用' }, { value: 0, label: '禁用' }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
