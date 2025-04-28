import { PrismaClient } from "@/app/generated/prisma";
import { hashPassword } from "@/app/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("开始生成种子数据...");

  // 清空现有数据
  console.log("清空现有数据...");
  await prisma.reply.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  // 创建管理员用户
  console.log("创建管理员用户...");
  const adminHashedPassword = await hashPassword("admin123");
  const admin = await prisma.user.create({
    data: {
      name: "管理员",
      email: "admin@example.com",
      password: adminHashedPassword,
      role: "ADMIN",
    },
  });

  // 创建普通用户
  console.log("创建普通用户...");
  const userHashedPassword = await hashPassword("user123");
  const normalUser = await prisma.user.create({
    data: {
      name: "测试用户",
      email: "user@example.com",
      password: userHashedPassword,
      role: "USER",
    },
  });

  // 创建示例问题
  console.log("创建示例问题...");
  const issue1 = await prisma.issue.create({
    data: {
      title: "无法登录系统",
      description:
        "我尝试用我的账号登录，但系统提示密码错误，我确定我的密码是正确的。请帮助我解决这个问题。",
      status: "PENDING",
      userId: normalUser.id,
    },
  });

  const issue2 = await prisma.issue.create({
    data: {
      title: "如何修改个人资料？",
      description:
        "我想修改我的个人资料信息，但找不到入口，请问在哪里可以进行修改？",
      status: "IN_PROGRESS",
      userId: normalUser.id,
    },
  });

  const issue3 = await prisma.issue.create({
    data: {
      title: "功能建议：添加深色模式",
      description: "希望能够添加深色模式，这样晚上使用系统时对眼睛更友好。",
      status: "CLOSED",
      closedAt: new Date(),
      userId: normalUser.id,
    },
  });

  // 创建示例回复
  console.log("创建示例回复...");
  await prisma.reply.create({
    data: {
      content:
        '您好，请问您是否尝试过重置密码？如果没有，请点击登录页面的"忘记密码"链接进行重置。',
      isAdminReply: true,
      userId: admin.id,
      issueId: issue1.id,
    },
  });

  await prisma.reply.create({
    data: {
      content: "谢谢您的回复，我试了重置密码，现在可以登录了！",
      isAdminReply: false,
      userId: normalUser.id,
      issueId: issue1.id,
    },
  });

  await prisma.reply.create({
    data: {
      content:
        '您可以在右上角点击您的用户名，然后在下拉菜单中选择"个人设置"进行修改。',
      isAdminReply: true,
      userId: admin.id,
      issueId: issue2.id,
    },
  });

  await prisma.reply.create({
    data: {
      content: "感谢您的建议，我们正在考虑在下一个版本中添加深色模式功能。",
      isAdminReply: true,
      userId: admin.id,
      issueId: issue3.id,
    },
  });

  await prisma.reply.create({
    data: {
      content: "太好了，期待这个功能的上线！",
      isAdminReply: false,
      userId: normalUser.id,
      issueId: issue3.id,
    },
  });

  // 创建系统设置
  console.log("创建系统设置...");
  await prisma.setting.create({
    data: {
      closedIssueDeleteDays: 7,
      pendingIssueDeleteDays: 30,
    },
  });

  console.log("种子数据生成完成！");
}

main()
  .catch((e) => {
    console.error("种子数据生成失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
