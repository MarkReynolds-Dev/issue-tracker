import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { cookies } from "next/headers";
import { verifyToken } from "./lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "问题追踪系统",
  description: "高效的问题提交与解决平台",
};

export default async function RootLayout({ children }) {
  // 尝试从cookie中获取用户信息
  let user = null;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    const decodedToken = verifyToken(token);
    if (decodedToken) {
      user = {
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
      };
    }
  }

  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar user={user} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
