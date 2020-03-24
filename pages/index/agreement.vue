<template>
	<view class="s-page-wrapper">
		<view class="s-page">
			<view class="has-mgtb-10 has-pdlr-20">
				<view class="is-h1">{{art.doc_title}}</view>
				<view class="has-mgt-15 has-mgb-30 has-desc-color is-size-14 bottom-line">
					<span class="has-mgr-5"></span>
					<span></span>
				</view>
				<view class="is-p has-mgt-15">
					<rich-text :nodes="art.doc_content" class="content"></rich-text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import amap from '../../common/SDK/amap/amap-wx.js';
	import uniRate from "../../components/uni-rate/uni-rate.vue"
	import {  
	    mapState,  
	    mapMutations  
	} from 'vuex'; 
	export default {
		components: {uniRate},
		data() {
			return {
				id:'',
				art:[]
			}
		},
		onLoad(e) {
			this.id = e.id;
			this.loadData();
			
		},
		methods: {
			async loadData() {
				var _this = this;
				console.log(_this.id)
				_this.$Request.post('document/getOneDoc',{id:_this.id}).then(res => {
					if (res.code == 200) {
						console.log(res);
						_this.art = res.datas;
						_this.art.doc_content = _this.art.doc_content.replace(/img/g,'img style="width:100%;height:auto"');
						console.log(_this.art.doc_content);
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
			}
		}
	}
</script>
