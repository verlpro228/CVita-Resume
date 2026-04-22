# CVita Resume Builder

CVita 是一个基于 Vue 3 + Vite 的纯前端在线简历生成平台，面向任意用户制作、预览、保存和导出简历。项目不依赖后端，使用本地存储完成草稿保存，支持模板切换、模块编辑、PDF 导出、JSON 导入导出和 AI 辅助 mock。

## 页面结构

- `/`：产品首页
- `/templates`：模板中心
- `/editor`：简历编辑器
- `/preview`：独立预览页

旧入口 `/home`、`/create`、`/dashboard` 已做兼容跳转。

## 核心能力

- 多模板切换：同一份简历数据可实时切换不同模板表现。
- 动态模块编辑：支持基本信息、教育背景、工作经历、项目经历、技能、证书、获奖、校园经历和自定义模块。
- 实时 A4 预览：编辑内容即时同步到右侧预览区。
- 本地自动保存：草稿保存到 `localStorage`，刷新后可继续编辑。
- 导入导出：支持 PDF 导出、JSON 导出和 JSON 导入恢复。
- AI 辅助 mock：提供自我评价、项目经历、工作经历等模拟优化建议。
- 响应式布局：兼顾 PC、平板和移动端浏览体验。

## 技术栈

- Vue 3
- Vue Router
- Vite
- Element Plus
- Sass
- GSAP
- html2canvas
- jsPDF

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

项目要求 Node.js `>=20.19.0`。你本机的 Node `24.12.0` 可以正常使用。

## Vercel 部署

如果仓库根目录就是当前 `CVita` 项目：

- Framework Preset：`Vite`
- Install Command：`npm ci`
- Build Command：`npm run build`
- Output Directory：`dist`

如果你的 Git 仓库根目录是外层文件夹 `CVita-在线简历`，请在 Vercel 项目设置里把 Root Directory 设置为：

```text
CVita
```

本项目已内置 `vercel.json`：

- 处理 Vue Router history 模式刷新 404。
- 指定 `dist` 为构建输出目录。
- 为静态资源添加长期缓存。

## 纯前端数据说明

当前版本不需要数据库和服务端接口：

- 简历草稿保存在浏览器 `localStorage`。
- JSON 文件可用于备份和迁移。
- PDF 导出在浏览器端完成。
- AI 功能目前为前端 mock，后续可接入真实接口。
