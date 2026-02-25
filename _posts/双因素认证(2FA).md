---


---

<hr>
<h2 id="layout-posttitle-双因素认证2facategory-iam"><span class="prefix"></span><span class="content">layout: post<br>
title: 双因素认证(2FA)<br>
category: IAM</span><span class="suffix"></span></h2>
<h1 id="双因素认证2fa"><span class="prefix"></span><span class="content">双因素认证(2FA)</span><span class="suffix"></span></h1>
<h3 id="一般来说，三种不同类型的证据，可以证明一个人的身份三种因素。"><span class="prefix"></span><span class="content">一般来说，三种不同类型的证据，可以证明一个人的身份(三种因素)。</span><span class="suffix"></span></h3>
<blockquote>
<ul>
<li><strong>秘密信息</strong>：只有该用户知道、其他人不知道的某种信息，比如密码。</li>
<li><strong>个人物品</strong>：该用户的私人物品，比如身份证、钥匙。</li>
<li><strong>生理特征</strong>：该用户的遗传特征，比如指纹、相貌、虹膜等等。</li>
</ul>
</blockquote>
<h3 id="常见2fa方法："><span class="prefix"></span><span class="content">常见2FA方法：</span><span class="suffix"></span></h3>
<ul>
<li>安全问题+密码</li>
<li>短信/邮件+密码（不安全）</li>
<li>TPOP+密码</li>
<li>U2F(Universal 2nd Factor)+密码</li>
<li>推送通知（Google账户）+密码</li>
<li>生物识别+密码</li>
</ul>
<h3 id="tpoptime-based-one-time-password"><span class="prefix"></span><span class="content">TPOP(Time-based One-time Password)</span><span class="suffix"></span></h3>
<ol>
<li>服务器生成密钥</li>
<li>根据密钥生成二维码，手机扫描存储密钥</li>
<li>手机根据密钥和时间戳生成哈希，有效期（默认为30s）内提交给服务器</li>
<li>服务器根据当前时间戳和密钥生成哈希，对比</li>
</ol>
<h4 id="简化版算法："><span class="prefix"></span><span class="content">简化版算法：</span><span class="suffix"></span></h4>
<pre><code>TC = floor((unixtime(now) − unixtime(T0)) / TS) //T0为约定的起始时间，默认为0，TS为有效期
TC = floor(unixtime(now) / 30) //30秒内，TC值相同
TPOP = HASH(secretKey, TC)
</code></pre>
<h4 id="标准版"><span class="prefix"></span><span class="content">标准版</span><span class="suffix"></span></h4>
<pre class=" language-bash"><code class="prism  language-bash">OTP<span class="token punctuation">(</span>secretKey,C<span class="token punctuation">)</span> <span class="token operator">=</span> Truncate<span class="token punctuation">(</span>HMAC-SHA-1<span class="token punctuation">(</span>secretKey,C<span class="token punctuation">))</span>
TOTP <span class="token operator">=</span> Truncate<span class="token punctuation">(</span>HMAC-SHA-1<span class="token punctuation">(</span>secretKey,TC<span class="token punctuation">)</span>
</code></pre>
<h3 id="u2ftuniversal-2nd-factor"><span class="prefix"></span><span class="content">U2F(TUniversal 2nd Factor)</span><span class="suffix"></span></h3>
<h4 id="介绍"><span class="prefix"></span><span class="content">介绍</span><span class="suffix"></span></h4>
<p>U2F(Universal 2nd Factor)是FIDO联盟提出的使用标准<strong>公钥密码</strong>学技术的身份认证协议。<br>
<strong>2个阶段：</strong></p>
<ul>
<li>注册
<ul>
<li>设备生成<strong>公私钥对</strong>，公钥发给服务器保存与用户绑定</li>
</ul>
</li>
<li>鉴权
<ul>
<li>服务器发起challenge</li>
<li>设备用私钥对challenge加密发回</li>
<li>服务器用公钥验证</li>
</ul>
</li>
</ul>

