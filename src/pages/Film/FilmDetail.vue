<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">{{video['title']}}</span>
      <i class="iconfont share" v-on:click="shareLink(video.title,fullUrl(video.picture))">&#xe60f;</i>
    </div>
    <div
      class="film-detail"
      style="background:url('./dist/filmbg.png') repeat-y #131515; background-size:100% 100%"
      :style="{minHeight: minHeight+ 'px'}"
    >
      <div class="navsize"></div>
      <div class="content">
        <div class="card pad2">
          <div class="ava">
            <img :src="fullUrl(video['picture'])+'!182.263'" class="w100" alt />
          </div>
          <div class="info">
            <div class="p1 p">{{video['title']}}</div>
            <div class="p2 p">{{video['tag']}}</div>
            <div class="p2 p">主演:{{video['actor']}}</div>
            <div class="p2 p">导演:{{video['director']}}</div>
            <div class="play p" v-on:click="changeClick(url,video.title)">
              <a v-bind:href="url">
                <img src="~@/assets/images/play.png" class="w100" alt="Welcome to Smart App!" />
              </a>
            </div>
          </div>
        </div>
        <div class="tabnav">
          <a v-on:click="addChange('con1')" v-bind:class="[isClass ? 'current' : '']">选集</a>
          <a v-on:click="addChange('con2')" v-bind:class="[isClass ? '' : 'current']">简介</a>
        </div>
        <div class="intro" v-bind:class="[isClass ? 'dn' : '']">
          <p>{{video['description']}}</p>
        </div>
        <div class="choice" v-bind:class="[isClass ? '' : 'dn']">
          <template v-for="(sub_data, index) in sub_list">
            <a v-on:click="changeClick(sub_data.url,video.title)" :key="index">{{sub_data['sort']}}</a>
          </template>
        </div>
        <div class="love">
          <div class="t">猜你喜欢</div>
          <div class="swiper-container">
            <div class="swiper-wrapper w100">
              <template v-for="(like_data, index) in like_list">
                <div class="swiper-slide" :key="index">
                  <router-link :to="{ path: '/filmdetail/'+like_data.id}">
                    <img :src="fullUrl(like_data['picture'])+'!182.263'" class="w100" />
                    <p>{{like_data['title']}}</p>
                  </router-link>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";

import Error from "@/components/Error";
import Config from "@/config/config";
import Storage from "@/storage/storage";

export default {
  components: {
    Error
  },

  data() {
    return {
      isError: false,
      error: "",
      isClass: 1,
      url: "",
      video: [],
      like_list: [],
      sub_list: [],
      videoUrl: "video/view/"
    };
  },

  /**
   * computed实现原理
   * computed本质是一个惰性求值的观察者。
   * 
   * computed内部实现了一个惰性的watcher, 也就是computed watcher, computed watcher不会立刻求值, 同时持有一个dep实例。
   * 其内部通过this.dirty属性标记计算属性是否需要重新求值。
   * 
   * 当computed的依赖状态发生变化时，就会通知这个惰性的watcher。
   * 
   * computed watcher通过this.dep.subs.length判断有没有订阅者。
   * 
   * 有的话，会重新计算，然后对比新旧值，如果变化了，会重新渲染。(Vue想确保不仅仅是计算属性依赖的值发生变化，而是当计算属性最终计算的值发生变化时才会触发渲染watcher重新渲染，本质上是一种优化。)
   * 
   * 没有的话，仅仅把this.dirty = true。(当计算属性依赖于其他数据时，属性并不会立即重新计算, 只有之后其他地方需要读取属性的时候, 它才会真正计算, 即具备lazy(懒计算)特性。)
   * 
   */

  computed: {
    minHeight: () => {
      return document.body.clientHeight >= 400 &&
        document.body.clientHeight <= 736
        ? document.body.clientHeight
        : window.screen.height;
    }
  },

  /**
   * computed vs watch
   * 
   * 
   * 区别
   * 类型：{ [key: string]: Function | { get: Function, set: Function } }
   * 详细：
   * 计算属性将被混入到 Vue 实例中。所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。
   * 注意如果你为一个计算属性使用了箭头函数，则 this 不会指向这个组件的实例，不过你仍然可以将其实例作为函数的第一个参数来访问。
   * 
   * computed: {
   *     aDouble: vm => vm.a * a
   * }
   * 计算属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。注意，如果某个依赖 (比如非响应式属性) 在该实例范畴之外，则计算属性是不会被更新的。
   * 
   * computed计算属性: 依赖其他属性值, 并且computed的值有缓存, 只有它依赖的属性值发生改变, 下一次获取computed的值时才会重新计算computed的值。
   * 
   * watch
   * 类型：{ [key: string]: string | Function | Object | Array }
   * 详细：
   * 一个对象，键是需要观察的表达式，值是对应回调函数。值也可以是方法名，或者包含选项的对象。Vue 实例将会在实例化时调用 $watch()，遍历 watch 对象的每一个属性。
   * 
   * 注意，不应该使用箭头函数来定义 watcher 函数 (例如 searchQuery: newValue => this.updateAutocomplete(newValue))。理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.updateAutocomplete 将是 undefined。
   * 
   * watch侦听器: 更多的时[观察]的作用, 无缓存性, 类似于某些数据的监听回调, 每当监听的数据变化时都会执行回调进行后续操作。
   * 
   * 运用场景:
   * 当我们需要进行数值计算, 并且依赖于其他数据时, 应该使用computed, 因为可以利用computed的缓存特性, 避免每次获取值时, 都要重新计算。
   * 
   * 当我们需要在数据变化时执行异步或者开销较大的操作时, 应该使用watch, 使用watch选项允许我们执行异步操作(访问一个API), 限制我们执行该操作的频率, 并在我们得到最终结果前, 设置中间状态。这些都是计算属性无法做大的。
   * 
   */

  watch: {
    $route(to, from) {
      this.getData(() => window.scrollTo(0, 0));
    }
  },

  mounted() {
    const id = +this.$route.params.id;
    this.getData();
  },

  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    defaultPicUrl: function() {
      return Config.defaultPic;
    },

    addChange: function(con) {
      this.isClass = con == "con1" ? 1 : 0;
    },
    changeClick: function(url, name) {
      var share = {
        action: "playvideo",
        url: url,
        name: name
      };
      if (window.postMessage) window.postMessage(JSON.stringify(share), "*");
      return true;
    },

    shareLink: function(text, pic) {
      var share = {
        action: "share",
        url: window.location.href,
        title: text,
        img: pic
      };
      if (window.postMessage) window.postMessage(JSON.stringify(share), "*");
      return true;
    },

    getData() {
      this.$http.post(this.videoUrl, { id: this.$route.params.id }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.video = ret["data"]["video"];
            this.like_list = ret["data"]["likevideo"];
            this.sub_list = ret["data"]["subvideo"];
            this.url = this.sub_list[0]["url"];
          } else {
            Toast(ret.msg);
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
        },
        response => {
          this.isError = true;
          this.error = "";
          if (callback) callback.call(this);
        }
      );
    }
  }
};
</script>

