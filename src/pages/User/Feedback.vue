<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">意见反馈</span>
      <div class="publish" v-on:click="addComplain()">发送</div>
    </div>
    <div class="ask pt45">
      <div class="text">
        <textarea
          name="contents"
          id="contents"
          cols="30"
          rows="12"
          placeholder="您的只言片语,[Smart App]随时聆听,因您而美好!~我们会及时给您回复。"
          ref="contents">
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
      whoami: "user/whoami/",
      govUrl: "complain/add/"
    };
  },

  beforeMount: function() {
    if (storage.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
          document.getElementById("contents").focus();
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

    addComplain: function() {
      var contents = this.$refs.contents.value;
      if (!contents) {
        Toast("请填写需要反馈的内容!");
        return;
      }
      this.getComplain(contents);
    },

    getComplain(contents) {
      this.$http.post(this.govUrl, { contents: contents }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("反馈成功,请耐心等待回复!");
            this.$router.push("/user");
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
  position: absolute;
  right: 0;
  top: 0;
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
