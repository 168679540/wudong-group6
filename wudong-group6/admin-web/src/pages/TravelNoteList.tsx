import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Modal, message, Input, Image, Row, Col, Card, Statistic } from 'antd';
import { EyeOutlined, LikeOutlined, CheckOutlined, CloseOutlined, FileTextOutlined, CommentOutlined } from '@ant-design/icons';
import { getTravelNoteList, approveTravelNote, rejectTravelNote, takeDownTravelNote, deleteTravelNote, TravelNote } from '../api/travelNote';
import request from '../api/request';

const TravelNoteList: React.FC = () => {
  const [data, setData] = useState<TravelNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [detailVisible, setDetailVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState<TravelNote | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);

  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res: any = await getTravelNoteList({ page, pageSize, status: filterStatus });
      if (res.success) {
        setData(res.data);
        setPagination({ ...pagination, current: page, total: res.total });
      }
    } catch {
      message.error('获取游记列表失败');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); loadStats(); }, [filterStatus]);
  const [stat, setStat] = useState<any>({ totalNotes: 0, totalViews: 0, totalLikes: 0, totalComments: 0 });
  const loadStats = () => { request.get('/community/stats').then((r: any) => { if (r.success) setStat(r.data); }).catch(() => {}); };

  const handleApprove = async (id: number) => {
    try {
      const res: any = await approveTravelNote({ id, reviewerId: 1 });
      if (res.success) {
        message.success('审核通过，已发布');
        fetchData(pagination.current, pagination.pageSize);
      }
    } catch {
      message.error('操作失败');
    }
  };

  const handleReject = async () => {
    if (!currentNote) return;
    try {
      const res: any = await rejectTravelNote({ id: currentNote.id, reviewerId: 1, reason: rejectReason });
      if (res.success) {
        message.success('已驳回');
        setRejectVisible(false);
        setRejectReason('');
        fetchData(pagination.current, pagination.pageSize);
      }
    } catch {
      message.error('操作失败');
    }
  };

  const handleTakeDown = async (id: number) => {
    try {
      const res: any = await takeDownTravelNote(id);
      if (res.success) {
        message.success('已下架');
        fetchData(pagination.current, pagination.pageSize);
      }
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res: any = await deleteTravelNote(id);
      if (res.success) {
        message.success('删除成功');
        fetchData(pagination.current, pagination.pageSize);
      }
    } catch {
      message.error('删除失败');
    }
  };

  const getStatusTag = (status: number) => {
    const map: Record<number, { color: string; text: string }> = {
      0: { color: 'orange', text: '待审核' },
      1: { color: 'green', text: '已发布' },
      2: { color: 'red', text: '已驳回' },
      3: { color: 'default', text: '已下架' },
    };
    const { color, text } = map[status] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: '封面', dataIndex: 'coverImage', key: 'coverImage', width: 80,
      render: (url: string) => url ? <Image src={url} width={60} preview={{ mask: '查看' }} /> : '-',
    },
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true,
      render: (text: string, record: TravelNote) => (
        <a onClick={() => { setCurrentNote(record); setDetailVisible(true); }}>{text}</a>
      ),
    },
    { title: '作者', dataIndex: 'authorName', key: 'authorName', width: 100 },
    { title: '目的地', dataIndex: 'location', key: 'location', width: 100 },
    { title: '浏览', dataIndex: 'viewCount', key: 'viewCount', width: 70, render: (v: number) => <><EyeOutlined /> {v}</> },
    { title: '点赞', dataIndex: 'likeCount', key: 'likeCount', width: 70, render: (v: number) => <><LikeOutlined /> {v}</> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: number) => getStatusTag(s) },
    {
      title: '发布时间', dataIndex: 'createdAt', key: 'createdAt', width: 160,
      render: (t: string) => t ? new Date(t).toLocaleString() : '-',
    },
    {
      title: '操作', key: 'action', width: 200,
      render: (_: any, record: TravelNote) => (
        <Space size="small">
          {record.status === 0 && (
            <>
              <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>通过</Button>
              <Button size="small" danger onClick={() => { setCurrentNote(record); setRejectReason(''); setRejectVisible(true); }}>驳回</Button>
            </>
          )}
          {record.status === 1 && (
            <Button size="small" onClick={() => handleTakeDown(record.id)}>下架</Button>
          )}
          <Button size="small" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {stat.totalNotes > 0 && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}><Card size="small"><Statistic title="游记总数" value={stat.totalNotes} prefix={<FileTextOutlined />} /></Card></Col>
          <Col span={6}><Card size="small"><Statistic title="总浏览" value={stat.totalViews} prefix={<EyeOutlined />} /></Card></Col>
          <Col span={6}><Card size="small"><Statistic title="总点赞" value={stat.totalLikes} prefix={<LikeOutlined />} /></Card></Col>
          <Col span={6}><Card size="small"><Statistic title="总评论" value={stat.totalComments} prefix={<CommentOutlined />} /></Card></Col>
        </Row>
      )}
      <h2>内容审核（游记）</h2>

      <Space style={{ marginBottom: 16 }}>
        <Button type={filterStatus === undefined ? 'primary' : 'default'} onClick={() => setFilterStatus(undefined)}>全部</Button>
        <Button type={filterStatus === 0 ? 'primary' : 'default'} onClick={() => setFilterStatus(0)}>待审核</Button>
        <Button type={filterStatus === 1 ? 'primary' : 'default'} onClick={() => setFilterStatus(1)}>已发布</Button>
        <Button type={filterStatus === 2 ? 'primary' : 'default'} onClick={() => setFilterStatus(2)}>已驳回</Button>
        <Button type={filterStatus === 3 ? 'primary' : 'default'} onClick={() => setFilterStatus(3)}>已下架</Button>
      </Space>

      <Table columns={columns} dataSource={data} loading={loading} rowKey="id"
        pagination={{ ...pagination, onChange: (page, pageSize) => fetchData(page, pageSize) }} />

      {/* 详情弹窗 */}
      <Modal title="游记详情" open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={700}>
        {currentNote && (
          <div>
            {currentNote.coverImage && <Image src={currentNote.coverImage} style={{ width: '100%', maxHeight: 300, objectFit: 'cover', marginBottom: 16 }} />}
            <h3>{currentNote.title}</h3>
            <p style={{ color: '#888' }}>作者：{currentNote.authorName} | 目的地：{currentNote.location} | 浏览 {currentNote.viewCount} · 点赞 {currentNote.likeCount}</p>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{currentNote.content}</div>
          </div>
        )}
      </Modal>

      {/* 驳回弹窗 */}
      <Modal title="驳回原因" open={rejectVisible} onCancel={() => setRejectVisible(false)} onOk={handleReject}>
        <Input.TextArea rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="请填写驳回原因" />
      </Modal>
    </div>
  );
};

export default TravelNoteList;
