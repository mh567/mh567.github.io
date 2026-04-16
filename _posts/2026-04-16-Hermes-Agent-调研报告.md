---
layout: post
title: Hermes Agent 调研报告
categories: [调研报告]
---

调研时间：2026年4月16日  |  来源：GitHub, NxCode, ODaily, Geeky Gadgets, Turing Post, Reddit 等

## 1. 基本信息
| 项目 | 详情 |
| --- | --- |
| **开发者** | Nous Research（Hermes/Nomos/Psyche 系列模型的团队） |
| **首发时间** | 2026年2月25日 |
| **最新版本** | v0.9.0 "the everywhere release"（2026年4月13日） |
| **GitHub Stars** | 89,200+（2026年4月中旬数据，增速极快） |
| **Fork 数** | 12,200+ |
| **开源协议** | MIT |
| **主要语言** | Python 93.1% |
| **定位** | 自进化（Self-Improving）开源 AI Agent 框架 |

## 2. 核心卖点：Self-Improving（自我进化）
这是 Hermes Agent 与 OpenClaw、Claude Code 等竞品最大的差异化——它不只是执行任务，还会从每次交互中学习并改进自身行为。

### 2.1 GAPA 系统
Generalized Action and Prompt Adaptation — 自动评估自身行为表现，发现盲点并修补。用官方的话说："an agent that found its own blind spots and patched them."

### 2.2 技能自动生成
从使用经验中自动生成可复用的 skill 文档（SKILL.md），跨 session 复用。遇到新问题解决后自动保存为技能，下次直接调用。技能兼容 agentskills.io 开放标准。

### 2.3 三层持久记忆

  - **用户画像（User Profile）**— 偏好、角色、沟通风格
  - **环境笔记（Memory）**— 工具 quirks、项目约定、环境配置
  - **会话检索（Session Search）**— 全历史 FTS5 全文搜索

每次对话自动注入相关记忆上下文，实现"越用越懂你"。

### 2.4 40+ 内置工具
终端执行、文件读写、浏览器自动化、代码沙箱、定时任务（Cron）、子代理委派（Delegate）、MCP 协议客户端、TTS、图像分析、Web 搜索/提取等。

## 3. 多平台支持
单一 gateway 进程支持 15+ 渠道：

  CLI
  Telegram
  Discord
  Slack
  WhatsApp
  Signal
  Matrix
  Mattermost
  Email
  SMS
  钉钉
  飞书
  企业微信
  iMessage
  Home Assistant

支持语音备忘录转写、跨平台会话连续性。

## 4. 模型无关架构

  支持 Nous Portal、OpenRouter（200+ 模型）、OpenAI、Anthropic、Google AI Studio、MiniMax、z.ai/GLM、Kimi/Moonshot、本地 Ollama 等。hermes model 一行切换，无供应商锁定。

## 5. 竞品对比
| 维度 | Hermes Agent | OpenClaw | Claude Code |
| --- | --- | --- | --- |
| 定位 | 自进化个人代理 | AI 开发代理 | IDE 编程助手 |
| 持久记忆 | 三层跨 session 记忆 | 有限 | 无跨 session |
| 技能自动生成 | ✅ GAPA 系统 | ❌ | ❌ |
| 多平台 | 15+ 渠道 | 有限 | IDE only |
| 安全记录 | 零 CVE | CVE-2026-25253 (CVSS 8.8) | N/A |
| 迁移工具 | 内置 hermes claw migrate | — | — |
| 价格 | 免费 + API 费用 | 免费 | 订阅制 |
| 部署门槛 | $5/月 VPS 或本地 | 较高 | 无需部署 |

## 6. 社区生态

  - **awesome-hermes-agent** — 1,300+ stars 的技能/工具/集成精选列表
  - **hermes-workspace** — Web GUI（聊天、终端、记忆浏览器、技能管理），Nous Hackathon 2026 作品
  - **skilldock.io** — 跨平台技能市场（兼容 OpenClaw、Claude Code）
  - **YouTube 教程** — 大量 "8 分钟 VPS 部署" 等实操视频
  - **Browser Use 集成** — 自动配置 API Key，自主浏览器操作
  - **ACP 适配器** — VS Code / Zed / JetBrains 通过 stdio/JSON-RPC 连接

## 7. 版本演进
| 版本 | 日期 | 关键特性 |
| --- | --- | --- |
| v0.2.0 | 3月12日 | 首次公开发布 |
| v0.6.0+ | 3月下旬 | 技能系统、CLI 工具集 |
| v0.7.0 | 4月3日 | 韧性发布：可插拔记忆、凭证轮换、Camofox 反检测浏览器、inline diffs |
| v0.8.0 | 4月8日 | Google AI Studio 原生支持 |
| v0.9.0 | 4月13日 | "everywhere release" — 全平台扩展 |

## 8. 部署成本

  - 框架本身：完全免费（MIT 协议）
  - 最低配置：$5/月 VPS 即可运行
  - 使用本地 Ollama 模型可零 API 费用
  - 典型月费：$10-80（含 API 调用）
  - Python 3.11，安装脚本自动配置环境

## 9. 媒体评价摘要

  
    - **NxCode**: "2026年最有趣的开源 AI agent 框架，因为它解决了没人解决的问题——让 agent 真正越用越聪明"
    - **ODaily**: "超越 OpenClaw，生产力提升 100 倍"
    - **Geeky Gadgets**: "这个开源 AI agent 真的能从自己的错误中学习"
    - **Turing Post**: "OpenClaw 的竞争对手？差异和最佳用例分析"
    - **BotLearn**: "自我进化的 agent，而非工具调用壳——这是与多数 agent 框架的本质区别"
  

## 10. 结论
Hermes Agent 是 **2026 年增长最快的开源 AI agent 项目**（2个月内 89K stars），核心差异化在于 "Self-Improving" 范式——通过 GAPA 系统、技能自动生成和三层持久记忆实现持续进化。

相比 OpenClaw（安全漏洞频发）和 Claude Code（仅限 IDE），Hermes 在安全性、多平台覆盖和模型无关性上有明显优势。对于需要长期运行、跨平台使用的个人/团队自动化场景，是当前最值得关注的开源选择。

  本报告由 Hermes Agent 自动生成  |  数据来源：GitHub, NxCode, ODaily, Geeky Gadgets, Turing Post, BotLearn, Reddit, DEV Community 等