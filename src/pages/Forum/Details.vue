<template>
  <div>
    <div class="nav">
      <div class="communityNav">
        <i class="back" v-on:click="goBack()"></i>
        <span class="title" v-on:click="goBack()">{{typeContent[bar.categoryid]}}</span>
        <i class="dn" v-on:click="share()"></i>
      </div>
    </div>
    <div class="detailPage" id="logo" v-infinite-scroll="loadMore2">
      <div class="title">
        <span class="actTitle">{{bar.title}}</span>
        <span v-for="(itemTag, indexTag) in barTags" :key="indexTag">
          <i class="actLabelFir" v-bind:style="{background: itemTag.color }">{{itemTag.title}}</i>
        </span>
      </div>
      <div class="pageHost">
        <div class="info">
          <i class="personIcon">
            <img
              v-bind:src="[bar.u_picture ? fullUrl(bar.u_picture) : defaultPicUrl()]"
              alt="header"
            />
          </i>
          <p class="content">
            <span class="name">{{bar.username}}</span>
            <span class="time">{{bar.addtime}}</span>
          </p>
          <i class="hostIcon"></i>
        </div>

        <div v-bind:class="[bar.type != 3 ? 'actInfo' : 'dn']">
          <div class="actTime">
            <p class="left">
              <i class="timeIcon"></i>
              <span>活动时间</span>
            </p>
            <p class="right">
              <span class="timeCon">{{bar.starttime}}</span>
            </p>
          </div>
          <div class="actPlace">
            <p class="left">
              <i class="placeIcon"></i>
              <span>活动地点</span>
            </p>
            <p class="right">
              <span class="placeCon">{{bar.address}}</span>
            </p>
          </div>
          <div class="actContact">
            <p class="left">
              <i class="contactIcon"></i>
              <span>联系方式</span>
            </p>
            <p class="right">
              <span v-bind:class="[bar.weixin ? 'weChat' : 'dn']">
                <i v-bind:class="[bar.weixin ? 'weChatIcon' : 'dn']"></i>
                <span class="weChatCon">{{bar.weixin}}</span>
              </span>
              <span v-bind:class="[bar.qq ? 'qq' : 'dn']">
                <i v-bind:class="[bar.qq ? 'qqIcon' : 'dn']"></i>
                <span class="qqCon">{{bar.qq}}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="contentInfo">
          <span>{{bar.content}}</span>
        </div>
        <ul v-bind:class="[barPics.length !== 0 ? 'picList' : 'dn']">
          <li
            v-bind:class="[barPics.length === 1 ? 'photoInfoLong' : 'photoInfoShort']"
            v-for="(itemPic, indexPic) in barPics"
            :key="indexPic"
          >
            <img class="index" v-bind:src="fullUrl(itemPic.picture)" alt="Welcome to Smart App!" />
          </li>
        </ul>
        <div class="addLike">
          <p class="like">
            <i
              v-bind:class="[bar.isLike ? 'likedIcon' : 'noLikedIcon']"
              v-on:click="addBarLike(bar.id, bar.isLike, 'star')"
            ></i>
            <span class="likeNum">{{bar.vote}}</span>
            <br />
            <span>给大佬递茶</span>
          </p>
        </div>
        <div v-bind:class="[bar.type != 3 ? 'joinNum' : 'dn']">
          <div class="Num">
            <i class="personNumIcon"></i>
            <span class="personNumCon">
              报名
              <i>{{enrolls.num}}</i>
            </span>
          </div>
          <ul class="iconList">
            <li
              class="index"
              v-for="(itemEnrolls, indexEnrolls) in enrollsData"
              :key="indexEnrolls"
            >
              <i v-bind:class="[parseInt(itemEnrolls.sex) === 1 ? 'iconMale' : 'iconFemale']"></i>
              <div class="img">
                <img
                  v-bind:src="[itemEnrolls.u_picture ? fullUrl(itemEnrolls.u_picture) : defaultPicUrl()]"
                  class="headerImg"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="commentPage">
        <ul class="commentList">
          <li
            class="commentInfo"
            v-for="(itemComment, indexComment) in commentsData"
            :key="indexComment"
          >
            <div class="commentPerson">
              <i class="icon">
                <img
                  v-bind:src="[itemComment.u_picture ? fullUrl(itemComment.u_picture) : defaultPicUrl()]"
                  alt
                />
              </i>
              <p class="personInfo">
                <span class="name">{{itemComment.username}}</span>
                <br />
                <span class="location">{{indexComment + 2}}楼</span>
                <span class="time">{{itemComment.commenttime}}</span>
              </p>
              <p class="interaction">
                <i
                  v-bind:class="[itemComment.isLike ? 'liked' : 'noLiked']"
                  v-on:click="addCommentLike(itemComment.id, itemComment.isLike, 'star')"
                ></i>
                <span class="likedNum">{{itemComment.vote}}</span>
                <i class="commentIcon" v-on:click="reply(indexComment)"></i>
              </p>
            </div>
            <div v-bind:class="[itemComment.comment ? 'commentContent' : 'dn']">
              <span class="content">{{itemComment.comment}}</span>
            </div>
            <ul v-bind:class="[itemComment.pics.length !== 0 ? 'commentPicList': 'dn']">
              <li
                v-bind:class="[itemComment.pics.length === 1 ? 'indexLong' : 'indexShort']"
                v-for="(itemCommentPic, indexCommentPic) in itemComment.pics"
                :key="indexCommentPic"
              >
                <img class="index" :src="fullUrl(itemCommentPic.picture)" alt="Welcome to Smart App!" />
              </li>
            </ul>
            <div v-bind:class="[itemComment.comments.length !== 0 ? 'commentOtherList' : 'dn']">
              <p
                class="list"
                v-for="(itemReply, indexReply) in itemComment.comments"
                :key="indexReply"
              >
                <span class="listName">{{itemReply.username}}:</span>
                <span class="commentCon">{{itemReply.comment}}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="toTop" v-on:click="toTop()" v-bind:class="[isClass > 0 ? '' : 'dn']">
      <img src="~@/assets/images/forum/cdetail/toTopHeader.png" />
    </div>
    <div id="comment" v-on:click="commentFir()">
      <img src="~@/assets/images/forum/cdetail/commentIcon.png" />
    </div>
    <div id="join" v-bind:class="[bar.type != 3 ? 'join' : 'dn']" v-on:click="join()">
      <img v-bind:src="[isJoinClass ? joined : inJoin]" />
    </div>
  </div>
