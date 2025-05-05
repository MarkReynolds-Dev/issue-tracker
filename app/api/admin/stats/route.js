import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";

export async function GET(request) {
  try {
    // 验证管理员权限
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "无权访问" }, { status: 403 });
    }

    // 计算未解决问题数 (PENDING 或 IN_PROGRESS)
    const unresolvedCount = await prisma.issue.count({
      where: {
        status: {
          in: ["PENDING", "IN_PROGRESS"],
        },
      },
    });

    // 计算今日解决问题数
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const resolvedTodayCount = await prisma.issue.count({
      where: {
        status: "CLOSED",
        closedAt: {
          gte: startOfDay, // 大于等于今天 0 点
          lte: endOfDay, // 小于等于今天 24 点
        },
      },
    });

    // 返回统计数据
    return NextResponse.json({
      unresolvedCount,
      resolvedTodayCount,
    });
  } catch (error) {
    console.error("获取管理统计数据失败:", error);
    return NextResponse.json({ error: "获取统计数据时出错" }, { status: 500 });
  }
}
