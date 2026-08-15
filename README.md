# 人生 K 线（Life Destiny K-Line）

输入公历出生日期、出生时间和性别，网站会在浏览器本地自动排出四柱与大运，并生成 1–100 岁的人生 K 线和多维度文化解读。

## 特点

- 一次填写，直接查看结果
- 自动计算四柱、起运与大运
- 不调用 AI、不消耗 Token
- 不需要 API Key 或后端服务
- 出生信息只在当前浏览器中处理，不上传、不保存
- 支持导出 JSON、保存 PDF 和离线网页

## 工作原理

历法计算使用 [`lunar-typescript`](https://github.com/6tail/lunar-typescript)。走势图和文字报告由项目内固定、可重复的五行规则及模板生成，相同输入会得到相同结果。

本项目仅供传统文化娱乐与产品演示，不构成医疗、投资、婚姻或职业建议。

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 部署

仓库已包含 GitHub Pages 工作流。推送到 `main` 后会自动构建并部署，无需配置密钥或服务器。

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS
- Recharts
- lunar-typescript
