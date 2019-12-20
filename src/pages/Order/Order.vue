<template>
  <div>
    <div class="page-topnav">
      <div class="navTop">
        <i class="iconfont back" v-on:click="goBack()">&#xe609;</i>
        <span class="navCon">确认订单</span>
      </div>
    </div>
    <div class="page-height order-page">
      <div class="nav-top">
        <ul>
          <li v-bind:class="[isClass ? 'current' : '']" v-on:click="addChange('con1')">
            <i class="ord ord1"></i>
            <span>到店消费</span>
            <i class="rad"></i>
          </li>
          <li v-bind:class="[isClass ? '' : 'current']" v-on:click="addChange('con2')">
            <i class="ord ord2"></i>
            <span>送货上门</span>
            <i class="rad"></i>
          </li>
        </ul>
      </div>
      <div class="addr" v-bind:class="[isClass ? 'dn' : '']">
        <router-link :to="{ path: '/address/'}" replace>
          <ul v-bind:class="[address_data['address'] ? '' : 'dn']">
            <li>{{address_data['address']}}{{address_data['note']}}</li>
            <li>
              {{address_data['name']}}
              <span>{{address_data['sex']}}</span>
              <span>{{address_data['mobile']}}</span>
            </li>
          </ul>
        </router-link>
        <router-link :to="{ path: '/address/'}">
          <ul v-bind:class="[address_data['address'] ? 'dn' : '']">
            <li>请选择一个收获地址</li>
          </ul>
        </router-link>
      </div>
      <div class="mess">
        <input type="text" placeholder="给卖家留言" value ref="note" id="note" name="note" />
      </div>
      <div class="goods">
        <ul>
          <template v-for="(product, index) in products">
            <li :key="index">
              <div class="fl">{{product['name']}}</div>
              <div class="fr">
                <span class="num">×{{product['num']}}</span>
                <span class="del">¥{{product['price1']}}</span>
                <span class="price">¥{{product['price']}}</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <div class="sum">
        <div class="fl">
          共{{total}}件商品
          <span>折后</span>合计
        </div>
        <div class="fr">
          <span class="pp">¥{{totalprice}}</span>
        </div>
      </div>
      <div class="order-line"></div>
      <div class="dis">
        <div class="p p2" v-bind:class="[usemaxgold ? '' : 'dn']">
          <div class="ded fl">
            可抵现鲸豆
            <span class="ye">{{usemaxgold}}</span>
            <span class="gray">余额({{gold}})</span>
          </div>
          <!--chk1 为勾状态，chk0是未勾选-->
          <div class="bean fr">
            <i
              class="chk"
              v-bind:class="[status ? 'chk1' : 'chk0']"
              v-on:click="addChange1(status)"
            ></i>
            <span>鲸豆抵现</span>
          </div>
        </div>
        <div class="p p2 tc" v-bind:class="[usemaxgold ? 'dn' : '']">
          <div class="gray">鲸豆余额不足</div>
        </div>
        <div class="p p3" v-bind:class="[status ? '' : 'dn']">
          <li
            v-bind:class="[status2 ? 'current' : '']"
            v-if="usegold"
            name="usegold"
            v-on:click="addChange2('usegold')"
          >
            <i class="radio"></i>
            <em>
              使用
              <span>{{usegold}}</span>鲸豆
            </em>
          </li>
          <li
            v-if="half_gold"
            v-bind:class="[status2 ? '' : 'current']"
            name="half_gold"
            v-on:click="addChange2('half_gold')"
          >
            <i class="radio"></i>
            <em>
              使用
              <span>{{half_gold}}</span>鲸豆
            </em>
          </li>
        </div>
        <div class="p p2" v-bind:class="[status ? 'dn' : '']">
          <span class="gray fr fz16">- ¥0</span>
        </div>
        <div class="p p2" v-bind:class="[status ? '' : 'dn']">
          <span class="pp fr">-¥{{a_usegold}}</span>
        </div>
        <div class="p p4">
          <img src="~@/assets/images/consum.png" alt />
          <span>{{send_gold}}</span>
        </div>
      </div>
      <div class="order-line"></div>
      <div class="freight" v-bind:class="[isClass ? 'dn' : '']">
        <div class="fl">配送费</div>
        <div class="fr">¥{{company['deliver_fee']}}</div>
      </div>
      <div class="order-line"></div>
      <div class="h45"></div>
    </div>
    <div class="fixed-pay">
      <div class="fl">
        <span class="name">实付款：</span>
        <span class="price">¥{{practicalprice}}</span>
      </div>
      <div class="fr" v-on:click="pay()">去支付</div>
    </div>
    <div v-bind:class="[ isActive ? rightClass : errorClass]">
      <i class="smile"></i>
      <span class="con">感谢您为App公益做出的一份努力!</span>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config";
