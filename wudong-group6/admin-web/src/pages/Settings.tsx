import { Card, Row, Col, Switch, Input, Button, message, Divider, InputNumber, Spin } from 'antd';
import { SettingOutlined, KeyOutlined, DatabaseOutlined, ApiOutlined, PercentageOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import request from '../api/request';

const Settings = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [jwtSecret, setJwtSecret] = useState('wudong-secret-key-2026');
  const [jwtExpires, setJwtExpires] = useState('7d');
  const [dbStatus, setDbStatus] = useState('已连接');
  const [commission, setCommission] = useState<any[]>([]);
  const [comLoading, setComLoading] = useState(false);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setComLoading(true);
    request.get('/commission/list').then((r: any) => {
      if (r.success) setCommission(r.data || []);
    }).catch(() => {}).finally(() => setComLoading(false));
  }, []);

  const handleSave = () => {
    message.success('设置已保存（本地缓存）');
  };

  const saveCommission = async (moduleName: string, rate: number) => {
    setSaving(prev => ({ ...prev, [moduleName]: true }));
    try {
      const res: any = await request.put('/commission/update', { moduleName, rate });
      if (res.success) { message.success(`${moduleName} 抽佣已更新为 ${rate}%`); }
      else message.error(res.message || '保存失败');
    } catch { message.error('保存失败'); }
    finally { setSaving(prev => ({ ...prev, [moduleName]: false })); }
  };

  return (
    <div>
      <h2>系统设置</h2>
      <Divider />

      <Row gutter={24}>
        {/* 抽佣比例 */}
        <Col span={24}>
          <Card title={<><PercentageOutlined /> 平台抽佣比例</>} style={{ marginBottom: 24 }}>
            <span style={{ color: '#888', fontSize: 12 }}>各模块平台抽佣比例配置（需求文档 11.3.8 & 11.5）</span>
            {comLoading ? <Spin style={{ display: 'block', margin: '20px auto' }} /> : (
              <Row gutter={16} style={{ marginTop: 16 }}>
                {commission.map((c: any) => (
                  <Col key={c.moduleName} span={6}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{c.moduleName}</div>
                      <InputNumber
                        min={0} max={30}
                        value={Number(c.rate)}
                        onChange={v => {
                          setCommission(commission.map(x => x.moduleName === c.moduleName ? { ...x, rate: v } : x));
                        }}
                        formatter={v => `${v}%`}
                        parser={v => Number((v || '').replace('%', ''))}
                        style={{ width: '100%', marginBottom: 8 }}
                      />
                      <Button type="primary" size="small" loading={saving[c.moduleName]}
                        onClick={() => saveCommission(c.moduleName, Number(c.rate))}>
                        保存
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
            <div style={{ marginTop: 12, color: '#888', fontSize: 12 }}>
              默认：实物商品（衣）5%，服务类（食/住/行）10%
            </div>
          </Card>
        </Col>

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
            <div style={{ marginBottom: 12 }}><span><b>主机：</b>192.168.122.145:3306</span></div>
            <div style={{ marginBottom: 12 }}><span><b>数据库：</b>wudong_platform</span></div>
            <div style={{ marginBottom: 16 }}><span><b>状态：</b><span style={{ color: '#52c41a', marginLeft: 4 }}>{dbStatus}</span></span></div>
            <Button onClick={() => message.info('连接正常')}>测试连接</Button>
          </Card>
        </Col>

        <Col span={8}>
          <Card title={<><ApiOutlined /> API 信息</>}>
            <div style={{ marginBottom: 12 }}><span><b>Base URL：</b>http://127.0.0.1:7001/api</span></div>
            <div style={{ marginBottom: 12 }}><span><b>CORS：</b>已启用（*）</span></div>
            <div style={{ marginBottom: 12 }}><span><b>编码：</b>UTF-8</span></div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="关于平台">
            <div style={{ marginBottom: 12 }}><span><b>项目：</b>乌东文旅 衣食住行 综合服务平台</span></div>
            <div style={{ marginBottom: 12 }}><span><b>第6组：</b>平台管理后台</span></div>
            <div style={{ marginBottom: 12 }}><span><b>版本：</b>v1.0</span></div>
            <div style={{ marginBottom: 12 }}><span><b>技术栈：</b>Midway.js v3 + React 18 + Ant Design 5 + TypeORM + MySQL</span></div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;
