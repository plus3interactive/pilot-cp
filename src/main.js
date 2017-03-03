/* global localStorage: false */
var Vue = require('vue')
var VueRouter = require('vue-router')
var VueResource = require('vue-resource')

import Auth from './components/Auth'

import routes from './routes'
import App from './App'

import '../src/assets/sass/main.sass'
import moment from 'moment'

Vue.use(VueRouter)
Vue.use(VueResource)

Vue.http.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('id_token')
Vue.http.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// Vue.http.options.root = ''

Vue.http.interceptors.push((request, next) => {
  next(response => {
    if (response.headers.has('authorization')) {
      let token = response.headers.get('authorization').slice(8)
      localStorage.setItem('id_token', token)
      Vue.http.headers.common['Authorization'] = response.headers.get('authorization')
    }

    if (response.status === 401) {
      return Auth.logout()
    }
    return response
  })
})

Vue.directive('moment-ago', {
  bind (el, binding) {
    el.innerHTML = ' ' + moment(binding.value, 'YYYY-MM-DD HH:mm:ss').fromNow()
    el.interval = setInterval(() => {
      el.innerHTML = ' ' + moment(binding.value, 'YYYY-MM-DD HH:mm:ss').fromNow()
    }, 1000)
  },
  unbind (el, binding, vnode) {
    clearInterval(el.interval)
  }
})

export default Vue

export var router = new VueRouter({
  mode: 'history',
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
})
