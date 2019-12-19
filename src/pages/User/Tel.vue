<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">话费充值</span>
    </div>
    <div class="tel-page">
      <div class="phone-num">
        <input type="tel" placeholder="请输入手机号码" ref="mobile" id="mobile" name="mobile" />
      </div>
      <div class="line-bg"></div>
      <div class="tel-t tel-ico-t">话费充值</div>
      <div class="tel-pack">
        <ul>
          <li v-bind:class="[isClass ? 'current' : '']" v-on:click="addChange('con1')">
            <p class="p1">10元</p>
            <p class="p2">售价：10.00元</p>
          </li>
          <li v-bind:class="[isClass2 ? 'current' : '']" v-on:click="addChange('con2')">
            <p class="p1">30元</p>
            <p class="p2">售价：30.00元</p>
          </li>
          <li v-bind:class="[isClass3 ? 'current' : '']" v-on:click="addChange('con3')">
            <p class="p1">50元</p>
            <p class="p2">售价：49.98元</p>
          </li>
          <li v-bind:class="[isClass4 ? 'current' : '']" v-on:click="addChange('con4')">
            <p class="p1">100元</p>
            <p class="p2">售价：99.57元</p>
          </li>
          <li v-bind:class="[isClass5 ? 'current' : '']" v-on:click="addChange('con5')">
            <p class="p1">200元</p>
            <p class="p2">售价：199.44元</p>
          </li>
          <li v-bind:class="[isClass6 ? 'current' : '']" v-on:click="addChange('con6')">
            <p class="p1">500元</p>
            <p class="p2">售价：498.75元</p>
          </li>
        </ul>
      </div>
      <div class="info">
        <ul>
          <li>
            <div class="name fl">{{saleprice}}元话费充值</div>
            <div class="fr org">¥{{price}}</div>
          </li>
          <li>
            <div class="name fl org">鲸豆支付</div>
            <div class="gray">（余额{{gold}}豆）</div>
          </li>
          <li>
            <div class="name fl gray">{{gold_description}}</div>
            <div class="fr org">-¥{{this.usemoney}}</div>
          </li>
        </ul>
      </div>
      <div class="pay-txt">充值一小时内到帐，如不到帐全额退款</div>
      <div class="pay-btn" v-on:click="pay()">立即支付¥{{totalfee}}</div>
    </div>
  </div>
</template>
<script>
import Error from "@/components/Error";
import Config from "@/config/config";
import { Toast } from "mint-ui";
import Store from "@/store/store";

export default {
  components: {
    Error
  },
  data() {
    return {
      isError: false,
      error: "",
      gold: 0,
      usegold: 0,
      usemoney: 0, //使用鲸豆转变成钱
      totalfee: 0, //实际付多少钱
      price: 10, //充值多少钱
      saleprice: 10, //显示金额
      isClass: 1,
      isClass2: 0,
      isClass3: 0,
      isClass4: 0,
      isClass5: 0,
      isClass6: 0,
      gold_description: "",
      proname: "10元话费充值",
      mobile: "",
      whoami: "user/whoami/",
      phoneUrl: "phone/add/"
    };
  },
  watch: {
    $route(to, from) {
      () => window.scrollTo(0, 0);
    }
  },
  beforeMount: function() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
          this.gold = ret["gold"];
          if (this.gold >= 80) {
            this.usegold = 80;
            this.gold_description = "使用鲸豆:80个";
            this.usemoney = 5;
            this.totalfee = 5;
          } else {
            this.usegold = 0;
            this.gold_description = "鲸豆余额不足";
            this.usemoney = 0;
            this.totalfee = 10;
          }
        } else {
          this.$router.push("/login");
          return;
        }
      });
    } else {
      this.$router.push("/login");
      return;
    }
  },

  methods: {
    addChange: function(con) {
      this.isClass = this.isClass2 = this.isClass3 = this.isClass4 = this.isClass5 = this.isClass6 = 0;
      this.usemoney = 0;
      if (con == "con1") {
        this.isClass = 1;
        this.price = 10;
        this.saleprice = this.totalfee = 10;
        if (this.gold >= 80) {
          this.usegold = 80;
          this.usemoney = 5;
          this.totalfee = 5;
        } else {
          this.usegold = 0;
        }
      } else if (con == "con2") {
        this.isClass2 = 1;
        this.price = 30;
        this.saleprice = this.totalfee = 30;
        if (this.gold >= 180) {
          this.usegold = 180;
          this.usemoney = 15;
          this.totalfee = 15;
        } else {
          this.usegold = 0;
        }
      } else if (con == "con3") {
        this.isClass3 = 1;
        this.price = 50;
        this.saleprice = this.totalfee = 49.98;
        if (this.gold >= 280) {
          this.usegold = 280;
          this.usemoney = 24.98;
          this.totalfee = 25;
        } else {
          this.usegold = 0;
        }
      } else if (con == "con4") {
        this.isClass4 = 1;
        this.price = this.totalfee = 99.57;
        this.saleprice = 100;
        if (this.gold >= 530) {
          this.usegold = 530;
          this.usemoney = 49.57;
          this.totalfee = 50;
        } else {
          this.usegold = 0;
        }
      } else if (con == "con5") {
        this.isClass5 = 1;
        this.price = this.totalfee = 199.44;
        this.saleprice = 200;
        if (this.gold >= 1030) {
          this.usegold = 1030;
          this.usemoney = 99.44;
          this.totalfee = 100;
        } else {
          this.usegold = 0;
        }
      } else if (con == "con6") {
        this.isClass6 = 1;
        this.price = this.totalfee = 498.75;
        this.saleprice = 500;
        if (this.gold >= 2530) {
          this.usegold = 2530;
          this.usemoney = 248.75;
          this.totalfee = 250;
        } else {
          this.usegold = 0;
        }
      }
      this.proname = this.saleprice + "元话费充值";
      this.gold_description = "使用鲸豆:" + this.usegold + "个";
    },

    pay: function() {
      if (this.usegold * 100 > this.gold * 100) {
        Toast("输入的鲸豆大于余额鲸豆");
        return;
      }
      if (this.usemoney > this.price) {
        Toast("输入的鲸豆大于需要付款的鲸豆");
        return;
      }
      this.mobile = this.$refs.mobile.value;
      if (this.mobile.length !== 11) {
        Toast("请输入11位手机号码");
        return;
      }
      this.getData();
    },
    getData(picture) {
      this.$http
        .post(this.phoneUrl, {
          proname: this.proname,
          gold: this.usegold,
          price: this.price,
          totalfee: this.totalfee,
          mobile: this.mobile
        })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret) {
              if (ret.code == 0) {
                this.$router.push("/pay/" + ret["data"]["id"]);
                return;
              } else if (ret.code == 3) {
                this.$router.push("/success/" + ret["data"]["id"]);
                return;
              }
            } else {
              this.error = (ret && ret.msg) || "";
              this.isError = true;
            }
            Toast(ret.msg);
          },
          response => {
            this.isError = true;
            this.error = "";
            if (callback) callback.call(this);
          }
        );
    }
  }
};
</script>

