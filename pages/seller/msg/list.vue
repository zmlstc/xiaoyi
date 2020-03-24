<template>
	<view class="content">
		<view class="top-nav bf b-line" style="height: 55upx;line-height: 55upx;top:20px;" >
				<view class="back"  @tap="toBack" style="height: 55upx;line-height: 55upx;"></view>
				<view class="title" style="height: 55upx;line-height: 55upx;font-size: 16px;font-weight:100;">信息中心</view>
			</view>
		<view style="margin-top: 200rpx !important;"></view>
		<div class="aui-news-box">
			<view class="aui-news-item" @tap="toPage('syslist')">
				<div class="aui-news-item-hd">
					<img src="/static/icon-item-001.png">
				</div>
				<div class="aui-news-item-bd">
					<h4>消息通知
				<uni-badge :text="sysnum" type="error" v-if="sysnum>0"></uni-badge></h4>
					<p><rich-text :nodes="info.sys_message_body"></rich-text></p>
				</div>
				<span class="aui-news-item-fr">{{info.sys_time_txt}}</span>
			</view>
			<view class="aui-news-item" @tap="toPage('notice')">
				<div class="aui-news-item-hd">
					<img src="/static/icon-item-002.png">
				</div>
				<div class="aui-news-item-bd">
					<h4>系统公告</h4>
					<p><rich-text :nodes="info.gg_message_body"></rich-text></p>
				</div>
				<span class="aui-news-item-fr">{{info.gg_time_txt}}</span>
			</view>
		</div>
		
	</view>
</template>

<script>
	import uniBadge from '@/components/uni-badge/uni-badge.vue'
    import {  
        mapState,  
        mapMutations  
    } from 'vuex'; 
	export default {
		data() {
			return {
				sysnum:0,
				info:[]
			}
		},
        computed: mapState(['sellerHasLogin','sellerInfo']), 
		components: {uniBadge},
		onLoad() {
			this.loadData();
		},
		methods: {
            loadData() {  
				var _this = this;
                if (!this.sellerHasLogin) {  
                	uni.navigateTo({
                		url:'../login',
                	})
                }else{
					_this.$Request.post('seller_msg/msgnum').then(res => {
						if (res.code == 200) {
							console.log(res);
							_this.info = res.datas.info;
							_this.sysnum = res.datas.info.sysnum;
							
						}
					});
				}
            },
			toPage: function(url) {
				uni.navigateTo({
					url:url,
				})
			},
			toBack: function() {
				uni.redirectTo({
					url:"/pages/seller/seller", 
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

<style>

.aui-news-box {
    margin-top: 8px;
    background: #fff;
}

.aui-news-item {
    padding: 15px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.aui-news-item-hd {
    margin-right: .8em;
    width: 55px;
    height: 55px;
    line-height: 55px;
    text-align: center;
    background: #fff;
    border-radius: 15px;
}

.aui-news-item-hd img {
    width: 100%;
    max-height: 100%;
    vertical-align: top
}

.aui-news-item-bd {
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
    color: #333;
}

.aui-news-item-bd p {
    color: #999;
    font-size: 14px;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.aui-news-item:before {
    content: '';
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #d8d8d8;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    left: 20px;
}

.aui-news-item-fr {
    text-align: right;
    font-size: 13px;
    color: #8c8c8c;
    margin-top: -25px;
}	
	.uni-badge {
		margin: 20upx;
	}
</style>

