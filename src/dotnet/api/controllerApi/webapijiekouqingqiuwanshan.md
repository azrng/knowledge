---
title: WebApi操作示例
lang: zh-CN
date: 2023-08-04
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: webapijiekouqingqiuwanshan
slug: akgbrx
docsId: '92656475'
---

## 目的
通过一个简单的项目，编写一些WebApi操作示例。
http状态码大全：[https://www.php.cn/course/1020.html](https://www.php.cn/course/1020.html)

> 本文示例代码环境：vs2022、net6


## 准备
新创建了一个.NetWebAPI程序，安装组件
```csharp
<ItemGroup>
    <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="11.0.0" />
    <PackageReference Include="Microsoft.AspNetCore.Mvc.NewtonsoftJson" Version="6.0.1" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.3.1" />
    <PackageReference Include="Swashbuckle.AspNetCore.Newtonsoft" Version="6.3.1" />
</ItemGroup>
```
ConfigureServices配置NewtonsoftJson以及Automapper和操作数据库代码(为了省事，删除了一些不影响当前效果的代码)
```csharp
public void ConfigureServices(IServiceCollection services)
{
	services.AddControllers().AddNewtonsoftJson();

    services.AddEndpointsApiExplorer();
	services.AddSwaggerGen(c =>
	{
		c.SwaggerDoc("v1", new OpenApiInfo { Title = "MyWebApi", Version = "v1" });
	});
	
	//注入AutoMapper
	services.AddAutoMapper(Assembly.GetExecutingAssembly().DefinedTypes.Where(t => typeof(Profile).GetTypeInfo()
	.IsAssignableFrom(t.AsType())).Select(t => t.AsType()).ToArray());
}
```
> 注意：在Net core3.0以后，微软移除了Newtonsoft.Json，而使用了System.Text.Json，所以依赖于Newtonsoft.Json的组件将不可用，需要安装 Microsoft.AspNetCore.Mvc.NewtonsoftJson 包

因为仅仅作为演示，所以我只是新增一个控制器，里面包含了get、post、put、patch、delete几种类型的接口。这里先不贴代码，一点一点看。通过一个用户的添加、修改、删除作为一个演示的流程。
> 记得配置允许跨域请求，要不js请求会因为跨域问题而报错。详情看[此处](https://mp.weixin.qq.com/s/5MEVtDhHmdmjXe2x-yr6dg)

数据来源就是控制器里面的一个静态变量，格式如下
```csharp
public class UserDto
{
    public long UserId { get; set; }

    public string Name { get; set; }

    public string Sex { get; set; }
}
```
静态变量如下
```csharp
private static readonly List<UserDto> _userDtoList = Enumerable.Range(0, 100)
        .Select(t => new UserDto
        {
            Name = "张三" + t,
            Sex = "男",
            UserId = 6974150586715897857 + t
        }).ToList();
```
后端请求的方法我使用的是HttpClient，并且做成了一个公共类，部分需要用到的如下
```csharp
public class HttpClientHelper: IHttpHelper
{
    private readonly System.Net.Http.HttpClient _client;

    /// <summary>
    /// 构造函数
    /// </summary>
    /// <param name="httpClientFactory"></param>
    public HttpClientHelper(IHttpClientFactory httpClientFactory)
    {
        _client = httpClientFactory.CreateClient();
    }

    private void VerifyParam(string url, string jwtToken, IDictionary<string, string> headers)
    {
        _client.DefaultRequestHeaders.Clear();
        if (string.IsNullOrWhiteSpace(url))
        {
            throw new ArgumentNullException("url不能为null");
        }
        if (!string.IsNullOrWhiteSpace(jwtToken))
        {
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer {jwtToken}");
        }
        if (headers?.Count > 0)
        {
            foreach (var (key, value) in headers)
            {
                _client.DefaultRequestHeaders.Add(key, value);
            }
        }
    }

    private static async Task<T> ConvertResponseResult<T>(HttpResponseMessage httpResponse)
    {
        //确保成功完成，不是成功就返回具体错误信息
        httpResponse.EnsureSuccessStatusCode();
        var resStr = await httpResponse.Content.ReadAsStringAsync();
        if (typeof(T) == typeof(string))
            return (T)Convert.ChangeType(resStr, typeof(string));

        return JsonConvert.DeserializeObject<T>(resStr);
    }
}
```

## 操作
> 请求头传递token只是为了演示请求头传递参数的写法，token为伪值


### GET
从web服务检索数据。传递参数的本质是url字符串拼接，Request-Head头部传递，Request-Body中不能传递(严格点说不建议，因为我使用Apifox等工具可以在body中传值，swagger会提示 Request with GET/HEAD method cannot have body)

#### Query格式
编写用户id查询用户信息接口
```csharp
[HttpGet("user/details")]
public UserDto GetUserDetails(long userId)
{
    if (!_userDtoList.Any(t => t.UserId == userId))
        throw new ParameterException("未找到用户标识");
    return _userDtoList.Find(t => t.UserId == userId);
}
```

##### 前端请求
```csharp
$(function () {
    $.ajax({
        type: "get",
        url: "http://localhost:5000/api/HttpSample/user/details?userId=6974150586715897857",
        headers: { "Authorization": "Bearer 123456" },
        contentType: "application/json",
        success: function (data, status) {
            if (status == "success") {
                console.log(JSON.stringify(data));
            }
        }
    });

    var postdata = { userId: "6974150586715897857" };
    $.ajax({
        type: "get",
        headers:{"Authorization":"Bearer 123456"},
        url: "http://localhost:5000/api/HttpSample/user/details",
        data: postdata,
        success: function (data, status) { 
            if (status == "success") {
                console.log(JSON.stringify(data));
            }  
        }
    });
});
```

##### 后端请求
```csharp
var token = "123456";//此处token是伪值
var result = await _httpHelper.GetAsync<ResultModel<UserDto>>("http://localhost:5000/api/HttpSample/user/details?userId=6974150586715897857", token);
```
这里的_httpHelper是注入的IHttpHelper(下面其他的方法一样)，对应的GetAsync为
```csharp
public async Task<T> GetAsync<T>(string url, string jwtToken = "", IDictionary<string, string> headers = null)
{
    VerifyParam(url, jwtToken, headers);

    var response = await _client.GetAsync(url).ConfigureAwait(false);
    return await ConvertResponseResult<T>(response).ConfigureAwait(false);
}
```

##### 接口工具请求
url：[http://localhost:5000/api/HttpSample/user/details?userId=6974150586715897857](http://localhost:5000/api/HttpSample/user/details?userId=6974150586715897857)
并且再请求头增加：Authorization，值为Bearer xxxx
返回结果如下
![image.png](/common/1662823186138-84cf332f-1397-4d06-b863-0d52b240266b.png)

### POST
在web服务上创建新的数据项。约定用于向服务端提交数据操作，请求时候参数放在参数FromBody传递

#### Json格式
演示添加用户操作
请求类
```csharp
public class UserDto
{
    public long UserId { get; set; }

    public string Name { get; set; }

    public string Sex { get; set; }
}
```
接口代码示例
```csharp
[HttpPost("user/add")]
public bool Add([FromBody] UserDto request)
{
    if (_userDtoList.Any(t => t.UserId == request.UserId))
        throw new ParameterException("用户标识已经存在");
    Console.WriteLine(DateTime.Now + "   " + HttpContext.Request.Headers["Authorization"].FirstOrDefault());
    _userDtoList.Add(request);
    return true;
}
```

##### 前端请求
```csharp
$(function () {
    var param = { userId: "8974150586715897867", name: "老八", sex: "女" };
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json",
        headers: { "Authorization": "Bearer 123456" },
        url: "http://localhost:5000/api/HttpSample/user/add",
        data: JSON.stringify(param),
        success: function (data) {
            if (status == "success") {
                console.log(JSON.stringify(data));
            }
        }
    });
});
```

##### 后端请求
```csharp
var token = "123456";//此处token是伪值
var url = "http://localhost:5000/api/HttpSample/user/add";

var usedto = new UserDto
{
    UserId = 123456,
    Name = "李四",
    Sex = "女"
};

var result = await _httpHelper.PostAsync<ResultModel<bool>>(url, usedto, token);


public async Task<T> PostAsync<T>(string url, object data, string jwtToken = "", IDictionary<string, string> headers = null)
{
    VerifyParam(url, jwtToken, headers);
    var jsonData = data is string ? data.ToString() : JsonConvert.SerializeObject(data);
    using var content = new StringContent(jsonData ?? string.Empty, Encoding.UTF8, "application/json");
    var response = await _client.PostAsync(url, content).ConfigureAwait(false);
    return await ConvertResponseResult<T>(response).ConfigureAwait(false);
}
```

##### 接口工具请求
传递参数格式为json格式，请求头部默认添加："Content-Type", "application/json"
![image.png](/common/1662866734791-b11bbdd0-b027-4909-a853-e49e8f3a1ea8.png)

#### x-www-form-unlencoded格式
更新用户姓名
```csharp
[HttpPost("user/updatename")]
public bool UpdateName([FromForm] long userId, [FromForm] string name)
{
    var entity = _userDtoList.Find(t => t.UserId == userId);
    if (entity is null)
        throw new ParameterException("用户标识不存在");

    entity.Name = name;

    return true;
}
```

##### 前端请求
```csharp
$(function () {
    var postdata = { userId: "6974150586715897857", name: "赵六" };
    $.ajax({
        type: "post",
        headers: { "Authorization": "Bearer 123456" },
        url: "http://localhost:5000/api/HttpSample/user/updatename",
        data: postdata,
        success: function (data, status) {
            if (status == "success") {
                console.log(JSON.stringify(data));
            }
        }
    });
});
```

##### 后端请求
```csharp
var token = "123456";//此处token是伪值
var url = "http://localhost:5000/api/HttpSample/user/updatename";
var dic = new Dictionary<string, string>
{
    { "userId","6974150586715897857"},
    { "name","王五"}
};
var result = await _httpHelper.PostFormDataAsync<ResultModel<bool>>(url, dic, token);


public async Task<T> PostFormDataAsync<T>(string url, Dictionary<string, string> data, string jwtToken = "", IDictionary<string, string> headers = null)
{
    VerifyParam(url, jwtToken, headers);
    var httpContent = new FormUrlEncodedContent(data);
    var response = await _client.PostAsync(url, httpContent).ConfigureAwait(false);
    return await ConvertResponseResult<T>(response).ConfigureAwait(false);
}
```

##### 接口工具请求
选择post请求，参数在Body，然后选择x-www-form-unlencoded格式。
![image.png](/common/1662825041106-57360561-34bd-4633-877f-7304a4b5fe5d.png)

#### Form-data格式
模拟上传用户头像操作
```csharp
[HttpPost("user/uploadImg")]
public string Upload([FromForm] IFormFile img, [FromForm] long userId)
{
    if (img is null)
        throw new ParameterException("用户头像不能为null");

    Console.WriteLine(HttpContext.Request.Headers["Authorization"].FirstOrDefault());
    var entity = _userDtoList.Find(t => t.UserId == userId);
    if (entity is null)
        throw new ParameterException("用户标识不存在");

    return img.FileName;
}
```
> 注意：当你上传大于30000000字节长度的文件时候，需要修改上传文件的默认限制


##### 前端请求
```csharp
$(function () {
    $("#tijiao").click(function () {
        //logoimg是<input type="file" id="logoimg"" />
        var files = $("#logoimg").prop('files'); //获取到文件列表

        var formData = new FormData();
        formData.append("userId", "6974150586715897857");
        formData.append("img", files[0], "1122.jpg");//图片文件流

        console.log(formData);
        $.ajax({
            type: 'post',
            url: "http://localhost:5000/api/HttpSample/user/uploadImg",
            headers: {
                "Authorization": "Bearer 123456"
            },
            mimeType: "multipart/form-data",
            processData: false,
            contentType: false,
            data: formData,
            success: function (data) {
                //后端Httpclient请求成功后返回过来的结果
                console.log(data);
            }
        });
    });
});
```

##### 后端请求
```csharp
var url = "http://localhost:5000/api/HttpSample/user/uploadImg";

var formData = new MultipartFormDataContent();

var bytes = System.IO.File.ReadAllBytes("D:\\Downloads\\11111.jpg");
var byteContent = new ByteArrayContent(bytes);
byteContent.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("form-data")
{
    Name = "img",
    FileName = "111.jpg"
};
formData.Add(byteContent);

// 写法一
formData.Add(new StringContent("6974150586715897857"), "userId");

// 写法二
var byteContent2 = new ByteArrayContent(Encoding.UTF8.GetBytes("天气"));
byteContent2.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("form-data")
{
    Name = "name",
};
formData.Add(byteContent2);

var headerDic = new Dictionary<string, string>
{
	{ "Authorization","Bearer 123456"},
};

var result = await _httpHelper.PostFormDataAsync<ResultModel<string>>(url, formData, headerDic);


public async Task<T> PostFormDataAsync<T>(string url, MultipartFormDataContent data, IDictionary<string, string> headers = null)
{
    VerifyParam(url, "", headers);
    var result = await _client.PostAsync(url, data).ConfigureAwait(false);
    return await ConvertResponseResult<T>(result);
}
```

##### 接口工具请求
选择Body=>form-data
![image.png](/common/1662867846712-07cdbdf4-52c9-42e5-97dc-4353ceb05eaa.png)

##### 设置上传大小

Form请求大小设置

```c#
services.Configure<FormOptions>(x =>
{
    x.ValueLengthLimit = int.MaxValue;
    // 设置上传大小限制
    x.MultipartBodyLengthLimit = int.MaxValue;
    x.MemoryBufferThreshold = int.MaxValue;
});
```

### PUT
更新web服务上的数据项。

#### Json格式
更新用户信息
```csharp
[HttpPut("user/update")]
public bool Update(UserDto userDto)
{
    if (userDto is null)
        throw new ParameterException("参数不能为空");

        Console.WriteLine(DateTime.Now + "    " + HttpContext.Request.Headers["Authorization"].FirstOrDefault());
        var currUser = _userDtoList.Find(t => t.UserId == userDto.UserId);
    if (currUser is null)
        throw new ParameterException("用户标识不存在");

    currUser.Name = userDto.Name;
    currUser.Sex = userDto.Sex;
    return true;
}
```

##### 前端请求
```csharp
$(function () {
    var param = { userId: "6974150586715897859", name: "老八", sex: "女" };
    $.ajax({
        type: "put",
        dataType: 'json',
        contentType: "application/json",
        headers: { "Authorization": "Bearer 123456" },
        url: "http://localhost:5000/api/HttpSample/user/update",
        data: JSON.stringify(param),
        success: function (data, status) {
            if (status == "success") {
                console.log(JSON.stringify(data));
            }
        }
    });
});
```

##### 后端请求
```csharp
var token = "123456";//此处token是伪值

var usedto = new UserDto
{
    UserId = 6974150586715897859,
    Name = "老八",
    Sex = "女"
};

var url = "http://localhost:5000/api/HttpSample/user/update";

var result = await _httpHelper.PutAsync<ResultModel<bool>>(url, usedto, token);
return JsonConvert.SerializeObject(result);


public async Task<T> PutAsync<T>(string url, object data, string jwtToken = "", IDictionary<string, string> headers = null)
{
    VerifyParam(url, jwtToken, headers);
    var jsonData = data is string ? data.ToString() : JsonConvert.SerializeObject(data);
    using var content = new StringContent(jsonData ?? string.Empty, Encoding.UTF8, "application/json");
    var response = await _client.PutAsync(url, content).ConfigureAwait(false);
    return await ConvertResponseResult<T>(response).ConfigureAwait(false);
}
```

##### 接口工具请求
URL：[http://localhost:5000/api/HttpSample/user/update](http://localhost:5000/api/HttpSample/user/update)
参数传递：Body=>json
![image.png](/common/1662887452094-03bbd8da-a4f8-49fe-97ba-66ab4e3729a7.png)

### DELETE
删除web服务上的数据项。

#### Query格式
删除用户信息
```csharp
[HttpDelete("user")]
public bool Delete(long userId)
{
    var entity = _userDtoList.Find(t => t.UserId == userId);
    if (entity is null)
        throw new ParameterException("用户标识不存在");

    Console.WriteLine(DateTime.Now + "    " + HttpContext.Request.Headers["Authorization"].FirstOrDefault());
    _userDtoList.Remove(entity);
    return true;
}
```

##### 前端请求
```csharp
$(function () {
    $.ajax({
        type: "DELETE",
        url: "http://localhost:5000/api/HttpSample/user?userId=6974150586715897861",
        headers: { "Authorization": "Bearer 123456" },
        success: function (data, status) {
            if (status == "success") {
                console.log(JSON.stringify(data));
            }
        }
    });
});
```

##### 后端请求
```csharp
var token = "123456";//此处token是伪值
var url = "http://localhost:5000/api/HttpSample/user?userId=6974150586715897862";

var result = await _httpHelper.DeleteAsync<ResultModel<bool>>(url, token);

public async Task<T> DeleteAsync<T>(string url, string jwtToken = "", IDictionary<string, string> headers = null)
{
    VerifyParam(url, jwtToken, headers);
    var response = await _client.DeleteAsync(url).ConfigureAwait(false);
    return await ConvertResponseResult<T>(response).ConfigureAwait(false);
}
```

##### 接口工具请求
URL：[http://localhost:5000/api/HttpSample/user?userId=6974150586715897859](http://localhost:5000/api/HttpSample/user?userId=6974150586715897859)
![image.png](/common/1662887879216-7df10bec-f42e-40fa-9e8d-c6802bca5405.png)

### Patch
通过描述有关如何修改项的一组说明，更新web服务上的数据项。

请求格式如下：
[{"op" : "replace", "path" : "/PassWord", "value" : "222222"}]
> op属性指示操作的类型，path属性指示要更新的元素，value属性提供新值。

> add：添加属性或数组元素。 对于现有属性：设置值。
> remove：删除属性或数组元素。
> replace：替换操作


为了支持该请求方式，需要安装nuget包Microsoft.AspNetCore.Mvc.NewtonsoftJson。
参考文档：[https://docs.microsoft.com/zh-cn/aspnet/core/web-api/jsonpatch?view=aspnetcore-6.0](https://docs.microsoft.com/zh-cn/aspnet/core/web-api/jsonpatch?view=aspnetcore-6.0)

#### Json格式
在此用于更新数据
```csharp
[HttpPatch("user/update2/{userId}")]
public UserDto Update2([FromRoute] long userId, JsonPatchDocument<UserDto> jsonPatch, [FromServices] IMapper mapper)
{
    var entity = _userDtoList.Find(t => t.UserId == userId);
    if (entity is null)
        throw new ParameterException("用户标识无效");

    var dto = mapper.Map<UserDto>(entity);
    jsonPatch.ApplyTo(dto, ModelState);

    var user = _userDtoList.Find(t => t.UserId == userId);
    mapper.Map(dto, user);
    return user;
}
```

##### 前端请求
演示根据用户id去更新用户的姓名
```csharp
$(function () {
    var par = [{ "op": "replace", "path": "/name", "value": "老六" }];
    $.ajax({
        type: "Patch",
        url: "http://localhost:5000/api/HttpSample/user/update2/6974150586715897857",
        headers: { "Authorization": "Bearer 123456" },
        contentType: "application/json",
        data: JSON.stringify(par),
        success: function (result) {
            console.log(result);
        }
    });
});
```

##### 后端请求
```csharp
var token = "123456";//此处token是伪值
var url = "http://localhost:5000/api/HttpSample/user/update2/6974150586715897859";
var content = "[{\"op\":\"replace\",\"path\":\"/name\",\"value\":\"小七七\"}]";
var result = await _httpHelper.PatchAsync<ResultModel<UserDto>>(url, content, token);

public async Task<T> PatchAsync<T>(string url, object data, string jwtToken = "", IDictionary<string, string> headers = null)
{
    VerifyParam(url, jwtToken, headers);
    var jsonData = data is string ? data.ToString() : JsonConvert.SerializeObject(data);
    using var content = new StringContent(jsonData ?? string.Empty, Encoding.UTF8, "application/json");
    var response = await _client.PatchAsync(url, content).ConfigureAwait(false);
    return await ConvertResponseResult<T>(response).ConfigureAwait(false);
}
```

##### 接口工具请求
参数传递：Body=>json
![image.png](/common/1662889332097-f3e058bb-b5f6-40e6-8426-e05734331bc0.png)

## 流式响应

参考资料：[https://www.cnblogs.com/cplemom/p/17269789.htmlopen in new window](https://www.cnblogs.com/cplemom/p/17269789.html)



当客户端返回流的时候，客户端可以实时捕获到返回的信息，并不需要等全部Response结束了再处理。
[下面就用ASP.NETopen in new window](http://xn--asp-y28dw06dvh8amc2c.net/) Core Web API作为服务端实现流式响应。

### 返回文本内容

服务端

```csharp
[HttpPost("text")]
public async Task Post()
{
    string filePath = "文档.txt";
    Response.ContentType = "application/octet-stream";
    var reader = new StreamReader(filePath);
    var buffer = new Memory<char>(new char[5]);
    int writeLength = 0;
    //每次读取5个字符写入到流中
    while ((writeLength = await reader.ReadBlockAsync(buffer)) > 0)
    {
        if (writeLength < buffer.Length)
        {
        	buffer = buffer[..writeLength];
        }
        await Response.WriteAsync(buffer.ToString());
        await Task.Delay(100);
    }
}
```

客户端HttpClient

```csharp
public async void GetText()
{
    var url = "http://localhost:5000/config/text";
    var client = new HttpClient();
    using HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, url);
    var response = await client.SendAsync(httpRequestMessage, HttpCompletionOption.ResponseHeadersRead);
    await using var stream = await response.Content.ReadAsStreamAsync();
    var bytes = new byte[20];
    int writeLength = 0;
    while ((writeLength = stream.Read(bytes, 0, bytes.Length)) > 0)
    {
    	Console.Write(Encoding.UTF8.GetString(bytes, 0, writeLength));
    }
    Console.WriteLine();
    Console.WriteLine("END");
}
```

HttpCompletionOption枚举有两个值，默认情况下使用的是ResponseContentRead

- ResponseContentRead：等到整个响应完成才完成操作
- ResponseHeadersRead：一旦获取到响应头即完成操作，不用等到整个内容响应

JS

```csharp
<script>
    var div = document.getElementById("content")
    var url = "http://localhost:5000/config/text"
    var client = new XMLHttpRequest()
    client.open("POST", url)
    client.onprogress = function (progressEvent) {
        div.innerText = progressEvent.target.responseText
    }
    client.onloadend = function (progressEvent) {
        div.append("END")
    }
    client.send()

</script>
```

### 返回图片

服务端

```csharp
[HttpGet("img")]
public async Task Stream()
{
    string filePath = "pixelcity.png";
    new FileExtensionContentTypeProvider().TryGetContentType(filePath, out string contentType);
    Response.ContentType = contentType ?? "application/octet-stream";
    var fileStream = System.IO.File.OpenRead(filePath);
    var bytes = new byte[1024];
    int writeLength = 0;
    while ((writeLength = fileStream.Read(bytes, 0, bytes.Length)) > 0)
    {
        await Response.Body.WriteAsync(bytes, 0, writeLength);
        await Task.Delay(100);
    }
}
```

