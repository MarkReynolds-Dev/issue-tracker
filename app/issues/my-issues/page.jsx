import Link from "next/link";
import IssueList from "@/app/components/issues/IssueList";
import { getCurrentUser } from "@/app/lib/auth";

export const metadata = {
  title: "我的问题 - 问题追踪系统",
  description: "查看和管理您提交的问题",
};

export default async function MyIssuesPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">我的问题</h1>
        {currentUser && currentUser.role !== "ADMIN" && (
          <Link
            href="/issues/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            提交新问题
          </Link>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <IssueList userOnly={true} />
      </div>
    </div>
  );
}