<style scoped>
.navsize {
  width: 100%;
  height: 0.45rem;
  overflow: hidden;
}
.swipe {
  height: 3.3rem;
  color: #fff;
  font-size: 30px;
  text-align: center;
}
.film-detail {
  background: #131313;
  overflow-y: auto;
  overflow-x: hidden;
}
.film-detail .bgs {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}
.film-detail .content {
  position: relative;
  z-index: 123;
}
.pad2 {
  padding: 0.1rem;
  overflow: hidden;
}
.film-detail .ava {
  width: 1rem;
  overflow: hidden;
  float: left;
}
.film-detail .info {
  color: #ffffff;
  margin-left: 1.1rem;
}
.film-detail .p {
  margin-top: 0.05rem;
  font-size: 0.12rem;
  overflow: hidden;
}
.film-detail .p1 {
  font-size: 0.16rem;
}
.film-detail .play {
  width: 1.2rem;
}
.film-detail .tabnav {
  width: 100%;
  height: 0.35rem;
  background: rgba(255, 255, 255, 0.1);
  text-align: center;
}
.film-detail .tabnav a {
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  display: inline-block;
  height: 0.33rem;
  line-height: 0.33rem;
  padding: 0 0.1rem;
  color: #ffffff;
}
.film-detail .tabnav .current {
  border-bottom: #fff 2px solid;
}
.film-detail .choice {
  padding: 0.1rem;
  overflow: hidden;
}
.film-detail .choice a {
  display: inline-block;
  /* float: left; */
  width: 0.5rem;
  height: 0.3rem;
  border: #9d9d9d 1px solid;
  border-radius: 0.03rem;
  margin-top: 0.05rem;
  margin-right: 0.05rem;
  color: #b2b5b6;
  font-size: 0.14rem;
  text-align: center;
  line-height: 0.3rem;
}
.love {
  padding: 0.1rem;
  overflow: hidden;
}
.love .t {
  color: #ffffff;
  font-size: 0.16rem;
}
.swiper-container {
  width: 100%;
  overflow: hidden;
}
.love .swiper-container {
  padding-bottom: 0.15rem;
}
.swiper-slide {
  color: #ffffff;
  overflow: hidden;
}
.love .swiper-slide {
  margin-top: 0.1rem;
  width: 30%;
  float: left;
  margin-left: 2%;
}
.swiper-slide img {
  width: 100%;
  display: block;
  overflow: hidden;
}
.swiper-slide p {
  width: 100%;
  height: 0.2rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #ffffff;
  margin-top: 0.05rem;
}
.film-list {
  overflow-y: auto;
  background: #141414;
  overflow-x: hidden;
}
.film-list .list {
  display: -webkit-flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.film-list .box {
  width: 28%;
  margin-top: 5%;
}
.film-list .box img {
  width: 100%;
}
.film-list .box p:nth-of-type(1) {
  margin-top: 0.05rem;
  color: #ffffff;
  font-size: 0.14rem;
}
.film-list .box p:nth-of-type(2) {
  color: #afafaf;
  font-size: 0.12rem;
}
.banner1 {
  overflow: hidden;
}
.love .t span {
  color: #777777;
}
.tv-page {
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: #131313;
}
.tv-page .love {
  margin: auto;
  margin-top: 3%;
}
.tv-page .love .swiper-slide p:nth-of-type(2) {
  font-size: 0.12rem;
  margin-top: 0;
}
.film-class {
  width: 100%;
  overflow: hidden;
  margin-top: 1%;
}
.film-class .t {
  width: 95%;
  font-size: 0.16rem;
  margin: auto;
  color: #ffffff;
}
.film-class .t span {
  color: #787777;
}
.film-class .con {
  overflow: hidden;
}
.film-class .con .box {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 0.05rem;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
}
.film-class .con .box a {
  display: inline-block;
  width: 100%;
}
.film-class .con .box .tag {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  color: #ffffff;
  font-size: 0.18rem;
  z-index: 1234;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
}
.film-class .con .box img {
  display: block;
  width: 100%;
  overflow: hidden;
}
.film-detail .intro {
  padding: 0.1rem;
  overflow: hidden;
  color: #a4a4a4;
  line-height: 0.24rem;
  text-indent: 2em;
}
</style>
