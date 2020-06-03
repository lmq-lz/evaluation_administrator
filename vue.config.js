module.exports = {
    lintOnSave: false,
    devServer: {
		proxy: {
			// 配置跨域
			'/api': { //代理接口前缀为/api的请求
				// target: 'http://123.56.106.118:8081', //需要代理到的目标地址
				target: 'http://localhost:8081', //需要代理到的目标地址
				ws: true,
				changeOrigin: true, //是否跨域
				pathRewrite: {
					'^/api': '/' //重写路径
				}
			}
		}
	},

}