<template>
  <div>
    <div class="page-topnav">
      <div class="navTop">
        <div class="iconfont back" v-on:click="goBack()">&#xe609;</div>
        <div class="tab">
          <a v-bind:class="[isClass ? 'current' : '']" v-on:click="addChange('con1')">好玩</a>
          <a v-bind:class="[isClass ? '' : 'current']" v-on:click="addChange('con2')">好物</a>
        </div>
      </div>
    </div>
    <div class="banner">
      <mt-swipe :auto="4000" class="swipe" v-if="ads">
        <template v-for="ad in ads">
          <mt-swipe-item class="swipe-item">
            <a v-on:click="changeClick(ad['id'],ad['url'])">
              <img v-if="ad['picture']" :src="fullUrl(ad['picture'])+'!640.301'" />
            </a>
          </mt-swipe-item>
        </template>
      </mt-swipe>
    </div>
    <div class="classify-box">
      <ul>
        <li v-for="type in types" v-if="isClass">
          <router-link :to="{ path:'/funcat/'+type.key}">{{type['name']}}</router-link>
        </li>
      </ul>
    </div>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="isLoading"
      infinite-scroll-distance="10"
    >
      <template v-for="fun_data in funs" v-if="isClass">
        <div class="fun-box">
          <a v-on:click="funClick(fun_data.id)">
            <div class="pic">
              <img
                v-if="fun_data['picture']"
                :src="fullUrl(fun_data['picture'])+'!640.398'"
                class="w100"
                alt
              />
            </div>
          </a>
          <div class="info">
            <div class="p1">{{fun_data['name']}}</div>
            <div class="p2">
              <div class="fl">{{fun_data['type']}} {{fun_data['opentime']}}</div>
              <div class="fr" v-if="fun_data['price']">￥{{fun_data['price']}}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-for="thing in things" v-if="!isClass">
        <div class="goods-box">
          <div class="pic">
            <a v-on:click="thingClick(thing.id)">
              <img v-if="thing['picture']" :src="fullUrl(thing['picture'])+'!640.398'" class="w100" />
            </a>
            <div
              v-bind:class="[thing['isLike'] ? 'red-heart' : 'heart']"
              v-on:click="addLike(thing['id'],thing['isLike'])"
              v-bind:id="thing['id']"
              style="display:none;"
            ></div>
          </div>
          <div class="info">
            <div class="p1">{{thing['name']}}</div>
            <div class="p2">{{thing['type']}}.{{thing['companyName']}}</div>
          </div>
        </div>
      </template>
    </div>
    <tab :index="4" />
  </div>
</template>
<script>
import Loading from "../../components/Loading.vue";
import Error from "../../components/Error.vue";
import Tab from "../../components/Tab.vue";
import Config from "../../config.js";
import Store from "../../store.js";

