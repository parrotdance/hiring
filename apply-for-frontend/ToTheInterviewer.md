# 前言

我从未在公司中担任过任何**高级**的技术职位，也许并不符合贵司对高级前端工程师的所有要求。但最终选择完成所有必选和附加需求的原因有二：

1. 经过简单评估，我认为我可以完成，即使最终真的因为初期考虑不周而无法完成，也不失为一次不错的挑战。
2. 我在疫情期间尝试过远程工作并且享受这种工作方式。（但同样接受到岗办公）

我将贵司的[仓库](https://github.com/xmindltd/hiring) Fork 了一份，并在[我自己的副本](https://github.com/parrotdance/hiring)中进行了提交，实际产出代码在 [/apply-for-frontend](https://github.com/parrotdance/hiring/tree/master/apply-for-frontend) 目录下。

总开发时长约为 15 小时。

## 如何运行

代码仅在以下环境中测试通过，不保证在其他环境下正常运行：

- 系统：windows 10 v2004
- Nodejs：v12.13.1
- 浏览器: chrome 85

```bash
cd /apply-for-frontend
npm i
npm run dev
```

然后在浏览器中访问 http://localhost:3000 即可看到构建的记账本应用。

该项目全程使用 VScode 作为编辑器开发，如果需要尝试实际开发中的自动格式化以及调试体验，确保在 VScode 中安装了以下插件：

- [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

在运行了上述脚本后点击 **F5** 即可开始调试。

# 正文

### 技术选型与初始文件框架搭建：

涉及的技术栈：React 16.3.1，Typescript 4.0，Webpack 4.4，Babel 7，Prettier

使用 React 仅仅是因为我认为对 Vue 已经足够熟悉，是时候在正式场合展示我对 React 以及编程本身的技能水平了。由于并未在实际工作中使用过 React，最终的代码也许有一些不符合 React 生态中的普遍约定或最佳实践，但也已经是我经历了一系列耦合度和可扩展性的思考之后的产出。使用 Typescript 则是由于我认为其强类型的特性更适合中大型项目的开发，并且由于具体框架实现有所不同，它跟 React 结合使用的体验比 Vue 更好。

文件框架方面，结合 Webpack 和 Babel 构建了支持 Typescript 的模块化开发环境，同时配置了 Prettier 以自动格式化代码，以及 VScode 的调试设置，方便开发过程进行断点调试。

### 需求拆分及解决方案：

#### 1. 加载并展示数据

我没有选择构建一个带有服务端的应用，而是想要以更加“前端”的方式展示我的技能，因此通过编写一个**Webpack Loader** 以及 Typescript 声明文件，实现了在 TS 代码中直接引入 `.csv` 文件，随后通过简单的 JSX 渲染出了所有的账单数据。

>  此处似乎存在一个隐性需求：需要将两个 `.csv` 文件中的 `category` 和 `name` 字段关联起来才可以展示可读的账单类型名称。

实现了数据的加载之后，便开始将展示账单数据的表格抽象为组件，具体接口设计参考了我熟悉的 [Element-UI](https://element.eleme.cn/#/zh-CN/component/table) 框架中的表格组件，最终实现了一个可以通过类似方式调用的简化版 Table 组件。

#### 2. 添加数据、过滤数据、统计金额

若仅针对三个需求之一开发，便没有什么好说的，但三者一旦结合起来就会产生新的隐性需求：当账单数据有变更时，过滤后用于展示的数据和统计金额也应该紧跟着更新。

针对这样的视图表现，可以构思这样一个数据流：当过滤器或源数据有变化，通知**数据中心**重新计算并输出数据到**视图组件**，由**视图组件**重新渲染输出的数据并统计金额。

为了实现这样的数据流：

1. 我实现了一个简单的 [**EventBus**](https://github.com/parrotdance/hiring/blob/master/apply-for-frontend/src/utils/EventBus.ts)，用以在不同视图组件和模块之间传递事件和数据。

2. 还实现了一个相比 EventBus 来说要复杂一些的[**数据中心**](https://github.com/parrotdance/hiring/blob/master/apply-for-frontend/src/utils/DataSource.ts)，它作为一个全局的数据源，对外暴露用以变更源数据以及配置过滤器的接口，并实现了针对过滤器选项的缓存机制，对于使用过的过滤器选项，可直接输出之前使用的数据。

### 其他的一些问题

#### 1. 如何验证过滤器选项是否一致，确保正确命中缓存

```typescript
// 类型定义
type FilterType = 'month' | 'category' | 'sort-amount'
type FilterOption = { [T in FilterType]?: any }
```

若两个过滤器一致则它们必须有一致的过滤器类型和数量，并且每个类型下的值也是一致的，因此：

- `{ month: 1 }` 和 `{ month: 2 }` 是不一样的过滤器

- `{ month: 1 }` 和 `{ month: 1, category: 'odrjk823mj8' }` 也是不一样的过滤器

- `{ category: 'abc', month: 1 }`和 `{ month: 1, category: 'abc' }`是一样的过滤器

而对象中的键值对遍历顺序是不确定的，为了让比较的逻辑更易于理解，最终实现的比较过程为：

1. 将形如 `{ month: 1, category: 'abc' }`的对象转为 `['month-1', 'category-abc']` 的形式
2. 利用 `Array.prototype.sort()` 可根据字符的 ASCII 码排序的特性对字符串数组排序
3. 对两个数组相同索引的位置进行扫描, 判断字符串是否全等

#### 2. 从应用的完整性来说，账单应该可以被保存

这个需求在需求描述中并没有被提及，但我认为它应该也是一个隐性需求。很遗憾在技术选型的时候并没有考虑到这一点，并且由于个人时间关系，应该没有充足的时间对其进行重构和调试了，这里仅简要描述一下重构的思路：

1. 引入一个基于 Nodejs 的服务端，将应用的渲染方式变更为服务端渲染
2. 将账单数据写入数据库，并暴露一些对账单增删改查操作的接口
3. 将数据库目录加入 `.gitignore` 文件（不希望 git 记录调试过程引发的文件变动）

当然，还有一个简单粗暴但不优雅的实现方式：提供一个按钮用于下载编辑后的账单。

