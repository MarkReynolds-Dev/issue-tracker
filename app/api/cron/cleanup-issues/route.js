import { NextResponse } from "next/server";
import { cleanupIssues } from "@/tools/cleanupIssues"; // 导入清理逻辑

// 从环境变量获取 Cron Secret
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request) {
  // 验证 Cron Secret
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    console.warn("Cron 任务：无效的 Secret 或未配置 Secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Cron 任务：开始执行问题清理...");

  try {
    const result = await cleanupIssues(); // 调用清理函数
    console.log("Cron 任务：问题清理成功", result);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Cron 任务：问题清理失败:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
