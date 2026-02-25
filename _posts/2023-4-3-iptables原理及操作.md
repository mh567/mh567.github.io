---
layout: post
title: iptables原理及操作
categories: [Linux, Security]
---

# iptables原理及操作

# 概览

防火墙类型:主机防火墙 和 网络防火墙

> 主机防火墙用到INPUT和OUTPUT链（数据包进主机协议栈）  
> 网络防火墙用到FORWORD链，核心转发功能要手动开启（路由器路由转发数据包）  
> **查看转发功能是否开启**  
> cat /proc/sys/net/ipv4/ip_forward  
> **临时开启**  
> 方法一：echo 1 > /proc/sys/net/ipv4/ip_forward  
> 方法二：sysctl -w net.ipv4.ip_forward=1  
> **永久生效**  
> 配置/etc/sysctl.conf文件（centos7中配置/usr/lib/sysctl.d/00-system.conf文件），在配置文件中将 net.ipv4.ip_forward设置为1

![image.png](assets/image-20211015155920-c4vl6k2.png)  
​![image.png](assets/image-20211015155927-wsx5lg6.png)

![image.png](assets/image-20220307134337-tcxas9s.png)

以filter表为例

> 所有发往本机的报文如果需要被过滤，首先会经过INPUT链（PREROUTING链没有过滤功能）

> iptables指令由条件+命令组成，条件又有 基本匹配条件 和 扩展匹配条件；动作也有但不需指定模块

# 表和链的关系

> 从表的角度

## iptables 的四个表

  filter 表主要用于**过滤**包，是系统预设的表，内建三个链 INPUT、OUTPUT 以及 FORWARD。INPUT 作用于进入本机的包，OUTPUT 作用于本机送出的包，FORWARD 作用于那些跟本机无关直接转发的包。

  nat 表主要用于**网络地址转换**，也有三个链。PREROUTING 链的作用是在包刚刚到达防火墙时改变它的目的地址。 OUTPUT 链改变本地产生的包的目的地址。POSTROUTING 链在包就要离开防火墙之前改变其源地址。

  mangle 表主要是用于给数据**打标记**，然后根据标记去操作哪些包，各个链都有这个表。

	raw表

> 从链的角度

五链四表----见上图

# 命令

```cpp
iptables -t mangle -A PREROUTING -m set --match-set osa dst -j MARK --set-mark 0x62
iptables -D -t mangle -I PREROUTING -m set --match-set osa src -j MARK --set-mark 0x62
iptables -t mangle -D PREROUTING 3

```

## 查看规则

![image.png](assets/image-20211015155935-jk2n58i.png)

```bash
iptables -t filter -L
```

> -t：表名，可省略，默认列出filter表的规则  
> INPUT：查看指定的链  
> -v：详细信息  
> -n：不对ip进行名称反解,直接显示IP地址
>
> -L：列表  
> --line-numbers：显示规则的编号  
> policy ACCEPT：表示默认接受通过INPUT关卡的所有请求

## 增删改规则

### 清空

```bash
iptables -F INPUT
```

> -F flush,不指定链名清空所有规则

### 增加

```bash
iptables -t filter -I INPUT -s 192.168.184.1 -j DROP //拒绝某ip的ping
```

> -I insert,插入哪个链，在首部插入
> -I 2 在编号为2的位置插入（从1开始）
> -A append，在尾部追加

### 删除

```bash

iptables -D INPUT 3  //按序号
iptables -D INPUT -s 192.168.184.1 -j ACCEPT  //按条件
```

### 修改

```bash
iptables -t filter -R INPUT 1 -s 192.168.184.1 -j REJECT //所有条件都要写上
```

### 修改默认策略

```bash
iptables -t filter -P FORWARD DROP  //将filter表的FORWARD链默认策略改为DROP
```

# 保存规则

## centos6

`service iptables save`//保存到/etc/sysconfig/iptables

## centos7

> 不再使用init风格的脚本启动服务,service iptables save失效

```bash
#配置好yum源以后安装iptables-service
yum install -y iptables-services
#停止firewalld
systemctl stop firewalld
#禁止firewalld自动启动
systemctl disable firewalld
#启动iptables
systemctl start iptables
#将iptables设置为开机自动启动，以后即可通过iptables-service控制iptables服务
systemctl enable iptables
service iptables save
```

## ubuntu

`apt-get install iptables -y`
`apt-get install iptables-persistent -y `

```bash
Debian 或 Ubuntu 16.04 或更高版本执行：
/etc/init.d/netfilter-persistent save //可以进行保存规则
/etc/init.d/netfilter-persistent reload //可以将规则生效
或systemctl start netfilter-persistent //可以将规则生效

Ubuntu 14.04 之前版本执行：
/etc/init.d/iptables-persistent save //可以进行保存规则
/etc/init.d/iptables-persistent reload //可以将规则生效

开机启动
systemctl enable netfilter-persistent.service
或
systemctl enable iptables-persistent.service
```

