import React, { useState } from 'react';
import { Layout, Form, Input, Select, Button, Steps, Card, message, Result } from 'antd';
import { ShopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import request from '../api/request';

const { Header, Content, Footer } = Layout;

const MERCHANT_TYPES = [
  { value: '衣', label: '衣·非遗商品', desc: '苗族银饰、蜡染、刺绣、服饰等手工艺品商家' },
  { value: '食', label: '食·餐饮美食', desc: '餐厅、农家菜、特产农产品商户' },
  { value: '住', label: '住·民宿住宿', desc: '苗寨民宿、客栈、酒店等住宿经营者' },
  { value: '行', label: '行·线路门票', desc: '景区、旅行社、非遗体验、导游服务' },
];

const REQUIREMENTS: Record<string, string> = {
  '衣': '请准备：1. 作品照片（3-5张） 2. 技艺说明文档 3. 身份证正反面照片',
  '食': '请准备：1. 营业执照照片 2. 卫生许可证 3. 餐厅环境照片（3-5张）',
  '住': '请准备：1. 营业执照照片 2. 经营资质证明 3. 客房实拍照片（每房型至少1张）',
  '行': '请准备：1. 营业执照照片 2. 经营许可证明 3. 线路或景点介绍文档',
};

const MerchantJoin: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>('');

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await request.post('/merchant-application/create', {
        userId: 1,
        shopName: values.shopName,
        module: values.module,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
      });
      if (res.success) {
        setSuccess(true);
        message.success('申请已提交，我们将尽快审核');
      } else {
        message.error(res.message || '提交失败');
      }
    } catch {
      message.error('网络错误，请稍后重试');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Result status="success" title="入驻申请已提交！"
          subTitle="您的申请已成功提交，平台管理员将在 1-3 个工作日内完成审核。审核结果将通过短信通知您。审核通过后，您将收到商家管理后台的登录账号和密码。"
          extra={[<Button type="primary" key="home" onClick={() => window.location.reload()}>继续申请</Button>,
            <Button key="back" onClick={() => window.open('http://localhost:3000/pc', '_self')}>返回首页</Button>]}
        />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff' }}>
          <ShopOutlined style={{ marginRight: 8 }} />商家入驻申请
        </div>
        <Button onClick={() => window.open('http://localhost:3000/pc', '_self')}>返回 PC 首页</Button>
      </Header>
      <Content style={{ padding: '40px 80px', maxWidth: 900, margin: '0 auto' }}>
        <Card>
          <Steps current={0} style={{ marginBottom: 40 }}
            items={[{ title: '填写资料' }, { title: '平台审核' }, { title: '开通账号' }, { title: '正式运营' }]} />

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="module" label="入驻类型" rules={[{ required: true, message: '请选择入驻类型' }]}>
              <Select placeholder="请选择您要入驻的业务类型" onChange={setSelectedModule}>
                {MERCHANT_TYPES.map(t => (
                  <Select.Option key={t.value} value={t.value}>{t.label} — {t.desc}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            {selectedModule && (
              <div style={{ background: '#e6f7ff', padding: '12px 16px', borderRadius: 8, marginBottom: 24 }}>
                <CheckCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                {REQUIREMENTS[selectedModule]}
              </div>
            )}

            <Form.Item name="shopName" label="店铺/品牌名称" rules={[{ required: true, message: '请输入店铺名称' }]}>
              <Input placeholder="您的店铺或品牌名称" maxLength={50} />
            </Form.Item>

            <Form.Item name="contactName" label="联系人姓名" rules={[{ required: true, message: '请输入联系人' }]}>
              <Input placeholder="负责人姓名" maxLength={20} />
            </Form.Item>

            <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }, { pattern: /^1\d{10}$/, message: '请输入正确的手机号' }]}>
              <Input placeholder="11位手机号码" maxLength={11} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                提交入驻申请
              </Button>
            </Form.Item>
          </Form>

          <div style={{ color: '#999', fontSize: 12, textAlign: 'center', marginTop: 16 }}>
            提交申请即表示您同意乌东文旅平台的商家入驻协议。<br />
            如有疑问，请联系客服：400-XXX-XXXX
          </div>
        </Card>
      </Content>
      <Footer style={{ textAlign: 'center', color: '#999' }}>© 2026 乌东文旅 · 商家入驻 | 第6组 平台管理后台</Footer>
    </Layout>
  );
};

export default MerchantJoin;
