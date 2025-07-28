'use client';

import React from 'react';
import { Modal, Button, Space, Typography, Alert } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface BlacklistErrorModalProps {
  visible: boolean;
  onClose: () => void;
  onRetry: () => void;
  onContactAdmin: () => void;
}

const BlacklistErrorModal: React.FC<BlacklistErrorModalProps> = ({
  visible,
  onClose,
  onRetry,
  onContactAdmin,
}) => {
  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          <span>访问受限</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="retry" icon={<ReloadOutlined />} onClick={onRetry}>
          重试
        </Button>,
        <Button key="contact" type="primary" icon={<QuestionCircleOutlined />} onClick={onContactAdmin}>
          联系管理员
        </Button>,
      ]}
      width={500}
      centered
    >
      <div style={{ padding: '20px 0' }}>
        <Alert
          message="IP地址已被加入黑名单"
          description="您的IP地址已被系统识别为异常访问，暂时无法使用系统功能。"
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
        
        <Paragraph>
          <Text strong>可能的原因：</Text>
        </Paragraph>
        <ul style={{ marginBottom: 20, paddingLeft: 20 }}>
          <li>频繁访问或异常操作</li>
          <li>使用代理或VPN服务</li>
          <li>系统误判</li>
          <li>其他安全策略限制</li>
        </ul>
        
        <Paragraph>
          <Text strong>解决方案：</Text>
        </Paragraph>
        <ul style={{ marginBottom: 20, paddingLeft: 20 }}>
          <li>等待一段时间后重试</li>
          <li>更换网络环境</li>
          <li>联系管理员申请解除限制</li>
          <li>检查是否使用了代理服务</li>
        </ul>
        
        <Alert
          message="温馨提示"
          description="如果您认为这是误判，请及时联系管理员并提供相关信息。"
          type="info"
          showIcon
        />
      </div>
    </Modal>
  );
};

export default BlacklistErrorModal; 