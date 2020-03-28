import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Config from './config.js'
import Storgae from '@/storage/storage'
import BufferList from './buffer.js'
import { i18n } from './i18n';

import './assets/css/common'
import 'mint-ui/lib/style'

import FastClick from 'fastclick'
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
import { InfiniteScroll,Swipe, SwipeItem, Loadmore } from 'mint-ui';

Vue.use(VueRouter)
Vue.use(VueResource)

Vue.use(InfiniteScroll)
Vue.component(Swipe.name,Swipe)
Vue.component(SwipeItem.name,SwipeItem)
Vue.component(Loadmore.name,Loadmore)

Vue.http.options.root = Config.api
Vue.prototype.bufferList = BufferList

import routes from './routes.js'
const router = new VueRouter({
  mode: 'history',
  hashbang: false,
  history: true,
  linkActiveClass: 'active',
  routes: routes
})

Vue.http.interceptors.push((request, next) => {

  // modify request
  if(Storgae.getAuthUid()){
    Vue.http.headers.common['Authorization'] = 'Xyapp ' + Storgae.getAuthUid()
  }
  // continue to next interceptor
  next();
});
function receiveMessage(event){
  const data = JSON.parse(event.data);
  if(data['lat'] && data['lng']){
    Storgae.setPOINT(data);
  }
}
window.document.addEventListener("message", receiveMessage, false);

router.beforeEach( (to,from,next) => {
  next();
});

new Vue({
  router,
  i18n,
  template : '<div id="app"><router-view class="view"></router-view></div>',
}).$mount('#app')
