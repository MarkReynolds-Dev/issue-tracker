"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    closedIssueDeleteDays: "",
    pendingIssueDeleteDays: "",
    dailyIssueLimit: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 获取当前设置
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setMessage({ type: "", text: "" });
      try {
        const response = await fetch("/api/admin/settings");
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "获取设置失败");
        }
        const data = await response.json();
        setSettings({
          closedIssueDeleteDays: data.closedIssueDeleteDays?.toString() ?? "7",
          pendingIssueDeleteDays:
            data.pendingIssueDeleteDays?.toString() ?? "30",
          dailyIssueLimit: data.dailyIssueLimit?.toString() ?? "3",
        });
      } catch (err) {
        console.error("获取设置出错:", err);
        setMessage({ type: "error", text: `获取设置失败: ${err.message}` });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 只允许输入数字
    if (/^\d*$/.test(value)) {
      setSettings((prev) => ({ ...prev, [name]: value }));
      setMessage({ type: "", text: "" }); // 清除消息
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    // 简单验证
    const closedDays = parseInt(settings.closedIssueDeleteDays);
    const pendingDays = parseInt(settings.pendingIssueDeleteDays);
    const limit = parseInt(settings.dailyIssueLimit);

    if (isNaN(closedDays) || closedDays <= 0) {
      setMessage({ type: "error", text: "已关闭问题删除天数必须是正整数" });
      setSaving(false);
      return;
    }
    if (isNaN(pendingDays) || pendingDays <= 0) {
      setMessage({ type: "error", text: "未处理问题删除天数必须是正整数" });
      setSaving(false);
      return;
    }
    if (isNaN(limit) || limit <= 0) {
      setMessage({ type: "error", text: "每日问题提交限制必须是正整数" });
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          closedIssueDeleteDays: closedDays,
          pendingIssueDeleteDays: pendingDays,
          dailyIssueLimit: limit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "保存设置失败");
      }

      setMessage({ type: "success", text: "设置保存成功！" });
      // 可选：更新表单显示的值，以防后端有处理（虽然这里直接用了前端的值）
      setSettings({
        closedIssueDeleteDays:
          data.updatedSetting.closedIssueDeleteDays.toString(),
        pendingIssueDeleteDays:
          data.updatedSetting.pendingIssueDeleteDays.toString(),
        dailyIssueLimit: data.updatedSetting.dailyIssueLimit.toString(),
      });
    } catch (err) {
      console.error("保存设置出错:", err);
      setMessage({ type: "error", text: `保存设置失败: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">系统设置</h1>

      {message.text && (
        <div
          className={`p-3 rounded mb-4 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <p>加载设置中...</p>
      ) : (
        <form
          onSubmit={handleSave}
          className="bg-white p-6 rounded-lg shadow space-y-6"
        >
          <div>
            <label
              htmlFor="dailyIssueLimit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              每日问题提交限制 (普通用户)
            </label>
            <input
              type="text" // 使用 text 类型配合正则验证数字输入
              id="dailyIssueLimit"
              name="dailyIssueLimit"
              value={settings.dailyIssueLimit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              inputMode="numeric" // 提示数字键盘
              pattern="\d*" // HTML5 模式验证
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              每个普通用户每天可以提交的问题数量。
            </p>
          </div>

          <div>
            <label
              htmlFor="closedIssueDeleteDays"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              已关闭问题自动删除天数
            </label>
            <input
              type="text"
              id="closedIssueDeleteDays"
              name="closedIssueDeleteDays"
              value={settings.closedIssueDeleteDays}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              inputMode="numeric"
              pattern="\d*"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              问题被标记为 "已关闭" 后，经过多少天自动删除。
            </p>
          </div>

          <div>
            <label
              htmlFor="pendingIssueDeleteDays"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              未处理问题自动删除天数
            </label>
            <input
              type="text"
              id="pendingIssueDeleteDays"
              name="pendingIssueDeleteDays"
              value={settings.pendingIssueDeleteDays}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              inputMode="numeric"
              pattern="\d*"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              状态为 "待处理" 或 "处理中"
              的问题，在创建后经过多少天未关闭则自动删除。
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "保存中..." : "保存设置"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