<style scoped>
.tel-page {
  background: #f0f0f0;
  min-height: 700px;
  padding-top: 0.45rem;
  overflow: hidden;
  font-size: 0.16rem;
}
.tel-page .phone-num {
  padding: 0.08rem 0.2rem;
  overflow: hidden;
  background: #ffffff;
}
.tel-page .phone-num input {
  width: 100%;
  border: none;
  height: 0.3rem;
  line-height: 0.3rem;
  font-size: 0.16rem;
}
.line-bg {
  width: 100%;
  height: 0.05rem;
  background: #f0f0f0;
}
.tel-page .tel-t {
  padding: 0.1rem 0.2rem;
  overflow: hidden;
}
.tel-page .tel-ico-t {
  padding-left: 0.4rem;
  background: url("~@/assets/images/tel-ico.png") 0.2rem center no-repeat #fff;
  background-size: 0.15rem 0.2rem;
}
.tel-page .tel-pack {
  padding: 0.1rem 0.15rem;
  overflow: hidden;
  background: #f0f0f0;
}
.tel-page .tel-pack ul {
  width: 110%;
}
.tel-page .tel-pack li {
  width: 29%;
  float: left;
  margin-right: 2%;
  margin-top: 1%;
  margin-bottom: 1%;
  text-align: center;
  padding: 0.1rem 0;
  background: #ffffff;
  border-radius: 0.05rem;
}
.tel-pack li.current {
  background: #ff550f;
  color: #fff;
}
.tel-page .info li input {
  width: 300px;
  border: none;
}
.tel-pack li .p2 {
  font-size: 0.1rem;
}
.tel-page .info {
  padding: 0.05rem 0.2rem;
  overflow: hidden;
  background: #ffffff;
}
.tel-page .info li {
  padding: 0.1rem 0;
  overflow: hidden;
  border-bottom: #f0f0f0 1px solid;
}
.tel-page .info li:nth-last-child(1) {
  border: none;
}
.tel-page .org {
  color: #fa550f;
}
.tel-page .gray {
  color: #9b9b9b;
}
.pay-txt {
  margin-top: 2%;
  color: #9b9b9b;
  text-align: center;
  font-size: 0.14rem;
}
.pay-btn {
  width: 90%;
  margin: auto;
  background: #fa550f;
  border-radius: 5px;
  height: 0.4rem;
  color: #ffffff;
  line-height: 0.4rem;
  text-align: center;
  margin-bottom: 0.5rem;
  margin-top: 2%;
}
</style>