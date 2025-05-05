import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/app/lib/auth";
import Link from "next/link";

// 添加 metadata 对象
export const metadata = {
  title: "管理后台 - 问题追踪系统",
  description: "管理员后台管理界面",
};

// 这个函数验证用户是否是管理员
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login?redirect=/admin"); // 没有 token，重定向到登录
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    redirect("/login?redirect=/admin"); // token 无效，重定向到登录
  }

  if (decoded.role !== "ADMIN") {
    redirect("/"); // 不是管理员，重定向到首页
  }

  // 返回用户信息，以便子页面可能需要
  return decoded;
}

export default async function AdminLayout({ children }) {
  const adminUser = await verifyAdmin(); // 验证管理员权限

  return (
    <div className="flex min-h-screen">
      {/* 可选的侧边栏导航 */}
      <aside className="w-64 bg-gray-800 text-white p-4 hidden md:block">
        <h2 className="text-xl font-semibold mb-6">管理后台</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                href="/admin"
                className="block py-2 px-3 rounded hover:bg-gray-700"
              >
                仪表盘
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/admin/issues"
                className="block py-2 px-3 rounded hover:bg-gray-700"
              >
                问题管理
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/admin/settings"
                className="block py-2 px-3 rounded hover:bg-gray-700"
              >
                系统设置
              </Link>
            </li>
            <li className="mt-auto pt-4 border-t border-gray-700">
              <Link
                href="/"
                className="block py-2 px-3 rounded hover:bg-gray-700 text-sm"
              >
                返回前台
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* 主要内容区域 */}
      <main className="flex-1 p-6 bg-gray-100">
        {/* 可以在这里添加一个简单的页眉或面包屑导航 */}
        {/* <div className="bg-white shadow rounded-lg p-4 mb-6">
             <p>欢迎, {adminUser.name || adminUser.email}</p>
           </div> */}
        {children} {/* 渲染子页面内容 */}
      </main>
    </div>
  );
}
