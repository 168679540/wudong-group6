import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, Popconfirm, Image } from 'antd';
import { getBannerList, createBanner, updateBanner, deleteBanner, Banner } from '../api/banner';

const BannerList: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [form] = Form.useForm();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await getBannerList();
      setBanners(res.data || []);
    } catch (err) {
      message.error('获取轮播图列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAdd = () => {
    setEditingBanner(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    form.setFieldsValue(banner);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBanner(id);
      message.success('删除成功');
      fetchBanners();
    } catch (err) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, values);
        message.success('更新成功');
      } else {
        await createBanner(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchBanners();
    } catch (err) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url: string) => <Image src={url} width={80} preview={false} />,
    },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '跳转链接', dataIndex: 'linkUrl', key: 'linkUrl', ellipsis: true },
    { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (status === 1 ? '上架' : '下架'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Banner) => (
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
        <Button type="primary" onClick={handleAdd}>新增轮播图</Button>
      </div>
      <Table columns={columns} dataSource={banners} loading={loading} rowKey="id" />
      
      <Modal
        title={editingBanner ? '编辑轮播图' : '新增轮播图'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="imageUrl" label="图片URL" rules={[{ required: true }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="linkUrl" label="跳转链接">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序" initialValue={0}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerList;