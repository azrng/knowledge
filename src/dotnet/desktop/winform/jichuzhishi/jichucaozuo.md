---
title: 基础操作
lang: zh-CN
date: 2023-07-05
publish: true
author: azrng
isOriginal: true
category:
  - dotNET
tag:
  - 无
filename: jichucaozuo
slug: tq70k72dow4htxuh
docsId: '122951452'
---

## Main函数

### 入参出参
在Main方法内接收参数
```csharp
[STAThread]
static void Main(string[] args)
{
    MessageBox.Show($"Main方法中收到的参数：{string.Join(',', args)}");
    ApplicationConfiguration.Initialize();
    Application.Run(new Main());
}
```
用Enviroment.CommandLine属性和GetCommandLineArgs方法来接收，属性会用空格来区分多个参数，方法返回值就是一个string[]，与Main中args不一样的是，这里多一个应用运行所在的路径
```csharp
var args = Environment.GetCommandLineArgs();
if (args.Length > 1)
{
    label1.Text = $"主程序：{args[0]},\r\n\r\n参数：{string.Join(',', args[1..])}";
}  
```

## 窗体

### 无边框窗体
设置主窗体的FormBorderStyle为none，然后就得到了无边框的窗体，然后在修改Mouse_Down事件，去实现窗体随意拖动
```csharp
private void Index_MouseDown(object sender, MouseEventArgs e)
{
    ReleaseCapture();
    SendMessage(this.Handle, WM_SYSCOMMAND, SC_MOVE + HTCAPTION, 0);
}

[DllImport("user32.dll")]
public static extern bool ReleaseCapture();
[DllImport("user32.dll")]
public static extern bool SendMessage(IntPtr hwnd, int wMsg, int wParam, int lParam);
public const int WM_SYSCOMMAND = 0x0112;
public const int SC_MOVE = 0xF010;
public const int HTCAPTION = 0x0002;
```

## 布局
**容器控件**
有一组控件叫容器控件，对布局特别有作用，它们分别是：**TableLayoutPanel**：表格布局面板，每个单元格都可以用来作为其他控件的载体，通过设置行或列的是一个以行和列的大小型来确定每个单元格所占的大小
**FlowLayoutPanel**：流式布局面板，按照放上去的控件的顺序来依次呈现控件，可以通过修改FlowDirection来改烃排布的方向
**Panel**：普通的面板
**SplitContainer**：分隔面板，可以上下，或左右来布局这两个面板
**TabControl**：是半隐藏式的多面板容器控件，可以通过切换tab来显示对应的面板
**GroupBox**：分组面板，给面板加了一个标题
它们是作为其他控件的载体，用来形成一组，或一个区域的母板。

**布局属性**
**Anchor**：锚定属性，设置一个控件边缘锚定状态，默认为左上锚定
**Dock**：依靠属性，设置控件本身靠父容器控件的那个边缘依靠

**Pading**：控件本身内的控件距离边缘的距离

**Migrain**：距离周边控件的距离

**AutoSize**：是否是自动适应大于
**AutoSizeMode**：当AutoSize=true时有效，是控件的自动适应大小的模式，有只增的，有又增又减的

## 控件

### 文本框

- Cursor：Cursors.WaitCursor、Cursors.IBeam
- 


#### 输入校验
编写KeyPass触发事件
```csharp
private void txtC_KeyPress(object sender, KeyPressEventArgs e)
{
    txtKeyPress(sender, e);
}

private void txtKeyPress(object sender, KeyPressEventArgs e)
{
    if (e.KeyChar == 0x20) e.KeyChar = (char)0;  //禁止空格键  
    if ((e.KeyChar == 0x2D) && (((TextBox)sender).Text.Length == 0)) return;   //处理负数  
    if (e.KeyChar > 0x20)
    {
        try
        {
            double.Parse(((TextBox)sender).Text + e.KeyChar.ToString());
        }
        catch
        {
            e.KeyChar = (char)0;   //处理非法字符  
        }
    }
}

public bool IsValid()
{
    if (string.IsNullOrEmpty(this.txtA.Text.Trim()) || string.IsNullOrEmpty(this.txtB.Text.Trim()) || string.IsNullOrEmpty(this.txtC.Text.Trim()))
    {
        MessageBox.Show("直线方程参数不能为空");
        return false;
    }
    return true;
}
```

### RadioButton

#### 选择判断事件
radioButton按钮中都添加同一个click事件,然后根据下面的代码判断具体点击了哪一个，在执行其逻辑
```csharp
/// <summary>
/// radiobutton按钮事件
/// </summary>
/// <param name="sender"></param>
/// <param name="e"></param>
private void radioButtonMirrorLightClick(object sender, EventArgs e)
{
    //把object类型，赋值为当前按下的控件
    RadioButton radioButtonClick = sender as RadioButton;
    if (radioButtonClick.Checked)
    {
        switch (radioButtonClick.Name)
        {
            case "radioButtonMirrorLight1":
                ChangeRadiobutton(0);
                break;

            case "radioButtonMirrorLight2":
                ChangeRadiobutton(1);
                break;
            case "radioButtonMirrorLight3":
                ChangeRadiobutton(2);
                break;

            case "radioButtonMirrorLight4":
                ChangeRadiobutton(3);
                break;

            default:
                break;
        }
    }
}
```

