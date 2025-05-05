import IssueList from "@/app/components/issues/IssueList";

export const metadata = {
  title: "问题管理 - 问题追踪系统",
  description: "查看和管理所有用户提交的问题",
};

export default function AdminIssuesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">问题管理</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        {/* 调用 IssueList 但不传递 userOnly，显示所有问题 */}
        <IssueList />
      </div>
    </div>
  );
}
