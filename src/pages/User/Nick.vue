<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">昵称</span>
      <span class="publish" v-on:click="updateUser()">保存</span>
    </div>
    <div class="ask pt45">
      <div class="text">
        <textarea name="nickname" id="nickname" cols="30" rows="12" placeholder ref="nickname">{{nickname}}</textarea>
      </div>
    </div>
  </div>
</template>
<script>
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config.js";
import { Toast } from "mint-ui";
import storage from "@/storage/storage";

export default {
  components: {
    Error,
    Tab
  },
  data() {
    return {
      isError: false,
      error: "",
      nickname: "",
      whoami: "user/whoami/",
      govUrl: "user/update/"
    };
  },
  beforeMount: function() {
    if (storage.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
          this.nickname = ret["nickname"];
          document.getElementById("nickname").focus();
        } else {
          this.$router.push("/login");
          return;
        }
      });
    } else {
      this.$router.push("/login");
      return;
    }
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    updateUser: function() {
      var nickname = this.$refs.nickname.value;
      this.getUpdate(nickname);
    },

    getUpdate(nickname) {
      this.$http.post(this.govUrl, { nickname: nickname }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("操作成功!");
            storage.setUserName(nickname);
            this.$router.push("/userset");
          } else {
            Toast(ret.msg);
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
        },
        response => {
          this.isError = true;
          this.error = "";
          if (callback) callback.call(this);
        }
      );
    }
  }
};
</script>
<style scoped>
.navTop .publish {
  height: 0.45rem;
  padding-right: 0.15rem;
  color: #ffffff;
  font-size: 0.15rem;
  line-height: 0.45rem;
}
.pt45 {
  padding-top: 0.45rem;
  overflow: hidden;
}
.ask {
  overflow: hidden;
}
.ask .text {
  overflow: hidden;
  padding: 0.15rem;
}
.ask .text textarea {
  width: 90%;
  padding: 5%;
  overflow: hidden;
  border: none;
  outline: none;
  background: #ffffff;
}
.ask .tips {
  padding: 0 0.15rem;
  overflow: hidden;
  color: #a5a5a5;
  font-size: 0.12rem;
}
</style>