const { transform } = require('@babel/core');
const parser = require('@babel/parser')
const generator = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const t =require('@babel/types')
const fs = require('fs');

//读取需要转换的js字符串
const before = fs.readFileSync('./before.js', 'utf8');

//parser生成AST语法树
const ast = parser.parse(before, {
  sourceType: 'unambiguous'
})

//修改ast

traverse(ast, {
  //将let转为var
  VariableDeclaration(path) {
    //该路径对应的节点
    const node = path.node;
    ['let', 'const'].includes(node.kind) && (node.kind = 'var');
  },

  //将箭头函数转为普通函数
  ArrowFunctionExpression(path) {
    //该路径对应的节点信息
     let { id, params, body, generator, async } = path.node;
     //解决 {return a}和简写
    if (!t.isBlockStatement(body)) {
      const node = t.returnStatement(body);
      body = t.blockStatement([node]);
    }
    path.replaceWith(t.functionExpression(id, params, body, generator, async));
  },

  //在console打印日志中加入位置
  CallExpression(path, state) {

    if (t.isMemberExpression(path.node.callee) && path.node.callee.object.name == 'console' && ['error', 'log', 'info', 'debug'].includes(path.node.callee.property.name)) {
      const { line, column } = path.node.loc.start
      console.log(path.node.arguments[0])
      path.node.arguments[0].value='1'+path.node.arguments[0].value
    }
}
})


//将ast转换为code
const { code }=generator(ast)

// 存在after.js删除
fs.existsSync('./after.js') && fs.unlinkSync('./after.js');
// 写入转化后的结果到after.js
fs.writeFileSync('./after.js', code, 'utf-8');