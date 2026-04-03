# Willbon Atlas 内容维护说明

## 站点品牌

站点名称、描述、仓库地址、基础路径等信息统一维护在 `src/config/site.ts`。  
后续如果要把 `Willbon Atlas` 改名，只修改这一处配置。

## 博客文章

文章放在 `src/content/blog/`，推荐 frontmatter：

```md
---
title: "文章标题"
description: "文章摘要"
date: 2026-04-03
tags:
  - tag-a
  - tag-b
draft: false
cover: /assets/blog/example.svg
---
```

`cover` 支持：
- 远程图片 URL
- 本地路径，例如 `/assets/blog/example.svg`
- 也支持不带前导斜杠的相对写法，例如 `assets/blog/example.svg`

## Markdown 能力

默认支持：
- LaTeX 数学公式
- Mermaid 流程图、时序图、甘特图、思维导图
- 表格
- 代码块
- GitHub 风格任务列表
- 脚注
- Callout 提示块

Callout 建议写法：

```md
> [!NOTE]
> 这是一个 note

> [!TIP]
> 这是一个 tip
```

Mermaid 建议写法：

````md
```mermaid
flowchart TD
  A --> B
```
````

## 导航维护

导航数据在 `src/data/navigation.yml`。  
每个链接项支持远程 icon 或本地 icon。

本地 icon 推荐放到 `public/assets/nav/`。
