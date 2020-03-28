<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">{{name}}</span>
      <i class="iconfont sea">&#xe603;</i>
    </div>
    <div
      class="film-list"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="isLoading"
      infinite-scroll-distance="10"
    >
      <div class="navsize"></div>
      <div class="list">
        <template v-for="(video_data, index) in video_list">
          <!-- 
            Vue中的key到底有什么作用?
            key是给每一个vnode的唯一id, 依靠key, 我们的diff操作可以更准确、更快捷(对于简单列表渲染来说diff节点也更快, 但会产生一些隐藏的副作用, 比如可能不会产生过渡效果, 或者在某些节点有绑定数据(表单)状态，会出现状态错位。)

            diff算法过程中, 先会进行新旧节点的首尾交叉对比, 当无法匹配的时候会用新节点的key与旧节点进行比对，从而找到相应旧节点。

            更准确: 因为带key就不是就地复用了，在sameNode函数a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确, 如果不加key, 会导致之前节点的状态被保留下来, 会产生一系列的bug。

            更快速: key的唯一性可以被Map数据结构充分利用, 相比于遍历查找的时间复杂度O(n), Map的时间复杂度仅仅为O(1), 源码如下:

            function createKeyToOldIdx(children, beginIdx, endIdx) {
              let i, key;
              const map = {};
              for (i = beginIndex, i <= endIndex; ++i) {
                key = children[i].key;
                if (isDef(key)) map[key] = i;
              }
              return map;
            }
           -->
          <div class="box" :key="index">
            <router-link :to="{ path: '/filmdetail/'+video_data.id}">
              <img :src="fullUrl(video_data['picture'])+'!182.263'" />
              <p>{{video_data['title']}}</p>
              <p>播放：{{video_data['hit']}}</p>
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import Error from "@/components/Error";
  import Config from "@/config/config";
  import { Toast } from "mint-ui";

  export default {
    components: {
      Error
    },

    data() {
      return {
        isError: false,
        error: "",
        video_list: [],
        category: 0,
        type: 0,
        page: 0,
        total: 0,
        name: "",
        videoUrl: "video/viewlist/"
      };
    },
    
    mounted() {
      this.category = +this.$route.params.category;
      this.type = +this.$route.params.type;
    },

    methods: {
      fullUrl: function(url) {
        return Config.baseUrl + url;
      },

      defaultPicUrl: function() {
        return Config.defaultPic;
      },

      loadMore() {
        if (this.page <= this.total) {
          this.getData();
        }
        if (this.page == this.total) {
          this.page = this.page + 1;
        }
      },

      getData() {
        this.$http
          .post(this.videoUrl, { category: this.category, type: this.type })
          .then(
            response => {
              const ret = JSON.parse(response.data || "[]");
              if (ret && ret.code === 0) {
                this.page = ret["data"]["page"];
                this.name = ret["data"]["name"];
                if (this.page == 1) {
                  this.video_list = ret["data"]["videolist"];
                  if (!(this.video_list.length > 0)) {
                    Toast("已经加载完毕,没有数据");
                    return;
                  }
                } else {
                  var video_list_new = ret["data"]["videolist"];
                  if (video_list_new && video_list_new.length) {
                    for (var i = 0; i < video_list_new.length; i++) {
                      this.video_list.push(video_list_new[i]);
                    }
                  }
                }
                this.total = ret["data"]["total"];
                if (this.page <= this.total) {
                  this.page = this.page + 1;
                }
              } else {
                Toast(ret.msg);
                this.error = (ret && ret.msg) || "";
                this.isError = true;
              }
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
.navsize {
  width: 100%;
  height: 0.45rem;
  overflow: hidden;
}
.navTop .sea {
  color: #fff;
}
.film-list {
  overflow-y: auto;
  background: #141414;
  overflow-x: hidden;
  min-height: 100vh;
}
.film-list .list {
  display: -webkit-flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.film-list .box {
  width: 28%;
  margin-top: 5%;
  margin-left: 4%;
}
.film-list .box img {
  width: 100%;
}
.film-list .box p:nth-of-type(1) {
  margin-top: 0.05rem;
  color: #ffffff;
  font-size: 0.14rem;
}
.film-list .box p:nth-of-type(2) {
  color: #afafaf;
  font-size: 0.12rem;
}
</style>
