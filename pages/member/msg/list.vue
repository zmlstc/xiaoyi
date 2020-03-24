<template>
	<view class="content">
		<view class="top-nav bf b-line">
				<view class="back"  @tap="toBack"></view>
				<view class="title">消息中心</view>
			</view>
		<view class="place"></view>
		<div class="aui-news-box">
			<view class="aui-news-item" @tap="toPage('mlist')">
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
			<view class="aui-news-item" @tap="toPage('gslist')">
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
        computed: mapState(['hasLogin','userInfo']), 
		components: {uniBadge},
		onLoad() {
			this.loadData();
		},
		methods: {
            loadData() {  
				var _this = this;
				console.log('===userInfo==='+this.hasLogin);
				console.log(this.userInfo);
				console.log(this.userInfo.token);
                if (!this.hasLogin) {  
					uni.navigateTo({
						url:'login',
					})
                }else{
					_this.$Request.post('member_message/msgnum').then(res => {
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
				uni.switchTab({
					url:"/pages/member/home", 
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
    color: #848689;
    font-size: 13px;
    line-height: 1.2;
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
		margin:0 20upx;
	}
</style>

