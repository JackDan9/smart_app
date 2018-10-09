<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">关于我们</span>
    </div>
    <div class="ask pt45">
      <div class="tips">
        <p class="tips_title">
            <i class="aboutTitle"></i>
            <i class="aboutRect"></i>
        </p>
        <p class="tips_content">
            <span class="content-first">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;智慧信阳便民服务平台是本地首家架设全城免费WIFI无缝覆盖的APP平台,该项目是信阳添翼网络科技有限公司与浉河区政府共同承办的智慧城市重点示范项目，未来不久便可实现整个市区无缝WIFI覆盖。</span>
            <span class="content-second">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;平台是集便民、购物、交流、服务于一体的新型O2O便民服务APP平台。既有线上购物同时又有线下实体店，支持到店服务。区别与其他平台的我们会精选出本地好玩、好物等优质的服务。</span>
            <span class="content-third">公关推广：xytywlkj@163.com </span>
            <span class="content-fourth">店铺合作：xytywlkj@163.com </span>
            <span class="content-fifth">微信公众号：智慧信阳便民服务平台</span>
            <span class="content-sixth">联系电话：0376-8163172</span>
        </p>
        <i class="logo-icon"></i>
      </div>
      <div class="tips2">
        <p>Copyright&copy;2016 <span v-on:click="seeVersion()">版本</span></p>
        <p>信阳添翼网络科技有限公司</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    seeVersion: function(){
      var share = {
         action: 'appVersion'
      }
      if(window.postMessage) window.postMessage(JSON.stringify(share),'*');
      return true
    }
  }
}
</script>
<style scoped>
.navTop{ z-index: 12345; }
.pt45{position: absolute;width:100%; height: 100%; top: 0; bottom: 0; background: url("../assets/images/about/aboutBg.jpg") center center no-repeat; background-size: 100% 102%; overflow:hidden;}
.ask{ overflow:hidden;}
.ask .text{ overflow:hidden; padding:0.15rem;}
.ask .text input{width:100%;padding:5%; overflow:hidden; border:none; outline:none; background:#ffffff;font-size:18px;}
.ask .text .cell_user{width:100%;padding:5%; overflow:hidden; border:none; outline:none; background:#ffffff;font-size:18px;}
.ask .tips{ margin: 0 auto; margin-top: 0.5rem; overflow:hidden; color:#ccffcc;}
.tips .tips_title{margin: 0 auto;height: 0.4rem; width: 1.8rem; text-align: center;padding-top:0.15rem;}
.tips .aboutRect {display: inline-block; width: 0.8rem; height: 0.05rem; background: url("../assets/images/about/aboutRect.jpg") center center no-repeat; background-size: 100% 100%;}
.tips .aboutTitle {display: inline-block; width: 1.79rem; height: 0.266rem; background: url("../assets/images/about/aboutUs.png") center center no-repeat; background-size: 70% 70%;}
.tips .tips_content{font-size:0.13rem; line-height: 0.22rem; margin: 20px auto; width: 85%;}
.tips .tips_content .content-first {display: inline-block;}
.tips .tips_content .content-second {display: inline-block;}
.tips .tips_content .content-third {display: inline-block; margin-top: 20px;}
.tips .tips_content .content-fourth {display: inline-block;}
.tips .tips_content .content-fifth {display: inline-block;}
.tips .tips_content .content-sixth {display: inline-block;}
.tips .logo-icon {position: absolute; left: 75%; bottom: 22%; width: 0.6rem; height: 0.6rem; display: inline-block; background: url(../assets/images/about/aboutLogo.png) center center no-repeat; background-size: 100% 100%;}
.ask .tips2{ overflow:hidden; color:#ccffff; font-size: 0.13rem;margin-top:10px;text-align:center;line-height: 0.22rem;}
</style>
