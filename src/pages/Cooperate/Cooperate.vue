<template>
  <div>
    <div class="navTop">
      <router-link :to="{path: '/'}">
        <i class="iconfont back">&#xe609;</i>
      </router-link>
      <span class="navCon">合作入驻</span>
    </div>
    <div class="ask pt45">
      <div class="tips2">
        <p class="tips_title2">填写基本资料</p>
      </div>
      <div class="ping_wrap">
        <div class="inp">
          <span class="content">店名</span>
          <input type="text" class="fl" placeholder="店名" id="name" name="name" ref="name" />
        </div>
        <div class="inp">
          <span class="content">称呼</span>
          <input
            type="text"
            class="fl"
            id="username"
            name="username"
            ref="username"
            :value="nickname"
          />
        </div>
        <div class="inp">
          <span class="content">电话</span>
          <input type="text" class="fl" placeholder="电话" id="phone" name="phone" ref="phone" />
        </div>
      </div>
      <div class="btn-wrap" v-on:click="addEnroll()">
        <div class="sub">
          <span>确认提交</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast } from "mint-ui";

  import Error from "@/components/Error";
  import Tab from "@/components/Tab";
  import Config from "@/config/config";
  import Storage from "@/storage/storage";

  export default {
    components: {
      Error,
      Tab
    },

    data() {
      return {
        isError: false,
        error: "",
        nickname: "",
        whoami: "user/whoami/",
        govUrl: "company_enroll/add/"
      };
    },

    beforeMount: function() {
      if (Storage.getAuthUid()) {
        this.$http.get(this.whoami, {}).then(response => {
          const ret = JSON.parse(response.data);
          if (ret && ret["code"] === 0) {
            this.nickname = ret["nickname"];
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
      fullUrl: function(url) {
        return Config.baseUrl + url;
      },

      addEnroll: function() {
        var name = this.$refs.name.value;
        if (!name) {
          Toast("请填写店铺名称!");
          return;
        }
        //     var address = this.$refs.address.value
        //     if(!address){
        //        Toast('请填写店铺地址!')
        //        return;
        //      }
        var phone = this.$refs.phone.value;
        if (!phone) {
          Toast("请填写店铺电话!");
          return;
        }
        var username = this.$refs.username.value;
        this.getEnroll(name, "", phone, username);
      },

      getEnroll(name, address, phone, username) {
        this.$http
          .post(this.govUrl, {
            name: name,
            address: address,
            phone: phone,
            username: username
          })
          .then(
            response => {
              const ret = JSON.parse(response.data || "[]");
              if (ret && ret.code === 0) {
                Toast("报名成功,请耐心等待客服!");
                this.$router.push("/user");
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
  .pt45 {
    position: fixed;
    top: 7.5%;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: url("~@/assets/images/cooperateBg/cooperateBg.jpg") center
      center no-repeat;
    background-size: 100% 100%;
  }
  .ask {
    overflow: hidden;
    font-family: LanTinging;
  }
  .ask .text {
    overflow: hidden;
    padding: 0.15rem;
  }
  .ask .text input {
    width: 100%;
    padding: 5%;
    overflow: hidden;
    border: none;
    outline: none;
    background: #ffffff;
    font-size: 18px;
  }
  .ask .text .cell_user {
    width: 100%;
    padding: 5%;
    overflow: hidden;
    border: none;
    outline: none;
    background: #ffffff;
    font-size: 18px;
  }
  .ask .tips {
    padding: 0 0.15rem;
    overflow: hidden;
    color: #a5a5a5;
    font-size: 0.12rem;
  }
  .tips .tips_title {
    font-size: 20px;
    font-weight: 500;
    padding-top: 0.15rem;
    color: #000000;
  }
  .tips .tips_content {
    font-size: 15px;
    line-height: 25px;
  }
  .ask .tips2 {
    position: absolute;
    top: 17%;
    z-index: 503;
    width: 100%;
    overflow: hidden;
    font-size: 0.18rem;
    letter-spacing: 1px;
    color: #ffffff;
    text-align: center;
  }
  .cell_right {
    font-size: 0.15rem;
    color: #888;
    padding-top: 0 0.15rem;
    margin-right: 10px;
  }
  .btn-wrap {
    width: 85%;
    line-height: 0.46rem;
    font-size: 0.16rem;
    text-align: center;
    border-radius: 5px;
    margin-left: 7.5%;
    margin-top: 106%;
    display: -webkit-box;
    overflow: hidden;
    background: url("~@/assets/images/cooperateBg/cooperateBtn.jpg") center
      center no-repeat;
    background-size: 100% 100%;
  }
  .btn-wrap .sub {
    width: 100%;
  }
  .ping_wrap {
    position: absolute;
    width: 85%;
    top: 24.5%;
    left: 7.5%;
    background: url("~@/assets/images/cooperateBg/cooperateDiv.png") center center no-repeat;
    background-size: 100% 100%;
  }
  .ping_wrap .inp {
    width: 90%;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid rgb(96, 96, 96);
    background-size: 100% 100%;
  }
  .ping_wrap .inp:nth-of-type(3) {
    margin-bottom: 25px;
  }
  .inp .inp_username {
    text-align: center;
    padding-left: 3%;
  }
  .inp .content {
    display: inline-block;
    width: 20%;
    height: 0.4rem;
    /* float: left; */
    text-align: center;
    font-size: 0.16rem;
    font-weight: 100;
    line-height: 0.4rem;
    color: #ffffff;
    letter-spacing: 1px;
  }
  .ping_wrap .inp input {
    width: 78%;
    height: 0.4rem;
    color: #ffffff;
    font-size: 0.16rem;
    outline: none;
    border: none;
    background-color: transparent;
    border-color: transparent;
    -webkit-appearance: none;
    line-height: 0.4rem;
    vertical-align: middle;
    font-family: LanTinging;
  }
  .fl {
    float: left;
  }
</style>
