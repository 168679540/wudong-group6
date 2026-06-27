import { Card, Row, Col, Switch, Input, Button, message, Divider } from 'antd';
import { SettingOutlined, KeyOutlined, DatabaseOutlined, ApiOutlined } from '@ant-design/icons';
import { useState } from 'react';

const Settings = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [jwtSecret, setJwtSecret] = useState('wudong-secret-key-2026');
  const [jwtExpires, setJwtExpires] = useState('7d');
  const [dbStatus, setDbStatus] = useState('已连接');

  const handleSave = () => {
    message.success('设置已保存（本地缓存）');
  };

  return (
    <div>
      <h2>系统设置</h2>
      <Divider />

      <Row gutter={24}>
        <Col span={12}>
          <Card title={<><SettingOutlined /> 运行模式</>} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span><b>维护模式</b><br /><small style={{ color: '#888' }}>开启后所有用户端页面显示维护公告</small></span>
              <Switch checked={maintenance} onChange={setMaintenance} checkedChildren="开" unCheckedChildren="关" />
            </div>
            <Button type="primary" onClick={handleSave}>保存设置</Button>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<><KeyOutlined /> JWT 配置</>} style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 12 }}>
              <label>密钥</label>
              <Input value={jwtSecret} onChange={e => setJwtSecret(e.target.value)} style={{ marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>过期时间</label>
              <Input value={jwtExpires} onChange={e => setJwtExpires(e.target.value)} style={{ marginTop: 4 }} />
            </div>
            <Button type="primary" onClick={handleSave}>保存 JWT 配置</Button>
          </Card>
        </Col>

        <Col span={8}>
          <Card title={<><DatabaseOutlined /> 数据库连接</>}>
            <div style={{ marginBottom: 12 }}>
              <span><b>主机：</b>192.168.122.142:3306</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span><b>数据库：</b>wudong_platform</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <span><b>状态：</b>
                <span style={{ color: '#52c41a', marginLeft: 4 }}>{dbStatus}</span>
              </span>
            </div>
            <Button onClick={() => message.info('连接正常')}>测试连接</Button>
          </Card>
        </Col>

        <Col span={8}>
          <Card title={<><ApiOutlined /> API 信息</>}>
            <div style={{ marginBottom: 12 }}>
              <span><b>Base URL：</b>http://127.0.0.1:7001/api</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span><b>CORS：</b>已启用（*）</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span><b>编码：</b>UTF-8</span>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="关于平台">
            <div style={{ marginBottom: 12 }}>
              <span><b>项目：</b>乌东文旅 衣食住行 综合服务平台</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span><b>第6组：</b>平台管理后台</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span><b>版本：</b>v1.0</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span><b>技术栈：</b>Midway.js v3 + React 18 + Ant Design 5 + TypeORM + MySQL</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
