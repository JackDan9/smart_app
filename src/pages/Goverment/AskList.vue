<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">互动问答</span>
    </div>
    <div class="QA-list pt45">
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isLoading"
        infinite-scroll-distance="10"
      >
        <template v-for="(ask_data, index) in ask_list">
          <div class="section" :key="index">
            <router-link :to="{ path: ask_data.id ,query:{tab:'hide'} }" append>
              <div class="item">
                <div class="photo">
                  <img
                    v-bind:src="[ask_data['u_picture']?fullUrl(ask_data['u_picture']):defaultPicUrl()]"
                    class="w100"
                  />
                </div>
                <div class="info">
                  <div class="top">
                    <div class="fl">
                      <p class="p1">{{ask_data['username']}}</p>
                      <p class="p2">{{ask_data['addtime']}}</p>
                    </div>
                    <div class="fr">
                      <div class="box">
                        <i v-bind:class="[ask_data['comment_num'] ? 'red' : '']"></i>
                        <p>{{ask_data['comment_num']}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="text">{{ask_data['content']}}</div>
                </div>
              </div>
            </router-link>

            <div class="item" v-if="ask_data['comment']">
              <div class="photo"></div>
              <div class="info">
                <div class="top">
                  <div class="fl">
                    <p class="p1 red">{{ask_data['comment']['username']}}</p>
                    <p class="p2">{{ask_data['comment']['commenttime']}}</p>
                  </div>
                  <div class="fr">
                    <div class="box">
                      <i
                        v-bind:class="[ask_data['comment']['isLike'] ? 'ans1' : 'ans0']"
                        v-on:click="addLike(ask_data['comment']['id'],ask_data['comment']['isLike'])"
                      ></i>
                      <p>{{ask_data['comment']['vote']}}</p>
                    </div>
                  </div>
                </div>
                <div class="text">{{ask_data['comment']['comment']}}</div>
              </div>
            </div>
          </div>
        </template>
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

export default {
  components: {
    Error
  },
  data() {
    return {
      ask_list: [],
      isLoading: false,
      isError: false,
      error: "",
      username: "",
      whoami: "user/whoami/",
      likeUrl: "like/add/",
      viewListUrl: "ask/viewlist/"
    };
  },
  mounted() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
          this.username = ret["nickname"] ? ret["nickname"] : ret["username"];
          this.picture = ret["picture"];
        }
      });
    }
    this.getData();
  },

  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    defaultPicUrl: function() {
      return Config.defaultPic;
    },

    loadMore() {
      this.getData();
    },

    addLike: function(linkid, isLike) {
      if (!this.username) {
        this.$router.push("/login");
        return;
      }
      var updown = isLike == 1 ? 2 : 1;
      for (var i = 0, len = this.ask_list.length; i < len; i++) {
        if (
          this.ask_list[i]["comment"] &&
          this.ask_list[i]["comment"]["id"] == linkid
        ) {
          this.ask_list[i]["comment"]["isLike"] = updown === 1 ? 1 : 0;
          this.ask_list[i]["comment"]["vote"] =
            updown === 1
              ? this.ask_list[i]["comment"]["vote"] * 1 + 1
              : this.ask_list[i]["comment"]["vote"] * 1 - 1;
          break;
        }
      }
      if (i < len) {
        this.getLike(linkid, updown);
      }
    },

    getLike(linkid, updown) {
      this.$http
        .post(this.likeUrl, { linkid: linkid, updown: updown, type: 5 })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              if (updown == 1) {
                Toast("投票成功!");
              } else {
                Toast("投票取消!");
              }
            } else {
              Toast(ret.msg);
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
      this.$http.post(this.viewListUrl, { page: this.page }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.page = ret["data"]["page"];
            if (this.page == 1) {
              this.ask_list = ret["data"]["ask"];
            } else {
              var ask_list_new = ret["data"]["ask"];
              if (ask_list_new && ask_list_new.length) {
                for (var i = 0; i < ask_list_new.length; i++) {
                  this.ask_list.push(ask_list_new[i]);
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
.pt45 {
  padding-top: 0.45rem;
  overflow: hidden;
}
.QA-list {
  background: #f2f2f2;
  overflow: hidden;
  padding-bottom: 0.5rem;
}
.QA-list .section {
  margin-bottom: 0.1rem;
  overflow: hidden;
}
.QA-list .item {
  padding: 0.15rem;
  overflow: hidden;
  border-bottom: #e0e0e0 1px solid;
  background: #ffffff;
}
.QA-list .item .photo {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.5rem;
  float: left;
  overflow: hidden;
}
.QA-list .item .info {
  padding-left: 0.1rem;
  overflow: hidden;
  font-size: 0.14rem;
}
.QA-list .item .info .top {
  overflow: hidden;
  width: 100%;
}
.QA-list .item .info .top .left {
  width: 60%;
  float: left;
  overflow: hidden;
}
.QA-list .item .info .top .box {
  width: 0.35rem;
  height: 0.35rem;
  overflow: hidden;
  border-radius: 0.35rem;
  border: #e0e0e0 1px solid;
  text-align: center;
}
.QA-list .item .info .top .box i {
  width: 0.15rem;
  height: 0.15rem;
  display: inline-block;
  margin-top: 0.03rem;
  background: url("~@/assets/images/r0.png") center center no-repeat;
  background-size: contain;
}
.QA-list .item .info .top .box .red {
  background: url("~@/assets/images/r1.png") center center no-repeat;
  background-size: contain;
}
.QA-list .item .info .top .box p {
  overflow: hidden;
  padding-bottom: 0.05rem;
  font-size: 0.12rem;
  line-height: 0.12rem;
  color: #a5a5a5;
  margin-top: -0.02rem;
}
.QA-list .item .info .top .p1 {
  font-size: 0.14rem;
}
.QA-list .item .info .top .p2 {
  font-size: 0.12rem;
  color: #a5a5a5;
  margin-top: 0.03rem;
}
.QA-list .item .info .text {
  width: 100%;
  overflow: hidden;
  margin-top: 0.03rem;
  font-size: 0.16rem;
}
.QA-list .item .red {
  color: red;
}
.QA-list .item .info .top .box .ans1 {
  background: url("~@/assets/images/an1.png") center center no-repeat;
  background-size: contain;
}
.QA-list .item .info .top .box .ans0 {
  background: url("~@/assets/images/an0.png") center center no-repeat;
  background-size: contain;
}
.fixed-bot .comm {
  padding: 0.1rem;
}
.fixed-bot .comm input {
  width: 95%;
  padding-left: 5%;
  height: 0.3rem;
  border: none;
  background: #f9f9f9;
}
.fixed-bot {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0.5rem;
  overflow: hidden;
  border-top: #dddddd 1px solid;
  background: #ffffff;
}
.fixed-bot .comm {
  padding: 0.1rem;
}
.fixed-bot .comm input {
  width: 95%;
  padding-left: 5%;
  height: 0.3rem;
  border: none;
  background: #f9f9f9;
}
</style>
