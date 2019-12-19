<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">邮箱</span>
      <div class="publish" v-on:click="updateUser()">保存</div>
    </div>
    <div class="ask pt45">
      <div class="text">
        <textarea 
          name="email" 
          id="email" 
          cols="30" 
          rows="12" 
          placeholder 
          ref="email">
          {{email}}
        </textarea>
      </div>
    </div>
  </div>
</template>

<script>
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config";
import { Toast } from "mint-ui";
import Store from "@/store/store";

export default {
  components: {
    Error,
    Tab
  },
  data() {
    return {
      isError: false,
      error: "",
      email: "",
      whoami: "user/whoami/",
      govUrl: "user/update/"
    };
  },

  beforeMount: function() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
          this.email = ret["email"];
          document.getElementById("email").focus();
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
      var email = this.$refs.email.value;
      this.getUpdate(email);
    },

    getUpdate(email) {
      this.$http.post(this.govUrl, { email: email }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("操作成功!");
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
