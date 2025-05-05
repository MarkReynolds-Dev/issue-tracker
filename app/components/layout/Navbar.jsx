"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  const isActive = (href) => pathname === href;

  const commonLinkClasses =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out";
  const activeLinkClasses = "bg-blue-100 text-blue-700";
  const inactiveLinkClasses =
    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900";

  const mobileCommonLinkClasses =
    "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out";
  const mobileActiveLinkClasses = "bg-blue-100 text-blue-700";
  const mobileInactiveLinkClasses =
    "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-150 ease-in-out"
        >
          问题追踪系统
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">打开主菜单</span>
            {isMenuOpen ? (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          <Link
            href="/"
            className={`${commonLinkClasses} ${isActive("/") ? activeLinkClasses : inactiveLinkClasses}`}
          >
            首页
          </Link>

          {user ? (
            <>
              <Link
                href="/issues/my-issues"
                className={`${commonLinkClasses} ${isActive("/issues/my-issues") ? activeLinkClasses : inactiveLinkClasses}`}
              >
                我的问题
              </Link>

              {user.role !== "ADMIN" && (
                <Link
                  href="/issues/new"
                  className={`${commonLinkClasses} ${isActive("/issues/new") ? activeLinkClasses : inactiveLinkClasses}`}
                >
                  提交问题
                </Link>
              )}

              <Link
                href="/profile"
                className={`${commonLinkClasses} ${isActive("/profile") ? activeLinkClasses : inactiveLinkClasses}`}
              >
                用户中心
              </Link>

              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`${commonLinkClasses} ${pathname.startsWith("/admin") ? activeLinkClasses : inactiveLinkClasses}`}
                >
                  管理后台
                </Link>
              )}

              <button
                onClick={handleLogout}
                className={`${commonLinkClasses} ${inactiveLinkClasses} bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 focus:bg-red-100 focus:text-red-700`}
              >
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`${commonLinkClasses} ${isActive("/login") ? activeLinkClasses : inactiveLinkClasses} border border-transparent hover:border-gray-300`}
              >
                登录
              </Link>
              <Link
                href="/register"
                className={`${commonLinkClasses} bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700`}
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>

      <div
        className={`${isMenuOpen ? "block" : "hidden"} md:hidden transition-all duration-300 ease-out`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/"
            className={`${mobileCommonLinkClasses} ${isActive("/") ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
            onClick={() => setIsMenuOpen(false)}
          >
            首页
          </Link>
          {user ? (
            <>
              <Link
                href="/issues/my-issues"
                className={`${mobileCommonLinkClasses} ${isActive("/issues/my-issues") ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
                onClick={() => setIsMenuOpen(false)}
              >
                我的问题
              </Link>
              {user.role !== "ADMIN" && (
                <Link
                  href="/issues/new"
                  className={`${mobileCommonLinkClasses} ${isActive("/issues/new") ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  提交问题
                </Link>
              )}
              <Link
                href="/profile"
                className={`${mobileCommonLinkClasses} ${isActive("/profile") ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
                onClick={() => setIsMenuOpen(false)}
              >
                用户中心
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`${mobileCommonLinkClasses} ${pathname.startsWith("/admin") ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  管理后台
                </Link>
              )}
              <button
                onClick={handleLogout}
                className={`${mobileCommonLinkClasses} ${mobileInactiveLinkClasses} text-red-600 hover:bg-red-50 w-full text-left`}
              >
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`${mobileCommonLinkClasses} ${isActive("/login") ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
                onClick={() => setIsMenuOpen(false)}
              >
                登录
              </Link>
              <Link
                href="/register"
                className={`${mobileCommonLinkClasses} ${isActive("/register") ? mobileActiveLinkClasses : mobileInactiveLinkClasses}`}
                onClick={() => setIsMenuOpen(false)}
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
