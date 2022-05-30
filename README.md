Babel原理

babel的配置文件查找会顺着文档目录树**一层层往上查找**，一直到.babelrc文件存在或者带babel字段的package.json文件存在为止

# 一、包构成

## 1、四个核心包

- babel-parse：将输入的js代码根据ESTree规范生成AST

- babel-core：Babel的核心包，提供了babel的**转译API**，如babel.transform等，用于对代码进行转译
- babel-traverse：用于对AST（抽象语法树）的遍历，主要给plugin用，用于完成对AST的节点增删改等操作。
- babel-generator：根据AST转换成**字符串形式**的代码，生成过程可以对**是否压缩**以及**是否删除注释**等进行配置同时还会**创建一个源码映射**(sourse maps)

## 2、功能包

- babel-types：用于**检验、构建和改变AST树的节点**
- babel-template：辅助函数，用于从**字符串形式的代码来构建AST树节点**
- babel-helpers：**一系列预制的babel-template函数**，用于提供给一些plugins使用
- babel-code-frames：用于**生成错误信息**，打印出错误点源代码帧以及指出出错位置
- babel-plugin-xxx：babel**转译过程中使用到的插件**，其中babel-plugin-transform-xxx是transform步骤使用的
- babel-preset-xxx：**transform阶段使用到的一系列的plugin**
- babel-polyfill：JS标准新增的原生对象和API的shim，实现上仅仅是**core-js和regenerator-runtime两个包的封装**
- babel-runtime：功能类似babel-polyfill，一般用于library或plugin中，因为它不会污染全局作用域

## 3、工具包

- babel-cli：babel的命令行工具，通过命令行对js代码进行转译
- babel-register：通过绑定node.js的require来自动转译require引用的js代码文件

# 二、基础概念

## 1、AST

AST 的每一层都拥有相同的结构：

```js
{
  type: "xxx",
  id: {...},
  params: [...],
  body: {...}
}
```

每一层结构也被叫做 **节点**，每一个节点都有如下所示的接口（Interface）：

```js
interface Node {
  type: string;
}
```

### 1.1常见的AST

#### 字面量Literal

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29185815036a4ea1878484ba773a3b6e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)



#### Identifier标识符

Identifer 是标识符的意思，变量名、属性名、参数名等各种声明和引用的名字，都是Identifer

Identifier 的词法特点：只能包含字母或数字或下划线（“_”）或美元符号（“$”）

