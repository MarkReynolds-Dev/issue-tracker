import Link from "next/link";
import IssueList from "@/app/components/issues/IssueList";

export const metadata = {
  title: "问题列表 - 问题追踪系统",
  description: "浏览所有问题并查找解决方案",
};

export default function IssuesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">所有问题</h1>
        <Link
          href="/issues/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          提交新问题
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <IssueList />
      </div>
    </div>
  );
}
