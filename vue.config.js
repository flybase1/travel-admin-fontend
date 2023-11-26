// const { defineConfig } = require("@vue/cli-service");
// module.exports = defineConfig({
//   transpileDependencies: true,
// });
const webpack = require("webpack");

const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false,

  chainWebpack(config) {
    // 创建命名规则
    config.module
      // 规则
      .rule("svg")
      // 忽略
      .exclude.add(resolve("src/icons"))
      // 结束
      .end();
    // 具体命名规则
    config.module
      // 规则
      .rule("icons")
      // 正则解析 .svg格式
      .test(/\.svg$/)
      //解析的文件
      .include.add(resolve("src/icons"))
      // 结束
      .end()
      //新增解析loader
      .use("svg-sprite-loader")
      // 具体的loader
      .loader("svg-sprite-loader")
      // loader具体配置
      .options({
        symbolId: "icon-[name]",
      })
      // 结束
      .end();
    config
      .plugin("ignore")
      .use(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
      );
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
};
