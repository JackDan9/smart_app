<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" v-on:click="$router.go(-1)">&#xe609;</i>
      <i
        class="iconfont share"
        v-on:click="shareLink(product.name,fullUrl(product.picture))"
      >&#xe60f;</i>
    </div>
    <div class="product-page">
      <div class="banner">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <img v-if="product['picture']" :src="fullUrl(product['picture'])+'!640.398'" />
          </div>
        </div>
      </div>
      <div class="info" v-infinite-scroll="loadMore">
        <div class="title">{{product['name']}}</div>
        <div class="sale">月售{{product['salenum']}}份</div>
        <div class="dis">
          <i class="ico_dis"></i>
          <span>{{product['teamprice']}}折优惠</span>
        </div>
        <div class="price">
          <span>¥</span>
          <em>{{product['price']}}</em>
          <i>¥{{product['price1']}}</i>
          <div class="add-btn" v-on:click="addCart(product['price'])">加入购物车</div>
        </div>
      </div>
      <div class="proline"></div>
      <div class="pro-intro">
        <div class="t">商品简介</div>
        <div class="con">
          {{product['description']}}
          <template v-for="pic in pics">
            <img v-if="product['picture']" v-bind:src="fullUrl(pic['pickey'])+'!640.398'" :key />
          </template>
        </div>
      </div>
      <div class="size6"></div>
      <div class="pro-bot">
        <div class="bg">
          <div class="pri">
            ¥
            <span id="total_price">{{company_price}}</span>
          </div>
          <div class="pay" v-on:click="pay()">去结算</div>
        </div>
        <div class="logo2">
          <div class="num" id="company_total_num">{{company_num}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config";
import Store from "@/store/store";
import WxShare from "@/utils/wx/wx";
import { Toast } from "mint-ui";

export default {
  components: {
    Error
  },
  data() {
    return {
      product: [],
      pics: [],
      isLoading: false,
      isError: false,
      error: "",
      whoami: "user/whoami/",
      wxShareUrl: "share/",
      viewUrl: "product/view/",
      collectUrl: "collect/add/",
      username: "",
      picture: "",
      company_num: 0,
      company_price: 0,
      hasFocus: false
    };
  },

  mounted() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
          this.username = ret["nickname"] ? ret["nickname"] : ret["username"];
          this.picture = ret["picture"];
        }
      });
    }
    const id = +this.$route.params.id;
    if (!id) {
      this.isError = true;
      this.error = "参数错误";
    } else {
      this.isLoading = true;
      this.getData();
      this.getWx();
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

    pay: function() {
      if (this.company_num <= 0) {
        Toast("没有选择产品!");
      } else {
        this.$router.push("/order/" + this.product["companyid"] + "?tab=hide");
      }
    },

    defaultPicUrl: function() {
      return Config.defaultPic;
    },

    loadMore() {
      document.addEventListener("scroll", this.winScroll(), false);
    },
    winScroll: function() {
      var scrollTop = document.body.scrollTop > 100 ? 100 : document.body.scrollTop;
      document.getElementsByClassName("navTop")[0].style.background = "rgba(0,0,0," + scrollTop / 100 + ")";
    },

    shareLink: function(text, pic) {
      var share = {
        action: "share",
        url: window.location.href,
        title: text,
        img: pic
      };
      if (window.postMessage) {
        window.postMessage(JSON.stringify(share), "*");
        return true;
      }
    },

    getWx: function() {
      this.$http
        .post(this.wxShareUrl, {
          url: window.location.href,
          id: this.$route.params.id
        })
        .then(response => {
          const ret = JSON.parse(response.data);
          if (ret && ret.code == 0) {
            WxShare.wxinit(ret["data"]);
          } else {
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
        });
    },

    addCart: function(price) {
      if (!this.username) {
        this.$router.push("/login");
        return;
      }
      if (this.product["collectNum"] * 1 + 1 > this.product["stock"]) {
        Toast("库存不足");
        return;
      }
      var company_total_num = this.company_num;
      var total_price = this.company_price;
      company_total_num++;
      total_price = total_price * 1 + price * 1;
      this.company_num = company_total_num;
      this.company_price = total_price.toFixed(2);
      this.getCart();
    },

    getCart() {
      this.$http
        .post(this.collectUrl, { itemid: this.$route.params.id, num: 1, t: 2 })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("添加购物车成功!");
          } else {
            Toast("添加购物车失败!");
          }
        });
    },
    getData(callback) {
      this.$http.post(this.viewUrl, { id: this.$route.params.id }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.product = ret["data"];
            this.company_num = this.product["company_num"];
            this.company_price = this.product["company_price"];
            this.pics = this.product["pics"];
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
.banner {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
}
.banner img {
  width: 100%;
  height: 100%;
  border-radius: 0.03rem;
}
.product-page .info {
  padding: 0.1rem;
  overflow: hidden;
}
.product-page .info .title {
  font-size: 0.18rem;
  color: #333333;
}
.product-page .info .sale {
  font-size: 0.12rem;
  color: #666666;
  margin-top: 0.03rem;
}
.product-page .info .dis {
  margin-top: 0.03rem;
  color: #ff6432;
  font-size: 0.12rem;
}
.product-page .info .dis span {
  vertical-align: middle;
}
.ico_dis {
  display: inline-block;
  vertical-align: middle;
  width: 0.15rem;
  height: 0.15rem;
  background: url("~@/assets/images/dis.png") center center no-repeat;
  background-size: contain;
}
i,
em {
  font-style: normal;
}
.product-page .price {
  margin-top: 0.03rem;
  overflow: hidden;
}
.product-page .price span {
  color: #ff6432;
  font-size: 0.14rem;
}
.product-page .price em {
  color: #ff6432;
  font-size: 0.24rem;
  margin-left: 0.05rem;
}
.product-page .price i {
  color: #bbbbbb;
  font-size: 0.14rem;
  margin-left: 0.05rem;
}
.product-page .add-btn {
  height: 0.3rem;
  float: right;
  background: #ff6432;
  font-size: 0.14rem;
  line-height: 0.3rem;
  color: #ffffff;
  text-align: center;
  padding: 0 0.2rem;
  overflow: hidden;
  -webkit-border-radius: 0.3rem;
  -moz-border-radius: 0.3rem;
  border-radius: 0.3rem;
}
.proline {
  width: 100%;
  height: 0.15rem;
  background: #f5f5f5;
}
.pro-intro {
  overflow: hidden;
}
.pro-intro .t {
  padding: 0.08rem 0.1rem;
  font-size: 0.16rem;
  overflow: hidden;
  border-bottom: #eee 1px solid;
}
.pro-intro .con {
  padding: 0.1rem;
  overflow: hidden;
}
.pro-intro .con img {
  width: 100%;
}
.pro-bot {
  z-index: 12345;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0.6rem;
  overflow: hidden;
}
.pro-bot .bg {
  width: 100%;
  height: 0.45rem;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #434343;
}
.pro-bot .logo2 {
  position: relative;
  z-index: 12;
  width: 0.5rem;
  height: 0.5rem;
  margin-left: 0.1rem;
  background: url("~@/assets/images/proimg.png") center center no-repeat;
  background-size: contain;
}
.pro-bot .pri {
  float: left;
  color: #ffffff;
  margin-left: 0.7rem;
  margin-top: 0.1rem;
  font-size: 0.22rem;
}
.pro-bot .pay {
  width: 35%;
  height: 0.45rem;
  float: right;
  text-align: center;
  background: #fa500f;
  font-size: 0.2rem;
  color: #ffffff;
  line-height: 0.5rem;
}
.size6 {
  width: 100%;
  height: 0.6rem;
  overflow: hidden;
}
.pro-bot .logo2 .num {
  height: 0.16rem;
  position: absolute;
  right: -0.05rem;
  top: 0;
  color: #ffffff;
  z-index: 123;
  background: #19a7ff;
  padding: 0 0.06rem;
  border-radius: 0.1rem;
  vertical-align: middle;
}
</style>