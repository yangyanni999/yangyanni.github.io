module.exports = function({ types: t }) {
  return {
   //访问者
    visitor: {
     //我们需要操作的访问者方法(节点)
      VariableDeclaration(path) {
        //该路径对应的节点
        const node = path.node;
        //判断节点kind属性是let或者const,转化为var
        ['let', 'const'].includes(node.kind) && (node.kind = 'var');
      }
    }
  };
};