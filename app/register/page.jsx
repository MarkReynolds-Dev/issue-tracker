import Link from "next/link";
import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "注册 - 问题追踪系统",
  description: "创建您的问题追踪系统账户",
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">注册</h1>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              已有账号？{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