![img](https://p1-live.byteimg.com/tos-cn-i-gjr78lqtd0/6395bd9f149d4f23b7c9f4e01cf0fe62~tplv-gjr78lqtd0-image.image)



#### Statement

statement 是语句，它是可以独立执行的单位，比如 break、continue、debugger、return 或者 if 语句、while 语句、for 语句，还有声明语句，表达式语句等。我们写的**每一条可以独立执行的代码都是语句**。

**语句是代码执行的最小单位**，可以说，代码是由语句（Statement）构成的,语句末尾一般会加一个分号分隔，或者用换行分隔

- **break**

- **continue**;

-  **return**;

-  **debugger**; 

- **throw Error()**;

-  {}

-  **try** {} **catch**(e) {} **finally**{} 

- **for** (**let** key **in** obj) {}

-  **for** (**let** i = 0;i < 10;i ++) {} 

- **while** (true) {} 

- **do** {} **while** (true) 

- **switch** (v){**case** 1: **break**;**default**:;} 

- **label: console.log();** 

- **with** (a){}

  ![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d711045e21bb44b68495088df6a9a60b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### Declaration

声明语句是一种特殊的语句，它执行的逻辑是在作用域内声明一个变量、函数、class、import、export 等

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5303fa5530944a638d6b3d1af93f0e3f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### Expression

expression 是表达式，特点是执行完以后有返回值，这是和语句 (statement) 的区别

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/feabcb940982409b911dcbb6066e8aa7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

可以单独执行的表达式语句在解析成AST的时候，会包裹一层ExpressionStatement节点

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07a3f1e392f649adb764ada46ee48602~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### Class

整个 class 的内容是 ClassBody

属性是 ClassProperty

方法是ClassMethod（通过 kind 属性来区分是 constructor 还是 method）

```js
class Guang extends Person{
    name = 'guang';
    constructor() {}
    eat() {}
}
```

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c62ec375157488780e2beae39e7620d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### Import

ImportDeclaration 包含着各种 import specifier

**三种语法：**

（1）named import：

```js
import {c, d} from 'c'
```

（2）default import

```js
import a from ‘a’
```

（3）namespaced import

```js
import * as b from ‘b’
```

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e501a0dfcce043c184e6320e22a4211c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### Export

named export：

```javascript
export { b, d};
```

default export：

```javascript
export default a;
```

all export：

```
export * from 'c';
```

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3ccde25491e42199088fe1f050469ab~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### Program & Directive

program 是代表整个程序的节点：

它有 body 属性代表程序体，存放 statement 数组，就是具体执行的语句的集合

还有 directives 属性，存放Directive 节点，比如`"use strict"` 这种指令会使用 Directive 节点表示

即**Program 是包裹具体执行语句的节点，而 Directive 则是代码中的指令部分**

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/154a6b04020047a0aa8eec9a29ae2d7f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

#### File & Comment

babel 的 **AST 最外层节点是 File**，它有 program、comments、tokens 等属性，分别存放 Program 程序体、注释、token 等，是最外层节点

**注释分为块注释和行内注释**，对应 CommentBlock 和 CommentLine 节点

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54eb07649db14476a27d61b4265fe547~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

### 1.2 AST的公用属性

- `type`： AST 节点的类型
- `start、end、loc`：start 和 end 代表该节点对应的源码字符串的开始和结束下标，不区分行列。而 loc 属性是一个对象，有 line 和 column 属性分别记录开始和结束行列号。
- `leadingComments、innerComments、trailingComments`： 表示开始的注释、中间的注释、结尾的注释，因为每个 AST 节点中都可能存在注释，而且可能在开始、中间、结束这三种位置，通过这三个属性来记录和 Comment 的关联。
- `extra`：记录一些额外的信息，用于处理一些特殊情况。比如 StringLiteral 修改 value 只是值的修改，而修改 extra.raw 则可以连同单双引号一起修改

## 2、State（状态）

应从访问者中消除全局状态

例如：将变量n换为x来代替

```
function square(n) {
  return n * n;
}
```

方法：使用递归将一个访问者放在另一个访问者中

```js
const updateParamNameVisitor = {
  Identifier(path) {
    if (path.node.name === this.paramName) {
      path.node.name = "x";
    }
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    const paramName = param.name;
    param.name = "x";

    path.traverse(updateParamNameVisitor, { paramName });
  }
};

path.traverse(MyVisitor);
```

错误方法：容易污染全局变量

```js
let paramName;

const MyVisitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    paramName = param.name;
    param.name = "x";
  },

  Identifier(path) {
    if (path.node.name === paramName) {
      path.node.name = "x";
    }
  }
};

//遇到以下情况的时候就会error
function square(n) {
  return n * n;
}
n;
```

## 3、babel的API

- `@babel/parser` 对源码进行 parse，可以通过 plugins、sourceType 等来指定 parse 语法
- `@babel/traverse` 通过 visitor 函数对遍历到的 ast 进行处理，分为 enter 和 exit 两个阶段，具体操作 AST 使用 path 的 api，还可以通过 state 来在遍历过程中传递一些数据
- `@babel/types` 用于创建、判断 AST 节点，提供了 xxx、isXxx、assertXxx 的 api
- `@babel/template` 用于批量创建节点
- `@babel/code-frame` 可以创建友好的报错信息
- `@babel/generator` 打印 AST 成目标代码字符串，支持 comments、minified、sourceMaps 等选项。
- `@babel/core` 基于上面的包来完成 babel 的编译流程，可以从源码字符串、源码文件、AST 开始
- `@babel/helpers` 用于转换 es next 代码需要的通过模板创建的 AST，比如 _typeof、_defineProperties 等
- `@babel/helper-xxx` 其他的插件之间共享的用于操作 AST 的公共函数
- `@babel/runtime` 主要是包含 corejs、helpers、regenerator 这 3 部分：
  - helper： helper 函数的运行时版本（不是通过 AST 注入了，而是运行时引入代码）
  - corejs： es next 的 api 的实现，corejs 2 只支持静态方法，corejs 3 还支持实例方法
  - regenerator：async await 的实现，由 facebook 维护

### 3.1@babel/parser

babel parser 叫 babylon，它提供了有两个 api：

- **parse** ：返回的AST根节点是File（整个AST）
- **parseExpression：**返回AST根节点的是Expression（表达式的AST)

```js
function parse(input: string, options?: ParserOptions): File
function parseExpression(input: string, options?: ParserOptions): Expression
```

parse参数包括：

- **`plugins`：** 指定jsx、typescript、flow 等插件来解析对应的语法
- **`allowXxx`：**指定一些语法是否允许，比如函数外的 await、没声明的 export等
- **`sourceType`：** 指定是否支持解析模块语法，有 三个取值：
  - **module：**解析 es module 语法
  - **script：**不解析 es module 语法，当作脚本执行
  - **unambiguous ：**根据内容是否有 import 和 export 来确定是否解析 es module 语法

parse方式：

- `strictMode` 是否是严格模式
- `startLine` 从源码哪一行开始 parse
- `errorRecovery` 出错时是否记录错误并继续往下 parse
- `tokens` parse 的时候是否保留 token 信息
- `ranges` 是否在 ast 节点中添加 ranges 属性

#### babel parser对estree AST的拓展

babel 基于 acorn 插件对 estree AST 做了如下扩展

- 把 Literal 替换成了 StringLiteral、NumericLiteral、 BigIntLiteral、 BooleanLiteral、 NullLiteral、 RegExpLiteral
- 把 Property 替换成了 ObjectProperty 和 ObjectMethod
- 把 MethodDefinition 替换成了 ClassMethod
- Program 和 BlockStatement 支持了 directives 属性，也就是 'use strict' 等指令的解析，对应的 ast 是 Directive 和 DirectiveLiteral
- ChainExpression 替换为了 ObjectMemberExpression 和 OptionalCallExpression
- ImportExpression 替换为了 CallExpression 并且 callee 属性设置为 Import

#### acorn插件

acorn 主要是一个 Parser 类，不同的方法实现了不同的逻辑，插件扩展就是继承这个 Parser，重写一些方法

例如：

Literal 扩展为 StringLiteral、NumericLiteral 

```js
module.exports = function(Parser) {
    return class extends Parser {
        parseLiteral (...args) {
            const node = super.parseLiteral(...args);
            switch(typeof node.value) {
                case 'number':
                    node.type = 'NumericLiteral';
                    break;
                case 'string':
                    node.type = 'StringLiteral';
                    break;
            }
            return  node;
        }
    }
}
```

#### 代码原理

```js
const ast = parser.parse(sourceCode, {
    plugins: ['literal', 'guangKeyword']
});
```

1、将插件放到不同的模块中，然后通过 map 来维护：

```js
const syntaxPlugins = {
    'literal': require('./plugins/literal'),
    'guangKeyword': require('./plugins/guangKeyword')
}
```

2、之后实现 parse 的时候，先把 options 做合并，之后根据 plugin 来依此启用不同的插件

```js
const defaultOptions = {
    plugins: []
}

function parse(code, options) {
    const resolvedOptions  = Object.assign({}, defaultOptions, options);

    const newParser = resolvedOptions.plugins.reduce((Parser, pluginName) => {
        let plugin = syntaxPlugins[pluginName]
        return plugin ? Parser.extend(plugin) : Parser; 
    }, acorn.Parser);

    return newParser.parse(code, {
        locations: true  //指定 locations 为 true，保留 AST 在源码中的位置信息
    });
}
```



### 3.2 babel-traverse

Babel Traverse（遍历）模块维护了整棵树的状态，并且负责替换、移除和添加节点

```js
function traverse(parent, opts)

//parent 指定要遍历的 AST 节点，opts 指定 visitor 函数。babel 会在遍历 parent 对应的 AST 时调用相应的 visitor 函数
```

#### visitor模式

当被操作的对象结构比较稳定，而操作对象的逻辑经常变化的时候，通过分离逻辑和对象结构，使得他们能独立扩展。这就是 visitor 模式的思想

对应到 babel traverse 的实现，就是 AST 和 visitor 分离，在 traverse（遍历）AST 的时候，调用注册的 visitor 来对其进行处理

visitor 对象的 value 是对象或者函数：

- 如果 value 为函数，那么就相当于是 enter 时调用的函数。
- 如果 value 为对象，则可以明确指定 enter 或者 exit 时的处理函数

函数会接收两个参数 **path 和 state**

```js
visitor: {
    Identifier (path, state) {},
    StringLiteral: {
        enter (path, state) {},
        exit (path, state) {}
    }
}

//enter 时调用是在遍历当前节点的子节点前调用，exit 时调用是遍历完当前节点的子节点后调用
```

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5768a7c151914586ab2a5b09b698b4d7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

```js
import * as babylon from "babylon";
import traverse from "babel-traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
```

可以为单个节点的类型，也可以是多个节点类型通过 `|` 连接，还可以通过别名指定一系列节点类型：

```js
// 进入 FunctionDeclaration 节点时调用
traverse(ast, {
  FunctionDeclaration: {
      enter(path, state) {}
  }
})

// 默认是进入节点时调用，和上面等价
traverse(ast, {
  FunctionDeclaration(path, state) {}
})

// 进入 FunctionDeclaration 和 VariableDeclaration 节点时调用
traverse(ast, {
  'FunctionDeclaration|VariableDeclaration'(path, state) {}
})

// 通过别名指定离开各种 Declaration 节点时调用
traverse(ast, {
  Declaration: {
      exit(path, state) {}
  }
})
```

##### state

第二个参数 state 则是遍历过程中在不同节点之间传递数据的机制

插件会通过 state 传递 options 和 file 信息，我们也可以通过 state 存储一些遍历过程中的共享数据，file 中有一些文件级别的信息，这个也可以从 path.hub.file 中拿

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee26748e8dd54dcca660e593271411be~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

```js
state {
    file
    opts
}
```

#### path操作

babel AST 中只包含源码的一些信息，但是操作 AST 时要拿到父节点的信息，并且也需要对 AST 增删改的方法，这些都在 path 对象里

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/538aefbdff92426c98c7f1da1feeb246~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

babel 会在 traverse 的过程中在 path 里**维护节点的父节点引用**，在其中**保存 scope（作用域）的信息**，同时也会**提供增删改 AST 的方法**。

**path 大概有这些属性和方法:**

```javascript
path {
    // 属性：
    node 
    parent
    parentPath
    scope
    hub
    container
    key
    listKey
    
    // 方法
    get(key) 
    set(key, node)
    inList()
    getSibling(key) 
    getNextSibling()
    getPrevSibling()
    getAllPrevSiblings()
    getAllNextSiblings()
    isXxx(opts)
    assertXxx(opts)
    find(callback)
    findParent(callback)
    
    insertBefore(nodes)
    insertAfter(nodes)
    replaceWith(replacement)
    replaceWithMultiple(nodes)
    replaceWithSourceString(replacement)
    remove()
    
    traverse(visitor, state)
    skip()
    stop()
}
```

​	**属性：**

- path.node 指向当前 AST 节点

- path.parent 指向父级 AST 节点

- path.parentPath 父 AST 节点的 path

- path.scope 获取当前节点的作用域信息

- path.hub 可以通过 path.hub.file 拿到最外层 File 对象， path.hub.getScope 拿到最外层作用域，path.hub.getCode 拿到源码字符串

- path.container 当前 AST 节点所在的父节点属性的属性值

- path.key 当前 AST 节点所在父节点属性的属性名或所在数组的下标

- path.listkey 当前 AST 节点所在父节点属性的属性值为数组时 listkey 为该属性名，否则为 undefined

  **方法：**

- find(callback) 从当前节点到根节点来查找节点（包括当前节点），调用 callback（传入 path）来决定是否终止查找

- findParent(callback) 从当前节点到根节点来查找节点（不包括当前节点），调用 callback（传入 path）来决定是否终止查找

- inList() 判断节点是否在数组中，如果 container 为数组，也就是有 listkey 的时候，返回 true

- get(key) 获取某个属性的 path

- set(key, node) 设置某个属性的值

- getSibling(key) 获取某个下标的兄弟节点

- getNextSibling() 获取下一个兄弟节点

- getPrevSibling() 获取上一个兄弟节点

- getAllPrevSiblings() 获取之前的所有兄弟节点

- getAllNextSiblings() 获取之后的所有兄弟节点

- path.isXxx 判断当前节点是不是 xx 类型

- path.assertXxx 判断当前节点是不是 xx 类型，不是则抛出异常，但是不返回布尔值

- insertBefore(nodes) 在之前插入节点，可以是单个节点或者节点数组

- insertAfter(nodes) 在之后插入节点，可以是单个节点或者节点数组

- replaceWith(replacement) 用某个节点替换当前节点

- replaceWithMultiple(nodes) 用多个节点替换当前节点

- replaceWithSourceString(replacement) 解析源码成 AST，然后替换当前节点

- remove() 删除当前节点

- traverse(visitor, state) 遍历当前节点的子节点，传入 visitor 和 state（state 是不同节点间传递数据的方式）

- path.skip 跳过**当前节点的子节点的遍历**

- path.stop 结束**后续遍历**

##### 获取子节点的Path

为了得到**一个AST节点的属性值**，我们一般先访问到该节点，然后利用 `path.node.property` 方法

```js
// the BinaryExpression AST node has properties: `left`, `right`, `operator`
BinaryExpression(path) {
  path.node.left;
  path.node.right;
  path.node.operator;
}
```

如果你想访问到**该属性内部的`path`**，使用path对象的`get`方法，传递该属性的字符串形式作为参数。

```js
BinaryExpression(path) {
  path.get('left');
}
Program(path) {
  path.get('body.0');
}
```

##### 检查节点的类型

如果你想**检查节点的类型**，最好的方式是：

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

你同样可以**对节点的属性们做浅层检查**：

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

功能上等价于：

```
BinaryExpression(path) {
  if (
    path.node.left != null &&
    path.node.left.type === "Identifier" &&
    path.node.left.name === "n"
  ) {
    // ...
  }
}
```

##### 检查路径（Path）类型

一个路径具有相同的方法检查节点的类型：

```
BinaryExpression(path) {
  if (path.get('left').isIdentifier({ name: "n" })) {
    // ...
  }
}
```

就相当于：

```
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

##### 检查标识符（Identifier）是否被引用

```
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

或者：

```
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

##### 找到特定的父路径

对于每一个父路径调用`callback`并将其`NodePath`当作参数，当`callback`返回真值时，则将其`NodePath`返回

```js
path.findParent((path) => path.isObjectExpression());
```

如果也**需要遍历当前节点**：

```js
path.find((path) => path.isObjectExpression());
```

**查找最接近的父函数或程序：**

```js
path.getFunctionParent();
```

向上遍历语法树，直到找到**在列表中的父节点路径**

```js
path.getStatementParent();
```

##### 同级路径

如果一个路径是在一个 `Function`／`Program`中的列表里面，它就有同级节点。

- 使用`path.inList`来判断路径是否有同级节点，
- 使用`path.getSibling(index)`来获得同级路径,
- 使用 `path.key`获取路径所在容器的索引,
- 使用 `path.container`获取路径的容器（包含所有同级节点的数组）
- 使用 `path.listKey`获取容器的key

```js
/*
var a = 1; // pathA, path.key = 0 
var b = 2; // pathB, path.key = 1 
var c = 3; // pathC, path.key = 2
*/
export default function({ types: t }) {
  return {
    visitor: {
      VariableDeclaration(path) {
        // if the current path is pathA
        path.inList // true
        path.listKey // "body"
        path.key // 0
        path.getSibling(0) // pathA
        path.getSibling(path.key + 1) // pathB
        path.container // [pathA, pathB, pathC]
      }
    }
  };
}
```

##### 停止遍历

如果你的插件需要在某种情况下不运行，最简单的做法是尽早写回。

```
BinaryExpression(path) {
  if (path.node.operator !== '**') return;
}
```

如果您在顶级路径中进行子遍历，则可以使用2个提供的API方法：

`path.skip()` skips traversing the children of the current path. `path.stop()` stops traversal entirely.

```js
outerPath.traverse({
  Function(innerPath) {
    innerPath.skip(); // if checking the children is irrelevant
  },
  ReferencedIdentifier(innerPath, state) {
    state.iife = true;
    innerPath.stop(); // if you want to save some state and then stop traversal, or deopt
  }
});
```

##### 替换一个节点

~~~js
BinaryExpression(path) {
  path.replaceWith(
    t.binaryExpression("**", path.node.left, t.numberLiteral(2))
  );
}

```diff
function square(n) {
-   return n * n;
+   return n ** 2;
  }
~~~

##### 用多节点替换单节点

~~~js
ReturnStatement(path) {
  path.replaceWithMultiple([
    t.expressionStatement(t.stringLiteral("Is this the real life?")),
    t.expressionStatement(t.stringLiteral("Is this just fantasy?")),
    t.expressionStatement(t.stringLiteral("(Enjoy singing the rest of the song in your head)")),
  ]);
}

```diff
function square(n) {
-   return n * n;
+   "Is this the real life?";
+   "Is this just fantasy?";
+   "(Enjoy singing the rest of the song in your head)";
  }

~~~

##### 用字符串源码替换节点

~~~js
FunctionDeclaration(path) { 
path.replaceWithSourceString(function add(a, b) {
  return a + b; 
});
}

```diff
- function square(n) {
-   return n * n;
+ function add(a, b) {
+   return a + b;
  }

~~~

##### 插入兄弟节点

~~~js
FunctionDeclaration(path) { 
path.insertBefore(t.expressionStatement(t.stringLiteral("Because I'm easy come, easy go."))); path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low."))); 
}


```diff
+ "Because I'm easy come, easy go.";
  function square(n) {
    return n * n;
  }
+ "A little high, little low.";

~~~

##### 插入到容器（container）中

~~~js
ClassMethod(path) { 
path.get('body').unshiftContainer('body', t.expressionStatement(t.stringLiteral('before'))); path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after'))); }

```diff
 class A {
  constructor() {
+   "before"
    var a = 'middle';
+   "after"
  }
 }
~~~

##### 删除一个节点

~~~js
FunctionDeclaration(path) {
  path.remove();
}

```diff
- function square(n) {
-   return n * n;
- }
~~~

~~~js
BinaryExpression(path) {
  path.parentPath.replaceWith(
    t.expressionStatement(t.stringLiteral("Anyway the wind blows, doesn't really matter to me, to me."))
  );
}

```diff
function square(n) {
-   return n * n;
+   "Anyway the wind blows, doesn't really matter to me, to me.";
  }
~~~

##### 删除父节点

~~~js
BinaryExpression(path) {
  path.parentPath.remove();
}

```diff
  function square(n) {
-   return n * n;
  }
~~~

##### path.scope

scope 是作用域相关的信息，记录着每一个声明（binding）和对该声明的引用（reference）。

**只有 block 节点需要生成 scope**，所以我们会记录什么节点是 block 节点，遇到 block 节点会生成 scope，否则拿之前的

**作用域信息的属性和方法：**

```js
path.scope {
    bindings
    block
    parent
    parentBlock
    path
    references
 
    dump()
    parentBlock()
    getAllBindings()
    getBinding(name)
    hasBinding(name)
    getOwnBinding(name)
    parentHasBinding(name)
    removeBinding(name)
    moveBindingTo(name, scope)
    generateUid(name)
}
```

​	**属性：**

- scope.bindings 当前作用域内声明的所有变量

- scope.block 生成作用域的 block

- scope.path 生成作用域的节点对应的 path

- scope.references 所有 binding 的引用对应的 path

  **方法：**

- scope.dump() 打印作用域链的所有 binding 到控制台

- scope.parentBlock() 父级作用域的 block

- getAllBindings() 从当前作用域到根作用域的所有 binding 的合并

- getBinding(name) 查找某个 binding，从当前作用域一直查找到根作用域

- getOwnBinding(name) 从当前作用域查找 binding

- parentHasBinding(name, noGlobals) 查找某个 binding，从父作用域查到根作用域，不包括当前作用域。可以通过 noGlobals 参数指定是否算上全局变量（比如console，不需要声明就可用），默认是 false

- removeBinding(name) 删除某个 binding

- hasBinding(name, noGlobals) 从当前作用域查找 binding，可以指定是否算上全局变量，默认是 false

- moveBindingTo(name, scope) 把当前作用域中的某个 binding 移动到其他作用域

- generateUid(name) 生成作用域内唯一的名字，根据 name 添加下划线，比如 name 为 a，会尝试生成 _a，如果被占用就会生成 __a，直到生成没有被使用的名字

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
//这将遍历范围树并检查特定的绑定

//检查一个作用域是否有自己的绑定：
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

###### scope.block

能形成 scope 的节点也叫 block 节点

通过path.scope.block 拿到所在的块对应的节点

通过 path.scope.parentBlock 拿到父作用域对应的块节点

通过 path.scope.parent 拿到父作用域的信息

###### scope.bindings/references

作用域中保存的是声明的变量和对应的值，每一个声明叫做一个binding（绑定）

比如这样一段代码

```javascript
const a = 1;
```

它的 path.scope.bindings 是这样的

```javascript
bindings: {
    a: {
        constant: true,
        constantViolations: [],
        identifier: {type: 'Identifier', ...}
        kind:'const',
        path: {node,...}
        referenced: false
        referencePaths: [],
        references: 0,
        scope: ...
    }
}
```

因为我们在当前 scope 中声明了 a 这个变量，所以 bindings 中有 a 的 binding，每一个 binding 都有 kind，这代表绑定的类型：

- var、let、const 分别代表 var、let、const 形式声明的变量
- param 代表参数的声明
- module 代表 import 的变量的声明





###### 创建一个 UID

这将生成一个标识符，不会与任何本地定义的变量相冲突。

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

###### 提升变量声明至父级作用域

~~~js
FunctionDeclaration(path) {
  const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
  path.remove();
  path.scope.parent.push({ id, init: path.node });
}

```diff
- function square(n) {
+ var _square = function square(n) {
    return n * n;
- }
+ };
~~~

###### 重命名绑定及其引用

~~~js
FunctionDeclaration(path) {
  path.scope.rename("n", "x");
}

```diff
- function square(n) {
-   return n * n;
+ function square(x) {
+   return x * x;
  }
~~~

或者，您可以将绑定重命名为生成的唯一标识符：

~~~js
FunctionDeclaration(path) {
  path.scope.rename("n");
}

```diff
- function square(n) {
-   return n * n;
+ function square(_n) {
+   return _n * _n;
  }
~~~

##### 抛出一个语法错误

如果您想用babel-code-frame和一个消息抛出一个错误：

```js
export default function({ types: t }) {
  return {
    visitor: {
      StringLiteral(path) {
        throw path.buildCodeFrameError("Error message here");
      }
    }
  };
}
```

#### 代码原理

**实现：**

```js
traverse(ast, {
    Identifier(node) {
        node.name = 'b';
    }
});
```

**第一步：维护一份数据：不同的 AST 有哪些可以遍历的属性**

```js
const astDefinationsMap = new Map();

astDefinationsMap.set('Program', {
    visitor: ['body']
});
astDefinationsMap.set('VariableDeclaration', {
    visitor: ['declarations']
});
astDefinationsMap.set('VariableDeclarator', {
    visitor: ['id', 'init']
});
astDefinationsMap.set('Identifier', {});
astDefinationsMap.set('NumericLiteral', {});
astDefinationsMap.set('FunctionDeclaration', {
    visitor: ['id', 'params', 'body']
});
astDefinationsMap.set('BlockStatement', {
    visitor: ['body']
});
astDefinationsMap.set('ReturnStatement', {
    visitor: ['argument']
});
astDefinationsMap.set('BinaryExpression', {
    visitor: ['left', 'right']
});
astDefinationsMap.set('ExpressionStatement', {
    visitor: ['expression']
});
astDefinationsMap.set('CallExpression', {
    visitor: ['callee', 'arguments']
});
```

------

**第二步：实现递归的遍历：**

（1）如果属性是数组的话就依次遍历每一个元素，否则直接递归遍历该属性

（2）visitor 支持 enter 和 exit 阶段，也就是进入节点调用 enter，之后遍历子节点，之后再调用 exit，默认如果没有指定哪个阶段就在 enter 阶段调用

```js
function traverse(node, visitors) {
    const defination = astDefinationsMap.get(node.type);

    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }

    visitorFuncs.enter && visitorFuncs.enter(node);

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach(childNode => {
                    traverse(childNode, visitors);
                })
            } else {
                traverse(prop, visitors);
            }
        })
    }
    visitorFuncs.exit && visitorFuncs.exit(node);
}
```

（3）如果 enter 阶段修改了 AST 但是不想遍历新生成的子节点，可以用 path.skip 跳过遍历

------

**第三步：建立path与节点之间的联系**

（1）创建path类，记录当前节点 node，父节点 parent 以及父节点的 path

```js
class NodePath {
    constructor(node, parent, parentPath) {
        this.node = node;
        this.parent = parent;
        this.parentPath = parentPath;
    }
}
```

（2）在遍历的时候创建 path 对象，传入 visitor

```js
function traverse(node, visitors, parent, parentPath) {
    const defination = astDefinationsMap.get(node.type);

    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }
    const path = new NodePath(node, parent, parentPath);

    visitorFuncs.enter && visitorFuncs.enter(path);

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach(childNode => {
                    traverse(childNode, visitors, node, path);
                })
            } else {
                traverse(prop, visitors, node, path);
            }
        })
    }
    visitorFuncs.exit && visitorFuncs.exit(path);
}
```

#### 实现 path api

（1）遍历的时候加入key和listkey属性(明白节点在父节点的哪个属性上，以及属性值数组中对应的位置)

```js
function traverse(node, visitors, parent, parentPath,key,listkey) {
    const defination = astDefinationsMap.get(node.type);

    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }
    const path = new NodePath(node, parent, parentPath,,key,listkey);

    visitorFuncs.enter && visitorFuncs.enter(path);

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach(childNode => {
                    traverse(childNode, visitors, node, path,key,listkey);
                })
            } else {
                traverse(prop, visitors, node, path,key);
            }
        })
    }
    visitorFuncs.exit && visitorFuncs.exit(path);
}
```

(2)修改path类

```js
class NodePath {
    constructor(node, parent, parentPath, key, listKey) {
        this.node = node;
        this.parent = parent;
        this.parentPath = parentPath;
        this.key = key;
        this.listKey = listKey;
    }
}
```

##### 1、path.replaceWith

基于 key 和 listkey 实现 replaceWith 的 api，如果是数组的话，就修改那个元素，否则就修改该属性

```js
replaceWith(node) {
    if (this.listKey != undefined) {
        this.parent[this.key].splice(this.listKey, 1, node);
    } else {
        this.parent[this.key] = node
    }
}
```

##### 2、path.remove

```js
remove () {
    if (this.listKey != undefined) {
        this.parent[this.key].splice(this.listKey, 1);
    } else {
        this.parent[this.key] = null;
    }
}
```

##### 3、path.find、path.findParent

find 和 findParent 是顺着 path 链向上查找 AST，并且把节点传入回调函数，如果找到了就返回节点的 path。区别是 find 包含当前节点，findParent 不包含。

```javascript
findParent(callback) {
    let curPath = this.parentPath;
    while (curPath && !callback(curPath)) {
        curPath = curPath.parentPath; 
    }
    return curPath;
}
find(callback) {
    let curPath = this;
    while (curPath && !callback(curPath)) {
        curPath = curPath.parentPath; 
    }
    return curPath;
}
```

##### 4、path.skip

skip 的实现可以给节点加个标记，遍历的过程中如果发现了这个标记就跳过子节点遍历

```js
skip() {
    this.node.__shouldSkip = true;
}
```

```js
function traverse(node, visitors, parent, parentPath,key,listkey) {
    const defination = astDefinationsMap.get(node.type);

    let visitorFuncs = visitors[node.type] || {};

    if(typeof visitorFuncs === 'function') {
        visitorFuncs = {
            enter: visitorFuncs
        }
    }
    const path = new NodePath(node, parent, parentPath,,key,listkey);

    visitorFuncs.enter && visitorFuncs.enter(path);

	 if(node.__shouldSkip) {
        delete node.__shouldSkip;
        return;
    }

    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key];
            if (Array.isArray(prop)) { // 如果该属性是数组
                prop.forEach(childNode => {
                    traverse(childNode, visitors, node, path,key,listkey);
                })
            } else {
                traverse(prop, visitors, node, path,key);
            }
        })
    }
    visitorFuncs.exit && visitorFuncs.exit(path);
}
```

##### 5、path.toString

toString 是把当前节点打印成目标代码，会调用 generator

```js
toString() {
    return generate(this.node).code;
}
```

##### 6、path.isXxx

我们记录了不同 ast 怎么遍历，那么也可以基于这些数据实现各种判断 AST 类型的 api：

```js
const validations = {};

for (let name of astDefinationsMap.keys()) {
    validations['is' + name] = function (node) {
        return node.type === name;
    }
}
```

这些会抽离到 types 包里面，然后在 path 中做相应的封装，通过 bind 给方法添加一个参数。

```javascript
const types = require('../../types');

class NodePath {
    constructor(node, parent, parentPath, key, listKey) {
        this.node = node;
        this.parent = parent;
        this.parentPath = parentPath;
        this.key = key;
        this.listKey = listKey;

        Object.keys(types).forEach(key => {
            if (key.startsWith('is')) {
                this[key] = types[key].bind(this, node);
            }
        })
    }
}
```

```js
traverse(ast, {
    Identifier(path) {
        if(path.findParent(p => p.isCallExpression())) {
            path.replaceWith({ type: 'Identifier', name: 'bbbbbbb' });
        }
    }
})
```

#### 实现path scope

path.scope 中记录着作用域相关的数据，通过 scope 可以拿到整条作用域链，包括声明的变量和对该声明的引用

（一）首先创建 Binding 类和 Scope 类：

```js
class Binding {
    constructor(id, path, scope, kind) {
        this.id = id;
        this.path = path;
        this.referenced = false;
        this.referencePaths = [];
    }
}
```

```js
class Scope {
    constructor(parentScope, path) {
        this.parent = parentScope;
        this.bindings = {}; //记录作用域中的每一个声明
        this.path = path;
    }
	
  	//添加声明
    registerBinding(id, path) {
        this.bindings[id] = new Binding(id, path);
    }
	
  	//只从当前 scope 查找
    getOwnBinding(id) {
        return this.bindings[id];
    }
	
  	//顺着作用域链向上查找
    getBinding(id) {
        let res = this.getOwnBinding(id);
        if (res === undefined && this.parent) {
            res = this.parent.getOwnBinding(id);
        }
        return res;
    }

  	//判断有无声明
    hasBinding(id) {
        return !!this.getBinding(id);
    }
}
```

（二）之后在 path 里面定义一个 scope 的 get 的方法，当需要用到 scope 的时候才会创建，因为 scope 创建之后还要遍历查找 bindings，是比较耗时的，实现 get 可以做到用到的时候才创建。

```js
get scope() {
    if (this.__scope) {
        return this.__scope;
    }
    const isBlock = this.isBlock();
    const parentScope = this.parentPath && this.parentPath.scope;
    return this.__scope = isBlock ? new Scope(parentScope, this) : parentScope;
}

```

```js
isBlock() {
    return types.visitorKeys.get(this.node.type).isBlock;
}
//isBlock 方法的实现就是从我们记录的数据中查找该节点是否是 block
```

我们在记录节点的遍历的属性的时候，也记录了该节点是否是 block，这样，当遍历到 block 节点的时候，就会创建 Scope 对象，然后和当前 Scope 关联起来，形成作用域链：

```js
astDefinationsMap.set('Program', {
    visitor: ['body'],
    isBlock: true
});
astDefinationsMap.set('FunctionDeclaration', {
    visitor: ['id', 'params', 'body'],
    isBlock: true
});
```

（三）创建完scope之后遍历扫描所有的bindings记录到scope中（**遇到函数要跳过遍历，因为他有自己独立的作用域，要排除声明语句里面的 identifier，那个是定义变量不是引用变量**）

```js
path.traverse({
    VariableDeclarator: (childPath) => {
        this.registerBinding(childPath.node.id.name, childPath);
    },
    FunctionDeclaration: (childPath) => {
        childPath.skip();
        this.registerBinding(childPath.node.id.name, childPath);
    },
   Identifier: childPath =>  {
        if (!childPath.findParent(p => p.isVariableDeclarator() || p.isFunctionDeclaration())) {
            const id = childPath.node.name;
            const binding = this.getBinding(id);
            if (binding) {
                binding.referenced = true;
                binding.referencePaths.push(childPath);
            }
        }
    }
});
```

**（四）案例：删除掉未被引用的变量：**

```javascript
traverse(ast, {
    Program(path) {
        Object.entries(path.scope.bindings).forEach(([id, binding]) => {
            if (!binding.referenced) {
                binding.path.remove();
            }
        });
    },
    FunctionDeclaration(path) {
        Object.entries(path.scope.bindings).forEach(([id, binding]) => {
            if (!binding.referenced) {
                binding.path.remove();
            }
        });
    }
});
```

### 3.3babel-types

遍历 AST 的过程中需要**创建一些 AST 和判断 AST 的类型**，这时候就需要 `@babel/types` 包

Babel Types模块是一个用于 AST 节点的 Lodash 式工具库（译注：Lodash 是一个 JavaScript 函数工具库，提供了基于函数式编程风格的众多工具函数）， 它**包含了构造、验证以及变换 AST 节点的方法**。 该工具库包含考虑周到的工具方法，对编写处理AST逻辑非常有用

api：https://babeljs.io/docs/en/babel-types#api

可以运行以下命令来安装它：

```
$ npm install --save babel-types
```

然后按如下所示来使用：

```js
import traverse from "babel-traverse";
import * as t from "babel-types";

traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});
```

### 3.4babel-template

通过 @babel/types 创建 AST 还是比较麻烦的，要一个个的创建然后组装，如果 AST 节点比较多的话需要写很多代码，这时候就可以使用 `@babel/template` 包来批量创建，babel-template 能让你**编写字符串形式且带有占位符的代码来代替手动编码**

api：

```js
const ast = template.ast(code, [opts]);
const ast = template.program(code, [opts]);
const ast=template.expression(code,;[opts]);
...
```

- template.ast直接返回AST，如果创建的是Expression，则会在外包裹一层ExpressionStatement， template.expression 方法创建的 AST 就不会
- template.program直接返回AST，根节点是Program
- Template.expression等会创建具体的AST

```js
$ npm install --save babel-template
```

```js
import template from "babel-template";
import generate from "babel-generator";
import * as t from "babel-types";

const buildRequire = template(`
  var IMPORT_NAME = require(SOURCE);
`);

const ast = buildRequire({
  IMPORT_NAME: t.identifier("myModule"),
  SOURCE: t.stringLiteral("my-module")
});

console.log(generate(ast).code);
var myModule = require("my-module");
```

### 3.5babel-generator

Babel Generator模块是 Babel 的代码生成器，它读取AST并将其转换为代码和源码映射（sourcemaps）

```js
function (ast: Object, opts: Object, code: string): {code, map} 
```

- 第二个参数只有设置sourceMaps：true，才会开启sourcemap

运行以下命令来安装它：

```
$ npm install --save babel-generator
```

然后按如下方式使用：

```js
import * as babylon from "babylon";
import generate from "babel-generator";

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

generate(ast, {
  retainLines: false,
  sourceMaps：true,
  compact: "auto",
  concise: false,
  quotes: "double",
  // ...
}, code)
```

#### sourcemap

babel 对源码进行了修改，生成的目标代码可能改动很大，如果直接调试目标代码，想手动定位回源码比较难。所以需要一种自动关联源码的方式，就是 sourcemap

##### **sourcemap的作用**

**（1）调试代码的时候定位到源码**

chrome、firefox 等浏览器支持在文件末尾加上[一行注释](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FTools%2FDebugger%2FHow_to%2FUse_a_source_map)

~~~js
//# sourceMappingURL=http://example.com/path/to/your/sourcemap.map

```
可以通过 url 的方式或者转成 base64 内联的方式来关联 sourcemap。调试工具（浏览器、vscode 等会自动解析 sourcemap，关联到源码。这样打断点、错误堆栈等都会对应到相应源码。
~~~

**(2)线上报错定位到源码**

开发时会使用 sourcemap 来调试，但是生产可不会，要是把 sourcemap 传到生产算是大事故了。但是线上报错的时候确实也需要定位到源码，这种情况一般都是**单独上传 sourcemap 到错误收集平台**。

##### sourcemap的格式

```js
{
　　version : 3,
   file: "out.js",  
   sourceRoot : "",
   sources: ["foo.js", "bar.js"],
   names: ["src", "maps", "are", "fun"],
   mappings: "AAgBC,SAAQ,CAAEA"
}
```

- version：source map的版本，目前为3。

- file：转换后的文件名。

- sourceRoot：转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空。

- sources：转换前的文件。该项是一个数组，因为可能是多个源文件合并成一个目标文件。

- names：转换前的所有变量名和属性名，把所有变量名提取出来，下面的 mapping 直接使用下标引用，可以减少体积。

- mappings：转换前代码和转换后代码的映射关系的集合，用分号代表一行，每行的 mapping 用逗号分隔。

  ![img](https://tva1.sinaimg.cn/large/e6c9d24egy1h2ktnm6a1fj21080fzgmd.jpg)

##### source-map生成sourcemap

source-map 暴露了三个类：

-  SourceMapConsumer：消费sourcemap
- SourceMapGenerator：生成sourcemap
- SourceNode ：创建源码节点

###### （1）生成sourcemap

​	生成 sourcemap 的流程是：

1. **创建一个 SourceMapGenerator 对象**
2. **通过 addMapping 方法添加一个映射**
3. **通过 toString 转为 sourcemap 字符串**

```js
var map = new SourceMapGenerator({
  file: "source-mapped.js"
});

map.addMapping({
  generated: {
    line: 10,
    column: 35
  },
  source: "foo.js",
  original: {
    line: 33,
    column: 2
  },
  name: "christopher"
});

console.log(map.toString());
// '{"version":3,"file":"source-mapped.js",
//   "sources":["foo.js"],"names":["christopher"],"mappings":";;;;;;;;;mCAgCEA"}'
```

###### （2）消费sourcemap

SourceMapConsumer.with 的回调里面可以拿到 consumer 的 api，调用 originalPositionFor 和 generatedPositionFor 可以分别用目标代码位置查源码位置和用源码位置查目标代码位置。还可以通过 eachMapping 遍历所有 mapping，对每个进行处理

```js
const rawSourceMap = {
  version: 3,
  file: "min.js",
  names: ["bar", "baz", "n"],
  sources: ["one.js", "two.js"],
  sourceRoot: "http://example.com/www/js/",
  mappings: "CAAC,IAAI,IAAM,SAAUA,GAClB,OAAOC,IAAID;CCDb,IAAI,IAAM,SAAUE,GAClB,OAAOA"
};

const whatever = await SourceMapConsumer.with(rawSourceMap, null, consumer => {
   // 目标代码位置查询源码位置
  consumer.originalPositionFor({
    line: 2,
    column: 28
  })
  // { source: 'http://example.com/www/js/two.js',
  //   line: 2,
  //   column: 10,
  //   name: 'n' }
  
  // 源码位置查询目标代码位置
  consumer.generatedPositionFor({
    source: "http://example.com/www/js/two.js",
    line: 2,
    column: 10
  })
  // { line: 2, column: 28 }
  
  // 遍历 mapping
  consumer.eachMapping(function(m) {
    // ...
  });

  return computeWhatever();
});
```

#### 代码原理

**（一）首先定义一个 Printer 类做打印，实现每种 AST 的打印逻辑：**

```js
class Printer {
    constructor (source, fileName) {
        this.buf = '';
        this.printLine = 1;
        this.printColumn = 0;
    }

    addMapping(node) {
        // 待实现
    }

    space() {
        this.buf += ' ';
        this.printColumn ++;
    }

    nextLine() {
        this.buf += '\n';
        this.printLine ++;
        this.printColumn = 0;
    }

    Program (node) {
        this.addMapping(node);
        node.body.forEach(item => {
            this[item.type](item) + ';';
            this.printColumn ++;
            this.nextLine();
        });
    }

    VariableDeclaration(node) {
        if(!node.declarations.length) {
            return;
        }
        this.addMapping(node);

        this.buf += node.kind;
        this.space();
        node.declarations.forEach((declaration, index) => {
            if (index != 0) {
                this.buf += ',';
                this.printColumn ++;
            }
            this[declaration.type](declaration);
        });
        this.buf += ';';
        this.printColumn ++;

    }
    VariableDeclarator(node) {
        this.addMapping(node);
        this[node.id.type](node.id);
        this.buf += '=';
        this.printColumn ++;
        this[node.init.type](node.init);
    }
    Identifier(node) {
        this.addMapping(node);
        this.buf += node.name;
    }
    FunctionDeclaration(node) {
        this.addMapping(node);

        this.buf += 'function ';
        this.buf += node.id.name;
        this.buf += '(';
        this.buf += node.params.map(item => item.name).join(',');
        this.buf += '){';
        this.nextLine();
        this[node.body.type](node.body);
        this.buf += '}';
        this.nextLine();
    }
    CallExpression(node) {
        this.addMapping(node);

        this[node.callee.type](node.callee);
        this.buf += '(';
        node.arguments.forEach((item, index) => {
            if(index > 0 ) this.buf += ', ';
            this[item.type](item);
        })
        this.buf += ')';

    }
    ExpressionStatement(node) {
        this.addMapping(node);

        this[node.expression.type](node.expression);

    }
    ReturnStatement(node) {
       this.addMapping(node);

        this.buf += 'return ';
        this[node.argument.type](node.argument); 

    }
    BinaryExpression(node) {
       this.addMapping(node);

        this[node.left.type](node.left);
        this.buf += node.operator;
        this[node.right.type](node.right);

    }
    BlockStatement(node) {
       this.addMapping(node);

        node.body.forEach(item => {
            this.buf += '    ';
            this.printColumn += 4;
            this[item.type](item);
            this.nextLine();
        });

    }
    NumericLiteral(node) {
       this.addMapping(node);

        this.buf += node.value;

    }
}
```

我们**在打印的时候记录了 printLine、printColumn 的信息**，也就是当前打印到了第几行，这样**在 addMapping 里面就可以拿到 AST 在目标代码中的位置**，而**源码位置是在 parse 的时候记录到 loc 属性**的，有了**这两个位置就可以生成一个 mapping**。

**（二）生成sourcemap（用 source-map 包）**

```js
const { SourceMapGenerator } = require('source-map');

class Printer {
    constructor (source, fileName) {
        this.buf = '';
  
        this.sourceMapGenerator = new SourceMapGenerator({
            file: fileName + ".map.json",
        });
        this.fileName = fileName;
        this.sourceMapGenerator.setSourceContent(fileName, source);

        this.printLine = 1;
        this.printColumn = 0;
    }
}
```

**（三）实现addMapping方法**

```js
addMapping(node) {
    if (node.loc) {
        this.sourceMapGenerator.addMapping({
            generated: {
              line: this.printLine,
              column: this.printColumn
            },
            source: this.fileName,
            original: node.loc && node.loc.start
        })
    }
}
```

**（四）定义 Generator 类，在 generate 方法里面调用 printer 的打印逻辑来生成目标代码，并且调用 this.sourceMapGenerator.toString() 来生成 sourcemap**

```js
class Generator extends Printer{

    constructor(source, fileName) {
        super(source, fileName);
    }

    generate(node) {
        this[node.type](node);

        return {
            code: this.buf,
            map: this.sourceMapGenerator.toString()
        }
    }
}
```

**（五）暴露出 generate 的 api：**

```js
function generate (node, source, fileName) {
    return new Generator(source, fileName).generate(node);
}
```

<!--可以在生成的代码中添加 sourceMappingURL 就可以映射回源码，可以通过打断点或者运行代码 throw error 的方式来测试 测试 sourcemap的功能-->

```
//# sourceMappingURL=./xxx.map.json
```

### 3.6@babel/code-frame

当有错误信息要打印的时候，需要打印错误位置的代码，可以使用`@babel/code-frame`

```js
const result = codeFrameColumns(rawLines, location, {
  /* options */
});

//options 可以设置 highlighted （是否高亮）、message（展示啥错误信息）
```

```js
const { codeFrameColumns } = require("@babel/code-frame");

try {
 throw new Error("xxx 错误");
} catch (err) {
  console.error(codeFrameColumns(`const name = guang`, {
      start: { line: 1, column: 14 }
  }, {
    highlightCode: true,
    message: err.message
  }));
}
```

### 3.7@babel/core

 `@babel/core` 包是基于整个编译流程，从源码到目标代码，生成 sourcemap

**（1）同步transform**

```js
//1、从源代码生成目标代码和sourcemap
transformSync(code, options); // => { code, map, ast }

//2、从源代码文件生成目标代码和sourcemap
transformFileSync(filename, options); // => { code, map, ast }

//3、从源代码AST开始生成目标代码和sourcemap
transformFromAstSync(
  parsedAst,
  sourceCode,
  options
); // => { code, map, ast }
```

- options 主要配置 plugins 和 presets，指定具体要做什么转换

**（2）异步transform**

异步编译，返回一个promise

```js
//1、
transformAsync("code();", options).then(result => {})
//2、
transformFileAsync("filename.js", options).then(result => {})
//3、
transformFromAstAsync(parsedAst, sourceCode, options).then(result => {})
```

**代码原理**

transformSync 封装了 parse、traverse、generate 的逻辑，并且还实现了插件和 preset 机制

插件是一个函数返回包含 visitor 的对象，我们只要把各种通过 options 传入的插件，在 transformSync 里面合并，之后把合并后的 visitors 传入 traverse 方法就可以了

而 preset 是插件的集合，调用函数返回插件数组，之后再调用插件返回 visitor 等，然后 visitor，调用 traverse。

此外要注意的是 babel 插件的顺序是先 plugin 后 preset，plugin 从前往后、preset 从后往前

（一）建立template模板

```js
const parser = require('../parser');

function template(code) {
    return parser.parse(code, {
        plugins: ['literal']
    });
}
template.expression = function(code) {
    const node =  template(code).body[0].expression;
    node.loc = null;
    return node;
}

module.exports = template;
```

（二）集成代码



## 4、插件plugin

插件用于babel转译过程（尤其transfrom）

babel 的 plugin 是在配置文件里面通过 plugins 选项配置，值为字符串或者数组。

```javascript
{
  "plugins": ["pluginA", ["pluginB"], ["pluginC", {/* options */}]]
}

```

如果需要传参就用数组格式，第二个元素为参数

### plugin的格式

babel plugin 有两种格式：

#### **（1）返回对象的函数**

第一种是**一个函数返回一个对象的格式**，对象里有 visitor、pre、post、inherits、manipulateOptions 等属性

```js
export default function(api, options, dirname) {
  return {
    inherits: parentPlugin,
    manipulateOptions(options, parserOptions) {
        options.xxx = '';
    },
    pre(file) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path, state) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(file) {
      console.log(this.cache);
    }
  };
} 
```

**插件函数有3个参数：**

- api：包含了各种 babel 的 api，比如 types、template 等，这些包就不用在插件里单独单独引入了，直接取来用就行。
- options：外面传入的参数
- dirname：目录名

**返回的对象：**

- inherits 指定继承某个插件，和当前插件的 options 合并，通过 Object.assign 的方式

- visitor 指定 traverse 时调用的函数

- pre 和 post 分别在遍历前后调用，可以做一些插件调用前后的逻辑，比如可以往 file（表示文件的对象，在插件里面通过 state.file 拿到）中放一些东西，在遍历的过程中取出来

- manipulateOptions 用于修改 options，是在插件里面修改配置的方式，比如 syntaxt plugin一般都会修改 parser options：

  ![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2512f37b312a4c1a8ddb4c59c4a8f09f~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

插件做的事情就是通过 api 拿到 types、template 等，通过 state.opts 拿到参数，然后通过 path 来修改 AST。可以通过 state 放一些遍历过程中共享的数据，通过 file 放一些整个插件都能访问到的一些数据，除了这两种之外，还可以通过 this 来传递本对象共享的数据

#### （2）对象

直接写一个对象，不用函数包裹，这种方式用于不需要处理参数的情况

```js
export default plugin =  {
    pre(state) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path, state) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(state) {
      console.log(this.cache);
    }
};
```

### 单元测试

三种方式：

（1）测试转换后的 AST，是否符合预期

（2）测试转换后生成的代码，是否符合预期（如果代码比较多，可以存成快照，进行快照对比）

（3）转换后的代码执行一下，测试是否符合预期

#### AST测试

```js
it('包含guang', () => {
  const {ast} = babel.transform(input, {plugins: [plugin]});
  const program = ast.program;
  const declaration = program.body[0].declarations[0];
  assert.equal(declaration.id.name, 'guang');// 判断 AST 节点的值
});
```

#### 生成代码的快照测试

```js
it('works', () => {
  const {code} = babel.transform(input, {plugins: [plugin]});
  expect(code).toMatchSnapshot();
});
```

babel对此方法进行了封装，提供babel-plugin-tester 包

##### babel-plugin-tester

babel-plugin-tester 就是对比生成的代码的方式，有三种对比方式：

- 直接对比字符串
- 指定输入和输出的代码文件和实际执行结果对比
- 生成快照对比快照

**比较少的内容可以直接对比字符串**，**内容比较多的时候可以使用快照测试**，**或者指定输出内容，然后对比测试**

#### 执行测试

```js
it('替换baz为foo', () => {
  var input = `
    var foo = 'guang';
    // 把baz重命名为foo
    var res = baz;
  `;
  var {code} = babel.transform(input, {plugins: [plugin]});
  var f = new Function(`
    ${code};
    return res;
  `);
  var res = f();
  assert(res === 'guang', 'res is guang');
});
```



## 4、preset

**预设的插件集**，plugin 是单个转换功能的实现，当 plugin 比较多或者 plugin 的 options 比较多的时候就会导致使用成本升高。这时候可以封装成一个 preset，用户可以通过 preset 来批量引入 plugin 并进行一些配置。preset 就是对 babel 配置的一层封装

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/112d501d641b4e509bd37d821489d72c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

preset 格式和 plugin 一样，也是可以是一个对象，或者是一个函数，函数的参数也是一样的 api 和 options，区别只是 **preset 返回的是配置对象，包含 plugins、presets 等配置**。

```js
export default function(api, options) {
  return {
      plugins: ['pluginA'],
      presets: [['presetsB', { options: 'bbb'}]]
  }
}

//或者
export default obj = {
      plugins: ['pluginA'],
      presets: [['presetsB', { options: 'bbb'}]]
}
```

### ConfigItem

@babel/core 的包提供了 createConfigItem 的 api，用于创建配置项。我们之前都是字面量的方式创建的，当需要把配置抽离出去时，可以使用 createConfigItem

```js
const pluginA = createConfigItem('pluginA);
const presetB = createConfigItem('presetsB', { options: 'bbb'})

export default obj = {
      plugins: [ pluginA ],
      presets: [ presetB ]
  }
}
```

### preset应用顺序

babel 会按照如下顺序处理插件和 preset：

1. **先应用 plugin，再应用 preset**
2. **plugin 从前到后，preset 从后到前**

### babel插件名称格式

babel 对插件名字的格式有一定的要求，比如最好包含 babel-plugin，如果不包含的话也会自动补充。

babel plugin 名字的补全有这些规则：

- 如果是 ./ 开头的**相对路径，不添加 babel plugin**，比如 ./dir/plugin.js
- 如果是**绝对路径，不添加 babel plugin**，比如 /dir/plugin.js
- 如果是**单独的名字 aa**，**会添加为 babel-plugin-aa**，所以插件名字可以简写为 aa
- 如果是**单独的名字 aa**，但**以 module 开头**，则**不添加 babel plugin**，比如 module:aa
- 如果 **@scope 开头**，**不包含 plugin**，则会**添加 babel-plugin**，比如 @scope/mod 会变为 @scope/babel-plugin-mod
- babel 自己的 **@babel 开头的包**，会**自动添加 plugin**，比如 @babel/aa 会变成 @babel/plugin-aa

写的 babel 插件最好是 babel-plugin-xx 和 @scope/babel-plugin-xx 这两种，就可以简单写为 xx 和 @scope/xx。

### babel内置插件

#### 1、syntax plugin

syntax plugin 只是在 parserOptions 中放入一个 flag 让 parser 知道要 parse 什么语法

最终的 parse 逻辑还是 babel parser（babylon） 实现的

```js
import { declare } from "@babel/helper-plugin-utils";

export default declare(api => {
  api.assertVersion(7);

  return {
    name: "syntax-function-bind",

    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("functionBind");
    },
  };
});
```

#### 2、transform plugin

transform plugin 是对 AST 的转换，各种 es20xx 语言特性、typescript、jsx 等的转换都是在 transform plugin 里面实现的

有的时候需要结合 syntax plugin 和 transform plugin， 例如：

-  typescript 的语法解析要使用 @babel/plugin-syntax-typescript 在 parserOptions 放入解析 typescript 语法的选项，然后使用 @babel/plugin-transform-typescript 来转换解析出的 typescript 对应的 AST 的转换。
  - 可直接使用 @babel/preset-typescript，它对上面两个插件做了封装

#### 3、proposal plugin

未加入语言标准的特性的 AST 转换插件叫 proposal plugin（本质上也是transform plugin，只是为了区分语言标准的特性）

完成 proposal 特性的支持，有时同样需要 综合 syntax plugin 和 proposal plugin，例如：

-  function bind （:: 操作符）就需要同时使用 @babel/plugin-syntax-function-bind 和 @babel/plugin-proposal-function-bind

### babel-preset的插件

- 不同版本的**语言标准支持**： preset-es2015、preset-es2016 等，**babel7 后用 preset-env 代替**（解决版本升级配置频繁的问题）
- **未加入标准的语言特性的支持**： 用于 stage0、stage1、stage2 的特性，**babel7 后使用plugin-proposal-xx代替 **（解决版本升级配置频繁的问题）
- **用于 react、jsx、flow 的支持**：分别封装相应的插件为 preset-react、preset-jsx、preset-flow，直接使用对应 preset 即可

#### @babel/preset-env

作用： **按照目标环境按需引入插件**

```js
{
    "presets": [["@babel/preset-env", { "targets": "> 0.25%, not dead" }]]
}
```

**前提条件：**

1、babel7 在 @babel/compat-data 这个包里面维护了这种特性到环境支持版本的映射关系，包括 [plugin 实现的特性的版本支持情况](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbabel%2Fbabel%2Fblob%2Fmain%2Fpackages%2Fbabel-compat-data%2Fdata%2Fplugins.json)（包括 transform 和 proposal ），也包括 [corejs 所 polyfill 的特性的版本支持情况](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbabel%2Fbabel%2Fblob%2Fmain%2Fpackages%2Fbabel-compat-data%2Fdata%2Fcorejs2-built-ins.json)

2、借助 browerslist 的query查询对应环境版本

有了 @babel/compat-data 的数据，那么只要用户指定他的目标环境是啥就可以了，这时候可以用 browserslist 的 query 来写，比如 `last 1 version, > 1%` 这种字符串，babel 会使用 brwoserslist 来把它们转成目标环境具体版本的数据

##### @babel/preset-env 的配置

###### （1）targets

配 query 或者直接指定环境版本（query 的结果也是环境版本）

环境包括：chrome, opera, edge, firefox, safari, ie, ios, android, node, electron

- 指定query：

  ```js
  {
    "targets": "> 0.25%, not dead"
  }
  ```

- 指定版本环境

  ```js
  {
    "targets": {
      "chrome": "58",
      "ie": "11"
    }
  }
  
  ```

- 指定支持 es module 的环境

  ```js
  {
      "targets": {
          "esmodules": true
      }
  }
  ```

###### （2）include & exclude

通过 targets 的指定，babel 会自动引入[一些插件](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fbabel%2Fbabel%2Fblob%2Fmaster%2Fpackages%2Fbabel-compat-data%2Fscripts%2Fdata%2Fplugin-features.js)，但当**需要手动指定要 include 或者 exclude 什么插件**的时候可以使用这个 option

**只针对 transform plugin**，对于 proposal plugin，要在 plugins的 option 单独引入

###### （3）modules

modules 是**指定目标模块规范**，取值有 amd、umd、systemjs、commonjs (cjs)、auto、false：

- amd、umd、systemjs、commonjs (cjs) ：分别指定不同的目标模块规范
- false 是不转换模块规范
- auto 则是自动探测，默认值也是这个

<!--其实一般这个 option 都是 bundler 来设置的，因为 bundler 负责模块转换，自然知道要转换成什么模块规范。我们平时就用默认值 auto 即可-->

###### （4）debug

`debug :true /false`，作用：

babel 会根据 targets 支持的特性来过滤 transform plugins 和 polyfills（core-js）

想知道最终使用的 transform plugin 和引入的 core-js 模块是否对，那就可以把 debug 设为 true，这样在控制台打印这些数据

##### 自动引入profill

配置 corejs 和 useBuiltIns：

- corejs ： babel 7 所用的 polyfill，需要指定下版本，corejs 3 才支持实例方法（比如 Array.prototype.fill ）的 polyfill。
- useBuiltIns：使用 polyfill （corejs）的方式，有三种：
  - entry：在入口处全部引入
  - usage：每个文件引入用到的
  - false：不引入

```js
{
    "presets": [["@babel/preset-env", { 
        "targets": "> 0.25%, not dead",
        "useBuiltIns": "usage",// or "entry" or "false"
        "corejs": 3
    }]]
}
```

- babel8为了解决 @babel/plugin-transform-runtime 不支持 targets 的配置，容易做一些多余的转换和 polyfill，将useBuiltIns变为4种：
  - entry-global: 这个和之前的 useBuiltIns: entry 对标，就是全局引入 polyfill
  - usage-entry: 这个和 useBuiltIns: usage 对标，就是具体模块引入用到的 polyfill
  - usage-pure：这个就是之前需要 transform-runtime 插件做的事情，使用不污染全局变量的 pure 的方式引入具体模块用到的 polyfill

​	这样**babel8 不再需要 transform-runtime 插件了**

### helper

helper的作用：插件之间**共享逻辑**的机制

helper 分为两种：

- 一种是注入到 AST 的运行时用的全局函数（用于 runtime 的 helper ）
- 一种是操作 AST 的工具函数，比如变量提升这种通用逻辑

**babel helpers 用于 babel plugin 逻辑复用的一些工具函数，分为用于注入 runtime 代码的 helper 和用于简化 AST 操作 的 helper两种。第一种都在 @babel/helpers 包里，直接 this.addHelper(name) 就可以引入， 而第二种需要手动引入包和调用 api**

#### 1、注入到 AST 的全局函数

例如：

```js
class Guang {}