import Store from "@/store/store";
import { Toast } from "mint-ui";

export default {
  components: {
    Error
  },
  data() {
    return {
      products: [],
      company: [],
      send_gold_data: [],
      address_data: [],
      isLoading: false,
      isError: false,
      isActive: false, // 显示感谢框与否
      rightClass: "thanksShow", // 显示
      errorClass: "thanksNoShow", // 不显示
      error: "",
      note: "",
      isClass: 1,
      total: 0,
      half_gold: 0,
      totalprice: 0,
      usegold: 0,
      gold: 0,
      practicalprice: 0,
      status: 0,
      status2: 0,
      a_usegold: 0,
      send_gold: 0,
      usemaxgold: 0,
      viewUrl: "payment/view/",
      viewAddUrl: "payment/add/",
      whoami: "user/whoami/"
    };
  },
  mounted() {
    if (Store.getAuthUid()) {
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
            if (Store.getCompanyid() && Store.getCompanyid() == id) {
              this.isClass = 0;
            } else {
              Store.setCompanyid(id);
            }
          }
        } else {
          this.$router.replace({ path: "/login" });
        }
      });
    } else {
      this.$router.replace({ path: "/login" });
    }
  },

  watch: {
    $route(to, from) {
      this.getData(() => window.scrollTo(0, 0));
    }
  },

  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    goBack: function() {
      this.$router.go(-1);
      //this.$router.push('/company/'+this.$route.params.id)
    },
    addChange: function(con) {
      this.isClass = con == "con1" ? 1 : 0;
      if (this.isClass) {
        if (this.status) {
          this.practicalprice = (this.totalprice - this.a_usegold * 1).toFixed(
            2
          );
        } else {
          this.practicalprice = this.totalprice;
        }
      } else {
        if (this.status) {
          this.practicalprice = (
            this.totalprice * 1 -
            this.a_usegold * 1 +
            this.company["deliver_fee"] * 1
          ).toFixed(2);
        } else {
          this.practicalprice = (
            this.totalprice * 1 +
            this.company["deliver_fee"] * 1
          ).toFixed(2);
        }
      }
    },

    addChange1: function(con) {
      this.status = con ? 0 : 1;
      if (this.status) {
        var name = "";
        if (this.status2) {
          name = "usegold";
        } else {
          name = "half_gold";
        }
        if (name == "usegold") {
          this.a_usegold = (this.usegold / 10).toFixed(2);
          this.send_gold = this.send_gold_data[2];
        } else {
          this.a_usegold = (this.half_gold / 10).toFixed(2);
          this.send_gold = this.send_gold_data[1];
        }
        if (this.isClass) {
          this.practicalprice = (
            this.totalprice * 1 -
            this.a_usegold * 1
          ).toFixed(2);
        } else {
          this.practicalprice = (
            this.totalprice * 1 -
            this.a_usegold * 1 +
            this.company["deliver_fee"] * 1
          ).toFixed(2);
        }
      } else {
        if (this.isClass) {
          this.practicalprice = this.totalprice;
        } else {
          this.practicalprice = (
            this.totalprice * 1 +
            this.company["deliver_fee"] * 1
          ).toFixed(2);
        }
        this.send_gold = this.send_gold_data[0];
      }
    },
    addChange2: function(con) {
      this.status2 = con == "usegold" ? 1 : 0;
      if (this.status2) {
        this.a_usegold = (this.usegold / 10).toFixed(2);
        this.send_gold = this.send_gold_data[2];
      } else {
        this.a_usegold = (this.half_gold / 10).toFixed(2);
        this.send_gold = this.send_gold_data[1];
      }
      if (this.isClass) {
        this.practicalprice = (
          this.totalprice * 1 -
          this.a_usegold * 1
        ).toFixed(2);
      } else {
        this.practicalprice = (
          this.totalprice * 1 -
          this.a_usegold * 1 +
          this.company["deliver_fee"] * 1
        ).toFixed(2);
      }
    },

    loadMore() {
      this.getData();
    },
    getData() {
      this.$http
        .post(this.viewUrl, { id: this.$route.params.id })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.products = ret["data"]["product"];
            this.total = ret["data"]["total"];
            this.totalprice = ret["data"]["totalprice"];
            this.usegold = ret["data"]["usegold"];
            this.gold = ret["data"]["gold"];
            this.half_gold = ret["data"]["half_gold"];
            this.company = ret["data"]["company"];
            this.practicalprice = ret["data"]["practicalprice"];
            if (this.isClass == 0) {
              this.practicalprice = (
                ret["data"]["practicalprice"] * 1 +
                this.company["deliver_fee"] * 1
              ).toFixed(2);
            }
            this.status = ret["data"]["status"];
            this.status2 = ret["data"]["status2"];
            this.a_usegold = ret["data"]["a_usegold"].toFixed(2);
            this.send_gold = ret["data"]["send_gold"];
            this.send_gold_data = ret["data"]["send_gold_data"];
            this.address_data = ret["data"]["address"];
            this.usemaxgold = ret["data"]["usemaxgold"];
          } else if (ret.code === 2) {
            this.$router.replace({
              path: "/company/" + this.$route.params.id + "?tab=hide"
            });
          } else {
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
        });
    },

    pay: function() {
      var sendtype = this.isClass ? 1 : 2;
      this.isActive = !this.isActive;
      if (sendtype == 2) {
        var addressid = this.address_data["id"];
        if (!(addressid > 0)) {
          Toast("没有选择收货地址");
          return;
        }
      } else {
        var addressid = 0;
      }
      var g_state = 0;
      var companyid = this.$route.params.id;
      var note = this.$refs.note.value;
      if (this.status) {
        var name = "";
        if (this.status2) {
          name = "usegold";
        } else {
          name = "half_gold";
        }
        if (name == "usegold") {
          g_state = 3;
        } else {
          g_state = 2;
        }
      } else {
        g_state = 1;
      }
      this.getPayment(sendtype, addressid, companyid, g_state, note);
    },

    getPayment(sendtype, addressid, companyid, g_state, note) {
      this.$http
        .post(this.viewAddUrl, {
          sendtype: sendtype,
          addressid: addressid,
          companyid: companyid,
          g_state: g_state,
          note: note
        })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            var id = ret["data"]["id"];
            Store.setCompanyid("");
            setTimeout(() => {
              this.$router.push("/pay/" + id + "?tab=hide");
            }, 1000);
          } else {
            Toast("没有登录");
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
        });
    }
  }
};
</script>

