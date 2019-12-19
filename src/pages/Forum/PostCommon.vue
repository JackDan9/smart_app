<template>
  <div>
    <div class="nav">
      <div class="commonNav">
        <i class="back" v-on:click="goBack()"></i>
        <span class="title">发帖</span>
        <i class="send" v-on:click="updateCommon()">发布</i>
      </div>
    </div>
    <div class="commonPage">
      <div class="typeList" v-on:click="choose()">
        <p class="left">
          <i class="typeIcon"></i>
          <span>选择分类</span>
        </p>
        <p class="right">
          <span>{{categoryCon[categoryId]}}</span>
          <i class="goIcon"></i>
        </p>
      </div>
      <div class="title">
        <textarea
          type="text"
          placeholder="有个高大上的标题才会火..."
          name="text"
          ref="commonTitle"
          v-bind:value="commonTitle"
          id="commonTitle"
        ></textarea>
      </div>
      <div class="content">
        <textarea
          type="text"
          placeholder="让世界看到你的Idea..."
          name="text"
          ref="commonContent"
          v-bind:value="commonContent"
          id="commonContent"
        ></textarea>
      </div>
      <div class="text">
        <div id="app">
          <ul class="commonPicList">
            <li class="index" v-for="(item, index) in commonPictures" :key="index">
              <i class="deleteIcon" v-on:click="deletePic(index)"></i>
              <img id="picture_sourceimg" v-bind:src="fullUrl(item.picture)" alt="智慧信阳欢迎您!" />
            </li>
          </ul>
          <input
            type="hidden"
            id="commonPictures"
            name="commonPictures"
            value="commonPictures"
            ref="commonPictures"
          />
          <div class="weui_uploader_input_wrp" v-on:click="changeUploadCommon()"></div>
        </div>
      </div>
      <ul v-bind:class="[isCommonActive ? activeClass : errorClass]">
        <li v-on:click="categoryGame()">
          <span>游戏</span>
        </li>
        <li v-on:click="categoryEat()">
          <span>吃货</span>
        </li>
        <li v-on:click="categoryOutdoor()">
          <span>户外</span>
        </li>
        <li v-on:click="categoryNews()">
          <span>爆料</span>
        </li>
        <li v-on:click="categoryPhoto()">
          <span>晒照</span>
        </li>
        <li v-on:click="categoryChat()">
          <span>瞎吹</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Config from "@/config/config.js";
