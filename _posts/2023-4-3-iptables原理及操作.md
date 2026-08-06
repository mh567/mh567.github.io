---
layout: post
title: iptables 原理、操作与发行版关系
categories: [Linux, Security]
---

## 概览

iptables 的命令并不难查，真正容易混淆的是报文路径。规则写上了为什么没有生效，DNAT 已经配置为什么仍然不通，都要回到下面几个问题：

- 报文从哪里来，要到哪里去。
- 它会在内核里的哪些位置被检查。
- 这些位置上的规则，最终是按什么顺序决定“放行、拒绝、转换地址”。

本文先说明报文如何经过表和链，再整理常用操作，最后解释 iptables、nftables、ufw 和 firewalld 的关系。

先做一个基础区分：主机防火墙和网络防火墙关注的并不是同一类流量。

- 如果这台机器只是普通服务器，重点通常在 `INPUT` 和 `OUTPUT`。
- 如果这台机器还是路由器、网关或跳板设备，`FORWARD` 和 `nat` 表就会变得很重要。

## iptables 的基本原理

先分清两个名字：`Netfilter` 和 `iptables`。

`Netfilter` 是 Linux 内核里的报文处理框架。所谓“内核里的报文处理框架”，可以先把它理解成 Linux 网络栈里的一组检查点和处理逻辑：报文进来、转发、发出去的过程中，都可以在这些位置被检查、修改、放行或丢弃。

`iptables` 是在命令行中配置规则的工具，`Netfilter` 才是内核中实际检查和处理报文的框架。报文进入、转发或离开 Linux 主机时，会经过若干 Netfilter 检查点，iptables 负责告诉内核各检查点应如何处理流量。

为了便于后文理解，先看一张整体示意图。这里不必立即记住“五条链、四张表”这些术语，先建立整体认识即可：报文会沿着固定路径流动，并在路径上的不同位置被不同类型的规则处理。

![iptables 报文流向示意](/assets/images/iptables-packet-flow.svg)

### 先把三个概念分清：表、链、规则

理解 iptables，先区分三个层次：

- 表：按功能组织规则，例如过滤、地址转换、打标记。
- 链：报文流经协议栈时，会在固定位置经过一串规则。
- 规则：一条规则就是“满足什么条件，就执行什么动作”。

初学 iptables 时，比较容易将“表”和“链”混为一体。更合适的理解方式是：

- 链表示“检查发生在什么时候”。
- 表表示“这次检查主要想干什么”。

也就是说，链更接近路径上的检查点，表更接近这些检查点上的处理类别。

这时再回看前面的图会更容易理解：图中的固定位置，对应后面会看到的几条链；而在这些位置上执行过滤、地址转换、打标记等不同处理类别，对应后面会看到的几张表。

例如 `INPUT` 这条链表示“这个包已经被判定为发给本机”；而 `filter` 表表示“这里主要做的是放行还是拦截”。

最常见的规则形式如下：

```bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

这条命令的含义是：向 `INPUT` 链末尾追加一条规则，匹配 TCP 22 端口，命中后放行。

拆开来看：

- `-A INPUT`：把规则追加到 `INPUT` 链。
- `-p tcp --dport 22`：匹配目标端口是 22 的 TCP 流量。
- `-j ACCEPT`：命中后执行 `ACCEPT` 动作。

因此可以将一条规则理解为一句条件判断：

> 如果一个发给本机的 TCP 报文，目标端口是 22，那就放行。

### 报文是怎么走的

理解报文路径，是掌握 iptables 的基础。

Netfilter 在内核中提供了几个关键钩子点，iptables 的链就挂在这些位置上。

这里的“钩子点”可以简单理解为：报文走到某个固定阶段时，内核会在该位置检查是否存在需要执行的规则。

- `PREROUTING`：报文刚进机器，还没做路由判断。
- `INPUT`：报文目标就是本机。
- `FORWARD`：报文不交给本机，只是借道转发。
- `OUTPUT`：报文由本机自己发出。
- `POSTROUTING`：报文即将离开机器。

仅记住这五个名称并不足够，更重要的是先将流量分成三类：

- 发给本机的流量。
- 经过本机转发的流量。
- 由本机主动发出的流量。

这三类流量的路径分别是：

1. 发给本机：`PREROUTING -> INPUT`
2. 转发流量：`PREROUTING -> FORWARD -> POSTROUTING`
3. 本机主动发出：`OUTPUT -> POSTROUTING`

理解这三条主要路径后，很多规则位置都可以顺着路径推导出来。对应到常见场景：

- 访问本机 SSH，主要会匹配 `INPUT`。
- 本机主动请求外部服务，主要会匹配 `OUTPUT`。
- 一台 Linux 机器当网关转发内网流量，重点是 `FORWARD`。

再进一步看两个最容易混淆的位置：

- `PREROUTING` 在“路由决定之前”，所以常拿来改目标地址，例如 DNAT。
- `POSTROUTING` 在“包离开之前”，所以常拿来改源地址，例如 SNAT 或 MASQUERADE。

这也是为什么很多 NAT 规则会写在这两个位置上：地址转换必须发生在合适的处理阶段。

如果机器承担网关或路由职责，还需要确认内核已经开启 IPv4 转发：

```bash
# 查看是否开启
cat /proc/sys/net/ipv4/ip_forward

