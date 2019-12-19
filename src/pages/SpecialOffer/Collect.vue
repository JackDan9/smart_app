<template>
  <div>
    <div class="page-topnav">
      <div class="navTop">
        <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
        <span class="navCon">收藏</span>
      </div>
    </div>
    <div class="pt45"></div>
    <div class="wnav">
      <ul>
        <li>
          <a v-bind:class="[isClass1 ? 'current1' : '']" v-on:click="addChange('con1')">好玩</a>
        </li>
        <li>
          <a v-bind:class="[isClass2 ? 'current1' : '']" v-on:click="addChange('con2')">好物</a>
        </li>
        <li>
          <a v-bind:class="[isClass3 ? 'current1' : '']" v-on:click="addChange('con3')">好店</a>
        </li>
      </ul>
    </div>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="isLoading"
      infinite-scroll-distance="10"
    >
      <template v-for="(fun_data, index) in funs">
        <div class="fun-box" :key="index">
          <router-link :to="{ path: '/fun/'+fun_data.id ,query:{tab:'hide'} }" append>
            <div class="pic">
              <img
                v-if="fun_data['picture']"
                :src="fullUrl(fun_data['picture'])+'!640.398'"
                class="w100"
                alt
              />
            </div>
          </router-link>
          <div class="info">
            <div class="p1">【{{fun_data['companyid']}}】{{fun_data['name']}}</div>
            <div class="p2">
              <div class="fl">{{fun_data['type']}} {{fun_data['opentime']}}</div>
              <div class="fr" v-if="fun_data['price']">￥{{fun_data['price']}}</div>
            </div>
          </div>
        </div>
      </template>
      <template v-for="(thing, index) in things">
        <div class="goods-box" :key="index">
          <div class="pic">
            <router-link :to="{ path: '/thing/'+thing.id ,query:{tab:'hide'} }" append>
              <img v-if="thing['picture']" :src="fullUrl(thing['picture'])+'!640.398'" class="w100" />
            </router-link>
          </div>
          <div class="info">
            <div class="p1">{{thing['name']}}</div>
            <div class="p2">{{thing['type']}}.{{thing['companyid']}}</div>
          </div>
        </div>
      </template>
      <template v-for="(company, index) in companys">
        <router-link :to="{ path: '/company/'+company.id }" :key="index" append>
          <div class="shop-list">
            <div class="img">
              <img
                v-if="company['picture']"
                :src="fullUrl(company['picture'])+'!128.80'"
                width="128"
                height="80"
              />
            </div>
            <div class="info">
              <p class="p1">{{company['name']}}</p>
              <p class="p2">
                <a
                  class="redstar"
                  v-bind:class="[company['star_x'] ? 'rw'+company['star_x'] : 'rw5']"
                >
                  <span>
                    <img src="~@/assets/images/star-red2.png" alt />
                  </span>
                </a>
                <em>{{company['star']}}分</em>
              </p>
              <p class="p2">{{company['prief']}}</p>
              <p class="p3">
                <span>人均约{{company['price']}}元</span>
                <em>{{company['distance']}}</em>
              </p>
            </div>
          </div>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config.js";
import Store from "@/store/store.js";

