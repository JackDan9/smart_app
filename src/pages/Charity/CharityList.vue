<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" v-on:click="$router.go(-1)">&#xe609;</i>
      <span class="navCon">公益项目</span>
      <router-link :to="{ path: '/explain/'}">说明</router-link>
    </div>
    <div class="welfare-num dn" v-html="total_love"></div>
    <div class="welfare-list">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isLoading"
        infinite-scroll-distance="10"
      >
        <template v-for="(charity, index) in charitys">
          <li :key="index">
            <a v-on:click="changeClick(charity.id)">
              <div class="pic">
                <img
                  v-if="charity['picture']"
                  :src="fullUrl(charity['picture'])+'!640.398'"
                  class="w100"
                  alt
                />
                <div class="operation">
                  <div class="btn"></div>
                  <div class="num">
                    <span>{{charity['love']}}</span>份爱心
                  </div>
                </div>
              </div>
              <div class="info">
                <div class="name">{{charity['name']}}</div>
                <div class="num">
                  已投
                  <span>{{charity['vote']}}</span> 票
                </div>
              </div>
            </a>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Tab from "@/components/Tab";
import Config from "@/config/config";

export default {
  components: {
    Error
  },
  data() {
    return {
      charitys: [],
      isLoading: false,
      isError: false,
      error: "",
      total_love: "",
      viewListUrl: "charity/viewlist/"
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    loadMore() {
      this.getData();
    },

    changeClick: function(id) {
      window.location.href = "#/charity/" + id;
    },
    getData(callback) {
      this.$http.post(this.viewListUrl, { page: this.page }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.page = ret["data"]["page"];
            var total_love_str = "已有";
            if (ret["data"]["total_love"] > 0) {
              for (
                var i = 0;
                i < ret["data"]["total_love"].toString().length;
                i++
              ) {
                total_love_str +=
                  "<span>" +
                  ret["data"]["total_love"].toString().charAt(i) +
                  "</span>";
              }
            } else {
              total_love_str += "<span>0</span>";
            }
            total_love_str += "份爱心";
            this.total_love = total_love_str;
            if (this.page == 1) {
              this.charitys = ret["data"]["charity"];
            } else {
              var charitys_new = ret["data"]["charity"];
              if (charitys_new && charitys_new.length) {
                for (var i = 0; i < charitys_new.length; i++) {
                  this.charitys.push(charitys_new[i]);
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
    }
  }
};
</script>

<style scoped>
/*
.navtop-yellow { z-index:123456; position:fixed; left:0; top:0; width:100%; text-align:center; height:0.45rem; line-height:0.44rem; font-size:0.18rem; color:#000000; background:#ffffff; }
.navtop-yellow i.back { position:absolute; left:0; top:0; width:0.4rem; height:0.4rem; background:url("../../assets/images/charity_back.png") center center no-repeat; background-size:0.1rem 0.18rem; }
*/
.navTop a {
  position: absolute;
  right: 0.2rem;
  top: 0;
  color: #f87f19;
}
/*
.welfare-num{ padding-top:0.45rem; width:100%; overflow:hidden; padding:0.1rem 0; background:#6d6d6d; color:#ffffff; text-align:center; font-size:0.14rem;}
.welfare-num span{ display:inline-block; background:#ffffff; padding:0.05rem 0.05rem;  color:#6d6d6d; margin-left:0.02rem;margin-right:0.02rem;}
*/
.welfare-list {
  overflow: hidden;
  padding-top: 0.45rem;
  padding-bottom: 0.2rem;
}
.welfare-list li {
  position: relative;
  border-bottom: #e5e5e5 1px solid;
  overflow: hidden;
  margin-bottom: 0.15rem;
}
.welfare-list li .pic {
  overflow: hidden;
  position: relative;
}
.welfare-list li .operation {
  position: absolute;
  left: 0.2rem;
  bottom: 0.3rem;
}
.welfare-list li .operation .btn {
  width: 0.73rem;
  height: 0.24rem;
  background: url("~@/assets/images/bnt-vote.png") center center no-repeat;
  background-size: contain;
}
.welfare-list li .operation .num {
  margin-top: 0.1rem;
  font-size: 0.13rem;
  color: #f87f19;
}
.welfare-list li .operation .num span {
  font-size: 0.23rem;
}
.welfare-list li .info {
  padding: 0.1rem 0.15rem;
  overflow: hidden;
  color: #333333;
  font-size: 0.16rem;
}
.welfare-list li .info .name {
  float: left;
}
.welfare-list li .info .num {
  float: right;
  color: #a7a7a7;
}
.welfare-list li .info .num span {
  color: #ff0101;
}
.welfare-list .review {
  background: #dddddd;
  color: #6d6d6d;
  height: 0.45rem;
  line-height: 0.44rem;
  text-align: center;
  font-size: 0.16rem;
}
</style>