# 临时开启
sysctl -w net.ipv4.ip_forward=1

# 永久开启，建议写到单独的 sysctl 配置文件
printf 'net.ipv4.ip_forward = 1\n' > /etc/sysctl.d/99-ip-forward.conf
sysctl --system
```

如果没有开启转发，即使 `FORWARD` 链规则配置正确，机器也不会实际转发流量。

### 四张最常见的表分别干什么

前面已经提到，链回答的是“什么时候检查”，表回答的是“按什么类型处理”。在这个基础上，再看最常见的四张表会更自然。

iptables 最常接触的是这四张表：

- `filter`：做访问控制，决定放行、拒绝还是丢弃。
- `nat`：做地址转换，常见于端口映射和出口共享上网。
- `mangle`：修改报文标记，用于策略路由、流量整形等场景。
- `raw`：在连接跟踪前做特殊处理，平时较少直接接触。

日常服务器运维中，最常用的是 `filter` 和 `nat`。

这里补充一个很关键但经常被忽略的点：不是每张表都会出现在每条链上。

从理解和日常使用的角度，可以先记住下面这组对应关系：

- `filter` 最常看的是 `INPUT`、`FORWARD`、`OUTPUT`。
- `nat` 最常看的是 `PREROUTING`、`POSTROUTING`，有时也会用 `OUTPUT`。
- `mangle` 和 `raw` 更偏进阶场景。

因此，当需求是“限制 SSH 访问”时，通常应先想到 `filter/INPUT`；当需求是“将公网 8080 改写到内网 80”时，通常应先想到 `nat/PREROUTING`。这样更容易快速定位规则位置。

### 真正让规则变简单的，是连接跟踪

真实通信是一段会话，防火墙因此还要识别报文所属的连接状态。

iptables 的实用性很大一部分来自 Linux 内核的连接跟踪机制，也就是 `conntrack`。

“连接跟踪”这个概念听起来比较抽象，但它的作用并不复杂：内核会记录一条通信当前处于什么阶段。这样在编写规则时，就不必将请求和响应逐条手工对应。

它会帮内核记住某个连接当前处于什么状态，常见状态有：

- `NEW`：新的连接请求。
- `ESTABLISHED`：已经建立的连接。
- `RELATED`：和已有连接相关的流量。
- `INVALID`：无法识别或异常的报文。

因此很多规则集会先放一条：

```bash
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
```

这样做的直接好处是，很多响应流量不需要再单独补写规则。

例如：

- 本机主动访问外部网站，请求包从 `OUTPUT` 发出去。
- 返回包进来后会被识别为 `ESTABLISHED`。
- 因此即使 `INPUT` 默认策略是 `DROP`，这类回包仍然可以被前面的连接状态规则放行。

很多规则集只显式开放请求方向，返回流量仍能正常通过，因为连接跟踪已经把它识别为已有会话的一部分。

一个常见的安全基线写法是顺手把异常流量丢掉：

```bash
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP
```

这条规则并不是所有场景都必须具备，但在面向公网的服务器上，通常值得作为增强项加入。

### 为什么规则顺序比你想的更重要

iptables 按从上到下的顺序匹配，命中后立即执行动作，不会看完整条链后再统一裁决。规则顺序直接决定结果。

例如下面这两条规则，顺序一换，含义就完全变了：

```bash
iptables -A INPUT -s 10.0.0.5 -j ACCEPT
iptables -A INPUT -j DROP
```

这表示先放行 `10.0.0.5`，其他再丢弃。如果把 `DROP` 放在第一条，后面的放行规则就没有机会生效。

可以将整条链理解为一组按顺序执行的 `if/else if` 判断：写在前面的规则优先获得匹配机会。

除了规则顺序，还要同时看默认策略，也就是链的 `policy`。如果一条报文在整条链中都没有命中规则，最后就会落到默认策略上。

因此很多线上环境会把 `INPUT` 默认策略设为 `DROP`，然后只显式开放必要端口和可信来源。

## 常用基本操作

下面按场景整理常用命令，便于查阅和直接套用。

### 场景 1：先看清当前规则

建议先查看规则，再做修改。

```bash
# 查看 filter 表规则
iptables -L -n -v --line-numbers

