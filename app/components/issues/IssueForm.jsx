"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IssueForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 当用户开始输入时清除错误信息
    setError("");
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("请输入问题标题");
      return false;
    }
    if (!formData.description.trim()) {
      setError("请输入问题描述");
      return false;
    }
    if (formData.title.length < 5) {
      setError("问题标题至少需要5个字符");
      return false;
    }
    if (formData.description.length < 20) {
      setError("问题描述至少需要20个字符");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 表单验证
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // 确保发送cookie
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("请先登录后再提交问题");
        } else if (response.status === 403) {
          throw new Error("您没有权限执行此操作");
        } else {
          throw new Error(data.error || "提交问题失败");
        }
      }

      // 提交成功，重定向到问题详情页
      router.push(`/issues/${data.id}`);
      router.refresh();
    } catch (error) {
      setError(error.message);
      if (error.message.includes("登录")) {
        // 如果是未登录错误，可以选择重定向到登录页
        setTimeout(() => {
          router.push("/login?redirect=/issues/new");
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          问题标题
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入问题标题（至少5个字符）"
          minLength={5}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          问题描述
        </label>
        <textarea
          id="description"
          name="description"
          rows="6"
          required
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请详细描述您遇到的问题（至少20个字符）..."
          minLength={20}
        ></textarea>
        <p className="mt-1 text-sm text-gray-500">
          请提供详细信息，以便更好地理解和解决您的问题
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-2"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "提交中..." : "提交问题"}
        </button>
      </div>
    </form>
  );
}
