# JOSP-ExaminationSystemVue3

在线考试/考研成绩查询与管理系统前端。

## 项目简介

JOSP-ExaminationSystemVue3 是一个基于 **Nuxt 4 + Vue 3 + TypeScript** 的在线考试信息管理系统前端。项目当前实现了登录、院校列表查询、学生分页查询等考试相关业务接口，为后端管理系统提供前端交互界面。

主要定位：

- 在线考试成绩查询与管理
- 院校、学生等基础数据维护
- 与后端 API（默认 `http://localhost:8081/api`）配合使用的管理后台前端

## 系统架构图

```mermaid
graph LR
    A[浏览器/用户 Browser] -->|访问| B[Nuxt 4 前端应用]
    subgraph 前端层
        B --> C[Vue 3 页面与组件]
        B --> D[Nuxt Layouts / 路由]
        C --> E[@nuxt-ui 组件与 UnoCSS 样式]
        C --> F[Axios 请求封装 app/utils/request.js]
        F --> G[app/api/exam.js 等业务接口]
    end
    G -->|HTTP| H[后端 API / Nitro Server]
    H --> I[(MySQL / 外部数据服务)]
    B --> J[Nitro Server / 代理层]
```

## 技术栈

| 技术 | 说明 |
|------|------|
| [Nuxt](https://nuxt.com/) 4.x | 全栈 Vue 应用框架 |
| [Vue](https://vuejs.org/) 3.5.x | 渐进式前端框架 |
| [Vue Router](https://router.vuejs.org/) 4.x | 官方路由管理 |
| [TypeScript](https://www.typescriptlang.org/) 5.x | 类型安全的开发体验 |
| [@nuxt/ui](https://ui.nuxt.com/) 4.x | Nuxt 官方 UI 组件库 |
| [UnoCSS](https://unocss.dev/) | 原子化 CSS 引擎 |
| [Axios](https://axios-http.com/) | HTTP 客户端 |
| pnpm | 包管理工具 |
| ESLint / Prettier | 代码规范 |

## 项目结构

```
/Users/junw/Documents/GitHub/ExaminationSystem/JOSP-ExaminationSystemVue3/
├── app/                         # Nuxt 4 应用目录
│   ├── api/                     # 业务 API 封装
│   │   └── exam.js              # 考试相关接口（登录、院校列表、学生分页等）
│   ├── assets/                  # 静态资源
│   │   └── css/main.css         # 全局 CSS 变量与样式
│   ├── layouts/                 # Nuxt 布局
│   │   └── default.vue
│   ├── pages/                   # Nuxt 页面路由
│   │   └── index.vue
│   └── utils/                   # 工具函数
│       └── request.js           # Axios 请求实例，baseURL 指向 /api
├── app.vue                      # Nuxt 根组件
├── public/                      # 公共静态资源
│   └── favicon.ico
├── .env.development             # 开发环境变量
├── .env.production              # 生产环境变量
├── nuxt.config.ts               # Nuxt 配置文件
├── uno.config.ts                # UnoCSS 配置
├── eslint.config.js             # ESLint 配置
├── package.json                 # 项目依赖与脚本
├── pnpm-lock.yaml               # pnpm 锁定文件
└── tsconfig.json                # TypeScript 配置
```

> 注：本项目仅保留 ExaminationSystem 相关源码，不再包含无关的 MiniMax API 示例目录。

## 启动方式

### 环境要求

- Node.js >= 18
- pnpm >= 8（推荐）

### 安装依赖

```bash
cd /Users/junw/Documents/GitHub/ExaminationSystem/JOSP-ExaminationSystemVue3
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

开发服务器默认运行在 <http://localhost:3000>。前端 API 请求默认代理到后端 `http://localhost:8081/api`，可通过环境变量 `NUXT_PUBLIC_BASE_URL` 或修改 `app/utils/request.js` 进行调整。

### 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm generate` | 生成静态站点 |
| `pnpm preview` | 预览生产构建 |
| `pnpm postinstall` | 准备 Nuxt 类型声明 |

## 开源协议

本项目采用 [GNU Affero General Public License v3.0 (AGPL-3.0)](./LICENSE) 开源许可。

Copyright (C) 2026 junw
