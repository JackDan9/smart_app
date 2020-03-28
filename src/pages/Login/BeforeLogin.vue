<template>
  <div>
    <div class="beforeLoginHome">
      <div class="loginStyle">
        <div class="weChat" v-on:click="weixinLogin()">
          <i class="iconfont weChatIcon">&#xe623;</i>
          <span class="weChatCons">微信登录</span>
        </div>
        <div class="fast" v-on:click="fastLogin()">
          <i class="iconfont fastIcon">&#xe61b;</i>
          <span class="fastCon">快速登录</span>
        </div>
      </div>
      <div class="prompt">
        <span class="promptCon" v-on:click="stroll">暂不登录，进入Smart App</span>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast, MessageBox } from "mint-ui";
import storage from "@/storage/storage";
export default {
  data() {
    return {
      username: "",
      password: "",
      openid: "",
      weChatUrl: "user/wechat/",
      whoami: "user/whoami/"
    };
  },
  beforeMount: function() {
    this.getData();
  },
  watch: {
    $route(to, from) {
      this.getData();
    }
  },
  methods: {
    fastLogin: function() {
      this.$router.replace("/fastlogin/");
    },
    weixinLogin: function() {
      var share = {
        action: "wechatLogin",
        url: window.location.href
      };
      if (window.postMessage) window.postMessage(JSON.stringify(share), "*");
      return true;
    },
    getData: function() {
      if (this.$route.query.openid) {
        this.$http
          .post(this.weChatUrl, { openid: this.$route.query.openid })
          .then(response => {
            const ret = JSON.parse(response.data);
            if (ret.code === 0) {
              storage.setAuthIid(ret.token);
              storage.setUserName(ret.username);
              storage.getUserMessage(ret.username2, ret.despass, ret.token);
              this.$router.replace("/user/");
            } else {
              this.openid = this.$route.query.openid;
              this.$router.replace({
                path:
                  "/phoneverify?openid=" +
                  this.$route.query.openid +
                  "&sex=" +
                  this.$route.query.sex +
                  "&nickname=" +
                  this.$route.query.nickname +
                  "&wx_picture=" +
                  this.$route.query.headimgurl
              });
            }
          });
      } else if (storage.getAuthUid()) {
        this.$http.get(this.whoami, {}).then(response => {
          const ret = JSON.parse(response.data);
          if (ret.code === 0) {
            storage.getUserMessage(ret.username, ret.despass, storage.getAuthUid());
            this.$router.replace({ path: "/user" });
          }
        });
      }
    },
    stroll: function() {
      this.$router.replace({ path: "/" });
    }
  }
};
</script>
<style scoped>
/* 主页 */
.beforeLoginHome {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url("~@/assets/images/login/loginBg.jpg") center center no-repeat;
  background-size: 100% 100%;
}
/* 登录风格 */
.loginStyle {
  display: block;
  margin-top: 140%;
}
.loginStyle .weChat {
  /* display: inline-block; */
  float: left;
  width: 45%;
  height: 0.45rem;
  margin-left: 0.1rem;
  border-radius: 4px;
  line-height: 0.45rem;
  background: #f5e8e0;
}
/*
.weChatIcon { display: inline-block; float: left; overflow: hidden; width: 0.25rem; height: 0.25rem; margin-top: 0.08rem; margin-left: 0.2rem; background: url("../../assets/images/login/weChatIcon.png") center center no-repeat; background-size: contain; }
*/
.weChatIcon {
  /* display: inline-block; */
  float: left;
  margin-left: 0.25rem;
  color: #45c45d;
}
.weChatCons {
  display: inline-block;
  margin-left: 0.05rem;
  font-size: 0.16rem;
}
.loginStyle .fast {
  display: inline-block;
  width: 45%;
  height: 0.45rem;
  margin-left: 0.08rem;
  border-radius: 4px;
  line-height: 0.45rem;
  background: #ff4b0f;
}
/*
.fastIcon { display: inline-block; float: left; overflow: hidden; width: 0.25rem; height: 0.25rem; margin-top: 0.08rem; margin-left: 0.2rem; background: url("../../assets/images/login/appIcon.png") center center no-repeat; background-size: contain; }
*/
.fastIcon {
  /* display: inline-block; */
  float: left;
  overflow: hidden;
  margin-left: 0.25rem;
  color: #ffffff;
}
.fastCon {
  display: inline-block;
  margin-left: 0.05rem;
  font-size: 0.16rem;
  color: #fff;
}
/* 暂不登录 */
.prompt {
  display: block;
  width: 100%;
  margin-top: 0.2rem;
  text-align: center;
  color: rgba(250, 250, 250, 0.6);
  font-size: 0.14rem;
}
.prompt .promptCon {
  display: inline-block;
}
</style>