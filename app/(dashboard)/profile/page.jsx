import { redirect } from "next/navigation";
import ProfileForm from "@/app/components/user/ProfileForm";
import PasswordForm from "@/app/components/user/PasswordForm";
import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";

export const metadata = {
  title: "用户中心 - 问题追踪系统",
  description: "管理您的个人信息和账户设置",
};

export default async function ProfilePage() {
  // 获取当前用户信息 (使用修复后的 getCurrentUser)
  const user = await getCurrentUser();

  // 如果未登录，重定向
  if (!user) {
    redirect("/login?redirect=/profile");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户中心</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          返回首页
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">个人信息</h2>
          <ProfileForm user={user} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">修改密码</h2>
          <PasswordForm userId={user.id} />
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">账户信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">邮箱</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">角色</p>
            <p className="font-medium">
              {user.role === "ADMIN" ? "管理员" : "普通用户"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
 