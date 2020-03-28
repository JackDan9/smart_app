<template>
  <div>
    <div class="page-topnav">
      <div class="navTop">
        <router-link :to="{path:'/'}">
          <i class="iconfont back">&#xe609;</i>
        </router-link>
        <div class="tab">
          <a class="current">{{name}}</a>
        </div>
      </div>
    </div>
    <div class="seize"></div>
    <div class="shop-nav" id="logo" v-infinite-scroll="loadMore2">
      <ul>
        <li v-on:click="addChange(39)">
          <i class="d1"></i>
          <p>餐吧</p>
        </li>
        <li v-on:click="addChange(38)">
          <i class="d2"></i>
          <p>咖啡馆</p>
        </li>
        <li v-on:click="addChange(44)">
          <i class="d4"></i>
          <p>旅舍</p>
        </li>
        <li v-on:click="addChange(62)">
          <i class="d3"></i>
          <p>KTV</p>
        </li>
        <li v-on:click="addChange(58)">
          <i class="d7"></i>
          <p>大排档</p>
        </li>
        <li v-on:click="addChange(63)">
          <i class="d5"></i>
          <p>影吧</p>
        </li>
        <li v-on:click="addChange(60)">
          <i class="d6"></i>
          <p>丽人</p>
        </li>
        <li>
          <router-link :to="{path:'/category'}">
            <i class="d8"></i>
            <p>更多</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="near-line"></div>
    <div class="ad">
      <router-link :to="{path:'/gold'}">
        <img src="~@/assets/images/nearad.png" class="w100" />
      </router-link>
    </div>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="isLoading"
      infinite-scroll-distance="10"
      class="shop-list"
    >
      <ul>
        <template v-for="(company, index) in companys">
          <a v-on:click="changeClick(company.id)" :key="index">
            <li>
              <div class="img">
                <img
                  v-if="company['picture']"
                  :src="fullUrl(company['picture'])+'!260.163'"
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
            </li>
          </a>
        </template>
      </ul>
    </div>
    <tab :index="2" />
    <div id="toTop" v-on:click="toTop" v-bind:class="[ isClass > 0  ? '' : 'dn']">
      <img src="~@/assets/images/toTop.png" />
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config";
import Storage from "@/storage/storage";

