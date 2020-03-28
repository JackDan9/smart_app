<template>
  <div>
    <div class="page-topnav">
      <div class="navTop">
        <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
        <span class="navCon">订单</span>
      </div>
    </div>
    <div class="page-fun-detail">
      <div class="banner">
        <div class="productInfo">
          <img :src="orderBg" />
          <p class="payLabel">
            <a v-bind:class="[ this.payment.state != 3 ? '' : 'dn']" v-on:click="addPay()">
              <img :src="payImg" />
            </a>
            <img v-bind:class="[ this.payment.state == 3 ? '' : 'dn' ]" :src="payImg" />
          </p>
        </div>
      </div>
      <div class="typeName">
        <span class="typeTitle">{{typeName}}</span>
      </div>
      <div class="olist">
        <div class="orderProInfo">
          <ul>
            <li class="orderProInfoList">
              <router-link
                v-bind:class="this.type == 1 ? '': 'dn'"
                :to="{path:'/company/'+company['id']}"
                v-if="type == 1"
              >
                <div class="left">
                  <img
                    v-bind:class="[type == 3 ? '' : 'dn']"
                    v-bind:src="fullUrl(showProducts.picture) + '!640.398'"
                    alt="Welcome to Smart App!"
                  />
                </div>
                <div class="right">
                  <p class="productTitle">
                    <span class="productCon">{{showProducts.name}}</span>
                    <span v-bind:class="[this.type == 1 ? 'productNum' : 'dn']">
                      <i class="productIcon">*</i>
                      <span class="num">{{showProducts.num}}</span>
                    </span>
                    <span v-bind:class="[this.type == 3 ? 'productNum' : 'dn']">
                      <i class="productIcon">*</i>
                      <span class="num">{{showProducts.contains_num}}</span>
                    </span>
                  </p>
                  <p class="discountInfo">
                    <span class="discountCon">{{typeCon}}</span>
                    <span v-bind:class="[type == 1 ? 'priceInfo' : 'dn']">
                      <span class="oldPrice">
                        <i class="iconfont oldMoneyIcon">&#xe600;</i>
                        <span>{{parseFloat(showProducts.price1)}}</span>
                      </span>
                      <span class="price">
                        <i class="iconfont moneyIcon">&#xe600;</i>
                        <span class="moneyNum">{{parseFloat(showProducts.price)}}</span>
                      </span>
                    </span>
                    <span v-bind:class="[type == 3 ? 'priceInfo' : 'dn']">
                      <span class="oldPrice">
                        <i class="iconfont oldMoneyIcon">&#xe600;</i>
                        <span>{{parseFloat(showProducts.price1)}}</span>
                      </span>
                      <span class="price">
                        <i class="iconfont moneyIcon">&#xe600;</i>
                        <span class="moneyNum">{{parseFloat(showProducts.ms_price)}}</span>
                      </span>
                    </span>
                  </p>
                  <p class="goldInfo">
                    <span class="goldCon">鲸豆抵现</span>
                    <span class="goldPrice">
                      <i class="minus">-</i>
                      <i class="iconfont moneyIcon">&#xe600;</i>
                      <span class="goldNum">{{payment['gold']}}</span>
                    </span>
                  </p>
                  <p class="deliverInfo">
                    <span class="deliverCon">配送费</span>
                    <span class="deliverFee">
                      <i class="iconfont moneyIcon">&#xe600;</i>
                      <span class="deliverNum">{{payment['deliver_fee']}}</span>
                    </span>
                  </p>
                  <p class="sendGold">
                    <span class="sendCon">消费赠送鲸豆</span>
                    <span class="sendPrice">
                      <span class="sendNum">{{parseFloat(payment['u_gold'])}}</span>
                    </span>
                  </p>
                </div>
              </router-link>
              <router-link
                v-bind:class="[type == 3 ? '' : 'dn']"
                :to="{path:'/productdetail/'+showProducts['id']}"
                v-if="type == 3"
              >
                <div class="left">
                  <img
                    v-bind:class="[type == 3 ? '' : 'dn']"
                    v-bind:src="fullUrl(showProducts.picture) + '!640.398'"
                    alt="Welcome to Smart App!"
                  />
                </div>
                <div class="right">
                  <p class="productTitle">
                    <span class="productCon">{{showProducts.name}}</span>
                    <span v-bind:class="[this.type == 1 ? 'productNum' : 'dn']">
                      <i class="productIcon">*</i>
                      <span class="num">{{showProducts.num}}</span>
                    </span>
                    <span v-bind:class="[this.type == 3 ? 'productNum' : 'dn']">
                      <i class="productIcon">*</i>
                      <span class="num">{{showProducts.contains_num}}</span>
                    </span>
                  </p>
                  <p class="discountInfo">
                    <span class="discountCon">{{typeCon}}</span>
                    <span v-bind:class="[type == 1 ? 'priceInfo' : 'dn']">
                      <span class="oldPrice">
                        <i class="iconfont oldMoneyIcon">&#xe600;</i>
                        <span>{{parseFloat(showProducts.price1)}}</span>
                      </span>
                      <span class="price">
                        <i class="iconfont moneyIcon">&#xe600;</i>
                        <span class="moneyNum">{{parseFloat(showProducts.price)}}</span>
                      </span>
                    </span>
                    <span v-bind:class="[type == 3 ? 'priceInfo' : 'dn']">
                      <span class="oldPrice">
                        <i class="iconfont oldMoneyIcon">&#xe600;</i>
                        <span>{{parseFloat(showProducts.price1)}}</span>
                      </span>
                      <span class="price">
                        <i class="iconfont moneyIcon">&#xe600;</i>
                        <span class="moneyNum">{{parseFloat(showProducts.ms_price)}}</span>
                      </span>
                    </span>
                  </p>
                  <p class="goldInfo">
                    <span class="goldCon">鲸豆抵现</span>
                    <span class="goldPrice">
                      <i class="minus">-</i>
                      <i class="iconfont moneyIcon">&#xe600;</i>
                      <span class="goldNum">{{payment['gold']}}</span>
                    </span>
                  </p>
                  <p class="deliverInfo">
                    <span class="deliverCon">配送费</span>
                    <span class="deliverFee">
                      <i class="iconfont moneyIcon">&#xe600;</i>
                      <span class="deliverNum">{{payment['deliver_fee']}}</span>
                    </span>
                  </p>
                  <p class="sendGold">
                    <span class="sendCon">消费赠送鲸豆</span>
                    <span class="sendPrice">
                      <span class="sendNum">{{parseFloat(payment['u_gold']) || 0}}</span>
                    </span>
                  </p>
                </div>
              </router-link>
            </li>
          </ul>
          <div v-bind:class="[payment['state'] < 2  ? 'totalFee' : 'dn']">
            <span class="totalFeeTitle">应付</span>
            <span class="totalFeeCon">
              <i class="iconfont moneyIcon">&#xe600;</i>
              <span class="totalFeeNum">{{parseFloat(payment['totalfee'])}}</span>
            </span>
          </div>
          <div v-bind:class="[payment['state'] > 1  ? 'totalFee' : 'dn']">
            <span class="totalFeeTitle">实付</span>
            <span class="totalFeeCon">
              <i class="iconfont moneyIcon">&#xe600;</i>
              <span class="totalFeeNum">{{parseFloat(payment['totalfee'])}}</span>
            </span>
          </div>
          <div v-bind:class="[this.payment.uaddress ? 'addressInfo' : 'dn']">
            <span class="addressTitle">收获地址</span>
            <span class="addressCon">{{payment.uaddress}}</span>
          </div>
          <div class="noteInfo">
            <span class="noteTitle">备注</span>
            <span class="noteCon">{{payment.note || '无'}}</span>
          </div>
        </div>
      </div>
      <div class="gray-line"></div>
      <div class="order-info">
        <ul>
          <li>
            <span class="t">订单信息</span>
          </li>
          <li>订单号：{{payment['outkey']}}</li>
          <li>下单时间：{{payment['addtime']}}</li>
          <li>支付时间：{{payment['paytime']}}</li>
        </ul>
        <div
          class="del-btn"
          v-bind:class="[ payment['state']== 3 || payment['state']== -1 ? '' : 'dn']"
        >
          <div class="left">
            <a
              href="javascript:;"
              onclick="easemobim.bind({configId: '2434a302-9b3f-41de-b69d-8c8ed718e1a5'})"
            >
              <i class="serviceIcon"></i>
              <span class="serviceCon">联系客服</span>
            </a>
          </div>
          <div v-bind:class="[this.type == 1 ? 'right' : 'dn']">
            <router-link :to="{path:'/company/'+company['id']}">
              <span class="first">再来一单</span>
            </router-link>
            <span v-on:click="del()" class="second">删除订单</span>
          </div>
          <div v-bind:class="[this.type == 3 ? 'right' : 'dn']">
            <router-link :to="{path:'/productdetail/'+showProducts['proid']}">
              <span class="first">再来一单</span>
            </router-link>
            <span v-on:click="del()" class="second">删除订单</span>
          </div>
        </div>
        <div class="del-btn" v-bind:class="[payment['state'] == 1  ? '' : 'dn']">
          <div class="left">
            <a
              href="javascript:;"
              onclick="easemobim.bind({configId: '2434a302-9b3f-41de-b69d-8c8ed718e1a5'})"
            >
              <i class="serviceIcon"></i>
              <span class="serviceCon">联系客服</span>
            </a>
          </div>
          <div class="right">
            <span v-on:click="close()" class="first">关闭订单</span>
            <span v-on:click="addPay()" class="second">去付款</span>
          </div>
        </div>
        <div class="del-btn" v-bind:class="[ payment['state']== 2  ? '' : 'dn']">
          <div class="left">
            <a
              href="javascript:;"
              onclick="easemobim.bind({configId: '2434a302-9b3f-41de-b69d-8c8ed718e1a5'})"
            >
              <i class="serviceIcon"></i>
              <span class="serviceCon">联系客服</span>
            </a>
          </div>
          <div class="right">
            <span v-on:click="refundPay()" class="second">退款</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import orderBg from "@/assets/images/SpecialOffer/offerOrder/orderBg.jpg";
