<template>
  <view class="demo">
    <select-city :hotCitys="hotCitys" :citys="citys" :value="value" @on-select="onSelect"></select-city>
  </view>
</template>

<script>
  import selectCity from '@/components/city/select-city.vue'
	import {  
	    mapState,  
	    mapMutations  
	} from 'vuex'; 
  export default {
    data() {
      return {
			hotCitys:[],// [{name:'杭州',adcode:'0',city_id:'998'}, {name:'天津',adcode:'0',city_id:'19'}, {name:'北京',adcode:'0',city_id:'1'}, {name:'上海',adcode:'0',city_id:'855'}, {name:'深圳',adcode:'0',city_id:'2142'}, {name:'广州',adcode:'0',city_id:'2117'}],
			value: '',
			citys:[],
			backurl:''
      }
    },
        computed: mapState(['Location']), 
		onLoad(e) {
			console.log(e);
			let _this = this;
			if(e!=undefined &&e.url!=undefined){
				_this.backurl=e.url;
			}
			if(JSON.stringify(this.Location) !== "{}") {
				console.log('==Location not null===');
				console.log(this.value);
				//this.mapinfo =this.Location;
				this.value = this.Location.city_name;
				console.log(this.value);
				
			}
			this.$Request.post('area/getcitys').then(res => {
				if (res.code == 200) {
					console.log(res);
					//this.login(res.datas);
					_this.citys = res.datas.citys;
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
    components: {
      selectCity
    },
    methods: {
			...mapMutations(['setLocation']),
      onSelect(city) {
		    let _this = this;
			let _location={lat:this.Location.lat,lng:this.Location.lng,city_id:city.city_id,city_name:city.name,has_agent:1};
			console.log(city.name);
			this.setLocation(_location);
			console.log('===backurl====='+this.backurl);
			if(this.backurl!='' && this.backurl!=undefined){
				uni.switchTab({
					url: _this.backurl, 
					success (res) { 
						var page = getCurrentPages().pop();
						if (page == undefined || page == null) return;
						page.onLoad();
						/* let page = getCurrentPages().pop(); 
						if (page == undefined || page == null) { 
							return 
						} 
						page.onLoad() ; */
					}
				});
					// uni.navigateTo({
					// 	url:_this.backurl,
					// 	success (res) { 
					// 		let page = getCurrentPages().pop(); 
					// 		if (page == undefined || page == null) { 
					// 			return 
					// 		} 
					// 		page.onLoad() ;
					// 	}
					// });
			}else{
				uni.switchTab({ 
					url: 'index', 
					success (res) { 
						var page = getCurrentPages().pop();
						if (page == undefined || page == null) return;
						page.onLoad();
						/* let page = getCurrentPages().pop(); 
						if (page == undefined || page == null) { 
							return 
						} 
						page.onLoad() ; */
					}
				});
			}
      }
    }
  }
</script>