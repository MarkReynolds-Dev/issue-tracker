import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

// 获取设置 (仅管理员)
export async function GET(request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "无权访问" }, { status: 403 });
    }

    // 查找第一个设置记录，如果没有则创建一个默认的
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      console.log("未找到设置记录，正在创建默认设置...");
      setting = await prisma.setting.create({
        data: {
          // Prisma 会使用 schema 中的默认值
        },
      });
      console.log("默认设置创建成功。");
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("获取设置失败:", error);
    return NextResponse.json({ error: "获取设置时出错" }, { status: 500 });
  }
}

// 更新设置 (仅管理员)
export async function PUT(request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    const body = await request.json();
    const { closedIssueDeleteDays, pendingIssueDeleteDays, dailyIssueLimit } =
      body;

    // 服务端验证
    if (
      typeof closedIssueDeleteDays !== "number" ||
      closedIssueDeleteDays <= 0 ||
      typeof pendingIssueDeleteDays !== "number" ||
      pendingIssueDeleteDays <= 0 ||
      typeof dailyIssueLimit !== "number" ||
      dailyIssueLimit <= 0
    ) {
      return NextResponse.json(
        { error: "所有设置值必须是正整数" },
        { status: 400 }
      );
    }

    // 查找第一个设置记录的 ID，如果没有则创建
    let setting = await prisma.setting.findFirst({
      select: { id: true }, // 只需要 id
    });
    if (!setting) {
      console.log("更新设置时未找到记录，正在创建默认设置...");
      setting = await prisma.setting.create({
        data: {
          closedIssueDeleteDays,
          pendingIssueDeleteDays,
          dailyIssueLimit,
        },
      });
      console.log("默认设置创建并更新成功。");
      return NextResponse.json({
        message: "设置已创建并保存",
        updatedSetting: setting,
      });
    } else {
      // 如果存在，则更新
      const updatedSetting = await prisma.setting.update({
        where: { id: setting.id },
        data: {
          closedIssueDeleteDays,
          pendingIssueDeleteDays,
          dailyIssueLimit,
        },
      });
      console.log("设置更新成功。");
      return NextResponse.json({ message: "设置保存成功", updatedSetting });
    }
  } catch (error) {
    console.error("更新设置失败:", error);
    return NextResponse.json({ error: "更新设置时出错" }, { status: 500 });
  }
}
