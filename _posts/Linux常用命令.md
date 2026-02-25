---
layout: post
title: Linux常用命令
categories: [Linux]
---
# 换源

> cat /etc/issue //查看系统版本
>
> [ubuntu | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/)

## 一键脚本

```bash
bash <(curl -sSL https://linuxmirrors.cn/main.sh)
```

# 设置代理

```bash
sudo vi /etc/profile
//export http_proxy=http://127.0.0.1:7890
//export https_proxy=http://127.0.0.1:7890

source /etc/profile
```

# 窗体快捷键
Ctrl + a 光标移动到行首（ahead of line），相当于通常的Home键  
Ctrl + e 光标移动到行尾  
Ctrl + l 清屏，相当于执行clear命令  
Ctrl + u 删除光标之前到行首的字符  
Ctrl + k 删除光标之前到行尾的字符
# 进程
ps -ef |grep java //查看java进程 信息  
lsof -i:8080  //查看某个端口是否占用
# 查看DNS
cat /etc/resolv.conf
# 修改 DNS
```c
sudo apt install resolvconf
vi /etc/resolvconf/resolv.conf.d/head

nameserver 8.8.4.4
nameserver 1.1.1.1
nameserver 4.2.2.1

sudo resolvconf -u
```
# 硬盘和分区
df -h  
fdisk -l  
# 程序前后台切换
nohup command & //在后台执行命令，可关闭终端

ctrl+z /暂停当前运行程序
bg //在后台运行程序
jobs -l //查看后台运行状态
fg %1 //将序号为1的程序放到前台执行
ps ef | grep command //查看进程

# supervisor命令
> 能将一个普通的命令行进程变为后台daemon，并监控进程状态，异常退出时能自动重启
### 安装
yum install supervisor  
supervisor配置文件：/etc/supervisord.conf  
子进程配置文件路径：/etc/supervisord.d/
### 使用
supervisorctl status        //查看所有进程的状态  
supervisorctl stop es       //停止es  
supervisorctl start es      //启动es  
supervisorctl restart       //重启es  
supervisorctl update        //配置文件修改后使用该命令加载新的配置  
supervisorctl reload        //重新启动配置中的所有程序  
supervisorctl shutdown #  热重启,不重启其他子进程  
supervisorctl reread  
supervisorctl update  
   
或者启用supervisor的web管理界面  
> **其他的后台管理命令：nohup、screen等**

# vim操作
> 其他编辑器：vi, nano, zile, mg
## vim快速清空文件内容
```bash
gg//进入首行
dG//文件内容被清空
yy//复制光标所在行
pp//粘贴
```
/快速查找 n为下一个
## ubuntu中vi方向键乱码
```bash
# 安装vim full版本
sudo apt install vim
# 或修改tiny版配置
sudo gedit /etc/vim/vimrc.tiny
//对应位置修改为
//set nocompatible
//set backspace=2
```
## 忘记使用sudo权限无法保存
```bash
:w !sudo tee %
```
## 替换字符串
```go
:%s/string1/string2/g  用string2替换string1
```
# curl
> cook book：[https://catonmat.net/cookbooks/curl](https://catonmat.net/cookbooks/curl)
```go
# 不带任何参数，就是发出GET请求
curl https://www.example.com
```
### -A
```go
# 指定客户端的用户代理标头，即User-Agent
curl -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' https://google.com
# 默认是curl/[version]
```
# 查看内核和系统版本

## 查看linux内核版本

### [Ubuntu、CentOS]
`cat /proc/version`  
`uname -a`  
## 查看系统版本
### [Ubuntu]
**​`cat /etc/issue`​**  
**​`lsb_release -a`​**  
`cat /etc/lsb-release` 
### [CentOS]
**​`cat /etc/issue`​**  
**​`lsb_release -a`​**  
`cat /etc/redhat-release`
# 查看连接
### [CentOS6]
netstat -antp ## 查看所有已经建立的连接
### [CentOS7]
ss -antpl //效率优于netstat  
# 生成uuid
Linux内核本身具有生成随机UUID的功能。
```
cat /proc/sys/kernel/random/uuid
```
# patch打补丁
## diff
> 比较两个文件的不同，生成patch
```bash
diff -Naur old new > foo.patch
```
## patch
```bash
patch -p0 testfile1 testfile.patch //生成补丁
patch -p0 < test1.patch  //打补丁
patch -RE -p0 < test1.patch //恢复旧版本
```

> -N    应用补丁；  
> -R   补丁文件中的“新”文件和“旧”文件调换；  
> -p0  从当前目录查找目的文件（夹）；  
> -p1  略掉第一层目录，从当前目录开始查找；  
> -pN  取消N层目录数；  
> -E   如果发现了空文件，那么就删除它；

### patch结构

> 补丁头是分别由---/+++开头的两行，用来表示要打补丁的文件；  
> ---开头表示旧文件，+++开头表示新文件。

### 块

> 补丁中要修改的地方。它通常由一部分不用修改的东西开始和结束，以@@开始，结束于另一个块的开始或者一个新的补丁头。

块会缩进一列  
块的第一列  
+号表示这一行是要加上的。  
-号表示这一行是要删除的。

@@ -1,3 +1,4 @@ //