import noPay from "@/assets/images/SpecialOffer/offerOrder/noPay.png";
import Pay from "@/assets/images/SpecialOffer/offerOrder/pay.png";
import Config from "@/config/config.js";
import storage from "@/storage/storage.js";
import { Toast } from "mint-ui";
export default {
  components: {
    Error
  },
  data() {
    return {
      payment: [],
      company: [],
      products: [],
      discounts: [],
      showProducts: [],
      typeCon: "",
      isLoading: false,
      isError: false,
      error: "",
      orderBg: orderBg,
      noPay: noPay,
      pay: Pay,
      payImg: "",
      type: "",
      typeName: "",
      whoami: "user/whoami/",
      outkeyUrl: "payment/outkey/",
      delUrl: "payment/del/",
      closeUrl: "payment/close/",
      refundUrl: "payment/refund/",
      viewUrl: "payment/viewone/"
    };
  },
  mounted() {
    if (storage.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
          const id = +this.$route.params.id;
          if (!id) {
            this.isError = true;
            this.error = "参数错误";
          } else {
            this.isLoading = true;
            this.getData();
          }
        } else {
          this.$router.replace({ path: "/login" });
        }
      });
    } else {
      this.$router.replace({ path: "/login" });
    }
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },
    del: function() {
      this.$http
        .post(this.delUrl, { id: this.$route.params.id })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret) {
            if (ret.code === 0) {
              Toast("删除成功");
              this.$router.push("/orderlist/");
            } else {
              Toast("删除失败");
            }
          }
        });
    },

    close: function() {
      this.$http
        .post(this.closeUrl, { id: this.$route.params.id })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret) {
            if (ret.code === 0) {
              Toast("订单关闭");
              this.$router.push("/orderlist/");
            } else {
              Toast("其他原因不能关闭");
            }
          }
        });
    },

    addPay: function() {
      this.$http
        .post(this.outkeyUrl, { id: this.$route.params.id })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret) {
            if (ret.code === 0) {
              this.$router.push("/pay/" + this.$route.params.id);
            } else if (ret.code === 1 || ret.code === 3) {
              Toast("订单参数错误");
            } else if (ret.code === 2) {
              this.$router.replace({ path: "/login" });
            }
          }
        });
    },

    refundPay: function() {
      this.$http
        .post(this.refundUrl, { id: this.$route.params.id })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret) {
            if (ret.code === 0) {
              Toast("退款已经提交,等待客服处理");
              this.$router.push("/orderlist/");
            } else {
              Toast("退款失败");
            }
          }
        });
    },
    mapLink: function(lat, lng, name, address) {
      var map = {
        action: "locMap",
        lat: lat,
        lng: lng,
        address: address,
        storageName: name
      };
      if (window.postMessage) window.postMessage(JSON.stringify(map), "*");
      return true;
    },
    getData(callback) {
      this.$http.post(this.viewUrl, { id: this.$route.params.id }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.payment = ret["data"]["payment"];
            this.company = ret["data"]["company"];
            this.type = ret["data"].type;
            if (this.type == 1) {
              this.showProducts = ret["data"]["product"][0];
              this.typeName = "店铺商品";
              this.typeCon = "商品价";
            } else if (this.type == 3) {
              this.showProducts = ret["data"]["discount"];
              this.typeName = "天天特惠";
              this.typeCon = "特惠价";
            }
            if (this.payment.state == 3) {
              this.payImg = Pay;
            } else {
              this.payImg = noPay;
            }
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
    }
  }
};
</script>

