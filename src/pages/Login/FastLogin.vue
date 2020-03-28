<template>
  <div :style="{ height: bodyHeight + 'px' }">
    <div class="loginHome">
      <div class="navTop">
        <i class="iconfont navIcon" v-on:click="goBack()">&#xe609;</i>
        <span class="navCon">登录</span>
      </div>
      <div class="verifyStyle">
        <div class="phone">
          <i class="iconfont phoneIcon">&#xe622;</i>
          <input class="phoneInput" type="text" v-model.trim="mobile" placeholder="请输入手机号" />
        </div>
        <div class="verifyCode">
          <i class="iconfont verifyCodeIcon">&#xe760;</i>
          <input class="verifyInput" type="text" v-model.trim="mobileverify" placeholder="请输入验证码" />
          <button
            class="sendBtn"
            v-bind:disabled="isSending"
            v-on:click="sendVerify"
          >{{ verifyText }}</button>
        </div>
      </div>
      <div class="loginButton">
        <span class="loginButtonCon" v-bind:disabled="isSure" v-on:click="sure">确定</span>
      </div>
      <div class="reg">
        <span class="regCon">登录默认已阅读并同意</span>
        <span class="regProtocol" v-on:click="goProtocol()">注册协议</span>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import storage from "@/storage/storage";
export default {
  data() {
    return {
      mobile: "",
      mobileverify: "",
      genderIndex: 1,
      openid: "",
      verifyText: "发送验证码",
      isSending: false,
      isSure: false,
      whoami: "user/whoami/",
      loginUrl: "user/login2/",
      verifyUrl: "user/verify_mobile3/"
    };
  },
  beforeMount: function() {
    if (storage.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret.code === 0) {
          storage.getUserMessage(ret.username, ret.despass, storage.getAuthUid());
          this.$router.replace({ path: "/user" });
        }
      });
    }
  },
  mounted: function() {
    alert(document.documentElement.clientHeight);
    this.bodyHeight = document.documentElement.clientHeight;
    if (this.$route.query.openid) {
      this.openid = this.$route.query.openid;
    }
  },
  methods: {
    goBack: function() {
      this.$router.replace("/login/");
    },
    sendVerify: function(event) {
      event.preventDefault();
      if (this.mobile === "") {
        Toast("请输入手机号码");
        return;
      }
      const verify = /(^1[3456789][0-9]\d{8}$)/;
      if (!verify.test(this.mobile)) {
        Toast("手机号码格式不对");
      }
      this.isSending = true;
      this.$http.post(this.verifyUrl, { mobile: this.mobile }).then(
        response => {
          const ret = JSON.parse(response.data);
          if (ret.code === 0) {
            let count = 60;
            let tempObject = setInterval(() => {
              this.verifyText = count--;
              if (count <= 0) {
                this.isSending = false;
                this.verifyText = "发送验证码";
                clearInterval(tempObject);
              }
            }, 1000);
          } else {
            Toast(ret.msg);
            this.isSending = false;
          }
        },
        response => {
          this.isSending = false;
        }
      );
    },
    sure: function(event) {
      event.preventDefault();
      if (!this.mobile || !this.mobileverify) {
        Toast("参数不全");
        return;
      }
      this.isSure = true;
      const postData = {
        username: this.mobile,
        password: this.mobileverify,
        sex: this.genderIndex,
        openid: this.openid
      };
      this.$http.post(this.loginUrl, postData).then(
        response => {
          const ret = JSON.parse(response.data);
          if (ret["code"] === 0) {
            storage.setAuthIid(ret["token"]);
            Toast("检验成功");
            storage.getUserMessage(
              ret["username2"],
              ret["despass"],
              ret["token"]
            );
            this.$router.replace({ path: "/" });
          } else {
            Toast(ret.msg);
          }
          this.isSure = false;
        },
        response => {
          this.isSure = false;
        }
      );
    },
    goProtocol: function() {
      this.$router.replace("/protocol/");
    }
  }
}
</script>
<style scoped>
.navTop {
  background: rgba(0, 0, 0, 0);
}
.navTop .navIcon {
  color: rgba(236, 238, 238, 0.6);
  margin-left: 0.15rem;
}
.navTop .navCon {
  width: 80%;
  color: rgba(236, 238, 238, 0.6);
}
/* 主页 */
.loginHome {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: url("~@/assets/images/login/loginedBg.jpg") center center no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}
/* 登录风格 */
.verifyStyle {
  display: block;
  margin-top: 0.5rem;
}
.verifyStyle .phone {
  display: block;
  width: 90%;
  margin: 0.15rem 0.15rem;
  height: 0.5rem;
  line-height: 0.45rem;
  border-bottom: 1px solid #c0c0c0;
}
/*
.phoneIcon { display: inline-block; float: left; overflow: hidden; width: 0.25rem; height: 0.25rem; margin-top: 0.1rem; margin-left: 0.1rem; margin-right: 0.1rem; background: url("../../assets/images/login/phoneIcon.png") center center no-repeat; background-size: contain; }
*/
.phoneIcon {
  float: left;
  overflow: hidden;
  color: rgba(190, 198, 192, 0.6);
}
.phoneInput {
  display: inline-block;
  width: 60%;
  font-size: 0.16rem;
  outline: none;
  border: none;
  background: none;
  color: #ffffff;
}
.verifyStyle .verifyCode {
  display: block;
  width: 90%;
  margin: 0.15rem 0.15rem;
  height: 0.5rem;
  line-height: 0.45rem;
  border-bottom: 1px solid #c0c0c0;
}
/*
.verifyCodeIcon { display: inline-block; float: left; overflow: hidden; width: 0.25rem; height: 0.25rem; margin-top: 0.1rem; margin-left: 0.1rem; margin-right: 0.1rem; background: url("../../assets/images/login/verificateIcon.png") center center no-repeat; background-size: contain; }
*/
.verifyCodeIcon {
  float: left;
  overflow: hidden;
  color: rgba(190, 198, 192, 0.6);
}
.verifyInput {
  display: inline-block;
  width: 50%;
  font-size: 0.16rem;
  outline: none;
  border: none;
  background: none;
  color: #ffffff;
}
/* 验证码 */
.sendBtn {
  width: 30%;
  height: 0.45rem;
  background: none;
  outline: none;
  border: none;
  border-left: 1px solid #c0c0c0;
  padding-left: 0.06rem;
  font-size: 0.15rem;
  color: rgba(155, 160, 128, 0.6);
}
/* 登录 */
.loginHome .loginButton {
  display: block;
  width: 90%;
  margin: 0.15rem 0.15rem;
  height: 0.5rem;
  line-height: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 4px;
  background: rgba(242, 89, 33, 0.6);
  font-size: 0.2rem;
  text-align: center;
  color: rgba(250, 250, 250, 1);
  letter-spacing: 0.15rem;
}
.loginButtonCon {
  display: inline-block;
}
/* 暂不登录 */
.reg {
  display: block;
  position: absolute;
  bottom: 5%;
  width: 100%;
  margin-top: 0.2rem;
  text-align: center;
  color: rgba(250, 250, 250, 0.6);
  font-size: 0.14rem;
}
.reg .regCon {
  display: inline-block;
  font-size: 0.14rem;
}
.reg .regProtocol {
  display: inline-block;
  font-size: 0.14rem;
  color: rgba(250, 0, 0, 1);
}
</style>