import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Spin, message, Tag, Modal, Image, Descriptions, Rate, Input, Button, List, Space, Form } from 'antd';
import { EyeOutlined, LikeOutlined, EnvironmentOutlined, UserOutlined, ArrowLeftOutlined, CameraOutlined, CommentOutlined, SendOutlined, PlusOutlined } from '@ant-design/icons';
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
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // 发布
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishTitle, setPublishTitle] = useState('');
  const [publishContent, setPublishContent] = useState('');
  const [publishLocation, setPublishLocation] = useState('');
  const [publishCover, setPublishCover] = useState('');
  const [publishAuthor, setPublishAuthor] = useState('');
  const [publishing, setPublishing] = useState(false);

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
    if (!detail || !commentText.trim()) return; setSubmitting(true);
    try {
      const res: any = await request.post('/community/note/comment', { travelNoteId: detail.id, content: commentText.trim() });
      if (res.success) { message.success('评论成功'); setCommentText(''); const r2: any = await request.get('/community/note/detail', { params: { id: detail.id } }); if (r2.success && r2.data.comments) setComments(r2.data.comments); }
      else message.error(res.message || '评论失败');
    } catch { message.error('评论失败'); } finally { setSubmitting(false); }
  };

  const handleLike = async (n: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res: any = await request.post('/community/note/like', { id: n.id });
      if (res.success) {
        setData(prev => prev.map(item => item.id === n.id ? { ...item, likeCount: res.data.likeCount } : item));
        message.success(`已点赞 (${res.data.likeCount})`);
      }
    } catch { message.error('点赞失败'); }
  };

  const handlePublish = async () => {
    if (!publishTitle.trim() || !publishContent.trim()) { message.warning('请填写标题和内容'); return; }
    setPublishing(true);
    try {
      const res: any = await request.post('/community/note/create', {
        title: publishTitle.trim(), content: publishContent.trim(),
        coverImage: publishCover || undefined, location: publishLocation || undefined, authorName: publishAuthor || '游客',
      });
      if (res.success) { message.success('发布成功，等待审核！'); setPublishOpen(false); fetchData(); }
      else message.error(res.message || '发布失败');
    } catch { message.error('发布失败'); } finally { setPublishing(false); }
  };

  const fetchData = () => {
    getNoteList({ pageSize: 50 }).then((r: any) => { if (r.success) setData(r.data || []); }).catch(() => {});
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0 }}>📸 社区·游记分享</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setPublishTitle(''); setPublishContent(''); setPublishLocation(''); setPublishCover(''); setPublishAuthor(''); setPublishOpen(true); }}>发布游记</Button>
          </div>
          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(n => (
                <Col key={n.id} xs={24} sm={12} md={8} lg={8}>
                  <Card hoverable onClick={() => openDetail(n)}
                    cover={n.coverImage ? <img alt={n.title} src={n.coverImage} style={{ height: 240, objectFit: 'cover' }} /> :
                      <div style={{ height: 240, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CameraOutlined style={{ fontSize: 48, color: '#ccc' }} /></div>}>
                    <Card.Meta title={<span style={{ fontSize: 16 }}>{n.title}</span>}
                      description={<div>
                        <div style={{ marginBottom: 8 }}><UserOutlined /> {n.authorName} · <EnvironmentOutlined /> {n.location}</div>
                        <p style={{ color: '#666', lineHeight: 1.6, fontSize: 13 }}>{n.content?.slice(0, 100)}...</p>
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Tag color="blue"><EyeOutlined /> {n.viewCount} 浏览</Tag>
                          <Tag color="red" style={{ cursor: 'pointer' }} onClick={(e) => handleLike(n, e)}>
                            <LikeOutlined /> {n.likeCount} 点赞
                          </Tag>
                        </div>
                      </div>} />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>

      {/* 发布游记弹窗 */}
      <Modal title="发布游记" open={publishOpen} onCancel={() => setPublishOpen(false)} onOk={handlePublish} confirmLoading={publishing} width={640}>
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="昵称"><Input value={publishAuthor} onChange={e => setPublishAuthor(e.target.value)} placeholder="您的昵称" /></Form.Item>
          <Form.Item label="标题" required><Input value={publishTitle} onChange={e => setPublishTitle(e.target.value)} placeholder="游记标题" maxLength={100} /></Form.Item>
          <Form.Item label="地点"><Input value={publishLocation} onChange={e => setPublishLocation(e.target.value)} placeholder="如：乌东苗寨" /></Form.Item>
          <Form.Item label="封面图URL"><Input value={publishCover} onChange={e => setPublishCover(e.target.value)} placeholder="图片链接（可选）" /></Form.Item>
          <Form.Item label="内容" required><Input.TextArea rows={6} value={publishContent} onChange={e => setPublishContent(e.target.value)} placeholder="分享您的旅行故事..." maxLength={5000} /></Form.Item>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal open={!!detail} onCancel={() => { setDetail(null); setComments([]); }} footer={null} width={760} title={detail?.title}>
        {detail && (<div>
          {detail.coverImage && <img alt={detail.title} src={detail.coverImage} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />}
          <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="作者"><UserOutlined /> {detail.authorName}</Descriptions.Item>
            <Descriptions.Item label="地点"><EnvironmentOutlined /> {detail.location}</Descriptions.Item>
            <Descriptions.Item label="浏览"><EyeOutlined /> {detail.viewCount}</Descriptions.Item>
            <Descriptions.Item label="点赞"><LikeOutlined /> {detail.likeCount}</Descriptions.Item>
          </Descriptions>
          <div style={{ background: '#fafafa', padding: 20, borderRadius: 8, lineHeight: 2, fontSize: 15, whiteSpace: 'pre-wrap', marginBottom: 24 }}>{detail.content || '暂无内容'}</div>
          <h4 style={{ marginBottom: 12 }}><CommentOutlined /> 评论 ({comments.length}条)</h4>
          {detailLoading && <Spin />}
          {!detailLoading && comments.length === 0 && <div style={{ color: '#999', marginBottom: 16 }}>暂无评论，来抢沙发吧</div>}
          {!detailLoading && comments.length > 0 && (<List size="small" dataSource={comments} renderItem={(c: any) => (<List.Item><List.Item.Meta title={<span style={{ fontSize: 13 }}>{c.content}</span>} description={<span style={{ color: '#999', fontSize: 11 }}>用户{c.userId} · {new Date(c.createdAt).toLocaleString()} · <LikeOutlined /> {c.likeCount}</span>} /></List.Item>)} />)}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}><Input placeholder="写下你的评论..." value={commentText} onChange={e => setCommentText(e.target.value)} maxLength={500} onPressEnter={handleComment} style={{ flex: 1 }} /><Button type="primary" icon={<SendOutlined />} loading={submitting} onClick={handleComment}>发送</Button></div>
        </div>)}
      </Modal>
      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '24px 50px' }}><div>🏯 乌东文旅 · 社区·游记分享 | © 2026 第6组</div></Footer>
    </Layout>
  );
};
export default PublicCommunity;
