"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ user }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 加载用户数据
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (!response.ok) {
          throw new Error("获取用户信息失败");
        }
        const userData = await response.json();
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("获取用户信息出错:", error);
        setMessage({
          type: "error",
          text: "获取用户信息失败，请刷新页面重试",
        });
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 清除消息
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "更新个人信息失败");
      }

      setMessage({
        type: "success",
        text: "个人信息更新成功",
      });

      // 刷新页面以显示最新信息
      router.refresh();
    } catch (error) {
      console.error("更新个人信息失败:", error);
      setMessage({
        type: "error",
        text: error.message || "更新个人信息失败，请稍后再试",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message.text && (
        <div
          className={`p-3 rounded ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          用户名
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入您的用户名"
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          邮箱地址
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          placeholder="请输入您的邮箱地址"
        />
        <p className="mt-1 text-xs text-gray-500">邮箱地址不可修改</p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "保存中..." : "保存修改"}
        </button>
      </div>
    </form>
  );
}
