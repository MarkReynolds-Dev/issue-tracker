"use client";

import { useState } from "react";

export default function PasswordForm({ userId }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 清除消息
    setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setMessage({ type: "error", text: "请输入当前密码" });
      return false;
    }
    if (!formData.newPassword) {
      setMessage({ type: "error", text: "请输入新密码" });
      return false;
    }
    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "新密码长度不能少于6个字符" });
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "两次输入的新密码不一致" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`/api/users/${userId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "密码修改失败");
      }

      // 清空表单
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage({
        type: "success",
        text: "密码修改成功",
      });
    } catch (error) {
      console.error("密码修改失败:", error);
      setMessage({
        type: "error",
        text: error.message || "密码修改失败，请稍后再试",
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
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          当前密码
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入当前密码"
          required
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          新密码
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入新密码"
          minLength={6}
          required
        />
        <p className="mt-1 text-xs text-gray-500">密码长度不少于6个字符</p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          确认新密码
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请再次输入新密码"
          required
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "提交中..." : "修改密码"}
        </button>
      </div>
    </form>
  );
}
