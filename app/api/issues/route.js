import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth";

// 获取问题列表
export async function GET(request) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const userOnly = searchParams.get("userOnly") === "true";

    // 获取当前用户
    const currentUser = await getCurrentUser(request);
    console.log("当前用户:", currentUser);

    if (userOnly && !currentUser) {
      console.log("访问个人问题列表需要登录");
      return NextResponse.json(
        { error: "请先登录后再查看个人问题" },
        { status: 401 }
      );
    }

    // 构建查询条件
    const where = {};

    // 根据状态筛选
    if (status) {
      where.status = status;
    }

    // 根据搜索词筛选
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // 如果是查看个人问题，只显示当前用户的问题
    if (userOnly && currentUser) {
      where.userId = currentUser.id;
    }

    // 如果不是管理员，只能看到自己的问题
    if (currentUser && currentUser.role !== "ADMIN" && !userOnly) {
      where.userId = currentUser.id;
    }

    // 查询总数
    const total = await prisma.issue.count({ where });

    // 查询问题列表
    const issues = await prisma.issue.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: {
          select: {
            id: true,
            content: true,
            createdAt: true,
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
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      issues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("获取问题列表失败:", error);
    return NextResponse.json(
      { error: "获取问题列表时出现错误" },
      { status: 500 }
    );
  }
}

// 创建新问题
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "请提供问题标题和描述" },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "请先登录后再提交问题" },
        { status: 401 }
      );
    }

    // --- 添加每日限制检查 ---
    if (currentUser.role !== "ADMIN") {
      // 1. 获取设置
      const setting = await prisma.setting.findFirst();
      const dailyLimit = setting?.dailyIssueLimit ?? 3; // 如果没找到设置或字段，默认为 3

      // 2. 计算今天范围 (确保时间基于服务器时间)
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      );

      // 3. 计算用户今天提交的数量
      const issuesTodayCount = await prisma.issue.count({
        where: {
          userId: currentUser.id,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      // 4. 检查是否超限
      if (issuesTodayCount >= dailyLimit) {
        console.log(
          `用户 ${currentUser.id} 尝试提交问题，已达今日上限 (${issuesTodayCount}/${dailyLimit})`
        );
        return NextResponse.json(
          { error: `您今天已达到提交上限 (${dailyLimit}个问题)` },
          { status: 429 } // 429 Too Many Requests
        );
      }
    }
    // --- 限制检查结束 ---

    // 创建新问题 (如果通过检查)
    const newIssue = await prisma.issue.create({
      data: {
        title,
        description,
        status: "PENDING",
        userId: currentUser.id,
      },
    });

    console.log(`用户 ${currentUser.id} 成功提交问题 ${newIssue.id}`);
    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error("创建问题失败:", error);
    const errorMessage =
      error instanceof Error ? error.message : "创建问题时出现未知错误";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