export default {
  components: {
    Error,
    Tab
  },
  data() {
    const preData = {
      key: "nearby",
      companys: [],
      isLoading: false,
      isError: false,
      error: "",
      name: "",
      lat: 0,
      lng: 0,
      page: 0,
      total: 0,
      categoryid: 0,
      isClass: 0,
      viewListUrl: "company/viewlist/"
    };

    const buffer = this.bufferList.getBuffer(preData.key);
    if (buffer && buffer["props"]) {
      const bufferCategoryid = +(buffer["props"]["categoryid"] || 0);
      const categoryid = +this.$route.params.categoryid;
      if (bufferCategoryid !== categoryid) {

      } else {
        preData.page = buffer["props"]["page"] || 1;
        preData.companys = buffer["data"] || [];
        preData.y = buffer["props"]["y"] || 0;
        preData.categoryid = bufferCategoryid;
        preData.name = buffer["props"]["name"] || "";
      }
    }

    return preData;
  },

  mounted() {
    const point = Storage.getPOINT();
    if (point) {
      this.lat = point["lat"];
      this.lng = point["lng"];
    }
    if (this.companys.length === 0) {
      const categoryid = +this.$route.params.categoryid;
      if (categoryid > 0) {
        this.categoryid = categoryid;
      }
      this.getData();
    } else {
      window.scrollTo(0, this.y);
    }
  },

  watch: {
    $route(to, from) {
      const categoryid = +this.$route.params.categoryid;
      if (categoryid != this.categoryid) {
        this.categoryid = categoryid;
      }
      this.page = 1;
      this.getData(() => window.scrollTo(0, 0));
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
    changeClick: function(id) {
      window.location.href = "#/company/" + id;
    },
    addChange: function(categoryid) {
      this.page = 1;
      this.categoryid = categoryid;
      this.$router.replace({ path: "/nearby/" + categoryid });
      //this.getData(()=> window.scrollTo(0,0))
    },

    handleScroll: function() {
      this.bufferList.setProps(this.key, { y: window.scrollY });
    },

    toTop: function() {
      document.getElementById("logo").scrollIntoView();
    },
    loadMore2() {
      document.addEventListener("scroll", this.winScroll(), false);
    },
    loadMore() {
      if (this.page <= this.total) {
        this.getData();
      }
      if (this.page == this.total) {
        this.page = this.page + 1;
      }
    },
    winScroll: function() {
      this.isClass = document.body.scrollTop > 100 ? 1 : 0;
    },
    getData(callback) {
      this.$http
        .post(this.viewListUrl, {
          page: this.page,
          categoryid: this.categoryid,
          lat: this.lat,
          lng: this.lng
        })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              this.page = ret["data"]["page"];
              this.name = ret["data"]["name"];
              if (this.page == 1) {
                this.companys = ret["data"]["company"];
              } else {
                var companys_new = ret["data"]["company"];
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
              this.bufferList.setBuffer(this.key, this.companys, {
                page: this.page,
                categoryid: this.categoryid,
                name: this.name
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
.shop-nav {
  border-top: #efefef 1px solid;
  background: #ffffff;
  overflow: hidden;
  padding: 0.1rem 0;
  padding-top: 0.45rem;
}
.shop-nav li {
  width: 25%;
  padding: 0.1rem 0;
  text-align: center;
  float: left;
  overflow: hidden;
  height: 0.5rem;
}
.shop-nav li i {
  display: inline-block;
  width: 0.26rem;
  height: 0.26rem;
}
.shop-nav li i img {
  width: 100%;
}
i.d1 {
  background: url("~@/assets/images/d1.png") center center no-repeat;
  background-size: contain;
}
i.d2 {
  background: url("~@/assets/images/d2.png") center center no-repeat;
  background-size: contain;
}
i.d3 {
  background: url("~@/assets/images/d3.png") center center no-repeat;
  background-size: contain;
}
i.d4 {
  background: url("~@/assets/images/d4.png") center center no-repeat;
  background-size: contain;
}
i.d5 {
  background: url("~@/assets/images/d5.png") center center no-repeat;
  background-size: contain;
}
i.d6 {
  background: url("~@/assets/images/d6.png") center center no-repeat;
  background-size: contain;
}
i.d7 {
  background: url("~@/assets/images/d7.png") center center no-repeat;
  background-size: contain;
}
i.d8 {
  background: url("~@/assets/images/d8.png") center center no-repeat;
  background-size: contain;
}
.shop-list {
  overflow: hidden;
}
.shop-list li {
  padding: 0.1rem;
  overflow: hidden;
  border-bottom: #efefef 1px solid;
  background: #ffffff;
}
.shop-list li .img {
  width: 45%;
  height: 100px;
  float: left;
}
.shop-list li .img img {
  width: 100%;
  height: 100%;
}
.shop-list li .info {
  margin-left: 47%;
  color: #a7a7a7;
  font-size: 0.14rem;
}
.shop-list li .info .p1 {
  overflow: hidden;
  color: #000000;
  font-size: 0.16rem;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.shop-list li .info .p2 {
  overflow: hidden;
  margin-top: 0.05rem;
  line-height: 0.24rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.shop-list li .info .p2 em {
  float: left;
  display: block;
  margin-left: 0.1rem;
  color: #ff6432;
  line-height: 0.17rem;
}
.shop-list li .info .p3 {
  margin-top: 0.04rem;
  line-height: 0.21rem;
}
.shop-list li .info .p3 span {
  margin-right: 5px;
}
.shop-list li .info .p3 em {
  float: right;
  margin-right: 0.1rem;
}
.near-line {
  overflow: hidden;
  background: #f3f3f3;
  height: 0.05rem;
}
.ad {
  overflow: hidden;
}
.redstar {
  display: block;
  float: left;
  position: relative;
  width: 0.8rem;
  height: 0.15rem;
  overflow: hidden;
  background: url("~@/assets/images/star-gray.png") top left no-repeat;
  background-size: 0.78rem 0.14rem;
}
.redstar span {
  float: left;
  display: block;
  position: absolute;
  overflow: hidden;
  left: 0;
  top: 0;
  width: 100%;
  height: 0.15rem;
}
.redstar img {
  display: block;
  width: 0.78rem;
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
  color: #969696;
  display: inline-block;
  line-height: 0.42rem;
  font-size: 0.16rem;
}
.navTop .tab .current {
  color: #ffffff;
}
#toTop {
  position: fixed;
  bottom: 20%;
  right: 4%;
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 0.38rem;
  text-align: center;
}
#toTop img {
  width: 0.38rem;
  margin-top: 0.08rem;
}
</style>
