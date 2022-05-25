const generator = require('@babel/generator').default
module.exports = function ({ types: t }) {
  const consoleName=['error', 'log', 'info', 'debug'].map(item=>`console.${item}`)
  return {
   //访问者
    visitor: {
     //将let转为var
      VariableDeclaration(path) {
        //该路径对应的节点
        const node = path.node;
        console.log(path.scope)
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

    if (consoleName.includes(generator(path.node.callee).code)) {
      const { line, column } = path.node.loc.start

      path.node.arguments.unshift(t.stringLiteral(`location:${line},${column}`))
    }
}
    }
  };
};