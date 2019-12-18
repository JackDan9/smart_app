<template>
  <div>
    <div class="nav">
      <div class="communityNav">
        <i class="back" v-on:click="goBack()"></i>
        <span class="title">{{typeContent[categoryId]}}</span>
        <i class="dn" v-on:click="post()"></i>
      </div>
    </div>
    <div class="communityPage">
      <div class="area">
        <img class="gamePic" v-bind:src="imgPic" />
      </div>
      <div class="comprehensive">
        <div class="title">
          <span class="comprehensiveCon">
            <i
              v-bind:class="[ !isActive ? 'dn' : ' iconfont chooseCon']"
              v-on:click="choose()"
            >&#xe636;</i>
            <i
              v-bind:class="[ !isActive ? 'iconfont fontColor' : 'dn']"
              v-on:click="choose()"
            >&#xe606;</i>
            <span class="see">只看活动帖</span>
          </span>
        </div>
        <ul
          class="actInfo"
          v-infinite-scroll="loadMoreModule"
          infinite-scroll-disabled="isLoading"
          infinite-scroll-distance="10"
        >
          <li
            v-on:click="goDetail(index)"
            v-for="(item, index) in moduleList"
            :key="index"
            v-bind:class="[(item.title && item.content ) ? 'actInfoFir' : 'dn']"
            v-show="item.type != 3 || isActive"
          >
            <p class="person">
              <i class="personIcon">
                <img v-bind:src="item.u_picture ? fullUrl(item.u_picture) : defaultPicUrl()" />
              </i>
              <span class="name">{{item.username}}</span>
              <span class="time">{{item.addtime}}</span>
            </p>
            <p class="labelFir">
              <i v-bind:class="typeClassList[item.type]">{{typeList[item.type]}}</i>
              <span v-bind:class="[item.type != 3 ? 'actTitle' : 'actNotTitle']">{{item.title}}</span>
            </p>
            <p class="labelSec">
              <span class="Con">{{item.content}}</span>
            </p>
            <ul v-bind:class="[item.pics.length !== 0 ? 'photo' : 'dn']">
              <li
                v-bind:class="[item.pics.length === 1 ? 'photoInfoLong' : 'photoInfoShort']"
                v-for="(itemPic, indexPic) in item.pics"
                :key="indexPic"
              >
                <img class="index" v-bind:src="fullUrl(itemPic.picture)" alt="智慧信阳欢迎您!" />
              </li>
            </ul>
            <div class="bottom">
              <div class="left">
                <span v-for="(itemTag, indexTag) in item.tags" :key="indexTag">
                  <i class="actLabel" v-bind:style="{background: itemTag.color }">{{itemTag.title}}</i>
                </span>
              </div>
              <div class="right">
                <span class="join">
                  <i class="joinIcon"></i>
                  <span class="joinNum">{{item.enrollNum}}</span>
                </span>
                <span class="comment">
                  <i class="commentIcon"></i>
                  <span class="commentNum">{{item.commentNum}}</span>
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Config from "../../config.js";
import Store from "../../store.js";
import { Toast } from "mint-ui";
import gamePic from "../../assets/images/forum/community/modules/game.jpg";
import foodPic from "../../assets/images/forum/community/modules/food.jpg";
import outDoorPic from "../../assets/images/forum/community/modules/outdoor.jpg";
import brokeNewsPic from "../../assets/images/forum/community/modules/brokenews.jpg";
import photoPic from "../../assets/images/forum/community/modules/photo.jpg";
import chatPic from "../../assets/images/forum/community/modules/chat.jpg";
export default {
  data() {
    return {
      isActive: true,
      isShow: false,
      imgPic: "",
      categoryId: 0,
      typeClassList: ["", "iconOffAct", "iconAct", "dn"],
      typeList: ["", "官方活动", "活动"],
      typeContent: ["综合", "游戏", "吃货", "户外", "爆料", "晒照", "瞎吹"],
      moduleList: [],
      viewList: "bar/viewlist/"
    };
  },
  mounted() {
    this.categoryId = this.$route.params.id;
    if (this.categoryId == 1) {
      this.imgPic = gamePic;
    } else if (this.categoryId == 2) {
      this.imgPic = foodPic;
    } else if (this.categoryId == 3) {
      this.imgPic = outDoorPic;
    } else if (this.categoryId == 4) {
      this.imgPic = brokeNewsPic;
    } else if (this.categoryId == 5) {
      this.imgPic = photoPic;
    } else if (this.categoryId == 6) {
      this.imgPic = chatPic;
    }
    this.getBarList();
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },
    defaultPicUrl: function() {
      return Config.defaultPic;
    },
    choose: function() {
      this.isActive = !this.isActive;
    },
    goBack: function() {
      this.$router.push("/community/");
    },
    post: function() {
      this.$router.push("/posttype/");
    },
    game: function() {
      this.$router.push("/game/");
    },
    food: function() {
      this.$router.push("/food/");
    },
    outdoor: function() {
      this.$router.push("/outdoor/");
    },
    brokenews: function() {
      this.$router.push("/brokenews/");
    },
    photo: function() {
      this.$router.push("/photo/");
    },
    chat: function() {
      this.$router.push("/chat/");
    },
    loadMoreModule: function() {
      this.getBarList();
    },
    goDetail: function(index) {
      let detailsId = this.moduleList[index].id;
      this.$router.push(
        "/details/" + this.$route.params.id + "/" + detailsId + "/"
      );
    },
    getBarList() {
      this.$http
        .post(this.viewList, {
          categoryid: this.$route.params.id,
          page: this.page
        })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.page = ret.data.page;
            if (this.page == 1) {
              this.moduleList = ret.data.bar;
            } else {
              let moduleList_new = ret.data.bar;
              if (moduleList_new && moduleList_new.length !== 0) {
                for (let i = 0; i < moduleList_new.length; i++) {
                  this.moduleList.push(moduleList_new[i]);
                }
              }
            }
            this.total = ret.data.total;
            if (this.page <= this.total) {
              this.page = this.page + 1;
            }
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
  width: 0.2rem;
  height: 0.2rem;
  background: url("../../assets/images/forum/community/icon-back.png") center center no-repeat;
  background-size: contain;
  margin-top: 0.14rem;
  margin-left: 0.05rem;
}
.communityNav .title {
  display: inline-block;
  width: 80%;
  height: 0.48rem;
  font-size: 0.2rem;
  text-align: center;
  color: #fff;
}
.communityNav .posting {
  display: inline-block;
  width: 0.2rem;
  height: 0.2rem;
  background: url("../../assets/images/forum/community/posting-white.png") center center no-repeat;
  background-size: contain;
}
/* 主页面 */
.communityPage {
  padding-top: 0.5rem;
  width: 100%;
  height: 100%;
}
/* 专区 */
.communityPage .area {
  display: block;
}
.communityPage .area .gamePic {
  display: inline-block;
  width: 100%;
}
/* 置顶 */
.stick {
  display: block;
  width: 100%;
  margin-top: 10px;
  border-top: 8px solid #c0c0c0;
}
/* 官方活动 */
.officialAct {
  display: block;
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  margin-left: 0.1rem;
  overflow: hidden;
}
.officialAct .iconOff {
  float: left;
  display: inline-block;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 0.4rem;
  margin-top: 0.05rem;
  background: url("../../assets/images/forum/community/stick/icon-sec.png") center center no-repeat;
  background-size: contain;
}
.iconOffAct {
  display: inline-block;
  width: 0.55rem;
  height: 0.2rem;
  margin-left: 0.03rem;
  font-size: 0.12rem;
  line-height: 0.2rem;
  color: #fff;
  text-align: center;
  background: red;
}
.officialAct .offCon {
  display: inline-block;
  width: 69%;
  float: right;
  font-size: 0.13rem;
}
/* 活动 */
.act {
  display: block;
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  margin-left: 0.1rem;
  overflow: hidden;
}
.act .icon {
  float: left;
  display: inline-block;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 0.4rem;
  margin-top: 0.05rem;
  background: url("../../assets/images/forum/community/stick/icon-trd.png") center center no-repeat;
  background-size: contain;
}
.iconAct {
  display: inline-block;
  width: 0.5rem;
  height: 0.2rem;
  margin-left: 0.03rem;
  background: yellow;
  text-align: center;
  line-height: 0.2rem;
}
.act .con {
  display: inline-block;
  float: right;
  width: 70%;
  font-size: 0.13rem;
}
/* 综合 */
.comprehensive {
  display: block;
  width: 100%;
}
.comprehensive .title {
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 0.16rem;
}
.comprehensive .title .comprehensiveCon {
  display: inline-block;
  width: 100%;
}
.fontColor {
  color: green;
  overflow: hidden;
  float: left;
  margin-left: 0.1rem;
}
.chooseCon {
  overflow: hidden;
  float: left;
  margin-left: 0.1rem;
}
.see {
  display: inline-block;
  margin-left: 0.1rem;
  line-height: 0.43rem;
}
/* 活动信息 */
.actInfo {
  display: block;
  width: 100%;
}
.actInfo .actInfoFir {
  display: block;
  width: 93%;
  padding: 0.1rem 0.1rem;
  margin-top: 0.2rem;
  border-bottom: 1px solid #f1f1f1;
}
.actInfo .actInfoFir .person {
  display: block;
  height: 0.45rem;
  width: 100%;
  line-height: 0.23rem;
}
.personIcon {
  display: inline-block;
  overflow: hidden;
  width: 0.45rem;
  height: 0.45rem;
  float: left;
  border-radius: 0.45rem;
  margin-right: 0.1rem;
  margin-left: 0.1rem;
}
.person .name {
  display: inline-block;
  width: 70%;
  height: 0.22rem;
  font-size: 0.16rem;
}
.person .time {
  display: inline-block;
  height: 0.22rem;
  font-size: 0.14rem;
}
/*  第一个标签栏 */
.labelFir {
  display: block;
  width: 100%;
  height: auto;
  margin-top: 0.1rem;
  line-height: 0.18rem;
  vertical-align: middle;
}
.labelFir .act {
  display: inline-block;
  width: 0.6rem;
  height: 0.2rem;
  margin-left: 0.1rem;
  margin-top: 0.15rem;
  background: red;
  line-height: 0.2rem;
  text-align: center;
  font-size: 0.12rem;
  color: #fff;
}
.labelFir .actTitle {
  display: inline-block;
  float: right;
  width: 76%;
  font-size: 0.16rem;
  letter-spacing: 0.01rem;
}
.labelFir .actNotTitle {
  display: inline-block;
  float: right;
  width: 100%;
  padding: 0.1rem 0;
  font-size: 0.16rem;
  font-weight: bold;
  letter-spacing: 0.01rem;
}
/* 第二个标签栏 */
.labelSec {
  display: block;
}
.labelSec .Con {
  display: inline-block;
  width: 98%;
  margin-left: 2%;
  font-size: 0.14rem;
  line-height: 0.22rem;
  letter-spacing: 0.005rem;
}
/* 帖子图片 */
.photo {
  display: block;
  width: 100%;
}
.photo .photoInfoLong {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 1.8rem;
  margin-top: 0.1rem;
  line-height: 2rem;
  text-align: center;
  border-radius: 5px;
}
.photo .photoInfoShort {
  display: inline-block;
  overflow: hidden;
  width: 48%;
  height: 1.8rem;
  margin-left: 0.05rem;
  text-align: center;
  border-radius: 5px;
}
.photo .photoInfoShort .index {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.photo .photoInfoLong .index {
  display: inline-block;
  width: 100%;
  height: 100%;
}
/* 底部标签 */
.bottom {
  display: block;
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  vertical-align: middle;
}
.bottom .left {
  display: inline-block;
  float: left;
  width: 66%;
  height: 0.5rem;
  line-height: 0.05rem;
  text-align: left;
}
.bottom .right {
  display: inline-block;
  width: 30%;
}
.bottom .actLabel {
  display: inline-block;
  width: 0.6rem;
  height: 0.2rem;
  line-height: 0.2rem;
  margin-top: 0.15rem;
  margin-left: 0.1rem;
  font-size: 0.12rem;
  text-align: center;
  color: #fff;
}
/*
.bottom .actLabelFir { display: inline-block; width: 0.6rem; height: 0.2rem; line-height: 0.2rem; margin-top: 0.15rem; margin-left: 0.1rem; margin-right: 0.1rem; font-size: 0.12rem; text-align: center; color: #fff; background: blue; }
*/
/*
.bottom .actLabelSec { display: inline-block; width: 0.6rem; height: 0.2rem; line-height: 0.2rem; font-size: 0.12rem; text-align: center; color: #fff; background: green; }
*/
.bottom .join {
  display: inline-block;
  font-size: 0.16rem;
}
.joinIcon {
  display: inline-block;
  overflow: hidden;
  float: left;
  width: 0.16rem;
  height: 0.16rem;
  margin-top: 0.15rem;
  margin-right: 0.05rem;
  background: url("../../assets/images/forum/community/bottom/join.png") center center no-repeat;
  background-size: contain;
}
.bottom .comment {
  display: inline-block;
  font-size: 0.16rem;
}
.commentIcon {
  display: inline-block;
  overflow: hidden;
  float: left;
  width: 0.16rem;
  height: 0.16rem;
  margin-top: 0.17rem;
  margin-right: 0.05rem;
  background: url("../../assets/images/forum/community/bottom/comment.png") center center no-repeat;
  background-size: contain;
}
</style>