# 查看 nat 表规则
iptables -t nat -L -n -v --line-numbers

iptables -S
iptables -t nat -S
```

推荐带上 `-n` 和 `--line-numbers`：

- `-n` 避免 IP 和端口被反解，输出更直接。
- `--line-numbers` 方便后续按序号删除或替换规则。

### 场景 2：新增、删除、替换规则

最常用的是 `-A`、`-I`、`-D`、`-R`：

```bash
# 在链首插入一条规则
iptables -I INPUT 1 -p tcp --dport 22 -j ACCEPT

# 在链尾追加一条规则
iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# 按编号删除
iptables -D INPUT 3

# 按完整规则删除
iptables -D INPUT -p tcp --dport 80 -j ACCEPT

# 替换第 1 条规则
iptables -R INPUT 1 -p tcp --dport 22 -j ACCEPT
```

- `-I` 是插入，默认更靠前。
- `-A` 是追加，放到最后。
- `-D` 用于删除规则。
- `-R` 用于替换指定编号的规则。

如果无法确认当前链中的规则顺序，优先使用 `-I` 会更稳妥。按编号删除的效率较高，但前提是规则编号已经确认且没有变化。

### 场景 3：设置一台普通服务器的基础放行规则

下面这组规则适合作为普通服务器的基础起点：

```bash
# 回环接口
iptables -A INPUT -i lo -j ACCEPT

# 丢弃明显异常的报文
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

# 已建立连接和相关连接
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# 放行 SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 放行 HTTP 和 HTTPS
iptables -A INPUT -p tcp -m multiport --dports 80,443 -j ACCEPT
```

对于常规 Web 服务器，这几条规则通常已经足以构成基础规则集。

如果机器直接暴露在公网，SSH 更建议进一步限制来源地址，或者至少增加速率限制，而不是长期对全网开放。

### 场景 4：调整默认策略

默认策略通常在基础放行规则之后再设置：

```bash
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT
```

这是一套常见的服务器基线：进入本机和转发默认拒绝，本机主动对外访问默认允许。

远程管理的机器不建议一开始就直接调整默认策略。更稳妥的顺序是先放行 SSH 和已建立连接，再修改默认策略，否则容易导致远程会话中断。

### 场景 5：做 NAT

前面提到过，`nat` 表主要处理地址转换。所谓地址转换，可以先概括理解为：报文在经过某个阶段时，源地址或目标地址会被改写。

NAT 常见分为出口伪装和端口转发。

#### 1. 出口伪装

如果一台 Linux 主机需要为后面的内网机器共享上网，最常见的是 `MASQUERADE`。它可以先理解为“一种根据当前出口地址自动执行源地址改写的方式”：

```bash
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

含义是：凡是从 `eth0` 发出的包，都将源地址改写为当前出口地址。

#### 2. 端口转发

端口转发会修改目标地址，也就是 `DNAT`。例如把公网 8080 转发到内网主机 `10.0.0.10:80`：

```bash
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 10.0.0.10:80
iptables -A FORWARD -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A FORWARD -p tcp -d 10.0.0.10 --dport 80 -m conntrack --ctstate NEW,ESTABLISHED,RELATED -j ACCEPT
```

这三条规则分别对应三个不同环节：

- 第一条在 `PREROUTING` 改目标地址，把访问公网 8080 的请求改写到内网主机。
- 第二条放行已建立连接的回包。
- 第三条允许新的转发请求进入目标主机。

只写 DNAT 而不写 `FORWARD` 规则时，流量通常仍然无法通过。

再补充一个实战中常见的判断：如果这台执行 `DNAT` 的机器并不是后端主机的默认网关，回包可能不会再经过它，此时通常还需要额外做 `SNAT` 或 `MASQUERADE`，以保证返回路径一致。这里的 `SNAT` 指的是改写源地址，与前面的 `DNAT` 相对。

### 场景 6：保存和恢复规则

iptables 规则默认只存在于内存中，机器重启后会消失，因此最终还需要做持久化。

```bash
# 导出当前规则
iptables-save > /etc/iptables/rules.v4

# 从文件恢复规则
iptables-restore < /etc/iptables/rules.v4
```

