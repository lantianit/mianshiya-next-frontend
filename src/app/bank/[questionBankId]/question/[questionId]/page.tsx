// 标记为客户端组件
"use client";
import React from 'react';
import { Flex, Menu, message } from "antd";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import Title from "antd/es/typography/Title";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import Link from "next/link";
import { useEffect, useState } from 'react';
import "./index.css";

// 使用 React.memo 包裹 QuestionCard 组件，避免不必要的渲染
const QuestionCard = React.memo(({question}) => {
  // 这里可以根据 question 渲染具体的题目内容
  return (
      <div>
        {/* 题目内容渲染 */}
        <p>{question && question.title}</p>
      </div>
  );
});

/**
 * 题库题目详情页
 * @constructor
 */
export default function BankQuestionPage({ params }) {
  const { questionBankId, questionId } = params;
  const [bank, setBank] = useState(undefined);
  const [question, setQuestion] = useState(undefined);

  useEffect(() => {
    const fetchBank = async () => {
      try {
        const res = await getQuestionBankVoByIdUsingGet({
          id: questionBankId,
          needQueryQuestionList: true,
          // 可以自行扩展为分页实现
          pageSize: 200,
        });
        setBank(res.data);
      } catch (e) {
        message.error("获取题库列表失败，" + e.message);
      }
    };

    const fetchQuestion = async () => {
      try {
        const res = await getQuestionVoByIdUsingGet({
          id: questionId,
        });
        setQuestion(res.data);
      } catch (e) {
        message.error("获取题目详情失败，" + e.message);
      }
    };

    fetchBank();
    fetchQuestion();
  }, [questionBankId, questionId]);

  // 错误处理
  if (!bank) {
    return <div>获取题库详情失败，请刷新重试</div>;
  }

  if (!question) {
    return <div>获取题目详情失败，请刷新重试</div>;
  }

  // 题目菜单列表
  const questionMenuItemList = (bank.questionPage?.records || []).map((q) => {
    return {
      label: (
          <Link href={`/bank/${questionBankId}/question/${q.id}`}>{q.title}</Link>
      ),
      key: q.id,
    };
  });

  return (
      <div id="bankQuestionPage">
        <Flex gap={24}>
          <Sider width={240} theme="light" style={{ padding: "24px 0" }}>
            <Title level={4} style={{ padding: "0 20px" }}>
              {bank.title}
            </Title>
            <Menu items={questionMenuItemList} selectedKeys={[question.id]} />
          </Sider>
          <Content>
            <QuestionCard question={question} />
          </Content>
        </Flex>
      </div>
  );
}