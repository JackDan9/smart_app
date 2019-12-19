<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" v-on:click="goBack()">&#xe609;</i>
      <span class="navCon">商品评价</span>
    </div>
    <div class="commentDetailPage">
      <div class="likedMost" id="likedMost" v-infinite-scroll="likeMostScroll">
        <span class="likedMostTitle">权威评价（点赞最多）</span>
        <div class="commentMost">
          <li class="index">
            <div class="personInfo">
              <div class="left">
                <i class="iconMale"></i>
                <div class="img">
                  <img
                    v-bind:src="[this.mostPicture ? fullUrl(this.mostPicture) : defaultPicUrl() ]"
                    alt="智慧信阳"
                    class="personIconImg"
                  />
                </div>
                <span class="username">{{this.mostUsername}}</span>
              </div>
              <div class="right">
                <span class="commentTime">{{this.mostAddtime}}</span>
              </div>
            </div>
            <div class="commentInfo">
              <span>{{this.mostContent}}</span>
            </div>
            <div class="likedInfo">
              <i
                v-bind:class="[mostIsLike ? 'iconfont likedIcon' : 'iconfont noLikedIcon']"
                v-on:click="addLike(mostId, mostIsLike, 'star')"
              >&#xe614;</i>
              <span class="likedNum">{{this.mostVote}}</span>
            </div>
          </li>
        </div>
      </div>
      <div class="commentList">
        <li class="index" v-for="(item, index) in comments" :key="index">
          <div class="personInfo">
            <div class="left">
              <i class="iconMale"></i>
              <div class="img">
                <img
                  v-bind:src="[item.picture ? fullUrl(item.picture) : defaultPicUrl()]"
                  alt="智慧信阳"
                  class="personIconImg"
                />
              </div>
              <span class="username">{{item.username}}</span>
            </div>
            <div class="right">
              <span class="commentTime">{{item.addtime}}</span>
            </div>
          </div>
          <div class="commentInfo">
            <span>{{item.content}}</span>
          </div>
          <div class="likedInfo">
            <i
              v-bind:class="[item.isLike ? 'iconfont likedIcon' : 'iconfont noLikedIcon']"
              v-on:click="addLike(item.id, item.isLike, 'star')"
            >&#xe614;</i>
            <span class="likedNum">{{item.vote}}</span>
          </div>
        </li>
      </div>
      <div class="commentFooter">
        <div class="left">
          <a
            href="javascript:;"
            onclick="easemobim.bind({configId: '2434a302-9b3f-41de-b69d-8c8ed718e1a5'})">
            <i class="serviceIcon"></i>
            <span class="serviceCon">联系客服</span>
          </a>
        </div>
        <div
          v-bind:class="[(this.type == 2 && isContent) ? 'right' : 'rightOther']"
          v-on:click="offerOrder()">
          <span class="moneyIcon">￥</span>
          <span class="moneyNum">{{product.ms_price}}</span>
          <span class="moneyCon">{{content}}</span>
        </div>
      </div>
      <div v-bind:class="[isActive ? 'finish' : 'finishOther']">
        <i class="iconfont finishIcon">&#xe620;</i>
        <span class="finishCon" v-html="contentWarn"></span>
      </div>
    </div>
    <div id="toTop" v-on:click="toTop" v-bind:class="[ isClassTop > 0  ? '' : 'dn']">
      <img src="~@/assets/images/toTop.png" />
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Store from "@/store/store";
import Config from "@/config/config";
import { Toast } from "mint-ui";
export default {
  components: {
    Error
  },
  data() {
    return {
      comments: [],
      isError: false,
      error: "",
      mostId: "",
      mostIsLike: "",
      mostUsername: "",
      mostPicture: "",
      mostContent: "",
      mostAddtime: "",
      mostVote: "",
      product: "",
      starttime: "",
      type: 0,
      content: "",
      isActive: false,
      isClassTop: 0,
      isContent: false,
      whoami: "user/whoami/",
      likeUrl: "like/add/",
      viewListUrl: "comment/starlist/",
      viewUrl: "discount/view/"
    };
  },
  mounted() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret.code === 0) {
          this.username = ret["nickname"] ? ret["nickname"] : ret["username"];
        }
      });
    }
    const id = +this.$route.params.id;
    if (!id) {
      this.isError = true;
      this.error = "参数错误";
    } else {
      this.isLoading = true;
      this.getData(() => window.scrollTop(0, 0));
      this.getDiscountData();
    }
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },
    defaultPicUrl: function() {
      return Config.defaultPic;
    },
    goBack: function() {
      this.$router.replace("/productdetail/" + this.$route.params.id);
    },
    addLike: function(linkid, isLike, type) {
      var updown = isLike == 1 ? 2 : 1;
      for (var i = 0, len = this.comments.length; i < len; i++) {
        if (this.comments[i]["id"] == linkid) {
          this.comments[i]["isLike"] = updown === 1 ? 1 : 0;
          this.comments[i]["vote"] =
            updown === 1
              ? this.comments[i]["vote"] * 1 + 1
              : this.comments[i]["vote"] * 1 - 1;
          break;
        }
      }
      if (i < len) {
        this.getLike(linkid, updown, 10);
        this.getData();
      }
    },
    getLike(linkid, updown, type) {
      this.$http
        .post(this.likeUrl, { linkid: linkid, updown: updown, type: type })
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
    },
    offerOrder: function() {
      if (this.type == 0 || this.type == 1) {
        this.isActive = true;
        this.contentWarn = "很抱歉，本组商品已经结束<br/> 请留意开场时间，准时抢购";
        setTimeout(() => {
          this.isActive = false;
        }, 1500);
      } else if (this.type == 2) {
        let date = new Date();
        let time = date.getTime() / 1000;
        if (this.product.num == 0) {
          this.isActive = true;
          this.contentWarn =
            "很遗憾手慢了，本商品已经被抢空<br />，请把握下次开抢机会";
          setTimeout(() => {
            this.isActive = false;
          }, 1500);
        } else if (time < this.starttime) {
          this.isActive = true;
          this.contentWarn =
            "很抱歉，本组商品尚未开抢<br/> 请留意开场时间，准时抢购";
          setTimeout(() => {
            this.isActive = false;
          }, 1500);
        } else {
          this.$router.replace("/offerorder/" + this.product.id);
        }
      } else if (this.type == 3 || this.type == 4) {
        this.isActive = true;
        this.contentWarn =
          "很抱歉，本组商品尚未开抢<br/> 请留意开场时间，准时抢购";
        setTimeout(() => {
          this.isActive = false;
        }, 1500);
      }
    },
    getData() {
      this.$http
        .post(this.viewListUrl, { id: this.$route.params.id })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.comments = ret.data.star;
            for (var i = 0, len = this.comments.length; i < len; i++) {
              if (Math.max(this.comments[i].vote)) {
                this.mostId = this.comments[i].id;
                this.mostIsLike = this.comments[i].isLike;
                this.mostUsername = this.comments[i].username;
                this.mostPicture = this.comments[i].picture;
                this.mostContent = this.comments[i].content;
                this.mostAddtime = this.comments[i].addtime;
                this.mostVote = this.comments[i].vote;
              } else {
                this.mostId = this.comments[0].id;
                this.mostIsLike = this.comments[0].isLike;
                this.mostUsername = this.comments[0].username;
                this.mostPicture = this.comments[0].picture;
                this.mostContent = this.comments[0].content;
                this.mostAddtime = this.comments[0].addtime;
                this.mostVote = this.comments[0].vote;
              }
            }
          } else {
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
        });
    },
    getDiscountData() {
      this.$http
        .post(this.viewUrl, { id: this.$route.params.id })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.type = ret.type;
            this.product = ret.data;
            this.starttime = ret.data.starttime;
            if (this.type == 1) {
              this.content = "已开抢";
            } else if (this.type == 2) {
              let date = new Date();
              let time = date.getTime() / 1000;
              if (time < this.starttime) {
                this.content = "即将开抢";
              } else {
                this.isContent = true;
                this.content = "立即抢购";
              }
            } else if (this.type == 3) {
              this.content = "即将开抢";
            }
          } else {
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
        });
    },
    toTop: function() {
      document.getElementById("likedMost").scrollIntoView;
    },
    winScroll: function() {
      this.isClassTop = document.body.scrollTop > 100 ? 1 : 0;
    },
    likeMostScroll() {
      document.addEventListener("scroll", this.winScroll(), false);
    }
  }
};
</script>
<style scoped>
/* 评论用户信息 */
.commentDetailPage {
  display: block;
  padding-top: 0.45rem;
}
.commentDetailPage .likedMost {
  display: block;
}
.likedMostTitle {
  display: inline-block;
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  padding-left: 0.1rem;
  font-size: 0.15rem;
  font-weight: bold;
  border-bottom: 1px solid #f4f4f4;
}
.commentMost {
  display: block;
}
.commentMost .index {
  display: block;
  padding: 0.15rem 0.1rem;
}
.commentMost .index .personInfo {
  display: block;
}
.commentMost .index .left {
  display: inline-block;
  position: relative;
  width: 69%;
}
.iconMale {
  display: inline-block;
  position: absolute;
  z-index: 503;
  left: 0;
  top: 0;
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 0.2rem;
  background: url("~@/assets/images/user/icon-male.png") center center
    no-repeat;
  background-size: 0.1rem, 0.1rem;
  background-color: #28b4aa;
}
.img {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  overflow: hidden;
  border-radius: 0.5rem;
}
.img .personIconImg {
  display: inline-block;
  width: 100%;
  height: 100%;
  font-size: 0.12rem;
}
.username {
  display: inline-block;
  float: right;
  overflow: hidden;
  width: 72%;
  line-height: 0.5rem;
  font-size: 0.15rem;
  font-weight: bold;
}
.commentMost .index .right {
  display: inline-block;
  overflow: hidden;
  float: right;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 0;
}
.commentTime {
  font-size: 0.15rem;
}
/* 评论内容 */
.index .commentInfo {
  display: block;
  height: auto;
  line-height: 0.2rem;
  font-size: 0.14rem;
}
/* 点赞 */
.likedInfo {
  display: block;
  height: 0.25rem;
  line-height: 0.25rem;
  text-align: right;
}
.likedInfo .likedIcon {
  color: #ff4b0f;
}
.likedInfo .noLikedIcon {
  color: #c0c0c0;
}
.likedInfo .likedNum {
  display: inline-block;
  float: right;
  font-size: 0.15rem;
  margin-left: 0.1rem;
}
/* 评论用户信息 */
.commentList {
  display: block;
  border-top: 5px solid #f4f4f4;
  margin-bottom: 0.51rem;
}
.commentList .index {
  display: block;
  padding: 0.15rem 0.1rem;
  border-bottom: 1px solid #f4f4f4;
}
.commentList .index .personInfo {
  display: block;
}
.commentList .index .left {
  display: inline-block;
  position: relative;
  width: 69%;
}
.iconMale {
  display: inline-block;
  position: absolute;
  z-index: 503;
  left: 0;
  top: 0;
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 0.2rem;
  background: url("~@/assets/images/user/icon-male.png") center center
    no-repeat;
  background-size: 0.1rem, 0.1rem;
  background-color: #28b4aa;
}
.img {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  overflow: hidden;
  border-radius: 0.5rem;
}
.img .personIconImg {
  display: inline-block;
  width: 100%;
  height: 100%;
  font-size: 0.12rem;
}
.username {
  display: inline-block;
  float: right;
  overflow: hidden;
  width: 72%;
  line-height: 0.5rem;
  font-size: 0.15rem;
  font-weight: bold;
}
.commentList .index .right {
  display: inline-block;
  overflow: hidden;
  float: right;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 0;
}
.commentTime {
  font-size: 0.15rem;
}
/* 底部 */
.commentFooter {
  display: block;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
}
.commentFooter .left {
  display: inline-block;
  overflow: hidden;
  float: left;
  width: 45%;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-size: 0.15rem;
  background: #ffffff;
}
.serviceIcon {
  display: inline-block;
  overflow: hidden;
  float: left;
  width: 35%;
  height: 0.2rem;
  margin-top: 0.12rem;
  background: url("~@/assets/images/SpecialOffer/productDetail/customerService.png")
    right no-repeat;
  background-size: contain;
}
.serviceCon {
  display: inline-block;
  width: 60%;
  font-size: 0.15rem;
  text-align: left;
}
.commentFooter .right {
  display: inline-block;
  width: 55%;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-size: 0;
  font-weight: bold;
  background: red;
  color: #fff;
}
.commentFooter .rightOther {
  display: inline-block;
  width: 55%;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-size: 0;
  font-weight: bold;
  background: #c0c0c0;
  color: #fff;
}
.moneyIcon {
  font-size: 0.12rem;
  font-family: -webkit-body;
}
.moneyNum {
  font-size: 0.25rem;
}
.moneyCon {
  display: inline-block;
  font-size: 0.15rem;
}
/* Toast提示框 */
.finish {
  display: block;
  position: fixed;
  top: 50%;
  width: 94%;
  height: 0.75rem;
  margin: 0 3%;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
}
.finish .finishIcon {
  font-size: 0.35rem;
  overflow: hidden;
  float: left;
  margin-top: 0.15rem;
  margin-left: 0.3rem;
  color: blue;
}
.finish .finishCon {
  display: inline-block;
  margin-top: 0.19rem;
  margin-left: 0.1rem;
  line-height: 0.18rem;
  font-size: 0.14rem;
  color: #fff;
}
.finishOther {
  display: none;
}
/* 回到顶部 */
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