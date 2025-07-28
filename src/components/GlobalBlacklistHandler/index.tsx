import React, { useEffect } from 'react';
import { message } from 'antd';
import { useBlacklistError } from '../../hooks/useBlacklistError';
import BlacklistErrorModal from '../BlacklistErrorModal';

const GlobalBlacklistHandler: React.FC = () => {
  const {
    isBlacklisted,
    showBlacklistModal,
    hideBlacklistModal,
    handleRetry,
    handleContactAdmin,
  } = useBlacklistError();

  useEffect(() => {
    // 监听黑名单错误事件
    const handleBlacklistError = (event: CustomEvent) => {
      console.log('收到黑名单错误事件:', event.detail);
      showBlacklistModal();
    };

    // 监听通用API错误事件
    const handleApiError = (event: CustomEvent) => {
      console.log('收到API错误事件:', event.detail);
      // 只在客户端环境下显示消息
      if (typeof window !== 'undefined') {
        message.error({
          content: event.detail.message,
          duration: 5,
          key: `api-error-${Date.now()}`
        });
      }
    };

    // 添加事件监听器
    window.addEventListener('blacklist-error', handleBlacklistError as EventListener);
    window.addEventListener('api-error', handleApiError as EventListener);

    // 清理事件监听器
    return () => {
      window.removeEventListener('blacklist-error', handleBlacklistError as EventListener);
      window.removeEventListener('api-error', handleApiError as EventListener);
    };
  }, [showBlacklistModal]);

  return (
    <BlacklistErrorModal
      visible={isBlacklisted}
      onClose={hideBlacklistModal}
      onRetry={handleRetry}
      onContactAdmin={handleContactAdmin}
    />
  );
};

export default GlobalBlacklistHandler; 