<template>
	<view class="iconfont" :class="['icon-'+type]" :style="{color:color,'font-size':fontSize}" @click="onClick()"></view>
</template>

<script>
	export default {
		name: 'uni-icon',
		props: {
			/**
			 * 图标类型
			 */
			type: String,
			/**
			 * 图标颜色
			 */
			color: String,
			/**
			 * 图标大小
			 */
			size: [Number, String]
		},
		computed: {
			fontSize() {
				return `${this.size}px`
			}
		},
		methods: {
			onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style>
	@font-face {  
	  font-family: "iconfont";  
	  src:url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');
    } 
	.iconfont {
		font-family: "iconfont" !important;
		font-size: 14px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	.icon-star1:before {
		content: "\e620";
	}

	.icon-star:before {
		content: "\e600";
	}
	
</style>
