import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-dsQIpMaC.js";const l={};function p(t,n){return i(),a("div",null,[...n[0]||(n[0]=[e(`<p>在需要出来验证码的页面，使用一个图片控件，如下</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>  &lt;asp:Image ID=&quot;Image1&quot; runat=&quot;server&quot; src=&quot;TransmitFileDemo.aspx&quot; Style=&quot;cursor: pointer&quot; onclick=&quot;this.src=this.src+&#39;?&#39;&quot; align=&quot;middle&quot; alt=&quot;看不清楚，点击换一张！&quot; /&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>此控件的src对应另一个生成验证码的页面<br>  <br> 生成验证码的页面前台没内容，看后台：<br> 加载方法</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>protected void Page_Load(object sender, EventArgs e)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            string checkCode = CreateRandomCode(4);//到这一步已经生成了验证码 如  5df5  位数也在此设置</span></span>
<span class="line"><span>           Session[&quot;CheckCode&quot;] = checkCode; //用于检测输入验证码是否正确</span></span>
<span class="line"><span>           CreateImage(checkCode);//将验证码弄到图片上</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        /// &lt;summary&gt;</span></span>
<span class="line"><span>        /// 将验证码弄到图片上</span></span>
<span class="line"><span>        /// &lt;/summary&gt;</span></span>
<span class="line"><span>        /// &lt;param name=&quot;checkCode&quot;&gt;&lt;/param&gt;</span></span>
<span class="line"><span>        private void CreateImage(string checkCode)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            // 生成图象验证码函数</span></span>
<span class="line"><span>            int iwidth = (int)(checkCode.Length * 11.5);</span></span>
<span class="line"><span>            System.Drawing.Bitmap image = new System.Drawing.Bitmap(iwidth, 20);</span></span>
<span class="line"><span>            Graphics g = Graphics.FromImage(image);</span></span>
<span class="line"><span>            Font f = new System.Drawing.Font(&quot;Arial&quot;, 10, System.Drawing.FontStyle.Bold);</span></span>
<span class="line"><span>            Brush b = new System.Drawing.SolidBrush(Color.Azure);//字母白色</span></span>
<span class="line"><span>            //g.FillRectangle(new System.Drawing.SolidBrush(Color.Blue),0,0,image.Width, image.Height);</span></span>
<span class="line"><span>            g.Clear(Color.Brown);//背景灰色</span></span>
<span class="line"><span>            g.DrawString(checkCode, f, b, 3, 3);</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>            Pen blackPen = new Pen(Color.Black, 0);</span></span>
<span class="line"><span>            Random rand = new Random();</span></span>
<span class="line"><span>            System.IO.MemoryStream ms = new System.IO.MemoryStream();</span></span>
<span class="line"><span>            image.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);</span></span>
<span class="line"><span>            Response.ClearContent();</span></span>
<span class="line"><span>            Response.ContentType = &quot;image/Jpeg&quot;;</span></span>
<span class="line"><span>            Response.BinaryWrite(ms.ToArray());</span></span>
<span class="line"><span>            g.Dispose();</span></span>
<span class="line"><span>            image.Dispose();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        /// &lt;summary&gt;</span></span>
<span class="line"><span>        /// 生成验证码</span></span>
<span class="line"><span>        /// &lt;/summary&gt;</span></span>
<span class="line"><span>        /// &lt;param name=&quot;codeCount&quot;&gt;&lt;/param&gt;</span></span>
<span class="line"><span>        /// &lt;returns&gt;&lt;/returns&gt;</span></span>
<span class="line"><span>        private string CreateRandomCode(int codeCount)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            // 函数功能:产生数字和字符混合的随机字符串</span></span>
<span class="line"><span>            string allChar = &quot;0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&quot;;</span></span>
<span class="line"><span>            char[] allCharArray = allChar.ToCharArray();</span></span>
<span class="line"><span>            string randomCode = &quot;&quot;;</span></span>
<span class="line"><span>            Random rand = new Random();</span></span>
<span class="line"><span>            for (int i = 0; i &lt; codeCount; i++)</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                int r = rand.Next(61);</span></span>
<span class="line"><span>                randomCode += allCharArray.GetValue(r);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>            return randomCode;</span></span>
<span class="line"><span>        }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4)])])}const c=s(l,[["render",p]]),o=JSON.parse(`{"path":"/dotnet/webyingyong/webform/changedaimajiexi/suijiyanzhengma.html","title":"随机验证码","lang":"zh-CN","frontmatter":{"title":"随机验证码","lang":"zh-CN","date":"2021-02-17T00:00:00.000Z","publish":true,"author":"azrng","isOriginal":true,"category":["dotNET"],"tag":["无"],"filename":"suijiyanzhengma","slug":"gvmyno","docsId":"31541767","description":"在需要出来验证码的页面，使用一个图片控件，如下 此控件的src对应另一个生成验证码的页面 生成验证码的页面前台没内容，看后台： 加载方法","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"随机验证码\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2021-02-17T00:00:00.000Z\\",\\"dateModified\\":\\"2026-03-06T15:39:41.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"azrng\\"}]}"],["meta",{"property":"og:url","content":"https://azrng.gitee.io/kbms/knowledge/dotnet/webyingyong/webform/changedaimajiexi/suijiyanzhengma.html"}],["meta",{"property":"og:site_name","content":"知识库"}],["meta",{"property":"og:title","content":"随机验证码"}],["meta",{"property":"og:description","content":"在需要出来验证码的页面，使用一个图片控件，如下 此控件的src对应另一个生成验证码的页面 生成验证码的页面前台没内容，看后台： 加载方法"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-03-06T15:39:41.000Z"}],["meta",{"property":"article:author","content":"azrng"}],["meta",{"property":"article:tag","content":"无"}],["meta",{"property":"article:published_time","content":"2021-02-17T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-03-06T15:39:41.000Z"}]]},"git":{"createdTime":1772811581000,"updatedTime":1772811581000,"contributors":[{"name":"azrng","username":"azrng","email":"itzhangyunpeng@163.com","commits":1,"url":"https://github.com/azrng"}]},"readingTime":{"minutes":1.2,"words":359},"filePathRelative":"dotnet/webyingyong/webform/changedaimajiexi/suijiyanzhengma.md","excerpt":"<p>在需要出来验证码的页面，使用一个图片控件，如下</p>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code class=\\"language-\\"><span class=\\"line\\"><span>  &#x3C;asp:Image ID=\\"Image1\\" runat=\\"server\\" src=\\"TransmitFileDemo.aspx\\" Style=\\"cursor: pointer\\" onclick=\\"this.src=this.src+'?'\\" align=\\"middle\\" alt=\\"看不清楚，点击换一张！\\" /></span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`);export{c as comp,o as data};
