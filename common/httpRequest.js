import sysConfig from './config'

module.exports = {

	post: function(url, data) {
		let token = "";
		let stoken = "";
		console.log('--post token----'+token);
		console.log('--post stoken----'+stoken);
	/* 	uni.getStorageSync({
			key: 'userToken',
			success: function(ress) {
				token = ress.data;
				console.log(ress);
			}
		}); */
		try {
			token = uni.getStorageSync('userToken');			
		} catch (e) {
			// error
		}
		try {
			stoken = uni.getStorageSync('sToken');			
		} catch (e) {
			// error
		}
		console.log('------'+token);
		console.log('------'+stoken);
		url = sysConfig.APIHOST+url;
		return new Promise((succ, error) => {
			uni.request({
				url: url,
				header: {					
					'Content-Type': "application/x-www-form-urlencoded", //自定义请求头信息
					'xToken': token,
					'sToken': stoken
					//'Accept': 'application/json'
				},
				data: data,
				method: "POST",
				success: function(result) {
					succ.call(self, result.data)
				},
				fail: function(e) {
					error.call(self, e)
				}
			})
		})
	},
	get: function(url, data) {
		let token = "";
		console.log('--post token----'+token);
		try {
			token = uni.getStorageSync('userToken');			
		} catch (e) {
			// error
		}
		console.log('------'+token);
		url = sysConfig.APIHOST+url;
		return new Promise((succ, error) => {
			uni.request({
				url: url,
				data: data,
				method: "GET",
				header: {
					'xToken': token,
					'Content-Type': "application/x-www-form-urlencoded" //自定义请求头信息
				},
				success: function(result) {
					succ.call(self, result.data)
				},
				fail: function(e) {
					error.call(self, e)
				}
			})
		})
	},
	upLoadFile: function(url,filepath, data) {
		let token = "";
		let stoken = "";
		console.log('--post token----'+token);
		try {
			token = uni.getStorageSync('userToken');			
		} catch (e) {
			// error
		}
		try {
			stoken = uni.getStorageSync('sToken');			
		} catch (e) {
			// error
		}
		console.log('------'+token);
		url = sysConfig.APIHOST+url;
		return new Promise((succ, error) => {
				uni.uploadFile({
				url: url,
				filePath: filepath,
				name: 'pic',
				formData: data,
				header: {
					'xToken': token,
					'sToken': stoken
				},
				success: function(result) {
					//返回的字符串处理
					let jsonStr = result.data.replace(" ", ""); 
					/* if (typeof jsonStr != 'object') { 
						jsonStr = jsonStr.replace(/\ufeff/g, ""); //字符串转化JSON对象 
						jsonStr = JSON.parse(jsonStr); 
					} */
					
					succ.call(self, JSON.parse(jsonStr));
				},
				fail: function(e) {
					error.call(self, e)
				},
				complete: () => {
					console.log('complate');
				}
			});
		})
	},
	getQueryString: function(url, name) { 
		var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i'); 
		var r = url.substr(1).match(reg); 
		if (r != null) {
			// console.log("r = " + r) 
			// console.log("r[2] = " + r[2]) 
			return r[2]; 
		} 
		return '';
	}
	
	
}
