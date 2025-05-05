# 问题追踪系统 (Issue Tracker System)

一个使用 Next.js (App Router), Tailwind CSS, Prisma 和 PostgreSQL 构建的全栈问题追踪应用程序。

## 主要功能

- **用户认证**: 用户注册、登录、密码修改、用户中心。
- **问题管理**:
  - 普通用户提交、查看自己的问题。
  - 管理员查看、回复、关闭所有问题。
- **问题回复**: 用户和管理员可以在问题详情页进行回复。
- **管理员后台**:
  - 仪表盘显示关键统计数据（未解决问题数、今日解决数）。
  - 管理所有问题列表。
  - 系统设置页面，可配置自动删除时间和每日问题提交限制。
- **自动化处理**:
  - 管理员手动删除问题。
  - 已关闭问题和长时间未处理问题自动删除（通过 Vercel Cron Job 定时执行）。
  - 问题详情页显示预计自动删除时间。
- **权限控制**: 区分普通用户和管理员，限制不同角色的操作。
- **安全性**: 使用 JWT 进行会话管理，密码使用 bcrypt 加密存储。

## 技术栈

- **框架**: [Next.js](https://nextjs.org/) (App Router)
- **语言**: JavaScript
- **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **数据库 ORM**: [Prisma](https://www.prisma.io/)
- **数据库**: [PostgreSQL](https://www.postgresql.org/)
- **认证**: JWT, bcrypt
- **定时任务**: Vercel Cron, Node.js script
- **日期处理**: [date-fns](https://date-fns.org/)

## 本地开发设置

### 环境要求

- [Node.js](https://nodejs.org/) (建议使用 LTS 版本)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/download/) 数据库实例

### 步骤

1.  **克隆仓库**:

    ```bash
    git clone <your-repository-url>
    cd issue-tracker
    ```

2.  **安装依赖**:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **设置环境变量**:

    - 复制 `.env.example` (如果存在) 或创建一个新的 `.env` 文件。
    - 在 `.env` 文件中配置数据库连接字符串:
      ```dotenv
      DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
      ```
      请将 `USER`, `PASSWORD`, `HOST`, `PORT`, `DATABASE` 替换为您的 PostgreSQL 配置。
    - **(可选)** 配置其他环境变量 (如果需要覆盖默认值):

      ```dotenv
      # 用于自动创建管理员账户 (如果未设置，邮箱默认为 admin@issue-tracker.app, 密码默认为 Admin123)
      ADMIN_EMAIL=your_admin_email@example.com
      ADMIN_PASSWORD=your_strong_admin_password

      # 用于 Vercel Cron Job 身份验证 (部署到 Vercel 时必需)
      CRON_SECRET=your_strong_random_secret_string

      # 自动删除设置 (后台脚本使用)
      CLOSED_ISSUE_DELETE_DAYS=7
      PENDING_ISSUE_DELETE_DAYS=30

      # 自动删除设置 (前端显示使用)
      NEXT_PUBLIC_CLOSED_ISSUE_DELETE_DAYS=7
      NEXT_PUBLIC_PENDING_ISSUE_DELETE_DAYS=30

      # JWT 密钥 (建议设置一个强密钥)
      # JWT_SECRET=your_strong_jwt_secret
      ```

4.  **数据库迁移**:
    运行 Prisma migrate 来创建数据库表结构。

    ```bash
    npx prisma migrate dev
    ```

    (首次运行时，Prisma 会提示您输入迁移名称，例如 `init`)

5.  **生成 Prisma Client**:
    确保 Prisma Client 是最新的。

    ```bash
    npx prisma generate
    ```

    (通常在 `migrate dev` 后会自动运行，但手动运行可以确保成功)

6.  **运行开发服务器**:

    ```bash
    npm run dev
    ```

7.  **访问应用**:
    在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 管理员账户

- 项目包含一个脚本 (`tools/seedAdmin.js`)，它会在 `npm run build` (或 Vercel 部署) 时自动运行。
- 此脚本会检查是否存在管理员账户，如果不存在，则会尝试创建一个。
- **默认凭据** (如果未在 `.env` 或 Vercel 环境变量中设置 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD`):
  - **邮箱**: `admin@issue-tracker.app`
  - **密码**: `Admin123`
- **强烈建议**: 使用默认凭据首次登录后，立即在用户中心修改密码。
- 您也可以在 `.env` 或 Vercel 中设置 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD` 环境变量来自定义初始管理员账户。

## 部署到 Vercel

1.  将您的代码推送到 GitHub/GitLab/Bitbucket 仓库。
2.  在 [Vercel](https://vercel.com/) 上创建一个新项目，并连接到您的仓库。
3.  在 Vercel 项目设置中配置以下**环境变量**:
    - `DATABASE_URL`: 指向您的生产 PostgreSQL 数据库。
    - `CRON_SECRET`: 设置一个强随机字符串，用于保护 Cron Job API。
    - `(可选) ADMIN_EMAIL`: 生产环境管理员邮箱。
    - `(可选) ADMIN_PASSWORD`: 生产环境管理员密码 (强烈推荐设置)。
    - `(可选) CLOSED_ISSUE_DELETE_DAYS`: 生产环境设置。
    - `(可选) PENDING_ISSUE_DELETE_DAYS`: 生产环境设置。
    - `(可选) NEXT_PUBLIC_CLOSED_ISSUE_DELETE_DAYS`: 生产环境设置。
    - `(可选) NEXT_PUBLIC_PENDING_ISSUE_DELETE_DAYS`: 生产环境设置。
    - `(可选) JWT_SECRET`: 生产环境 JWT 密钥 (强烈推荐设置)。
4.  Vercel 将自动运行 `package.json` 中的 `build` 命令 (`prisma generate && prisma migrate deploy && node tools/seedAdmin.js && next build`)。
5.  Vercel Cron Job 将根据 `vercel.json` 中的配置 (`0 5 * * *`) 每天自动调用 `/api/cron/cleanup-issues` 来清理旧问题。
