'use client';

import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import BlacklistErrorModal from '../BlacklistErrorModal';

const ClientErrorHandler: React.FC = () => {
  const [isBlacklisted, setIsBlacklisted] = useState(false);

  useEffect(() => {
    // 显示黑名单模态框
    const showBlacklistModal = () => {
      console.log('显示黑名单模态框');
      setIsBlacklisted(true);
    };

    // 监听全局错误
    const handleError = (event: ErrorEvent) => {
      console.log('捕获到全局错误:', event.error);
      
      // 检查是否为黑名单错误
      if (event.error && (
        event.error.message === 'IP地址被加入黑名单' || 
        event.error.name === 'BlacklistError'
      )) {
        showBlacklistModal();
        return;
      }
      
      // 其他错误显示消息提示
      if (event.error && event.error.message) {
        message.error({
          content: event.error.message,
          duration: 5,
          key: `error-${Date.now()}`
        });
      }
    };

    // 监听未处理的Promise拒绝
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log('捕获到未处理的Promise拒绝:', event.reason);
      
      // 检查是否为黑名单错误
      if (event.reason && (
        event.reason.message === 'IP地址被加入黑名单' || 
        event.reason.name === 'BlacklistError'
      )) {
        showBlacklistModal();
        return;
      }
      
      // 其他错误显示消息提示
      if (event.reason && event.reason.message) {
        message.error({
          content: event.reason.message,
          duration: 5,
          key: `promise-error-${Date.now()}`
        });
      }
    };

    // 监听自定义黑名单错误事件
    const handleBlacklistError = (event: CustomEvent) => {
      console.log('捕获到自定义黑名单错误事件:', event.detail);
      showBlacklistModal();
    };

    // 监听自定义API错误事件
    const handleApiError = (event: CustomEvent) => {
      console.log('捕获到自定义API错误事件:', event.detail);
      
      // 检查是否为黑名单错误
      if (event.detail && event.detail.message === 'IP地址被加入黑名单') {
        showBlacklistModal();
        return;
      }
      
      // 其他错误显示消息提示
      if (event.detail && event.detail.message) {
        message.error({
          content: event.detail.message,
          duration: 5,
          key: `api-error-${Date.now()}`
        });
      }
    };

    // 添加事件监听器
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('blacklist-error', handleBlacklistError as EventListener);
    window.addEventListener('api-error', handleApiError as EventListener);

    // 清理事件监听器
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('blacklist-error', handleBlacklistError as EventListener);
      window.removeEventListener('api-error', handleApiError as EventListener);
    };
  }, []);

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

  return (
    <BlacklistErrorModal
      visible={isBlacklisted}
      onClose={hideBlacklistModal}
      onRetry={handleRetry}
      onContactAdmin={handleContactAdmin}
    />
  );
};

export default ClientErrorHandler; 