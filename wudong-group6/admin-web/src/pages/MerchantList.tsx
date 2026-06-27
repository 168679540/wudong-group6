import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Switch, message, Popconfirm } from 'antd';
import { getMerchantList, createMerchant, updateMerchant, deleteMerchant, Merchant } from '../api/merchant';

const { Option } = Select;

const MerchantList: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [form] = Form.useForm();

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const res = await getMerchantList();
      setMerchants(res.data || []);
    } catch (err) {
      message.error('获取商家列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const handleAdd = () => {
    setEditingMerchant(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    form.setFieldsValue(merchant);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMerchant(id);
      message.success('删除成功');
      fetchMerchants();
    } catch (err) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingMerchant) {
        await updateMerchant(editingMerchant.id, values);
        message.success('更新成功');
      } else {
        await createMerchant(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchMerchants();
    } catch (err) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '店铺名', dataIndex: 'shopName', key: 'shopName' },
    { title: '模块', dataIndex: 'module', key: 'module' },
    { title: '联系人', dataIndex: 'contactName', key: 'contactName' },
    { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => (status === 1 ? '启用' : '禁用'),
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Merchant) => (
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
        <Button type="primary" onClick={handleAdd}>新增商家</Button>
      </div>
      <Table columns={columns} dataSource={merchants} loading={loading} rowKey="id" />

      <Modal
        title={editingMerchant ? '编辑商家' : '新增商家'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="shopName" label="店铺名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="module" label="业务模块" rules={[{ required: true }]}>
            <Select placeholder="请选择模块">
              <Option value="衣">衣</Option>
              <Option value="食">食</Option>
              <Option value="住">住</Option>
              <Option value="行">行</Option>
            </Select>
          </Form.Item>
          <Form.Item name="contactName" label="联系人">
            <Input />
          </Form.Item>
          <Form.Item name="contactPhone" label="联系电话">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MerchantList;
