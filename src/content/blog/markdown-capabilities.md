---
title: "Markdown 能力演示：公式、Mermaid、Callout 与脚注"
description: "这篇文章集中验证 LaTeX、Mermaid、表格、Callout、脚注和代码高亮等功能。"
date: 2026-04-02
tags:
  - markdown
  - mermaid
  - math
draft: false
cover: https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80
---

> [!TIP]
> 文章默认支持 `Mermaid` 代码块，你可以直接写流程图、时序图、甘特图和思维导图。

## 表格

| 能力 | 语法 | 备注 |
| --- | --- | --- |
| 数学公式 | LaTeX | 用 KaTeX 渲染 |
| 图表 | Mermaid | 用于流程图、时序图、甘特图 |
| 思维导图 | Mermaid mindmap | 与图表能力共用生态 |

## 代码块

```ts
type NavItem = {
  title: string;
  url: string;
  icon?: string;
};
```

## 流程图

```mermaid
flowchart TD
    A[Write Markdown] --> B[Astro Build]
    B --> C[GitHub Pages]
    C --> D[Readers]
```

## 时序图

```mermaid
sequenceDiagram
    participant U as User
    participant S as Site
    U->>S: Open article
    S-->>U: Render markdown + diagrams
```

## 甘特图

```mermaid
gantt
    title Atlas Delivery
    dateFormat  YYYY-MM-DD
    section Project
    Scaffold      :done, a1, 2026-04-01, 1d
    Theming       :done, a2, 2026-04-02, 1d
    Content Setup :active, a3, 2026-04-03, 2d
```

## 思维导图

```mermaid
mindmap
  root((Willbon Atlas))
    Blog
      Notes
      Projects
      Essays
    Navigation
      Engineering
      Design
      Tools
```

## 脚注

脚注能力也要可用。[^1]

[^1]: 这对于技术写作和补充说明很方便。