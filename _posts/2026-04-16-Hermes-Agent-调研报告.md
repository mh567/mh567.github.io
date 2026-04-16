---
layout: post
title: Hermes Agent 调研报告
categories: [调研报告]
---

<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: -apple-system, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif; max-width: 800px; margin: 40px auto; padding: 0 30px; color: #1a1a2e; line-height: 1.8; font-size: 15px; }
  h1 { color: #1a1a2e; font-size: 28px; border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 8px; }
  .subtitle { color: #6b7280; font-size: 14px; margin-bottom: 30px; }
  h2 { color: #2563eb; font-size: 20px; margin-top: 32px; border-left: 4px solid #2563eb; padding-left: 12px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
  th { background: #2563eb; color: white; padding: 10px 14px; text-align: left; }
  td { padding: 10px 14px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) { background: #f8fafc; }
  .highlight { background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 16px 0; border-radius: 0 6px 6px 0; }
  ul { padding-left: 20px; }
  li { margin-bottom: 6px; }
  .tag { display: inline-block; background: #dbeafe; color: #1d4ed8; padding: 2px 10px; border-radius: 12px; font-size: 13px; margin-right: 6px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 13px; text-align: center; }
</style>
</head>
<body>

<div class="subtitle">调研时间：2026年4月16日 &nbsp;|&nbsp; 来源：GitHub, NxCode, ODaily, Geeky Gadgets, Turing Post, Reddit 等</div>

<h2>1. 基本信息</h2>
<table>
  <tr><th style="width:140px">项目</th><th>详情</th></tr>
  <tr><td><strong>开发者</strong></td><td>Nous Research（Hermes/Nomos/Psyche 系列模型的团队）</td></tr>
  <tr><td><strong>首发时间</strong></td><td>2026年2月25日</td></tr>
  <tr><td><strong>最新版本</strong></td><td>v0.9.0 "the everywhere release"（2026年4月13日）</td></tr>
  <tr><td><strong>GitHub Stars</strong></td><td>89,200+（2026年4月中旬数据，增速极快）</td></tr>
  <tr><td><strong>Fork 数</strong></td><td>12,200+</td></tr>
  <tr><td><strong>开源协议</strong></td><td>MIT</td></tr>
  <tr><td><strong>主要语言</strong></td><td>Python 93.1%</td></tr>
  <tr><td><strong>定位</strong></td><td>自进化（Self-Improving）开源 AI Agent 框架</td></tr>
</table>

<h2>2. 核心卖点：Self-Improving（自我进化）</h2>
<p>这是 Hermes Agent 与 OpenClaw、Claude Code 等竞品最大的差异化——它不只是执行任务，还会从每次交互中学习并改进自身行为。</p>

<h3>2.1 GAPA 系统</h3>
<p>Generalized Action and Prompt Adaptation — 自动评估自身行为表现，发现盲点并修补。用官方的话说："an agent that found its own blind spots and patched them."</p>

<h3>2.2 技能自动生成</h3>
<p>从使用经验中自动生成可复用的 skill 文档（SKILL.md），跨 session 复用。遇到新问题解决后自动保存为技能，下次直接调用。技能兼容 agentskills.io 开放标准。</p>

<h3>2.3 三层持久记忆</h3>
<ul>
  <li><strong>用户画像（User Profile）</strong>— 偏好、角色、沟通风格</li>
  <li><strong>环境笔记（Memory）</strong>— 工具 quirks、项目约定、环境配置</li>
  <li><strong>会话检索（Session Search）</strong>— 全历史 FTS5 全文搜索</li>
</ul>
<p>每次对话自动注入相关记忆上下文，实现"越用越懂你"。</p>

<h3>2.4 40+ 内置工具</h3>
<p>终端执行、文件读写、浏览器自动化、代码沙箱、定时任务（Cron）、子代理委派（Delegate）、MCP 协议客户端、TTS、图像分析、Web 搜索/提取等。</p>

<h2>3. 多平台支持</h2>
<p>单一 gateway 进程支持 15+ 渠道：</p>
<p>
  <span class="tag">CLI</span>
  <span class="tag">Telegram</span>
  <span class="tag">Discord</span>
  <span class="tag">Slack</span>
  <span class="tag">WhatsApp</span>
  <span class="tag">Signal</span>
  <span class="tag">Matrix</span>
  <span class="tag">Mattermost</span>
  <span class="tag">Email</span>
  <span class="tag">SMS</span>
  <span class="tag">钉钉</span>
  <span class="tag">飞书</span>
  <span class="tag">企业微信</span>
  <span class="tag">iMessage</span>
  <span class="tag">Home Assistant</span>
</p>
<p>支持语音备忘录转写、跨平台会话连续性。</p>

<h2>4. 模型无关架构</h2>
<div class="highlight">
  支持 Nous Portal、OpenRouter（200+ 模型）、OpenAI、Anthropic、Google AI Studio、MiniMax、z.ai/GLM、Kimi/Moonshot、本地 Ollama 等。<code>hermes model</code> 一行切换，无供应商锁定。
</div>

<h2>5. 竞品对比</h2>
<table>
  <tr><th>维度</th><th>Hermes Agent</th><th>OpenClaw</th><th>Claude Code</th></tr>
  <tr><td>定位</td><td>自进化个人代理</td><td>AI 开发代理</td><td>IDE 编程助手</td></tr>
  <tr><td>持久记忆</td><td>三层跨 session 记忆</td><td>有限</td><td>无跨 session</td></tr>
  <tr><td>技能自动生成</td><td>✅ GAPA 系统</td><td>❌</td><td>❌</td></tr>
  <tr><td>多平台</td><td>15+ 渠道</td><td>有限</td><td>IDE only</td></tr>
  <tr><td>安全记录</td><td>零 CVE</td><td>CVE-2026-25253 (CVSS 8.8)</td><td>N/A</td></tr>
  <tr><td>迁移工具</td><td>内置 <code>hermes claw migrate</code></td><td>—</td><td>—</td></tr>
  <tr><td>价格</td><td>免费 + API 费用</td><td>免费</td><td>订阅制</td></tr>
  <tr><td>部署门槛</td><td>$5/月 VPS 或本地</td><td>较高</td><td>无需部署</td></tr>
</table>

<h2>6. 社区生态</h2>
<ul>
  <li><strong>awesome-hermes-agent</strong> — 1,300+ stars 的技能/工具/集成精选列表</li>
  <li><strong>hermes-workspace</strong> — Web GUI（聊天、终端、记忆浏览器、技能管理），Nous Hackathon 2026 作品</li>
  <li><strong>skilldock.io</strong> — 跨平台技能市场（兼容 OpenClaw、Claude Code）</li>
  <li><strong>YouTube 教程</strong> — 大量 "8 分钟 VPS 部署" 等实操视频</li>
  <li><strong>Browser Use 集成</strong> — 自动配置 API Key，自主浏览器操作</li>
  <li><strong>ACP 适配器</strong> — VS Code / Zed / JetBrains 通过 stdio/JSON-RPC 连接</li>
</ul>

<h2>7. 版本演进</h2>
<table>
  <tr><th>版本</th><th>日期</th><th>关键特性</th></tr>
  <tr><td>v0.2.0</td><td>3月12日</td><td>首次公开发布</td></tr>
  <tr><td>v0.6.0+</td><td>3月下旬</td><td>技能系统、CLI 工具集</td></tr>
  <tr><td>v0.7.0</td><td>4月3日</td><td>韧性发布：可插拔记忆、凭证轮换、Camofox 反检测浏览器、inline diffs</td></tr>
  <tr><td>v0.8.0</td><td>4月8日</td><td>Google AI Studio 原生支持</td></tr>
  <tr><td>v0.9.0</td><td>4月13日</td><td>"everywhere release" — 全平台扩展</td></tr>
</table>

<h2>8. 部署成本</h2>
<ul>
  <li>框架本身：完全免费（MIT 协议）</li>
  <li>最低配置：$5/月 VPS 即可运行</li>
  <li>使用本地 Ollama 模型可零 API 费用</li>
  <li>典型月费：$10-80（含 API 调用）</li>
  <li>Python 3.11，安装脚本自动配置环境</li>
</ul>

<h2>9. 媒体评价摘要</h2>
<div class="highlight">
  <ul>
    <li><strong>NxCode</strong>: "2026年最有趣的开源 AI agent 框架，因为它解决了没人解决的问题——让 agent 真正越用越聪明"</li>
    <li><strong>ODaily</strong>: "超越 OpenClaw，生产力提升 100 倍"</li>
    <li><strong>Geeky Gadgets</strong>: "这个开源 AI agent 真的能从自己的错误中学习"</li>
    <li><strong>Turing Post</strong>: "OpenClaw 的竞争对手？差异和最佳用例分析"</li>
    <li><strong>BotLearn</strong>: "自我进化的 agent，而非工具调用壳——这是与多数 agent 框架的本质区别"</li>
  </ul>
</div>

<h2>10. 结论</h2>
<p>Hermes Agent 是 <strong>2026 年增长最快的开源 AI agent 项目</strong>（2个月内 89K stars），核心差异化在于 "Self-Improving" 范式——通过 GAPA 系统、技能自动生成和三层持久记忆实现持续进化。</p>
<p>相比 OpenClaw（安全漏洞频发）和 Claude Code（仅限 IDE），Hermes 在安全性、多平台覆盖和模型无关性上有明显优势。对于需要长期运行、跨平台使用的个人/团队自动化场景，是当前最值得关注的开源选择。</p>

<div class="footer">
  本报告由 Hermes Agent 自动生成 &nbsp;|&nbsp; 数据来源：GitHub, NxCode, ODaily, Geeky Gadgets, Turing Post, BotLearn, Reddit, DEV Community 等
</div>

</body>
</html>