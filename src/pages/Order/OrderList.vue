<template>
  <div>
    <div class="page-topnav">
      <div class="navTop">
        <router-link :to="{path:'/user'}">
          <i class="iconfont back">&#xe609;</i>
        </router-link>
        <div class="tab">
          <a class="current">订单</a>
        </div>
      </div>
    </div>
    <div class="h45"></div>
    <div
      class="page-height order-list"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="isLoading"
      infinite-scroll-distance="10"
    >
      <div class="topnav">
        <div class="navList">
          <div
            class="item"
            v-bind:class="[isClass === 'con1' ? 'current' : '']"
            v-on:click="addChange('con1')"
          >
            <a>送货上门</a>
          </div>
          <div
            class="item"
            v-bind:class="[isClass === 'con2' ? 'current' : '']"
            v-on:click="addChange('con2')"
          >
            <a>到店消费</a>
          </div>
          <div
            class="item"
            v-bind:class="[isClass === 'con3' ? 'current' : '']"
            v-on:click="addChange('con3')"
          >
            <a>其他</a>
          </div>
        </div>
      </div>
      <div class="olist">
        <ul>
          <template v-for="(order_data, index) in orders">
            <li :key="index">
              <router-link :to="{ path: '/orderlist/'+order_data['id']}">
                <div class="img">
                  <img
                    v-if="order_data['picture']"
                    :src="fullUrl(order_data['picture'])+'!200.200'"
                    class="w100"
                  />
                </div>
                <div class="right">
                  <div class="top">
                    <div class="p1">
                      <span>{{order_data['companyName']}}</span>
                      <em>{{order_data['statename']}}</em>
                    </div>
                    <div class="p2">{{order_data['addtime']}}</div>
                  </div>
                  <div class="goods">
                    <p>
                      {{order_data['proname']}}
                      <strong>¥{{order_data['totalfee']}}</strong>
                    </p>
                  </div>
                </div>
              </router-link>
              <div
                class="more"
                v-bind:class="[order_data['state'] == 1  ? '':[order_data['state'] == 3  ? '' : 'dn']]"
              >
                <div
                  class="pay"
                  v-bind:class="[order_data['state'] == 1  ? '' : 'dn']"
                  v-on:click="addPay(order_data['id'])"
                >去付款</div>
                <router-link
                  :to="{ path: '/ccomment/'+order_data['id']}"
                  v-bind:class="[order_data['state'] == 3  ? '' : 'dn']"
                >
                  <div class="pay">评价</div>
                </router-link>
                <div
                  class="obtn"
                  v-bind:class="[order_data['state'] == 1  ? '' : 'dn']"
                  v-on:click="close(order_data['id'])"
                >关闭订单</div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { Toast } from "mint-ui";
import Config from "@/config/config.js";
import Store from "@/store/store.js";

