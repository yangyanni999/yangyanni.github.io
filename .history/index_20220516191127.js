#!/usr/bin/env node
// import sum from './app'
// const result = sum(1, 2)
// console.log('结果为'+result)
const path= require('path')
console.log(this.replaceSlash('./'+path.relative(process.cwd())))