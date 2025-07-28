'use client';

import React, { useState } from 'react';
import { Button, Card, Space, Typography, Alert, Divider, Steps } from 'antd';
import { listQuestionBankVoByPageUsingPost } from '@/api/questionBankController';
import { listQuestionVoByPageUsingPost } from '@/api/questionController';

const { Title, Text, Paragraph } = Typography;

export default function TestBlacklistPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testApiCall = async (apiName: string, apiCall: () => Promise<any>) => {
    setLoading(true);
    setResult('');
    
    try {
      console.log(`开始测试 ${apiName}...`);
      const response = await apiCall();
      console.log(`${apiName} 成功:`, response);
      setResult(`${apiName} 调用成功: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      console.log(`${apiName} 失败:`, error);
      setResult(`${apiName} 调用失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testQuestionBankApi = () => {
    return testApiCall('题库API', () => 
      listQuestionBankVoByPageUsingPost({
        pageSize: 5,
        sortField: "createTime",
        sortOrder: "descend",
      })
    );
  };

  const testQuestionApi = () => {
    return testApiCall('题目API', () => 
      listQuestionVoByPageUsingPost({
        pageSize: 5,
        sortField: "createTime",
        sortOrder: "descend",
      })
    );
  };

  // 手动触发黑名单错误事件
  const triggerBlacklistError = () => {
    console.log('手动触发黑名单错误事件');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('blacklist-error', {
        detail: {
          message: 'IP地址被加入黑名单',
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  // 手动触发API错误事件
  const triggerApiError = () => {
    console.log('手动触发API错误事件');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api-error', {
        detail: {
          message: '测试API错误消息',
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  // 手动抛出黑名单错误
  const throwBlacklistError = () => {
    console.log('手动抛出黑名单错误');
    const error = new Error('IP地址被加入黑名单');
    error.name = 'BlacklistError';
    throw error;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <Title level={2}>黑名单功能测试页面</Title>
      
      <Alert
        message="测试说明"
        description="此页面用于测试黑名单拦截功能。当您的IP被加入黑名单时，API调用会失败并显示黑名单错误模态框。"
        type="info"
        style={{ marginBottom: 20 }}
      />

      <Card title="API测试" style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            type="primary" 
            onClick={testQuestionBankApi}
            loading={loading}
            block
          >
            测试题库API
          </Button>
          
          <Button 
            type="primary" 
            onClick={testQuestionApi}
            loading={loading}
            block
          >
            测试题目API
          </Button>
        </Space>
      </Card>

      <Card title="错误处理测试" style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            type="default" 
            onClick={triggerBlacklistError}
            block
          >
            手动触发黑名单错误事件
          </Button>
          
          <Button 
            type="default" 
            onClick={triggerApiError}
            block
          >
            手动触发API错误事件
          </Button>
          
          <Button 
            type="default" 
            onClick={throwBlacklistError}
            block
          >
            手动抛出黑名单错误
          </Button>
        </Space>
      </Card>

      {result && (
        <Card title="测试结果">
          <Text code style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {result}
          </Text>
        </Card>
      )}

      <Divider />

      <Card title="测试步骤" style={{ marginTop: 20 }}>
        <Steps
          direction="vertical"
          current={-1}
          items={[
            {
              title: '启动后端服务',
              description: '确保后端在8101端口正常运行'
            },
            {
              title: '启动前端服务',
              description: '确保前端在3000端口正常运行'
            },
            {
              title: '测试错误处理机制',
              description: '点击"手动触发黑名单错误事件"按钮，应该看到黑名单错误模态框'
            },
            {
              title: '测试正常访问',
              description: '点击API测试按钮，应该看到API调用成功'
            },
            {
              title: '配置Nacos黑名单',
              description: '在Nacos控制台添加IP到黑名单'
            },
            {
              title: '测试黑名单拦截',
              description: '再次点击API测试按钮，应该看到黑名单错误模态框而不是"网络连接失败"'
            }
          ]}
        />
      </Card>

      <Card title="Nacos配置说明" style={{ marginTop: 20 }}>
        <Paragraph>
          <Text strong>1. 访问Nacos控制台：</Text>
        </Paragraph>
        <Text code>http://localhost:8848/nacos</Text>
        <Paragraph>
          <Text strong>2. 创建配置：</Text>
        </Paragraph>
        <ul>
          <li><Text strong>Data ID:</Text> mianshiya</li>
          <li><Text strong>Group:</Text> DEFAULT_GROUP</li>
          <li><Text strong>配置格式:</Text> YAML</li>
        </ul>
        
        <Paragraph>
          <Text strong>3. 配置内容：</Text>
        </Paragraph>
        <Text code style={{ whiteSpace: 'pre-wrap', display: 'block', background: '#f5f5f5', padding: '10px' }}>
{`blackIpList:
  - "127.0.0.1"
  - "localhost"
  - "你的IP地址"`}
        </Text>
        
        <Paragraph>
          <Text strong>4. 测试IP地址：</Text>
        </Paragraph>
        <Text code>127.0.0.1</Text> 或 <Text code>localhost</Text>
      </Card>

      <Card title="错误处理流程" style={{ marginTop: 20 }}>
        <Paragraph>
          <Text strong>1. 后端拦截：</Text> BlackIpFilter检测到黑名单IP，返回403状态码和错误信息
        </Paragraph>
        <Paragraph>
          <Text strong>2. 前端识别：</Text> request.ts拦截器识别黑名单错误，触发blacklist-error事件
        </Paragraph>
        <Paragraph>
          <Text strong>3. 错误展示：</Text> ClientErrorHandler监听事件，显示黑名单错误模态框
        </Paragraph>
        <Paragraph>
          <Text strong>4. 问题修复：</Text> 
        </Paragraph>
        <ul>
          <li>修复了CORS预检请求处理</li>
          <li>优化了403错误检测逻辑</li>
          <li>添加了详细的调试日志</li>
          <li>确保黑名单错误能被正确识别</li>
        </ul>
      </Card>

      <Card title="调试信息" style={{ marginTop: 20 }}>
        <Paragraph>
          打开浏览器开发者工具的Console面板，可以看到详细的调试信息：
        </Paragraph>
        <ul>
          <li>API请求和响应日志</li>
          <li>黑名单错误检测日志</li>
          <li>错误事件触发日志</li>
          <li>错误处理流程日志</li>
          <li>CORS相关日志</li>
        </ul>
        <Alert
          message="重要提示"
          description="如果仍然看到'网络连接失败'而不是黑名单错误模态框，请检查浏览器控制台的详细错误信息。"
          type="warning"
          showIcon
        />
      </Card>
    </div>
  );
} 