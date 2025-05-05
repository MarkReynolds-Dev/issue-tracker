const { PrismaClient } = require("../app/generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// 配置管理员信息
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@issue-tracker.app";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || generateRandomPassword(12);

// 生成密码哈希 (与 app/lib/auth.js 中的 hashPassword 保持一致)
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// 生成随机密码
function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  // 确保包含至少一个数字和一个特殊字符以增加复杂度
  if (!/\d/.test(password)) {
    password += Math.floor(Math.random() * 10);
  }
  if (!/[!@#$%^&*]/.test(password)) {
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
  }
  return password.slice(0, length); // 保证长度
}

async function main() {
  console.log("开始检查并创建管理员账户...");

  try {
    // 检查管理员是否已存在
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (existingAdmin) {
      console.log(
        `管理员账户 (邮箱: ${existingAdmin.email}) 已存在，跳过创建。`
      );
      return;
    }

    // 检查指定邮箱是否已被占用（可能被普通用户占用）
    const userWithEmail = await prisma.user.findUnique({
      where: {
        email: ADMIN_EMAIL,
      },
    });

    if (userWithEmail) {
      console.error(
        `错误：邮箱 ${ADMIN_EMAIL} 已被用户 ${userWithEmail.id} 占用，无法创建管理员。请使用不同的 ADMIN_EMAIL 环境变量。`
      );
      // 退出码非0表示错误，可能会中断 Vercel 构建
      process.exit(1);
      return;
    }

    // 创建管理员账户
    const hashedPassword = await hashPassword(ADMIN_PASSWORD);
    const adminUser = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: "Admin User", // 默认名称
        role: "ADMIN",
      },
    });

    console.log("管理员账户创建成功!");
    console.log(`  邮箱: ${adminUser.email}`);
    // 重要提示：只在环境变量未设置时显示生成的密码
    if (!process.env.ADMIN_PASSWORD) {
      console.log(`  初始密码: ${ADMIN_PASSWORD}`);
      console.warn("  请立即使用此密码登录并修改密码！");
    } else {
      console.log("  密码: [使用环境变量 ADMIN_PASSWORD]");
    }
  } catch (error) {
    console.error("创建管理员账户时出错:", error);
    process.exit(1); // 发生错误时退出，中断构建
  } finally {
    await prisma.$disconnect();
    console.log("数据库连接已断开。");
  }
}

main();
