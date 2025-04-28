import { PrismaClient } from "@/app/generated/prisma";
import cron from "node-cron";

const prisma = new PrismaClient();

// 清理过期问题的函数
async function cleanupIssues() {
  try {
    console.log("开始清理过期问题...");

    // 获取系统设置
    const settings = await prisma.setting.findFirst();

    if (!settings) {
      console.log("未找到系统设置，使用默认值");
      return;
    }

    const { closedIssueDeleteDays, pendingIssueDeleteDays } = settings;

    // 获取日期对象，用于计算过期时间
    const now = new Date();

    // 计算已关闭问题的过期时间
    const closedExpireDate = new Date(now);
    closedExpireDate.setDate(
      closedExpireDate.getDate() - closedIssueDeleteDays
    );

    // 计算未回复问题的过期时间
    const pendingExpireDate = new Date(now);
    pendingExpireDate.setDate(
      pendingExpireDate.getDate() - pendingIssueDeleteDays
    );

    // 查询需要删除的问题
    const expiredClosedIssues = await prisma.issue.findMany({
      where: {
        status: "CLOSED",
        closedAt: {
          lte: closedExpireDate,
        },
      },
      select: { id: true },
    });

    const expiredPendingIssues = await prisma.issue.findMany({
      where: {
        status: "PENDING",
        updatedAt: {
          lte: pendingExpireDate,
        },
        replies: {
          none: {},
        },
      },
      select: { id: true },
    });

    // 合并需要删除的问题ID
    const allExpiredIssueIds = [
      ...expiredClosedIssues.map((issue) => issue.id),
      ...expiredPendingIssues.map((issue) => issue.id),
    ];

    if (allExpiredIssueIds.length === 0) {
      console.log("没有需要清理的过期问题");
      return;
    }

    // 删除这些问题的所有回复
    const deleteRepliesResult = await prisma.reply.deleteMany({
      where: {
        issueId: {
          in: allExpiredIssueIds,
        },
      },
    });

    console.log(`已删除 ${deleteRepliesResult.count} 条回复`);

    // 删除过期问题
    const deleteIssuesResult = await prisma.issue.deleteMany({
      where: {
        id: {
          in: allExpiredIssueIds,
        },
      },
    });

    console.log(`已删除 ${deleteIssuesResult.count} 个过期问题`);
    console.log("问题清理完成");
  } catch (error) {
    console.error("清理过期问题时出错:", error);
  }
}

// 设置每天凌晨3点执行清理任务
// 格式: 秒 分 时 日 月 星期
// 0 0 3 * * * 表示每天凌晨3点整
cron.schedule("0 0 3 * * *", () => {
  console.log("开始执行定时清理任务...");
  cleanupIssues();
});

console.log("清理服务已启动，将在每天凌晨3点执行清理任务");

// 也可以手动触发清理
if (process.argv.includes("--run-now")) {
  console.log("手动触发清理任务...");
  cleanupIssues();
}
