import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { getRoleList, createRole, updateRole, deleteRole, Role } from '../api/role';

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await getRoleList();
      setRoles(res.data || []);
    } catch (err) {
      message.error('获取角色列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue(role);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      message.success('删除成功');
      fetchRoles();
    } catch (err) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingRole) {
        await updateRole(editingRole.id, values);
        message.success('更新成功');
      } else {
        await createRole(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchRoles();
    } catch (err) {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
    { title: '权限列表', dataIndex: 'permissions', key: 'permissions', ellipsis: true },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
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
        <Button type="primary" onClick={handleAdd}>新增角色</Button>
      </div>
      <Table columns={columns} dataSource={roles} loading={loading} rowKey="id" />
      
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="roleName" label="角色名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="permissions" label="权限列表" rules={[{ required: true }]}>
            <Input.TextArea placeholder="JSON格式，如: ['user:read', 'user:write']" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleList;