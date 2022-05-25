module.exports = function({ types: t }) {
  return {
   //访问者
    visitor: {
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

       }
    }
  };
};