---
layout: post
type: post
title: 'Sudol开发日志'
categories: ['PHP', 'JavaScript', 'HTML5']
tags:
- sudol
- javascript
- html5
- sudoku
published: false 
---
## 2012.07.28

- 重写game.php的逻辑结构,减少sql查询次数(增加了user表的判断所以删去demo-game.php的链接)
- 重写login.php和首页相互之间的跳转
- 修复game页面js的一个bug(队友的格子删去数字时suggestion会显示为0而不消失),在checkSuggestion()里增加了为0时的判断
- 修改原先game页面显示月份不正确的js(.getMonth()从0开始计算，所以需要+1)
- 将game页面左侧未实现功能的按钮隐藏
- 将game页面上方的timer默认为隐藏
- 为game页面添加提交答案以及退出房间的按钮
- 为game页面添加partner/original表盘的toggle
- 编写提交答案的页面
- 更新退出房间的脚本
- 编写php版本的convertor functions
- 编写php版本的checkTable functions，并在原先js算法的基础上做优化
- 修改wait.php页面,先前遗漏的细节,为player2显示name而不是id


## 2012.07.27 - 2012.07.26

- 完善room.php、wait.php的js脚本
- 为room.php添加一个验证map合法的脚本
- 为room.php添加一个随机获取map的脚本
- login.php改为异步调用其自身
- logout.php改为异步调用
- 加深game.php大表盘的背景线颜色
- 更改div.msgTitle以及div.msgBottom的font-size
- 为game.php的timer计时器添加一个toggle
- 修补game.php在未登录时显示空白的bug
- 数据表room添加字段room_name，字长限制为12


## 2012.07.25

- 提升数据表的易读性，将user、room表的state项展开为iw\is\ir\if、iir\iig项，对应php代码的case\break也做更改。
- 添加room.php、room_exit.php、wait.php页面
- form内button用作链接

		<button name="submit_exit" onclick="javascript:location.href='{$Path_Website}/room_exit.php';return false;">Exit</button>

- msg.php添加meta跳转的功能

