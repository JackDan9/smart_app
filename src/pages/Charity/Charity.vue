<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" v-on:click="$router.go(-1)">&#xe609;</i>
      <span class="navCon">我要投票</span>
      <i
        class="iconfont share"
        v-on:click="shareLink(charity.name,fullUrl(charity.picture))"
      >&#xe60f;</i>
    </div>
    <div class="page-main">
      <div class="banner">
        <img v-if="charity['picture']" :src="fullUrl(charity['picture'])+'!640.398'" class="w100" />
        <p>{{charity['name']}}</p>
      </div>
      <div class="vote-nums">
        <div class="item">
          <p>{{charity['has_money']}}</p>
          <span>已筹(元)</span>
        </div>
        <div class="item">
          <p>{{charity['love']}}</p>
          <span>爱心(份)</span>
        </div>
      </div>
      <div class="pro-tab">
        <div class="tab-t">
          <ul>
            <li v-bind:class="[charity['isClass'] ? 'current' : '']" v-on:click="addChange('con1')">
              <span>项目详情</span>
            </li>
            <li v-bind:class="[charity['isClass'] ? '' : 'current']" v-on:click="addChange('con2')">
              <span>爱心留言（{{comment_num}}）</span>
            </li>
          </ul>
        </div>
        <div class="tab-con">
          <div v-bind:class="[charity['isClass'] ? 'con con1' : 'con con1 dn']">
            <div class="item">
              <div class="t">
                <span>项目简介</span>
              </div>
              <div class="text">{{charity['prief']}}</div>
            </div>
            <div class="item">
              <div class="t">
                <span>最新善款去向</span>
              </div>
              <div class="text">
                <template v-for="(charity_data, index) in charity['pics']">
                  <p v-if="charity_data['content']" :key="index">
                    {{charity_data['content']}}
                  </p>
                  <p :key="index">
                    <img
                      v-if="charity_data['pic']"
                      :src="fullUrl(charity_data['pic'])+'!640.398'"
                      alt
                    />
                  </p>
                </template>
              </div>
            </div>
          </div>
          <div v-bind:class="[charity['isClass'] ? 'con con2 dn' : 'con con2']">
            <ul>
              <template v-for="(comment_data, index) in comment_list">
                <li :key="index">
                  <div class="img">
                    <img
                      v-bind:src="[comment_data['u_picture']?fullUrl(comment_data['u_picture'])+'!70.70':defaultPicUrl()]"
                      width="70"
                      height="70"
                    />
                  </div>
                  <div class="intro">
                    <div class="p1">
                      <span class="time fr">{{comment_data['commenttime']}}</span>
                      <em>{{comment_data['username']}}</em>
                    </div>
                    <div class="p2">{{comment_data['comment']}}</div>
                  </div>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-bot">
      <div
        v-bind:class="[charity['isClass'] ? 'item' : 'item dn',charity['isLike'] ? 'suc-vote-btn' : 'vote-btn']"
        v-on:click="addLike(charity['id'],charity['isLike'])"
        v-bind:id="charity['id']"
      >
        <span>{{charity['btnHtml']}}</span>
      </div>
      <div v-bind:class="[charity['isClass'] ? 'item comm dn' : 'item comm']">
        <input
          type="text"
          placeholder="我想说..."
          v-on:keyup.enter="addComment(charity['id'])"
          ref="comment"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast } from "mint-ui";
  import WxShare from "@/utils/wx/wx.js";

  import Loading from "@/components/Loading";
  import Error from "@/components/Error";
  import Tab from "@/components/Tab";
  import Config from "@/config/config";
  import Storage from "@/storage/storage";

  export default {
    components: {
      Error
    },
    data() {
      return {
        charity: [],
        comment_list: [],
        isLoading: false,
        isError: false,
        error: "",
        viewUrl: "charity/view/",
        likeUrl: "like/add/",
        whoami: "user/whoami/",
        wxShareUrl: "share/",
        username: "",
        picture: "",
        comment_num: 0,
        commentUrl: "comment/add/"
      };
    },

    mounted() {
      if (Storage.getAuthUid()) {
        this.$http.get(this.whoami, {}).then(response => {
          const ret = JSON.parse(response.data);
          if (ret && ret["code"] === 0) {
            this.username = ret["nickname"] ? ret["nickname"] : ret["username"];
            this.picture = ret["picture"];
          }
        });
      }
      const id = +this.$route.params.id;
      if (!id) {
        this.isError = true;
        this.error = "参数错误";
      } else {
        this.isLoading = true;
        this.getData();
      }
      this.getWx();
    },
    methods: {
      fullUrl: function(url) {
        return Config.baseUrl + url;
      },

      getWx: function() {
        this.$http
          .post(this.wxShareUrl, {
            url: window.location.href,
            id: this.$route.params.id,
            type: 2
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
        if (isLike == 1) {
          Toast("您已投票!");
        } else {
          var updown = isLike == 1 ? 2 : 1;
          if (this.charity["id"] == linkid) {
            this.charity["isLike"] = updown === 1 ? 1 : 0;
            this.charity["btnHtml"] = updown === 1 ? "投票成功" : "我要投票";
            this.charity["vote"] =
              updown === 1
                ? this.charity["vote"] * 1 + 1
                : this.charity["vote"] * 1 - 1;
          }
          this.getLike(linkid, updown);
        }
      },

      addChange: function(con) {
        var isClass = con == "con1" ? 1 : 0;
        this.charity["isClass"] = isClass;
      },

      addComment: function(linkid) {
        if (!this.username) {
          this.$router.push("/login");
          return;
        }
        var comment = this.$refs.comment.value;
        this.getComment(linkid, comment);
      },

      getData(callback) {
        this.$http.post(this.viewUrl, { id: this.$route.params.id }).then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              this.charity = ret["data"];
              this.comment_list = ret["data"]["comment_list"];
              this.comment_num = ret["data"]["comment_num"];
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
          .post(this.likeUrl, { linkid: linkid, updown: updown, type: 1 })
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

      getComment(linkid, comment) {
        this.$http
          .post(this.commentUrl, { linkid: linkid, comment: comment, type: 1 })
          .then(
            response => {
              const ret = JSON.parse(response.data || "[]");
              if (ret && ret.code === 0) {
                Toast("评论成功!");
                var comment_data = {};
                comment_data["username"] = this.username;
                comment_data["u_picture"] = this.picture;
                comment_data["comment"] = comment;
                comment_data["commenttime"] = "刚刚";
                this.comment_list.unshift(comment_data);
                this.comment_num = this.comment_num + 1;
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
      }
    }
  };
</script>

<style scoped>
page-main {
  padding-top: 0.45rem;
}
.banner {
  overflow: hidden;
  position: relative;
  padding-top: 0.45rem;
}
.banner p {
  position: absolute;
  width: 95%;
  padding-left: 5%;
  height: 0.3rem;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  font-size: 0.14rem;
  line-height: 0.3rem;
}
.vote-nums {
  padding: 0.1rem 0;
  overflow: hidden;
  border-bottom: #e5e5e5 1px solid;
  background: #fff;
}
.vote-nums .item {
  width: 50%;
  overflow: hidden;
  float: left;
  text-align: center;
  font-size: 0.13rem;
  color: #9d9d9d;
}
.vote-nums .item p {
  font-size: 0.18rem;
  color: #ff8208;
}
.pro-tab {
  overflow: hidden;
  margin-top: 0.1rem;
  padding-bottom: 0.5rem;
}
.pro-tab .tab-t {
  overflow: hidden;
  background: #fff;
}
.pro-tab .tab-t li {
  width: 50%;
  height: 50px;
  line-height: 48px;
  float: left;
  text-align: center;
  position: relative;
  border-bottom: #e5e5e5 1px solid;
  font-size: 16px;
  color: #333333;
}
.pro-tab .tab-t li span {
  display: inline-block;
  height: 48px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.pro-tab .tab-t li.current span {
  border-bottom: #ff8208 2px solid;
  color: #ff8208;
}
.pro-tab .tab-con .con1 {
  padding: 0.1rem;
  overflow: hidden;
}
.pro-tab .tab-con .con1 .item {
  padding-bottom: 0.2rem;
  overflow: hidden;
}
.pro-tab .tab-con .con1 .item img {
  width: 100%;
}
.pro-tab .tab-con .con1 .item .t {
  height: 0.26rem;
  line-height: 0.26rem;
  font-size: 0.16rem;
  border-left: #ff8208 5px solid;
  padding-left: 0.1rem;
}
.pro-tab .tab-con .con1 .item .text {
  color: #999999;
  padding: 0.1rem 0;
  font-size: 0.14rem;
  line-height: 0.26rem;
}
.pro-tab .tab-con .con2 li {
  padding: 0.15rem;
  overflow: hidden;
  border-bottom: #e5e5e5 1px solid;
}
.pro-tab .tab-con .con2 li .img {
  width: 60px;
  height: 60px;
  border-radius: 60px;
  overflow: hidden;
  float: left;
}
.pro-tab .tab-con .con2 li .intro {
  margin-left: 70px;
  font-size: 0.15rem;
  padding-top: 0.07rem;
}
.pro-tab .tab-con .con2 li .intro .time {
  color: #999999;
}
.pro-tab .tab-con .con2 li .intro .p2 {
  margin-top: 0.05rem;
  color: #999999;
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
.fixed-bot .suc-vote-btn {
  width: 90%;
  background: #2d2d2d;
  overflow: hidden;
  height: 0.3rem;
  margin: auto;
  margin-top: 0.1rem;
  line-height: 0.3rem;
  border-radius: 7px;
  text-align: center;
}
.fixed-bot .suc-vote-btn span {
  padding-left: 0.3rem;
  display: inline-block;
  background: url("~@/assets/images/vote-btn.png") left center no-repeat;
  background-size: 0.26rem 0.2rem;
  color: #ffffff;
  font-size: 0.16rem;
}
.fixed-bot .vote-btn {
  width: 90%;
  background: #ff6143;
  overflow: hidden;
  height: 0.3rem;
  margin: auto;
  margin-top: 0.1rem;
  line-height: 0.3rem;
  border-radius: 7px;
  text-align: center;
}
.fixed-bot .vote-btn span {
  padding-left: 0.3rem;
  display: inline-block;
  background: url("~@/assets/images/vote-btn.png") left center no-repeat;
  background-size: 0.26rem 0.2rem;
  color: #ffffff;
  font-size: 0.16rem;
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
