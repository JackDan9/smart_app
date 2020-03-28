<template>
  <div class="page-height">
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">Smart App连免费Wi-Fi</span>
    </div>

    <div class="ad-pic">
      <img src="~@/assets/images/Image-sure.jpg" class="w100" alt />
    </div>
    
    <div class="connect">
      <div class="logo">
        <img src="~@/assets/images/prologo.png" class="w100" />
      </div>
      <div class="tips">如您已安装Smart App，请点击</div>
      <div class="start-btn">启动Wi-Fi</div>
    </div>
    
    <div class="bot-box">
      <div class="tips2">只需下载一次 ，即可全城免费蹭网</div>
      <div class="red-btn">免费全城蹭网</div>
      <div class="copy">
        Smart App便民服务平台
        <em>浉河区政府示范项目</em>
      </div>
    </div>
  </div>
  
</template>

<script>
  export default {
    data() {
      return {};
    },
    mounted: () => {}
  };
</script>

<style scoped>
  .page-height {
    background: url("~@/assets/images/free-bodybg.png") top center no-repeat;
    background-size: 100% 100%;
    position: relative;
  }
  .connect {
    position: relative;
    font-size: 0.16rem;
  }
  .connect .logo {
    position: absolute;
    left: 50%;
    width: 0.8rem;
    margin-left: -0.4rem;
    top: -0.4rem;
  }
  .connect .tips {
    color: #ababaa;
    text-align: center;
    padding-top: 0.5rem;
    overflow: hidden;
  }
  .start-btn {
    width: 90%;
    height: 0.42rem;
    margin: auto;
    margin-top: 0.2rem;
    border: #9c9b9c 2px solid;
    border-radius: 0.42rem;
    text-align: center;
    line-height: 0.4rem;
    color: #ffffff;
  }
  .bot-box {
    position: relative;
    width: 100%;
    font-size: 0.14rem;
  }
  .bot-box .tips2 {
    color: #ababaa;
    text-align: center;
    overflow: hidden;
  }
  .bot-box .red-btn {
    margin-top: 0.1rem;
    width: 100%;
    height: 0.5rem;
    text-align: center;
    line-height: 0.5rem;
    color: #ffffff;
    background: #ff3366;
    font-size: 0.18rem;
  }
  .bot-box .copy {
    padding: 0.18rem 0;
    overflow: hidden;
    text-align: center;
    color: #ababaa;
  }
  .bot-box .copy em {
    color: #ffffff;
  }
  @media screen and (min-height: 450px) {
    .bot-box {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
    }
  }
  @media screen and (max-height: 450px) {
    .page-height {
      height: auto !important;
    }
  }
</style>
