<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">评价</span>
    </div>
    <div class="comm-page">
      <div class="logo-name">
        <img v-if="company['logo']" :src="fullUrl(company['logo'])+'!200.200'" />
        <span>{{company['name']}}</span>
      </div>
      <div class="line-txt">
        <p class="line"></p>
        <div class="t">为商家服务打分</div>
      </div>
      <div class="sta">
        <span v-on:click="star(0)" v-bind:class="[star_num > 0 ? 'qa2' : '']"></span>
        <span v-on:click="star(1)" v-bind:class="[star_num > 1 ? 'qa2' : '']"></span>
        <span v-on:click="star(2)" v-bind:class="[star_num > 2 ? 'qa2' : '']"></span>
        <span v-on:click="star(3)" v-bind:class="[star_num > 3 ? 'qa2' : '']"></span>
        <span v-on:click="star(4)" v-bind:class="[star_num > 4 ? 'qa2' : '']"></span>
      </div>
      <div class="taglist">
        <template v-for="(tag, index) in tags">
          <span 
            :key="index"
            v-on:click="tagClick(tag.i,tag.k)"
            v-bind:class="[tag['isclass']? 'org' : '']">
            {{tag['n']}}
          </span>
        </template>
      </div>
      <div class="text-area">
        <textarea
          placeholder="说说那里满意，帮大家选择"
          name="content"
          id="content"
          cols="30"
          rows="4"
          ref="content"
        ></textarea>
      </div>
      <div class="line-txt">
        <p class="line"></p>
        <div class="t">请选择想推荐或吐槽的商品</div>
      </div>
      <div class="plist">
        <template v-for="(product, index) in products">
          <li :key="index">
            <span>{{product['name']}}</span>
            <div class="fr">
              <!-- 加上da2 和db2为带颜色图标-->
              <span
                class="da"
                v-on:click="addLike(product['id'],1)"
                v-bind:class="[product['islike'] == 1 ? 'da2' : '']"
              ></span>
              <span
                class="db"
                v-on:click="addLike(product['id'],2)"
                v-bind:class="[product['islike'] == 2 ? 'db2' : '']"
              ></span>
            </div>
          </li>
        </template>
      </div>
      <div class="gline"></div>
      <div class="gline"></div>
      <div class="comm-btn">
        <div class="fl">匿名评价</div>
        <label class="ui-switch">
          <input type="checkbox" id="change_btn" v-on:click="change_btn()" />
        </label>
      </div>
      <div class="size5"></div>
      <div class="fixed-bot">
        <div class="obtn" v-on:click="commit()">提交评价</div>
      </div>
    </div>
  </div>
</template>
<script>
import Config from "@/config/config.js";
import storage from "@/storage/storage.js";
import { Toast } from "mint-ui";

