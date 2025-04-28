"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

const statusText = {
  PENDING: "待处理",
  IN_PROGRESS: "处理中",
  RESOLVED: "已解决",
  CLOSED: "已关闭",
};

export default function IssueCard({ issue }) {
  if (!issue) {
    return null;
  }

  const replyCount = issue.replies?.length || 0;
  const createdAt = new Date(issue.createdAt);
  const timeAgo = formatDistanceToNow(createdAt, {
    addSuffix: true,
    locale: zhCN,
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <Link
          href={`/issues/${issue.id}`}
          className="text-xl font-semibold text-gray-900 hover:text-blue-600"
        >
          {issue.title}
        </Link>
        <span
          className={`px-2 py-1 text-sm font-medium rounded-full ${
            statusColors[issue.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {statusText[issue.status] || "未知状态"}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{issue.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>提交者: {issue.user?.name || "未知用户"}</span>
          <span>回复: {replyCount}</span>
        </div>
        <span>{timeAgo}</span>
      </div>
    </div>
  );
}
