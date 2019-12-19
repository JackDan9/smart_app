<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">正在装修</span>
    </div>
    <div class="banner">
      <a onclick="javascript:history.go(-1)">
        <img src="~@/assets/images/wjs.jpg" />
      </a>
    </div>
    <tab :index="3" />
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config.js";

export default {
  components: {
    Error,
    Tab
  },
  data() {
    return {
      isLoading: false,
      isError: false,
      error: ""
    };
  }
};
</script>

<style scoped>
.mt45 {
  margin-top: 0.45rem;
}
.bgf {
  background: #ffffff;
  overflow: hidden;
  padding: 0.1rem 0;
}
.banner {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
}
.banner img {
  width: 100%;
}
</style>