//会被转换成
function _classCallCheck(instance, Constructor) {
  //...
}

var Guang = function Guang() {
  _classCallCheck(this, Guang);
};
```

#### 2、操作 AST 的工具函数

变量提升案例：

```js
const hoistVariables = require('@babel/helper-hoist-variables').default;

cosnt plugin = function () {
    visitor: {
        VariableDeclaration(path) {
            hoistVariables(path.parentPath, (id) => {
                path.scope.parent.push({
                    id: path.scope.generateUidIdentifier(id.name)
                });
                return id;
            }, 'const' );
        }
    }
}

//当输入为：
function func(){
    const a = 1;
    const b = 2;
}

//输出为：
var _a, _b;

function func() {
  a = 1;
  b = 2;
}
```

**在代码中加入模块引入和变量声明的代码案例：**

~~~js
const importModule = require('@babel/helper-module-imports');

cosnt plugin = function ({ template }) {
    visitor: {
        Program(path) {
            const reactIdentifier = importModule.addDefault(path, 'lodash',{
                nameHint: '_'
            });
            path.node.body.push(template.ast(`const get = _.get`));
        }
    }
}

```
var _ = _interopRequireDefault(require("lodash")).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const get = _.get;
~~~

## 5、polyfill

`Babel` 只负责 转换 `syntax` , `includes,map,includes` 这些 `API` 层面的 怎么办, `Babel` 把这个放在了 单独放在了 `polyfill` 这个模块处理

