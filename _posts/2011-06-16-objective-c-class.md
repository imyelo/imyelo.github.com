---
layout: post
type: post
title: '[转]深入理解Objective-c中@class的含义'
category: Objective-C
tags:
- '@class'
- import
- objective-c
published: true
---

**原文出处**: [深入理解Objective-c中@class的含义](http://blog.prosight.me/index.php/2009/09/347)  


在Objective-c中，当一个类需要引用另一个类，即建立复合关系的时候，需要在类的头文件中建立被引用类的指针。 如：

	Car.h

	#import

	@interface Car: NSObject
	{
	Tire *tires[4];
	Engine *engine;
	}

	…

实现类我们先省略，如果你直接这么编译，编译器会报错，告诉你它不知道Tire和Engine是什么。

这时候有两个选择，一个是import这两个被引用类的头文件，另一个是使用@class声明Tire和Engine是类名。 二者的区别在于：
* import会包含这个类的所有信息，包括实体变量和方法，而@class只是告诉编译器，其后面声明的名称是类的名称，至于这些类是如何定义的，暂时不用考虑，后面会再告诉你。
* 在头文件中， 一般只需要知道被引用的类的名称就可以了。 不需要知道其内部的实体变量和方法，所以在头文件中一般使用@class来声明这个名称是类的名称。 而在实现类里面，因为会用到这个引用类的内部的实体变量和方法，所以需要使用#import来包含这个被引用类的头文件。
* 在编译效率方面考虑，如果你有100个头文件都#import了同一个头文件，或者这些文件是依次引用的，如A–&gt;B, B–&gt;C, C–&gt;D这样的引用关系。当最开始的那个头文件有变化的话，后面所有引用它的类都需要重新编译，如果你的类有很多的话，这将耗费大量的时间。而是用@class则不会。
* 如果有循环依赖关系，如:A–&gt;B, B–&gt;A这样的相互依赖关系，如果使用#import来相互包含，那么就会出现编译错误，如果使用@class在两个类的头文件中相互声明，则不会有编译错误出现。
所以，一般来说，@class是放在interface中的，只是为了在interface中引用这个类，把这个类作为一个类型来用的。  
**在实现这个接口的实现类中，如果需要引用这个类的实体变量或者方法之类的，还是需要import在@class中声明的类进来.**
如：

	a.h
	@class Rectangle;
	@interface A : NSObject {
	…
	}
	a.m
	#import Rectangle
	@implementation A
	…