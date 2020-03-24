import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		//userInfo: JSON.parse(localStorage.getItem("myInfo")) || {},
		userInfo: {},
		sellerInfo:{},
		userToken:'',
		sellerHasLogin:false,
		sToken:'',
		Location:{}
	},
	mutations: {
		setToken(state, provider) {
			console.log('===mutations login==');
			console.log(provider);
			state.hasLogin = true;
			//state.userInfo = provider;
			state.userToken = provider;
			/* uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) ; */
			uni.setStorage({//缓存用户登陆状态
			    key: 'userToken',  
			    data: provider  
			})
		},
		logout(state) {
			console.log('===mutations logout==');
			state.hasLogin = false;
			state.userInfo = {};
			state.userToken='';
			uni.removeStorage({  
                key: 'userInfo'  
            });
			uni.removeStorage({  
                key: 'userToken'  
            });			
		/* 	uni.setStorage({
			    key: 'userToken',  
			    data: ''  
			}) */
		},
		setUserInfo(state, provider) {
			console.log('===mutations setUserInfo==');
			console.log(provider);
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) ;
		},
		setSellerToken(state, provider) {
			console.log('===mutations seller_login==');
			console.log(provider);
			state.sellerHasLogin = true;
			state.sToken = provider;
			uni.setStorage({//缓存用户登陆状态
				key: 'sToken',  
				data: provider  
			})
		},
		setSellerInfo(state, provider) {
			console.log(provider);
			state.sellerInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'sellerInfo',  
			    data: provider  
			}) ;
		},
		sellerLogout(state) {
			console.log('===mutations seller logout==');
			state.sellerHasLogin = false;
			//state.userInfo = {};
			state.sToken='';
			/* uni.removeStorage({  
                key: 'userInfo'  
            }); */
			uni.removeStorage({  
                key: 'sToken'  
            })
		},
		setLocation(state, provider) {
			console.log('===setLocation==');
			console.log(provider);
			state.Location = provider;
		}
	},
	actions: {
	
	}
})

export default store