**通过 `syntax transform` + `api polyfill`，我们就能在目标环境用高版本 javascript 的语法和 api**

**使用方法：**

1、先安装包： npm install --save babel-polyfill

2、要确保**在入口处导入polyfill**，因为polyfill代码需要在所有其他代码前先被调用
 1、代码方式： `import "babel-polyfill"`
2、 webpack配置： `module.exports = { entry: ["babel-polyfill", "./app/js"] };`

## 6、runtime

https://zhuanlan.zhihu.com/p/58624930

解决profill会污染全局环境的问题（因为新的原生对象、API这些都直接由polyfill引入到全局环境）

由于runtime不会污染全局空间，所以**实例方法是无法工作的**

babel runtime 里面放**运行时加载的模块**，会被打包工具打包到产物中，下面放着各种需要在 runtime 使用的函数，包括三部分：

- regenerator： facebook 实现的 aync 的 runtime 库，babel 使用 **[regenerator-runtime](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ffacebook%2Fregenerator%2Ftree%2Fmaster%2Fpackages%2Fruntime)来支持实现 async await** 的支持
- corejs：**新的 api 的 polyfill**
- helper：babel 做**语法转换时用到的函数**，比如 _typeof、_extends 等

### transform-runtime和babel-runtime

babel-plugin-transform-runtime插件依赖babel-runtime，babel-runtime是真正提供runtime环境的包；也就是说transform-runtime插件是把js代码中使用到的新原生对象和静态方法转换成对runtime实现包的引用

