---
title: 举例
lang: zh-CN
date: 2021-12-25
publish: true
author: azrng
isOriginal: true
category:
  - middleware
tag:
  - 无
filename: juli
slug: vytu0a
docsId: '29635301'
---
OAuth 2.0授权流程
![image.png](/common/1609839082992-3b30b76c-6dbd-4423-8e46-4d86b5f64667.png)
模拟场景：用户听落网，但需要登录才能收藏期刊，然后用快捷登录方式，使用微博的账号和密码登录后，落网就可以访问到微博的账号信息等，并且在落网也已登录，最后用户就可以收藏期刊了。
结合上面的场景，详细说下 OAuth 2.0 的运行流程：

- (A) 用户登录落网，落网询求用户的登录授权（真实操作是用户在落网登录）。
- (B) 用户同意登录授权（真实操作是用户打开了快捷登录，用户输入了微博的账号和密码）。
- (C) 由落网跳转到微博的授权页面，并请求授权（微博账号和密码在这里需要）。
- (D) 微博验证用户输入的账号和密码，如果成功，则将     access_token 返回给落网。
- (E) 落网拿到返回的     access_token，请求微博。
- (F) 微博验证落网提供的     access_token，如果成功，则将微博的账户信息返回给落网。

图中名词解释：
Client -> 落网
Resource Owner -> 用户
Authorization Server -> 微博授权服务
Resource Server -> 微博资源服务
**3.1. 第一步：引导用户到认证服务器**
圣杰打开简书网页，简书跳转到登录界面，要求用户登录。可是圣杰未在简书注册帐号，所以就点击了QQ图标，使用QQ帐号进行集成登录。跳转到QQ登录界面后，QQ要求用户授权。 这一步中简书主要做了这样一件事就是引导用户到认证服务器。 很显然【QQ互联平台】就是认证服务器。
如何引导？当然是页面跳转。 那认证服务器如何知道是简书过来的认证请求？ 当然是传参。 那需要传递哪些参数呢？
response_type：表示响应类型，必选项，此处的值固定为"code"；
client_id：表示客户端的ID，用来标志授权请求的来源，必选项；
redirect_uri：成功授权后的回调地址；
scope：表示申请的权限范围，可选项；
state：表示客户端的当前状态，可以指定任意值，认证服务器会原封不动地返回这个值。
咱们看看简书实际发送的授权请求Url是：[https://graph.qq.com/oauth2.0/authorize?client_id=100410602&redirect_uri=http://www.jianshu.com/users/auth/qq_connect/callback&response_type=code&state=bb38108d1aaf567c72da0f1167e87142d0e20cb2bb24ec5a](https://graph.qq.com/oauth2.0/authorize?client_id=100410602&redirect_uri=http://www.jianshu.com/users/auth/qq_connect/callback&response_type=code&state=bb38108d1aaf567c72da0f1167e87142d0e20cb2bb24ec5a)
无图无真相，咱们看看控制台的网络监控：
如图所示，除了scope参数外，其他四个参数均有传参。 此时你可能唯一对state参数比较迷惑，传递一个state参数，认证服务器会原封不动返回，那还干嘛要传递state参数呢？
我的理解是，简书用一个guid加长版字符串来唯一标识一个授权请求。这样才会正确获取授权服务器返回的授权码。
这里你可能会问了，既然我知道了这些参数，我岂不是可以伪造简书认证请求，修改redirect_uri参数跳转到个人的网站，然后不就可以获取QQ授权？
跟我一样太傻太天真，简书在QQ互联平台申请时肯定已经预留备案了要跳转返回的URL。QQ互联平台在收到简书的授权请求时肯定会验证回调Url的。
**3.2. 第二步：用户同意为第三方客户端授权**
这一步，对于用户来说，只需要使用资源所有者（QQ）的用户名密码登录，并同意授权即可。点击授权并登录后，授权服务器首先会post一个请求回服务器进行用户认证，认证通过后授权服务器会生成一个授权码，然后服务器根据授权请求的redirect_uri进行跳转，并返回授权码 code和授权请求中传递的state。 这里要注意的是：**授权码有一个短暂的时效**
无图无真相，咱们还是看一下控制台网络监控：
从图中即可验证我们上面所说，最终跳转回简书的Url为：[http://www.jianshu.com/users/auth/qq_connect/callback?code=093B9307E38DC5A2C3AD147B150F2AB3&state=bb38108d1aaf567c72da0f1167e87142d0e20cb2bb24ec5a和之前的授权请求URL进行对比，可以发现](http://www.jianshu.com/users/auth/qq_connect/callback?code=093B9307E38DC5A2C3AD147B150F2AB3&state=bb38108d1aaf567c72da0f1167e87142d0e20cb2bb24ec5a和之前的授权请求URL进行对比，可以发现) redirect_uri、 state完全一致。 而 code=093B9307E38DC5A2C3AD147B150F2AB3就是返回的授权码。
**3.3. 第三步：使用授权码向认证服务器申请令牌**
从这一步开始，对于用户来说是察觉不到的。简书后台默默的在做后续的工作。
简书拿到QQ互联平台返回的授权码后，需要根据授权码再次向认证服务器申请令牌（access token）。 到这里有必要再理清两个概念：
授权码（Authorization Code）：相当于授权服务器口头告诉简书，用户同意授权使用他的QQ登录简书了。
令牌（Access Token）：相当于临时身份证。
那如何申请令牌呢？ 简书需要后台发送一个get请求到认证服务器（QQ互联平台）。 那要携带哪些必要信息呢？ 是的，要携带以下参数：
granttype：表示授权类型，此处的值固定为"authorizationcode"，必选项；
client_id：表示从QQ互联平台申请到的客户端ID，用来标志请求的来源，必选项；
client_secret：这个是从QQ互联平台申请到的客户端认证密钥，机密信息十分重要，必选项；
redirect_uri：成功申请到令牌后的回调地址；
code：上一步申请到的授权码。
根据以上信息我们可以模拟一个申请AccessToken的请求：[https://graph.qq.com/oauth2.0/token?client_id=100410602&client_secret=123456jianshu&redirect_uri=http://www.jianshu.com/users/auth/qq_connect/callback&grant_type=authorization_code&code=093B9307E38DC5A2C3AD147B150F2AB3](https://graph.qq.com/oauth2.0/token?client_id=100410602&client_secret=123456jianshu&redirect_uri=http://www.jianshu.com/users/auth/qq_connect/callback&grant_type=authorization_code&code=093B9307E38DC5A2C3AD147B150F2AB3)
发送完该请求后，认证服务器验证通过后就会发放令牌，并跳转会简书，其中应该包含以下信息：
access_token：令牌
expires_in：access token的有效期，单位为秒。
refreshtoken：在授权自动续期步骤中，获取新的AccessToken时需要提供的参数。
同样，我们可以模拟出一个返回的token：[http://www.jianshu.com/users/auth/qq_connect/callback?access_token=548ADF2D5E1C5E88H4JH15FKUN51F&expires_in=36000&refresh_token=53AD68JH834HHJF9J349FJADF3](http://www.jianshu.com/users/auth/qq_connect/callback?access_token=548ADF2D5E1C5E88H4JH15FKUN51F&expires_in=36000&refresh_token=53AD68JH834HHJF9J349FJADF3)
这个时候简书还有一件事情要做，就是把用户token写到cookie里，进行用户登录状态的维持。咱们还是打开控制器验证一下。
从图中可以看出简书把用户token保存在名为remember_user_token的cookie里。 不用打cookie的歪主意了，肯定是加密了的。 可以尝试下手动把 remember_user_token这条cookie删除，保证刷新界面后需要你重新登录简书。
**3.4. 第四步：向资源服务器申请资源**
有了token，向资源服务器提供的资源接口发送一个get请求不就行了，资源服务器校验令牌无误，就会向简书返回资源（QQ用户信息）。
同样咱们也来模拟一个使用token请求QQ用户基本信息资源的URL：[https://graph.qq.com/user/get_user_info?client_id=100410602&qq=2098769873&access_token=548ADF2D5E1C5E88H4JH15FKUN51F](https://graph.qq.com/user/get_user_info?client_id=100410602&qq=2098769873&access_token=548ADF2D5E1C5E88H4JH15FKUN51F)
到这一步OAuth2.0的流程可以说是结束了，但是对于简书来说还有重要的事情要做。那就是：**拿到token、reresh_token和用户数据这么重要的东西不存数据库傻呀？**
**3.5. 第五步：令牌延期（刷新）**
你肯定对第四步返回的 refresh_token比较好奇。 它是用来对令牌进行延期（刷新）的。为什么会有两种说法呢，因为可能认证服务器会重新生成一个令牌，也有可能 对过期的令牌进行延期。
比如说，QQ互联平台为了安全性考虑，返回的access_token是有时间限制的，假如用户某天不想授权了呢，总不能给了个access_token你几年后还能用吧。我们上面模拟返回的令牌有效期为10小时。10小时后，用户打开浏览器逛简书，浏览器中用户的token对应的cookie已过期。简书发现浏览器没有携带token信息过来，就明白token失效了，需要重新向认证平台申请授权。如果让用户再点击QQ进行登录授权，这明显用户体验不好。咋搞呢？refresh_token就派上了用场，可以直接跳过前面申请授权码的步骤，当发现token失效了，简书从浏览器携带的cookie中的sessionid找到存储在数据库中的refresh_token，然后再使用 refresh_token进行token续期（刷新）。
那用refresh_token进行token续期需要怎么做呢？ 同样需要向认证服务器发送一个get请求。 需要哪些参数？
granttype：表示授权类型，此处的值固定为"refreshtoken"，必选项；
client_id：表示从QQ互联平台申请到的客户端ID，用来标志请求的来源，必选项；
client_secret：这个是从QQ互联平台申请到的客户端认证密钥，机密信息十分重要，必选项；
refreshtoken：即申请令牌返回的refreshtoken。
根据上述信息，我们又可以模拟一个令牌刷新的URL：[https://graph.qq.com/oauth2.0/token?client_id=100410602&client_secret=123456jianshu&redirect_uri=http://www.jianshu.com/users/auth/qq_connect/callback&grant_type=refresh_token&refresh_token=53AD68JH834HHJF9J349FJADF3那返回的结果呢](https://graph.qq.com/oauth2.0/token?client_id=100410602&client_secret=123456jianshu&redirect_uri=http://www.jianshu.com/users/auth/qq_connect/callback&grant_type=refresh_token&refresh_token=53AD68JH834HHJF9J349FJADF3那返回的结果呢)? 和第四步返回的结果一样。
这里你可能又有疑问了，那既然每次进行令牌延期后都会重新返回一个refresh_token，那岂不是我可以使用 refresh_token无限延期？ 天真如我啊， refresh_token也是有过期时间的。而这个过期时间具体是由认证服务器决定的。 一般来说 refresh_token的过期时间要大于 access_token的过期时间。只有这样， access_token过期时，才可以使用 refresh_token进行令牌延期（刷新）。
举个简单例子： 假设简书从QQ互联平台默认获取到的 access_token的有效期是1天， refresh_token的有效期为一周。
用户今天使用QQ登录授权后，过了两天再去逛简书，简书发现token失效，立马用refresh_token刷新令牌，默默的完成了授权的延期。 假如用户隔了两周再去逛简书，简书一核对， access_token、 refresh_token全都失效，就只能乖乖引导用户到授权页面重新授权，也就是回到OAuth2.0的第一步。
**4.0 总结**
本文以简书通过QQ进行授权登录为例，对OAuth2.0 的授权流程进行了梳理，希望通读此文，对你有所帮助。
如果对OAuth2.0有所了解的话，你应该明白本文其实是对OAuth2.0中**授权码模式**授权方式的讲解。
如果想了解OAuth2.0其他几种授权方式，建议参考[理解OAuth 2.0 - 阮一峰的网络日志：[http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html](http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)]。
 
参考资料：[DotNETCore实战](https://mp.weixin.qq.com/s?__biz=MzU4Mjc4NzgyOQ==&mid=2247484547&idx=2&sn=2f831b77308ee2dfb71c5a48c8f3dac9&chksm=fdb3b319cac43a0f5a57dc40c4b81aeb4b14521d3e8a85b67c9924d4bc3f26d1dbbdd6616b38&mpshare=1&scene=1&srcid=&key=9ffaffbd0ea30911a9e7cca15fc30e306c22af599baa9ea99198ad47ae9a14619ca3e6e31aa742d2e8839895bb735563fe4a7199d2c41793204c5876cdf175b68fb156996385b220e8e94f4670e1daff&ascene=1&uin=MzE1MjEyNzg0OQ%3D%3D&devicetype=Windows+10&version=62060834&lang=zh_CN&pass_ticket=ihj%2BVctfJ5BwZswhHRsa66U5ylO6xSy%2FIjGAy2%2BYzIfBsLZJJxG%2FNWEGvMaZXFDU)
