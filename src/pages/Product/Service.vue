<template>
  <div class="page">
    <ul>
      <li>交水费</li>
      <li>交电费</li>
      <button v-on:click="triggerWin">触发弹出</button>
      <li>上门服务</li>
      <li>本地电话</li>
      <li>政务公开</li>
      <li>人生乐趣</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  methods: {
    triggerWin: function(event) {
      this.$router.replace({ path: "/service#switch" });
      setTimeout(() => this.$router.replace({ path: "/service" }), 1000);
      //if(window.WebViewBridge) window.WebViewBridge.send( "just do it" )
      return true;
    }
  }
};
</script>

<style>
</style>
