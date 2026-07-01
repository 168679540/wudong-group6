import React, { useEffect, useState } from 'react';
import { Table, Select, InputNumber, Button, Tag, message, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import request from '../api/request';

const HOMESTAYS = [
  { id: 1, name: '苗寨观景民宿', rooms: 8 },
  { id: 2, name: '梯田木屋客栈', rooms: 5 },
  { id: 3, name: '鼓楼精品客栈', rooms: 12 },
];

const RoomCalendar: React.FC = () => {
  const [hid, setHid] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<Record<number, boolean>>({});

  const fetch = () => {
    setLoading(true);
    request.get('/room-calendar/list', { params: { homestayId: hid, days: 7 } })
      .then((r: any) => { if (r.success) setData(r.data || []); }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, [hid]);

  const handleSet = async (id: number, field: string, value: number) => {
    setSaving(prev => ({ ...prev, [id]: true }));
    try {
      await request.put('/room-calendar/set', { id, [field]: value });
      message.success('已更新');
      fetch();
    } catch { message.error('更新失败'); }
    finally { setSaving(prev => ({ ...prev, [id]: false })); }
  };

  const getStatusTag = (s: number) => s === 1 ? <Tag color="green">可订</Tag> : <Tag color="red">不可订</Tag>;

  const columns = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 100, render: (v: string) => v?.slice(0, 10) },
    { title: '可订', dataIndex: 'status', key: 'status', width: 70, render: (v: number) => getStatusTag(v) },
    { title: '剩余房间', dataIndex: 'availableRooms', key: 'availableRooms', width: 120,
      render: (v: number, r: any) => (
        <Space>
          <InputNumber min={0} max={HOMESTAYS.find(h => h.id === hid)?.rooms || 99} value={v} size="small" style={{ width: 60 }}
            onChange={nv => nv !== null && handleSet(r.id, 'availableRooms', nv)} />
          <Button size="small" loading={saving[r.id]} onClick={() => handleSet(r.id, 'availableRooms', v)}>确定</Button>
        </Space>
      ),
    },
    { title: '价格', dataIndex: 'price', key: 'price', width: 120,
      render: (v: number, r: any) => (
        <Space>
          <InputNumber min={0} value={v} size="small" style={{ width: 80 }} precision={2}
            onChange={nv => nv !== null && handleSet(r.id, 'price', nv)} />
          <Button size="small" loading={saving[r.id]} onClick={() => handleSet(r.id, 'price', v)}>确定</Button>
        </Space>
      ),
    },
    { title: '操作', key: 'action', width: 100,
      render: (_: any, r: any) => (
        <Space>
          {r.status === 1 && <Button size="small" icon={<CloseOutlined />} onClick={() => handleSet(r.id, 'status', 0)}>关闭</Button>}
          {r.status === 0 && <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleSet(r.id, 'status', 1)}>开放</Button>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>房态日历管理</h2>
        <Select value={hid} onChange={setHid} style={{ width: 200 }}
          options={HOMESTAYS.map(h => ({ value: h.id, label: `${h.name} (${h.rooms}间)` }))} />
      </div>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" size="middle" pagination={false} />
    </div>
  );
};
export default RoomCalendar;
