<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">设置</span>
    </div>
    <div class="ask pt45">
      <router-link :to="{path:'/feedback'}" class="mint-cell">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <div>
              <span class="cell_right">意见反馈</span>
            </div>
          </div>
        </div>
        <i class="mint-cell-allow-right"></i>
      </router-link>
      <router-link :to="{path:'/about'}" class="mint-cell">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <div>
              <span class="cell_right">关于我们</span>
            </div>
          </div>
        </div>
        <i class="mint-cell-allow-right"></i>
      </router-link>
      <a class="mint-cell" v-on:click="goAuthentication()">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <div>
              <span class="cell_right">专有无线上网认证</span>
            </div>
          </div>
        </div>
        <i class="mint-cell-allow-right"></i>
      </a>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import storage from "@/storage/storage";
export default {
  methods: {
    goAuthentication: function() {
      var share = {
        action: "verify",
        Authorization: "Xyapp " + storage.getAuthUid(),
        deviceWIFI: "http://117.158.161.250",
        url: "http://www.baidu.com?" + new Date().getTime()
      };
      if (window.postMessage) window.postMessage(JSON.stringify(share), "*");
      return true;
    }
  }
};
</script>
<style scoped>
.pt45 {
  padding-top: 0.45rem;
  overflow: hidden;
}
.ask {
  overflow: hidden;
}
.w60 {
  width: 40%;
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
}
</style>
