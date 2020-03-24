<template>
	<view>
		<view class="set-column mb2 mt20"  @tap="toPage('/pages/index/newsdetail?aid=1')">
			<view class="item">个人注册协议</view>
			<view class="itme2">fhlego<view class="icon"></view></view>
		</view>
		<view class="set-column mb2"  @tap="toPage('/pages/index/newsdetail?aid=1')">
			<view class="item">商家入驻协议</view>
			<view class="itme2"><view class="icon"></view></view>
		</view>
		<view class="set-column mb2"  @tap="toPage('/pages/index/newsdetail?aid=1')">
			<view class="item">代理运营协议</view>
			<view class="itme2"><view class="icon"></view></view>
		</view>
	<view class="copyright">Copyright © 2016-2019 UP. All Rights Reserved.</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},	
		onLoad(e) {
		},
		methods: {
			toPage(url){
				uni.navigateTo({
					url:url
				})
			},
		}
	}
</script>

<style>
	page{background: #F5F5F5;}
</style>
