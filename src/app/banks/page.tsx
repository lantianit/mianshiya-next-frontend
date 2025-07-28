'use client';
import Title from "antd/es/typography/Title";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import QuestionBankList from "@/components/QuestionBankList";
import { useEffect, useState } from "react";
import "./index.css";

/**
 * 题库列表页面
 * @constructor
 */
export default function BanksPage() {
  const [questionBankList, setQuestionBankList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 题库数量不多，直接全量获取
        const pageSize = 200;
        const res = await listQuestionBankVoByPageUsingPost({
          pageSize,
          sortField: "createTime",
          sortOrder: "descend",
        });
        setQuestionBankList((res.data as any)?.records ?? []);
      } catch (error) {
        // 错误已经在request.ts中处理，这里不需要额外处理
        console.error("获取题库列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div id="banksPage" className="max-width-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div id="banksPage" className="max-width-content">
      <Title level={3}>题库大全</Title>
      <QuestionBankList questionBankList={questionBankList} />
    </div>
  );
}
