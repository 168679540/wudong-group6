import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Spin, message, Tag, Modal, Image, Descriptions, Rate, Input, Button, List, Space } from 'antd';
import { EyeOutlined, LikeOutlined, EnvironmentOutlined, UserOutlined, ArrowLeftOutlined, CameraOutlined, CommentOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getNoteList } from '../api/community';
import request from '../api/request';
import CartDrawer from '../components/CartDrawer';

const { Header, Content, Footer } = Layout;

const PublicCommunity: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // 评论输入
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getNoteList({ pageSize: 50 }).then((r: any) => {
      if (r.success) setData(r.data || []);
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, []);

  const openDetail = (n: any) => {
    setDetail(n); setComments([]); setCommentText('');
    setDetailLoading(true);
    request.get('/community/note/detail', { params: { id: n.id } }).then((r: any) => {
      if (r.success && r.data.comments) setComments(r.data.comments);
    }).catch(() => {}).finally(() => setDetailLoading(false));
  };

  const handleComment = async () => {
    if (!detail || !commentText.trim()) return;
    setSubmitting(true);
    try {
      const res: any = await request.post('/community/note/comment', { travelNoteId: detail.id, content: commentText.trim() });
      if (res.success) {
        message.success('评论成功');
        setCommentText('');
        // 刷新评论
        const r2: any = await request.get('/community/note/detail', { params: { id: detail.id } });
        if (r2.success && r2.data.comments) setComments(r2.data.comments);
      } else message.error(res.message || '评论失败');
    } catch { message.error('评论失败'); } finally { setSubmitting(false); }
  };

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/pc')}>🏯 乌东文旅</div>
        <Space size="large">
          <Menu mode="horizontal" defaultSelectedKeys={['community']} style={{ border: 'none' }}
            items={[{ key: 'home', label: '首页', icon: <ArrowLeftOutlined /> }, { key: 'community', label: '社区·游记分享', icon: <CameraOutlined /> }]}
            onClick={({ key }) => { if (key === 'home') navigate('/pc'); }} />
          <CartDrawer />
        </Space>
      </Header>

      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>📸 社区·游记分享</h2>

          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(n => (
                <Col key={n.id} xs={24} sm={12} md={8} lg={8}>
                  <Card hoverable onClick={() => openDetail(n)}
                    cover={n.coverImage ? <img alt={n.title} src={n.coverImage} style={{ height: 240, objectFit: 'cover' }} /> :
                      <div style={{ height: 240, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CameraOutlined style={{ fontSize: 48, color: '#ccc' }} /></div>}>
                    <Card.Meta
                      title={<span style={{ fontSize: 16 }}>{n.title}</span>}
                      description={
                        <div>
                          <div style={{ marginBottom: 8 }}><UserOutlined /> {n.authorName} · <EnvironmentOutlined /> {n.location}</div>
                          <p style={{ color: '#666', lineHeight: 1.6, fontSize: 13 }}>{n.content?.slice(0, 100)}...</p>
                          <div style={{ marginTop: 8 }}>
                            <Tag color="blue"><EyeOutlined /> {n.viewCount} 浏览</Tag>
                            <Tag color="red"><LikeOutlined /> {n.likeCount} 点赞</Tag>
                            <Rate disabled value={n.likeCount > 50 ? 5 : n.likeCount > 20 ? 4 : 3} style={{ fontSize: 14 }} />
                          </div>
                        </div>
                      } />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>

      {/* 详情弹窗 */}
      <Modal open={!!detail} onCancel={() => { setDetail(null); setComments([]); }} footer={null} width={760} title={detail?.title}>
        {detail && (
          <div>
            {detail.coverImage && <img src={detail.coverImage} alt={detail.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />}
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="作者"><UserOutlined /> {detail.authorName}</Descriptions.Item>
              <Descriptions.Item label="地点"><EnvironmentOutlined /> {detail.location}</Descriptions.Item>
              <Descriptions.Item label="浏览"><EyeOutlined /> {detail.viewCount}</Descriptions.Item>
              <Descriptions.Item label="点赞"><LikeOutlined /> {detail.likeCount}</Descriptions.Item>
            </Descriptions>
            <div style={{ background: '#fafafa', padding: 20, borderRadius: 8, lineHeight: 2, fontSize: 15, whiteSpace: 'pre-wrap', marginBottom: 24 }}>
              {detail.content || '暂无内容'}
            </div>

            {/* 评论区 */}
            <h4 style={{ marginBottom: 12 }}><CommentOutlined /> 评论 ({comments.length}条)</h4>
            {detailLoading && <Spin />}
            {!detailLoading && comments.length === 0 && <div style={{ color: '#999', marginBottom: 16 }}>暂无评论，来抢沙发吧</div>}
            {!detailLoading && comments.length > 0 && (
              <List size="small" dataSource={comments} renderItem={(c: any) => (
                <List.Item>
                  <List.Item.Meta title={<span style={{ fontSize: 13 }}>{c.content}</span>}
                    description={<span style={{ color: '#999', fontSize: 11 }}>用户{c.userId} · {new Date(c.createdAt).toLocaleString()} · <LikeOutlined /> {c.likeCount}</span>} />
                </List.Item>
              )} />
            )}
            {/* 发评论 */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Input placeholder="写下你的评论..." value={commentText} onChange={e => setCommentText(e.target.value)} maxLength={500} onPressEnter={handleComment} style={{ flex: 1 }} />
              <Button type="primary" icon={<SendOutlined />} loading={submitting} onClick={handleComment}>发送</Button>
            </div>
          </div>
        )}
      </Modal>

      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}>
        <div>🏯 乌东文旅 · 社区·游记分享 | © 2026 第6组</div>
      </Footer>
    </Layout>
  );
};
export default PublicCommunity;
