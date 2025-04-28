import Link from "next/link";
import Image from "next/image";

export default function Home() {
  // 模拟统计数据
  const stats = {
    totalIssues: 12500,
    resolvedIssues: 11200,
    resolutionRate: 89.6,
    avgResolutionTime: "6.5小时",
  };

  // 模拟用户见证
  const testimonials = [
    {
      name: "张先生",
      company: "科技创新有限公司",
      quote:
        "问题追踪系统帮助我们将问题解决时间缩短了40%，大大提高了工作效率。",
      avatar: "/images/avatar1.jpg",
    },
    {
      name: "李女士",
      company: "数字互联网集团",
      quote:
        "直观的界面和强大的功能，让我们的问题管理变得轻松简单。必须给五星好评！",
      avatar: "/images/avatar2.jpg",
    },
    {
      name: "王总监",
      company: "未来科技有限公司",
      quote:
        "自动化的问题处理流程，让我们能够更专注于解决问题本身，而不是管理流程。",
      avatar: "/images/avatar3.jpg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 英雄区域 */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            高效问题追踪与解决方案
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            轻松提交、跟踪和解决问题，提高团队协作效率，让解决方案更快到达用户手中
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              免费注册
            </Link>
            <Link
              href="/issues/new"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              提交问题
            </Link>
          </div>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">特色功能</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">简单直观的问题提交</h3>
              <p className="text-gray-600">
                用户友好的界面，几步操作即可提交问题，无需复杂流程
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">高效问题解决</h3>
              <p className="text-gray-600">
                管理员快速响应，用户便捷确认，问题解决流程清晰高效
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">自动化管理</h3>
              <p className="text-gray-600">
                问题状态自动更新，过期问题自动处理，减少手动操作
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">问题解决效率</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalIssues.toLocaleString()}
              </p>
              <p className="text-gray-600">总问题数</p>
            </div>
            <div className="text-center p-6">
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {stats.resolvedIssues.toLocaleString()}
              </p>
              <p className="text-gray-600">已解决问题</p>
            </div>
            <div className="text-center p-6">
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {stats.resolutionRate}%
              </p>
              <p className="text-gray-600">解决率</p>
            </div>
            <div className="text-center p-6">
              <p className="text-4xl font-bold text-blue-600 mb-2">
                {stats.avgResolutionTime}
              </p>
              <p className="text-gray-600">平均解决时间</p>
            </div>
          </div>
        </div>
      </section>

      {/* 用户使用指南 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">使用指南</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">注册账号</h3>
              <p className="text-gray-600 text-center">
                简单几步完成注册，开始使用问题追踪系统
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">提交问题</h3>
              <p className="text-gray-600 text-center">
                详细描述您遇到的问题，等待管理员回复
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">确认解决</h3>
              <p className="text-gray-600 text-center">
                收到满意的解决方案后，确认问题已解决
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 用户见证 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">用户见证</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 relative overflow-hidden">
                    {/* 使用默认头像占位符，实际项目中替换为真实头像 */}
                    <svg
                      className="w-full h-full text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 行动召唤 */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">开始使用问题追踪系统</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            立即注册，体验高效的问题管理解决方案
          </p>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition inline-block"
          >
            免费注册
          </Link>
        </div>
      </section>
    </div>
  );
}
