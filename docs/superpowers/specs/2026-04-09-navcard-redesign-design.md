# NavCard 布局重构设计

## 概述

将首页导航卡片从水平布局改为垂直两行布局，与用户偏好的信息层次一致。

## 变更范围

### 1. 移除 Hero 右侧内容能力面板

**文件**: `src/components/Hero.astro`
- 删除 `<div class="hero-panel">` 及内部内容
- 保留 Hero 左侧文字区域

### 2. NavCard 组件重构

**文件**: `src/components/NavCard.astro`

新布局结构：
```
┌─────────────────────────────┐
│ [图标]  标题                 │  ← 第一行：图标 + 标题
│                             │
│ 介绍文字介绍文字             │  ← 第二行：描述
└─────────────────────────────┘
```

**规范**：
- 图标容器：56×56px（3.5rem），圆角 12px
- 透明图标：默认白色渐变背景，避免不清晰
- 无图标：显示纯色渐变背景占位
- 标题：字号比描述大 2 号（约 1.15rem vs 0.95rem）
- 描述：颜色使用 muted，0.95rem

### 3. 样式更新

**文件**: `src/styles/global.css`

- `.nav-card-top` 改为垂直布局（flex-direction: column）
- `.nav-card-icon` 尺寸调整为 3.5rem
- `.nav-card-copy h3` 字号调整为 1.15rem
- `.nav-card-copy p` 字号调整为 0.95rem

## 状态

- [x] 设计完成
- [ ] 实现
