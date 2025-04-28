"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, statusMap } from "@/app/lib/utils";
import IssueReplyForm from "./IssueReplyForm";

export default function IssueDetail({ issue, currentUser }) {
  const router = useRouter();
  const [currentIssue, setCurrentIssue] = useState(issue);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // 检查当前用户权限
  const isAdmin = currentUser?.role === "ADMIN";
  const isOwner = currentUser?.id === issue.userId;
  const canReply =
    currentUser && (isAdmin || isOwner) && currentIssue.status !== "CLOSED";
  const canClose =
    isAdmin || (isOwner && currentIssue.status === "IN_PROGRESS");

  // 更新问题状态
  const updateIssueStatus = async (newStatus) => {
    setError("");
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/issues/${currentIssue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "更新问题状态失败");
      }

      setCurrentIssue((prev) => ({ ...prev, status: newStatus }));
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // 处理新回复添加
  const handleNewReply = (newReply) => {
    setCurrentIssue((prev) => ({
      ...prev,
      replies: [...prev.replies, newReply],
      status:
        isAdmin && prev.status === "PENDING" ? "IN_PROGRESS" : prev.status,
    }));
  };

  return (
    <div>
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* 问题标题和状态 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{currentIssue.title}</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm ${statusMap[currentIssue.status].color}`}
        >
          {statusMap[currentIssue.status].label}
        </span>
      </div>

      {/* 问题信息 */}
      <div className="flex justify-between text-sm text-gray-500 mb-6">
        <div>提交者: {currentIssue.user.name}</div>
        <div>提交时间: {formatDate(currentIssue.createdAt)}</div>
      </div>

      {/* 问题描述 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-3">问题描述</h2>
        <p className="whitespace-pre-wrap">{currentIssue.description}</p>
      </div>

      {/* 问题操作按钮 */}
      {canClose && (
        <div className="flex justify-end mb-8">
          <button
            onClick={() => updateIssueStatus("CLOSED")}
            disabled={isUpdating}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "处理中..." : "标记为已解决"}
          </button>
        </div>
      )}

      {/* 回复列表 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          回复历史 ({currentIssue.replies.length})
        </h2>

        {currentIssue.replies.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">暂无回复</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentIssue.replies.map((reply) => (
              <div
                key={reply.id}
                className={`p-4 rounded-lg ${reply.isAdminReply ? "bg-blue-50 border-l-4 border-blue-400" : "bg-gray-50"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">
                    {reply.user.name}
                    {reply.isAdminReply && (
                      <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        管理员
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(reply.createdAt)}
                  </div>
                </div>
                <p className="whitespace-pre-wrap">{reply.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 回复表单 */}
      {canReply && (
        <div>
          <h2 className="text-lg font-semibold mb-4">添加回复</h2>
          <IssueReplyForm
            issueId={currentIssue.id}
            onReplyAdded={handleNewReply}
          />
        </div>
      )}

      {/* 若问题已关闭则显示提示 */}
      {currentIssue.status === "CLOSED" && (
        <div className="text-center py-4 bg-gray-50 rounded-lg mt-6">
          <p className="text-gray-600">该问题已关闭，无法添加新回复</p>
        </div>
      )}
    </div>
  );
}
