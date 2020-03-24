<script>	
import {
		mapMutations
	} from 'vuex';
	export default {
		onLaunch: function() {
			let _this = this;
			console.log('App Launch');
			uni.getStorage({
				key: 'userToken',
				success:(res) => {
					console.log('App Launch getStore');
					_this.setToken(res.data);
					// 如果还需要重新校验或是想要刷新token的有效时间 就再联网请求一次
					/* uni.request({
						url: `${this.$serverUrl}/auth.php`,
						header: {
							"Content-Type": "application/x-www-form-urlencoded",
							"Token":res.data.token
						},
						data: {
							"username":res.data.user_name
						},
						method: "POST",
						success: (e) => {
							if (e.statusCode === 200 && e.data.code === 0) {
								this.login(e.data);
							}
						}
					}) */
				},
				fail:(err)=>{
					console.log(err);
				}
			});
			try{
				this.setUserInfo(uni.getStorageSync('userInfo'));
			}catch(e){
				//TODO handle the exception
			}
			try{
				this.setSellerToken(uni.getStorageSync('sToken'));
			}catch(e){
				console.log(e);
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {...mapMutations(['setToken','setUserInfo','setSellerToken'])}
	}
</script>

<style>
	/*每个页面公共css */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	@import "./static/css/iconfont.css"; 
	@import "./static/css/common.css"; 
	@import "./static/css/mement.css";
</style>
