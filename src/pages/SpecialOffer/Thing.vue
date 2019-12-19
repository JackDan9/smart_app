<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" v-on:click="$router.go(-1)">&#xe609;</i>
      <i class="iconfont share" v-on:click="shareLink(thing.name,fullUrl(thing.picture))">&#xe60f;</i>
    </div>
    <div class="page-fun-detail">
      <div class="banner">
        <img v-if="thing['picture']" :src="fullUrl(thing['picture'])+'!640.398'" class="w100" alt />
      </div>
      <div class="info" v-infinite-scroll="loadMore">
        <p class="p1">{{thing['name']}}</p>
        <p class="p2">
          <span>#{{thing['type']}}</span>
        </p>
        <p class="p3" v-if="thing['price']">
          ￥
          <em>{{thing['price']}}</em>/人
        </p>
        <p class="p4">{{thing['opentime']}}</p>
        <div class="bot tel">
          <a type="tel" v-on:click="phoneClick(thing.mobile)">
            {{thing['companyName']}} : {{thing['mobile']}}
            <i class="iconfont tel-ico">&#xe625;</i>
          </a>
        </div>
        <div v-bind:class="[(thing.lat && thing.lng) ? 'bot addr' : 'addr']">
          <span>{{thing['address']}}</span>
          <i v-bind:class="[(thing.lat && thing.lng) ? 'iconfont map-ico' : 'dn']">&#xe619;</i>
        </div>
      </div>
      <div class="gray-line"></div>
      <div class="art-con">
        <div class="title">{{thing['companyName']}}</div>
        <div class="con">
          <template v-for="(thing_data, index) in thing['pics']">
            <p v-if="thing_data['content']" :key="index">
              {{thing_data['content']}}
            </p>
            <p :key="index">
              <img v-if="thing_data['pic']" :src="fullUrl(thing_data['pic'])+'!640.398'" alt="" />
            </p>
          </template>
        </div>
      </div>
      <div class="fixed-go">
        <div class="fl">
          <div
            v-bind:class="[thing['isLike'] ? 'iconfont d2' : 'iconfont ico']"
            v-on:click="addLike(thing['id'],thing['isLike'])"
            v-bind:id="thing['id']"
          >&#xe614;</div>
          <div class="num">{{thing['vote']}}</div>
        </div>
        <router-link :to="{ path: '/company/'+thing['companyid'] }">
          <div class="fr">
            <i class="iconfont wantIcon">&#xe863;</i>
            <span class="wantCon">想买</span>
          </div>
        </router-link>
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
import WxShare from "@/utils/wx/wx";
export default {
  components: {
    Error
  },
  data() {
    return {
      thing: [],
      isLoading: false,
      isError: false,
      error: "",
      username: "",
      wxShareUrl: "share/",
      viewUrl: "thing/view/",
      likeUrl: "like/add/"
    };
  },
  mounted() {
    const id = +this.$route.params.id;
    Store.setIntoPage(2);
    if (!id) {
      this.isError = true;
      this.error = "参数错误";
    } else {
      this.isLoading = true;
      if (Store.getAuthUid()) {
        this.username = Store.getUserName();
      }
      this.getData();
      this.getWx();
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

    loadMore() {
      document.addEventListener("scroll", this.winScroll(), false);
    },
    getWx: function() {
      this.$http
        .post(this.wxShareUrl, {
          url: window.location.href,
          id: this.$route.params.id,
          type: 5
        })
        .then(response => {
          const ret = JSON.parse(response.data);
          if (ret && ret.code == 0) {
            WxShare.wxinit(ret["data"]);
          } else {
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
        });
    },
    winScroll: function() {
      var scrollTop =
        document.body.scrollTop > 100 ? 100 : document.body.scrollTop;
      document.getElementsByClassName("navTop")[0].style.background =
        "rgba(0,0,0," + scrollTop / 100 + ")";
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

    phoneClick: function(mobile) {
      var share = {
        action: "call",
        phoneNum: mobile
      };
      if (window.postMessage) window.postMessage(JSON.stringify(share), "*");
      return true;
    },

    addLike: function(linkid, isLike) {
      if (!this.username) {
        this.$router.push("/login");
        return;
      }
      var updown = isLike == 1 ? 2 : 1;
      if (this.thing["id"] == linkid) {
        this.thing["isLike"] = updown === 1 ? 1 : 0;
        this.thing["vote"] =
          updown === 1
            ? this.thing["vote"] * 1 + 1
            : this.thing["vote"] * 1 - 1;
      }
      this.getLike(linkid, updown);
    },

    getData(callback) {
      this.$http.post(this.viewUrl, { id: this.$route.params.id }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.thing = ret["data"];
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
    getLike(linkid, updown) {
      this.$http
        .post(this.likeUrl, { linkid: linkid, updown: updown, type: 3 })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
            } else {
              this.error = (ret && ret.msg) || "";
              this.isError = true;
            }
          },
          response => {
            this.isError = true;
            this.error = "";
          }
        );
    }
  }
};
</script>
<style scoped>
.page-fun-detail .info {
  background: #ffffff;
  width: 90%;
  margin: auto;
  padding-bottom: 0.1rem;
  text-align: center;
  margin-top: 0.1rem;
  font-size: 0.14rem;
}
.page-fun-detail .info p {
  padding-bottom: 0.1rem;
}
.page-fun-detail .info .p1 {
  font-size: 0.16rem;
}
.page-fun-detail .info .p2 {
  font-size: 0.12rem;
  color: #b8b8b8;
}
.page-fun-detail .info .p2 span {
  display: inline-block;
  padding: 0 0.1rem;
}
.page-fun-detail .info .p3 em {
  font-size: 0.18rem;
}
.page-fun-detail .info .p4 {
  font-size: 0.12rem;
  color: #9c9c9c;
  border-bottom: #e0e0e0 1px solid;
}
.page-fun-detail .info .bot {
  text-align: left;
  color: #9c9c9c;
  padding: 0.03rem 0;
  overflow: hidden;
  line-height: 0.3rem;
}
.page-fun-detail .info .tel {
  margin-top: 0.1rem;
}
.page-fun-detail .info a {
  color: #9c9c9c;
}
.page-fun-detail .info .addr {
  text-align: left;
}
.page-fun-detail .info .addr span {
  display: inline-block;
  width: 80%;
  color: #9c9c9c;
}
.page-fun-detail .info .bot i {
  float: right;
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 0.25rem;
  border: #eee 1px solid;
}
.page-fun-detail .info .bot .tel-ico {
  font-size: 0.16rem;
  color: #c0c0c0;
  text-align: center;
}
.page-fun-detail .info .bot .map-ico {
  font-size: 0.16rem;
  color: #c0c0c0;
  text-align: center;
}
.gray-line {
  width: 100%;
  height: 0.2rem;
  overflow: hidden;
  background: #f7f7f7;
}
.page-fun-detail .art-con {
  padding: 0.1rem;
  overflow: hidden;
  padding-bottom: 0.5rem;
}
.page-fun-detail .art-con .title {
  text-align: center;
  font-size: 0.22rem;
  color: #000000;
}
.page-fun-detail .art-con .con p {
  overflow: hidden;
  margin-top: 0.16rem;
  line-height: 0.22rem;
  font-size: 0.15rem;
  letter-spacing: 0.005rem;
  color: #626262;
}
.page-fun-detail .art-con .con p img {
  max-width: 100%;
}
.fixed-go {
  position: fixed;
  width: 100%;
  height: 0.45rem;
  left: 0;
  bottom: 0;
  z-index: 12345;
  overflow: hidden;
  background: #ffffff;
}
.fixed-go .fl {
  width: 35%;
  overflow: hidden;
  text-align: center;
  color: #787878;
}
.fixed-go .fl .ico {
  font-size: 0.2rem;
  margin-top: 0.08rem;
  color: #c0c0c0;
}
.fixed-go .fl .d2 {
  font-size: 0.2rem;
  margin-top: 0.08rem;
  color: #ff4b0f;
}
.fixed-go .fr {
  background: #ff6432;
  width: 65%;
  height: 0.45rem;
  line-height: 0.45rem;
  text-align: center;
}
.fixed-go .fr .wantIcon {
  display: inline-block;
  overflow: hidden;
  float: left;
  width: 47%;
  color: #ffffff;
  font-size: 0.2rem;
  text-align: right;
}
.fixed-go .fr .wantCon {
  display: inline-block;
  width: 46%;
  color: #ffffff;
  font-size: 0.16rem;
  text-align: left;
}
</style>
