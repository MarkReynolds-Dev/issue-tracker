import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "登录 - 问题追踪系统",
  description: "登录您的问题追踪系统账户",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">登录</h1>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              还没有账号？{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