</template>

<script>
  import { Toast } from "mint-ui";

  import Loading from "@/components/Loading";
  import Error from "@/components/Error";
  import inJoin from "@/assets/images/forum/cdetail/inJoin.png";
  import joined from "@/assets/images/forum/cdetail/joined.png";
  import Config from "@/config/config";
  import Storage from "@/storage/storage";

  export default {
    data() {
      return {
        isActive: false,
        isClass: 0,
        isJoinClass: false,
        isError: false,
        error: "",
        inJoin: inJoin,
        joined: joined,
        barPics: [],
        commentsData: [],
        commentPictures: [],
        bar: "",
        replyId: "",
        barTags: [],
        commentId: "",
        enrolls: "",
        enrollsData: [],
        typeContent: ["综合", "游戏", "吃货", "户外", "爆料", "晒照", "瞎吹"],
        uid: "",
        username: "",
        whoami: "user/whoami/",
        likeUrl: "like/add/",
        commentAddUrl: "comment/add/",
        viewUrl: "bar/view/",
        userAddUrl: "userinfo/add/"
      };
    },

    mounted() {
      if (Storage.getAuthUid()) {
        this.$http.get(this.whoami, {}).then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.uid = ret.uid;
            this.username = ret["nickname"] ? ret["nickname"] : ret["username"];
          }
        });
      } else {
        this.$router.push("/login");
      }
      this.getViewData();
    },

    methods: {
      fullUrl: function(url) {
        return Config.baseUrl + url;
      },

      defaultPicUrl: function() {
        return Config.defaultPic;
      },

      goBack: function() {
        this.$router.push("/module/" + this.$route.params.id);
      },

      addCommentLike: function(linkid, isLike, type) {
        let updown = isLike == 1 ? 2 : 1;
        for (var i = 0, len = this.commentsData.length; i < len; i++) {
          if (this.commentsData[i]["id"] == linkid) {
            this.commentsData[i]["isLike"] = updown === 1 ? 1 : 0;
            this.commentsData[i]["vote"] =
              updown === 1
                ? this.commentsData[i]["vote"] * 1 + 1
                : this.commentsData[i]["vote"] * 1 - 1;
            break;
          }
        }
        if (i < len) {
          this.getLike(linkid, updown, 13);
        }
      },
      
      addBarLike: function(linkid, isLike, type) {
        let updown = isLike == 1 ? 2 : 1;
        this.bar["isLike"] = updown === 1 ? 1 : 0;
        this.bar["vote"] =
          updown === 1 ? this.bar["vote"] * 1 + 1 : this.bar["vote"] * 1 - 1;
        this.getLike(linkid, updown, 11);
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

      reply: function(indexComment) {
        let id = this.commentsData[indexComment].id;
        this.$router.push(
          "/reply/" +
            this.$route.params.id +
            "/" +
            this.$route.params.detailsid +
            "/" +
            id
        );
      },

      like: function() {
        this.isActive = !this.isActive;
      },

      toTop: function() {
        document.getElementById("logo").scrollIntoView();
      },

      commentFir: function() {
        let id = this.$route.params.detailsid;
        this.$http
          .post(this.commentAddUrl, { linkid: id, type: 11 })
          .then(response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              let commentId = ret.id;
              this.$router.push(
                "/postcomment/" +
                  this.$route.params.id +
                  "/" +
                  this.$route.params.detailsid +
                  "/" +
                  commentId
              );
            } else {
              Toast(ret.msg);
            }
          });
      },

      loadMore2() {
        document.addEventListener("scroll", this.winScroll(), false);
      },

      winScroll: function() {
        this.isClass = document.body.scrollTop > 100 ? 1 : 0;
      },

      join: function() {
        this.$http
          .post(this.userAddUrl, { linkid: this.$route.params.id })
          .then(response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              console.log(ret);
              this.isJoinClass = !this.isJoinClass;
            } else {
              Toast(ret.msg);
            }
          });
      },
      
      getViewData() {
        this.$http
          .post(this.viewUrl, { id: this.$route.params.detailsid })
          .then(response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              this.bar = ret.data;
              this.barTags = ret.data.tags;
              this.barPics = ret.data.pics;
              this.enrolls = ret.data.enrolls;
              this.enrollsData = ret.data.enrolls.data;
              this.commentsData = ret.data.comments;
            } else {
              Toast(ret.msg);
            }
          });
      }
    }
  };
