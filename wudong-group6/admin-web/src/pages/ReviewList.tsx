import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Input, message, Rate } from 'antd';
import { getAdminReviews, replyReview, updateReviewStatus, ProductReview } from '../api/review';

const ReviewList: React.FC = () => {
  const [data, setData] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [replyModal, setReplyModal] = useState<{ open: boolean; id: number; reply: string }>({ open: false, id: 0, reply: '' });

  const fetchData = (page = 1, pageSize = 10) => {
    setLoading(true);
    getAdminReviews({ page, pageSize }).then((r: any) => {
      if (r.success) { setData(r.data || []); setPagination(prev => ({ ...prev, current: page, total: r.total || 0 })); }
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleHide = async (id: number, currentStatus: number) => {
    await updateReviewStatus(id, currentStatus === 1 ? 0 : 1);
    message.success('状态已更新'); fetchData();
  };

  const handleReply = async () => {
    await replyReview(replyModal.id, replyModal.reply);
    message.success('回复成功'); setReplyModal({ open: false, id: 0, reply: '' }); fetchData();
  };

  const formatTime = (s: string) => { const d = new Date(s); return isNaN(d.getTime()) ? s : d.toLocaleString(); };

  const columns: any[] = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '商品ID', dataIndex: 'productId', width: 70 },
    { title: '评分', dataIndex: 'rating', width: 120, render: (v: number) => <Rate disabled value={v} /> },
    { title: '评价内容', dataIndex: 'content', ellipsis: true },
    { title: '商家回复', dataIndex: 'reply', ellipsis: true, render: (v: string) => v || <span style={{ color: '#999' }}>未回复</span> },
    { title: '状态', dataIndex: 'status', width: 70, render: (v: number) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '显示' : '隐藏'}</Tag> },
    { title: '时间', dataIndex: 'createdAt', width: 150, render: (v: string) => formatTime(v) },
    { title: '操作', width: 180, render: (_: any, r: ProductReview) => (
      <Space>
        <Button size="small" onClick={() => setReplyModal({ open: true, id: r.id, reply: r.reply || '' })}>回复</Button>
        <Button size="small" onClick={() => handleHide(r.id, r.status)}>{r.status === 1 ? '隐藏' : '显示'}</Button>
      </Space>
    )},
  ];

  return (
    <div>
      <h2>商品评价管理</h2>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" size="middle"
        pagination={{ ...pagination, showTotal: t => `共 ${t} 条`, onChange: (p, ps) => fetchData(p, ps) }} />
      <Modal title="回复评价" open={replyModal.open} onCancel={() => setReplyModal({ open: false, id: 0, reply: '' })} onOk={handleReply}>
        <Input.TextArea rows={4} value={replyModal.reply} onChange={e => setReplyModal(prev => ({ ...prev, reply: e.target.value }))} placeholder="输入回复内容" />
      </Modal>
    </div>
  );
};

export default ReviewList;
