<template>
	<view class="s-page-wrapper">
		<view class="s-page">
			<view class="has-mgtb-10 has-pdlr-20">
				<view class="is-h1">{{art.article_title}}</view>
				<view class="has-mgt-15 has-mgb-30 has-desc-color is-size-14 bottom-line">
					<span class="has-mgr-5"></span>
					<span></span>
				</view>
				<view class="is-p has-mgt-15">
					<rich-text :nodes="art.article_content" class="content"></rich-text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				art:[]
			};
		},
		onLoad: function(e) {
			var _this = this;
			_this.$Request.post('article/article_show',{article_id:e.aid}).then(res => {
				if (res.code == 200) {
					console.log(res);
					_this.art = res.datas;
					_this.art.article_content = _this.art.article_content.replace(/img/g,'img style="width:100%;height:auto"');
					console.log(_this.art.article_content);
				}else{
					uni.showToast({
						icon: 'none',
						title:res.datas.error,
						duration:2000,
						success: function () {
							 setTimeout(function () {
								uni.navigateTo({
									url:'news',
								});
							 }, 1500);
						}
					});
				}
			});
		},
	}
</script>

<style>
.is-h1 {font-size: 20px !important;}
.has-pdlr-20 {padding-left: 17px !important;padding-right: 17px !important;}
.has-mgtb-10 {margin-top: 8px !important;margin-bottom: 8px !important;}
.has-mgtb-10 img{max-width:320upx;height:auto;margin:10px auto !important;}
.has-mgt-15 {margin-top: 12px !important;}
.has-mgt-15 .content img{width:100%;height:auto;}
.is-size-14 {font-size: 11px !important;}
.has-desc-color {color: #888;}
.bottom-line {border-bottom: 1px solid #888 !important;color: #888;}
img {
	width: 100%;
}
</style>
