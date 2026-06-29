import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, Image, Popconfirm, message, Card, Row, Col, Statistic, Alert, List as AntList } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, WarningOutlined, TrophyOutlined, DollarOutlined } from '@ant-design/icons';
import { getAdminProductList, createProduct, updateProduct, deleteProduct, updateProductStatus, getProductStats, Product } from '../api/product';
import request from '../api/request';

const CATS = ['银饰', '蜡染', '刺绣', '服饰', '其他'];

const ProductList: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [stats, setStats] = useState<{ hotTop: Product[]; lowStock: Product[]; totalSold: number } | null>(null);
  const [importModal, setImportModal] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importing, setImporting] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchData = (page = 1, pageSize = 10) => {
    setLoading(true);
    getAdminProductList({ page, pageSize })
      .then((r: any) => {
        if (r.success) { setData(r.data || []); setPagination(prev => ({ ...prev, current: page, total: r.total || 0 })); }
      })
      .catch(() => message.error('加载失败'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); loadStats(); }, []);

  const loadStats = () => {
    getProductStats().then((r: any) => { if (r.success) setStats(r.data); }).catch(() => {});
  };

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ category: '银饰', status: 1, price: 0, stock: 0, freight: 0, isCustom: 0 });
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    form.setFieldsValue({
      name: p.name, category: p.category, price: p.price, stock: p.stock, freight: Number(p.freight) || 0,
      coverImage: p.coverImage, description: p.description, isCustom: (p as any).isCustom || 0,
      specs: p.specs ? JSON.stringify(p.specs, null, 2) : '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      let specs: any = null;
      if (values.specs) {
        try { specs = JSON.parse(values.specs); } catch { message.error('规格JSON格式错误'); setSaving(false); return; }
      }
      const payload: any = { ...values, specs };
      delete payload.specsStr;

      if (editing) {
        await updateProduct({ ...payload, id: editing.id });
        message.success('更新成功');
      } else {
        await createProduct(payload);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData(pagination.current, pagination.pageSize);
    } catch (err: any) {
      if (err?.errorFields) return; // form validation
      message.error(editing ? '更新失败' : '创建失败');
    } finally { setSaving(false); }
  };

  const handleToggle = async (p: Product) => {
    const newStatus = p.status === 1 ? 0 : 1;
    try {
      await updateProductStatus(p.id, newStatus);
      message.success(newStatus === 1 ? '已上架' : '已下架');
      fetchData(pagination.current, pagination.pageSize);
    } catch { message.error('操作失败'); }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      message.success('删除成功');
      fetchData(pagination.current, pagination.pageSize);
    } catch { message.error('删除失败'); }
  };

  const handleBatchImport = async () => {
    try {
      const items = JSON.parse(importJson);
      if (!Array.isArray(items)) { message.error('请输入JSON数组'); return; }
      setImporting(true);
      const res: any = await request.post('/product/batch-create', { items });
      if (res.success) { message.success(res.message); setImportModal(false); setImportJson(''); fetchData(); loadStats(); }
      else message.error(res.message || '导入失败');
    } catch (e: any) { message.error(e.message || 'JSON格式错误'); }
    finally { setImporting(false); }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: '图片', dataIndex: 'coverImage', key: 'coverImage', width: 80,
      render: (v: string) => <Image src={v} width={50} height={50} style={{ borderRadius: 6, objectFit: 'cover' }} fallback="https://via.placeholder.com/50" />,
    },
    { title: '名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '分类', dataIndex: 'category', key: 'category', width: 80, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: '价格', dataIndex: 'price', key: 'price', width: 80, render: (v: number) => <span style={{ color: '#f5222d', fontWeight: 'bold' }}>¥{v}</span> },
    { title: '库存', dataIndex: 'stock', key: 'stock', width: 60 },
    { title: '销量', dataIndex: 'sales', key: 'sales', width: 60 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 70,
      render: (v: number) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '上架' : '下架'}</Tag>,
    },
    {
      title: '操作', key: 'action', width: 220,
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Button size="small" icon={record.status === 1 ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => handleToggle(record)}>
            {record.status === 1 ? '下架' : '上架'}
          </Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 库存预警 */}
      {stats && stats.lowStock.length > 0 && (
        <Alert type="warning" showIcon icon={<WarningOutlined />} style={{ marginBottom: 16 }}
          message="库存预警" description={
            <span>{stats.lowStock.map(p => `${p.name}(仅剩${p.stock}件)`).join(' / ')}</span>
          } />
      )}

      {/* 统计卡片 */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card size="small"><Statistic title="累计销量" value={stats.totalSold} suffix="件" prefix={<DollarOutlined />} /></Card>
          </Col>
          <Col span={8}>
            <Card size="small"><Statistic title="库存预警" value={stats.lowStock.length} suffix="件" valueStyle={{ color: stats.lowStock.length > 0 ? '#faad14' : '#52c41a' }} /></Card>
          </Col>
          <Col span={8}>
            <Card size="small" title={<><TrophyOutlined /> 热销TOP3</>}>
              {stats.hotTop.slice(0, 3).map((p, i) => (
                <div key={p.id} style={{ fontSize: 13 }}>{i + 1}. {p.name} <Tag color="red">{p.sales}件</Tag></div>
              ))}
            </Card>
          </Col>
        </Row>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>衣·非遗商品管理</h2>
        <Space>
          <Button onClick={() => { setImportJson(''); setImportModal(true); }}>批量导入</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增商品</Button>
        </Space>
      </div>

      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" size="middle"
        pagination={{ ...pagination, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => fetchData(p, ps) }} />

      <Modal title={editing ? '编辑商品' : '新增商品'} open={modalOpen} onCancel={() => setModalOpen(false)}
        onOk={handleSave} confirmLoading={saving} width={640} destroyOnClose>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="商品名称" rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="如：苗族手工银饰吊坠" maxLength={200} />
          </Form.Item>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item name="category" label="分类" rules={[{ required: true }]} style={{ width: 160 }}>
              <Select options={CATS.map(c => ({ value: c, label: c }))} />
            </Form.Item>
            <Form.Item name="price" label="价格(元)" rules={[{ required: true }]} style={{ width: 140 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="stock" label="库存" rules={[{ required: true }]} style={{ width: 90 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="freight" label="运费(元)" style={{ width: 100 }}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="status" label="状态" style={{ width: 90 }}>
              <Select options={[{ value: 1, label: '上架' }, { value: 0, label: '下架' }]} />
            </Form.Item>
          </Space>
          <Form.Item name="isCustom" label="定制商品" extra="勾选后不支持7天无理由退换">
            <Select options={[{ value: 0, label: '否-支持7天无理由' }, { value: 1, label: '是-不支持退换' }]} style={{ width: 280 }} />
          </Form.Item>
          <Form.Item name="coverImage" label="封面图URL">
            <Input placeholder="https://... 或 /images/xxx.jpg" />
          </Form.Item>
          <Form.Item name="description" label="商品描述">
            <Input.TextArea rows={3} placeholder="商品的文化故事、工艺特色、传承人信息等" />
          </Form.Item>
          <Form.Item name="specs" label="规格(JSON)" extra="如：{&quot;尺寸&quot;:[&quot;小号&quot;,&quot;中号&quot;],&quot;颜色&quot;:[&quot;原色&quot;,&quot;红色&quot;]}">
            <Input.TextArea rows={3} placeholder='{"尺寸":["小号","中号","大号"],"颜色":["原色","红色","蓝色"]}' />
          </Form.Item>
        </Form>
      </Modal>

      {/* 批量导入弹窗 */}
      <Modal title="批量导入商品" open={importModal} onCancel={() => setImportModal(false)} onOk={handleBatchImport} confirmLoading={importing} width={600}>
        <div style={{ marginTop: 16 }}>
          <p style={{ color: '#666', fontSize: 13 }}>粘贴JSON数组，每项包含 name/category/price/stock/coverImage/description 字段</p>
          <Input.TextArea rows={12} value={importJson} onChange={e => setImportJson(e.target.value)}
            placeholder={`[{"name":"商品名","category":"银饰","price":100,"stock":50,"coverImage":"/images/xxx.jpg","description":"描述"}]`} />
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;
