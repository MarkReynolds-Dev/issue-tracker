"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, statusMap } from "@/app/lib/utils";
import IssueReplyForm from "./IssueReplyForm";
import { formatDistanceToNow, addDays, format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function IssueDetail({ issue, currentUser }) {
  const router = useRouter();
  const [currentIssue, setCurrentIssue] = useState(issue);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 检查当前用户权限
  const isAdmin = currentUser?.role === "ADMIN";
  const isOwner = currentUser?.id === issue.userId;
  const canReply =
    currentUser && (isAdmin || isOwner) && currentIssue.status !== "CLOSED";
  const canClose =
    isAdmin || (isOwner && currentIssue.status === "IN_PROGRESS");
  const canDelete = isAdmin;

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

  // 处理删除问题
  const handleDeleteIssue = async () => {
    if (!window.confirm("确定要永久删除此问题及其所有回复吗？此操作无法撤销。")) {
      return;
    }
    setError("");
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/issues/${currentIssue.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "删除问题失败");
      }

      // 删除成功后跳转到问题列表页
      router.push(isAdmin ? "/admin/issues" : "/issues/my-issues"); 
      router.refresh(); // 可选，确保列表刷新

    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // 计算自动删除日期
  const calculateAutoDeleteDate = () => {
    const closedDays = parseInt(process.env.NEXT_PUBLIC_CLOSED_ISSUE_DELETE_DAYS || '7');
    const pendingDays = parseInt(process.env.NEXT_PUBLIC_PENDING_ISSUE_DELETE_DAYS || '30');
    
    if (currentIssue.status === 'CLOSED' && currentIssue.closedAt) {
      const closedDate = new Date(currentIssue.closedAt);
      return addDays(closedDate, closedDays);
    }
    // 简单起见，我们假设 PENDING 或 IN_PROGRESS 都是基于创建时间计算
    // 更复杂的逻辑可以基于 updatedAt 或最后回复时间
    if (currentIssue.status === 'PENDING' || currentIssue.status === 'IN_PROGRESS') {
        const createdAtDate = new Date(currentIssue.createdAt);
        return addDays(createdAtDate, pendingDays);
    }
    return null;
  };

  const autoDeleteDate = calculateAutoDeleteDate();

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

      {/* 显示自动删除时间提示 */}
      {autoDeleteDate && (
          <div className="mb-6 text-sm text-orange-600 bg-orange-50 p-3 rounded-md border border-orange-200">
              注意：此问题预计将在 {format(autoDeleteDate, 'yyyy年MM月dd日 HH:mm', { locale: zhCN })} 左右被自动清理。
          </div>
      )}

      {/* 问题描述 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-3">问题描述</h2>
        <p className="whitespace-pre-wrap">{currentIssue.description}</p>
      </div>

      {/* 问题操作按钮区域 */}
      <div className="flex justify-end items-center space-x-4 mb-8">
          {canClose && (
              <button
                  onClick={() => updateIssueStatus("CLOSED")}
                  disabled={isUpdating || isDeleting}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isUpdating ? "处理中..." : "标记为已解决"}
              </button>
          )}
          {canDelete && (
              <button
                  onClick={handleDeleteIssue}
                  disabled={isDeleting || isUpdating}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isDeleting ? "删除中..." : "删除问题"}
              </button>
          )}
      </div>

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
 