export default {
  components: {},
  data() {
    return {
      products: [],
      tags: [],
      company: [],
      isError: false,
      error: "",
      viewUrl: "payment/pingjia/",
      whoami: "user/whoami/",
      likeUrl: "like/add/",
      username: "",
      id: 0,
      content: "",
      isClass: 0,
      star_num: 0,
      tag_str: "",
      change_val: 0,
      commentUrl: "comment/company/"
    };
  },
  mounted() {
    this.id = +this.$route.params.id;
    if (!(this.id > 0)) {
      this.isError = true;
      this.error = "参数错误";
    } else {
      if (storage.getAuthUid()) {
        this.$http.get(this.whoami, {}).then(response => {
          const ret = JSON.parse(response.data);
          if (ret && ret["code"] === 0) {
            this.username = ret["nickname"] ? ret["nickname"] : ret["username"];
          }
        });
      }
      this.getData(this.id);
    }
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },

    defaultPicUrl: function() {
      return Config.defaultPic;
    },

    star: function(index) {
      this.star_num = index * 1 + 1;
    },

    change_btn: function() {
      this.change_val = this.change_val ? 0 : 1;
    },

    tagClick: function(index, index_val) {
      var index = index;
      if (this.tags[index]["isclass"]) {
      } else {
        this.tags[index]["isclass"] = 1;
        this.tag_str = this.tag_str
          ? this.tag_str + "," + index_val
          : index_val;
      }
    },
    commit: function() {
      if (!this.username) {
        this.$router.push("/login");
        return;
      }
      if (this.star_num > 0) {
        var content = this.$refs.content.value;
        if (this.change_val == 1) {
          this.username = "匿名用户";
        }
        this.getComment(this.company["id"], content);
      } else {
        Toast("请对店铺进行评价");
      }
    },

    addLike: function(linkid, isLike) {
      if (!this.username) {
        this.$router.push("/login");
        return;
      }
      var updown = isLike;
      for (var i = 0, len = this.products.length; i < len; i++) {
        if (this.products[i]["id"] == linkid) {
          if (updown == 1) {
            this.products[i]["islike"] = 1;
          } else {
            this.products[i]["islike"] = 2;
          }
          break;
        }
      }
      this.getLike(linkid, updown, 9);
    },

    getData(id) {
      this.$http.post(this.viewUrl, { id: id }).then(response => {
        const ret = JSON.parse(response.data || "[]");
        if (ret && ret.code === 0) {
          this.company = ret["data"]["company"];
          this.products = ret["data"]["product"];
          this.tags = ret["data"]["tag"];
        } else {
          this.error = (ret && ret.msg) || "";
          this.isError = true;
        }
      });
    },

    getLike(linkid, updown, type) {
      this.$http
        .post(this.likeUrl, { linkid: linkid, updown: updown, type: type })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
            } else {
              this.error = (ret && ret.msg) || "";
              this.isError = true;
            }
          },
          response => {
            this.isError = true;
            this.error = "";
          }
        );
    },

    getComment(linkid, content) {
      this.$http
        .post(this.commentUrl, {
          linkid: linkid,
          content: content,
          username: this.username,
          star: this.star_num,
          id: this.$route.params.id,
          tag_str: this.tag_str
        })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              Toast("评论成功!");
              this.$router.push("/orderlist/");
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
.comm-page {
  background: #fff;
  overflow: hidden;
  padding-top: 0.45rem;
}
.logo-name {
  margin-top: 1.5%;
  padding: 0.1rem;
  overflow: hidden;
  text-align: center;
}
.logo-name img {
  display: inline-block;
  width: 0.4rem;
  height: 0.4rem;
  overflow: hidden;
  border-radius: 0.4rem;
  vertical-align: middle;
}
.logo-name span {
  font-size: 0.18rem;
  vertical-align: middle;
}
.line-txt {
  position: relative;
  width: 96%;
  margin: auto;
  margin-top: 1.5%;
  text-align: center;
  color: #999999;
  font-size: 0.14rem;
  overflow: hidden;
}
.line-txt .line {
  width: 100%;
  height: 0.1rem;
  position: absolute;
  left: 0;
  top: 0;
  border-bottom: #eeeeee 1px solid;
}
.line-txt .t {
  position: relative;
  z-index: 12;
  display: inline-block;
  background: #ffffff;
  padding: 0 0.1rem;
}
.sta {
  width: 75%;
  margin: auto;
  margin-top: 5%;
  overflow: hidden;
}
.sta span {
  display: inline-block;
  width: 14%;
  height: 0.4rem;
  margin-left: 4%;
  background: url("~@/assets/images/qa1.png") top center no-repeat;
  background-size: contain;
}
.sta .qa2 {
  background: url("~@/assets/images/qa2.png") top center no-repeat;
  background-size: contain;
}
.taglist {
  padding: 0.1rem;
  overflow: hidden;
}
.taglist span {
  display: inline-block;
  margin-right: 0.05rem;
  padding: 0 0.1rem;
  height: 0.25rem;
  line-height: 0.25rem;
  border-radius: 0.25rem;
  color: #999999;
  border: #dfdfdf 1px solid;
}
.taglist span.org {
  background: #fff5e9;
  color: #ff6432;
  border: #ff6432 1px solid;
}
.text-area {
  padding: 0.1rem;
  overflow: hidden;
}
.text-area textarea {
  width: 93%;
  padding: 3%;
  border: #dddddd 1px solid;
  background: #f9f9f9;
  border-radius: 5px;
}
.plist {
  padding: 0.1rem;
  padding-bottom: 0;
  overflow: hidden;
  font-size: 0.14rem;
  color: #666666;
}
.plist .fr span {
  display: inline-block;
  width: 0.35rem;
  height: 0.25rem;
}
.plist .da {
  background: url("~@/assets/images/da1.png") top center no-repeat;
  background-size: contain;
}
.plist .da2 {
  background: url("~@/assets/images/da2.png") top center no-repeat;
  background-size: contain;
}
.plist .db {
  background: url("~@/assets/images/db1.png") top center no-repeat;
  background-size: contain;
}
.plist .db2 {
  background: url("~@/assets/images/db2.png") top center no-repeat;
  background-size: contain;
}
.gline {
  width: 100%;
  height: 0.1rem;
  overflow: hidden;
  background: #eeeeee;
}
.comt {
  background: #ffffff;
  padding: 0.1rem;
  overflow: hidden;
  font-size: 0.14rem;
}
.sta2 {
  float: right;
  width: 55%;
  margin: 0;
  overflow: hidden;
}
.sta2 span {
  display: inline-block;
  width: 12%;
  height: 0.2rem;
  margin-left: 5%;
  background: url("~@/assets/images/qa1.png") top center no-repeat;
  background-size: contain;
}
.comm-btn {
  padding: 0.1rem;
  padding-bottom: 0.03rem;
  overflow: hidden;
  background: #ffffff;
  font-size: 0.14rem;
}
.ui-switch {
  position: relative;
  z-index: 1232;
  float: right;
  width: 0.7rem;
  height: 0.3rem;
  line-height: 0.3rem;
}
.ui-switch input {
  width: 0.7rem;
  height: 0.3rem;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  border: 0;
  background: 0 0;
  -webkit-appearance: none;
  outline: 0;
}
.ui-switch input:before {
  content: "";
  width: 0.48rem;
  height: 0.2rem;
  border: 1px solid #dfdfdf;
  background-color: #fdfdfd;
  border-radius: 0.2rem;
  cursor: pointer;
  display: inline-block;
  position: relative;
  vertical-align: middle;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  border-color: #dfdfdf;
  -webkit-box-shadow: #dfdfdf 0 0 0 0 inset;
  box-shadow: #dfdfdf 0 0 0 0 inset;
  -webkit-transition: border 0.4s, -webkit-box-shadow 0.4s;
  transition: border 0.4s, box-shadow 0.4s;
  -webkit-background-clip: content-box;
  background-clip: content-box;
}
.ui-switch input:checked:before {
  border-color: #ff6432;
  -webkit-box-shadow: #ff6432 0 0 0 0.16rem inset;
  box-shadow: #ff6432 0 0 0 0.16rem inset;
  transition: border 0.4s, box-shadow 0.4s, background-color 1.2s;
  -webkit-transition: border 0.4s, -webkit-box-shadow 0.4s,
    background-color 1.2s;
  background-color: #ff6432;
}
.ui-switch input:checked:after {
  left: 0.28rem;
}
.ui-switch input:after {
  content: "";
  width: 0.2rem;
  height: 0.2rem;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 100%;
  background-color: #ffffff;
  -webkit-box-shadow: 0 0.01rem 0.03rem rgba(0, 0, 0, 0.4);
  box-shadow: 0 0.01rem 0.03rem rgba(0, 0, 0, 0.4);
  -webkit-transition: left 0.2s;
  transition: left 0.2s;
}
.size5 {
  width: 100%;
  height: 0.5rem;
  overflow: hidden;
}
.fixed-bot {
  width: 100%;
  height: 0.5rem;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 123;
  background: #ffffff;
  border-top: #eee 1px solid;
}
.fixed-bot .obtn {
  float: right;
  width: 45%;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-size: 0.16rem;
  color: #ffffff;
  background: #ff6432;
}
</style>
