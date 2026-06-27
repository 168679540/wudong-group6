import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, message } from 'antd';
import { getAdminList, deleteAdmin } from '../api/admin';

interface Admin {
  id: number;
  username: string;
  realName: string;
  phone: string;
  email: string;
  roleId: number;
  status: number;
  createdAt: string;
}

const AdminList = () => {
  const [data, setData] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res: any = await getAdminList({ page, pageSize });
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

  const handleDelete = async (id: number) => {
    try {
      const res: any = await deleteAdmin(id);
      if (res.success) {
        message.success('删除成功');
        fetchData(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'realName', key: 'realName' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Admin) => (
        <Space>
          <Button type="link">编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>管理员管理</h2>
      <Button type="primary" style={{ marginBottom: 16 }}>
        新增管理员
      </Button>
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
    </div>
  );
};

export default AdminList;