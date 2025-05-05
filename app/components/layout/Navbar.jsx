"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsMenuOpen(false);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "GET",
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        console.error("退出登录请求失败:", response.statusText);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("退出登录时出错:", error);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          问题追踪系统
        </Link>

        {/* 移动端菜单按钮 */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 桌面菜单 */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            首页
          </Link>

          {user ? (
            <>
              <Link
                href="/issues/my-issues"
                className="text-gray-600 hover:text-blue-600"
              >
                我的问题
              </Link>

              {user.role !== "ADMIN" && (
                <Link
                  href="/issues/new"
                  className="text-gray-600 hover:text-blue-600"
                >
                  提交问题
                </Link>
              )}

              <Link
                href="/profile"
                className="text-gray-600 hover:text-blue-600"
              >
                用户中心
              </Link>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-blue-600"
                >
                  管理后台
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-left"
              >
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 py-2 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col px-4 space-y-2">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              首页
            </Link>

            {user ? (
              <>
                <Link
                  href="/issues/my-issues"
                  className="text-gray-600 hover:text-blue-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  我的问题
                </Link>

                {user.role !== "ADMIN" && (
                  <Link
                    href="/issues/new"
                    className="text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    提交问题
                  </Link>
                )}

                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-blue-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  用户中心
                </Link>

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    管理后台
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 py-2 text-left w-full"
                >
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="text-gray-600 hover:text-blue-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
