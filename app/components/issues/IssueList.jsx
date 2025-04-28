"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import IssueCard from "./IssueCard";
import { statusMap } from "@/app/lib/utils";

export default function IssueList({ userOnly = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [issues, setIssues] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 获取URL参数
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true);
      setError("");

      try {
        let url = `/api/issues?page=${page}&limit=10`;

        if (status) {
          url += `&status=${status}`;
        }

        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }

        if (userOnly) {
          url += `&userId=current`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "获取问题列表失败");
        }

        setIssues(data.issues);
        setPagination(data.pagination);
      } catch (error) {
        setError(error.message);
        setIssues([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, [page, status, search, userOnly]);

  // 处理筛选变化
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    const params = new URLSearchParams(searchParams);
    if (newStatus) {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  // 处理搜索
  const handleSearch = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const searchTerm = formData.get("search");

    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  // 处理分页
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;

    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());

    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      {/* 筛选和搜索区域 */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            状态筛选
          </label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            {Object.entries(statusMap).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSearch} className="flex items-end gap-2">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              搜索问题
            </label>
            <input
              type="text"
              id="search"
              name="search"
              defaultValue={search}
              placeholder="输入关键词搜索..."
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            搜索
          </button>
        </form>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* 加载中状态 */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">暂无问题</p>
        </div>
      ) : (
        <>
          {/* 问题列表 */}
          <div className="space-y-4">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>

          {/* 分页 */}
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <div className="px-4 py-1 border-t border-b border-gray-300 bg-white">
                第 {page} 页，共 {pagination.pages} 页
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.pages}
                className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
