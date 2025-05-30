import { prisma } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 生成密码哈希
export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// 验证密码
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// 生成JWT令牌
export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

// 验证JWT令牌
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// 获取当前用户
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("未找到token (getCurrentUser)");
      return null;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      console.log("token验证失败 (getCurrentUser)");
      return null;
    }

    if (!decoded.id) {
      console.error("Decoded token is missing 'id' property.", decoded);
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      console.log(`未找到 ID 为 ${decoded.id} 的用户 (getCurrentUser)`);
      return null;
    }

    return user;
  } catch (error) {
    console.error("获取当前用户时出错 (getCurrentUser):", error);
    return null;
  }
}

// 检查用户是否为管理员
export function isAdmin(user) {
  return user && user.role === "ADMIN";
}
