<template>
  <div>
    <div class="navTop">
      <router-link :to="{ path: '/asklist/' + this.$route.params.id ,query: {tab:'hide'}}">
        <i class="iconfont back">&#xe609;</i>
      </router-link>
      <span class="navCon">评论</span>
      <i class="sendIcon" v-on:click="addComment(ask['id'])">发送</i>
    </div>
    <div class="comment">
      <textarea></textarea>
    </div>
  </div>
</template>
<script>
import Error from "@/components/Error";
import Config from "@/config/config";
import storage from "@/storage/storage";
import { Toast } from "mint-ui";
export default {
  components: {
    Error
  },
  data() {
    return {
      ask: [],
      comment_list: [],
      isError: false,
      error: "",
      whoami: "user/whoami/",
      viewUrl: "ask/view/",
      username: "",
      picture: "",
      commentUrl: "comment/add/"
    };
  },
  mounted() {
    if (storage.getAuthUid()) {
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
    }
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },
    getData(callback) {
      this.$http.post(this.viewUrl, { id: this.$route.params.id }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.ask = ret["data"];
            this.comment_list = ret["data"]["comment_list"];
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
    addComment: function(linkid) {
      if (!this.username) {
        this.$router.push("/login");
        return;
      }
      var comment = this.$refs.comment.value;
      this.getComment(linkid, comment);
    },
    getComment(linkid, comment) {
      this.$http
        .post(this.commentUrl, { linkid: linkid, comment: comment, type: 6 })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              Toast("评论成功!");
              var comment_data = {};
              comment_data["username"] = this.username;
              comment_data["comment"] = comment;
              comment_data["vote"] = 0;
              comment_data["id"] = ret.newid;
              comment_data["commenttime"] = "刚刚";
              comment_data["u_picture"] = this.picture;
              this.comment_list.unshift(comment_data);
              this.ask["comment_num"] = this.ask["comment_num"] + 1;
              document.getElementById("comment").value = "";
              this.$router.push("/asklist/" + this.$route.params.id);
            } else {
              Toast(ret.msg);
              this.error = (ret && ret.msg) || "";
              this.isError = true;
            }
          },
          response => {
            this.isError = true;
            this.error = "";
          }
        );
    }
  }
};
</script>
<style scoped>
/* 回答框头部 */
.navTop .sendIcon {
  display: inline-block;
  width: 20%;
  font-size: 0.16rem;
  font-style: normal;
  color: #fff;
  text-align: center;
}
.navTop .navCon {
  width: 66%;
}
/* 回答框 */
.comment {
  width: 100%;
  padding-top: 0.5rem;
}
.comment textarea {
  border: none;
  outline: none;
  width: 90%;
  padding: 5%;
  height: 1rem;
}
</style>