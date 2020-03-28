<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">热闻</span>
    </div>
    <div class="newlist-page">
      <div class="nav">
        <div class="box">
          <span>地区</span>
          <span class="ico ch1"></span>
          <div class="list">
            <div class="sele" v-on:click="hitCategory">{{dynamic_name}}</div>
            <div class="more" v-bind:class="[hr ? '' : 'dn']">
              <ul>
                <template v-for="(type_data, index) in dynamic_types">
                  <li @click="category(index)" :key="index">{{type_data}}</li>
                </template>
              </ul>
            </div>
          </div>
        </div>
        <div class="box">
          <span>时间</span>
          <span class="ico ch2"></span>
          <div class="list">
            <div class="sele" v-on:click="sortCategory">{{sort_name}}</div>
            <div class="more" v-bind:class="[hr2 ? '' : 'dn']">
              <ul>
                <template v-for="(sort_data, index2) in sort_types">
                  <li @click="category2(index2)" :key="index2">{{sort_data}}</li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div
        class="nlist"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isLoading"
        infinite-scroll-distance="10"
      >
        <ul>
          <template v-for="(new_data, index) in news">
            <li v-on:click="addChange(new_data.id)" :key="index">
              <div class="top">
                <div class="tag">
                  <span>{{new_data['type']}}</span>
                </div>
              </div>
              <div class="con">
                <div class="item">
                  <div class="tit">{{new_data['title']}}</div>
                  <div class="brief">{{new_data['description']}}…</div>
                  <div class="stat">
                    <div class="ico pv fl">{{new_data['hits']}}</div>
                    <div class="ico mess fr">{{new_data['num']}}</div>
                  </div>
                </div>
                <div class="item">
                  <img v-if="new_data['picture']" :src="fullUrl(new_data['picture'])+'!640.398'" />
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config";
import storage from "@/storage/storage";
import { Toast } from "mint-ui";

export default {
  components: {
    Error
  },
  data() {
    return {
      news: [],
      page: 0,
      total: 0,
      type: 0,
      sort: 0,
      hr: 0,
      hr2: 0,
      isError: false,
      error: "",
      dynamic_types: [],
      sort_types: [],
      dynamic_name: "全部",
      sort_name: "全部",
      viewUrl: "dynamic/view/"
    };
  },
  mounted() {
    // this.getData()
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

    addChange: function(id) {
      this.id = id;
      window.location.href = "#/new/" + this.id;
    },

    hitCategory() {
      this.hr = !this.hr;
    },
    sortCategory() {
      this.hr2 = !this.hr2;
    },
    category: function(index) {
      this.page = this.total = 0;
      this.type = index;
      this.dynamic_name = this.dynamic_types[index];
      this.hr = false;
      this.news = [];
      this.getData(() => window.scrollTo(0, 0));
    },
    category2: function(index2) {
      this.page = this.total = 0;
      this.sort = index2;
      this.sort_name = this.sort_types[index2];
      this.hr2 = false;
      this.news = [];
      this.getData(() => window.scrollTo(0, 0));
    },
    defaultPicUrl: function() {
      return Config.defaultPic;
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

    loadMore() {
      if (this.page <= this.total) {
        this.getData();
      }
      if (this.page == this.total) {
        this.page = this.page + 1;
      }
    },

    getData(callback) {
      this.$http
        .post(this.viewUrl, {
          type: this.type,
          sort: this.sort,
          page: this.page
        })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              this.dynamic_types = ret["data"]["dynamic_type"];
              this.sort_types = ret["data"]["sort_type"];
              if (this.page == 1) {
                this.news = ret["data"]["news"];
              } else {
                var news_new = ret["data"]["news"];
                if (news_new && news_new.length) {
                  for (var i = 0; i < news_new.length; i++) {
                    this.news.push(news_new[i]);
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
.newlist-page {
  padding-top: 0.45rem;
  background: #ffffff;
  min-height: 100vh;
}
.newlist-page .nav {
  height: 0.6rem;
  width: 100%;
  border-bottom: #e7e7e7 1px solid;
}
.newlist-page .nav .box {
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  width: 50%;
  float: left;
  text-align: center;
}
.newlist-page .nav .box span {
  vertical-align: middle;
}
.newlist-page .nav .box .ico {
  width: 0.12rem;
  height: 0.18rem;
  display: inline-block;
}
.newlist-page .nav .box .ch1 {
  background: url("~@/assets/images/ch1.png") center center no-repeat;
  background-size: 0.09rem 0.12rem;
}
.newlist-page .nav .box .ch2 {
  background: url("~@/assets/images/ch2.png") center center no-repeat;
  background-size: 0.12rem 0.12rem;
}
.newlist-page .nav .box .list {
  display: inline-block;
  vertical-align: middle;
  position: relative;
}
.newlist-page .nav .box .list .sele {
  padding: 0 0.1rem;
  overflow: hidden;
  background: #f0f0f0;
}
.newlist-page .nav .box .list .more {
  padding: 0 0.1rem;
  overflow: hidden;
  z-index: 123;
  position: absolute;
  left: 0;
  top: 0.16rem;
  background: #f0f0f0;
}
.newlist-page .nav .box .list .more li {
  line-height: 0.24rem;
}

.nlist {
  overflow: hidden;
}
.nlist li {
  padding: 0.2rem 0.15rem;
  overflow: hidden;
  border-bottom: #e7e7e7 1px solid;
}
.nlist li .top {
  overflow: hidden;
  padding-bottom: 0.1rem;
}
.nlist li .top .tag {
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  border: #212121 1px solid;
  padding: 0 0.06rem;
  float: left;
}
.nlist li .top .tag span {
  display: block;
  padding-left: 0.05rem;
  border-left: #212121 1px solid;
}
.nlist li .con {
  overflow: hidden;
  display: -webkit-flex;
}
.nlist li .con .item {
  box-flex: 1;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
}
.nlist li .con .item img {
  width: 90%;
  float: right;
  display: block;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  overflow: hidden;
}
.nlist li .con .item .tit {
  font-size: 0.16rem;
}
.nlist li .con .item .brief {
  color: #6b6b6b;
  margin-top: 0.1rem;
}
.nlist li .con .item .stat {
  margin-top: 0.1rem;
}
.nlist li .con .item .stat .ico {
  padding-left: 0.15rem;
}
.nlist li .con .item .stat .pv {
  background: url("~@/assets/images/ee.png") left center no-repeat;
  background-size: 0.13rem 0.09rem;
}
.nlist li .con .item .stat .mess {
  background: url("~@/assets/images/mme.png") left center no-repeat;
  background-size: 0.12rem 0.1rem;
}
</style>
