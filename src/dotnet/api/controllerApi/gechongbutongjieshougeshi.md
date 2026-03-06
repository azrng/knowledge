---
title: 各种不同请求格式
lang: zh-CN
date: 2022-02-03
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: gechongbutongjieshougeshi
slug: ykz5i0
docsId: '30621902'
---

## Dictionary
RawData(Dictionary<string, string> data)

### postman请求格式
raw
```csharp
{
    "keys": "121",
    "aa": "555"
}
```

### NetCore代码
```csharp
var dic = new Dictionary<string, string> {
    { "aaa","aa"},
    { "bbbb","bb"}
};
var httpContent = new StringContent(JsonConvert.SerializeObject(dic), Encoding.UTF8, "application/json");
var response = await httpClient.PostAsync("http://localhost:5000/weatherforecast/RawData", httpContent);
```

## 常用基本数据类型
FormData([FromForm] string aaa, [FromForm] string bbbb)

### postman请求格式
body=》form-data

###  NetCore代码
```csharp
var dic = new Dictionary<string, string> {
    { "aaa","aa"},
    { "bbbb","bb"}
};
var httpContent = new FormUrlEncodedContent(dic);
var response = await httpClient.PostAsync("http://localhost:5000/weatherforecast/FormData", httpContent);
```

## 数组和泛型
ArrayData(string[] data)

### postman请求格式
raw=》json

###  NetCore代码
```csharp
string[] strarr = new string[] { "44", "55", "66" };
var httpContent = new StringContent(JsonConvert.SerializeObject(strarr), Encoding.UTF8, "application/json");
var response = await httpClient.PostAsync("http://localhost:5000/weatherforecast/ArrayData", httpContent);
```

## 文件

### IFormFile：上传单个文件

```csharp
public class AddCoursePhone
{
    public string CourseId { get; set; }

    public decimal Price { get; set; }

    public IFormFile formFile { get; set; }
}

或者
[HttpPost]
public string UploadFile (IFormFile formFile)
```

接口用post方法，参数使用上面的对象，标识为[FromForm]，并且模型绑定的名称一定要和提交的表单值的name保持一致

### IFormCollection:上传多个文件

```csharp
public class AddCoursePhone
{
    public string CourseId { get; set; }

    public IFormCollection formFile { get; set; }
}
```

接口用post方法，参数使用上面的对象，标识为[FromForm]，并且模型绑定的名称一定要和提交的表单值的name保持一致

### 操作上传的内容

如果你想保存上传的文件，或者是直接读取上传的文件信息，IFormFile为我们提供两种可以操作上传文件内容信息的方式

- 一种是将上传文件的Stream信息Copy到一个新的Stream中
- 另一种是直接通过OpenReadStream的方式直接获取上传文件的Stream信息

```csharp
[HttpPost]
public async Task<string> UploadFile (IFormFile formFile)
{
    if (formFile.Length > 0)
    {
        //1.使用CopyToAsync的方式
        using var stream = System.IO.File.Create("test.txt");
        await formFile.CopyToAsync(stream);

        //2.使用OpenReadStream的方式直接得到上传文件的Stream
        StreamReader streamReader = new StreamReader(formFile.OpenReadStream());
        string content = streamReader.ReadToEnd();
    }
    return $"{formFile.FileName}--{formFile.Length}--{formFile.ContentDisposition}--{formFile.ContentType}";
}
```

### 上传保存到本地目录

将上传的文件保存到服务器指定的目录

```csharp
public void UploadFile(List<IFormFile> files, string subDirectory)
{
    subDirectory ??= string.Empty;
    var target = Path.Combine(_webHostEnvironment.ContentRootPath, subDirectory);
    Directory.CreateDirectory(target);

    files.ForEach(async file =>
    {
        if (file.Length <= 0) return;
        var filePath = Path.Combine(target, file.FileName);
        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);
    });
}
```

控制器代码

```csharp
[HttpPost("Upload")]
public IActionResult Upload([Required] List<IFormFile> formFiles, [Required] string subDirectory)
{
    _fileService.UploadFile(formFiles, subDirectory);
    return Ok(new { formFiles.Count, Size = _fileService.SizeConverter(formFiles.Sum(f => f.Length)) });
}
```

### 总结

- 为了统一处理方便，不管是上传的是单个文件还是多个文件，都会被包装成`ICollection<IFormFile>`集合类型
- `ICollection<IFormFile>`集合里的值就是来自于Request.Form.Files
- 可绑定的类型`IFormFile`、`List<IFormFile>`、`IFormFileCollection`等都是由`ICollection<IFormFile>`里的数据初始化而来
- 如果模型参数类型是IFormFile实例非集合类型，那么会从`ICollection<IFormFile>`集合中获取第一个
- 模型绑定的参数名称要和上传的FileName保持一致，否则无法进行模型绑定

### 文件安全事项

- 文件的大小进行限制
- 文件类型进行限制
- 文件名称进行替换
- 使用专属存储位置

```csharp
[HttpPost("/files")]
public async Task<IActionResult> Files(List<IFormFile> files)
{
	//限制上传内容的大小
	var size = files.Sum(f => f.Length);
	if (size > 1024 * 1024 * 10)
		return Ok(new { count = 0, size });

	foreach (var formFile in files)
	{
		//扩展名进行限制
		var extension = Path.GetExtension(formFile.FileName);
		//不使用文件原始的名称存储 并且存储到专属的位置
		var filePath = $"{Directory.GetCurrentDirectory()}/uploadfiles/{DateTime.Now:yyyyMMddHHmmss}{extension}";
		if (formFile.Length > 0)
		{
			var extesion = Path.GetExtension(formFile.FileName);
			var stream = new FileStream(path: filePath, mode: FileMode.Create);
			await formFile.CopyToAsync(stream);
		}
	}
	return Ok(new { count = files.Count, size });
}
```

## 资料

[https://mp.weixin.qq.com/s/QoDNCW_73-B0CuR7zxN9aw](https://mp.weixin.qq.com/s/QoDNCW_73-B0CuR7zxN9aw) | 使用Web API上传和下载多个文件 「附代码」
[https://mp.weixin.qq.com/s/2x2QhAYX7-jMHBAxkmRirA](https://mp.weixin.qq.com/s/2x2QhAYX7-jMHBAxkmRirA)
ASP.NET Core文件上传IFormFile于Request.Body的羁绊：[https://mp.weixin.qq.com/s/bgDd40aG-FWE008a8saNAg](https://mp.weixin.qq.com/s/bgDd40aG-FWE008a8saNAg)
[https://mp.weixin.qq.com/s/6xs0v12BdL2y-j-YWWXQLw](https://mp.weixin.qq.com/s/6xs0v12BdL2y-j-YWWXQLw) | 使用 C## 下载文件的十八般武艺
