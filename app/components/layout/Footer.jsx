"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">关于我们</h3>
            <p className="text-gray-600">
              问题追踪系统提供高效的问题管理解决方案，帮助团队更好地跟踪和解决问题。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600">
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href="/issues/new"
                  className="text-gray-600 hover:text-blue-600"
                >
                  提交问题
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600"
                >
                  登录
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-600 hover:text-blue-600"
                >
                  注册
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <p className="text-gray-600 mb-2">邮箱: support@issuetracker.com</p>
            <p className="text-gray-600">电话: (123) 456-7890</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {currentYear} 问题追踪系统. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
}
