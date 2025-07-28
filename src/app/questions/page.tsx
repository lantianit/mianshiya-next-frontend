'use client';
import Title from "antd/es/typography/Title";
import { searchQuestionVoByPageUsingPost } from "@/api/questionController";
import QuestionTable from "@/components/QuestionTable";
import { useEffect, useState } from "react";
import "./index.css";

/**
 * 题目列表页面
 * @constructor
 */
export default function QuestionsPage({ searchParams }: { searchParams: any }) {
  const [questionList, setQuestionList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // 获取 url 的查询参数
  const { q: searchText } = searchParams;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await searchQuestionVoByPageUsingPost({
          searchText,
          pageSize: 12,
          sortField: "createTime",
          sortOrder: "descend",
        });
        setQuestionList((res.data as any)?.records ?? []);
        setTotal((res.data as any)?.total ?? 0);
      } catch (error) {
        // 错误已经在request.ts中处理，这里不需要额外处理
        console.error("获取题目列表失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchText]);

  if (loading) {
    return (
      <div id="questionsPage" className="max-width-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div id="questionsPage" className="max-width-content">
      <Title level={3}>题目大全</Title>
      {/* @ts-ignore */}
      <QuestionTable
        defaultQuestionList={questionList}
        defaultTotal={total}
        defaultSearchParams={{
          title: searchText,
        }}
      />
    </div>
  );
}
