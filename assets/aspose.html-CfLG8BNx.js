import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,a,o as i}from"./app-BV6H1KHp.js";const p={};function l(t,e){return i(),n("div",null,[...e[0]||(e[0]=[a(`<h2 id="测试例子" tabindex="-1"><a class="header-anchor" href="#测试例子"><span>测试例子</span></a></h2><p>引用包</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>  &lt;ItemGroup&gt;</span></span>
<span class="line"><span>    &lt;PackageReference Include=&quot;Aspose.Cells&quot; Version=&quot;21.3.0&quot; /&gt;</span></span>
<span class="line"><span>    &lt;PackageReference Include=&quot;Aspose.PDF&quot; Version=&quot;21.3.0&quot; /&gt;</span></span>
<span class="line"><span>  &lt;/ItemGroup&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>//定义License变量，用于去水印</span></span>
<span class="line"><span>//如需获取key请加微信:25489181</span></span>
<span class="line"><span>var byteKey = Convert.FromBase64String(&quot;&quot;);</span></span>
<span class="line"><span>if (byteKey.Length==0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    Console.WriteLine(&quot;key不能为空，请加微信25489181获取key&quot;);</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//注册，实现去水印</span></span>
<span class="line"><span>new Aspose.Cells.License().SetLicense(new MemoryStream(byteKey));</span></span>
<span class="line"><span>new Aspose.Pdf.License().SetLicense(new MemoryStream(byteKey));</span></span>
<span class="line"><span>#region excel转pdf</span></span>
<span class="line"><span>Aspose.Cells.Workbook workbook = new Aspose.Cells.Workbook();</span></span>
<span class="line"><span>Aspose.Cells.Worksheet sheet = workbook.Worksheets[0];</span></span>
<span class="line"><span>sheet.Cells[0, 0].Value = &quot;A5竖向&quot;;</span></span>
<span class="line"><span>sheet.PageSetup.PaperSize = PaperSizeType.PaperA5;</span></span>
<span class="line"><span>MemoryStream vStream= new MemoryStream();</span></span>
<span class="line"><span>sheet.Workbook.Save(vStream, SaveFormat.Pdf);</span></span>
<span class="line"><span>sheet.Workbook.Save(&quot;A5竖向.pdf&quot;, SaveFormat.Pdf);</span></span>
<span class="line"><span>sheet.Cells[0, 0].Value = &quot;A5横向&quot;;</span></span>
<span class="line"><span>sheet.PageSetup.Orientation = PageOrientationType.Landscape;</span></span>
<span class="line"><span>MemoryStream hStream = new MemoryStream();</span></span>
<span class="line"><span>sheet.Workbook.Save(hStream, SaveFormat.Pdf);</span></span>
<span class="line"><span>sheet.Workbook.Save(&quot;A5横向.pdf&quot;, SaveFormat.Pdf);</span></span>
<span class="line"><span>#endregion</span></span>
<span class="line"><span>#region pdf单页双份</span></span>
<span class="line"><span>//用于拼页</span></span>
<span class="line"><span>PdfFileEditor pdfEditor = new PdfFileEditor();</span></span>
<span class="line"><span>FileStream outputStream = new FileStream(&quot;A4竖排.pdf&quot;, FileMode.Create);</span></span>
<span class="line"><span>pdfEditor.MakeNUp(hStream, hStream, outputStream);//2页合并为一页(竖排）</span></span>
<span class="line"><span>FileStream outputStream2 = new FileStream(&quot;A4横排.pdf&quot;, FileMode.Create);</span></span>
<span class="line"><span>pdfEditor.MakeNUp(new MemoryStream []{ vStream, vStream}, outputStream2,true);// sidewise参数为横向//2页合并为一页(横排）</span></span>
<span class="line"><span>#endregion</span></span>
<span class="line"><span>#region pdf多页拼页</span></span>
<span class="line"><span></span></span>
<span class="line"><span>FileStream outputStream3 = new FileStream(&quot;4页.pdf&quot;, FileMode.Create);</span></span>
<span class="line"><span>//4页pdf</span></span>
<span class="line"><span>pdfEditor.Append(vStream, new MemoryStream[] { vStream, vStream, vStream }, 1, 1, outputStream3);</span></span>
<span class="line"><span>FileStream outputStream4= new FileStream(&quot;4页合并后.pdf&quot;, FileMode.Create);</span></span>
<span class="line"><span>//4张A5合并为一张A3</span></span>
<span class="line"><span>pdfEditor.MakeNUp(outputStream3, outputStream4, 2, 2, Aspose.Pdf.PageSize.A3);</span></span>
<span class="line"><span>#endregion</span></span>
<span class="line"><span>#region pdf页面拆分</span></span>
<span class="line"><span>FileStream outputStream5 = new FileStream(&quot;4页pdf提取第1页.pdf&quot;, FileMode.Create);</span></span>
<span class="line"><span>pdfEditor.Extract(outputStream3, 1, 1, outputStream5);</span></span>
<span class="line"><span>#endregion</span></span>
<span class="line"><span>#region 单页拆分为多页</span></span>
<span class="line"><span>Aspose.Pdf.Document doc = new Aspose.Pdf.Document(outputStream2);</span></span>
<span class="line"><span>doc.Pages.Add(doc.Pages[1]);</span></span>
<span class="line"><span>doc.Pages[1].MediaBox = new Aspose.Pdf.Rectangle(0, 0, doc.Pages[1].MediaBox.URX / 2, doc.Pages[1].MediaBox.URY);</span></span>
<span class="line"><span>doc.Pages[2].MediaBox = new Aspose.Pdf.Rectangle(doc.Pages[2].MediaBox.Width/2, 0, doc.Pages[1].MediaBox.URX, doc.Pages[1].MediaBox.URY);</span></span>
<span class="line"><span>doc.Save(&quot;A4横排再还原为A5大小2页.pdf&quot;);</span></span>
<span class="line"><span>#endregion</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5)])])}const o=s(p,[["render",l]]),c=JSON.parse('{"path":"/middleware/office/aspose.html","title":"Aspose","lang":"zh-CN","frontmatter":{"title":"Aspose","lang":"zh-CN","date":"2023-10-18T00:00:00.000Z","publish":true,"author":"azrng","isOriginal":true,"category":["middleware"],"tag":["无"],"filename":"aspose","slug":"kitbflpzo9yft1ko","docsId":"111173745","description":"测试例子 引用包 代码","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Aspose\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-10-18T00:00:00.000Z\\",\\"dateModified\\":\\"2026-03-06T15:39:41.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"azrng\\"}]}"],["meta",{"property":"og:url","content":"https://azrng.gitee.io/kbms/knowledge/middleware/office/aspose.html"}],["meta",{"property":"og:site_name","content":"知识库"}],["meta",{"property":"og:title","content":"Aspose"}],["meta",{"property":"og:description","content":"测试例子 引用包 代码"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-03-06T15:39:41.000Z"}],["meta",{"property":"article:author","content":"azrng"}],["meta",{"property":"article:tag","content":"无"}],["meta",{"property":"article:published_time","content":"2023-10-18T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-03-06T15:39:41.000Z"}]]},"git":{"createdTime":1772811581000,"updatedTime":1772811581000,"contributors":[{"name":"azrng","username":"azrng","email":"itzhangyunpeng@163.com","commits":1,"url":"https://github.com/azrng"}]},"readingTime":{"minutes":1.26,"words":379},"filePathRelative":"middleware/office/aspose.md","excerpt":"<h2>测试例子</h2>\\n<p>引用包</p>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code class=\\"language-\\"><span class=\\"line\\"><span>  &#x3C;ItemGroup></span></span>\\n<span class=\\"line\\"><span>    &#x3C;PackageReference Include=\\"Aspose.Cells\\" Version=\\"21.3.0\\" /></span></span>\\n<span class=\\"line\\"><span>    &#x3C;PackageReference Include=\\"Aspose.PDF\\" Version=\\"21.3.0\\" /></span></span>\\n<span class=\\"line\\"><span>  &#x3C;/ItemGroup></span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{o as comp,c as data};
