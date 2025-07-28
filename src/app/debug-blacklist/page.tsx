'use client';

import React, { useState } from 'react';
import { Button, Card, Space, Typography, Alert, Divider, Steps, Input, message } from 'antd';
import { listQuestionBankVoByPageUsingPost } from '@/api/questionBankController';
import { listQuestionVoByPageUsingPost } from '@/api/questionController';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function DebugBlacklistPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('http://localhost:8101/api/question/list/page/vo');

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
      setResult(`${apiName} 调用失败: ${error.message}\n\n详细错误信息:\n${JSON.stringify(error, null, 2)}`);
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

  // 测试原生fetch请求
  const testNativeFetch = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('开始测试原生fetch请求...');
      const response = await fetch(customUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageSize: 5,
          sortField: "createTime",
          sortOrder: "descend",
        }),
        credentials: 'include'
      });
      
      console.log('fetch响应状态:', response.status);
      console.log('fetch响应头:', Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log('fetch响应内容:', text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
      
      setResult(`原生fetch请求结果:\n状态码: ${response.status}\n响应头: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}\n响应内容: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      console.log('fetch请求失败:', error);
      setResult(`fetch请求失败: ${error.message}\n\n详细错误信息:\n${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  // 测试OPTIONS请求
  const testOptionsRequest = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('开始测试OPTIONS请求...');
      const response = await fetch(customUrl, {
        method: 'OPTIONS',
        credentials: 'include'
      });
      
      console.log('OPTIONS响应状态:', response.status);
      console.log('OPTIONS响应头:', Object.fromEntries(response.headers.entries()));
      
      setResult(`OPTIONS请求结果:\n状态码: ${response.status}\n响应头: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
    } catch (error: any) {
      console.log('OPTIONS请求失败:', error);
      setResult(`OPTIONS请求失败: ${error.message}\n\n详细错误信息:\n${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
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

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>黑名单问题调试页面</Title>
      
      <Alert
        message="调试说明"
        description="此页面用于调试黑名单拦截问题。请打开浏览器开发者工具查看详细的控制台日志。"
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
            测试题库API (axios)
          </Button>
          
          <Button 
            type="primary" 
            onClick={testQuestionApi}
            loading={loading}
            block
          >
            测试题目API (axios)
          </Button>
        </Space>
      </Card>

      <Card title="原生请求测试" style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>请求URL:</Text>
            <Input 
              value={customUrl} 
              onChange={(e) => setCustomUrl(e.target.value)}
              style={{ marginTop: 8 }}
            />
          </div>
          
          <Button 
            type="primary" 
            onClick={testNativeFetch}
            loading={loading}
            block
          >
            测试原生fetch请求
          </Button>
          
          <Button 
            type="default" 
            onClick={testOptionsRequest}
            loading={loading}
            block
          >
            测试OPTIONS预检请求
          </Button>
        </Space>
      </Card>

      <Card title="手动测试" style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            type="default" 
            onClick={triggerBlacklistError}
            block
          >
            手动触发黑名单错误事件
          </Button>
        </Space>
      </Card>

      {result && (
        <Card title="测试结果">
          <TextArea 
            value={result} 
            rows={15} 
            readOnly 
            style={{ fontFamily: 'monospace', fontSize: '12px' }}
          />
        </Card>
      )}

      <Divider />

      <Card title="调试步骤" style={{ marginTop: 20 }}>
        <Steps
          direction="vertical"
          current={-1}
          items={[
            {
              title: '打开开发者工具',
              description: '按F12打开浏览器开发者工具，切换到Console和Network面板'
            },
            {
              title: '测试正常访问',
              description: '点击"测试题库API"按钮，确认API能正常调用'
            },
            {
              title: '配置黑名单',
              description: '在Nacos控制台添加当前IP到黑名单'
            },
            {
              title: '测试黑名单拦截',
              description: '再次点击API测试按钮，观察控制台日志和网络请求'
            },
            {
              title: '分析错误信息',
              description: '查看控制台输出的详细错误信息和网络请求状态'
            }
          ]}
        />
      </Card>

      <Card title="常见问题排查" style={{ marginTop: 20 }}>
        <Paragraph>
          <Text strong>1. 如果看到"网络连接失败"：</Text>
        </Paragraph>
        <ul>
          <li>检查后端服务是否正常运行</li>
          <li>检查CORS配置是否正确</li>
          <li>查看Network面板是否有403响应</li>
        </ul>
        
        <Paragraph>
          <Text strong>2. 如果看到403响应但前端没有识别：</Text>
        </Paragraph>
        <ul>
          <li>检查响应内容是否符合黑名单错误格式</li>
          <li>查看控制台的黑名单错误检测日志</li>
          <li>确认isBlacklistError函数是否正确执行</li>
        </ul>
        
        <Paragraph>
          <Text strong>3. 如果OPTIONS请求失败：</Text>
        </Paragraph>
        <ul>
          <li>检查黑名单过滤器是否正确处理OPTIONS请求</li>
          <li>确认CORS配置是否生效</li>
        </ul>
      </Card>
    </div>
  );
} 