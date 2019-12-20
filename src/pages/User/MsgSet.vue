<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">消息提醒设置</span>
    </div>
    <div class="ask pt45">
      <a class="mint-cell">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <h2 class="page-title">通知提醒</h2>
            <span class="mint-cell-text">点此查看折扣,店铺推荐等信息</span>
          </div>
          <div class="mint-cell-value">
            <label class="mint-switch">
              <input type="checkbox" class="mint-switch-input" />
              <span class="mint-switch-core"></span>
              <div class="mint-switch-label"></div>
            </label>
          </div>
        </div>
        <div class="mint-cell-right"></div>
      </a>
      <a class="mint-cell">
        <div class="mint-cell-left"></div>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <h2 class="page-title">提问互动</h2>
            <span class="mint-cell-text">点此查看您的评价/提问等互动消息</span>
          </div>
          <div class="mint-cell-value">
            <label class="mint-switch">
              <input type="checkbox" class="mint-switch-input" />
              <span class="mint-switch-core"></span>
              <div class="mint-switch-label"></div>
            </label>
          </div>
        </div>
        <div class="mint-cell-right"></div>
      </a>
    </div>
  </div>
</template>
<script>
import { Toast, MessageBox } from "mint-ui";
import Config from "@/config/config";
import Store from "@/store/store";
export default {
  data() {
    return {
      whoami: "user/whoami/"
    };
  },
  beforeMount: function() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
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

    defaultPicUrl: function() {
      return Config.defaultPic;
    }
  }
};
</script>
<style scoped>
.pt45 {
  padding-top: 0.65rem;
  overflow: hidden;
  padding-top: 0.45rem;
}
.ask {
  overflow: hidden;
}
.w60 {
  border-radius: 0.8rem;
  width: 0.8rem;
  height: 0.8rem;
}
.mint-cell-title {
  line-height: 50px;
}
.cell_right {
  font-size: 20px;
}
.cell_ft {
  text-align: right;
  color: #888;
  margin-right: 40px;
  float: right;
  width: 250px;
}
.btn-wrap {
  display: -webkit-box;
  overflow: hidden;
  margin: 5% 15%;
}
.btn-wrap .sub {
  width: 100%;
  height: 55px;
  line-height: 55px;
  margin-top: 15px;
  border-radius: 5px;
  background: #f35632;
  text-align: center;
}
.btn-wrap .sub span {
  color: #fff;
  margin-left: 5px;
  font-size: 15px;
}
.mint-cell-value {
  margin-right: 0.2rem;
}
.mint-switch-input:checked,
.mint-switch-core {
  border-color: #fa550f;
  background-color: #fa550f;
}
</style>
