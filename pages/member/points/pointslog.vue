<template>
	<view>
		<view class="column2" >
			<view class="item2">
					<view class="score">我的积分:<text>{{point}}</text></view>
					<view class="tip">积分会在到店结账后发放</view>
				</view>
				<view class="item3" @tap="toPage('pshop')">
					<view class="icon"></view>
					<view class="tip">兑换</view>
				</view>
		</view>
	<view class="show-list row mb2" v-for="(item ,index) in list":key="index">
		<!-- 删除按钮 -->
		<view class="menu" @tap.stop="deleteOrder(item.pl_id)">
			<view class="icon shanchu"></view>
		</view>
		<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
			
			<view class="item">
				<view class="title">{{item.stagetext}}</view>
				<!--view class="info">{{item.pl_desc}}</view-->
				<view class="date"><text>{{item.addtimetext}}</text></view>
			</view>
			<view class="item2">
				<view class="num" v-if="item.pl_points<0" style="color:#1E90FF;">{{item.pl_points}}</view>
				<view class="num" v-if="item.pl_points>0">{{item.pl_points}}</view>
			</view>
		</view>
	</view>
		<view class="loading-text">{{ loadingText }}</view>
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
				list:[],
				loadingText: '正在加载...',
				hasmore:true,
				curpage:1,
				//控制滑动效果
				theIndex:null,
				oldIndex:null,
				isStop:false,
				point:''
			}				
		},
        computed: mapState(['hasLogin','userInfo']),  
		onLoad() {
			let _this=this;
			 console.log('页面加载');
			 if (_this.hasLogin) {  
			 	_this.$Request.post('member_index/my_asset',{fields:'point'}).then(res => {
			 	 	if (res.code == 200) {
			 	 		console.log(res);
			 	 		_this.point = res.datas.point;
			 	 	}
			 	 });
			 }
			 
			_this.loadData();
		},
         onReachBottom() {
             console.log('下拉加载...');
			 this.curpage++;
			 this.loadData();
         },
         onPageScroll(){
             console.log('页面滚动...');
         },
         onPullDownRefresh() {
             console.log('上拉刷新...');
             uni.stopPullDownRefresh();
         },
        methods: {   
            async loadData() {  
				let _this = this;
				console.log('===userInfo==='+this.hasLogin);
				console.log(this.userInfo);
				console.log(this.userInfo.token);
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					if(!this.hasmore){
						this.loadingText = '暂无更多信息';
						return false;
					}
					_this.$Request.post('member_points/pointslog',{curpage:this.curpage}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.hasmore =res.hasmore;
							console.log(_this.hasmore);
							let _list = res.datas.list;
							for(var i=0;i<_list.length;i++){
								_this.list.push(_list[i]);
							}
						}
						else{
							uni.showToast({
								icon: 'none',
								title:res.datas.error,
								duration:2000
							});
							uni.navigateTo({
								url:'login',
							});
						}
					});
				}
            },
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
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
				let _this =this;
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
							_this.oldIndex = null;
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
				let _this = this;
				console.log('====deleteOrder====');
				_this.$Request.post('member_points/pldelete',{pl_id:id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						let len = _this.list.length;
						for(let i=0;i<len;i++){
							if(id==_this.list[i].pl_id){
								_this.list.splice(i, 1);
								break;
							}
						}
						this.oldIndex = null;
						this.theIndex = null;
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
	page{position: relative;background: #F5F5F5;}
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
	.loading-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60upx;
		color: #979797;
		font-size: 24upx;
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
			background-color:#00BAAD;
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