export default {
  components: {
    Error
  },
  data() {
    return {
      funs: [],
      companys: [],
      things: [],
      isLoading: false,
      isError: false,
      error: "",
      isClass1: 1,
      isClass2: 0,
      isClass3: 0,
      lat: 0,
      lng: 0,
      whoami: "user/whoami/",
      viewListUrl: "like/viewlist/"
    };
  },
  mounted() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
          this.username = ret["nickname"] ? ret["nickname"] : ret["username"];
        }
      });
    } else {
      this.$router.push("/login");
    }
    const point = Store.getPOINT();
    if (point) {
      this.lat = point["lat"];
      this.lng = point["lng"];
    }
    this.getData();
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    loadMore() {
      if (this.isClass1) {
        this.getData();
      } else if (this.isClass2) {
        this.getThingData();
      } else {
        this.getCompanyData();
      }
    },

    addChange: function(con) {
      if (con == "con1") {
        this.isClass1 = 1;
        this.isClass2 = 0;
        this.isClass3 = 0;
      } else if (con == "con2") {
        this.isClass1 = 0;
        this.isClass2 = 1;
        this.isClass3 = 0;
      } else if (con == "con3") {
        this.isClass1 = 0;
        this.isClass2 = 0;
        this.isClass3 = 1;
      }
      this.page = 1;
      if (this.isClass1) {
        this.getData(() => window.scrollTo(0, 0));
      } else if (this.isClass2) {
        this.getThingData(() => window.scrollTo(0, 0));
      } else {
        this.getCompanyData(() => window.scrollTo(0, 0));
      }
    },

    getData(callback) {
      this.$http.post(this.viewListUrl, { page: this.page, type: 2 }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.page = ret["data"]["page"];
            this.companys = this.things = [];
            if (this.page == 1) {
              this.funs = ret["data"]["linklist"];
            } else {
              var funs_new = ret["data"]["linklist"];
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
    getCompanyData(callback) {
      this.$http
        .post(this.viewListUrl, {
          page: this.page,
          type: 8,
          lat: this.lat,
          lng: this.lng
        })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              this.page = ret["data"]["page"];
              this.funs = this.things = [];
              if (this.page == 1) {
                this.companys = ret["data"]["linklist"];
              } else {
                var companys_new = ret["data"]["linklist"];
                if (companys_new && companys_new.length) {
                  for (var i = 0; i < companys_new.length; i++) {
                    this.companys.push(companys_new[i]);
                  }
                }
              }
              this.total = ret["data"]["total"];
              if (this.page <= this.total) {
                this.page = this.page + 1;
              }
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
      this.$http.post(this.viewListUrl, { page: this.page, type: 3 }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.companys = this.funs = [];
            this.page = ret["data"]["page"];
            this.ads = ret["data"]["ads"];
            if (this.page == 1) {
              this.things = ret["data"]["linklist"];
            } else {
              var things_new = ret["data"]["linklist"];
              if (things_new && things_new.length) {
                for (var i = 0; i < things_new.length; i++) {
                  this.things.push(things_new[i]);
                }
              }
            }
            this.total = ret["data"]["total"];
            if (this.page <= this.total) {
              this.page = this.page + 1;
            }
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
.navCon {
  width: 80%;
}
.wnav {
  width: 100%;
  height: 0.45rem;
  overflow: hidden;
}
.wnav li {
  width: 33%;
  height: 0.45rem;
  line-height: 0.45rem;
  float: left;
  text-align: center;
}
.wnav li a {
  font-size: 0.16rem;
  color: #888;
}
.wnav li .current1 {
  color: #333;
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
  font-size: 0.16rem;
}
.fun-box .info .p2 {
  font-size: 0.14rem;
  color: #787878;
  margin-top: 0.05rem;
}
.fun-box .info .p2 .fr {
  color: #333;
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
  font-size: 0.16rem;
}
.goods-box .info .p2 {
  font-size: 0.14rem;
  color: #787878;
  margin-top: 0.05rem;
}
.shop-list {
  overflow: hidden;
}
.shop-list {
  padding: 0.1rem;
  overflow: hidden;
  border-bottom: #efefef 1px solid;
  background: #ffffff;
}
.shop-list .img {
  width: 128px;
  height: 80px;
  float: left;
}
.shop-list .info {
  margin-left: 138px;
  color: #a7a7a7;
  font-size: 14px;
}
.shop-list .info .p1 {
  color: #3a3a3a;
  font-size: 16px;
}
.shop-list .info .p3 span {
  margin-right: 5px;
  color: #3a3a3a;
}
.shop-list .info .p2 {
  margin-top: 0.05rem;
  overflow: hidden;
}
.shop-list .info .p2 em {
  float: left;
  display: block;
  margin-left: 0.1rem;
  color: #ff6432;
  line-height: 0.17rem;
}
.shop-list .info .p2 .redstar {
  display: block;
  float: left;
  position: relative;
  width: 0.8rem;
  height: 0.15rem;
  overflow: hidden;
  background: url("~@/assets/images/star-gray.png") top left no-repeat;
  background-size: 0.78rem 0.14rem;
}
.shop-list .info .p2 .redstar span {
  float: left;
  display: block;
  position: absolute;
  overflow: hidden;
  left: 0;
  top: 0;
  width: 100%;
  height: 0.15rem;
}
.shop-list .info .p2 .redstar img {
  display: block;
  width: 0.78rem;
}
.shop-list .info .p2 .rw1 span {
  width: 20%;
}
.shop-list .info .p2 .rw2 span {
  width: 40%;
}
.shop-list .info .p2 .rw3 span {
  width: 60%;
}
.shop-list .info .p2 .rw4 span {
  width: 80%;
}
.shop-list .info .p2 .rw5 span {
  width: 100%;
}
.shop-list .info .p3 em {
  float: right;
  margin-right: 0.1rem;
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
.com-top-nav .tab {
  position: absolute;
  left: 25%;
  bottom: 2px;
  width: 1.8rem;
  height: 0.42rem;
  line-height: 0.42rem;
  text-align: center;
}
.com-top-nav .tab a {
  color: #969696;
  display: inline-block;
  width: 0.5rem;
  line-height: 0.42rem;
  font-size: 0.16rem;
}
.com-top-nav .tab .current {
  color: #ffffff;
}
</style>
