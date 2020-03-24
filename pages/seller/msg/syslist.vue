<template>
	<view>
		<view class="top-nav bf b-line" style="height: 55upx;line-height: 55upx;top:20px;" >
				<view class="back"  @tap="toBack" style="height: 55upx;line-height: 55upx;"></view>
				<view class="title" style="height: 55upx;line-height: 55upx;font-size: 16px;font-weight:100;">系统信息</view>
			</view>
		<view style="margin-top: 200rpx !important;"></view>
	<view class="mt20"></view>
		<view v-for="(item ,index) in list" :key="index">
			<view style="text-align: center;">
				{{item.time_txt}}
			</view>
			<view class="column5 all-line-dot mb10  row"  > 
				<view class="menu" @tap.stop="deleteOrder(item.message_id)">
					<view class="icon shanchu"></view>
				</view>
				<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
					<div class="aui-news-item-hd">
					</div>
					<div class="aui-news-item-bd">
						<h4></h4>
						<p><rich-text :nodes="item.message_body"></rich-text></p>
					</div>
					
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
				isStop:false
			}				
		},
        computed: mapState(['sellerHasLogin','sellerInfo']),  
		onLoad() {
			 console.log('页面加载');
			this.loadData();
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
				var _this = this;
                if (!this.sellerHasLogin) {  
                	uni.navigateTo({
                		url:'../login',
                	})
                }else{
					if(!this.hasmore){
						this.loadingText = '暂无更多信息';
						return false;
					}
					_this.$Request.post('seller_msg/systemmsg',{curpage:_this.curpage}).then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.hasmore =res.hasmore;
							console.log(_this.hasmore);
							let _list = res.datas.list;
							for(var i=0;i<_list.length;i++){
								_this.list.push(_list[i]);
							}
							if(!_this.hasmore){
								_this.loadingText = '暂无更多信息';
							}
						}
						else{
							uni.showToast({
								icon: 'none',
								title:res.datas.error,
								duration:2000
							});
							uni.navigateTo({
								url:'../login',
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
			deleteOrder(msgid){
				var _this = this;
				_this.$Request.post('seller_msg/sysmsgdel',{msgid:msgid}).then(res => {
					if (res.code == 200) {
						console.log(res);
						let len = _this.list.length;
						for(let i=0;i<len;i++){
							if(msgid==_this.list[i].message_id){
								_this.list.splice(i, 1);
								break;
							}
						}
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
				
			},
			toBack: function() {
				uni.redirectTo({
					url:"../seller", 
					success (res) {
							const currentPages = getCurrentPages()  
							console.log(currentPages[0]);  
							currentPages[0].onLoad({  
								...currentPages[0].options  
							})
					}
				}) 
				
			}
			 
        }  
    }  
</script>  
<style lang="scss">
	page{position: relative;background: #F5F5F5}
	@font-face {font-family:"HMfont-home";src:url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAOEAAsAAAAAB7wAAAM1AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqDAIJNATYCJAMQCwoABCAFhG0HPhu1BsiOw7jha84s8T+CgOyq6unevTlAeAkRhAhQBjj8eJfmMg/oB5whSgaFspy7AqbpwE3Py3/j9j+X07uGyFHr21lua9HYi9rUCzDeGtBYmw4o0AJJ0BvGLmiJxyEAC3yIQhSVPL9BF4U5TgBi7ChtQzfjQKFYWEdgrFiqEBsxoGurtMfAhuD74g8JQgcNg8ScWjf8xoPz7/nfD8iFpoV0eQi86XQAWwUSiAIUiJGVhgEaUSAKiYXau0kKoKOjwVRthd8PmExIBRvmWH95INCQIIyYqVYAJKGghO/5Dg4B3wtxaPD9QAoS4IOM1gEzYBbAMkT16iIQGPxsopS5ScAcK23LiaBDpzyk1aGLHtsvhVrL7adDD55016wPXnDfcr7T3lcE2TVcP2fNhZM7WeiEhVp44vx9C5vVD6+eEgaLTZvEot3HL1lawlnXLK3XnISDllbWwmrmGjlRLdxq2bpme1RAeqXtzWh6g0F//wCCnRiN2diwr2+Yse3iEs20g05Q5tT0BikOXwKf79vsoEvb6p6xjVhHP92nwDJmX+9hwsf26dXbPiNvZ/98x67/+5T+ev0aWxbXCwOX41zLxia+O73B6Y57fN1u6GvN+Zmbc8XITigTAcB0Rl6X8QB4hDgEpoXypZz2q37D5FVnVa9t1n/dUgHw8uKMq9BmWqjoJoP3zevM+zG8jmVKE5hKpRShw9WTFZW04D7TscAC+B0RcOD9FHLnzqkg0HFOQMMMb5DoBKGKGgUGLEkCIzq5YEEkpastcWQyDYQyByJYBkBgx2nQsOEaSOx4girqOzDgwj8wYickWNAiHLe0JESMsiicTLaQh84PBm6WKlst/TD9hXQV25wWBLQP4jJw435MXD58RynxFDPKT30golBxluAtOI3iOMOcs5Bc2fFF8sPd2OFVBO24WQJ9CmEIG4HwQAb4ARmFS0aK8qoL/cLnXyA0FTE23FBSZf+AYEqCzpF4YojrgN5J004lt/LKFD7RHDAVQYEMh8lIQErAICImJgOZWD0ohHARdhg5wJdzSKxVaXhX6c7y8uQN1wAWmLOU0IQUShiQo0fZTceadqaMdP2uXwEAAAAA') format('woff2');}
	.icon {
		font-family:"HMfont-home" !important;
		font-size:48upx;
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
		height: auto;
		padding: 20rpx 0;
		.menu{
			.icon{
				color: #fff;
			}
			// position: absolute;
			width:25%;
			// height: 100%;
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
	.aui-news-item-bd {
		height: 99%;
	    margin-left: .8em;
	    -webkit-box-flex: 1;
	    -webkit-flex: 1;
	    flex: 1;
	    min-width: 0;
	}
	
	.aui-news-item-bd h4 {
	    font-weight: 400;
	    font-size: 16px;
	    width: auto;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    word-wrap: normal;
	    word-wrap: break-word;
	    word-break: break-all;
	    padding-bottom: 10px;
	    color: #333;
	}
	
	.aui-news-item-bd p {
	    color: #848689;
	    font-size: 13px;
	    line-height: 1.5;
	}
	
	.aui-news-item-fr {
	    text-align: right;
	    font-size: 13px;
	    color: #8c8c8c;
	    margin-top: -25px;
	}	
</style>

