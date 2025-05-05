import { notFound } from "next/navigation";
import IssueDetail from "@/app/components/issues/IssueDetail";
import { prisma } from "@/app/lib/db";
import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;

    if (!id) {
      return {
        title: "问题不存在 - 问题追踪系统",
      };
    }

    const issue = await prisma.issue.findUnique({
      where: { id },
      select: { title: true },
    });

    if (!issue) {
      return {
        title: "问题不存在 - 问题追踪系统",
      };
    }

    return {
      title: `${issue.title} - 问题追踪系统`,
      description: "查看问题详情和回复历史",
    };
  } catch (error) {
    console.error("生成元数据失败:", error);
    return {
      title: "问题详情 - 问题追踪系统",
      description: "查看问题详情和回复历史",
    };
  }
}

export default async function IssueDetailPage({ params }) {
  try {
    const { id } = await params;

    if (!id) {
      notFound();
    }

    // 获取问题详情
    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!issue) {
      notFound();
    }

    // 获取当前用户信息 (使用修复后的 getCurrentUser)
    const currentUser = await getCurrentUser();

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/issues"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回问题列表
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <IssueDetail issue={issue} currentUser={currentUser} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("获取问题详情失败:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          加载问题详情时出错，请稍后再试
        </div>
        <div className="mt-4">
          <Link href="/issues" className="text-blue-600 hover:text-blue-800">
            返回问题列表
          </Link>
        </div>
      </div>
    );
  }
}
