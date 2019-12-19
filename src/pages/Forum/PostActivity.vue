<template>
  <div>
    <div class="nav">
      <div class="activityNav">
        <i class="back" v-on:click="goBack()"></i>
        <span class="title">活动帖</span>
        <i class="send" v-on:click="sendUpdateActivity()">发布</i>
      </div>
    </div>
    <div class="activityPage">
      <div class="title">
        <textarea></textarea>
      </div>
      <div class="content">
        <textarea></textarea>
      </div>
      <div class="text">
        <div id="app">
          <ul class="activityPicList">
            <li class="index" v-for="(item, index) in postPicture" :key="index">
              <i class="deleteIcon" v-on:click="deletePic(index)"></i>
              <img id="picture_sourceimg" :src="fullUrl(item.picture)" alt="智慧信阳欢迎您!" />
            </li>
          </ul>
          <input
            type="hidden"
            id="postPicture"
            name="postPicture"
            value="postPicture"
            ref="postPicture"
          />
          <div class="weui_uploader_input_wrp" v-on:click="changeUploadPost()"></div>
        </div>
      </div>
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
      <div class="startTime" v-on:click="startTime()">
        <p class="left">
          <i class="timeIcon"></i>
          <span>开始时间</span>
        </p>
        <p class="right">
          <span>{{starttime || '周日 7/23 10:00'}}</span>
          <i class="goIcon"></i>
        </p>
      </div>
      <div class="endTime" v-on:click="endTime()">
        <p class="left">
          <i class="timeIcon"></i>
          <span>结束时间</span>
        </p>
        <p class="right">
          <span>{{endtime || '周一 7/24 10:00'}}</span>
          <i class="goIcon"></i>
        </p>
      </div>
      <div class="actPlace" v-on:click="actPlace()">
        <p class="left">
          <i class="placeIcon"></i>
          <span>活动地点</span>
        </p>
        <p class="right">
          <span>{{address || '请输入信阳市内地点!'}}</span>
          <i class="goIcon"></i>
        </p>
      </div>
      <div class="actLabel" v-on:click="actLabel()">
        <p class="left">
          <i class="labelIcon"></i>
          <span>活动标签(最多2组)</span>
        </p>
        <p class="right">
          <i class="goIcon"></i>
        </p>
      </div>
      <div class="labelList">
        <li v-for="(item, indexTag) in postTags" :key="indexTag">
          <div v-bind:style="{background: item.color}">
            <i class="delLabelIcon" v-on:click="deleteTag(indexTag)"></i>
            <span>{{item.title}}</span>
          </div>
        </li>
      </div>
      <div class="actContact">
        <div class="contChoose">
          <i class="contactIcon"></i>
          <span>联系方式（报名后显示）</span>
        </div>
        <p class="left" v-on:click="qq()">
          <i class="qqIcon"></i>
          <span>{{qQNumber || 'QQ号'}}</span>
        </p>
        <p class="right" v-on:click="weChat()">
          <i class="wechatIcon"></i>
          <span>{{weChatNum || '微信号'}}</span>
        </p>
      </div>
      <ul v-bind:class="[isActive ? activeClass : errorClass]">
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
import Store from "@/store/store";
import Config from "@/config/config";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      isActive: false,
      activeClass: "exist",
      errorClass: "noExist",
      color: "red",
      postPicture: [],
      postTags: [],
      uid: "",
      username: "",
      categoryId: 0,
      categoryCon: ["游戏", "游戏", "吃货", "户外", "爆料", "晒照", "瞎吹"],
      address: "",
      starttime: "",
      endtime: "",
      qQNumber: "",
      weChatNum: "",
      whoami: "user/whoami/",
      barViewListUrl: "bar/viewlist/",
      barViewUrl: "bar/view/",
      picUrl: "bar/pic/",
      tagUrl: "tag/del/",
      updateBarUrl: "bar/update/"
    };
  },
  beforeMount: function() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
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
    changeUploadPost: function() {
      let categoryId = this.categoryId;
      if (categoryId == 0) {
        Toast("请先选择分类!");
      } else {
        let actTitle = this.$refs.actTitle.value;
        let actContent = this.$refs.actContent.value;
        this.updateActivity(actTitle, actContent);
        if (this.postPicture.length >= 2) {
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
    updateActivity: function(actTitle, actContent) {
      this.$http
        .post(this.updateBarUrl, {
          id: this.$route.params.id,
          title: actTitle,
          content: actContent
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
    updateActivityCon: function(actTitle, actContent) {
      this.$http
        .post(this.updateBarUrl, {
          id: this.$route.params.id,
          uid: this.uid,
          username: this.username,
          title: actTitle,
          content: actContent
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
    sendUpdateActivity: function() {
      if (this.$refs.actTitle.value.length == 0) {
        Toast("请填写标题!");
      } else if (this.$refs.actContent.value.length == 0) {
        Toast("请填写内容!");
      } else {
        let actTitle = this.$refs.actTitle.value;
        let actContent = this.$refs.actContent.value;
        this.updateActivityCon(actTitle, actContent);
      }
    },
    choose: function() {
      this.isActive = !this.isActive;
    },
    deletePic: function(index) {
      let pictureId = this.postPicture[index].id;
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
    startTime: function() {
      if (this.categoryId === 0) {
        Toast("请选择分类");
      } else {
        this.$router.push("/starttime/" + this.$route.params.id);
      }
    },
    endTime: function() {
      if (this.categoryId === 0) {
        Toast("请选择分类");
      } else {
        this.$router.push("/endtime/" + this.$route.params.id);
      }
    },
    actPlace: function() {
      if (this.categoryId === 0) {
        Toast("请选择分类");
      } else {
        this.$router.push("/actplace/" + this.$route.params.id);
      }
    },
    actLabel: function() {
      if (this.postTags.length >= 2) {
        Toast("标签最多两组!");
      } else if (this.categoryId === 0) {
        Toast("请先选择分类!");
      } else {
        this.$router.push("/actlabel/" + this.$route.params.id);
      }
    },
    qq: function() {
      if (this.categoryId === 0) {
        Toast("请选择分类");
      } else {
        this.$router.push("/qq/" + this.$route.params.id);
      }
    },
    weChat: function() {
      if (this.categoryId === 0) {
        Toast("请选择分类");
      } else {
        this.$router.push("/wechat/" + this.$route.params.id);
      }
    },
    categoryGame: function() {
      this.categoryId = 1;
      this.$http
        .post(this.updateBarUrl, {
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
      this.isActive = !this.isActive;
    },
    categoryEat: function() {
      this.categoryId = 2;
      this.$http
        .post(this.updateBarUrl, {
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
      this.isActive = !this.isActive;
    },
    categoryOutdoor: function() {
      this.categoryId = 3;
      this.$http
        .post(this.updateBarUrl, {
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
      this.isActive = !this.isActive;
    },
    categoryNews: function() {
      this.categoryId = 4;
      this.$http
        .post(this.updateBarUrl, {
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
      this.isActive = !this.isActive;
    },
    categoryPhoto: function() {
      this.categoryId = 5;
      this.$http
        .post(this.updateBarUrl, {
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
      this.isActive = !this.isActive;
    },
    categoryChat: function() {
      this.categoryId = 6;
      this.$http
        .post(this.updateBarUrl, {
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
      this.isActive = !this.isActive;
    },
    barView(id) {
      this.$http.post(this.barViewUrl, { id: id }).then(response => {
        const ret = JSON.parse(response.data || "[]");
        if (ret && ret.code === 0) {
          this.postTags = ret.data.tags;
          this.postPicture = ret.data.pics;
          this.categoryId = ret.data.categoryid;
          this.address = ret.data.address;
          this.starttime = ret.data.starttime;
          this.endtime = ret.data.endtime;
          this.qQNumber = ret.data.qq;
          this.weChatNum = ret.data.weixin;
        }
      });
    },
    deleteTag: function(indexTag) {
      let tagId = this.postTags[indexTag].id;
      this.deleteTagData(tagId);
    },
    deleteTagData(tagId) {
      this.$http.post(this.tagUrl, { id: tagId }).then(response => {
        const ret = JSON.parse(response.data || "[]");
        if (ret && ret.code === 0) {
          Toast("删除一个标签!");
          let id = this.$route.params.id;
          this.barView(id);
        } else {
          Toast("请求错误!");
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
.activityNav {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 503;
  height: 0.5rem;
  line-height: 0.5rem;
  width: 100%;
  background: #000000;
}
.activityNav .back {
  display: inline-block;
  width: 0.2rem;
  height: 0.2rem;
  background: url("../../assets/images/forum/community/icon-back.png") center center no-repeat;
  background-size: contain;
  margin-top: 0.14rem;
  margin-left: 0.05rem;
}
.activityNav .title {
  display: inline-block;
  width: 73%;
  height: 0.48rem;
  font-size: 0.2rem;
  text-align: center;
  color: #fff;
}
.activityNav .send {
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
/* 主页 */
.activityPage {
  width: 100%;
  position: absolute;
  top: 8.8%;
}
/* 分类选择 */
.activityPage .typeList {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
  /* vertical-align: middle; */
  font-size: 0.15rem;
}
.activityPage .typeList .left {
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
  background: url("~@/assets/images/forum/postactivity/types.png") center center no-repeat;
  background-size: contain;
}
.activityPage .typeList .right {
  display: inline-block;
  /* float: right; */
  margin-right: 0.1rem;
  color: #c0c0c0;
}
.goIcon {
  display: inline-block;
  /* float: right; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-left: 0.1rem;
  background: url("~@/assets/images/forum/postactivity/go.png") center center no-repeat;
  background-size: contain;
}
/* 开始时间 */
.activityPage .startTime {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
  /* vertical-align: middle; */
  font-size: 0.15rem;
}
.activityPage .startTime .left {
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
.activityPage .startTime .right {
  display: inline-block;
  /* float: right; */
  margin-right: 0.1rem;
  color: #c0c0c0;
}
.goIcon {
  display: inline-block;
  /* float: right; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-left: 0.1rem;
  background: url("~@/assets/images/forum/postactivity/go.png") center center no-repeat;
  background-size: contain;
}
/* 结束时间 */
.activityPage .endTime {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
  /* vertical-align: middle; */
  font-size: 0.15rem;
}
.activityPage .endTime .left {
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
.activityPage .endTime .right {
  display: inline-block;
  /* float: right; */
  margin-right: 0.1rem;
  color: #c0c0c0;
}
.goIcon {
  display: inline-block;
  /* float: right; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-left: 0.1rem;
  background: url("~@/assets/images/forum/postactivity/go.png") center center no-repeat;
  background-size: contain;
}
/* 活动地点 */
.activityPage .actPlace {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
  /* vertical-align: middle; */
  font-size: 0.15rem;
}
.activityPage .actPlace .left {
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
.activityPage .actPlace .right {
  display: inline-block;
  /* float: right; */
  margin-right: 0.1rem;
  color: #c0c0c0;
}
.goIcon {
  display: inline-block;
  /* float: right; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-left: 0.1rem;
  background: url("~@/assets/images/forum/postactivity/go.png") center center no-repeat;
  background-size: contain;
}
/* 活动标签 */
.activityPage .actLabel {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
  /* vertical-align: middle; */
  font-size: 0.15rem;
}
.activityPage .actLabel .left {
  display: inline-block;
}
.labelIcon {
  display: inline-block;
  /* float: left; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  background: url("~@/assets/images/forum/postactivity/label.png") center center no-repeat;
  background-size: contain;
}
.activityPage .actLabel .right {
  display: inline-block;
  /* float: right; */
  margin-right: 0.1rem;
  color: #c0c0c0;
}
.goIcon {
  display: inline-block;
  /* float: right; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-left: 0.1rem;
  background: url("~@/assets/images/forum/postactivity/go.png") center center no-repeat;
  background-size: contain;
}
/* 活动标签展示 */
.activityPage .labelList {
  display: block;
  margin-left: 2%;
}
.activityPage .labelList li {
  display: inline-block;
  position: relative;
  width: 0.8rem;
  height: 0.22rem;
  line-height: 0.22rem;
  margin-left: 0.05rem;
  border-radius: 3px;
  color: #fff;
  text-align: center;
}
.delLabelIcon {
  display: inline-block;
  position: absolute;
  right: -6px;
  top: -5px;
  width: 0.15rem;
  height: 0.15rem;
  background: url("~@/assets/images/forum/postactivity/deleteIcon.png") center center no-repeat;
  background-size: contain;
}
/* 联系方式 */
.activityPage .actContact {
  display: block;
  margin-left: 3%;
}
.activityPage .actContact .contChoose {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
}
.contactIcon {
  display: inline-block;
  /* float: left; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-right: 0.1rem;
  background: url("~@/assets/images/forum/postactivity/contact.png") center center no-repeat;
  background-size: contain;
}
.activityPage .actContact .left {
  display: inline-block;
  width: 45%;
  height: 0.5rem;
  line-height: 0.5rem;
  margin-left: 10%;
  vertical-align: middle;
  color: #c0c0c0;
}
.qqIcon {
  display: inline-block;
  /* float: left; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  background: url("~@/assets/images/forum/postactivity/qq.png") center center no-repeat;
  background-size: contain;
}
.activityPage .actContact .right {
  display: inline-block;
  /* float: right; */
  width: 40%;
  height: 0.5rem;
  line-height: 0.5rem;
  margin-right: 0.1rem;
  color: #c0c0c0;
}
.wechatIcon {
  display: inline-block;
  /* float: left; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  background: url("~@/assets/images/forum/postactivity/wechat.png") center center no-repeat;
  background-size: contain;
}
/* 标题 */
.activityPage .title {
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
.activityPage .content {
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
/* 发帖图片 */
.text {
  display: block;
  overflow: hidden;
  margin-top: 0.1rem;
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
.activityPicList {
  display: inline-block;
}
.activityPicList .index {
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: 90px;
  height: 100px;
  margin-left: 0.05rem;
  border: 1px solid #c0c0c0;
  border-radius: 4px;
}
.activityPicList .index .deleteIcon {
  display: inline-block;
  position: absolute;
  overflow: hidden;
  width: 0.2rem;
  height: 0.2rem;
  background: url("~@/assets/images/forum/postcommon/deleteIcon.png") center center no-repeat;
  background-size: contain;
}
.index img {
  display: inline-block;
  min-width: 100%;
  height: 100px;
}
.exist {
  display: block;
  position: absolute;
  top: 55%;
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