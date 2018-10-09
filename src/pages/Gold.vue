<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">鲸豆说明</span>
    </div>
    <div class="goldPage">
      <div class="notice">
        <span class="cell_left">鲸豆:</span>
        <span class="cell_right">智慧信阳虚拟货币</span>
      </div>
      <div class="notice">
        <div class="txt">得到方法:</div>
      </div>
      <div class="tips">
        <p>日常平台消费返还(相当一定比例的现金),或者日常任务得到.</p>
      </div>
      <div class="notice">
        <div class="txt">用处:</div>
      </div>
      <div class="tips">
        <p>一.任何合作商家消费抵现.</p>
        <p>二.日常生活缴费抵现.</p>
        <p>三.合作便利商店商品可以免费换商品.</p>
      </div>
      <div class="notice">
        <div class="txt">未来希望实现的是:乘坐公交车可以抵现</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.goldPage{ overflow:hidden; padding-top:0.45rem; line-height: 0.26rem; }
.goldPage .text{ overflow:hidden; padding:0.15rem;}
.goldPage .text textarea{ width:90%; padding:5%; overflow:hidden; border:none; outline:none; background:#ffffff;}
.goldPage .tips{ padding:0 0.2rem; overflow:hidden; color:#a5a5a5; font-size: 0.16rem;}
.notice {overflow: hidden; background: #fff;font-size: 0.16rem; color: #2C2929;margin-top:0.1rem;}
.notice .txt {margin-left: 0.1rem; padding-top: 2px; font-size: 0.18rem;}
.cell_left{ margin-left: 0.1rem; font-size: 0.18rem; }
.cell_right{ color: #a5a5a5; font-size: 0.16rem; }
</style>
