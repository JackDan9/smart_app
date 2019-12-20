<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" v-on:click="goBack();">&#xe609;</i>
      <div class="fr-btn">
        <i
          class="iconfont share"
          v-on:click="shareLink(disProduct.name, fullUrl(disProduct.picture))"
        >&#xe60f;</i>
      </div>
    </div>
    <div class="banner" v-infinite-scroll="loadMore">
      <div class="productPic">
        <img v-if="disProduct.picture" :src="fullUrl(disProduct.picture)+'!640.398'" />
      </div>
    </div>
    <div class="productDetailPage">
      <div class="productTitle">
        <span>{{disProduct.name}}</span>
      </div>
      <div class="productInfo">
        <div class="priceInfo">
          <span class="price">
            <i class="iconfont moneyIcon">&#xe600;</i>
            <i class="moneyNum">{{parseFloat(disProduct.ms_price)}}</i>
          </span>
          <span class="oldPrice">
            <i class="iconfont oldMoneyIcon">&#xe600;</i>
            <i class="oldMoneyNum">{{parseFloat(disProduct.price1)}}</i>
          </span>
          <span class="inventory">
            仅剩
            <i>{{disProduct.num}}</i>
          </span>
        </div>
        <div class="buyInfo">
          <span>
            <i>{{disProduct.ms_num}}</i>人购买
          </span>
        </div>
      </div>
      <div class="productParam">
        <div class="paramTitle">
          <i class="productParamIcon"></i>
          <span class="productParamCon">商品参数</span>
        </div>
        <div class="paramCon" v-html="disProduct.detail"></div>
      </div>
      <div class="productComment">
        <div class="commentHeader">
          <div class="left">
            <span class="commentTitle">商品评价 (</span>
            <span class="commentNum">{{data.rows}}</span>
            <span class="rightBracket">)</span>
          </div>
          <div class="right" v-on:click="commentDetail()">
            <span>查看全部</span>
            <i class="goIcon"></i>
          </div>
        </div>
        <div class="commentList">
          <li class="index" v-for="(item, index) in comments" :key="index">
            <div class="personInfo">
              <div class="left">
                <i class="iconMale"></i>
                <div class="img">
                  <img
                    v-bind:src="[item.picture ? fullUrl(item.picture) : defaultPicUrl()]"
                    alt="Smart App"
                    class="personIconImg"
                  />
                </div>
                <span class="username">{{item.username}}</span>
              </div>
              <div class="right">
                <span class="commentTime">{{item.addtime}}</span>
              </div>
            </div>
            <div class="commentInfo">
              <span>{{item.content}}</span>
            </div>
            <div class="likedInfo">
              <i
                v-bind:class="[item.isLike ? 'iconfont likedIcon' : 'iconfont noLikedIcon']"
                v-on:click="addLike(item.id, item.isLike, 'star')"
              >&#xe614;</i>
              <span class="likedNum">{{item.vote}}</span>
            </div>
          </li>
        </div>
        <div class="productFooter">
          <div class="left">
            <a
              href="javascript:;"
              onclick="easemobim.bind({configId: '2434a302-9b3f-41de-b69d-8c8ed718e1a5'})"
            >
              <i class="serviceIcon"></i>
              <span class="serviceCon">联系客服</span>
            </a>
          </div>
          <div
            v-bind:class="[(this.type == 2 && isContent) ? 'right' : 'rightOther']"
            v-on:click="offerOrder()"
          >
            <span class="iconfont moneyIcon">&#xe600;</span>
            <span class="moneyNum">{{parseFloat(disProduct.ms_price)}}</span>
            <span class="moneyCon">{{content}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-bind:class="[isActive ? 'finish' : 'finishOther']">
      <i class="iconfont finishIcon">&#xe620;</i>
      <span class="finishCon" v-html="contentWarn"></span>
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import Store from "@/store/store";
import Config from "@/config/config";
import { Toast } from "mint-ui";
import WxShare from "@/utils/wx/wx";
export default {
  components: {
    Error
  },
  data() {
    return {
      disProduct: "",
      data: "",
      comments: [],
      isActive: false,
      isContent: false,
      isLoading: false,
      isError: false,
      error: "",
      type: 0,
      contentWarn: "",
      content: "",
      starttime: "",
      username: "",
      whoami: "user/whoami/",
      wxShareUrl: "share/",
      viewUrl: "discount/view/",
      viewListUrl: "comment/starlist/",
      likeUrl: "like/add/"
    };
  },
  mounted() {
    if (Store.getAuthUid()) {
      this.$http.get(this.whoami, {}).then(response => {
        const ret = JSON.parse(response.data);
        if (ret && ret["code"] === 0) {
          this.username = ret["nickname"] ? ret["nickname"] : ret["username"];
        }
      });
    }
    const id = +this.$route.params.id;
    if (!id) {
      this.isError = true;
      this.error = "参数错误";
    } else {
      this.isLoading = true;
      this.getData(() => window.scrollTop(0, 0));
    }
    const page = 0;
    const list = 2;
    this.getWx();
    this.getCommentData(page, list, id);
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },
    defaultPicUrl: function() {
      return Config.defaultPic;
    },
    goBack: function() {
      this.$router.replace("/productlist/");
    },
    getWx: function() {
      this.$http
        .post(this.wxShareUrl, {
          url: window.location.href,
          id: this.$route.params.id,
          type: 6
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
    shareLink: function(text, pic) {
      var share = {
        action: "share",
        url: window.location.href,
        title: text,
        img: pic
      };
      if (window.postMessage) window.postMessage(JSON.stringify(share), "*");
      return true;
    },
    loadMore() {
      document.addEventListener("scroll", this.winScroll(), false);
    },
    winScroll: function() {
      var scrollTop =
        document.body.scrollTop > 100 ? 100 : document.body.scrollTop;
      document.getElementsByClassName("navTop")[0].style.background =
        "rgba(0,0,0," + scrollTop / 100 + ")";
    },
    addLike: function(linkid, isLike, type) {
      if (!this.username) {
        this.$router.push("/login");
        return;
      }
      var updown = isLike == 1 ? 2 : 1;
      for (var i = 0, len = this.comments.length; i < len; i++) {
        if (this.comments[i]["id"] == linkid) {
          this.comments[i]["isLike"] = updown === 1 ? 1 : 0;
          this.comments[i]["vote"] =
            updown === 1
              ? this.comments[i]["vote"] * 1 + 1
              : this.comments[i]["vote"] * 1 - 1;
          break;
        }
      }
      if (i < len) {
        this.getLike(linkid, updown, 10);
      }
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
    commentDetail: function() {
      if (this.comments == "") {
        Toast("暂时没有评论!");
      } else {
        this.$router.replace("/commentdetail/" + this.$route.params.id);
      }
    },
    offerOrder: function() {
      if (!this.username) {
        this.$router.push("/login");
        return;
      }
      if (this.type == 0 || this.type == 1) {
        this.isActive = true;
        this.contentWarn =
          "很抱歉，本组商品已经结束<br/> 请留意开场时间，准时抢购";
        setTimeout(() => {
          this.isActive = false;
        }, 1500);
      } else if (this.type == 2) {
        let date = new Date();
        let time = date.getTime() / 1000;
        if (this.disProduct.num == 0) {
          this.isActive = true;
          this.contentWarn =
            "很遗憾手慢了，本商品已经被抢空<br />，请把握下次开抢机会";
          setTimeout(() => {
            this.isActive = false;
          }, 1500);
        } else if (time < this.starttime) {
          this.isActive = true;
          this.contentWarn =
            "很抱歉，本组商品尚未开抢<br/> 请留意开场时间，准时抢购";
          setTimeout(() => {
            this.isActive = false;
          }, 1500);
        } else {
          this.$router.replace("/offerorder/" + this.disProduct.id);
        }
      } else if (this.type == 3 || this.type == 4) {
        this.isActive = true;
        this.contentWarn =
          "很抱歉，本组商品尚未开抢<br/> 请留意开场时间，准时抢购";
        setTimeout(() => {
          this.isActive = false;
        }, 1500);
      }
    },
    getData() {
      this.$http.post(this.viewUrl, { id: this.$route.params.id }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.disProduct = ret.data;
            this.type = ret.type;
            this.starttime = ret.data.starttime;
            if (this.type == 1) {
              this.content = "已开抢";
            } else if (this.type == 2) {
              let date = new Date();
              let time = date.getTime() / 1000;
              if (time < this.starttime) {
                this.content = "即将开抢";
              } else {
                this.isContent = true;
                this.content = "立即抢购";
              }
            } else if (this.type == 3) {
              this.content = "即将开抢";
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
    getCommentData(page, list, id) {
      this.$http
        .post(this.viewListUrl, { page: page, list: list, id: id })
        .then(
          response => {
            const ret = JSON.parse(response.data || "[]");
            if (ret && ret.code === 0) {
              this.data = ret.data;
              this.comments = ret.data.star;
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
/* Banner图 */
.banner {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
}
.productPic {
  height: 100%;
  color: #ffffff;
  font-size: 30px;
  text-align: center;
}
.banner img {
  width: 100%;
}
/* 主页 */
.productDetailPage {
  display: block;
}
/* 产品标题 */
.productTitle {
  display: block;
  width: 97%;
  height: auto;
  line-height: 0.25rem;
  margin-left: 0.1rem;
  font-size: 0.16rem;
  font-weight: bold;
}
/* 产品信息 */
.productInfo {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
  margin-left: 0.1rem;
}
.productInfo .priceInfo {
  display: inline-block;
  width: 66%;
}
.productInfo .priceInfo .price {
  display: inline-block;
  font-size: 0;
  font-weight: bold;
  color: red;
}
.moneyIcon {
  font-size: 0.12rem;
  font-family: -webkit-body;
}
.moneyNum {
  font-size: 0.25rem;
}
.productInfo .priceInfo .oldPrice {
  display: inline-block;
  font-size: 0;
  text-decoration: line-through;
  color: #c0c0c0;
}
.oldMoneyIcon {
  font-size: 0.12rem;
  font-family: -webkit-body;
}
.oldMoneyNum {
  font-size: 0.12rem;
}
.productInfo .priceInfo .inventory {
  display: inline-block;
  width: 30%;
  text-align: right;
  font-size: 0.12rem;
  color: #c0c0c0;
}
.buyInfo {
  display: inline-block;
  width: 30%;
  height: 0.25rem;
  line-height: 0.25rem;
  text-align: right;
}
/* 评论信息 */
.productComment {
  display: block;
  border-top: 5px solid #f4f4f4;
  border-bottom: 5px solid #f4f4f4;
  margin-bottom: 0.5rem;
}
.productComment .commentHeader {
  display: block;
  height: 0.5rem;
  margin-left: 0.1rem;
  line-height: 0.5rem;
  /* vertical-align: middle; */
  font-size: 0;
}
.productComment .commentHeader .left {
  display: inline-block;
}
.commentTitle {
  display: inline-block;
  font-size: 0.15rem;
  font-weight: bold;
}
.commentNum {
  display: inline-block;
  font-size: 0.15rem;
  font-weight: bold;
  color: red;
}
.rightBracket {
  display: inline-block;
  font-size: 0.15rem;
  font-weight: bold;
}
.productComment .commentHeader .right {
  display: inline-block;
  overflow: hidden;
  /* float: right; */
  margin-right: 0.1rem;
  font-size: 0.15rem;
  color: #787878;
}
.goIcon {
  display: inline-block;
  /* float: right; */
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.135rem;
  margin-left: 0.1rem;
  background: url("~@/assets/images/SpecialOffer/productDetail/goIcon.png") center center no-repeat;
  background-size: contain;
}
/* 评论用户信息 */
.commentList {
  display: block;
  border-top: 5px solid #f4f4f4;
}
.commentList .index {
  display: block;
  padding: 0.15rem 0.1rem;
  border-bottom: 1px solid #f4f4f4;
}
.commentList .index .personInfo {
  display: block;
}
.commentList .index .left {
  display: inline-block;
  position: relative;
  width: 69%;
}
.iconMale {
  display: inline-block;
  position: absolute;
  z-index: 503;
  left: 0;
  top: 0;
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 0.2rem;
  background: url("~@/assets/images/user/icon-male.png") center center no-repeat;
  background-size: 0.1rem, 0.1rem;
  background-color: #28b4aa;
}
.img {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  overflow: hidden;
  border-radius: 0.5rem;
}
.img .personIconImg {
  display: inline-block;
  width: 100%;
  height: 100%;
  font-size: 0.12rem;
}
.username {
  display: inline-block;
  /* float: right; */
  overflow: hidden;
  width: 72%;
  line-height: 0.5rem;
  font-size: 0.15rem;
  font-weight: bold;
}
.commentList .index .right {
  display: inline-block;
  overflow: hidden;
  /* float: right; */
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 0;
}
.commentTime {
  font-size: 0.15rem;
}
/* 评论内容 */
.index .commentInfo {
  display: block;
  height: auto;
  line-height: 0.22rem;
  font-size: 0.14rem;
}
/* 点赞 */
.likedInfo {
  display: block;
  height: 0.35rem;
  line-height: 0.35rem;
  text-align: right;
}
.likedInfo .likedIcon {
  color: #ff4b0f;
}
.likedInfo .noLikedIcon {
  color: #c0c0c0;
}
.likedInfo .likedNum {
  display: inline-block;
  /* float: right; */
  font-size: 0.15rem;
  margin-left: 0.1rem;
  color: #787878;
}
/* 商品参数 */
.productParam {
  display: block;
  overflow: hidden;
  padding: 0.1rem 0.1rem;
  border-top: 5px solid #f4f4f4;
}
.productParam .paramTitle {
  display: block;
  height: 0.5rem;
  line-height: 0.5rem;
}
.productParamIcon {
  display: inline-block;
  /* float: left; */
  overflow: hidden;
  width: 0.2rem;
  height: 0.2rem;
  margin-top: 0.14rem;
  background: url("~@/assets/images/SpecialOffer/productDetail/productParam.png") center center no-repeat;
  background-size: contain;
}
.productParamCon {
  display: inline-block;
  margin-left: 0.1rem;
  font-size: 0.15rem;
  font-weight: bold;
}
/* 参数信息 */
.productParam .paramCon {
  display: block;
  overflow: hidden;
  line-height: 0.25rem;
  letter-spacing: 0.005rem;
  font-size: 0.14rem;
}
/* 生产日期 */
.productDate {
  display: block;
  height: 0.5rem;
}
.productDate .dateTitle {
  display: inline-block;
  width: 30%;
  line-height: 0.5rem;
  font-size: 0.15rem;
}
.productDate .dateCon {
  display: inline-block;
  line-height: 0.5rem;
  font-size: 0.15rem;
  color: #c0c0c0;
}
/* 净含量 */
.productWeight {
  display: block;
  height: 0.5rem;
}
.productWeight .weightTitle {
  display: inline-block;
  width: 30%;
  line-height: 0.5rem;
  font-size: 0.15rem;
}
.productWeight .weightCon {
  display: inline-block;
  line-height: 0.5rem;
  font-size: 0.15rem;
  color: #c0c0c0;
}
/* 包装种类 */
.productType {
  display: block;
  height: 0.5rem;
}
.productType .typeTitle {
  display: inline-block;
  width: 30%;
  line-height: 0.5rem;
  font-size: 0.15rem;
}
.productType .typeCon {
  display: inline-block;
  line-height: 0.5rem;
  font-size: 0.15rem;
  color: #c0c0c0;
}
/* 品牌 */
.productBrand {
  display: block;
  height: 0.5rem;
}
.productBrand .brandTitle {
  display: inline-block;
  width: 30%;
  line-height: 0.5rem;
  font-size: 0.15rem;
}
.productBrand .brandCon {
  display: inline-block;
  line-height: 0.5rem;
  font-size: 0.15rem;
  color: #c0c0c0;
}
/* 系列 */
.productSeries {
  display: block;
  height: 0.5rem;
}
.productSeries .seriesTitle {
  display: inline-block;
  width: 30%;
  line-height: 0.5rem;
  font-size: 0.15rem;
}
.productSeries .seriesCon {
  display: inline-block;
  line-height: 0.5rem;
  font-size: 0.15rem;
  color: #c0c0c0;
}
/* 食品口味 */
.productFlavor {
  display: block;
  height: 0.5rem;
}
.productFlavor .flavorTitle {
  display: inline-block;
  width: 30%;
  line-height: 0.5rem;
  font-size: 0.15rem;
}
.productFlavor .flavorCon {
  display: inline-block;
  line-height: 0.5rem;
  font-size: 0.15rem;
  color: #c0c0c0;
}
/* 底部 */
.productFooter {
  display: block;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
}
.productFooter .left {
  display: inline-block;
  overflow: hidden;
  /* float: left; */
  width: 45%;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-size: 0.15rem;
  background: #ffffff;
}
.serviceIcon {
  display: inline-block;
  overflow: hidden;
  /* float: left; */
  width: 35%;
  height: 0.2rem;
  margin-top: 0.12rem;
  background: url("~@/assets/images/SpecialOffer/productDetail/customerService.png")
    right no-repeat;
  background-size: contain;
}
.serviceCon {
  display: inline-block;
  width: 60%;
  font-size: 0.15rem;
  text-align: left;
}
.productFooter .right {
  display: inline-block;
  width: 55%;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-size: 0;
  font-weight: bold;
  background: red;
  color: #fff;
}
.productFooter .rightOther {
  display: inline-block;
  width: 55%;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  font-size: 0;
  font-weight: bold;
  background: #c0c0c0;
  color: #fff;
}
.moneyIcon {
  display: inline-block;
}
.moneyNum {
  display: inline-block;
}
.moneyCon {
  display: inline-block;
  font-size: 0.15rem;
}
/* Toast提示框 */
.finish {
  display: block;
  position: fixed;
  top: 50%;
  width: 94%;
  height: 0.75rem;
  margin: 0 3%;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
}
.finish .finishIcon {
  font-size: 0.35rem;
  overflow: hidden;
  float: left;
  margin-top: 0.15rem;
  margin-left: 0.3rem;
  color: blue;
}
.finish .finishCon {
  display: inline-block;
  margin-top: 0.19rem;
  margin-left: 0.1rem;
  line-height: 0.18rem;
  font-size: 0.14rem;
  color: #fff;
}
.finishOther {
  display: none;
}
</style>