import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Spin, message, Image } from 'antd';
import { EyeOutlined, LikeOutlined, CommentOutlined } from '@ant-design/icons';
import { getNoteList } from '../api/community';

const CommunityList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNoteList({ pageSize: 50 }).then((r: any) => {
      if (r.success) setData(r.data);
    }).catch(() => message.error('加载失败')).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;

  return (
    <div>
      <h2>社区分享</h2>
      <Row gutter={[16, 16]}>
        {data.map(n => (
          <Col key={n.id} xs={24} sm={12} md={8} lg={8}>
            <Card hoverable cover={n.coverImage ? <img alt={n.title} src={n.coverImage} style={{ height: 200, objectFit: 'cover' }} /> : null}>
              <Card.Meta title={n.title}
                description={<>
                  <span style={{ color: '#999' }}>{n.authorName} · {n.location}</span><br />
                  <span style={{ color: '#666' }}>{n.content?.slice(0, 80)}...</span><br />
                  <Tag><EyeOutlined /> {n.viewCount}</Tag>
                  <Tag><LikeOutlined /> {n.likeCount}</Tag>
                </>} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CommunityList;
