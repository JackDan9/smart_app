<template>
  <div>
    <div class="navtop4">
      <i class="back" onclick="javascript:history.go(-1)"></i>
      <span>
        <img src="~@/assets/images/discount-t.png" class="w100" />
      </span>
      <div class="fr-btn">
        <i class="share"></i>
        <router-link :to="{path:'/user/',query:{tab:'hide'}}">
          <i class="people"></i>
        </router-link>
      </div>
    </div>
    <div class="discount-page">
      <div class="time">
        <ul>
          <li>
            <div class="p1">12:00</div>
            <div class="p2">已开抢</div>
            <div class="arr"></div>
          </li>
          <li>
            <div class="p1">13:00</div>
            <div class="p2">已开抢</div>
            <div class="arr"></div>
          </li>
          <li class="current">
            <div class="p1">15:00</div>
            <div class="p2">抢购进行中</div>
            <div class="arr"></div>
          </li>
          <li>
            <div class="p1">17:00</div>
            <div class="p2">即将开抢</div>
            <div class="arr"></div>
          </li>
          <li>
            <div class="p1">19:00</div>
            <div class="p2">即将开抢</div>
            <div class="arr"></div>
          </li>
        </ul>
      </div>
      <div class="nav2">
        <a>餐吧</a>
        <a>咖啡吧</a>
        <a>茶空间</a>
        <a>旅舍</a>
      </div>
      <div class="dis-list">
        <div class="t">
          <div class="fl">限时限量 疯狂抢购</div>
          <div class="fr">
            距离本场结束
            <span>01</span> :
            <span>11</span> :
            <span>53</span>
          </div>
        </div>
        <div class="con">
          <ul>
            <li>
              <div class="img">
                <img src="~@/assets/images/dist-pic.png" width="100" height="100" alt="Smart App" />
              </div>
              <div class="info">
                <p class="p1">TATA木门 简约时尚室内门</p>
                <p class="p2">比价双11 限时疯抢</p>
                <p class="p3">
                  ￥
                  <em>1299</em>
                  <del>￥5512</del>
                  <a>马上抢</a>
                </p>
                <div class="p4">
                  <span>可用鲸币4元</span>
                  <em>已抢30件</em>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.navtop4 {
  z-index: 123456;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  text-align: center;
  height: 0.45rem;
  line-height: 0.44rem;
  font-size: 0.18rem;
  color: #ffffff;
  background: #ffffff;
  box-shadow: #d2cfcf 0 1px 2px;
  border-bottom: 1px solid;
}
.navtop-orange {
  background: #ff6143;
}
.navtop4 i.back {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.4rem;
  height: 0.4rem;
  background: url("~@/assets/images/back-b.png") center center no-repeat;
  background-size: 0.1rem 0.18rem;
}
.navtop4 .fr-btn {
  position: absolute;
  right: 0.1rem;
  top: 0;
  height: 0.45rem;
  min-width: 0.9rem;
}
.navtop4 .fr-btn i {
  display: inline-block;
  width: 0.35rem;
  height: 0.45rem;
}
.navtop4 .fr-btn .people {
  background: url("~@/assets/images/peo-b.png") center center no-repeat;
  background-size: 0.22rem 0.22rem;
}
.navtop4 .fr-btn .red {
  background: url("~@/assets/images/sp-rd.png") center center no-repeat;
  background-size: 0.22rem 0.24rem;
}
.navtop4 .share {
  background: url("~@/assets/images/sha.png") center center no-repeat;
  background-size: 0.17rem 0.21rem;
}
.navtop4 span {
  display: inline-block;
  width: 1rem;
}
.discount-page {
  background: #f3f3f3;
  font-size: 0.14rem;
}
.discount-page .time {
  background: #30363c;
  height: 0.45rem;
  margin-top: 0.45rem;
  color: #eeeeee;
  text-align: center;
}
.discount-page .time li {
  position: relative;
  width: 20%;
  float: left;
  height: 0.45rem;
  color: #999;
}
.discount-page .time li .p1 {
  width: 100%;
  font-size: 0.16rem;
  margin-top: 0.07rem;
}
.discount-page .time li .p2 {
  width: 100%;
  font-size: 0.1rem;
  overflow: hidden;
}
.discount-page .time li.current {
  background: #fc353a;
  color: #ffffff;
}
.discount-page .time li.current .arr {
  position: absolute;
  top: 0.45rem;
  left: 50%;
  margin-left: -10px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #fc353a;
}
.discount-page .nav2 {
  padding: 0.1rem 0;
  overflow: hidden;
}
.discount-page .nav2 a {
  display: inline-block;
  width: 20%;
  margin-left: 3.3%;
  height: 0.4rem;
  line-height: 0.4rem;
  background: #ffffff;
  text-align: center;
  font-size: 0.14rem;
}
.dis-list {
  overflow: hidden;
  margin-top: 0.1rem;
  background: #ffffff;
}
.dis-list .t {
  padding: 0.1rem;
  overflow: hidden;
  border-left: #d8271c 3px solid;
  border-bottom: #eeeeee 1px solid;
}
.dis-list .t .fl {
  color: #d8271c;
}
.dis-list .t .fr {
  color: #787878;
}
.dis-list .con {
  overflow: hidden;
}
.dis-list .con li {
  overflow: hidden;
  padding: 0.15rem;
  border-bottom: #eeeeee 1px solid;
}
.dis-list .con li .img {
  width: 100px;
  float: left;
}
.dis-list .con li .info {
  margin-left: 110px;
  overflow: hidden;
  font-size: 14px;
}
.dis-list .con li .info .p2 {
  color: #fe353a;
}
.dis-list .con li .info .p3 {
  color: #fe353a;
  margin-top: 15px;
}
.dis-list .con li .info .p3 del {
  color: #787878;
}
.dis-list .con li .info .p3 em {
  font-size: 0.18rem;
  font-weight: bold;
}
.dis-list .con li .info .p3 a {
  display: inline-block;
  /* float: right; */
  padding: 0 10px;
  overflow: hidden;
  background: #fc353a;
  color: #ffffff;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  height: 25px;
  line-height: 24px;
}
.dis-list .con li .info .p4 {
  margin-top: 7px;
  overflow: hidden;
  width: 100%;
}
.dis-list .con li .info .p4 span {
  display: inline-block;
  padding: 0 15px;
  border-radius: 20px;
  background: #fc353a;
  color: #fff;
  border: #fe353a 1px solid;
  /* float: left; */
  font-size: 12px;
}
.dis-list .con li .info .p4 em {
  float: right;
  color: #fc353a;
}
</style>
