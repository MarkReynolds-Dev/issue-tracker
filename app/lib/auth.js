import { prisma } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
export async function getCurrentUser(req) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
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

    return user;
  } catch (error) {
    return null;
  }
}

// 检查用户是否为管理员
export function isAdmin(user) {
  return user && user.role === "ADMIN";
}
