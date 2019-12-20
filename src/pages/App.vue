<template>
  <div>
    <div class="page-topnav">
      <div class="company-top-nav">
        <div class="right-btn">
          <router-link
            :to="{path:'/search/1/',query:{tab:'hide'}}"
            class="iconfont ico sea"
          >&#xe603;</router-link>
          <router-link :to="{path:'/user/'}" class="iconfont ico user">&#xe618;</router-link>
        </div>
      </div>
    </div>
    <div class="banner pt45" v-infinite-scroll="loadMore">
      <mt-swipe :auto="3000" class="swipe" v-if="ads">
        <template v-for="(ad, index) in ads">
          <mt-swipe-item class="swipe-item" :key="index">
            <a v-on:click="changeClick(ad['id'],ad['url'])">
              <img v-if="ad['picture']" :src="fullUrl(ad['picture'])+'!640.301'" alt="Welcome to Smart App!" />
            </a>
          </mt-swipe-item>
        </template>
      </mt-swipe>
    </div>
    <div class="headline dn" v-if="say">
      <router-link :to="{ path: '/mood/',query: {tab:'hide'}}">
        <div class="time">
          <em>{{ say['d'] }}</em>
          <span>{{ say['m'] }}.</span>
        </div>
        <div class="txt">{{ say['name'] }}</div>
        <div class="num">{{ say['num'] }}</div>
      </router-link>
    </div>
    <div class="column">
      <router-link :to="{path:'/filmtv'}" class="filmTv"></router-link>
      <router-link :to="{path: '/productlist'}" class="productList"></router-link>
      <router-link :to="{path: '/checkall'}" class="checkMore"></router-link>
    </div>

    <div class="hotNew">
      <router-link :to="{ path: '/new/'}">
        <div class="index-box-t">
          <div class="left">
            <span class="titleOne">涨·知识</span>
            <span class="titleTwo">让身边更美好</span>
          </div>
          <div class="right">
            <span class="newMore">MORE</span>
          </div>
        </div>
      </router-link>
      <div class="con" v-if="news">
        <div class="city">{{news['type']}}</div>
        <div class="right">
          <a :href="news['url']">
            <div class="news">
              <div class="top">{{news['title']}}</div>
              <div class="des">"{{news['description']}}..."</div>
              <div class="view">
                <span>浏览({{news['hits']}})</span>
                <span>评论({{news['num']}})</span>
              </div>
            </div>
            <div class="newsImg">
              <img
                v-bind:src="[news['picture']?fullUrl(news['picture'])+'!340.233':defaultPicUrl()]"
                class="w100"
              />
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="index-gray"></div>
    <div class="good">
      <router-link :to="{ path: '/funlist/'}">
        <div class="index-box-t">
          <div class="left">
            <span class="titleOne">好玩·好物</span>
            <span class="titleTwo">捕捉城市惊喜</span>
          </div>
          <div class="right">
            <span class="newMore">MORE</span>
          </div>
        </div>
      </router-link>
      <div class="con" v-if="ft_ads"></div>
    </div>
    <div class="banner">
      <mt-swipe :auto="5000" class="swipe2" v-if="ft_ads">
        <template v-for="ft_ad in ft_ads">
          <mt-swipe-item class="swipe-item">
            <a v-on:click="changeClick(ft_ad['id'],ft_ad['url'])">
              <img v-if="ft_ad['picture']" :src="fullUrl(ft_ad['picture'])+'!748.378'" />
            </a>
          </mt-swipe-item>
        </template>
      </mt-swipe>
    </div>
    <div class="index-gray"></div>
    <div class="discount dn">
      <div class="t">
        <span class="red">DISCOUNT</span>|
        <span>天天特惠</span>
        <span class="fr">市面最低价，没有之一</span>
      </div>
      <div class="con">
        <ul>
          <li>
            <div class="img">
              <img src="../assets/images/dispic.png" class="w100" />
            </div>
            <div class="info">
              <div class="p1">TATA木门 • 简约时尚室内门</div>
              <div class="p2">
                <span>限时品质促销</span>
                <span>
                  可用鲸豆抵￥
                  <em>5.3</em>
                </span>
              </div>
              <div class="p3">
                <span>
                  ￥
                  <em>1299</em>
                </span>
                <del>￥3222</del>
              </div>
            </div>
          </li>
          <li>
            <div class="img">
              <img src="../assets/images/dispic.png" class="w100" />
            </div>
            <div class="info">
              <div class="p1">TATA木门 • 简约时尚室内门</div>
              <div class="p2">
                <span>限时品质促销</span>
                <span>
                  可用鲸豆抵￥
                  <em>5.3</em>
                </span>
              </div>
              <div class="p3">
                <span>
                  ￥
                  <em>1299</em>
                </span>
                <del>￥3222</del>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <router-link :to="{path:'/discount/',query:{tab:'hide'}}">
        <div class="loadmore">
          <span>查看更多</span>
        </div>
      </router-link>
    </div>

    <div class="shops dn">
      <router-link :to="{ path: '/nearby/0/'}">
        <div class="index-box-t">
          <span class="red">EXQUISITE SHOPS</span>|
          <span>不容错过的好店</span>
        </div>
      </router-link>
      <div class="con">
        <ul>
          <template v-for="shop in shops">
            <li>
              <a v-on:click="changeClick(shop['id'],shop['url'])">
                <div class="img">
                  <img
                    v-if="shop['picture']"
                    :src="fullUrl(shop['picture'])+'!348.199'"
                    class="w100"
                  />
                </div>
                <div class="info">
                  <div class="p1">{{shop['name']}}</div>
                  <div class="p2">{{shop['tag']}}</div>
                </div>
              </a>
            </li>
          </template>
        </ul>
      </div>
      <router-link :to="{path:'/nearby/0/'}">
        <div class="loadmore">
          <span>查看更多</span>
        </div>
      </router-link>
    </div>

    <div class="index-gray"></div>

    <div class="public dn">
      <router-link :to="{ path: '/charity/'}">
        <div class="index-box-t">
          <span class="red">PUBLIC WELFARE</span>|
          <span>本土公益</span>
        </div>
      </router-link>
      <div class="text-tips">
        <router-link :to="{ path: '/explain/'}">#平台郑重承诺：每次消费使用鲸豆的10%将直达公益项目，共建美好App</router-link>
      </div>
      <div class="welfare-list2">
        <ul>
          <template v-for="(charity, index) in charitys">
            <li :key="index">
              <a v-on:click="charityClick(charity.id)">
                <div class="pic">
                  <img
                    v-if="charity['picture']"
                    :src="fullUrl(charity['picture'])+'!640.340'"
                    class="w100"
                    alt="Smart App欢迎您!"
                  />
                  <div class="operation">
                    <div class="btn"></div>
                    <div class="num">
                      <span>{{charity['vote']}}</span>份投票
                    </div>
                  </div>
                </div>
              </a>
            </li>
          </template>
        </ul>
        <router-link :to="{path:'/charity/',query:{tab:'hide'}}">
          <div class="loadmore">
            <span>查看更多</span>
          </div>
        </router-link>
      </div>
    </div>

    <tab :index="1" />
  </div>
