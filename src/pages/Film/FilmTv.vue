<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">
        <a v-bind:class="[isClass ? 'current' : '']" v-on:click="addChange('con1')">影院</a>
        <a v-bind:class="[isClass ? '' : 'current']" v-on:click="addChange('con2')">剧场</a>
      </span>
      <router-link :to="{ path: '/search/2/'}">
        <i class="iconfont sea">&#xe603;</i>
      </router-link>
    </div>
    <div class="tv-page">
      <div class="navsize"></div>
      <div class="banner1">
        <div class="swiper-container">
          <mt-swipe :auto="4000" class="swipe" v-bind:class="[isClass ? '' : 'dn']">
            <template v-for="ad in video_ads">
              <mt-swipe-item class="swipe-item">
                <a v-on:click="changeClick(ad['id'],ad['url'])">
                  <div class="swiper-slide">
                    <img v-if="ad['picture']" :src="fullUrl(ad['picture'])+'!640.301'" class="w100" />
                  </div>
                </a>
              </mt-swipe-item>
            </template>
          </mt-swipe>
          <mt-swipe :auto="4000" class="swipe" v-bind:class="[isClass ? 'dn' : '']">
            <template v-for="d_ad in d_video_ads">
              <mt-swipe-item class="swipe-item">
                <a v-on:click="changeClick(d_ad['id'],d_ad['url'])">
                  <div class="swiper-slide">
                    <img
                      v-if="d_ad['picture']"
                      :src="fullUrl(d_ad['picture'])+'!640.301'"
                      class="w100"
                    />
                  </div>
                </a>
              </mt-swipe-item>
            </template>
          </mt-swipe>
        </div>
      </div>
      <div class="love">
        <div class="t">
          热剧推荐
          <span>Hot!</span>
        </div>
        <swiper :options="swiperOption" v-bind:class="[isClass ? '' : 'dn']">
          <template v-for="hot_lines in hots">
            <swiper-slide>
              <ul>
                <template v-for="hot_line in hot_lines">
                  <li>
                    <router-link :to="{ path: '/filmdetail/'+hot_line.id}">
                      <img :src="fullUrl(hot_line['picture'])+'!182.263'" class="w33" />
                      <p>{{hot_line['title']}}</p>
                      <p>播放：{{hot_line['hit']}}</p>
                    </router-link>
                  </li>
                </template>
              </ul>
            </swiper-slide>
          </template>
        </swiper>
        <swiper :options="swiperOption" v-bind:class="[isClass ? 'dn' : '']">
          <template v-for="d_hot_lines in d_hots">
            <swiper-slide>
              <ul>
                <template v-for="d_hot_line in d_hot_lines">
                  <li>
                    <router-link :to="{ path: '/filmdetail/'+d_hot_line.id}">
                      <img :src="fullUrl(d_hot_line['picture'])+'!182.263'" class="w33" />
                      <p>{{d_hot_line['title']}}</p>
                      <p>播放：{{d_hot_line['hit']}}</p>
                    </router-link>
                  </li>
                </template>
              </ul>
            </swiper-slide>
          </template>
        </swiper>
      </div>
      <div class="film-class">
        <div class="t">
          分类
          <span>Types</span>
        </div>
        <div class="con" v-bind:class="[isClass ? '' : 'dn']">
          <div class="box">
            <router-link :to="{ path: '/filmlist/1/1/'}">
              <img src="../../assets/images/dongzuo.png" class="w100" />
              <div class="tag">
                <span>动作</span>
              </div>
            </router-link>
          </div>
          <div class="box">
            <router-link :to="{ path: '/filmlist/1/2/'}" append>
              <img src="../../assets/images/kehuan.png" class="w100" />
              <div class="tag">
                <span>科幻</span>
              </div>
            </router-link>
          </div>
          <div class="box">
            <router-link :to="{ path: '/filmlist/1/3/'}">
              <img src="../../assets/images/jingsong.png" class="w100" />
              <div class="tag">
                <span>惊悚</span>
              </div>
            </router-link>
          </div>
          <div class="box">
            <router-link :to="{ path: '/filmlist/1/4/'}">
              <img src="../../assets/images/aiqing.png" class="w100" />
              <div class="tag">
                <span>爱情</span>
              </div>
            </router-link>
          </div>
          <div class="box">
            <router-link :to="{ path: '/filmlist/1/5/'}">
              <img src="../../assets/images/xiju.png" class="w100" />
              <div class="tag">
                <span>喜剧</span>
              </div>
            </router-link>
          </div>
        </div>
        <div class="con" v-bind:class="[isClass ? 'dn' : '']">
          <div class="box">
            <router-link :to="{ path: '/filmlist/2/1/'}">
              <img src="../../assets/images/mp1.png" class="w100" />
              <div class="tag">
                <span>国产</span>
              </div>
            </router-link>
          </div>
          <div class="box">
            <router-link :to="{ path: '/filmlist/2/2/'}">
              <img src="../../assets/images/mp2.png" class="w100" />
              <div class="tag">
                <span>欧美</span>
              </div>
            </router-link>
          </div>
          <div class="box">
            <router-link :to="{ path: '/filmlist/2/3/'}">
              <img src="../../assets/images/mp3.png" class="w100" />
              <div class="tag">
                <span>日韩</span>
              </div>
            </router-link>
          </div>
          <div class="box">
            <router-link :to="{ path: '/filmlist/2/4/'}">
              <img src="../../assets/images/mp4.png" class="w100" />
              <div class="tag">
                <span>其他</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Error from "../../components/Error.vue";
import Config from "../../config.js";
import { Toast } from "mint-ui";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  components: {
    Error,
    swiper,
    swiperSlide
  },
  data() {
    return {
      isError: false,
      error: "",
      isClass: 1,
      video_ads: [],
      d_video_ads: [],
      hots: [],
      d_hots: [],
      adUrl: "ads/hit/",
      whoami: "user/whoami/",
      videoUrl: "video/view/"
    };
  },
  mounted() {
    this.getData();
    window.scrollTo(0, 0);
  },

  watch: {
    $route(to, from) {
      this.getData();
    }
  },

  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    defaultPicUrl: function() {
      return Config.defaultPic;
    },

    changeClick: function(id, url) {
      this.$http.post(this.adUrl, { id: id }).then(response => {
        window.location.href = url;
      });
    },

    addChange: function(con) {
      this.isClass = con == "con1" ? 1 : 0;
    },

    getData() {
      this.$http.get(this.videoUrl).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.video_ads = ret["data"]["video_ads"];
            this.d_video_ads = ret["data"]["d_video_ads"];
            this.hots = ret["data"]["hot"];
            this.d_hots = ret["data"]["d_hot"];
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
  height: 1.7rem;
  color: #fff;
  font-size: 30px;
  text-align: center;
}
.navTop span a {
  display: inline-block;
  margin-left: 0.05rem;
  margin-right: 0.05rem;
  padding: 0 0.1rem;
  font-size: 0.16rem;
  color: #787878;
}
.navTop span a.current {
  color: #ffffff;
  border-bottom: #fff 2px solid;
}
.navTop .navCon {
  line-height: 0.38rem;
}
.navTop .sea {
  color: #fff;
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
  float: left;
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
.love .swiper-slide {
  margin-top: 0.1rem;
  color: #ffffff;
  overflow: hidden;
  float: left;
  width: 30%;
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
.love .swiper-slide {
  margin-left: 0;
  margin-right: 0.1rem;
}
.love .swiper-slide ul {
  width: 106%;
}
.love .swiper-slide li {
  width: 30%;
  float: left;
  margin-right: 2%;
}
</style>
