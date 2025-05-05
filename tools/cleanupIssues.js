const { PrismaClient } = require("../app/generated/prisma");
const prisma = new PrismaClient();

// 从环境变量读取天数，提供默认值
const CLOSED_ISSUE_DELETE_DAYS = parseInt(
  process.env.CLOSED_ISSUE_DELETE_DAYS || "7"
);
const PENDING_ISSUE_DELETE_DAYS = parseInt(
  process.env.PENDING_ISSUE_DELETE_DAYS || "30"
);

// 计算截止日期
const closedCutoffDate = new Date();
closedCutoffDate.setDate(closedCutoffDate.getDate() - CLOSED_ISSUE_DELETE_DAYS);

const pendingCutoffDate = new Date();
pendingCutoffDate.setDate(
  pendingCutoffDate.getDate() - PENDING_ISSUE_DELETE_DAYS
);

async function cleanupIssues() {
  console.log(`开始清理问题...`);
  console.log(
    ` - 将删除 ${CLOSED_ISSUE_DELETE_DAYS} 天前关闭的问题 (截止日期: ${closedCutoffDate.toISOString()})`
  );
  console.log(
    ` - 将删除 ${PENDING_ISSUE_DELETE_DAYS} 天前创建且仍未解决的问题 (截止日期: ${pendingCutoffDate.toISOString()})`
  );

  let deletedClosedCount = 0;
  let deletedPendingCount = 0;

  try {
    // 查找需要删除的已关闭问题
    const closedIssuesToDelete = await prisma.issue.findMany({
      where: {
        status: "CLOSED",
        closedAt: {
          lt: closedCutoffDate, // closedAt 早于截止日期
        },
      },
      select: { id: true }, // 只需要 ID
    });

    if (closedIssuesToDelete.length > 0) {
      console.log(
        `找到 ${closedIssuesToDelete.length} 个过期的已关闭问题，准备删除...`
      );
      const idsToDelete = closedIssuesToDelete.map((issue) => issue.id);

      await prisma.$transaction(async (tx) => {
        // 先删除回复
        await tx.reply.deleteMany({
          where: { issueId: { in: idsToDelete } },
        });
        // 再删除问题
        const result = await tx.issue.deleteMany({
          where: { id: { in: idsToDelete } },
        });
        deletedClosedCount = result.count;
      });
      console.log(`成功删除 ${deletedClosedCount} 个已关闭问题及其回复。`);
    } else {
      console.log("没有找到需要删除的已关闭问题。");
    }

    // 查找需要删除的长时间未处理问题 (PENDING 或 IN_PROGRESS)
    // 这里我们基于 createdAt，更复杂的逻辑可以看 updatedAt 或最后回复时间
    const pendingIssuesToDelete = await prisma.issue.findMany({
      where: {
        status: { in: ["PENDING", "IN_PROGRESS"] },
        createdAt: {
          lt: pendingCutoffDate, // createdAt 早于截止日期
        },
        // 可选：确保没有最近的回复 (如果需要更精确的"未回复")
        // replies: {
        //     none: {
        //         createdAt: { gte: pendingCutoffDate }
        //     }
        // }
      },
      select: { id: true },
    });

    if (pendingIssuesToDelete.length > 0) {
      console.log(
        `找到 ${pendingIssuesToDelete.length} 个长时间未处理的问题，准备删除...`
      );
      const idsToDelete = pendingIssuesToDelete.map((issue) => issue.id);

      await prisma.$transaction(async (tx) => {
        // 先删除回复
        await tx.reply.deleteMany({
          where: { issueId: { in: idsToDelete } },
        });
        // 再删除问题
        const result = await tx.issue.deleteMany({
          where: { id: { in: idsToDelete } },
        });
        deletedPendingCount = result.count;
      });
      console.log(
        `成功删除 ${deletedPendingCount} 个长时间未处理问题及其回复。`
      );
    } else {
      console.log("没有找到需要删除的长时间未处理问题。");
    }

    console.log(
      `清理完成。共删除 ${deletedClosedCount} 个已关闭问题，${deletedPendingCount} 个未处理问题。`
    );
    return { deletedClosedCount, deletedPendingCount }; // 返回结果
  } catch (error) {
    console.error("清理问题时出错:", error);
    throw error; // 抛出错误，让调用者处理
  } finally {
    await prisma.$disconnect();
    console.log("清理脚本：数据库连接已断开。");
  }
}

// 如果直接运行此文件，则执行清理
if (require.main === module) {
  cleanupIssues().catch((error) => {
    console.error("运行清理脚本失败:", error);
    process.exit(1);
  });
}

// 导出函数以便 API 路由调用
module.exports = { cleanupIssues };
