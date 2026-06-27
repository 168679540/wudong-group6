import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, message, Form, Input, Select, Radio } from 'antd';
import { getApplicationList, reviewApplication } from '../api/merchantApplication';

interface Application {
  id: number;
  userId: number;
  shopName: string;
  module: string;
  contactName: string;
  contactPhone: string;
  status: number;
  rejectReason: string;
  createdAt: string;
}

const MerchantApplication = () => {
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Application | null>(null);
  const [form] = Form.useForm();

  const fetchData = async (page = 1, pageSize = 10, status?: number) => {
    setLoading(true);
    try {
      const res: any = await getApplicationList({ page, pageSize, status });
      if (res.success) {
        setData(res.data);
        setPagination({ ...pagination, current: page, total: res.total });
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReview = (record: Application) => {
    setCurrentRecord(record);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    if (!currentRecord) return;
    
    try {
      const res: any = await reviewApplication({
        id: currentRecord.id,
        status: values.status,
        rejectReason: values.rejectReason,
      });
      
      if (res.success) {
        message.success('审核完成');
        setModalVisible(false);
        fetchData(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      message.error('审核失败');
    }
  };

  const getStatusTag = (status: number) => {
    const statusMap: Record<number, { color: string; text: string }> = {
      0: { color: 'orange', text: '待审核' },
      1: { color: 'green', text: '已通过' },
      2: { color: 'red', text: '已驳回' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '店铺名称', dataIndex: 'shopName', key: 'shopName' },
    { 
      title: '业务模块', 
      dataIndex: 'module', 
      key: 'module',
      render: (module: string) => {
        const moduleMap: Record<string, string> = {
          '衣': '衣-非遗商品',
          '食': '食-餐饮美食',
          '住': '住-住宿预订',
          '行': '行-线路订票',
        };
        return moduleMap[module] || module;
      },
    },
    { title: '联系人', dataIndex: 'contactName', key: 'contactName' },
    { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Application) => (
        <Space>
          {record.status === 0 && (
            <Button type="primary" onClick={() => handleReview(record)}>
              审核
            </Button>
          )}
          {record.status !== 0 && <Tag>已处理</Tag>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>商家入驻审核</h2>
      
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => fetchData(1, 10)}>全部</Button>
        <Button onClick={() => fetchData(1, 10, 0)}>待审核</Button>
        <Button onClick={() => fetchData(1, 10, 1)}>已通过</Button>
        <Button onClick={() => fetchData(1, 10, 2)}>已驳回</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchData(page, pageSize),
        }}
      />

      <Modal
        title="商家入驻审核"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {currentRecord && (
          <div style={{ marginBottom: 24 }}>
            <p><strong>店铺名称：</strong>{currentRecord.shopName}</p>
            <p><strong>业务模块：</strong>{currentRecord.module}</p>
            <p><strong>联系人：</strong>{currentRecord.contactName}</p>
            <p><strong>联系电话：</strong>{currentRecord.contactPhone}</p>
          </div>
        )}
        
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="status"
            label="审核结果"
            rules={[{ required: true, message: '请选择审核结果' }]}
          >
            <Radio.Group>
              <Radio value={1}>通过</Radio>
              <Radio value={2}>驳回</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="rejectReason"
            label="驳回原因"
            dependencies={['status']}
          >
            <Input.TextArea 
              placeholder="如驳回，请填写原因" 
              rows={4}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MerchantApplication;