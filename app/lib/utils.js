import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 组合Tailwind类名的工具函数
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// 格式化日期的工具函数
export function formatDate(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(date));
}

// 状态映射工具
export const statusMap = {
  PENDING: {
    label: "待解决",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  IN_PROGRESS: {
    label: "解决中",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  CLOSED: {
    label: "已关闭",
    color: "bg-green-100 text-green-800 border-green-200",
  },
};

// 验证是否为有效的邮箱格式
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
