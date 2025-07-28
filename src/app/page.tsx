'use client';
import Title from "antd/es/typography/Title";
import { Divider, Flex } from "antd";
import Link from "next/link";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import QuestionBankList from "@/components/QuestionBankList";
import QuestionList from "@/components/QuestionList";
import { useEffect, useState } from "react";
import "./index.css";

/**
 * 主页
 * @constructor
 */
export default function HomePage() {
  const [questionBankList, setQuestionBankList] = useState<any[]>([]);
  const [questionList, setQuestionList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取题库列表
        const bankRes = await listQuestionBankVoByPageUsingPost({
          pageSize: 12,
          sortField: "createTime",
          sortOrder: "descend",
        });
        setQuestionBankList((bankRes.data as any)?.records ?? []);

        // 获取题目列表
        const questionRes = await listQuestionVoByPageUsingPost({
          pageSize: 12,
          sortField: "createTime",
          sortOrder: "descend",
        });
        setQuestionList((questionRes.data as any)?.records ?? []);
      } catch (error) {
        // 错误已经在request.ts中处理，这里不需要额外处理
        console.error("获取数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div id="homePage" className="max-width-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div id="homePage" className="max-width-content">
      <Flex justify="space-between" align="center">
        <Title level={3}>最新题库</Title>
        <Link href={"/banks"}>查看更多</Link>
      </Flex>
      <QuestionBankList questionBankList={questionBankList} />
      <Divider />
      <Flex justify="space-between" align="center">
        <Title level={3}>最新题目</Title>
        <Link href={"/questions"}>查看更多</Link>
      </Flex>
      <QuestionList questionList={questionList} />
    </div>
  );
}
