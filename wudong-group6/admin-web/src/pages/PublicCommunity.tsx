import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Spin, message, Tag, Modal, Descriptions, Rate, Image } from 'antd';
import { EyeOutlined, LikeOutlined, EnvironmentOutlined, UserOutlined, ArrowLeftOutlined, CameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getNoteList } from '../api/community';

const { Header, Content, Footer } = Layout;

const PublicCommunity: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<any | null>(null);

  useEffect(() => {
    getNoteList({ pageSize: 50 }).then((r: any) => {
      if (r.success) setData(r.data || []);
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/pc')}>
          🏯 乌东文旅
        </div>
        <Menu mode="horizontal" defaultSelectedKeys={['community']} style={{ border: 'none' }}
          items={[
            { key: 'home', label: '首页', icon: <ArrowLeftOutlined /> },
            { key: 'community', label: '社区·游记分享', icon: <CameraOutlined /> },
          ]}
          onClick={({ key }) => { if (key === 'home') navigate('/pc'); }}
        />
      </Header>

      <Content style={{ padding: '32px 80px', minHeight: '80vh', background: '#f5f5f5' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32 }}>
          <h2 style={{ marginBottom: 24 }}>📸 社区·游记分享</h2>

          {loading ? <Spin size="large" style={{ display: 'block', margin: '80px auto' }} /> : (
            <Row gutter={[20, 20]}>
              {data.map(n => (
                <Col key={n.id} xs={24} sm={12} md={8} lg={8}>
                  <Card
                    hoverable
                    cover={
                      n.coverImage ? (
                        <img alt={n.title} src={n.coverImage} style={{ height: 220, objectFit: 'cover' }} />
                      ) : (
                        <div style={{ height: 220, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CameraOutlined style={{ fontSize: 48, color: '#ccc' }} />
                        </div>
                      )
                    }
                    onClick={() => setDetail(n)}
                  >
                    <Card.Meta
                      title={<span style={{ fontSize: 16 }}>{n.title}</span>}
                      description={
                        <div>
                          <div style={{ marginBottom: 8 }}>
                            <UserOutlined /> {n.authorName} · <EnvironmentOutlined /> {n.location}
                          </div>
                          <p style={{ color: '#666', lineHeight: 1.6, fontSize: 13 }}>
                            {n.content?.slice(0, 100)}{(n.content?.length || 0) > 100 ? '...' : ''}
                          </p>
                          <div style={{ marginTop: 8 }}>
                            <Tag color="blue"><EyeOutlined /> {n.viewCount} 浏览</Tag>
                            <Tag color="red"><LikeOutlined /> {n.likeCount} 点赞</Tag>
                            <Rate disabled value={n.likeCount > 50 ? 5 : n.likeCount > 20 ? 4 : 3} style={{ fontSize: 14 }} />
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
              {data.length === 0 && (
                <Col span={24}>
                  <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
                    <CameraOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                    <p style={{ fontSize: 16 }}>暂无游记分享，快来发布第一篇吧！</p>
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>
      </Content>

      {/* 游记详情弹窗 */}
      <Modal
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={null}
        width={720}
        title={detail?.title}
      >
        {detail && (
          <div>
            {detail.coverImage && (
              <img src={detail.coverImage} alt={detail.title}
                style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
            )}
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="作者"><UserOutlined /> {detail.authorName}</Descriptions.Item>
              <Descriptions.Item label="地点"><EnvironmentOutlined /> {detail.location}</Descriptions.Item>
              <Descriptions.Item label="浏览"><EyeOutlined /> {detail.viewCount}</Descriptions.Item>
              <Descriptions.Item label="点赞"><LikeOutlined /> {detail.likeCount}</Descriptions.Item>
            </Descriptions>
            <div style={{
              background: '#fafafa', padding: 20, borderRadius: 8, lineHeight: 2,
              fontSize: 15, whiteSpace: 'pre-wrap', color: '#333'
            }}>
              {detail.content || '暂无内容'}
            </div>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Rate disabled value={detail.likeCount > 50 ? 5 : detail.likeCount > 20 ? 4 : 3} />
              <span style={{ marginLeft: 8, color: '#999' }}>{detail.likeCount} 人觉得很赞</span>
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
