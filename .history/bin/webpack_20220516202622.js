#!/usr/bin/env node
const path = require('path')
const config = require(path.resolve('webpack.config.js'))
const Compiler = require('../lib/Compiler')
//执行打包
new Compiler(config).start()