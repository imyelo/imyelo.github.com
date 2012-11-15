---
layout: post
type: post
title: '[转]VB另类技巧（可以用于VBA）－指针的使用'
category: Basic
tags:
- vb
- vba
- '指针'
- pointer
published: true
---

[**原文出处**](http://www.cnblogs.com/wangminbai/archive/2008/02/22/1077203.html)



大家都知道C中可以使用指针，但现在VB（当然也有VBA）也可以使用指针了，这是我在网上看的一篇文章，大家参考一下。  
想当年东方不败，黑木崖密室一战，仅凭一根绣花针独战四大高手，神出鬼没，堪称天下武林第一高手。若想成为VB里的东方不败，熟习VB《葵花宝典》，掌握VB指针技术，乃是不二的法门。  
欲练神功，引刀……，其实掌握VB指针技术，并不需要那么痛苦。因为说穿了，也就那么几招，再勤加练习，终可至神出鬼没之境。废话少说，让我们先从指针的定义说起。  
  
## 一、指针是什么？  
不需要去找什么标准的定义，它就是一个32位整数，在C语言和在VB里都可以用Long类型来表示。在32位Windows平台下它和普通的32位长整型数没有什么不同，只不过它的值是一个内存地址，正是因为这个整数象针一样指向一个内存地址，所以就有了指针的概念。  
有统计表明，很大一部分程序缺陷和内存的错误访问有关。正是因为指针直接和内存打交道，所以指针一直以来被看成一个危险的东西。以至于不少语言，如著名的JAVA，都不提供对指针操作的支持，所有的内存访问方面的处理都由编译器来完成。而象C和C++，指针的使用则是基本功，指针给了程序员极大的自由去随心所欲地处理内存访问，很多非常巧妙的东西都要依靠指针技术来完成。  
关于一门高级的程序设计语言是不是应该取消指针操作，关于没有指针操作算不算一门语言的优点，我在这里不讨论，因为互联网上关于这方面的没有结果的讨论，已经造成了占用几个GB的资源。无论最终你是不是要下定决心修习指针技术《葵花宝典》，了解这门功夫总是有益处的。  
注意：在VB里，官方是不鼓励使用什么指针的，本文所讲的任何东西你都别指望取得官方的技术支持，一切都要靠我们自己的努力，一切都更刺激！  
让我们开始神奇的VB指针探险吧！  

## 二、来看看指针能做什么？有什么用？
先来看两个程序，程序的功能都是交换两个字串：  
【程序一】：注释：标准的做法SwapStr  

	Sub SwapStr(sA As String, sB As String)
	Dim sTmp As String
	sTmp = sA: sA = sB: sB = sTmp
	End Sub 


【程序二】：注释：用指针的做法SwapPtr  

	Private Declare Sub CopyMemory Lib "kernel32" Alias "RtlMoveMemory" _ (Destination As Any, Source As Any, ByVal Length As Long)
	Sub SwapPtr(sA As String, sB As String)
	Dim lTmp As Long
	CopyMemory lTmp, ByVal VarPtr(sA), 4
	CopyMemory ByVal VarPtr(sA), ByVal VarPtr(sB), 4
	CopyMemory ByVal VarPtr(sB), lTmp, 4
	End Sub 

你是不是以为第一个程序要快，因为它看着简单而且不用调用API（调用API需要额外的处理，VB文档明确指出大量调用API将降低程序性能）。但事实上，在VB集成环境中运行，程序二要比程序一快四分之一；而编译成本机代码或p-code，程序二基本上要比程序一快一倍。下面是两个函数在编译成本机代码后，运行不同次数所花时间的比较：  

	运行100000次，SwapStr需要170毫秒，SwapPtr需要90毫秒。
	运行200000次，SwapStr需要340毫秒，SwapPtr需要170毫秒。
	运行2000000次，SwapStr需要3300毫秒，SwapPtr需要1500毫秒。

的确，调用API是需要额外指令来处理，但是由于使用了指针技术，它没有进行临时字串的分配和拷贝，因此速度提高了不少。  
怎么样，想不到吧！C/C++程序员那么依赖指针，无非也是因为使用指针往往能更直接的去处理问题的根源，更有驾驭一切的快感。他们不是不知道使用指针的危险，他们不是不愿意开卫星定位无级变速的汽车，只是骑摩托更有快感，而有些地方只有摩托才走得过去。  
和在C里类似，在VB里我们使用指针也不过三个理由：  
- 一是效率，这是一种态度一种追求，在VB里也一样；
- 二是不能不用，因为操作系统是C写的，它时刻都在提醒我们它需要指针；
- 三是突破限制，VB想照料我们的一切，VB给了我们很强的类型检查，VB象我们老妈一样，对我们关心到有时我们会受不了，想偶尔不听妈妈的话吗？你需要指针！  
但由于缺少官方的技术支持，在VB里，指针变得很神秘。因此在C里一些基本的技术，在VB里就变得比较困难。本文的目的就是要提供给大家一种简单的方法，来将C处理指针的技术拿到VB里来，并告诉你什么是可行的，什么可行但必须要小心的，什么是可能但不可行的，什么是根本就不可能的。  

## 三、 程咬金的三板斧
是的，程序二基本上就已经让我们看到VB指针技术的模样了。总结一下，在VB里用指针技术我们需要掌握三样东西：CopyMemory，VarPtr/StrPtr/ObjPtr, AdressOf. 三把斧头，程咬金的三板斧，在VB里Hack的工具。  

1. CopyMemory  
	关于CopyMemory和Bruce McKinney大师的传奇，MSDN的Knowledge Base中就有文章介绍，你可以搜索"ID: Q129947"的文章。正是这位大师给32位的VB带来了这个可以移动内存的API，也正是有了这个API，我们才能利用指针完成我们原来想都不敢想的一些工作，感谢Bruce McKinney为我们带来了VB的指针革命。  
	如CopyMemory的声明，它是定义在Kernel32.dll中的RtlMoveMemory这个API，32位C函数库中的memcpy就是这个API的包装，如MSDN文档中所言，它的功能是将从Source指针所指处开始的长度为Length的内存拷贝到Destination所指的内存处。它不会管我们的程序有没有读写该内存所应有的权限，一但它想读写被系统所保护的内存时，我们就会得到著名的Access Violation Fault(内存越权访问错误)，甚至会引起更著名的general protection (GP) fault（通用保护错误）。所以，在进行本系列文章里的实验时，请注意随时保存你的程序文件，在VB集成环境中将"工具"->"选项"中的"环境"选项卡里的"启动程序时"设为"保存改变"，并记住在"立即"窗口中执行危险代码之前一定要保存我们的工作成果。  

2. VarPtr/StrPtr/ObjPtr  
	它们是VB提供给我们的好宝贝，它们是VBA函数库中的隐藏函数。为什么要隐藏？因为VB开发小组，不鼓励我们用指针嘛。  
	实际上这三个函数在VB运行时库MSVBVM60.DLL（或MSVBVM50.DLL）中是同一个函数VarPtr（可参见我在本系列第一篇文章里介绍的方法）。  
	其库型库定义如下：  

		[entry("VarPtr"), hidden]
		long _stdcall VarPtr([in] void* Ptr);
		[entry("VarPtr"), hidden]
		long _stdcall StrPtr([in] BSTR Ptr);
		[entry("VarPtr"), hidden]
		long _stdcall ObjPtr([in] IUnknown* Ptr);

	即然它们是VB运行时库中的同一个函数，我们也可以在VB里用API方式重新声明这几个函数，如下：  

		Private Declare Function ObjPtr Lib "MSVBVM60" Alias "VarPtr" _
		(var As Object) As Long
		Private Declare Function VarPtr Lib "MSVBVM60" _
		(var As Any) As Long

	（没有StrPtr，是因为VB对字符串处理方式有点不同，这方面的问题太多，在本系列中另用一篇《VB字符串全攻略》来详谈。  
	顺便提一下，听说VB.NET里没有这几个函数，但只要还能调用API，我们就可以试试上面的几个声明，这样在VB.NET里我们一样可以进行指针操作。  
	但是请注意，如果通过API调用来使用VarPtr，整个程序二SwapPtr将比原来使用内置VarPtr函数时慢6倍。）  
	如果你喜欢刨根问底，那么下面就是VarPtr函数在C和汇编语言里的样子：  
	在C里样子是这样的：  

		long VarPtr(void* pv){
		return (long)pv;
		}

	所对就的汇编代码就两行：  

		mov eax,dword ptr [esp+4]
		ret 4 注释：弹出栈里参数的值并返回。

	之所以让大家了解VarPtr的具体实现，是想告诉大家它的开销并不大，因为它们不过两条指令，即使加上参数赋值、压栈和调用指令，整个获取指针的过程也就六条指令。当然，同样的功能在C语言里，由于语言的直接支持，仅需要一条指令即可。但在VB里，它已经算是最快的函数了，所以我们完全不用担心使用VarPtr会让我们失去效率！速度是使用指针技术的根本要求。   
	一句话，VarPtr返回的是变量所在处的内存地址，也可以说返回了指向变量内存位置的指针，它是我们在VB里处理指针最重要的武器之一。  


3. ByVal和ByRef  
	ByVal传递的参数值，而ByRef传递的参数的地址。在这里，我们不用去区别传指针/传地址/传引用的不同，在VB里，它们根本就是一个东西的三种不同说法，即使VB的文档里也有地方在混用这些术语（但在C++里的确要区分指针和引用）  
	初次接触上面的程序二SwapPtr的朋友，一定要搞清在里面的CopyMemory调用中，在什么地方要加ByVal，什么地方不加（不加ByVal就是使用VB缺省的ByRef）  
	准确的理解传值和传地址（指针）的区别，是在VB里正确使用指针的基础。   
	现在一个最简单的实验来看这个问题，如下面的程序三：  
	【程序三】：注释：体会ByVal和ByRef 

		Sub TestCopyMemory()
		Dim k As Long
		k = 5
		Note: CopyMemory ByVal VarPtr(k), 40000, 4
		Debug.Print k
		End Sub 

	上面标号Note处的语句的目的，是将k赋值为40000，等同于语句k=40000，你可以在"立即"窗口试验一下，会发现k的值的确成了40000。  
	实际上上面这个语句，翻译成白话，就是从保存常数40000的临时变量处拷贝4个字节到变量k所在的内存中。  
	现在我们来改变一个Note处的语句，若改成下面的语句：  

		Note2: CopyMemory ByVal VarPtr(k), ByVal 40000, 4  

	这句话的意思就成了，从地址40000拷贝4个字节到变量k所在的内存中。由于地址40000所在的内存我们无权访问，操作系统会给我们一个Access Violation内存越权访问错误，告诉我们"试图读取位置0x00009c40处内存时出错，该内存不能为注释：Read注释："。  
	我们再改成如下的语句看看。  

		Note3: CopyMemory VarPtr(k), 40000, 4

	这句话的意思就成了，从保存常数40000的临时变量处拷贝4个字节到到保存变量k所在内存地址值的临时变量处。这不会出出内存越权访问错误，但k的值并没有变。  
	我们可以把程序改改以更清楚的休现这种区别，如下面的程序四：  
	【程序四】：注释：看看我们的东西被拷贝到哪儿去了  

		Sub TestCopyMemory()
		Dim i As Long, k As Long
		k = 5
		i = VarPtr(k)
		NOTE4: CopyMemory i, 40000, 4
		Debug.Print k
		Debug.Print i
		i = VarPtr(k)
		NOTE5: CopyMemory ByVal i, 40000, 4
		Debug.Print k
		End Sub

	程序输出：  

		5
		40000
		40000

	由于NOTE4处使用缺省的ByVal，传递的是i的地址（也就是指向i的指针），所以常量40000拷贝到了变量i里，因此i的值成了40000，而k的值却没有变化。但是，在NOTE4前有：i=VarPtr(k)，本意是要把i本身做为一个指针来使用。这时，我们必须如NOTE5那样用ByVal来传递指针i，由于i是指向变量k的指针，所以最后常量40000被拷贝了变量k里。  
	希望你已经理解了这种区别，在后面问题的讨论中，我还会再谈到它。  

4. AddressOf  
	它用来得到一个指向VB函数入口地址的指针，不过这个指针只能传递给API使用，以使得API能回调VB函数。  
	本文不准备详细讨论函数指针，关于它的使用请参考VB文档。  

5. 拿来主义。
	实际上，有了CopyMemory，VarPtr，AddressOf这三把斧头，我们已经可以将C里基本的指针操作拿过来了。  
	如下面的C程序包括了大部分基本的指针指针操作：  

		struct POINT{
		int x; int y;
		};
		int Compare(void* elem1, void* elem2){}
		void PtrDemo(){
		//指针声明:
		char c = 注释：X注释：; //声明一个char型变量
		char* pc; long* pl; //声明普通指针
		POINT* pPt; //声明结构指针
		void* pv; //声明无类型指针
		int (*pfnCastToInt)(void *, void*);//声明函数指针:
		//指针赋值：
		pc = &c; //将变量c的地址值赋给指针pc
		pfnCompare = Compare; //函数指针赋值。
		//指针取值：
		c = *pc; //将指针pc所指处的内存值赋给变量c
		//用指针赋值：
		*pc = 注释：Y注释： //将注释：Y注释：赋给指针pc所指内存变量里。
		//指针移动：
		pc++; pl--;
		}

	这些对指针操作在VB里都有等同的东西，  
	前面讨论ByVal和ByRef时曾说过传指针和传地址是一回事，实际上当我们在VB里用缺省的ByRef声明函数参数时，我们已经就声明了指针。  
	如一个C声明的函数：`long Func(char* pc)`  
	其对应的VB声明是：`Function Func(pc As Byte) As Long`  
	这时参数pc使用缺省的ByRef传地址方式来传递，这和C里用指针来传递参数是一样。  
	那么怎么才能象C里那样明确地声明一个指针呢？  
	很简单，如前所说，用一个32位长整数来表达指针就行。在VB里就是用Long型来明确地声明指针，我们不用区分是普通指针、无类型指针还是函数指针，通通都可用Long来声明。而给一个指针赋值，就是赋给它用VarPar得到的另一个变量的地址。具体见程序五。  
	【程序五】：同C一样，各种指针。  

		Type POINT
		X As Integer
		Y As Integer
		End Type
		Public Function Compare(elem1 As Long, elem2 As Long) As Long
		注释：
		End Function
		Function FnPtrToLong(ByVal lngFnPtr As Long) As Long
		FnPtrToLong = lngFnPtr
		End Function
		Sub PtrDemo()
		Dim l As Long, c As Byte, ca() As Byte, Pt As POINT
		Dim pl As Long, pc As Long, pv As Long, pPt As Long, pfnCompare As Long
		c = AscB("X")
		pl = VarPtr(l) 注释：对应C里的long、int型指针
		pc = VarPtr(c) 注释：对应char、short型指针
		pPt = VarPtr(Pt) 注释：结构指针
		pv = VarPtr(ca(0)) 注释：字节数组指针，可对应任何类型，也就是void*
		pfnCompare = FnPtrToLong(AddressOf Compare) 注释：函数指针
		CopyMemory c, ByVal pc, LenB(c) 注释：用指针取值
		CopyMemory ByVal pc, AscB("Y"), LenB(c) 注释：用指针赋值
		pc = pc + LenB(c) : pl = pl - LenB(l) 注释：指针移动
		End Sub

	我们看到，由于VB不直接支持指针操作，在VB里用指针取值和用指针赋值都必须用CopyMemory这个API，而调用API的代价是比较高的，这就决定了我们在VB里使用指针不能象在C里那样自由和频繁，我们必须要考虑指针操作的代价，在后面的"指针应用"我们会再变谈这个问题。
	程序五中关于函数指针的问题请参考VB文档，无类型指针void*会在下面"关于Any的问题"里说。  
	程序五基本上已经包括了我们能在VB里进行的所有指针操作，仅此而已。  

	下面有一个小测试题，如果现在你就弄懂了上面程咬金的三板斧，你就应该能做得出来。  
	上面提到过，VB.NET中没有VarPtr，我们可以用声明API的方式来引入MSVBVM60.  DLL中的VarPtr。现在的问题如果不用VB的运行时DLL文件，你能不能自己实现一个ObjPtr。答案在下一节后给出。  

## 四、指针使用中应注意的问题  


1. 关于ANY的问题  
	如果以一个老师的身份来说话，我会说：最好永远也不要用Any！是的，我没说错，是永远！所以我没有把它放在程咬金的三板斧里。当然，这个问题和是不是应该使用指针这个问题一样会引发一场没有结果的讨论，我告诉你的只是一个观点，因为有时我们会为了效率上的一点点提高或想偷一点点懒而去用Any，但这样做需要要承担风险。  
	Any不是一个真正的类型，它只是告诉VB编译器放弃对参数类型的检查，这样，理论上，我们可以将任何类型传递给API。  
	Any在什么地方用呢？让我们来看看，在VB文档里的是怎么说的，现在就请打开MSDN(Visual Studio 6自带的版本)，翻到"Visual Basic文档"->"使用Visual Basic"->"部件工具指南"->"访问DLL和Windows API"部分，再看看"将 C 语言声明转换为 Visual Basic 声明"这一节。文档里告诉我们，只有C的声明为LPVOID和NULL时，我们才用Any。实际上如果你愿意承担风险，所有的类型你都可以用Any。当然，也可以如我所说，永远不要用Any。  
	为什么要这样？那为什么VB官方还要提供Any？是信我的，还是信VB官方的？有什么道理不用Any？  
	如前面所说，VB官方不鼓励我们使用指针。因为VB所标榜的优点之一，就是没有危险的指针操作，所以的内存访问都是受VB运行时库控制的。在这一点上，JAVA语言也有着同样的标榜。但是，同JAVA一样，VB要避免使用指针而得到更高的安全性，就必须要克服没有指针而带来的问题。VB已经尽最大的努力来使我们远离指针的同时拥有强类型检查带来的安全性。但是操作系统是C写的，里面到处都需要指针，有些指针是没有类型的，就是C程序员常说的可怕的void*无类型指针。它没有类型，因此它可以表示所有类型。如CopyMemory所对应的是C语言的memcpy，它的声明如下：  

		void *memcpy( void *dest, const void *src, size_t count );

	因memcpy前两个参数用的是void*，因此任何类型的参数都可以传递给他。  
	一个用C的程序员，应该知道在C函数库里这样的void*并不少见，也应该知道它有多危险。无论传递什么类型的变量指针给上面memcpy的void*，C编译器都不会报错或给任何警告。  
	在VB里大多数时候，我们使用Any就是为了使用void*，和在C里一样，VB也不对Any进行类型检查，我们也可以传递任何类型给Any，VB编译器也都不会报错或给任何警告。  
	但程序运行时会不会出错，就要看使用它时是不是小心了。正因为在C里很多错误是和void*相关的，所以，C++鼓励我们使用satic_cast来明确指出这种不安全的类型的转换，已利于发现错误。  
	说了这么多C/C++，其实我是想告诉所有VB的程序员，在使用Any时，我们必须和C/C++程序员使用void*一样要高度小心。  
	VB里没有satic_cast这种东西，但我们可以在传递指针时明确的使用long类型，并且用VarPtr来取得参数的指针，这样至少已经明确地指出我们在使用危险的指针。如程序二经过这样的处理就成了下面的程序：  
	【程序五】：注释：使用更安全的CopyMemory，明确的使用指针！  

		Private Declare Sub CopyMemory Lib "kernel32" Alias "RtlMoveMemory" (ByVal Destination As Long, ByVal Source As Long, ByVal Length As Long)
		Sub SwapStrPtr2(sA As String, sB As String)
		Dim lTmp As Long
		Dim pTmp As Long, psA As Long, psB As Long
		pTmp = VarPtr(lTmp): psA = VarPtr(sA): psB = VarPtr(sB)
		CopyMemory pTmp, psA, 4
		CopyMemory psA, psB, 4
		CopyMemory psB, pTmp, 4
		End Sub 

	注意，上面CopyMemory的声明，用的是ByVal和long，要求传递的是32位的地址值，当我们将一个别的类型传递给这个API时，编译器会报错，比如现在我们用下面的语句：  
	【程序六】：注释：有点象【程序四】，但将常量40000换成了值为1的变量.  

		Private Declare Sub CopyMemory Lib "kernel32" Alias "RtlMoveMemory" (ByVal Destination As Long, ByVal Source As Long, Length As Long)
		Sub TestCopyMemory()
		Dim i As Long，k As Long, z As Interger
		k = 5 : z = 1
		i = VarPtr(k)
		注释：下面的语句会引起类型不符的编译错误，这是好事！
		注释：CopyMemory i, z, 4
		注释：应该用下面的
		CopyMemory i, ByVal VarPtr(z), 2
		Debug.Print k
		End Sub 

	编译会出错！是好事！这总比运行时不知道错在哪儿好！  
	象程序四那样使用Any类型来声明CopyMemory的参数，VB虽然不会报错，但运行时结果却是错的。不信，你试试将程序四中的40000改为1，结果i的值不是我们想要的1，而是327681。为什么在程序四中，常量为1时结果会出错，而常量为40000时结果就不错？  
	原因是VB对函数参数中的常量按Variant的方式处理。是1时，由于1小于Integer型的最大值32767，VB会生成一个存储值1的Integer型的临时变量，也就是说，当我们想将1用CopyMemroy拷贝到Long型的变量i时，这个常量1是实际上是Integer型临时变量！VB里Integer类型只有两个字节，而我们实际上拷贝了四个字节。知道有多危险了吧！没有出内存保护错误那只是我们的幸运！  
	如果一定要解释一下为什么i最后变成了327681，这是因为我们将k的低16位的值5也拷贝到了i值的高16位中去了，因此有5*65536+1=327681。详谈这个问题涉及到VB局部变量声明顺序，CopyMemory参数的压栈顺序，long型的低位在前高位在后等问题。如果你对这些问题感兴趣，可以用本系列第一篇文章所提供的方法(DebugBreak这个API和VC调试器)来跟踪一下，可以加深你对VB内部处理方式的认识，由于这和本文讨论的问题无关，所以就不详谈了。到这里，大家应该明白，程序三和程序四实际上有错误！！！我在上面用常量40000而不用1，不是为了在文章中凑字数，而是因为40000这个常量大于32767，会被VB解释成我们需要的Long型的临时变量，只有这样程序三和程序四才能正常工作。对不起，我这样有意的隐藏错误只是想加深你对Any危害的认识。  
	总之，我们要认识到，编译时就找到错误是非常重要的，因为你马上就知道错误的所在。所以我们应该象程序五和程序六那样明确地用long型的ByVal的指针，而不要用Any的ByRef的指针。   
	但用Any已经如此的流行，以至很多大师们也用它。它唯一的魅力就是不象用Long型指针那样，需要我们自己调用VarPtr来得到指针，所有处理指针的工作由VB编译器来完成。所以在参数的处理上，只用一条汇编指令：push ，而用VarPtr时，由于需要函数调用，因此要多用五条汇编指令。五条多余的汇编指令有时的确能我们冒着风险去用Any。  
	VB开发小组提供Any，就是想用ByRef xxx As Any来表达void* xxx。我们也完全可以使用VarPtr和Long型的指针来处理。我想，VB开发小组也曾犹豫过是公布VarPtr，还是提供Any，最后他们决定还是提供Any，而继续隐瞒VarPtr。的确，这是个两难的决定。但是经过我上面的分析，我们应该知道，这个决定并不符合VB所追求的"更安全"的初衷。因为它可能会隐藏类型不符的错误，调试和找到这种运行时才产生的错误将花贵更多的时间和精力。  
	所以我有了"最好永远不要用Any"这个"惊人"的结论。  

	不用Any的另一个好处是，简化了我们将C声明的API转换成VB声明的方式，现在它变成了一句话：除了VB内置的可以进行类型检查的类型外，所以其它的类型我们都应该声明成Long型。  
2. 关于NULL的容易混淆的问题  
	有很多文章讲过，一定要记在心里：  
	VbNullChar 相当于C里的注释：\0注释：，在用字节数组构造C字串时常用它来做最后1个元素。  
	vbNullString 这才是真正的NULL，就是0，在VB6中直接用0也可以。  
	只有上面的两个是API调用中会用的。还有Empty、Null是Variant，而Nothing只和类对象有关，一般API调用中都不会用到它们。  

	另：本文第三节曾提出一个小测验题，做出来了吗？现在公布正确答案：  

		【测验题答案】
		Function ObjPtr(obj as Object) as long
		Dim lpObj As Long
		CopyMemory lpObj, Obj, 4
		ObjectPtr = lpObj
		End Function

## 五、VB指针应用  
如前面所说VB里使用指针不象C里那样灵活，用指针处理数据时都需要用CopyMemory将数据在指针和VB能够处理的变量之间来回拷贝，这需要很大的额外开销。因此不是所有C里的指针操作都可以移值到VB里来，我们只应在需要的时候才在VB里使用指针。  


1. 动态内存分配：完全不可能、可能但不可行，VB标准  
	在C和C++里频繁使用指针的一个重要原因是需要使用动态内存分配，用Malloc或New来从堆栈里动态分配内存，并得到指向这个内存的指针。在VB里我们也可以自己  
	用API来实现动态分配内存，并且实现象C里的指针链表。  
	但我们不可能象C那样直接用指针来访问这样动态分配的内存，访问时我们必须用CopyMemory将数据拷贝到VB的变量内，大量的使用这种技术必然会降低效率，以至于要象C那样用指针来使用动态内存根本就没有可行性。要象C、PASCAL那样实现动态数据结构，在VB里还是应该老老实实用对象技术来实现。  
	本文配套代码中的LinkedList里有完全用指针实现的链表，它是使用HeapAlloc从堆栈中动态分配内存，另有一个调用FindFirstUrlCacheEntry这个API来操作IE的Cache的小程序IECache，它使用了VirtualAlloc来动态分配内存。但实际上这都不是必须的，VB已经为我们提供了标准的动态内存分配的方法，那就是：  
	对象、字符串和字节数组  
	限于篇幅，关于对象的技术这里不讲，LinkedList的源代码里有用对象实现的链表，你可以参考。  
	字符串可以用Space$函数来动态分配，VB的文档里就有详细的说明。  
	关于字节数组，这里要讲讲，它非常有用。我们可用Redim来动态改变它的大小，并将指向它第一个元素的指针传给需要指针的API，如下：  

		dim ab() As Byte , ret As long
		注释：传递Null值API会返回它所需要的缓冲区的长度。  
		ret = SomeApiNeedsBuffer(vbNullString)
		注释：动态分配足够大小的内存缓冲区
		ReDim ab(ret) As Byte
		注释：再次把指针传给API，此时传字节数组第一个元素的指针。
		SomeApiNeedsBuffer(ByVal VarPtr(ab(1)))

	在本文配套程序中的IECache中，我也提供了用字节数组来实现动态分配缓冲区的版本，比用VirtualAlloc来实现更安全更简单。  

2. 突破限制  
	下面是一个突破VB类型检查来实现特殊功能的经典应用，出自Bruce Mckinney的《HardCore Visual Basic》一书。  
	将一个Long长整数的低16位作为Interger型提取出来，  
	【程序七】 注释：标准的方法，也是高效的方法，但不容易理解。  

		Function LoWord(ByVal dw As Long) As Integer
		If dw And &H8000& Then
		LoWord = dw Or &HFFFF0000
		Else
		LoWord = dw And &HFFFF&
		End If
		End Function

	【程序八】 注释：用指针来做效率虽不高，但思想清楚。  

		Function LoWord(ByVal dw As Long) As Integer
		CopyMemory ByVal VarPtr(LoWord), ByVal VarPtr(dw), 2
		End Function 

3. 对数组进行批量操作  
	用指针进行大批量数组数据的移动，从效率上考虑是很有必要的，看下面的两个程序，它们功能都是将数组的前一半数据移到后一半中：
	【程序九】：注释：标准的移动数组的做法  

		Private Sub ShitArray(ab() As MyType)
		Dim i As Long, n As Long
		n = CLng(UBound(ab) / 2)
		For i = 1 To n
		Value(n + i) = Value(i)
		Value(i).data = 0
		Next
		End Sub 

	【程序十】：注释：用指针的做法  

		Private Declare Sub CopyMemory Lib "kernel32" Alias "RtlMoveMemory" _
		(ByVal dest As Long, ByVal source As Long, ByVal bytes As Long)
		Private Declare Sub ZeroMemory Lib "kernel32" Alias "RtlZeroMemory" _
		(ByVal dest As Long, ByVal numbytes As Long)
		Private Declare Sub FillMemory Lib "kernel32" Alias "RtlFillMemory" _
		(ByVal dest As Long, ByVal Length As Long, ByVal Fill As Byte) 

		Private Sub ShitArrayByPtr(ab() As MyTpye)
		Dim n As Long
		n = CLng(UBound(ab) / 2)
		Dim nLenth As Long
		nLenth = Len(Value(1))
		注释：DebugBreak
		CopyMemory ByVal VarPtr(Value(1 + n)), _
		ByVal VarPtr(Value(1)), n * nLenth
		ZeroMemory ByVal VarPtr(Value(1)), n * nLenth
		End Sub

	当数组较大，移动操作较多（比如用数组实现HashTable）时程序十比程序九性能上要好得多。  
	程序十中又介绍两个在指针操作中会用到的API: ZeroMemory是用来将内存清零；FillMemory用同一个字节来填充内存。当然，这两个API的功能，也完全可以用CopyMemory来完成。象在C里一样，作为一个好习惯，在VB里我们也可以明确的用ZeroMemory来对数组进行初始化，用FillMemory在不立即使用的内存中填入怪值，这有利于调试。  
4. 最后的一点  
	当然，VB指针的应用决不止这些，还有什么应用就要靠自己去摸索了。对于对象指针和字符串指针的应用我会另写文章来谈，做为本文的结束和下一篇文章《VB字符串全攻略》的开始，我在这里给出交换两个字符串的最快的方法：  
	【程序十一】注释：交换两个字符串最快的方法  

		Private Declare Sub CopyMemory Lib "kernel32" Alias "RtlMoveMemory" _ (Destination As Any, Source As Any, ByVal Length As Long) 

		Sub SwapStrPtr3(sA As String, sB As String)
		Dim lTmp As Long
		Dim pTmp As Long, psA As Long, psB As Long
		pTmp = StrPtr(sA): psA = VarPtr(sA): psB = VarPtr(sB)
		CopyMemory ByVal psA, ByVal psB, 4
		CopyMemory ByVal psB, pTmp, 4
		End Sub