</script>

<style scoped>
  /* 头部导航栏 */
  .nav {
    position: relative;
    z-index: 5030;
  }
  .communityNav {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 503;
    height: 0.5rem;
    line-height: 0.5rem;
    width: 100%;
    background: #000000;
  }
  .communityNav .back {
    display: inline-block;
    /* float: left; */
    overflow: hidden;
    width: 0.2rem;
    height: 0.2rem;
    background: url("~@/assets/images/forum/community/icon-back.png") center center no-repeat;
    background-size: contain;
    margin-top: 0.14rem;
    margin-left: 0.05rem;
  }
  .communityNav .title {
    display: inline-block;
    width: 14%;
    height: 0.36rem;
    line-height: 0.36rem;
    margin-top: 0.07rem;
    margin-left: 0.05rem;
    padding-left: 0.05rem;
    border-left: 1px solid #2d2d2d;
    font-size: 0.2rem;
    color: #fff;
  }
  .communityNav .share {
    display: inline-block;
    /* float: right; */
    overflow: hidden;
    width: 0.2rem;
    height: 0.2rem;
    margin-top: 0.14rem;
    margin-right: 0.1rem;
    background: url("~@/assets/images/forum/cdetail/share.png") center center no-repeat;
    background-size: contain;
  }
  /* 主页 */
  .detailPage {
    display: block;
    padding-top: 16%;
    height: 100%;
    width: 100%;
  }
  .detailPage .title {
    display: block;
    height: auto;
    font-size: 0.18rem;
    font-weight: bold;
    letter-spacing: 0.005rem;
  }
  .actLabelFir {
    display: inline-block;
    width: 0.6rem;
    height: 0.2rem;
    line-height: 0.2rem;
    margin-top: 0.15rem;
    margin-left: 0.1rem;
    margin-right: 0.1rem;
    font-size: 0.12rem;
    text-align: center;
    color: #fff;
  }
  .actLabelSec {
    display: inline-block;
    width: 0.6rem;
    height: 0.2rem;
    line-height: 0.2rem;
    font-size: 0.12rem;
    text-align: center;
    color: #fff;
    background: green;
  }
  .actTitle {
    display: inline-block;
    margin-left: 0.1rem;
    margin-top: 0.1rem;
  }
  /* 活动的基本信息 */
  .actInfo {
    display: block;
    margin-top: 0.1rem;
    border-top: 1px solid #f1f1f1;
    border-bottom: 1px solid #f1f1f1;
  }
  /* 活动时间 */
  .actInfo .actTime {
    display: block;
    height: 0.5rem;
    line-height: 0.5rem;
    /* vertical-align: middle; */
    font-size: 0.15rem;
  }
  .actInfo .actTime .left {
    display: inline-block;
  }
  .timeIcon {
    display: inline-block;
    /* float: left; */
    width: 0.2rem;
    height: 0.2rem;
    margin-top: 0.135rem;
    margin-left: 0.1rem;
    margin-right: 0.1rem;
    background: url("~@/assets/images/forum/postactivity/time.png") center center no-repeat;
    background-size: contain;
  }
  .actInfo .actTime .right {
    display: inline-block;
    /* float: right; */
    margin-right: 0.1rem;
    color: #f1f1f1;
  }
  /* 活动地点 */
  .actInfo .actPlace {
    display: block;
    height: 0.5rem;
    line-height: 0.5rem;
    /* vertical-align: middle; */
    font-size: 0.15rem;
  }
  .actInfo .actPlace .left {
    display: inline-block;
  }
  .placeIcon {
    display: inline-block;
    /* float: left; */
    width: 0.2rem;
    height: 0.2rem;
    margin-top: 0.135rem;
    margin-left: 0.1rem;
    margin-right: 0.1rem;
    background: url("~@/assets/images/forum/postactivity/place.png") center center no-repeat;
    background-size: contain;
  }
  .actInfo .actPlace .right {
    display: inline-block;
    /* float: right; */
    margin-right: 0.1rem;
    color: #f1f1f1;
  }
  /* 联系方式 */
  .actInfo .actContact {
    display: block;
    height: 0.5rem;
    /* vertical-align: middle; */
    font-size: 0.15rem;
  }
  .actInfo .actContact .left {
    display: block;
  }
  .contactIcon {
    display: inline-block;
    /* float: left; */
    width: 0.2rem;
    height: 0.2rem;
    margin-left: 0.1rem;
    margin-right: 0.1rem;
    background: url("~@/assets/images/forum/postactivity/contact.png") center
      center no-repeat;
    background-size: contain;
  }
  .actInfo .actContact .right {
    display: block;
    overflow: hidden;
    float: right;
    margin-top: 0.03rem;
    margin-right: 0.1rem;
    color: #f1f1f1;
  }
  /* 微信 */
  .weChat {
    display: inline-block;
  }
  .weChat .weChatIcon {
    display: inline-block;
    /* float: left; */
    width: 0.2rem;
    height: 0.2rem;
    margin-left: 0.1rem;
    margin-right: 0.1rem;
    background: url("~@/assets/images/forum/postactivity/wechat.png") center center no-repeat;
    background-size: contain;
  }
  .weChat .weChatCon {
    display: inline-block;
  }
  /* QQ */
  .qq {
    display: inline-block;
  }
  .qq .qqIcon {
    display: inline-block;
    /* float: left; */
    width: 0.2rem;
    height: 0.2rem;
    margin-left: 0.1rem;
    margin-right: 0.1rem;
    background: url("~@/assets/images/forum/postactivity/qq.png") center center
      no-repeat;
    background-size: contain;
  }
  .qq .qqCon {
    display: inline-block;
  }
  /* 楼主 */
  .pageHost {
    display: block;
    margin-top: 0.1rem;
  }
  .pageHost .info {
    display: block;
    width: 97%;
    height: 0.5rem;
    margin-left: 0.1rem;
    line-height: 0.5rem;
  }
  .info .personIcon {
    display: inline-block;
    overflow: hidden;
    /* float: left; */
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 0.5rem;
  }
  .personIcon img {
    overflow: hidden;
  }
  .info .content {
    display: inline-block;
    width: 30%;
    margin-top: 0.05rem;
    padding-left: 0.2rem;
    line-height: 0.22rem;
  }
  .content .name {
    display: inline-block;
  }
  .content .time {
    display: inline-block;
  }
  .info .hostIcon {
    display: inline-block;
    width: 0.6rem;
    height: 0.2rem;
    background: url("~@/assets/images/forum/cdetail/hostIconCon.png") center center no-repeat;
    background-size: contain;
  }
  /* 楼主的帖子内容 */
  .pageHost .contentInfo {
    display: block;
    width: 92%;
    line-height: 0.25rem;
    margin-left: 0.15rem;
    font-size: 0.15rem;
    margin-top: 0.2rem;
    letter-spacing: 0.01rem;
  }
  /* 楼主的帖子图片 */
  .picList {
    display: block;
    width: 100%;
  }
  .picList .photoInfoLong {
    display: inline-block;
    overflow: hidden;
    width: 100%;
    height: 1.8rem;
    margin-top: 0.1rem;
    text-align: center;
    border-radius: 5px;
  }
  .picList .photoInfoShort {
    display: inline-block;
    overflow: hidden;
    width: 48%;
    height: 1.8rem;
    margin-left: 0.05rem;
    text-align: center;
    border-radius: 5px;
  }
  .picList .photoInfoShort .index {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  .picList .photoInfoLong .index {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  /* 点赞 */
  .addLike {
    display: block;
    width: 100%;
  }
  .addLike .like {
    display: block;
    margin: 0.2rem auto;
    width: 30%;
    text-align: center;
  }
  .likedIcon {
    display: inline-block;
    width: 50%;
    height: 0.3rem;
    background: url("~@/assets/images/forum/cdetail/likedIcon.png") center center no-repeat;
    background-size: contain;
  }
  .noLikedIcon {
    display: inline-block;
    width: 50%;
    height: 0.3rem;
    background: url("~@/assets/images/forum/cdetail/noLikedIcon.png") center center no-repeat;
    background-size: contain;
  }
  .likeNum {
    display: inline-block;
    font-size: 0.2rem;
    width: 30%;
    text-align: center;
  }
  /* 加入人数信息 */
  .joinNum {
    display: block;
  }
  .joinNum .Num {
    display: block;
    width: 22%;
    height: 0.4rem;
    line-height: 0.5rem;
    margin-left: 0.1rem;
    margin-bottom: 0.1rem;
    border-bottom: 4px solid red;
  }
  .personNumIcon {
    display: inline-block;
    /* float: left; */
    overflow: hidden;
    width: 0.16rem;
    height: 0.16rem;
    margin-top: 0.15rem;
    margin-right: 0.05rem;
    background: url("~@/assets/images/forum/cdetail/joinNumIcon.png") center center no-repeat;
    background-size: contain;
  }
  .personNumCon {
    display: inline-block;
    font-style: normal;
    color: red;
    font-size: 0.15rem;
  }
  /* 加入人数的头像信息 */
  .iconList {
    display: block;
    width: 97%;
    overflow: hidden;
    margin-left: 0.1rem;
  }
  .iconList .index {
    display: inline-block;
    position: relative;
    width: 0.5rem;
    height: 0.5rem;
  }
  .iconList .iconMale {
    display: inline-block;
    position: absolute;
    z-index: 503;
    left: 0;
    top: 0;
    width: 0.2rem;
    height: 0.2rem;
    border-radius: 0.2rem;
    background: url("~@/assets/images/user/icon-male.png") center center no-repeat;
    background-size: 0.12rem, 0.12rem;
    background-color: #28b4aa;
  }
  .iconList .iconFemale {
    display: inline-block;
    position: absolute;
    z-index: 503;
    left: 0;
    top: 0;
    width: 0.2rem;
    height: 0.2rem;
    border-radius: 0.2rem;
    background: url("~@/assets/images/user/icon-female.png") center center no-repeat;
    background-size: 0.12rem, 0.12rem;
    background-color: #28b4aa;
  }
  .iconList .img {
    width: 0.5rem;
    height: 0.5rem;
    overflow: hidden;
    border-radius: 0.5rem;
  }
  .headerImg {
    width: 100%;
    height: 100%;
  }
  /* 评论帖子页面 */
  .commentPage {
    display: block;
    margin-top: 0.05rem;
  }
  .commentPage .commentList {
    display: block;
  }
  .commentInfo {
    display: block;
    padding-bottom: 0.05rem;
    border-top: 5px solid #f1f1f1;
  }
  .commentInfo .commentPerson {
    display: block;
    width: 91%;
    height: 0.5rem;
    margin-left: 3%;
    margin-top: 3%;
    margin-bottom: 3%;
  }
  .commentPerson .icon {
    display: inline-block;
    overflow: hidden;
    /* float: left; */
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 0.5rem;
  }
  .icon img {
    width: 100%;
    height: 100%;
  }
  /* 个人信息 */
  .commentPerson .personInfo {
    display: inline-block;
    width: 40%;
    margin-top: 0.05rem;
    line-height: 0.22rem;
    padding-left: 0.2rem;
  }
  .personInfo .name {
    display: inline-block;
    width: 78%;
    text-align: left;
  }
  .personInfo .location {
    display: inline-block;
  }
  .personInfo .time {
    display: inline-block;
  }
  /* 其他用户点赞与否 */
  .commentPerson .interaction {
    display: inline-block;
    /* float: right; */
    margin-top: 0.15rem;
  }
  .interaction .liked {
    display: inline-block;
    overflow: hidden;
    /* float: left; */
    width: 0.18rem;
    height: 0.18rem;
    margin-top: 0.02rem;
    background: url("~@/assets/images/forum/cdetail/likedIcon.png") center center no-repeat;
    background-size: contain;
  }
  .interaction .noLiked {
    display: inline-block;
    overflow: hidden;
    /* float: left; */
    width: 0.18rem;
    height: 0.18rem;
    margin-top: 0.02rem;
    background: url("~@/assets/images/forum/cdetail/commentNoLiked.png") center center no-repeat;
    background-size: contain;
  }
  .interaction .likedNum {
    display: inline-block;
    font-size: 0.2rem;
    margin-left: 0.05rem;
    margin-right: 0.1rem;
  }
  .interaction .commentIcon {
    display: inline-block;
    /* float: right; */
    width: 0.16rem;
    height: 0.16rem;
    margin-top: 0.04rem;
    background: url("~@/assets/images/forum/cdetail/comment.png") center center no-repeat;
    background-size: contain;
  }
  /* 评论内容 */
  .commentContent {
    display: block;
    width: 94%;
    height: 0.5rem;
    margin-left: 3%;
    line-height: 0.5rem;
    /* vertical-align: 0.5rem; */
  }
  .commentContent .content {
    display: inline-block;
    width: 100%;
    margin-top: 0;
    line-height: inherit;
    font-size: 0.16rem;
    font-weight: bold;
    letter-spacing: 0.02rem;
    text-align: left;
  }
  /* 评论图片 */
  .commentPicList {
    display: block;
    width: 100%;
  }
  .commentPicList .indexShort {
    display: inline-block;
    width: 48%;
    height: 200px;
    overflow: hidden;
    margin-left: 3%;
    text-align: center;
    line-height: 200px;
    vertical-align: middle;
    border-radius: 5px;
  }
  .commentPicList .indexLong {
    display: inline-block;
    width: 94%;
    height: 200px;
    overflow: hidden;
    margin-left: 3%;
    text-align: center;
    line-height: 200px;
    vertical-align: middle;
    border-radius: 5px;
  }
  .commentPicList .indexShort .index {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  .commentPicList .indexLong .index {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  /* 评论内容 */
  .commentOtherList {
    display: block;
    width: 94%;
    margin: 3% auto;
    padding-top: 0.1rem;
    padding-bottom: 0.1rem;
    border: 1px solid #f1f1f1;
    border-radius: 4px;
    background: #c0c0c0;
  }
  .commentOtherList .list {
    display: block;
    margin-left: 3%;
    font-size: 0.15rem;
  }
  .listName {
    display: inline-block;
    color: red;
  }
  .commentCon {
    display: inline-block;
  }
  /* 置顶按钮 */
  #toTop {
    position: fixed;
    bottom: 33%;
    right: 4%;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 0.6rem;
    text-align: center;
  }
  #toTop img {
    width: 0.6rem;
  }
  #comment {
    position: fixed;
    bottom: 20%;
    right: 4%;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 0.6rem;
    text-align: center;
  }
  #comment img {
    width: 0.6rem;
  }
  .join {
    position: fixed;
    bottom: 7%;
    right: 4%;
    width: 0.6rem;
    height: 0.6rem;
    border-radius: 0.6rem;
    text-align: center;
  }
  .join img {
    width: 0.6rem;
  }
</style>
