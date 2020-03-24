import Vue from 'vue'
import App from './App'

import store from './store'
import HttpRequest from './common/httpRequest'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$store = store
Vue.prototype.$Request = HttpRequest


const app = new Vue({
    store,
    ...App
})
app.$mount()
