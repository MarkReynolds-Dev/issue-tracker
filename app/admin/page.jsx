"use client"; // 改为客户端组件以使用 useEffect 和 useState

import { useState, useEffect } from "react";

// 定义一个简单的卡片组件来显示统计数据
function StatCard({ title, value, bgColor = "bg-blue-600" }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
      <p className={`text-3xl font-bold ${bgColor.replace("bg-", "text-")}`}>
        {value === null ? "加载中..." : value}
      </p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    unresolvedCount: null,
    resolvedTodayCount: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "获取统计数据失败");
        }
        const data = await response.json();
        setStats(data);
        setError(""); // 清除之前的错误
      } catch (err) {
        console.error(err);
        setError(err.message);
        // 设置默认值以避免显示 "加载中..."
        setStats({ unresolvedCount: "错误", resolvedTodayCount: "错误" });
      }
    };

    fetchStats();
  }, []); // 空依赖数组确保只在组件挂载时运行一次

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">管理仪表盘</h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">错误:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="未解决问题"
          value={stats.unresolvedCount}
          bgColor="bg-blue-600"
        />
        <StatCard
          title="今日解决"
          value={stats.resolvedTodayCount}
          bgColor="bg-green-600"
        />
        {/* 可以添加更多统计信息卡片 */}
      </div>

      {/* 未来可以添加图表或其他管理快捷入口 */}
    </div>
  );
}