export default {
  components: {
    Error,
    Tab
  },
  data() {
    const preData = {
      key: "funlist",
      keyThing: "thinglist",
      things: [],
      funs: [],
      ads: [],
      types: [],
      isLoading: false,
      isError: false,
      error: "",
      adUrl: "ads/hit/",
      thingListUrl: "thing/viewlist/",
      funListUrl: "fun/viewlist/",
      isClass: 1
    };

    const whichPage = Store.getIntoPage();
    if (whichPage == 2) {
      preData.isClass = 0;
    }

    const buffer = this.bufferList.getBuffer(preData.key);
    if (buffer && buffer["props"]) {
      preData.page = buffer["props"]["page"] || 1;
      preData.types = buffer["props"]["types"] || [];
      preData.ads = buffer["props"]["ads"] || [];
      preData.funs = buffer["data"] || [];
      preData.y = buffer["props"]["y"] || 0;
    }

    const bufferThing = this.bufferList.getBuffer(preData.keyThing);
    if (bufferThing && bufferThing["props"]) {
      preData.things = bufferThing["data"] || [];
      preData.pageThing = bufferThing["props"]["page"] || 1;
      preData.yThing = bufferThing["props"]["y"] || 0;
    }

    return preData;
  },
  mounted() {
    if (this.isClass) {
      if (this.funs.length === 0) {
        this.getData();
      } else {
        window.scrollTo(0, this.y);
      }
    } else {
      if (this.things.length === 0) {
        this.getThingData();
      } else {
        window.scrollTo(0, this.yThing);
      }
    }
  },

  watch: {
    $route() {
      this.getData();
    }
  },

  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    handleScroll: function() {
      if (this.isClass) {
        this.y = window.scrollY;
        this.bufferList.setProps(this.key, { y: this.y });
      } else {
        this.yThing = window.scrollY;
        this.bufferList.setProps(this.keyThing, { y: this.yThing });
      }
    },
    goBack: function() {
      this.$router.push("/");
    },
    funClick: function(id) {
      window.location.href = "#/fun/" + id;
    },
    thingClick: function(id) {
      window.location.href = "#/thing/" + id;
    },
    changeClick: function(id, url) {
      this.$http.post(this.adUrl, { id: id }).then(response => {
        window.location.href = url;
      });
    },

    loadMore() {
      if (this.isClass) {
        this.getData();
      } else {
        this.getThingData();
      }
    },

    addChange: function(con) {
      window.removeEventListener("scroll", this.handleScroll);
      this.isClass = con == "con1" ? 1 : 0;
      if (this.isClass) {
        if (this.funs.length === 0) this.getData(() => window.scrollTo(0, 0));
        else {
          setTimeout(() => {
            window.scrollTo(0, this.y);
            window.addEventListener("scroll", this.handleScroll);
          }, 50);
        }
        Store.setIntoPage(1);
      } else {
        if (this.things.length === 0)
          this.getThingData(() => window.scrollTo(0, 0));
        else {
          setTimeout(() => {
            window.scrollTo(0, this.yThing);
            window.addEventListener("scroll", this.handleScroll);
          }, 50);
        }
        Store.setIntoPage(2);
      }
    },

    getData() {
      this.$http.post(this.funListUrl, { page: this.page, type: 0 }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            //this.things = [];
            this.page = ret["data"]["page"];
            this.types = ret["data"]["types"];
            this.ads = ret["data"]["ads"];
            if (this.page == 1) {
              this.funs = ret["data"]["funlist"];
            } else {
              var funs_new = ret["data"]["funlist"];
              if (funs_new && funs_new.length) {
                for (var i = 0; i < funs_new.length; i++) {
                  this.funs.push(funs_new[i]);
                }
              }
            }
            this.total = ret["data"]["total"];
            if (this.page <= this.total) {
              this.page = this.page + 1;
            }

            this.bufferList.setBuffer(this.key, this.funs, {
              page: this.page,
              types: this.types,
              ads: this.ads
            });
          } else {
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
          if (typeof callback === "function") {
            callback.call(this);
          }
        },
        response => {
          this.isError = true;
          this.error = "";
          if (typeof callback === "function") {
            callback.call(this);
          }
        }
      );
    },
    getThingData(callback) {
      this.$http.post(this.thingListUrl, { page: this.pageThing }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.pageThing = ret["data"]["page"];
            this.ads = ret["data"]["ads"];
            if (this.pageThing == 1) {
              this.things = ret["data"]["thing"];
            } else {
              var things_new = ret["data"]["thing"];
              if (things_new && things_new.length) {
                for (var i = 0; i < things_new.length; i++) {
                  this.things.push(things_new[i]);
                }
              }
            }
            this.total = ret["data"]["total"];
            if (this.pageThing <= this.total) {
              this.pageThing = this.pageThing + 1;
            }
            this.bufferList.setBuffer(this.keyThing, this.things, {
              page: this.pageThing
            });
          } else {
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
          if (typeof callback === "function") {
            callback.call(this);
          }
        },
        response => {
          this.isError = true;
          this.error = "";
          if (typeof callback === "function") {
            callback.call(this);
          }
        }
      );
    }
  }
};
</script>
<style scoped>
.banner {
  position: relative;
  width: 100%;
  height: auto;
  padding-top: 0.45rem;
  overflow: hidden;
}
.swipe {
  height: 1.6rem;
  color: #fff;
  font-size: 30px;
  text-align: center;
}
.banner img {
  width: 100%;
}
.seize {
  width: 100%;
  height: 0.45rem;
  overflow: hidden;
}
.fun-box {
  overflow: hidden;
  background: #ffffff;
}
.fun-box .pic {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.fun-box .info {
  overflow: hidden;
  padding: 0.1rem;
}
.fun-box .info .p1 {
  font-size: 0.2rem;
  color: #000000;
}
.fun-box .info .p2 {
  margin-top: 0.05rem;
}
.fun-box .info .p2 .fl {
  overflow: hidden;
  float: left;
  font-size: 0.17rem;
  color: #626262;
}
.fun-box .info .p2 .fr {
  color: #000000;
  font-size: 0.17rem;
}
.goods-box {
  overflow: hidden;
  background: #ffffff;
  margin-bottom: 0.1rem;
}
.goods-box .pic {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.goods-box .info {
  overflow: hidden;
  padding: 0.1rem;
}
.goods-box .info .p1 {
  font-size: 0.2rem;
  color: #000000;
}
.goods-box .info .p2 {
  font-size: 0.17rem;
  color: #626262;
  margin-top: 0.05rem;
}
.classify-box {
  overflow: hidden;
  padding: 0.1rem 0;
  background: #f3f3f3;
}
.classify-box li {
  width: 20%;
  margin-left: 2.5%;
  margin-right: 2.5%;
  float: left;
  background: #ffffff;
  margin-top: 0.05rem;
  margin-bottom: 0.05rem;
  padding: 0.15rem 0;
  text-align: center;
  color: #000;
}
.classify-box li a {
  font-size: 0.14rem;
}
.navTop .tab {
  position: absolute;
  left: 50%;
  bottom: 2px;
  margin-left: -0.6rem;
  width: 1.2rem;
  height: 0.42rem;
  line-height: 0.42rem;
  text-align: center;
}
.navTop .tab a {
  color: #ffffff;
  display: inline-block;
  width: 0.5rem;
  line-height: 0.42rem;
  font-size: 0.16rem;
}
.navTop .tab .current {
  border-bottom: #ffffff 2px solid;
}
</style>
