import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'

import '../src/assets/style/common.css'
import '../src/assets/style/group.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
