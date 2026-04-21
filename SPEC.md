# JOSP-ExaminationSystemVue3 - 项目规格说明书

## 1. 项目概述

### 项目名称
JOSP-ExaminationSystemVue3

### 项目类型
Vue3 前端管理系统（基于 vue3-element-admin 模板）

### 核心功能
考研成绩查询与综合管理系统前端，包含考研成绩查询、课表管理、视频管理、学生/教师信息管理、个人账单管理、数据可视化等多个功能模块。

### 目标用户
- 考研学生（成绩查询、课表查看）
- 教师（课程管理、学生信息管理）
- 管理员（系统管理、用户管理、数据管理）

## 2. 技术规格

### 技术栈
| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.32 | 渐进式JavaScript框架 |
| Vite | 8.0.9 | 下一代前端构建工具 |
| Element Plus | 2.13.7 | Vue3 UI组件库 |
| Pinia | 3.0.4 | Vue3状态管理 |
| Vue Router | 5.0.4 | Vue3官方路由 |
| Axios | 1.15.1 | HTTP客户端 |
| ECharts | 6.0.0 | 数据可视化库 |
| TypeScript | 6.0.3 | JavaScript超集 |
| wangEditor | 5.1.23 | 富文本编辑器 |
| vue-i18n | 11.3.0 | 国际化解决方案 |
| XLSX | 0.18.5 | Excel文件处理 |
| UnoCSS | 66.6.8 | 原子化CSS引擎 |

### 目录结构
```
JOSP-ExaminationSystemVue3/
├── public/              # 静态资源
├── src/
│   ├── api/            # API接口
│   ├── assets/         # 资源文件
│   ├── components/     # 公共组件
│   ├── composables/    # 组合式函数
│   ├── directive/      # 自定义指令
│   ├── enums/          # 枚举定义
│   ├── lang/           # 国际化语言包
│   ├── layouts/        # 布局组件
│   ├── plugins/        # 插件
│   ├── router/         # 路由配置
│   ├── store/          # Pinia状态
│   ├── styles/         # 样式文件
│   ├── typings/        # 类型定义
│   ├── utils/          # 工具函数
│   └── views/          # 页面组件
│       ├── dashboard/      # 仪表盘
│       ├── demo/           # 示例页面
│       ├── error-page/     # 错误页面
│       ├── examinationSystemTable/  # 考研成绩查询模块
│       ├── login/         # 登录页
│       ├── redirect/       # 重定向页
│       └── system/         # 系统管理模块
├── .env.development    # 开发环境变量
├── .env.production     # 生产环境变量
├── vite.config.ts      # Vite配置
├── package.json        # 项目依赖
└── SPEC.md            # 本规格文档
```

## 3. 功能模块

### 3.1 考研成绩查询系统（核心）
- **国家线查询** - 查询历年国家分数线（A/B区、学硕/专硕）
- **院校线查询** - 查询各院校复试分数线
- **学院线查询** - 按学院查询分数线
- **专业线查询** - 按专业查询分数线
- **复试名单查询** - 按专业查询复试名单
- **成绩管理** - 成绩数据的增删改查
- **Excel导出** - 支持导出Excel格式成绩单

### 3.2 个人管理模块
- **课表系统** - 多教室课表展示与管理
- **视频管理** - 视频内容多维度管理
- **账单管理** - 个人账单记录系统
- **学生信息管理** - 学生信息登记与维护
- **教师信息管理** - 教师信息管理

### 3.3 系统管理模块
- **用户管理** - 用户账号管理
- **角色管理** - 角色与权限配置
- **菜单管理** - 动态菜单配置
- **部门管理** - 组织架构管理
- **字典管理** - 数据字典维护

### 3.4 数据可视化
- **图表展示** - ECharts 集成，支持多种图表类型
- **Dashboard** - 数据仪表盘展示

## 4. 已知问题和限制

### TypeScript 类型错误
项目存在一些 TypeScript 类型错误，主要来自：
- vue-tsc 类型检查严格
- 部分组件使用 `any` 类型导致的隐式 any
- 部分第三方库的类型定义不完整

### ESLint 配置冲突
- eslint-plugin-import@2.32.0 要求 peer eslint@^8 || ^9，但项目使用 eslint@10.2.1
- 建议使用 `--legacy-peer-deps` 或 `pnpm` 安装依赖

### MOCK 服务
- vite-plugin-mock-dev-server 暂不支持 Vite 8，已在 vite.config.ts 中禁用

## 5. 环境配置

### 开发环境
```
VITE_APP_PORT=3100
VITE_APP_BASE_API=/dev-api
VITE_APP_API_URL=http://localhost:8080
VITE_MOCK_DEV_SERVER=false
```

### 生产环境
```
VITE_APP_PORT=3100
VITE_APP_BASE_API=/api
VITE_APP_API_URL=https://api.example.com
VITE_MOCK_DEV_SERVER=false
```

## 6. 构建和部署

### 构建命令
```bash
pnpm install     # 安装依赖（必须使用 pnpm）
pnpm run dev     # 启动开发服务器
pnpm run build   # 构建生产版本
pnpm run preview # 预览生产构建
```

### 依赖安装说明
本项目要求使用 pnpm 进行依赖管理，不支持 npm。安装前请确保已安装 pnpm：
```bash
npm i -g pnpm
```

## 7. 相关项目

### 后端项目
- **JOSP-ExaminationSystemJava** - 考研成绩查询系统后端API
  - 基于 Spring Boot + MyBatis-Plus 开发
  - 提供成绩查询、用户管理、权限控制等 RESTful API
  - 支持 MySQL 数据持久化

### 基础模板
- **vue3-element-admin** - 本项目基于该模板开发
  - 仓库地址: https://gitee.com/youlaiorg/vue3-element-admin.git
  - 感谢有来开源组织提供的优秀模板

## 8. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 2.11.5 | 2024-01-01 | 初始版本，基于 vue3-element-admin |