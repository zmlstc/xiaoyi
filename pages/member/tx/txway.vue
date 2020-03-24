<template>
	<view>
		
		<view class="btn mt20 mb20" @tap="toPage('txwayadd')">添加提现方式</view>
		
		<view class="cash-mode bf b-line row mb2"  v-for="(item ,index) in txwaylist":key="index" @tap="checkTxWay(item.id)">
			<!-- 删除按钮 -->
			<view class="menu" @tap.stop="deleteOrder(item.id)">
				<view class="icon shanchu"></view>
			</view>
			<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
			
			<view class="item">
				<view :class="item.bill_type_code"></view>
				<view class="content">
					<view class="name" v-if="item.bill_type_code=='wxpay'">微信支付账号</view>
					<view class="name" v-if="item.bill_type_code=='alipay'">支付宝账号</view>
					<view class="acc">{{item.bill_type_number_txt}}</view>
				</view>
			</view>
			<view class="item2">
				<view  :class="[(item.is_default==1||item.id===current)?'select':'no-select']">					
				</view>
			</view>
			
			</view>
		</view>
	</view>
</template>
<script> 
    import {  
        mapState,  
        mapMutations  
    } from 'vuex';  
    export default {  
		data() {
			return {
				memberInfo:[],
				txwaylist:[],
				current:0,
				//控制滑动效果
				theIndex:null,
				oldIndex:null,
				isStop:false
			}				
		},
        computed: mapState(['hasLogin','userInfo']),
		onLoad() {
			 console.log('页面加载');
			this.loadData();
		},
		onShow(){
			 if (!this.hasLogin) {  
				uni.navigateTo({
					url:'../login',
				})
			}else{
				this.memberInfo = this.userInfo;
			
			}
		},
        methods: {  
			...mapMutations(['setUserInfo']),
            async loadData() {  
				var _this = this;
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'../login',
					})
                }else{
					this.memberInfo = this.userInfo;

				}
				
				_this.$Request.post('member_fund/txwaylist').then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.txwaylist = res.datas.list;
					}
				}).catch(function (err) {
					console.log(err);
				  });
            },
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			checkTxWay(id){
				for (let i = 0; i < this.txwaylist.length; i++) {
					if (this.txwaylist[i].id === id) {
						this.current = id;
						this.txwaylist[i].is_default=0;
						//break;
					}
					this.txwaylist[i].is_default=0;
				}
				this.$Request.post('member_fund/isdefaut',{id:id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						uni.navigateTo({
							url:"tx", 
							success (res) { 
								let page = getCurrentPages().pop(); 
								if (page == undefined || page == null) { 
								  return ;
								 } 
								 page.onLoad() ;
							}
						})
						
					}
				});
			},
			
			//控制左滑删除效果-begin
			touchStart(index,event){
				console.log('====touchStart====');
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX,event.touches[0].pageY];
			},
			touchMove(index,event){
				console.log('====touchMove====');
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				
				if(this.isStop||Math.abs(moveX)<5){
					return ;
				}
				if (Math.abs(moveY) > Math.abs(moveX)){
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				
				if(moveX<0){
					this.theIndex = index;
					this.isStop = true;
				}else if(moveX>0){
					if(this.theIndex!=null&&this.oldIndex==this.theIndex){
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(()=>{
							this.oldIndex = null;
						},150)
					}
				}
			},
			touchEnd(index,$event){
				console.log('====touchEnd====');
				//结束禁止触发效果
				this.isStop = false;
			},
			//控制左滑删除效果-end
			deleteOrder(id){
				var _this= this;
				console.log('====deleteOrder====');
				_this.$Request.post('member_fund/txway_del',{id:id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						let len = _this.txwaylist.length;
						for(let i=0;i<len;i++){
							if(id==_this.txwaylist[i].id){
								_this.txwaylist.splice(i, 1);
								break;
							}
						}
						/* this.selectedList.splice(this.selectedList.indexOf(orderid), 1);
						this.sum(); */
						_this.oldIndex = null;
						_this.theIndex = null;
					}
					else{
						uni.showToast({
							icon: 'none',
							title:res.datas.error,
							duration:2000
						});
					}
				});
				
			}
			
			 
        }  
    }  
