<template>
	<view>
		
		<view class="column5 all-line-dot mb10  row" style="height:300rpx;" v-for="(item ,index) in list":key="index">
			
			<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
				<div class="aui-news-item-hd">
				</div>
				<div class="aui-news-item-bd">
					<h4>{{item.article_title}}</h4>
					<p><rich-text :nodes="item.article_content"></rich-text></p>
				</div>
				<span class="aui-news-item-fr">{{item.time_txt}}</span>
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
					_this.$Request.post('seller_msg/ggmsg',{curpage:_this.curpage}).then(res => {
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
		.menu{
			.icon{
				color: #fff;
			}
			position: absolute;
			width:25%;
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
	    line-height: 1.2;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-box-orient: vertical;
	    -webkit-line-clamp: 1;
	}
	
	.aui-news-item-fr {
	    text-align: right;
	    font-size: 13px;
	    color: #8c8c8c;
	    margin-top: -25px;
	}	
</style>

