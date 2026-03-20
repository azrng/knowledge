import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,a as e,o as i}from"./app-aof-aqO4.js";const l="/knowledge/common/1613566907278-5449d987-b64b-4095-8bea-56c7a251fcfe.png",p="/knowledge/common/1613566907280-898ead77-c8d3-46fc-8d13-1ce09385b0d5.png",r="/knowledge/common/1613566907274-e0ac8530-9345-4122-b289-d24249438092.png",t={};function d(c,s){return i(),a("div",null,[...s[0]||(s[0]=[e(`<p><strong>1.枚举类型</strong><br> //遍历枚举类型Sample的各个枚举名称</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>foreach (string sp in Enum.GetNames(typeof(Sample))) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>ary.Add(sp); </span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>//遍历枚举类型Sample的各个枚举值 </span></span>
<span class="line"><span>foreach (string sp in Enum.GetValues(typeof(Sample))) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>ary.Add(sp); </span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2.遍历ArrayList(Queue、Stack)</strong><br> 这里以string为例，当然ArrayList中的元素可以是任何数据类型，遍历时须确认ArrayList中的元素都是同一数据类型。 <br> //遍历元素为string类型的队列</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>foreach (string text in arraylist) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>ary.Add(text); </span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此外遍历Queue队列和Stack堆栈的方式与ArrayList基本相同， 都可以使用foreach来循环遍历，只不过一个是先进先出另一个是先进后出罢了。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>ArrayList list = new ArrayList();</span></span>
<span class="line"><span>//for遍历</span></span>
<span class="line"><span>for (int i = 0; i &lt; list.Count; i++)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  SE se = (SE)list[i];</span></span>
<span class="line"><span> Console.WriteLine(se.Name);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//foreach遍历</span></span>
<span class="line"><span>foreach (Object obj in list)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  SE se = (SE)list[i];</span></span>
<span class="line"><span>  Console.WriteLine(se.Name);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3.Winform窗体中的控件</strong><br> //遍历寻找主窗体中的控件，并将符合条件的控件从窗体上去除</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>foreach (Control ctl in this.Controls) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>//获取并判断控件类型或控件名称 </span></span>
<span class="line"><span>if (ctl.GetType().Name.Equals(&quot;ListBox&quot;) || ctl.Name.Equals(&quot;listBox1&quot;)) </span></span>
<span class="line"><span>this.Controls.Remove(ctl); </span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>4.HashTable哈希表</strong><br> DictionaryEntry类需要引用System.Collections</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>//遍历完整哈希表中的键和值</span></span>
<span class="line"><span>foreach (DictionaryEntry item in hashTable) </span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>ary.Add(&quot;哈希键：&quot;+item.Key+&quot;,哈希值：&quot;+item.Value.ToString());</span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>此外还可以单独遍历哈希表中的键或值。 </span></span>
<span class="line"><span>//只遍历哈希表中的键 </span></span>
<span class="line"><span>foreach (string key in hashTable.Keys) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>ary.Add(&quot;哈希键：&quot; + key); </span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>//只遍历哈希表中的值 </span></span>
<span class="line"><span>foreach (string value in hashTable.Values) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>ary.Add(&quot;哈希值：&quot; + value); </span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>5.遍历DataSet和DataTable中的行和列</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>//遍历DataSet中的表</span></span>
<span class="line"><span>foreach (DataTable dt in dataSet.Tables) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>ary.Add(&quot;表名：&quot; + dt.TableName.ToString()); </span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>//遍历DataSet中默认第一个表中的行 </span></span>
<span class="line"><span>foreach (DataRow dr in dataSet.Tables[0].Rows) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>//获取行中某个字段（列）的数据 </span></span>
<span class="line"><span>ary.Add(dr[&quot;ID&quot;].ToString()); </span></span>
<span class="line"><span>} </span></span>
<span class="line"><span>//遍历DataSet中默认第一个表中的列 </span></span>
<span class="line"><span>foreach (DataColumn col in dataSet.Tables[0].Columns) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>ary.Add(&quot;列名：&quot;+col.ColumnName); </span></span>
<span class="line"><span>} </span></span>
<span class="line"><span></span></span>
<span class="line"><span>DataTable遍历行和列的方法和DataSet类似，只是将dataSet.Tables[0]换成具体某张表就可以了。 </span></span>
<span class="line"><span>另外还可以对DataTable表进行SQL查询，然后再对查询结果进行遍历。 </span></span>
<span class="line"><span>//遍历DataSet中表SELECT执行查询条件后的结果</span></span>
<span class="line"><span>foreach (DataRow dr in dataSet.Tables[0].Select(&quot; MONTH&gt;6 AND MONTH&lt;12 &quot;)) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>//获取行中某个字段（列）的数据 </span></span>
<span class="line"><span>ary.Add(dr[&quot;ID&quot;].ToString()); </span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>6.遍历DataGridView中的行</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>//遍历DataGridView中的行</span></span>
<span class="line"><span>foreach (DataGridViewRow dr in dataGridView1.Rows) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>//获取行中某个字段（列）的数据 </span></span>
<span class="line"><span>ary.Add(dr.Cells[&quot;ID&quot;].ToString()); </span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>7.遍历ListBOX和ComboBox中的item</strong><br> 一般foreach遍历只能遍历到ListBOX和ComboBox里item的名称,完整遍历需要在绑定item的时候添加的item数据是个二元属性自定义类的对象,将对象中一个属性的名称作为DisplayMember(item名)，另一个作为DisplayValue(item值)。这样在遍历的时候就可以把ListBOX和ComboBox中的item的名称和值全部获取出来了。<br><strong>8.<code>List&lt;T&gt;</code></strong><br><img src="`+l+`" alt="image.png" loading="lazy"></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>//for遍历</span></span>
<span class="line"><span>for (int i = 0; i &lt; list.Count; i++)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  //遍历时不需要类型转换</span></span>
<span class="line"><span> Console.WriteLine(list[i]);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>//foreach遍历</span></span>
<span class="line"><span>foreach (SE obj in list)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  //遍历时不需要类型转换</span></span>
<span class="line"><span>  Console.WriteLine(obj);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+p+'" alt="image.png" loading="lazy"><br><strong>9.<code>Dictionary&lt;K,V&gt;</code></strong><br><img src="'+r+`" alt="image.png" loading="lazy"></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code class="language-"><span class="line"><span>//遍历Values</span></span>
<span class="line"><span>foreach (SE se in list.Values)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  //遍历时不需要类型转换</span></span>
<span class="line"><span> Console.WriteLine(se);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//同时遍历</span></span>
<span class="line"><span>foreach (KeyValuePair&lt;string, SE&gt; en in list)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  Console.WriteLine(en.Key);</span></span>
<span class="line"><span> Console.WriteLine(en.Value.Name);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>//<code>KeyValuePair&lt;TKey,TValue&gt;</code>是一个泛型结构</p><p>来自 &lt;<a href="https://www.cnblogs.com/H2921306656/p/6675327.html" target="_blank" rel="noopener noreferrer">https://www.cnblogs.com/H2921306656/p/6675327.html</a>&gt;</p>`,20)])])}const u=n(t,[["render",d]]),v=JSON.parse('{"path":"/dotnet/webyingyong/webform/shujubiao/bianligeleishujujige.html","title":"遍历各类数据集合","lang":"zh-CN","frontmatter":{"title":"遍历各类数据集合","lang":"zh-CN","date":"2021-02-17T00:00:00.000Z","publish":true,"author":"azrng","isOriginal":true,"category":["dotNET"],"tag":["无"],"filename":"bianligeleishujujige","slug":"kgq4uu","docsId":"31541643","description":"1.枚举类型 //遍历枚举类型Sample的各个枚举名称 2.遍历ArrayList(Queue、Stack) 这里以string为例，当然ArrayList中的元素可以是任何数据类型，遍历时须确认ArrayList中的元素都是同一数据类型。 //遍历元素为string类型的队列 此外遍历Queue队列和Stack堆栈的方式与ArrayList基本相同...","head":[["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"遍历各类数据集合\\",\\"image\\":[\\"https://azrng.gitee.io/kbms/knowledge/common/1613566907278-5449d987-b64b-4095-8bea-56c7a251fcfe.png\\",\\"https://azrng.gitee.io/kbms/knowledge/common/1613566907280-898ead77-c8d3-46fc-8d13-1ce09385b0d5.png\\",\\"https://azrng.gitee.io/kbms/knowledge/common/1613566907274-e0ac8530-9345-4122-b289-d24249438092.png\\"],\\"datePublished\\":\\"2021-02-17T00:00:00.000Z\\",\\"dateModified\\":\\"2026-03-06T15:39:41.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"azrng\\"}]}"],["meta",{"property":"og:url","content":"https://azrng.gitee.io/kbms/knowledge/dotnet/webyingyong/webform/shujubiao/bianligeleishujujige.html"}],["meta",{"property":"og:site_name","content":"知识库"}],["meta",{"property":"og:title","content":"遍历各类数据集合"}],["meta",{"property":"og:description","content":"1.枚举类型 //遍历枚举类型Sample的各个枚举名称 2.遍历ArrayList(Queue、Stack) 这里以string为例，当然ArrayList中的元素可以是任何数据类型，遍历时须确认ArrayList中的元素都是同一数据类型。 //遍历元素为string类型的队列 此外遍历Queue队列和Stack堆栈的方式与ArrayList基本相同..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://azrng.gitee.io/kbms/knowledge/common/1613566907278-5449d987-b64b-4095-8bea-56c7a251fcfe.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2026-03-06T15:39:41.000Z"}],["meta",{"property":"article:author","content":"azrng"}],["meta",{"property":"article:tag","content":"无"}],["meta",{"property":"article:published_time","content":"2021-02-17T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2026-03-06T15:39:41.000Z"}]]},"git":{"createdTime":1772811581000,"updatedTime":1772811581000,"contributors":[{"name":"azrng","username":"azrng","email":"itzhangyunpeng@163.com","commits":1,"url":"https://github.com/azrng"}]},"readingTime":{"minutes":2.87,"words":861},"filePathRelative":"dotnet/webyingyong/webform/shujubiao/bianligeleishujujige.md","excerpt":"<p><strong>1.枚举类型</strong><br>\\n//遍历枚举类型Sample的各个枚举名称</p>\\n<div class=\\"language- line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code class=\\"language-\\"><span class=\\"line\\"><span>foreach (string sp in Enum.GetNames(typeof(Sample))) </span></span>\\n<span class=\\"line\\"><span>{ </span></span>\\n<span class=\\"line\\"><span>ary.Add(sp); </span></span>\\n<span class=\\"line\\"><span>} </span></span>\\n<span class=\\"line\\"><span>//遍历枚举类型Sample的各个枚举值 </span></span>\\n<span class=\\"line\\"><span>foreach (string sp in Enum.GetValues(typeof(Sample))) </span></span>\\n<span class=\\"line\\"><span>{ </span></span>\\n<span class=\\"line\\"><span>ary.Add(sp); </span></span>\\n<span class=\\"line\\"><span>}</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{u as comp,v as data};