举个例子如下：

```dart
// 输入的ES6代码
var sym = Symbol();
// 通过transform-runtime转换后的ES5+runtime代码 
var _symbol = require("babel-runtime/core-js/symbol");
var sym = (0, _symbol.default)();
```

### transform-runtime插件的功能

babel-runtime就是一个提供了regenerator、core-js和helpers的运行时库：

1、把代码中的使用到的**ES6引入的新原生对象和静态方法**用**babel-runtime/core-js导出的对象和方法**替代

2、当使用**generators或async函数**时，用**babel-runtime/regenerator导出的函数取代**（类似polyfill分成regenerator和core-js两个部分）

3、把Babel生成的**辅助函数**改为用**babel-runtime/helpers导出的函数**来替代（babel默认会在每个文件顶部放置所需要的辅助函数，如果文件多的话，这些辅助函数就在每个文件中都重复了，通过引用babel-runtime/helpers就可以统一起来，减少代码体积）

### 通过core-js实现按需引入polyfill或runtime

polyfill和runtime都是对core-js和regenerator的再封装

### core-js的组织结构

**1、三种使用方式**

- 默认方式：require('core-js')
   这种方式包括全部特性，标准的和非标准的
- 库的形式： var core = require('core-js/library')
   这种方式也包括全部特性，只是它不会污染全局名字空间