</script> 
<style lang="scss">
	page{background: #F5F5F5;}	
	@font-face {font-family:"HMfont-home";src:url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAOEAAsAAAAAB7wAAAM1AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqDAIJNATYCJAMQCwoABCAFhG0HPhu1BsiOw7jha84s8T+CgOyq6unevTlAeAkRhAhQBjj8eJfmMg/oB5whSgaFspy7AqbpwE3Py3/j9j+X07uGyFHr21lua9HYi9rUCzDeGtBYmw4o0AJJ0BvGLmiJxyEAC3yIQhSVPL9BF4U5TgBi7ChtQzfjQKFYWEdgrFiqEBsxoGurtMfAhuD74g8JQgcNg8ScWjf8xoPz7/nfD8iFpoV0eQi86XQAWwUSiAIUiJGVhgEaUSAKiYXau0kKoKOjwVRthd8PmExIBRvmWH95INCQIIyYqVYAJKGghO/5Dg4B3wtxaPD9QAoS4IOM1gEzYBbAMkT16iIQGPxsopS5ScAcK23LiaBDpzyk1aGLHtsvhVrL7adDD55016wPXnDfcr7T3lcE2TVcP2fNhZM7WeiEhVp44vx9C5vVD6+eEgaLTZvEot3HL1lawlnXLK3XnISDllbWwmrmGjlRLdxq2bpme1RAeqXtzWh6g0F//wCCnRiN2diwr2+Yse3iEs20g05Q5tT0BikOXwKf79vsoEvb6p6xjVhHP92nwDJmX+9hwsf26dXbPiNvZ/98x67/+5T+ev0aWxbXCwOX41zLxia+O73B6Y57fN1u6GvN+Zmbc8XITigTAcB0Rl6X8QB4hDgEpoXypZz2q37D5FVnVa9t1n/dUgHw8uKMq9BmWqjoJoP3zevM+zG8jmVKE5hKpRShw9WTFZW04D7TscAC+B0RcOD9FHLnzqkg0HFOQMMMb5DoBKGKGgUGLEkCIzq5YEEkpastcWQyDYQyByJYBkBgx2nQsOEaSOx4girqOzDgwj8wYickWNAiHLe0JESMsiicTLaQh84PBm6WKlst/TD9hXQV25wWBLQP4jJw435MXD58RynxFDPKT30golBxluAtOI3iOMOcs5Bc2fFF8sPd2OFVBO24WQJ9CmEIG4HwQAb4ARmFS0aK8qoL/cLnXyA0FTE23FBSZf+AYEqCzpF4YojrgN5J004lt/LKFD7RHDAVQYEMh8lIQErAICImJgOZWD0ohHARdhg5wJdzSKxVaXhX6c7y8uQN1wAWmLOU0IQUShiQo0fZTceadqaMdP2uXwEAAAAA') format('woff2');}
	.icon {
		font-family:"HMfont-home" !important;
		font-size:40upx;
		font-style:normal;
		color:#000000;
		&.shanchu {
			&:before{content:"\e6a4";}
		}
		
	}
	.row{
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
		z-index: 4;
		border: 0;
		.menu{
			.icon{
				color: #fff;
			}
			position: absolute;
			width: 20%;
			height: 100%;
			right: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #00BAAD;
			color: #fff;
			z-index: 2;
		}
		.carrier{
			@keyframes showMenu {
				0% {transform: translateX(0);}100% {transform: translateX(-30%);}
			}
			@keyframes closeMenu {
				0% {transform: translateX(-30%);}100% {transform: translateX(0);}
			}
			&.open{
				animation: showMenu 0.25s linear both;
			}
			&.close{
				animation: closeMenu 0.15s linear both;
			}
			background-color: #fff;
			position: absolute;
			width: 100%;
			padding: 0 0;
			height: 100%;
			z-index: 3;
			display: flex;
			align-items: center;
		}
	}

</style>