### DateTimePicker

#### 自定义格式
```csharp
dtpBirthday.Format = DateTimePickerFormat.Custom;
dtpBirthday.CustomFormat = "yyyy-MM-dd";
```

### ComboBox

#### 属性

- DropDownStyle：DropDownList(禁止输入，只能下拉选择)


#### 添加默认项
```csharp
cmbCreatePatientInfo.DataSource = defaultDict.GetPatientInfoList();
// 增加请选择下拉框
patientInfo.Insert(0, new GetNameCodeInfoDto("请选择", "0"));
cmbCreatePatientInfo.DisplayMember = "Name";
cmbCreatePatientInfo.ValueMember = "Code";
```

#### 事件
SelectedIndexChanged
选择项索引更改事件


### ProgressBar
有人反映winform的进度条设置BackColor和ForeColor属性，不会产生效果，进度条颜色不会变。通过重写ProgressBar的OnePaint方法来改变它的颜色（前景色和背景色）。在此我们有如下代码
```csharp
using System.Windows.Forms;
using System.Drawing;

namespace 界面美化
{
    class MyProgressBar:ProgressBar //新建一个MyProgressBar类，它继承了ProgressBar的所有属性与方法
    {
        public MyProgressBar()
        {
            base.SetStyle(ControlStyles.UserPaint, true);//使控件可由用户自由重绘
        }
        protected override void OnPaint(PaintEventArgs e)
        {
            SolidBrush brush = null;
            Rectangle bounds = new Rectangle(0, 0, base.Width, base.Height);
            e.Graphics.FillRectangle(new SolidBrush(this.BackColor), 1, 1, bounds.Width - 2, bounds.Height - 2);//此处完成背景重绘，并且按照属性中的BackColor设置背景色
            bounds.Height -= 4;
            bounds.Width = ((int)(bounds.Width * (((double)base.Value) / ((double)base.Maximum)))) - 4;//是的进度条跟着ProgressBar.Value值变化
            brush = new SolidBrush(this.ForeColor);
            e.Graphics.FillRectangle(brush, 2, 2, bounds.Width, bounds.Height);//此处完成前景重绘，依旧按照Progressbar的属性设置前景色
        }
    }
}
```
完成以上步骤之后，我们如何在界面中插入自己的进度条呢？``我们可以先插入一个winform自带的ProgressBar，调整好位置，ForeColor，BackColor属性，然后进入窗体的Designer程序中做如下修改：
```csharp
//private System.Windows.Forms.ProgressBar progressBar1;//注释此句
private MyProgressBar progressBar1; //新添此句，添加新的控件MyProgressBar
private void InitializeComponent()
{
    //this.progressBar1 = new System.Windows.Forms.ProgressBar();//注释此句
    this.progressBar1 = new 界面美化.MyProgressBar();//新添此句，此处对MyPorgressBar实例化
    this.SuspendLayout();
    this.progressBar1.Location = new System.Drawing.Point(137, 68);
    this.progressBar1.Name = "progressBar1";
    this.progressBar1.Size = new System.Drawing.Size(100, 23);
    this.progressBar1.TabIndex = 0;
}
```

### DataGridView

#### 绑定DataTable
```csharp
var dt = new DataTable();
dt.Columns.Add("Number", typeof(string));
dt.Columns.Add("ProjectCode");
dt.Columns.Add("LabResult", typeof(string));

foreach (var item in response.Contained)
{
    var obs = item as Observation;

    var number = obs.Id;
    var projectCode = obs.Code.Coding.FirstOrDefault()?.Code ?? string.Empty;
    var labResult = (obs.Value as Quantity).Value?.ToString() ?? string.Empty;

    dt.Rows.Add(number, projectCode, labResult);
}
dgvUpdateList.DataSource = dt;
```
这种方式的绑定界面上可以直接新建行。

#### 绑定集合后操作
如果你是DataGridView绑定的数据源是集合，那么就需要增加一个控件ContextMenuStrip，并绑定到DataGridView上，然后ContextMenuStrip上增加添加点击按钮，在按钮事件上添加
```csharp
var myDataTable = (DataTable)dgvUpdateList.DataSource;

// 创建新行并设置值
DataRow newRow = myDataTable.NewRow();
//newRow["Number"] = "Value1";
////newRow["ProjectCode"] = "Value2";
//newRow["LabResult"] = "aaa";

// 添加新行到表中
myDataTable.Rows.Add(newRow);

// 重新绑定DataGridView以反映更改
dgvUpdateList.DataSource = null;
dgvUpdateList.DataSource = myDataTable;
```
增加删除按钮，按钮点击事件操作如下
```csharp
try
{
    int nCounts = dgvUpdateList.SelectedRows.Count;
    for (int i = nCounts - 1; i >= 0; i--)
    {
        dgvUpdateList.Rows.RemoveAt(dgvUpdateList.SelectedRows[i].Index);
    }
}
catch (Exception ex)
{
    MessageBox.Show(ex.Message, "提示");
}
```

