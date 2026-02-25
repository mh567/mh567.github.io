
---
layout: post
title: API认证与授权技术
categories: [IAM, Security]
---

> 概念解释：
> 认证（authentication），解决 我是谁 的问题；
> 授权（authorization），解决 我能干什么 的问题；
> 凭证（credentials），认证 和 授权 的基础，如session ID、SSH的密钥、JWT令牌、一次性密码等。
> 账户技术（accounting），如微软的AD，以及简单目录访问协议LDAP等。
> 访问控制策略（AC），如ACL、RBAC、ABAC等

[参考资料](https://juejin.cn/post/6844903807839649806)

### HTTP Basic Authentication

#### Example：

1. 将用户名和密码使用冒号连接，例如 username:abc123456；
2. 为了防止用户名或者密码中存在超出 ASCII 码范围的字符，推荐使用UTF-8编码；
3. 将上面的字符串使用 Base 64 编码，例如 dXNlcm5hbWU6YWJjMTIzNDU2；
4. 在 HTTP 请求头中加入 “Basic + 编码后的字符串”，即：Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l；

### HMAC（AK/SK）认证

> HMAC：Hash-based Message Authentication Code（基于哈希的消息认证码），基于密钥的哈希算法，通信双方共享密钥、约定算法、对报文进行哈希运算，验证报文的合法性。
> AK：Access key；
> SK：Secret key；
> MD系列的算法有HmacMD2、HmacMD4、HmacMD5三种算法；
> SHA系列的算法有HmacSHA1、HmacSHA224、HmacSHA256、HmacSHA384、HmacSHA512五种算法。
> 通常选取密钥长度不小于所选用摘要算法输出的信息摘要的长度（当key太长时，用摘要算法对key计算得到输出作为新的key，MD5输出长度为L=16）。
> 机密性、完整性

#### MAC

> MAC：message authentication code，消息认证码
> MAC有很多实现方式，比较通用的是基于hash算法的MAC，还有(OMAC, CBC-MAC and PMAC)。

#### HMAC算法

HMAC（K，M）=H（（K’⊕opad）∣H（（K’⊕ipad）∣M））

> K' ：key直接填充0或用H对key运算再填充0得到的固定长度B（数据块字节数，如64）

![image.png](i/image-20211015155137-6ln9ewf.png)

#### 加入干扰信息

> 为了让每一次请求的签名变得独一无二，从而实现重放攻击，我们需要在签名时放入一些干扰信息。
> 在业界标准中有两种典型的做法，质疑/应答算法（OCRA: OATH Challenge-Response Algorithm）、基于时间的一次性密码算法（TOTP：Time-based One-time Password Algorithm）。

##### 质疑/应答算法

加入一个随机数。  
![image.png](i/image-20211015155201-bzq6qop.png)

##### 基于时间的一次性密码认证

> 这里的只是利用时间戳作为验证的时间窗口，并不能严格的算作基于时间的一次性密码算法。标准的基于时间的一次性密码算法在两步验证中被大量使用。

![image.png](i/image-20211015155215-4wacezl.png)

### OAuth

> OAuth（开放授权）是一个开放标准，允许用户授权第三方网站访问他们存储在另外的服务提供者上的信息，而不需要将用户名和密码提供给第三方网站或分享他们数据的所有内容。
> 只解决授权。

![image.png](i/image-20211015155222-ikl6snj.png)

#### 认证

如果需要获取用户的认证信息，可以借助OpenID Connect。

#### 验证access token

> access token：从资源服务器获取数据
> refresh token ：用于重新刷新access token

1. 使用 OAuth 服务器提供的 Introspection 接口来验证；
2. 使用 JWT 验证

### JWT

> JWT：JSON Web Token；三段式结构；值token；认证。
> [链接](https://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)
> [cookie、session、jwt](https://zhuanlan.zhihu.com/p/72407618)

![image.png](i/image-20211015155237-czih8v9.png)

### 

从cookie到session到token
