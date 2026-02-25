# 个人博客 - no-style-please 主题

[![Gem Version](https://badge.fury.io/rb/no-style-please.svg)](https://badge.fury.io/rb/no-style-please)

<img src="https://raw.githubusercontent.com/riggraz/no-style-please/master/logo.png" width="64" align="left" />极简无CSS风格的快速 [Jekyll](https://jekyllrb.com/) 博客主题。
基于 [no-style-please](https://github.com/riggraz/no-style-please) 主题改进，专为个人笔记博客设计。

<h3 align="center"><a href="https://blog.emolu.cn">查看博客</a></h3>

<img src="https://raw.githubusercontent.com/riggraz/no-style-please/master/_screenshots/featured-image.png" />

## ✨ 特性

* 🚀 **极速加载** - 只有 1KB CSS！
* 🎨 **三种模式** - 亮色、暗色和自动模式
* 📱 **完全响应式** - 支持所有设备
* 📝 **内容优先** - 排版优化，专注可读性
* 🔍 **SEO优化** - 集成 [Jekyll SEO Tag](https://github.com/jekyll/jekyll-seo-tag)
* 📡 **RSS订阅** - 集成 [Jekyll Feed](https://github.com/jekyll/jekyll-feed)
* 🏷️ **分类系统** - 支持多分类，动态菜单，收缩展开
* ✅ **GitHub Pages** - 完全兼容，自动构建

## 🚀 快速开始

### 基础要求

- Jekyll 3.0 或更高版本
- Ruby 2.5 或更高版本

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/mh567/mh567.github.io.git
cd mh567.github.io

# 安装依赖
bundle install

# 启动本地服务
bundle exec jekyll serve

# 访问 http://localhost:4000
```

### GitHub Pages 部署

仓库已配置自动部署到 GitHub Pages。只需推送代码：

```bash
git add .
git commit -m "your message"
git push origin master
```

GitHub 会自动构建并部署到 `https://yourusername.github.io`

## 📖 使用指南

### 配置博客

编辑 `_config.yml` 可以自定义博客。常用配置项：

```yaml
title: 博客标题          # 网站名称
author: 作者名称         # 作者名字
url: https://blog.example.com  # 博客地址
baseurl: ""             # 子路径（通常为空）
description: 博客描述    # 网站描述
permalink: /:slug.html  # 文章链接格式

theme_config:
  appearance: "auto"     # 主题模式：light/dark/auto
  date_format: "%Y-%m-%d"  # 日期格式
  show_description: false # 主页显示描述
  lowercase_titles: true  # 标题转小写
```

### 🏷️ 分类系统（重要功能！）

本博客增强了分类功能，支持多分类和动态菜单。

#### 为文章添加分类

```markdown
---
layout: post
title: 文章标题
categories: [分类1, 分类2, 分类3]
---

文章内容...
```

**向后兼容：** 旧格式 `category: IAM` 也支持。

#### 菜单配置

编辑 `_data/menu.yml` 配置分类菜单：

```yaml
entries:
  - title: 最新文档
    post_list:
      limit: 7
      show_more: true
      show_more_text: 查看更多...
      show_more_url: archive.html

  - title: 文档分类
    category_list:
      limit: 5  # 初始显示5个分类，超过则显示展开按钮
```

#### 分类功能说明

- ✅ **自动分类列表** - 从文章自动生成，无需手动维护
- ✅ **动态展开收缩** - 点击"显示更多分类"展开隐藏分类
- ✅ **分类计数** - 显示每个分类有多少篇文章
- ✅ **快速导航** - 点击分类标签跳转到该分类页面
- ✅ **完整分类页** - `/categories.html` 展示所有分类和文章

### 📑 菜单自定义

编辑 `_data/menu.yml` 定义菜单结构：

```yaml
entries:
  - title: 菜单项名称
    url: /page/                    # 链接地址（可选）
    post_list:                     # 显示文章列表（可选）
      limit: 10                    # 最多显示10篇
      category: 分类名             # 仅显示某分类（可选）
    category_list:                 # 显示分类列表（可选）
      limit: 5                     # 最多显示5个分类
    entries:                       # 子菜单（可选）
      - title: 子菜单项
        url: /sub-page/
```

**字段说明：**
- `title` - 显示文本（支持HTML）
- `url` - 链接地址，若不指定则纯文本显示
- `post_list` - 显示文章列表
  - `category` - 按分类过滤（可选）
  - `limit` - 限制数量（可选）
  - `show_more` - 显示查看更多链接
  - `show_more_url` - 查看更多的链接地址
  - `show_more_text` - 查看更多的文本
- `category_list` - 显示分类列表
  - `limit` - 最多显示分类数量
- `entries` - 子菜单列表

### 📚 创建文档页面

创建一个页面（如分类页）：

```markdown
---
layout: page
title: 页面标题
permalink: /page-url/
---

页面内容...
```

博客已内置 `categories.html` 显示所有分类。

### 📱 主页定制

`index.md` 使用 `home` 布局显示菜单。可以在文件中添加内容，会自动在菜单下显示。

若要显示博客描述，编辑 `_config.yml`：

```yaml
theme_config:
  show_description: true
```

### 💡 尝试的技巧

#### 暗色模式下反转图片

本主题在暗色模式下通过CSS反转所有颜色（包括图片）。若要强制某个图片在暗色模式下反转，添加 `class="ioda"`：

```markdown
![图片描述](image.png){:.ioda}
```

这对黑白图片很有用。

## 📝 文件结构

```
.
├── _config.yml              # 站点配置
├── _data/
│   └── menu.yml            # 菜单配置
├── _layouts/               # 页面布局
│   ├── default.html        # 默认布局
│   ├── home.html           # 主页布局
│   ├── page.html           # 页面布局
│   ├── post.html           # 文章布局
│   └── archive.html        # 归档布局
├── _includes/              # 组件文件
│   ├── post_list.html      # 文章列表组件
│   ├── category_list.html  # 分类列表组件（新）
│   ├── menu_item.html      # 菜单项组件
│   └── ...
├── _posts/                 # 文章目录
│   └── YYYY-MM-DD-title.md
├── assets/
│   ├── css/main.scss       # 样式文件
│   └── js/category.js      # 分类脚本（新）
├── _sass/                  # Sass源文件
│   └── no-style-please.scss
├── index.md                # 主页
├── categories.md           # 分类页面
└── README.md               # 本文件
```

## 🛠️ 开发指南

### 本地开发

```bash
# 安装依赖
bundle install

# 启动服务
bundle exec jekyll serve

# 访问 http://localhost:4000
```

### 修改样式

编辑 `_sass/no-style-please.scss`，会自动编译到 `assets/css/main.css`。

### 添加功能

- 修改 `_layouts/` 中的布局文件
- 修改 `_includes/` 中的组件文件
- 无需修改 `_config.yml` 配置

## 🤝 贡献

欢迎提交 Pull Request 改进本博客！

## 📄 许可证

基于 [no-style-please](https://github.com/riggraz/no-style-please) 主题。

## 🔗 相关链接

- [Jekyll 官方文档](https://jekyllrb.com/)
- [no-style-please 原主题](https://github.com/riggraz/no-style-please)
- [GitHub Pages 帮助](https://docs.github.com/en/pages)