<style scoped>
.order-page {
  background: #fff;
  font-size: 0.14rem;
  padding-top: 0.45rem;
}
.order-page .nav-top {
  height: 0.45rem;
  overflow: hidden;
  border-bottom: #eee 1px solid;
}
.order-page .nav-top li {
  width: 50%;
  float: left;
  height: 0.45rem;
  line-height: 0.45rem;
  vertical-align: middle;
  text-align: center;
}
.order-page .nav-top li span {
  vertical-align: middle;
}
.order-page .nav-top li .ord {
  width: 0.15rem;
  height: 0.15rem;
  display: inline-block;
}
.order-page .nav-top li .ord1 {
  background: url("~@/assets/images/ord1.png") center center no-repeat;
  background-size: contain;
  vertical-align: middle;
}
.order-page .nav-top li .ord2 {
  background: url("~@/assets/images/ord2.png") center center no-repeat;
  background-size: contain;
  vertical-align: middle;
}
.order-page .nav-top li .rad {
  width: 0.15rem;
  height: 0.15rem;
  display: inline-block;
  background: url("~@/assets/images/rad1.png") center center no-repeat;
  background-size: contain;
  vertical-align: middle;
}
.order-page .nav-top li.current .rad {
  background: url("~@/assets/images/rad2.png") center center no-repeat !important;
  background-size: contain !important;
  vertical-align: middle;
}
.order-page .addr {
  padding: 0.1rem;
  padding-right: 0.3rem;
  background: url("~@/assets/images/arr-order.png") 96% center no-repeat;
  overflow: hidden;
  background-size: 0.07rem 0.12rem;
  border-bottom: #eee 1px solid;
}
.order-page .addr li {
  padding: 0.02rem 0;
}
.order-page .mess {
  padding: 0.1rem 0;
  overflow: hidden;
  background: #f5f5f5;
}
.order-page .mess input {
  width: 95%;
  display: block;
  margin: auto;
  height: 0.4rem;
  border: none;
  outline: none;
  text-indent: 1em;
  box-shadow: 0 3px 3px #eee inset;
  -webkit-box-shadow: 0 3px 3px #eee inset;
  -moz-box-shadow: 0 3px 3px #eee inset;
  -ms-box-shadow: 0 3px 3px #eee inset;
}
.order-page .goods {
  background: #ffffff;
  overflow: hidden;
}
.order-page .goods li {
  padding: 0.1rem;
  overflow: hidden;
  border-bottom: #eee 1px solid;
  font-size: 0.14rem;
}
.order-page .goods .num {
  color: #969696;
  padding-right: 0.2rem;
}
.order-page .goods .del {
  color: #969696;
  padding-right: 0.2rem;
  text-decoration: line-through;
}
.order-page .sum {
  padding: 0.1rem;
  overflow: hidden;
}
.order-page .sum .fl {
  color: #969696;
}
.order-page .sum .fl span {
  padding-right: 0.1rem;
}
.order-page .pp {
  color: #ff6432;
  font-size: 0.2rem;
}
.order-page .order-line {
  overflow: hidden;
  height: 0.1rem;
  background: #f5f5f5;
}
.order-page .dis {
  overflow: hidden;
  font-size: 0.14rem;
  background: #ffffff;
}
.order-page .dis .p {
  padding: 0.1rem;
  overflow: hidden;
  border-bottom: #eee 1px solid;
}
.order-page .ye {
  color: #ff6432;
}
.order-page .gray {
  color: #969696;
}
.order-page .dis .bean {
  margin-left: 0.1rem;
  opacity: 0.8;
}
i.chk0 {
  width: 0.15rem;
  height: 0.15rem;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  background: url("~@/assets/images/chk1.png") center center no-repeat;
  background-size: contain;
}
i.chk1 {
  width: 0.15rem;
  height: 0.15rem;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  background: url("~@/assets/images/chk2.png") center center no-repeat;
  background-size: contain;
}
.order-page .dis .bean span {
  vertical-align: middle;
}
.order-page .dis .p3 {
  overflow: hidden;
}
.order-page .dis .p3 li {
  width: 50%;
  padding: 0.02rem 0;
  overflow: hidden;
  float: left;
  text-align: center;
}
i.radio {
  width: 0.15rem;
  height: 0.15rem;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  background: url("~@/assets/images/rad1.png") center center no-repeat;
  background-size: contain;
}
.order-page .dis .p3 li em {
  vertical-align: middle;
  margin-left: 0.05rem;
}
.order-page .dis .p3 li.current .radio {
  background: url("~@/assets/images/rad2.png") center center no-repeat;
  background-size: contain;
}
.order-page .dis .p4 {
  text-align: center;
}
.order-page .dis .p4 img {
  width: 0.95rem;
  display: inline-block;
}
.order-page .dis .p4 span {
  font-size: 0.15rem;
  font-weight: bold;
  color: #ff6432;
  vertical-align: middle;
}
.order-page .freight {
  background: #ffffff;
  padding: 0.1rem;
  overflow: hidden;
  font-size: 0.14rem;
}
.order-page .sum .fl span {
  padding-right: 0.1rem;
  color: #ff6432;
}
.fixed-pay {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0.45rem;
  overflow: hidden;
  background: #ffffff;
}
.fixed-pay .fl {
  width: 70%;
  height: 0.45rem;
  padding-left: 2%;
  float: left;
  line-height: 0.45rem;
}
.fixed-pay .fl .name {
  vertical-align: bottom;
}
.fixed-pay .fl .price {
  vertical-align: middle;
  font-size: 0.22rem;
}
.fixed-pay .fr {
  width: 28%;
  height: 0.45rem;
  background: #ff6432;
  text-align: center;
  line-height: 0.45rem;
  float: right;
  color: #ffffff;
  font-size: 0.14rem;
}
.order-page .h45 {
  background: #ffffff;
}
.tc {
  text-align: center;
}
.fz16 {
  font-size: 0.16rem;
}
/* 感谢框显示 */
.thanksShow {
  position: absolute;
  top: 35%;
  width: 96%;
  height: 1rem;
  margin-left: 2%;
  display: block;
  background: url("~@/assets/images/order/bg.png") center center no-repeat;
  background-size: contain;
}
.thanksNoShow {
  display: none;
}
.thanksShow .smile {
  display: inline-block;
  position: absolute;
  top: 38%;
  left: 11%;
  width: 0.25rem;
  height: 0.25rem;
  background: url("~@/assets/images/order/smile-white.png") center center no-repeat;
  background-size: 100% 100%;
}
.thanksShow .con {
  display: inline-block;
  position: absolute;
  top: 42%;
  left: 22%;
  font-size: 0.14rem;
  color: #fff;
}
</style>