### SaveFileDialog
上传文件
```csharp
SaveFileDialog saveDia = new SaveFileDialog
{
    Filter = doc.Filter,
    Title = "另存文件为",
    CheckPathExists = true,
    AddExtension = true,
    AutoUpgradeEnabled = true,
    DefaultExt = doc.Ext,
    InitialDirectory = Environment.GetFolderPath(Environment.SpecialFolder.Desktop),
    OverwritePrompt = true,
    ValidateNames = true,
    FileName = doc.Dto.DBName + "表结构信息" + doc.Ext
};
var diaResult = saveDia.ShowDialog();

if (diaResult == DialogResult.OK)
{
	try
	{
		doc.Build(saveDia.FileName);
	}
	catch (Exception ex)
	{
		LogFactory.WriteErrorLog("tsbBuild_Click" + ex.Message + "  " + saveDia.FileName);
	}
}
```

### 消息

#### NotifyIcon
消息通知的图标显示在右下角

##### 设置右下角消息上下文
从左边拉取一个消息图标控件，然后设置属性中Icon图标已经文本名称。
![image.png](/common/1686925031712-f32b6597-3814-4a4f-8e55-c0e1738f0c5e.png)
如果需要设置右键上下文菜单，那么就需要拉取一个ContextMenuStrip控件，然后在该控件上添加菜单项
![image.png](/common/1686925116079-f265e2bd-6fd4-4251-8e1b-7f4e3f3b66ad.png)
最后设置消息通知的控件上下文为刚才的上下文控件即可
![image.png](/common/1686925135731-908374ab-cd6d-492d-9067-d4232541c0ee.png)
效果如下
![image.png](/common/1686925150520-3be1b66b-78e0-4d63-a019-2a686f3152fa.png)

## 弹框
最基础的弹框
```csharp
MessageBox.Show("修改成功");
```
带确定按钮的弹框
```csharp
DialogResult dr = MessageBox.Show("你确定要删除吗？", "提示", MessageBoxButtons.OKCancel, MessageBoxIcon.Question);
//判断
if (dr == DialogResult.OK)
{
    
}
```
弹框显示其他窗体并且在确定后再回来
```csharp
dbForm = new DBForm(OPType.Add);
var dia = dbForm.ShowDialog();
if (dia == DialogResult.OK)
{
    RefreshListView();
}

//在弹出的页面设置
BtnOk.DialogResult = DialogResult.OK;
```

## 事件
**Load事件**：发生在构造函数后，Shown事件前，这个事件的生命周期内，窗体是不可视化的。
**Shown事件**：当窗体发生前窗体有轮廓画出，事件结束后整个窗体渲染完并显示。
**FormClosing事件**：当窗体关闭过程中触发，因为是中间过程，还有机会挽救，事件订阅方法的第二个参数是FormClosingEventArgs，它有一个Cancel属性，如果设置成true，窗体就停止关闭后续步骤，继续显示。
**FormClosed事件**：窗体关闭后触发，不过这个事件走完后窗体才消失，这个事件订阅方法的第二个参数是FormClosedEventArgs，它有一个CloseReason的属性，说明了窗体关闭的原因，是枚举类型。
**Show方法**：以非模态方式显示窗体，意思就是显示出来的窗体与其他可视窗体可以切换操作，非模态窗体关闭后，就会释放。
**ShowDialog方法**：以模态方式显示窗体，会阻塞之前显示的窗体，独占进程内的输入设置焦点。
**Hide方法**：隐藏当前窗体，可以通过Show或ShowDialog再次显示出来。
**Close方法**：关闭当前窗体，会触发Close的相关事件。

## Show
show是非模式窗体，showDialog是模式窗体，区别在于以showDialog()打开的窗体,要等窗体关闭后才能操作其他窗体.而show()则不受此限制.
示例代码
```csharp
this.Hide();
Form2 obj = new Form2();
obj.Show();           
Form3 obj3 = new Form3();
obj3.Show();
```
form2和form3可以层叠显示，如果改用showDialog
```csharp
this.Hide();
Form2 obj = new Form2();           
obj.ShowDialog();
this.DialogResult = DialogResult.OK;
Form3 obj3 = new Form3();
obj3.Show();
```
只有当form2被关闭后，form3才会显示出来。

## 鼠标
```csharp
// 鼠标相对屏幕左上角的坐标
Console.WriteLine(Control.MousePosition);

//this.Location：窗体左上角相对于屏左上角的坐标；
//System.Windows.Forms.Cursor.Position：鼠标相对于屏左上角的坐标，等同于Control.MousePosition
```

