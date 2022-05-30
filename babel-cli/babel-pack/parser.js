const acorn = require("acorn");


 //配置parse要解析的语法
const syntaxPlugins = {
    'literal': require('../plugin/literal'),
    'guangKeyword': require('../plugin/guangKeyword')
}


const defaultOptions = {
    plugins: []
}

function parse(code, options) {
  const resolvedOptions = Object.assign({}, defaultOptions, options); //合并options
  //遍历插件，返回新parser
    const newParser = resolvedOptions.plugins.reduce((Parser, pluginName) => {
        let plugin = syntaxPlugins[pluginName]
        return plugin ? Parser.extend(plugin) : Parser;
    }, acorn.Parser);


    return newParser.parse(code, {
        locations: true  //设置locations为true，保留AST在源码中的位置，便于生成sourcemap
    });
}

module.exports = {
    parse
}