import Store from "@/store/store.js";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      isCommonActive: false,
      activeClass: "exist",
      errorClass: "noExist",
      commonPictures: [],
      commonTitle: "",
      commonContent: "",
      uid: "",
      username: "",
      categoryId: 0,
      categoryCon: ["游戏", "游戏", "吃货", "户外", "爆料", "晒照", "瞎吹"],
      whoami: "user/whoami/",
      picUrl: "bar/pic/",
      barViewUrl: "bar/view/",
      barUpdateUrl: "bar/update/"
    };
  },
  beforeMount: function() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data || "[]");
        if (ret && ret.code === 0) {
          this.uid = ret.uid;
          this.username = this.username = ret.nickname
            ? ret.nickname
            : ret.username;
          let id = this.$route.params.id;
          this.barView(id);
        }
      });
    } else {
      this.$router.replace("/login");
      return;
    }
  },
  watch: {
    $route(to, from) {
      let id = this.$route.params.id;
      this.barView(id);
    }
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },
    defaultPicUrl: function() {
      return Config.defaultPic;
    },
    choose: function() {
      this.isCommonActive = !this.isCommonActive;
    },
    deletePic: function(index) {
      let pictureId = this.commonPictures[index].id;
      this.deletePicData(pictureId);
    },
    deletePicData(pictureId) {
      this.$http.post(this.picUrl, { id: pictureId }).then(response => {
        const ret = JSON.parse(response.data || "[]");
        if (ret && ret.code === 0) {
          Toast("图片删除成功!");
          let id = this.$route.params.id;
          this.barView(id);
        } else {
          Toast(ret.msg);
        }
      });
    },
    goBack: function() {
      this.$router.push("/community/");
    },
    changeUploadCommon: function() {
      let categoryId = this.categoryId;
      if (categoryId == 0) {
        Toast("请先选择分类!");
      } else {
        let commonTitle = this.$refs.commonTitle.value;
        let commonContent = this.$refs.commonContent.value;
        this.updateCommonCon(commonTitle, commonContent);
        if (this.commonPictures.length >= 2) {
          Toast("最多上传两张图片!");
        } else {
          let id = this.$route.params.id;
          var share = {
            action: "uploadImage",
            Authorization: "Xyapp " + Store.getAuthUid(),
            api: "/bar/upload/" + id + "/1/"
          };
          if (window.postMessage)
            window.postMessage(JSON.stringify(share), "*");
          return true;
        }
      }
    },
    updateCommonCon: function(commonTitle, commonContent) {
      this.$http
        .post(this.barUpdateUrl, {
          id: this.$route.params.id,
          title: commonTitle,
          content: commonContent
        })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("发帖信息更新成功!");
          } else {
            Toast(ret.msg);
            return;
          }
        });
    },
    sendUpdateCommonCon: function(commonTitle, commonContent) {
      this.$http
        .post(this.barUpdateUrl, {
          id: this.$route.params.id,
          uid: this.uid,
          username: this.username,
          title: commonTitle,
          content: commonContent
        })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("发帖信息更新成功!");
            this.$router.push("/module/" + this.categoryId);
          } else {
            Toast(ret.msg);
            return;
          }
        });
    },
    updateCommon: function() {
      if (this.$refs.commonTitle.value.length == 0) {
        Toast("请填写标题!");
      } else if (this.$refs.commonContent.value.length == 0) {
        Toast("请填写内容!");
      } else {
        let commonTitle = this.$refs.commonTitle.value;
        let commonContent = this.$refs.commonContent.value;
        this.sendUpdateCommonCon(commonTitle, commonContent);
      }
    },
    barView(id) {
      this.$http.post(this.barViewUrl, { id: id }).then(response => {
        const ret = JSON.parse(response.data || "[]");
        if (ret && ret.code === 0) {
          this.commonTitle = ret.data.title;
          this.commonContent = ret.data.content;
          this.commonPictures = ret.data.pics;
          this.categoryId = ret.data.categoryid;
        }
      });
    },
    categoryGame: function() {
      this.categoryId = 1;
      this.$http
        .post(this.barUpdateUrl, {
          id: this.$route.params.id,
          categoryid: this.categoryId,
          uid: this.uid
        })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("分类添加成功");
            let id = ret.id;
            this.barView(id);
          } else {
            Toast(ret.msg);
          }
        });
      this.isCommonActive = !this.isCommonActive;
    },
    categoryEat: function() {
      this.categoryId = 2;
      this.$http
        .post(this.barUpdateUrl, {
          id: this.$route.params.id,
          categoryid: this.categoryId,
          uid: this.uid
        })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("分类添加成功");
            let id = ret.id;
            this.barView(id);
          } else {
            Toast(ret.msg);
          }
        });
      this.isCommonActive = !this.isCommonActive;
    },
    categoryOutdoor: function() {
      this.categoryId = 3;
      this.$http
        .post(this.barUpdateUrl, {
          id: this.$route.params.id,
          categoryid: this.categoryId,
          uid: this.uid
        })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("分类添加成功");
            let id = ret.id;
            this.barView(id);
          } else {
            Toast(ret.msg);
          }
        });
      this.isCommonActive = !this.isCommonActive;
    },
    categoryNews: function() {
      this.categoryId = 4;
      this.$http
        .post(this.barUpdateUrl, {
          id: this.$route.params.id,
          categoryid: this.categoryId,
          uid: this.uid
        })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("分类添加成功");
            let id = ret.id;
            this.barView(id);
          } else {
            Toast(ret.msg);
          }
        });
      this.isCommonActive = !this.isCommonActive;
    },
    categoryPhoto: function() {
      this.categoryId = 5;
      this.$http
        .post(this.barUpdateUrl, {
          id: this.$route.params.id,
          categoryid: this.categoryId,
          uid: this.uid
        })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("分类添加成功");
            let id = ret.id;
            this.barView(id);
          }
        });
      this.isCommonActive = !this.isCommonActive;
    },
    categoryChat: function() {
      this.categoryId = 6;
      this.$http
        .post(this.barUpdateUrl, {
          id: this.$route.params.id,
          categoryid: this.categoryId,
          uid: this.uid
        })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("分类添加成功");
            let id = ret.id;
            this.barView(id);
          } else {
            Toast(ret.msg);
          }
        });
      this.isCommonActive = !this.isCommonActive;
    }
  }
};
</script>
<style scoped>
.nav {
  position: relative;
  z-index: 5030;
}
.commonNav {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 503;
  height: 0.5rem;
  line-height: 0.5rem;
  width: 100%;
  background: #000000;
}
.commonNav .back {
  display: inline-block;
  width: 0.2rem;
  height: 0.2rem;
  background: url("~@/assets/images/forum/community/icon-back.png") center center no-repeat;
  background-size: contain;
  margin-top: 0.14rem;
  margin-left: 0.05rem;
}
.commonNav .title {
  display: inline-block;
  width: 73%;
  height: 0.48rem;
  font-size: 0.2rem;
  text-align: center;
  color: #fff;
}
.commonNav .send {
  display: inline-block;
  /* float: right; */
  width: 0.45rem;
  height: 0.25rem;
  margin-right: 0.09rem;
  margin-top: 0.13rem;
  border: 1px solid #c0c0c0;
  border-radius: 5px;
  color: #fff;
  text-align: center;
  line-height: 0.26rem;
}
.commonPage {
  width: 100%;
  height: 91.2%;
  position: absolute;
  top: 8.8%;
}
.commonPage .typeList {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
  /* vertical-align: middle; */
  font-size: 0.15rem;
}
.commonPage .typeList .left {
  display: inline-block;
}
.typeIcon {
  display: inline-block;
  /* float: left; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  background: url("~@/assets/images/forum/postcommon/types.png") center center no-repeat;
  background-size: contain;
}
.commonPage .typeList .right {
  display: inline-block;
  /* float: right; */
  margin-right: 0.1rem;
}
.goIcon {
  display: inline-block;
  /* float: right; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-left: 0.1rem;
  background: url("~@/assets/images/forum/postcommon/go.png") center center no-repeat;
  background-size: contain;
}
/* 标题 */
.commonPage .title {
  display: block;
  width: 100%;
  font-size: 0.18rem;
}
.title textarea {
  border: none;
  outline: none;
  width: 90%;
  padding: 5%;
}
.commonPage .content {
  display: block;
  width: 100%;
  font-size: 0.16rem;
  margin-top: 0.1rem;
}
.content textarea {
  border: none;
  outline: none;
  width: 90%;
  padding: 5%;
  min-height: 1rem;
}
.text {
  display: block;
  overflow: hidden;
  margin-top: 0.2rem;
  margin-left: 0.05rem;
  margin-right: 0.05rem;
}
#app {
  overflow: hidden;
}
.weui_uploader_input_wrp {
  display: inline-block;
  /* float: right; */
  position: relative;
  width: 90px;
  height: 100px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
}
.weui_uploader_input_wrp:before {
  width: 2px;
  height: 39.5px;
}
.weui_uploader_input_wrp:after {
  width: 39.5px;
  height: 2px;
}
.weui_uploader_input_wrp:before {
  content: " ";
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #d9d9d9;
}
.weui_uploader_input_wrp:before {
  content: " ";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  background-color: #d9d9d9;
}
.weui_uploader_input_wrp:after,
.weui_uploader_input_wrp:before {
  content: " ";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  background-color: #d9d9d9;
}
.weui_uploader_input {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.weui_uploader_file {
  float: left;
  margin-right: 9px;
  margin-bottom: 9px;
  width: 79px;
  height: 79px;
  background: no-repeat 50%;
  background-size: cover;
}
#picture_uploadimg {
  float: right;
}
.commonPicList {
  display: inline-block;
}
.commonPicList .index {
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: 90px;
  height: 100px;
  margin-left: 0.05rem;
  border: 1px solid #c0c0c0;
  border-radius: 4px;
}
.commonPicList .index .deleteIcon {
  display: inline-block;
  position: absolute;
  right: 0;
  overflow: hidden;
  width: 0.2rem;
  height: 0.2rem;
  background: url("~@/assets/images/forum/postcommon/deleteIcon.png") center center no-repeat;
  background-size: contain;
}
.index img {
  display: inline-block;
  min-height: 100px;
}
/* 分类选择框 */
.exist {
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  border-radius: 4px;
  background: #2d2d2d;
  color: #fff;
}
.exist li {
  display: inline-block;
  width: 49%;
  height: 0.5rem;
  line-height: 0.5rem;
  margin-left: 1px;
  margin-bottom: 2px;
  border-bottom: 1px solid #fff;
  text-align: center;
  font-size: 0.16rem;
}
.noExist {
  display: none;
}
</style>