</template>

<script>
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config";
import Store from "@/store/store";

export default {
  components: {
    Error,
    Tab
  },
  data() {
    const indexData = Store.getIndex();
    const say = indexData && indexData["say"];
    const ads = indexData && indexData["ads"];
    const ft_ads = indexData && indexData["ft_ads"];
    const news = indexData && indexData["news"];
    const charitys = indexData && indexData["charitys"];
    const shops = indexData && indexData["shops"];
    return {
      say: say,
      ads: ads,
      ft_ads: ft_ads,
      news: news,
      shops: shops,
      charitys: charitys,
      isError: false,
      error: "",
      indexUrl: "index/view/",
      adUrl: "ads/hit/",
      whoami: "user/whoami/"
    };
  },

  mounted() {
    if (this.$route.query.ver && this.$route.query.ver == "V2") {
      Store.setVersion(this.$route.query.ver);
    }
    this.getData();
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret["code"] === 0) {
          this.clickApp(ret["username"], ret["despass"]);
        }
      });
    } else {
      //this.clickApp('zhxy','')
    }
  },

  watch: {
    $route(to, from) {
      this.getData(() => window.scrollTo(0, 0));
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
    loadMore() {
      document.addEventListener("scroll", this.winScroll(), false);
    },

    winScroll: function() {
      var scrollTop = document.body.scrollTop > 100 ? 100 : document.body.scrollTop;
      document.getElementsByClassName("company-top-nav")[0].style.background = "rgba(0, 0, 0, " + scrollTop / 100 + ")";
    },

    charityClick: function(id) {
      window.location.href = "#/charity/" + id;
    },
    clickApp: function(username, despass) {
      var tags = [username, "aa"];
      var share = {
        action: "getUserMessage",
        Authorization: "Xyapp " + Store.getAuthUid(),
        tags: tags,
        user: despass,
        deviceWIFI: "http://117.158.161.250",
        url: "http://www.baidu.com?" + new Date().getTime()
      };
      if (window.postMessage) window.postMessage(JSON.stringify(share), "*");
      return true;
    },

    getData(callback) {
      this.$http.get(this.indexUrl, {}).then(
        response => {
          if (typeof response.data === "object") {
            var ret = response.data;
          } else {
            var ret = JSON.parse(response.data || "[]");
          }
          if (ret && ret.code === 0) {
            this.ads = ret["data"]["ads"];
            this.news = ret["data"]["news"];
            this.say = ret["data"]["say"];
            this.shops = ret["data"]["shop"];
            this.ft_ads = ret["data"]["ft_ads"];
            this.charitys = ret["data"]["charity"];
            const indexData = {
              say: this.say,
              news: this.news,
              ads: this.ads,
              ft_ads: this.ft_ads,
              shops: this.shops,
              charitys: this.charitys
            };
            Store.setIndex(indexData);
          } else {
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
          if (callback) callback.call(this);
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
.company-top-nav {
  z-index: 123456;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 0.45rem;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  overflow: hidden;
}
.company-top-nav .right-btn {
  position: absolute;
  right: 0.08rem;
  top: 0;
  width: 0.8rem;
  height: 0.45rem;
  line-height: 0.45rem;
  text-align: center;
}
.company-top-nav .right-btn a {
  display: block;
  position: relative;
  float: left;
  width: 0.35rem;
  height: 0.45rem;
}
.company-top-nav .right-btn .sea {
  color: #fff;
}
.company-top-nav .right-btn .user {
  color: #fff;
}
a {
  display: block;
  overflow: hidden;
}
/* 轮播广告图 */
.banner {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
}
.swipe {
  height: 1.6rem;
  color: #fff;
  font-size: 30px;
  text-align: center;
}
.swipe2 {
  height: 1.6rem;
  color: #fff;
  font-size: 30px;
  text-align: center;
}
.banner img {
  width: 100%;
}
/* 搜索框 */
.search-wrap {
  z-index: 123;
  position: absolute;
  left: 50%;
  margin-left: -35%;
  top: 0.15rem;
  width: 70%;
  height: 0.3rem;
  border-radius: 0.3rem;
  background-color: rgba(255, 255, 255, 0.5);
}
.search-wrap input {
  background: none;
  width: 70%;
  float: left;
  margin-left: 0.05rem;
  border: none;
  outline: none;
  height: 0.3rem;
  line-height: 0.3rem;
  color: #fff;
}
.icon-search {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  /* float: left; */
  margin-left: 0.1rem;
  background: url("~@/assets/images/icon-search.png") center center no-repeat;
  background-size: 0.15rem 0.15rem;
}
/* 一句话评论 */
.headline {
  overflow: hidden;
  line-height: 0.24rem;
  vertical-align: middle;
  padding: 0.05rem 0.1rem;
  background: #ffffff;
}
.headline .time {
  display: inline-block;
  vertical-align: middle;
}
.headline .time em {
  font-size: 0.24rem;
  margin-right: 0.02rem;
}
.headline .txt {
  display: inline-block;
  vertical-align: middle;
  line-height: 0.24rem;
  width: 65%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 0.15rem;
  margin-left: 0.1rem;
}
.headline .num {
  width: 0.22rem;
  height: 0.22rem;
  display: inline-block;
  vertical-align: middle;
  background: #f45633;
  border-radius: 0.22rem;
  text-align: center;
  line-height: 0.22rem;
  color: #ffffff;
}
.index-gray {
  width: 100%;
  height: 0.075rem;
  overflow: hidden;
  background: #f5f5f5;
}
/* 查看更多同一样式 */
.loadmore {
  padding: 0.07rem 0.1rem;
  overflow: hidden;
  color: #969696;
  text-align: center;
  vertical-align: top;
}
.loadmore span {
  font-size: 0.12rem;
}
/* 菜单栏 */
.column {
  display: block;
  width: 98%;
  height: 0.8rem;
  overflow: hidden;
  padding: 1%;
  background: #fff;
}
.column a {
  display: none;
}
.column .filmTv {
  display: inline-block;
  width: 37%;
  height: 0.7rem;
  background: url("~@/assets/images/app/column/filmTv.png") center no-repeat;
  background-size: 100% 100%;
}
.column .productList {
  display: inline-block;
  width: 37%;
  height: 0.7rem;
  background: url("~@/assets/images/app/column/productList.png") center no-repeat;
  background-size: 100% 100%;
}
.column .checkMore {
  display: inline-block;
  width: 22.6%;
  height: 0.7rem;
  background: url("~@/assets/images/app/column/checkMore.png") center no-repeat;
  background-size: 100% 100%;
}
/* 热门新闻 */
.hotNew {
  overflow: hidden;
  background: #ffffff;
}
/* 标题栏 */
.hotNew .index-box-t {
  height: 0.4rem;
  line-height: 0.4rem;
  overflow: hidden;
}
.hotNew .index-box-t .left {
  display: inline-block;
  width: 64%;
  height: 0.3rem;
  margin-left: 0.1rem;
  border: 1px solid #000;
  border-radius: 3px;
  line-height: 0.3rem;
  text-align: center;
  font-size: 0;
}
.titleOne {
  display: inline-block;
  width: 37%;
  height: 0.3rem;
  line-height: 0.3rem;
  font-size: 0.14rem;
  font-weight: bold;
}
.titleTwo {
  display: inline-block;
  width: 62.8%;
  height: 0.3rem;
  line-height: 0.3rem;
  font-size: 0.14rem;
  color: #fff;
  background: #000;
}
.hotNew .index-box-t .right {
  display: inline-block;
  width: 28%;
  height: 0.3rem;
  line-height: 0.3rem0;
  text-align: right;
}
.newMore {
  display: inline-block;
  font-weight: bold;
  font-size: 9;
  font-size: 0.14rem;
  letter-spacing: 0.005rem;
}
/* 新闻内容 */
.hotNew .con {
  padding: 0.1rem;
  overflow: hidden;
}
.hotNew .con .city {
  float: left;
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 0.35rem;
  overflow: hidden;
  line-height: 0.34rem;
  text-align: center;
  background: #fa500f;
  color: #ffffff;
  font-size: 0.12rem;
}
.hotNew .con .right {
  margin-left: 0.4rem;
  overflow: hidden;
}
.hotNew .con .right .news {
  width: 43%;
  padding-right: 2%;
  overflow: hidden;
  float: left;
}
.hotNew .con .right .news .top {
  font-size: 0.12rem;
  border-bottom: #eaeaea 1px solid;
  padding-bottom: 0.05rem;
  line-height: 0.18rem;
  font-weight: bold;
}
.hotNew .con .right .news .des {
  color: #646464;
  font-size: 0.1rem;
  margin-top: 0.05rem;
}
.hotNew .con .right .news .view {
  margin-top: 0.03rem;
}
.hotNew .con .right .news .view span {
  padding-right: 0.03rem;
  font-size: 0.1rem;
  color: #969696;
}
.hotNew .con .right .newsImg {
  width: 55%;
  float: right;
}
/* 好玩好物 */
.good {
  overflow: hidden;
  background: #ffffff;
}
/* 标题栏 */
.index-box-t {
  height: 0.4rem;
  line-height: 0.4rem;
  overflow: hidden;
}
.good .index-box-t .left {
  display: inline-block;
  width: 64%;
  height: 0.3rem;
  margin-left: 0.1rem;
  border: 1px solid #000;
  border-radius: 3px;
  line-height: 0.3rem;
  text-align: center;
  font-size: 0;
}
.titleOne {
  display: inline-block;
  width: 37%;
  height: 0.3rem;
  line-height: 0.3rem;
  font-size: 0.14rem;
  font-weight: bold;
}
.titleTwo {
  display: inline-block;
  width: 62.8%;
  height: 0.3rem;
  line-height: 0.3rem;
  font-size: 0.14rem;
  color: #fff;
  background: #000;
}
.good .index-box-t .right {
  display: inline-block;
  width: 28%;
  height: 0.3rem;
  line-height: 0.3rem0;
  text-align: right;
}
.newMore {
  display: inline-block;
  font-weight: bold;
  font-size: 9;
  font-size: 0.14rem;
  letter-spacing: 0.005rem;
}
/* 天天特惠 */
.discount {
  overflow: hidden;
  background: #ffffff;
  font-size: 0.12rem;
}
.discount .t {
  height: 0.4rem;
  line-height: 0.4rem;
  overflow: hidden;
  border-bottom: #eaeaea 1px solid;
  font-size: 0.14rem;
  vertical-align: middle;
}
.discount .t .red {
  display: inline-block;
  color: #fd0502;
  margin-left: 0.1rem;
  margin-right: 0.03rem;
  transform-origin: 90% 50%;
  -webkit-transform-origin: 90% 50%;
  -moz-transform-origin: 90% 50%;
  -ms-transform-origin: 90% 50%;
}
.discount .t .spl {
  color: #c0c0c0 !important;
  margin-right: 0.07rem;
}
.discount .t .fr {
  font-size: 0.12rem;
  margin-right: 0.1rem;
  vertical-align: middle;
}
.discount .con {
  overflow: hidden;
}
.discount .con li {
  padding: 0.1rem;
  overflow: hidden;
  margin-bottom: 1px;
  border-bottom: #eaeaea 1px solid;
}
.discount .con li .img {
  width: 1.1rem;
  overflow: hidden;
  float: left;
}
.discount .con li .info {
  margin-left: 1.2rem;
  overflow: hidden;
}
.discount .con li .info .p2 {
  font-size: 0.12rem;
  color: #fa500f;
  margin-top: 0.05rem;
}
.discount .con li .info .p2 em {
  font-size: 0.18rem;
  font-weight: bold;
}
.discount .con li .info .p3 {
  margin-top: 0.05rem;
}
.discount .con li .info .p3 em {
  font-size: 0.2rem;
}
.discount .con li .info .p3 del {
  margin-left: 0.1rem;
  color: #787878;
}
/* 附近好店 */
.shops {
  overflow: hidden;
  background: #ffffff;
}
.shops li {
  padding: 0.1rem;
  overflow: hidden;
  border-bottom: #eaeaea 1px solid;
}
.shops li .img {
  width: 1.5rem;
  float: left;
}
.shops li .info {
  margin-left: 1.6rem;
  overflow: hidden;
  font-size: 0.14rem;
}
.shops li .info .p2 {
  margin-top: 0.1rem;
  font-size: 0.12rem;
  color: #636363;
}
/* 公益 */
/*
.public{ background:#ffffff;}
*/
/* 公益资金提示 */
/*
.text-tips{ overflow:hidden; padding:0.1rem; font-size:0.12rem; color:#969696}
*/
/* 公益信息展示(图片) */
/* 
.welfare-list2 { overflow:hidden; padding-bottom:0.1rem; margin-top:-0.1rem;}
.welfare-list2 li { position:relative; border-top:#fff 0.1rem solid; overflow:hidden;   }
.welfare-list2 li .pic { overflow:hidden; position:relative; }
.welfare-list2 li .operation { position:absolute; left:0.2rem; bottom:0.3rem; }
.welfare-list2 li .operation .btn { width:0.73rem; height:0.24rem; background:url("../assets/images/bnt-vote.png") center center no-repeat;background-size:contain; }
.welfare-list2 li .operation .num { margin-top:0.1rem; font-size:0.13rem; color:#f87f19; }
.welfare-list2 li .operation .num span { font-size:0.23rem; }
*/
</style>
