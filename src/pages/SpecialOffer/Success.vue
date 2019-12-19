<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" v-on:click="goback">&#xe609;</i>
      <span class="navCon">支付成功</span>
    </div>
    <div class="fixed-pays">
      <div class="mess">
        <p class="p1">¥{{payment['perfee']}}</p>
        <p class="p2">{{payment['proname']}}</p>
      </div>
      <div class="info">
        <div class="p1">支付成功！</div>
        <div class="p2">本次消费支付 ¥{{payment['totalfee']}} ，鲸豆{{payment['gold']}}</div>
      </div>
      <div class="time">{{payment['paytime']}}</div>
    </div>
  </div>
</template>
<script>
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config";
import { Toast } from "mint-ui";
import Store from "@/store/store";

export default {
  components: {
    Error,
    Tab
  },
  data() {
    return {
      isError: false,
      error: "",
      payment: [],
      whoami: "user/whoami/",
      viewUrl: "phone/viewone/"
    };
  },
  beforeMount: function() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
          const id = +this.$route.params.id;
          if (id > 0) {
            this.getData();
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
  watch: {
    $route(to, from) {
      this.getData(() => window.scrollTo(0, 0));
    }
  },
  methods: {
    goback: function(event) {
      this.$router.replace({ path: "/tel/" });
    },

    getData(callback) {
      this.$http.post(this.viewUrl, { id: this.$route.params.id }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.payment = ret["data"]["payment"];
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
.fixed-pays {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 123;
  background: #f0f0f0;
}
.fixed-pays .mess {
  margin-top: 0.4rem;
  padding: 0.2rem 0;
  text-align: center;
  overflow: hidden;
  background: #ffffff;
}
.fixed-pays .mess .p1 {
  margin-top: 0.2rem;
  font-size: 0.3rem;
  color: #2d2d2d;
}
.fixed-pays .mess .p2 {
  font-size: 0.15rem;
  color: #636363;
}
.fixed-pays .info {
  margin-top: 20%;
  text-align: center;
}
.fixed-pays .info .p1 {
  display: inline-block;
  font-size: 0.2rem;
  color: #000000;
  padding-left: 0.27rem;
  background: url("~@/assets/images/pas.png") left center no-repeat;
  background-size: 0.25rem 0.25rem;
}
.fixed-pays .info .p2 {
  font-size: 0.15rem;
  color: #000000;
  margin-top: 0.1rem;
}
.fixed-pays .time {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0.3rem;
  text-align: center;
  color: #828282;
  font-size: 0.15rem;
}
</style>