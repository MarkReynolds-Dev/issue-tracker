# 问题追踪系统开发计划

## 一、界面设计

### 主页设计 ✅

- **产品介绍**：展示问题追踪系统的主要功能和价值
- **使用指南**：简要说明系统使用流程和主要功能点
- **统计展示**：直观展示系统处理问题的效率和成功案例(自己虚构出来就行)
- **特色功能**：突出展示系统的独特功能和优势
- **用户见证**：展示用户使用系统的成功案例和评价(自己虚构出来就行)
- **快速入口**：提供"提交问题"和"查看问题"的快捷入口
- **视觉美化**：使用现代化 UI 设计，包含适当的动画和交互效果

### 导航栏设计 ✅

- **首页**：返回系统主页
- **我的问题**：登录用户查看自己提交的问题（需登录）
- **提交问题**：用户提交新问题的入口（需登录，管理员不可见）
- **登录/注册**：未登录用户显示
- **用户中心**：包含个人信息、修改密码等功能（需登录）
- **管理后台**：仅管理员可见，进入管理系统

## 二、模块开发计划

### 1. 用户认证模块 ✅

- 用户注册功能
- 用户登录功能
- 用户信息管理
- 权限控制（区分普通用户和管理员）

### 2. 问题管理模块 ✅

- 问题提交功能
- 提交的问题列表展示（分页、筛选、排序）
- 问题详情页面
- 问题状态管理
- 问题搜索功能

### 3. 问题回复模块 ✅

- 管理员回复功能
- 用户确认解决功能
- 回复历史记录

### 4. 管理员后台模块 (部分完成)

- 问题管理（查看、回复、关闭问题）✅
- 系统设置（自动删除时间配置）
- 数据统计与报表(显示还有多少问题未解决，今日解决了多少问题，今日的定义是今日0点到24点)

### 5. 自动化处理模块
- 对于管理员，每个问题要有删除该问题的按钮
- 已关闭问题自动删除（默认 7 天 问题关闭后要显示该问题的自动删除时间）
- 长时间未回复问题自动删除（默认 30 天 问题提交后要显示该问题的自动删除时间）
- 定时任务管理

## 三、项目目录结构

```
issue-tracker/
│
├── app/                         # Next.js应用主目录
│   ├── api/                     # API路由
│   │   ├── auth/                # 认证相关API
│   │   ├── issues/              # 问题相关API
│   │   └── admin/               # 管理员相关API
│   │
│   ├── (auth)/                  # 认证相关页面
│   │   ├── login/               # 登录页面
│   │   └── register/            # 注册页面
│   │
│   ├── (dashboard)/             # 用户控制台页面
│   │   ├── my-issues/           # 我的问题页面
│   │   └── profile/             # 个人资料页面
│   │
│   ├── admin/                   # 管理员后台页面
│   │   ├── issues/              # 问题管理页面
│   │   ├── users/               # 用户管理页面
│   │   └── settings/            # 系统设置页面
│   │
│   ├── issues/                  # 问题相关页面
│   │   ├── [id]/                # 问题详情页面
│   │   └── new/                 # 新建问题页面
│   │
│   ├── components/              # 共用组件
│   │   ├── ui/                  # UI组件
│   │   ├── layout/              # 布局组件
│   │   ├── issues/              # 问题相关组件
│   │   └── forms/               # 表单组件
│   │
│   ├── lib/                     # 工具库
│   │   ├── utils.ts             # 工具函数
│   │   ├── db.ts                # 数据库连接
│   │   └── auth.ts              # 认证相关函数
│   │
│   ├── providers/               # 上下文提供者
│   │   └── AuthProvider.tsx     # 认证上下文
│   │
│   ├── styles/                  # 样式文件
│   │   └── globals.css          # 全局样式
│   │
│   ├── page.tsx                 # 首页
│   └── layout.tsx               # 根布局
│
├── prisma/                      # Prisma ORM
│   ├── schema.prisma            # 数据库模型定义
│   └── migrations/              # 数据库迁移文件
│
├── public/                      # 静态资源
│   ├── images/                  # 图片资源
│   └── favicon.ico              # 网站图标
│
├── tools/                       # 工具脚本
│   ├── seed.ts                  # 数据库种子数据
│   └── cleanup.ts               # 自动清理脚本
│
├── middleware.ts                # Next.js中间件
├── next.config.js               # Next.js配置
├── package.json                 # 项目依赖
├── tsconfig.json                # TypeScript配置
└── .env                         # 环境变量
```

## 四、数据库设计

### 用户表 (User)

```
id: String @id @default(uuid())
email: String @unique
password: String (已加密)
name: String
role: Enum (USER, ADMIN)
createdAt: DateTime @default(now())
updatedAt: DateTime @updatedAt
issues: Issue[] (关联用户提交的问题)
```

### 问题表 (Issue)

```
id: String @id @default(uuid())
title: String
description: String
status: Enum (PENDING, IN_PROGRESS, CLOSED) @default(PENDING)
createdAt: DateTime @default(now())
updatedAt: DateTime @updatedAt
closedAt: DateTime? (问题关闭时间)
userId: String (提交用户ID)
user: User (关联用户)
replies: Reply[] (问题回复)
```

### 回复表 (Reply)

```
id: String @id @default(uuid())
content: String
createdAt: DateTime @default(now())
updatedAt: DateTime @updatedAt
issueId: String (关联问题ID)
issue: Issue (关联问题)
userId: String (回复用户ID)
user: User (关联用户)
isAdminReply: Boolean @default(false) (是否为管理员回复)
```

### 系统设置表 (Setting)

```
id: String @id @default(uuid())
closedIssueDeleteDays: Int @default(7) (已关闭问题自动删除天数)
pendingIssueDeleteDays: Int @default(30) (长时间未回复问题自动删除天数)
updatedAt: DateTime @updatedAt
```

## 五、技术栈与依赖库

### 前端

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Hook Form
- Zod (表单验证)
- React Query (数据获取与缓存)

### 后端

- Next.js API Routes
- Prisma ORM
- NextAuth.js (认证)
- bcrypt (密码加密)
- node-cron (定时任务)

### 开发工具

- ESLint
- Prettier
- Jest (测试)

### 安装命令

```
npm install next react react-dom typescript @prisma/client bcrypt node-cron @tanstack/react-query react-hook-form zod @hookform/resolvers date-fns next-auth tailwindcss postcss autoprefixer @radix-ui/react-icons axios jsonwebtoken cookie
```

```
npm install -D prisma @types/react @types/node @types/bcrypt @types/node-cron eslint eslint-config-next jest @jest/globals ts-jest @testing-library/react @testing-library/jest-dom prettier
```
