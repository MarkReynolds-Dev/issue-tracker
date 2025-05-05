"use client";

import React from "react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "确认操作",
  message = "您确定要执行此操作吗？",
  confirmText = "确认",
  cancelText = "取消",
  confirmVariant = "danger", // 'danger' or 'primary'
}) {
  if (!isOpen) return null;

  const confirmButtonClasses = {
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-out"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose} // 点击背景关闭
    >
      <div
        className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-enter"
        onClick={(e) => e.stopPropagation()} // 阻止点击模态框内容关闭
      >
        {/* 标题 */}
        <h3
          className="text-lg font-semibold leading-6 text-gray-900 mb-2"
          id="modal-title"
        >
          {title}
        </h3>

        {/* 消息内容 */}
        <div className="mt-2 mb-4">
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        {/* 按钮组 */}
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonClasses[confirmVariant]}`}
            onClick={() => {
              onConfirm();
              onClose(); // 通常确认后也关闭模态框
            }}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>

      {/* 添加简单的动画效果 */}
      <style jsx global>{`
        @keyframes modal-enter-keyframes {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-modal-enter {
          animation: modal-enter-keyframes 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
