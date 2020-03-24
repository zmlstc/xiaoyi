<template>
	<view>
		<view class="about">
			<view class="icon"></view>
			<view class="title mt10">小易共享平台</view>
			<view class="version">当前版本 1.1.2</view>
		</view>
		<view class="set-column mb2"  @tap="toPage('safeset')">
			<view class="item">微信公众号</view>
			<view class="itme2">fhlego<view class="icon"></view></view>
		</view>
		<view class="set-column mb2"  @tap="toPage('rule')">
			<view class="item">协议规则</view>
			<view class="itme2"><view class="icon"></view></view>
		</view>
		<view class="set-column mb2"  @tap="toPage('/pages/agent/reg')">
			<view class="item">运营代理</view>
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