# 进阶

## 多个源地址

```bash
#示例如下
iptables -t filter -I INPUT -s 192.168.1.111,192.168.1.118 -j DROP
iptables -t filter -I INPUT -s 192.168.1.0/24 -j ACCEPT
iptables -t filter -I INPUT ! -s 192.168.1.0/24 -j ACCEPT
```

## 多个目标地址

```bash
#示例如下
iptables -t filter -I OUTPUT -d 192.168.1.111,192.168.1.118 -j DROP
iptables -t filter -I INPUT -d 192.168.1.0/24 -j ACCEPT
iptables -t filter -I INPUT ! -d 192.168.1.0/24 -j ACCEPT
```

## 协议类型

> 可以匹配的协议类型tcp、udp、udplite、icmp、esp、ah、sctp等（centos7中还支持icmpv6、mh）

```bash
#示例如下
iptables -t filter -I INPUT -p tcp -s 192.168.1.146 -j ACCEPT
iptables -t filter -I INPUT ! -p udp -s 192.168.1.146 -j ACCEPT
```

## 指定网卡

```bash
#-i流入
iptables -t filter -I INPUT -p icmp -i eth4 -j DROP
iptables -t filter -I INPUT -p icmp ! -i eth4 -j DROP
#-o 流出
iptables -t filter -I OUTPUT -p icmp -o eth4 -j DROP
iptables -t filter -I OUTPUT -p icmp ! -o eth4 -j DROP
```

## 扩展匹配之端口

> -p 必须指定协议
> -m 扩展选项，如扩展协议名称相同可省略，这里tcp匹配单端口或连续端口
> --dport 匹配目标端口

```bash
iptables -t filter -I INPUT -s 192.168.1.146 -p tcp -m tcp --dport 22:25 -j REJECT
```

```bash
iptables -t filter -I OUTPUT -d 192.168.1.146 -p udp -m multiport --sports 137,138 -j REJECT
```

> -m multiport 多端口扩展，可指定离散的多个端口

## 黑白名单机制

### 白名单机制

1. INPUT链的默认策略设为`DROP iptables -P INPUT DROP`

    1. 一旦iptables -F清空，就连不到服务器了
2. 默认策略设为ACCEPT，把拒绝所有请求放在规则尾部

    1. `iptables -P INPUT ACCEPT`
    2. `iptables -A INPUT -j REJECT`

## 转发规则

```bash
#由于iptables此时的角色为"网络防火墙"，所以需要在filter表中的FORWARD链中设置规则。
#可以使用"白名单机制"，先添加一条默认拒绝的规则，然后再为需要放行的报文设置规则。
#配置规则时需要考虑"方向问题"，针对请求报文与回应报文，考虑报文的源地址与目标地址，源端口与目标端口等。
#示例为允许网络内主机访问网络外主机的web服务与sshd服务。
iptables -A FORWARD -j REJECT
iptables -I FORWARD -s 10.1.0.0/16 -p tcp --dport 80 -j ACCEPT
iptables -I FORWARD -d 10.1.0.0/16 -p tcp --sport 80 -j ACCEPT
iptables -I FORWARD -s 10.1.0.0/16 -p tcp --dport 22 -j ACCEPT
iptables -I FORWARD -d 10.1.0.0/16 -p tcp --sport 22 -j ACCEPT
 
#可以使用state扩展模块，对上述规则进行优化，使用如下配置可以省略许多"回应报文放行规则"。
iptables -A FORWARD -j REJECT
iptables -I FORWARD -s 10.1.0.0/16 -p tcp --dport 80 -j ACCEPT
iptables -I FORWARD -s 10.1.0.0/16 -p tcp --dport 22 -j ACCEPT
iptables -I FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT
```

# [扩展模块](https://www.zsythink.net/archives/1564)

iprange 连续ip
string 报文中的字符串
time 时间
connlimit 对单ip的并发连接数限制
limit 限制报文到达速率
conntrack 连接追踪模块

#### [-tcp-flags](https://www.zsythink.net/archives/1578)扩展

#### [udp和icmp](https://www.zsythink.net/archives/1588)扩展

#### [state扩展](https://www.zsythink.net/archives/1597)

> 对state模块说，tcp报文、UDP报文、icmp报文都是有连接状态的。
> 5种状态：NEW、ESTABLISHED、RELATED、INVALID、UNTRACKED

`iptables -t filter -I INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT`

> -m conntrack --ctstate与-m state --state的关系
> ctstate是state的扩展版本（内核版本>=2.5开始支持），包括状态参数也是基本相同

### 动作
