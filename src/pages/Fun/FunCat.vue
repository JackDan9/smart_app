<template>
  <div>
    <div class="navTop">
      <a href="javascript:history.go(-1)">
        <i class="iconfont back">&#xe609;</i>
      </a>
      <span class="navCon">{{name}}</span>
    </div>
    <div class="seize"></div>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="isLoading"
      infinite-scroll-distance="10"
    >
      <template v-for="fun_data in funs">
        <div class="fun-box">
          <a v-on:click="funClick(fun_data.id)">
            <div class="pic">
              <img
                v-if="fun_data['picture']"
                :src="fullUrl(fun_data['picture'])+'!640.398'"
                class="w100"
                alt
              />
            </div>
          </a>
          <div class="info">
            <div class="p1">【{{fun_data['companyid']}}】{{fun_data['name']}}</div>
            <div class="p2">
              <div class="fl">{{fun_data['type']}} {{fun_data['opentime']}}</div>
              <div class="fr" v-if="fun_data['price']">￥{{fun_data['price']}}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import Loading from "../../components/Loading.vue";
import Error from "../../components/Error.vue";
import Tab from "../../components/Tab.vue";
import Config from "../../config.js";

export default {
  components: {
    Error
  },
  data() {
    return {
      funs: [],
      name: "",
      category: 0,
      isLoading: false,
      isError: false,
      error: "",
      viewListUrl: "fun/viewlist/"
    };
  },
  mounted() {
    this.category = +this.$route.params.type;
    this.getData();
  },

  watch: {
    $route(to, from) {
      this.getData();
    }
  },

  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },
    funClick: function(id) {
      window.location.href = "#/fun/" + id;
    },
    loadMore() {
      this.getData();
    },

    getData() {
      this.$http
        .post(this.viewListUrl, { page: this.page, type: this.category })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              this.page = ret["data"]["page"];
              this.name = ret["data"]["name"];
              if (this.page == 1) {
                this.funs = ret["data"]["funlist"];
              } else {
                var funs_new = ret["data"]["funlist"];
                if (funs_new && funs_new.length) {
                  for (var i = 0; i < funs_new.length; i++) {
                    this.funs.push(funs_new[i]);
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
.seize {
  width: 100%;
  height: 0.45rem;
  overflow: hidden;
}
.fun-box {
  overflow: hidden;
  background: #ffffff;
}
.fun-box .pic {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.fun-box .info {
  overflow: hidden;
  padding: 0.1rem;
}
.fun-box .info .p1 {
  font-size: 0.16rem;
}
.fun-box .info .p2 {
  font-size: 0.14rem;
  color: #787878;
  margin-top: 0.05rem;
}
.fun-box .info .p2 .fr {
  color: #333;
}
.classify-box {
  overflow: hidden;
  padding: 0.1rem 0;
  background: #f3f3f3;
}
.classify-box li {
  width: 20%;
  margin-left: 2.5%;
  margin-right: 2.5%;
  float: left;
  background: #ffffff;
  margin-top: 0.05rem;
  margin-bottom: 0.05rem;
  padding: 0.15rem 0;
  text-align: center;
}
.classify-box li a {
  font-size: 0.14rem;
  color: #636363;
}
</style>