<style scoped>
/* Banner图 */
.page-fun-detail {
  padding-top: 0.45rem;
}
.page-fun-detail .banner {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
}
.page-fun-detail .banner img {
  width: 100%;
}
.page-fun-detail .banner .productInfo {
  display: block;
}
.productInfo .payLabel {
  display: block;
  position: absolute;
  width: 20%;
  top: 37%;
  left: 5%;
}
/* 类型名称 */
.page-fun-detail .typeName {
  display: block;
  padding: 0 0.1rem;
  font-size: 0.16rem;
  margin-top: 0.1rem;
}
.typeName .typeTitle {
  display: inline-block;
}
.gray-line {
  width: 100%;
  height: 0.1rem;
  overflow: hidden;
  background: #f7f7f7;
}
.olist {
  padding: 0 0.1rem;
  overflow: hidden;
  background: #ffffff;
  margin-top: 0.1rem;
}
.olist .orderProInfo {
  display: block;
}
.orderProInfoList {
  display: block;
  height: auto;
  padding: 0 0.05rem;
  padding-top: 0.15rem;
  padding-bottom: 0.15rem;
  background: rgba(245, 245, 245, 1);
}
.orderProInfoList .left {
  display: inline-block;
  overflow: hidden;
  /* float: left; */
  width: 37%;
  height: 1.2rem;
  line-height: 0.8rem;
  border-radius: 2px;
}
.orderProInfoList .left img {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.orderProInfoList .right {
  display: block;
  padding-left: 38.5%;
  line-height: 0.2rem;
}
.orderProInfoList .right .productTitle {
  display: block;
  width: 100%;
  height: 0.22rem;
  line-height: 0.22rem;
  font-size: 0.15rem;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.productTitle .productCon {
  display: inline-block;
  overflow: hidden;
  /* float: left; */
  width: 80%;
  height: 0.22rem;
  line-height: 0.22rem;
  font-size: 0.15rem;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.productTitle .productNum {
  display: inline-block;
  width: 20%;
  text-align: right;
  font-size: 0;
}
.productNum .productIcon {
  display: inline-block;
  font-size: 0.15rem;
}
.productNum .num {
  display: inline-block;
  font-size: 0.15rem;
}
.orderProInfoList .right .discountInfo {
  display: block;
}
.discountInfo .discountCon {
  display: inline-block;
  width: 44%;
}
.discountInfo .priceInfo {
  display: inline-block;
  width: 53%;
  text-align: right;
}
.discountInfo .oldPrice {
  display: inline-block;
  font-size: 0.12rem;
  text-decoration: line-through;
}
.oldPrice .oldMoneyIcon {
  font-size: 0.12rem;
}
.discountInfo .price {
  display: inline-block;
  font-size: 0;
  font-weight: bold;
  color: red;
}
.moneyIcon {
  font-family: -webkit-body;
  font-size: 0.12rem;
  color: rgba(216, 0, 36, 1);
}
.price .moneyNum {
  font-family: -webkit-body;
  font-size: 0.2rem;
}
.goldInfo .goldCon {
  display: inline-block;
  width: 50%;
}
.goldInfo .goldPrice {
  display: inline-block;
  width: 47%;
  font-size: 0;
  font-weight: bold;
  text-align: right;
}
.goldPrice .minus {
  font-size: 0.12rem;
}
.goldPrice .goldNum {
  font-size: 0.12rem;
}
.deliverInfo .deliverCon {
  display: inline-block;
  width: 50%;
}
.deliverInfo .deliverFee {
  display: inline-block;
  width: 47%;
  font-size: 0;
  font-weight: bold;
  text-align: right;
}
.deliverInfo .deliverNum {
  font-size: 0.12rem;
}
.sendGold .sendCon {
  display: inline-block;
  width: 50%;
}
.sendGold .sendPrice {
  display: inline-block;
  width: 47%;
  font-size: 0;
  font-weight: bold;
  text-align: right;
}
.sendGold .sendNum {
  font-size: 0.12rem;
}
/* 应付实付 */
.orderProInfo .totalFee {
  display: block;
  width: 100%;
  height: 0.4rem;
  line-height: 0.4rem;
  text-align: right;
}
.totalFeeTitle {
  display: inline-block;
  color: rgba(68, 68, 68, 1);
}
.totalFeeCon {
  display: inline-block;
  font-size: 0;
}
.totalFeeCon .totalFeeNum {
  font-size: 0.2rem;
  font-weight: bold;
  color: rgba(216, 0, 36, 1);
}
/* 收获地址 */
.addressInfo {
  display: block;
  height: 0.4rem;
}
.addressInfo .addressTitle {
  display: inline-block;
  width: 22%;
  /* float: left; */
  overflow: hidden;
  font-size: 0.16rem;
}
.addressInfo .addressCon {
  display: inline-block;
  width: 60%;
  /* float: right; */
  overflow: hidden;
  color: #636363;
  font-size: 0.16rem;
}
/* 备注信息 */
.noteInfo {
  display: block;
  height: 0.4rem;
}
.noteInfo .noteTitle {
  display: inline-block;
  width: 22%;
  /* float: left; */
  overflow: hidden;
  font-size: 0.16rem;
}
.noteInfo .noteCon {
  display: inline-block;
  width: 78%;
  /* float: right; */
  overflow: hidden;
  color: #636363;
  font-size: 0.16rem;
  text-align: right;
}
.order-info .t {
  font-size: 0.18rem;
  color: #333333;
}
.order-info li {
  padding: 0.1rem;
  overflow: hidden;
  font-size: 0.14rem;
  border-bottom: #dddddd 1px solid;
}
.order-info .del-btn {
  overflow: hidden;
}
.del-btn .left {
  display: inline-block;
  overflow: hidden;
  /* float: left; */
  width: 42%;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-size: 0.15rem;
  background: #ffffff;
}
.serviceIcon {
  display: inline-block;
  overflow: hidden;
  /* float: left; */
  width: 25%;
  height: 0.2rem;
  margin-top: 0.12rem;
  background: url("~@/assets/images/SpecialOffer/productDetail/customerService.png") right no-repeat;
  background-size: contain;
}
.serviceCon {
  display: inline-block;
  width: 60%;
  font-size: 0.16rem;
  text-align: left;
}
.del-btn .right {
  display: inline-block;
  width: 55%;
  height: 0.5rem;
  line-height: 0.5rem;
  color: #000;
  letter-spacing: 0.005rem;
}
.first {
  display: inline-block;
  height: 0.3rem;
  padding: 0 0.1rem;
  margin-left: 0.15rem;
  line-height: 0.3rem;
  border: 1px solid #000;
  border-radius: 0.04rem;
}
.second {
  display: inline-block;
  height: 0.3rem;
  margin-left: 0.1rem;
  padding: 0 0.1rem;
  line-height: 0.3rem;
  border: 1px solid rgba(216, 0, 36, 1);
  border-radius: 0.04rem;
  background: rgba(216, 0, 36, 1);
  color: #fff;
}
</style>