- 只是shim： require('core-js/shim')或var shim = require('core-js/library/shim')
   这种方式只包括标准特性（就是只有polyfill功能，没有扩展的特性）

**2、core-js按需使用**

1、类似polyfill，直接把特性添加到全局环境，这种方式体验最完整

```jsx
require('core-js/fn/set');
require('core-js/fn/array/from');
require('core-js/fn/array/find-index');

Array.from(new Set([1, 2, 3, 2, 1])); // => [1, 2, 3]
[1, 2, NaN, 3, 4].findIndex(isNaN);   // => 2
```

2、类似runtime一样，以库的形式来使用特性，这种方式不会污染全局名字空间，但是不能使用实例方法

```jsx
var Set       = require('core-js/library/fn/set');
var from      = require('core-js/library/fn/array/from');
var findIndex = require('core-js/library/fn/array/find-index');

from(new Set([1, 2, 3, 2, 1]));      // => [1, 2, 3]
findIndex([1, 2, NaN, 3, 4], isNaN); // => 2
```

3、因为第二种库的形式不能使用prototype方法，所以第三种方式使用了一个小技巧，通过::这个符号而不是.来调用实例方式，从而达到曲线救国的目的。这种方式的使用，路径中都会带有/virtual/

```jsx
import {fill, findIndex} from 'core-js/library/fn/array/virtual';

Array(10)::fill(0).map((a, b) => b * b)::findIndex(it => it && !(it % 8)); // => 4

// 对比下polyfill的实现 
// Array(10).fill(0).map((a, b) => b * b).findIndex(it => it && !(it % 8));
```

