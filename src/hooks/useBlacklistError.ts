import { useState } from 'react';
import { message } from 'antd';

export const useBlacklistError = () => {
  const [isBlacklisted, setIsBlacklisted] = useState(false);

  const showBlacklistModal = () => {
    console.log('显示黑名单模态框');
    setIsBlacklisted(true);
  };

  const hideBlacklistModal = () => {
    setIsBlacklisted(false);
  };

  const handleRetry = () => {
    hideBlacklistModal();
    message.info('正在重试连接...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleContactAdmin = () => {
    hideBlacklistModal();
    message.info('请联系管理员：admin@example.com 或 400-123-4567');
    
    // 打开邮件客户端
    const subject = encodeURIComponent('IP黑名单解除申请');
    const body = encodeURIComponent(`
您好，

我的IP地址被系统误判为黑名单，申请解除限制。

我的IP地址：未知IP
访问时间：${new Date().toLocaleString()}
浏览器信息：${navigator.userAgent}

请协助处理，谢谢！

此致
敬礼
    `);
    
    window.open(`mailto:admin@example.com?subject=${subject}&body=${body}`);
  };

  return {
    isBlacklisted,
    showBlacklistModal,
    hideBlacklistModal,
    handleRetry,
    handleContactAdmin,
  };
}; 