// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import VueProgress from 'vue-progress'
import VModal from 'vue-js-modal'

Vue.config.productionTip = false

Vue.use(VModal, {dialog: true})
Vue.use(VueProgress)
Vue.use(VueResource)
Vue.http.options.root = process.env.MATCHING_SERVER_URI

Vue.component('icon', Icon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App,
  },
})
