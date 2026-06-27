import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Popconfirm, Image } from 'antd';
import { getUserList, updateUserStatus, deleteUser, User } from '../api/user';

const genderLabels: Record<number, string> = { 0: '未知', 1: '男', 2: '女' };

const UserList: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res: any = await getUserList({ page, pageSize });
      if (res.success) {
        setData(res.data);
        setPagination({ ...pagination, current: page, total: res.total });
      }
    } catch {
      message.error('获取用户列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (record: User) => {
    const newStatus = record.status === 1 ? 0 : 1;
    try {
      const res: any = await updateUserStatus(record.id, newStatus);
      if (res.success) {
        message.success(newStatus === 1 ? '已启用' : '已禁用');
        fetchData(pagination.current, pagination.pageSize);
      }
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res: any = await deleteUser(id);
      if (res.success) {
        message.success('删除成功');
        fetchData(pagination.current, pagination.pageSize);
      }
    } catch {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: '头像', dataIndex: 'avatar', key: 'avatar', width: 60,
      render: (url: string) => url ? <Image src={url} width={40} style={{ borderRadius: 20 }} preview={false} /> : '-',
    },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '性别', dataIndex: 'gender', key: 'gender', width: 60, render: (g: number) => genderLabels[g] || '-' },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (s: number) => <Tag color={s === 1 ? 'green' : 'red'}>{s === 1 ? '正常' : '禁用'}</Tag>,
    },
    {
      title: '注册时间', dataIndex: 'createdAt', key: 'createdAt', width: 160,
      render: (t: string) => t ? new Date(t).toLocaleString() : '-',
    },
    {
      title: '操作', key: 'action', width: 160,
      render: (_: any, record: User) => (
        <>
          <Button type="link" size="small" onClick={() => handleToggleStatus(record)}>
            {record.status === 1 ? '禁用' : '启用'}
          </Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>游客用户管理</h2>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id"
        pagination={{ ...pagination, onChange: (page, pageSize) => fetchData(page, pageSize) }} />
    </div>
  );
};

export default UserList;