export default {
  components: {
    Error
  },
  data() {
    return {
      orders: [],
      isLoading: false,
      isError: false,
      error: "",
      isClass: "con1",
      sendtype: 2,
      whoami: "user/whoami/",
      outkeyUrl: "payment/outkey/",
      closeUrl: "payment/close/",
      viewListUrl: "payment/viewlist/"
    };
  },

  mounted() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
          this.getData();
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

    watch: {
      $route(to, from) {
        this.getData(() => window.scrollTo(0, 0));
      }
    },

    loadMore() {
      this.getData();
    },

    close: function(id) {
      this.$http.post(this.closeUrl, { id: id }).then(response => {
        const ret = JSON.parse(response.data || "[]");
        if (ret) {
          if (ret.code === 0) {
            Toast("订单关闭");
            if (this.orders && this.orders.length) {
              for (var i = 0; i < this.orders.length; i++) {
                if (id == this.orders[i]["id"]) {
                  this.orders[i]["state"] = -1;
                  this.orders[i]["statename"] = "订单关闭";
                }
              }
            }
          } else {
            Toast("其他原因不能关闭");
          }
        }
      });
    },

    addPay: function(id) {
      if (id > 0) {
        this.getPay(id);
      } else {
        Toast("订单参数错误");
      }
    },
    addChange: function(con) {
      if (con == "con1") {
        this.sendtype = 2;
        this.isClass = "con1";
      } else if (con == "con2") {
        this.sendtype = 1;
        this.isClass = "con2";
      } else {
        this.sendtype = 0;
        this.isClass = "con3";
      }
      this.page = 1;
      this.getData(() => window.scrollTo(0, 0));
    },

    getData(callback) {
      this.$http
        .post(this.viewListUrl, { page: this.page, sendtype: this.sendtype })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              this.page = ret["data"]["page"];
              if (this.page == 1) {
                this.orders = ret["data"]["orders"];
              } else {
                var orders_new = ret["data"]["orders"];
                if (orders_new && orders_new.length) {
                  for (var i = 0; i < orders_new.length; i++) {
                    this.orders.push(orders_new[i]);
                  }
                }
              }
              this.total = ret["data"]["total"];
              if (this.page <= this.total) {
                this.page = this.page + 1;
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
    },
    getPay(id) {
      this.$http.post(this.outkeyUrl, { id: id }).then(response => {
        const ret = JSON.parse(response.data || "[]");
        if (ret) {
          if (ret.code === 0) {
            this.$router.push("/pay/" + id);
          } else if (ret.code === 1 || ret.code === 3) {
            Toast("订单参数错误");
          } else if (ret.code === 2) {
            this.$router.replace({ path: "/login" });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.order-list {
  background: #eeeeee;
  padding-top: 0.45rem;
}
.order-list .topnav {
  display: block;
  width: 100%;
}
.order-list .topnav .navList {
  display: block;
  width: 100%;
  position: fixed;
  height: 0.45rem;
  background: #fff;
}
.order-list .topnav .navList {
  display: block;
  width: 100%;
  position: fixed;
  height: 0.45rem;
  background: #fff;
}
.order-list .topnav .item {
  display: inline-block;
  width: 32.5%;
  height: 0.45rem;
  background: #ffffff;
  overflow: hidden;
  text-align: center;
}
.order-list .topnav .item a {
  display: inline-block;
  margin-top: 0.1rem;
}
.order-list .topnav .item.current a {
  border-bottom: #fa500f 2px solid;
  color: #fa500f;
  font-size: 15px;
}
.order-list .olist {
  overflow: hidden;
  padding-top: 0.55rem;
}
.order-list .olist li {
  background: #ffffff;
  overflow: hidden;
  border-bottom: #eeeeee 10px solid;
}
.order-list .olist li .img {
  margin-left: 0.1rem;
  margin-top: 0.1rem;
  float: left;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 0.45rem;
  overflow: hidden;
}
.order-list .olist li .right {
  margin-left: 0.5rem;
  overflow: hidden;
}
.order-list .olist li .right .top {
  font-size: 0.16rem;
  padding: 0.1rem;
  overflow: hidden;
  border-bottom: #f4f4f4 1px solid;
}
.order-list .olist li .right .top em {
  font-size: 0.13rem;
  float: right;
}
.order-list .olist li .right .top .p2 {
  color: #8f8f8f;
  font-size: 0.12rem;
  line-height: 0.24rem;
}
.order-list .olist li .right .goods {
  margin-top: 0.05rem;
}
.order-list .olist li .right .goods p {
  line-height: 0.3rem;
  padding-right: 0.1rem;
  color: #707070;
}
.order-list .olist li .right .goods strong {
  color: #3f3f3f;
  float: right;
}
.order-list .olist li .more {
  margin-top: 0.05rem;
  padding: 0.1rem;
  overflow: hidden;
  border-top: #f4f4f4 1px solid;
}
.order-list .olist li .more .obtn {
  vertical-align: middle;
  float: right;
  padding: 0.05rem 0.1rem;
  border-radius: 0.05rem;
  overflow: hidden;
  border: #fd464f 1px solid;
  color: #fd464f;
}
.order-list .olist li .more .pay {
  vertical-align: middle;
  float: right;
  padding: 0.05rem 0.1rem;
  border-radius: 0.05rem;
  overflow: hidden;
  background: #fa500f;
  border: #fd464f 1px solid;
  color: #ffffff;
  margin-left: 0.1rem;
}
.navTop .tab {
  position: absolute;
  left: 25%;
  bottom: 2px;
  width: 1.8rem;
  height: 0.42rem;
  line-height: 0.42rem;
  text-align: center;
}
.navTop .tab a {
  color: #969696;
  display: inline-block;
  width: 0.5rem;
  line-height: 0.42rem;
  font-size: 0.16rem;
}
.navTop .tab .current {
  color: #ffffff;
}
</style>