# 三、工作原理

babel 的主要编译流程是 parse、transform、generate。

- parse 是把源码转成 AST
- transform 是对 AST 做增删改
- generate 是打印 AST 成目标代码并生成 sourcemap

![img](https://p1-live.byteimg.com/tos-cn-i-gjr78lqtd0/b5593cd709e643cb94d1f70161494fcb~tplv-gjr78lqtd0-image.image)

![img](https://tva1.sinaimg.cn/large/e6c9d24egy1h2ii5opgffj20ly0waab9.jpg)

注意：**新标准引入的新的原生对象，部分原生对象新增的原型方法，新增的API等（如Proxy、Set等），这些babel是不会转译的。需要用户自行引入polyfill来解决**

# 四、编写一个简单的Babel

**目录结构：**

```
|-- index.js  程序入口
|-- plugin.js 插件实现
|-- before.js 转化前代码
|-- after.js  转化后代码
|-- package.json 
```

1、新建package.json

```js
{
  "name": "babelDemo",
  "version": "1.0.0",
  "description": "create babel plugin demo",
  "main": "index.js",
  "scripts": {
    "babel": "node ./index.js"
  },
  "author": "yangyanni",
  "license": "MIT",
  "devDependencies": {
    "@babel/core": "^7.2.2"
  }
}
```

2、新建index.js

```js
const { transform } = require('@babel/core');

const fs = require('fs');

//读取需要转换的js字符串
const before = fs.readFileSync('./before.js', 'utf8');

//使用babel-core的transform API 和插件进行字符串->AST转化。
const res = transform(`${before}`, {
  plugins: [require('./plugin')]
});

// 存在after.js删除
fs.existsSync('./after.js') && fs.unlinkSync('./after.js');
// 写入转化后的结果到after.js
fs.writeFileSync('./after.js', res.code, 'utf8');
```



# 五、babel cli 原理

- 通过 commander 解析命令行参数，拿到 outDir（输出目录）、watch（是否监听）以及 glob 字符串
- 解析 glob 字符串，拿到要编译的文件路径
- 查找配置文件，拿到配置信息
- 依次编译每一个文件，传入配置信息，输出到 outDir 目录，并且添加 sourcemap 的关联
- 如果开启了 watch，则监听文件变动，每次变动都重新编译该文件

**（一）引入 commander，声明 outDir、watch 等参数：**

```js
const commander = require('commander');

commander.option('--out-dir <outDir>', '输出目录');
commander.option('--watch', '监听文件变动');

commander.parse(process.argv);
```

对传入的参数 process.argv 做 parse 之后就可以拿到具体的值：

比如我们传入：

```shell
my-babel ./input/*.js --out-dir ./dist --watch
```

在代码里就可以拿到

```javascript
const cliOpts = commander.opts();

cliOptions.outDir;// ./dist
cliOptions.watch // true
commander.args[0] // ./input/*.js
```

我们要对输入的参数做下校验，然后打印提示信息：

```javascript
if (process.argv.length <=2 ) {
    commander.outputHelp();
    process.exit(0);
}

const cliOpts = commander.opts();

if (!commander.args[0]) {
    console.error('没有指定待编译文件');
    commander.outputHelp();
    process.exit(1);
}

if(!cliOpts.outDir) {
    console.error('没有指定输出目录');
    commander.outputHelp();
    process.exit(1);
}

if(cliOpts.watch) {
    const chokidar = require('chokidar');
    chokidar.watch(commander.args[0]).on('all', (event, path) => {
        console.log('检测到文件变动，编译：' + path);
        compile([path]);
    });
}
```

**（二）接下来，我们对 glob 字符串做解析，拿到具体的文件路径：**

```
const filenames = glob.sync(commander.args[0]);
```

然后查找配置文件：

```javascript
const explorerSync = cosmiconfigSync('myBabel');
const searchResult = explorerSync.search();
```

**（三）通过 options 来集中存放命令行参数和解析后的配置文件的参数：**

```javascript
const options = {
    babelOptions: searchResult.config,
    cliOptions:  {
        ...cliOpts,
        filenames
    }
}
```

**（四）定义一个 compile 方法，传入文件路径的数组，然后，对每个文件的内容进行读取，然后进行编译，之后输出到目标目录**

```js
function compile(fileNames) {
    fileNames.forEach(async filename => {
        const fileContent = await fsPromises.readFile(filename, 'utf-8');
        const baseFileName = path.basename(filename);
        const sourceMapFileName = baseFileName + '.map.json';

        const res = myBabel.transformSync(fileContent, {
            ...options.babelOptions,
            fileName: baseFileName
         });
         const generatedFile = res.code + '\n' + '//# sourceMappingURL=' + sourceMapFileName;
        
        //如果目录不存在则创建
         try {
            await fsPromises.access(options.cliOptions.outDir);
         } catch(e) {
            await fsPromises.mkdir(options.cliOptions.outDir);
         }
         // 拼接输出的路径
         const distFilePath = path.join(options.cliOptions.outDir, baseFileName);
         const distSourceMapPath = path.join(options.cliOptions.outDir, baseFileName + '.map.json');
 
         await fsPromises.writeFile(distFilePath, generatedFile);
         await fsPromises.writeFile(distSourceMapPath, res.map);
     })
}
```

