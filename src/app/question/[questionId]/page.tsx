"use client";
import { useEffect, useState } from "react";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import QuestionCard from "@/components/QuestionCard";
import "./index.css";

/**
 * 题目详情页
 * @constructor
 */
export default function QuestionPage({ params }: { params: { questionId: number } }) {
  const { questionId } = params;
  const [question, setQuestion] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionVoByIdUsingGet({ id: questionId }) as any;
        console.log(res);
        const data = res;
        if (data.code === 0 && data.data) {
          setQuestion(data.data);
        } else if (data.code === 40100 || data.message?.includes("未登录")) {
          setError("未登录，请先登录");
        } else {
          setError(data.message || "获取题目详情失败，请刷新重试");
        }
      } catch (e: any) {
        console.log(e);
        if (typeof e?.message === "string" && e.message.includes("未登录")) {
          setError("未登录，请先登录");
        }
      }
    };
    fetchData();
  }, [questionId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!question) {
    return <div>加载中...</div>;
  }

  return (
    <div id="questionPage">
      <QuestionCard question={question} />
    </div>
  );
}