上面这个路径更常见于 Debian / Ubuntu 体系。实际生产环境中，“保存成功”并不等于“开机自动生效”，还要看系统最终由谁负责加载规则：可能是 `netfilter-persistent`，也可能是 `ufw`、`firewalld` 或 `nftables` 自身的服务。

至于系统启动时如何自动加载，和发行版关系很大，下一节单独说。

## 不同发行版、不同防火墙软件之间的关系

这一部分可以拆成三层：

- 最底层是 `Netfilter`，在 Linux 内核里。
- 中间层是 `iptables` 和 `nftables`，它们负责把规则写给内核。
- 更上层是 `ufw`、`firewalld` 这类管理工具，它们提供更容易维护的管理入口。

先看关系图：

![Linux 防火墙软件关系图](/assets/images/linux-firewall-stack.svg)

### iptables 和 nftables 到底是什么关系

在老系统中，最常见的仍然是 iptables 语法。大量历史文章、初始化脚本和线上规则模板至今仍以 iptables 为主。

较新的发行版逐渐转向 nftables。此时命令行中的 `iptables` 可能是兼容 nftables 的入口，也就是 `iptables-nft`。

可以这样看当前系统走的是哪条路：

```bash
iptables --version
update-alternatives --display iptables 2>/dev/null || true
```

如果版本信息里带有 `nf_tables`，通常说明这套 `iptables` 命令最终写到的是 nftables 后端。

### Ubuntu / Debian：经常先看到 ufw

Ubuntu 用户往往先接触 `ufw`。它把开放端口、限制来源和按服务放行等常见操作收敛为更简洁的命令。

例如：

```bash
ufw allow 22/tcp
ufw allow 80,443/tcp
ufw status verbose
```

ufw 是上层管理入口，底层仍由 iptables 或 nftables 执行规则。

在 Ubuntu / Debian 中，规则持久化常见的是：

- `ufw` 自己管理并随服务启动加载。
- 原生 iptables 方案配合 `iptables-persistent` 或 `netfilter-persistent`。

如果已经决定使用 `ufw` 管理，就不建议再长期手工维护同一套 iptables 规则，以免排障时难以判断究竟是哪一层配置在生效。

### RHEL / CentOS / Fedora：更常见的是 firewalld

RHEL 系更常见的是 `firewalld`。它相较于直接编写 iptables 规则，更强调“区域”和“服务”这些概念，更适合标准化运维和批量管理。

例如开放 HTTP 服务，常见写法是：

```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --reload
```

firewalld 同样属于上层规则管理器，不同版本的底层可能使用 iptables 或 nftables。

这里最需要注意的是：

如果 firewalld 正在接管规则，而同时又手工修改 iptables，最终效果很可能与预期不一致，甚至会被覆盖。在线上环境中，最好选择一个统一入口管理，避免混用。

### 其他发行版怎么看

- openSUSE 常见 firewalld。
- Arch Linux 更常见直接使用 nftables。
- 老旧系统、存量业务脚本、很多云上初始化脚本仍然大量使用 iptables。

新系统可以优先学习 nftables。维护存量 Linux 时，iptables 仍然绕不过去。

## 一套不容易把自己关在门外的最小规则模板

下面这组规则可以作为普通服务器的起步模板，尤其适合远程 SSH 管理场景：

```bash
# 先放行本地回环
iptables -A INPUT -i lo -j ACCEPT

# 丢弃异常状态报文
iptables -A INPUT -m conntrack --ctstate INVALID -j DROP

# 再放行已经建立的连接
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# 再放行 SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 如果机器要提供 Web 服务，再开放 80 和 443
iptables -A INPUT -p tcp -m multiport --dports 80,443 -j ACCEPT

# 最后再收紧默认策略
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT
```

这里的顺序不应颠倒。先放行必要流量，再调整默认策略，是远程运维中一条基础但经常被忽略的原则。

如果希望记住这一段，可以将其概括为下面这个顺序：

1. 先保留本机自身通信和现有会话：`lo`、`ESTABLISHED,RELATED`
2. 再开放你明确需要的入口：SSH、Web、业务端口
3. 最后再把默认策略收紧为 `DROP`

这个顺序本身，比单条命令更重要。

## 小结

排查 iptables 时，可以按以下顺序处理：

1. 先判断这个流量是发给本机、经过本机，还是由本机发出。
2. 再判断它会经过哪几条链。
3. 再判断应该在对应的表里做过滤，还是做地址转换。
4. 最后再检查规则顺序和默认策略。

ufw、firewalld 和 nftables 的界面各不相同，底层仍要回答同样的问题：报文从哪里来、要到哪里去、在哪个钩子点处理，以及最终是否放行。
