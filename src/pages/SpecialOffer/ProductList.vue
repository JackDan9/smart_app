<template>
  <div>
    <div class="productListNav">
      <div class="nav">
        <i class="iconfont back" v-on:click="goBack()">&#xe609;</i>
        <div class="tab">
          <a v-bind:class="[isClassActive ? 'current' : '']" v-on:click="addChange('con1')">抢购</a>
          <a v-bind:class="[isClassActive ? '' : 'current']" v-on:click="addChange('con2')">拼单</a>
        </div>
      </div>
    </div>
    <ul
      v-bind:class="[isClassActive ? 'weekDaysList' : 'weekDaysListCurr']"
      id="weekDayList"
      v-infinite-scroll="weekDayScroll"
    >
      <li
        v-for="(item, index) in date"
        :key="index"
        v-bind:class="[type === index ? 'weekDaysCurr' : 'weekDays']"
        v-on:click="current(index)"
      >
        <span class="days">{{item.d}}</span>
        <span class="label">{{item.n}}</span>
        <i v-bind:class="[type === index ? 'triangleCurr' : 'triangle']"></i>
      </li>
    </ul>
    <div v-bind:class="[isClassActive ? 'productListPage' : 'productListPageCurr']">
      <div v-for="(item, index) in discount" :key="index">
        <div id="con" class="productListBox" v-on:click="productDetail(item.id, index)">
          <li class="productListInfo">
            <div class="left">
              <img v-bind:src="fullUrl(item.picture)+'!640.398'" alt="Welcome to Smart App!" />
            </div>
            <div class="right">
              <span class="companyTitle">{{item.name}}</span>
              <span class="startTime">{{item.note}}</span>
              <p class="companyInfo">
                <span class="purchased">
                  已抢
                  <i>{{item.ms_num}}</i>件
                </span>
                <span class="inventory">
                  仅剩
                  <i>{{item.num}}</i>件
                </span>
              </p>
              <div class="productInfo">
                <div class="priceInfo">
                  <span class="price">
                    <i class="iconfont moneyIcon">&#xe600;</i>
                    <i class="moneyNum">{{parseFloat(item.ms_price)}}</i>
                  </span>
                  <span class="oldPrice">
                    <i class="iconfont oldMoneyIcon">&#xe600;</i>
                    <i>{{parseFloat(item.price1)}}</i>
                  </span>
                </div>
                <div
                  v-bind:class="[(type == 2 && time >= item.starttime && item.num > 0) ? 'buyInfo' : 'buyInfoOther']"
                >
                  <span>{{content[type]}}</span>
                </div>
              </div>
            </div>
          </li>
        </div>
      </div>
    </div>
    <div id="toTop" v-on:click="toTop" v-bind:class="[ isClassTop > 0  ? '' : 'dn']">
      <img src="~@/assets/images/toTop.png" />
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Store from "@/store/store";
import Config from "@/config/config";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      isClassActive: 1,
      isClassTop: 0,
      isLoading: false,
      isError: false,
      error: "",
      date: [],
      type: 2,
      discount: [],
      content: ["已结束", "已结束", "马上抢购", "即将开场", "即将开抢"],
      time: "",
      viewListUrl: "discount/viewlist/",
      whoami: "user/whoami/"
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },
    goBack: function() {
      Store.setIntoPage(0);
      this.$router.push("/");
    },
    addChange: function(con) {
      this.isClassActive = con == "con1" ? 1 : 0;
    },
    current: function(index) {
      this.type = index;
      this.getData();
    },
    productDetail: function(id, index) {
      this.$router.replace("/productdetail/" + id);
    },
    getData() {
      this.$http.post(this.viewListUrl, { type: this.type }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.date = ret.data.date;
            this.discount = ret.data.discount;
            let date = new Date();
            let time = date.getTime() / 1000;
            this.time = time;
          } else {
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
          if (typeof callback === "function") {
            callback.call(this);
          }
        },
        response => {
          this.isError = true;
          this.error = "";
          if (typeof callback === "function") {
            callback.call(this);
          }
        }
      );
    },
    toTop: function() {
      document.getElementById("weekDayList").scrollIntoView;
    },
    winScroll: function() {
      this.isClassTop = document.body.scrollTop > 100 ? 1 : 0;
    },
    weekDayScroll() {
      document.addEventListener("scroll", this.winScroll(), false);
    }
  }
};
</script>
<style scoped>
.productListNav {
  position: relative;
  z-index: 503;
}
.productListNav .nav {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 0.45rem;
  line-height: 0.45rem;
  z-index: 503;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  background: red;
  overflow: hidden;
}
.productListNav .back {
  color: #fff;
  float: left;
  overflow: hidden;
  margin-left: 0.1rem;
}
.nav .tab {
  position: absolute;
  left: 50%;
  bottom: 2px;
  margin-left: -0.6rem;
  width: 1.2rem;
  height: 0.42rem;
  line-height: 0.42rem;
  text-align: center;
}
.nav .tab a {
  color: #ffffff;
  display: inline-block;
  width: 0.5rem;
  line-height: 0.42rem;
  font-size: 0.16rem;
  letter-spacing: 0.005rem;
}
.nav .tab .current {
  border-bottom: #ffffff 2px solid;
  letter-spacing: 0.005rem;
}
/* 星期数 */
.weekDaysList {
  display: block;
  position: fixed;
  top: 7.8%;
  z-index: 503;
  width: 100%;
  height: 0.55rem;
  background: #000000;
  font-size: 0;
}
.weekDaysListCurr {
  display: none;
}
.weekDaysCurr {
  display: inline-block;
  position: relative;
  width: 20%;
  height: 100%;
  color: #fff;
  background: red;
}
.weekDays {
  display: inline-block;
  width: 20%;
  height: 100%;
  color: #c0c0c0;
}
.days {
  display: inline-block;
  width: 100%;
  margin-top: 0.1rem;
  font-size: 0.16rem;
  text-align: center;
  letter-spacing: 0.005rem;
}
.label {
  display: inline-block;
  width: 100%;
  text-align: center;
  font-size: 0.12rem;
  letter-spacing: 0.005rem;
}
.triangleCurr {
  display: block;
  position: absolute;
  top: 100%;
  left: 33.5%;
  overflow: hidden;
  width: 0;
  height: 0;
  font-size: 0;
  line-height: 0;
  border-bottom: 8px solid rgba(0, 0, 0, 0);
  border-top: 8px solid red;
  border-left: 8px solid rgba(0, 0, 0, 0);
  border-right: 8px solid rgba(0, 0, 0, 0);
}
.triangle {
  display: none;
}
/* 产品列表页 */
.productListPage {
  display: block;
  background: #fff;
  padding-top: 1rem;
}
.productListPageCurr {
  display: none;
}
.productListPage .productListBox {
  display: block;
}
.productListInfo {
  display: block;
  height: auto;
  padding: 0 0.05rem;
  padding-top: 0.15rem;
  padding-bottom: 0.05rem;
  border-bottom: 1px solid #eeeeee;
}
.productListInfo .left {
  display: inline-block;
  overflow: hidden;
  /* float: left; */
  width: 37%;
  height: 1rem;
  line-height: 0.8rem;
  border-radius: 2px;
}
.productListInfo .left img {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.productListInfo .right {
  display: block;
  padding-left: 38.5%;
}
.companyTitle {
  display: inline-block;
  overflow: hidden;
  width: 103%;
  height: 0.22rem;
  line-height: 0.22rem;
  font-size: 0.15rem;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.startTime {
  display: block;
  height: 0.22rem;
  line-height: 0.22rem;
  font-size: 0.14rem;
}
.companyInfo {
  display: block;
  font-size: 0.12rem;
}
.companyInfo .purchased {
  display: inline-block;
  width: 50%;
  text-align: left;
}
.companyInfo .inventory {
  display: inline-block;
  width: 48%;
  text-align: right;
}
.inventory i {
  font-style: normal;
}
.productInfo {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
}
.productInfo .priceInfo {
  display: inline-block;
  overflow: hidden;
  /* float: left; */
  width: 60%;
}
.productInfo .priceInfo .price {
  display: inline-block;
  font-size: 0;
  font-weight: bold;
  color: red;
}
.price .moneyIcon {
  font-family: -webkit-body;
  font-size: 0.12rem;
}
.price .moneyNum {
  font-family: -webkit-body;
  font-size: 0.2rem;
}
.productInfo .priceInfo .oldPrice {
  display: inline-block;
  font-size: 0.12rem;
  text-decoration: line-through;
}
.oldPrice .oldMoneyIcon {
  font-size: 0.12rem;
}
.buyInfo {
  display: inline-block;
  width: 36%;
  height: 0.25rem;
  line-height: 0.25rem;
  border-radius: 2px;
  text-align: center;
  color: #fff;
  background: red;
}
.buyInfoOther {
  display: inline-block;
  width: 36%;
  height: 0.25rem;
  line-height: 0.25rem;
  border-radius: 2px;
  text-align: center;
  color: #fff;
  background: #c0c0c0;
}
/* 回到顶部 */
#toTop {
  position: fixed;
  bottom: 20%;
  right: 4%;
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 0.38rem;
  text-align: center;
}
#toTop img {
  width: 0.38rem;
  margin-top: 0.08rem;
}
</style>