import IssueForm from "@/app/components/issues/IssueForm";

export const metadata = {
  title: "提交问题 - 问题追踪系统",
  description: "提交您的问题，获得专业解答",
};

export default function NewIssuePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">提交新问题</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <IssueForm />
      </div>
    </div>
  );
}
 