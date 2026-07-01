import React, { useState } from 'react';
import { Card, Input, Button, message, Result, Tag, Descriptions, Space } from 'antd';
import { ScanOutlined, CheckCircleOutlined } from '@ant-design/icons';
import request from '../api/request';

const ETicketVerify: React.FC = () => {
  const [code, setCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) { message.warning('请输入电子票号'); return; }
    setLoading(true);
    try {
      const res: any = await request.post('/ticket/verify', { eTicketCode: code.trim() });
      setVerifyResult(res);
      if (res.success) { message.success('核销成功！'); }
      else { message.error(res.message || '核销失败'); }
    } catch { message.error('核销请求失败'); setVerifyResult(null); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2>电子票核销</h2>

      <Card style={{ marginBottom: 24, maxWidth: 600 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Input size="large" placeholder="输入电子票号或扫码" value={code} onChange={e => setCode(e.target.value)}
            onPressEnter={handleVerify} prefix={<ScanOutlined />} style={{ flex: 1 }} />
          <Button type="primary" size="large" loading={loading} onClick={handleVerify}>核销</Button>
        </div>
      </Card>

      {verifyResult && (
        verifyResult.success
          ? <Result status="success" title="核销成功" subTitle="电子票已成功核销，欢迎光临！" icon={<CheckCircleOutlined />} />
          : <Result status="error" title="核销失败" subTitle={verifyResult.message || '电子票无效或已核销'} />
      )}
    </div>
  );
};
export default ETicketVerify;
