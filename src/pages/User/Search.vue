<template>
  <div>
    <div class="page-topnav" style="height:0.7rem">
      <div class="navTop">
        <div class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</div>
        <div class="tab">
          <a class="current">发现</a>
        </div>
        <router-link :to="{path:'/user/'}">
          <i class="iconfont ico user">&#xe618;</i>
        </router-link>
      </div>
    </div>
    <div class="search-page">
      <div class="search" style="top:0.6rem">
        <input
          type="text"
          placeholder="你有一双发现美的眼睛"
          v-on:keyup.enter="addSearch()"
          ref="name"
          value
          id="name" />
        <div class="subico" v-on:click="addSearch()"></div>
      </div>
      <div class="sea-size"></div>
      <div class="hist">
        <div class="t">
          <div class="name">大家找过</div>
        </div>
        <div class="list">
          <ul>
            <template v-for="(hot, index) in hot_search">
              <li :key="index">
                <router-link :to="{ path: '/'+hot.url}">
                  <div class="txt">{{hot['name']}}</div>
                </router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div class="search-line"></div>
      <div class="lately">
        <div class="t">
          <div class="name">最近找过</div>
        </div>
        <div class="con">
          <ul>
            <template v-for="(search, index) in searchs">
              <li :key="index">
                <router-link :to="{ path: search.url}">{{search['name']}}</router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config";
import Store from "@/store/store";
import { Toast } from "mint-ui";

export default {
  components: {
    Error
  },
  data() {
    return {
      hot_search: [],
      searchs: [],
      isLoading: false,
      isError: false,
      error: "",
      viewUrl: "search/viewlist/",
      viewSearchUrl: "search/view/"
    };
  },

  mounted() {
    const type = +this.$route.params.type;
    this.getData();
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    addSearch: function() {
      var name = this.$refs.name.value;
      this.getSearch(name);
    },

    defaultPicUrl: function() {
      return Config.defaultPic;
    },

    getSearch(name) {
      this.$http
        .post(this.viewSearchUrl, { name: name, type: this.$route.params.type })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              this.search = ret["data"];
              this.$router.push(this.search["url"]);
            } else {
              Toast("没有找到需要的数据");
              this.error = (ret && ret.msg) || "";
              this.isError = true;
            }
          },
          response => {
            this.isError = true;
            this.error = "";
          }
        );
    },

    getData(callback) {
      this.$http.get(this.viewUrl).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.hot_search = ret["data"]["hot"];
            this.searchs = ret["data"]["search"];
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
.search-page {
  width: 100%;
  overflow-y: auto;
  background: #ffffff;
  color: #141414;
  font-size: 0.14rem;
}
.search-page .search input {
  text-indent: 0.1rem;
  width: 100%;
  height: 0.35rem;
  border-radius: 5px;
  border: #efefef 1px solid;
  background: #f9f9f9;
  background: #f9f9f9;
  background-size: 0.2rem 0.2rem;
}
.search-page .subico {
  position: absolute;
  right: 0.25rem;
  top: 0.17rem;
  width: 0.2rem;
  height: 0.2rem;
  background: url("~@/assets/images/ss3.png") center center no-repeat;
  background-size: contain;
}
.search-page .search {
  position: fixed;
  left: 0;
  top: 0.45rem;
  width: 90%;
  background: #ffffff;
  overflow: hidden;
  padding: 0.1rem 5%;
  height: 0.4rem;
}
.search-page .search-line {
  width: 100%;
  background: #f5f5f5;
  height: 0.1rem;
}
.search-page .hist {
  overflow: hidden;
}
.search-page .hist .t {
  width: 100%;
  height: 0.4rem;
  border-bottom: #e0e0e0 1px solid;
}
.search-page .hist .t .name {
  width: 80%;
  height: 0.4rem;
  padding-left: 0.25rem;
  margin-left: 0.15rem;
  line-height: 0.4rem;
  background: url("~@/assets/images/ss4.png") left center no-repeat;
  background-size: 0.18rem 0.17rem;
}
.search-page .hist .list {
  width: 100%;
}
.search-page .hist .list ul {
  width: 95%;
  margin: auto;
  overflow: hidden;
  border-bottom: #e0e0e0 1px solid;
}
.search-page .hist .list ul:last-child {
  border: none;
}
.search-page .hist .list li {
  width: 33%;
  float: left;
  height: 0.4rem;
  text-align: center;
}
.search-page .hist .list li .txt {
  width: 98%;
  height: 0.3rem;
  margin-top: 0.05rem;
  line-height: 0.3rem;
  border-right: #e0e0e0 1px dashed;
}
.search-page .hist .list li:last-child .txt {
  border: none;
}
.search-page .lately {
  overflow: hidden;
}
.search-page .lately .t {
  width: 100%;
  height: 0.4rem;
  border-bottom: #e0e0e0 1px solid;
}
.search-page .lately .t .name {
  width: 80%;
  height: 0.4rem;
  padding-left: 0.25rem;
  margin-left: 0.15rem;
  line-height: 0.4rem;
  background: url("~@/assets/images/lately.png") left center no-repeat;
  background-size: 0.16rem 0.15rem;
}
.search-page .lately .con li {
  padding: 0.1rem 0.18rem 0.1rem 0.4rem;
  overflow: hidden;
  border-bottom: #e0e0e0 1px solid;
}
.sea-size {
  width: 100%;
  height: 0.4rem;
  overflow: hidden;
}
.navTop .user {
  overflow: hidden;
  float: right;
  color: #fff;
  margin-right: 0.1rem;
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
</style>
