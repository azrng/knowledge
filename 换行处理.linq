<Query Kind="Program" />

void Main()
{
	var path = @"D:\Gitee\kbms-origin\src\soft\devTools\VisualStudio\readme.md";
	var content = File.ReadAllText(path);
	content.Replace("<br />", Environment.NewLine).Dump(); ;
}

