<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">添加收货地址</span>
      <div class="publish" v-on:click="addAdress()">保存</div>
    </div>
    <div class="addr-add pt45">
      <div class="cot">联系人</div>
      <div class="forms">
        <li>
          <div class="name">称呼</div>
          <div class="input">
            <input
              type="text"
              placeholder="请输入您的姓名"
              id="name"
              name="name"
              ref="name"
              v-bind:value="[address_data.name ? address_data.name : '']"
            />
          </div>
        </li>
        <li>
          <div class="name"></div>
          <div class="chk">
            <span
              name="sex"
              id="sex1"
              v-bind:class="[isClass ? 'current' : '']"
              v-on:click="addChange(1)"
            >先生</span>
            <span
              name="sex"
              id="sex2"
              v-bind:class="[isClass ? '' : 'current']"
              v-on:click="addChange(2)"
            >女士</span>
          </div>
        </li>
        <li>
          <div class="name">手机</div>
          <div class="input">
            <input
              type="text"
              placeholder="请输入您的手机号码"
              id="mobile"
              name="mobile"
              ref="mobile"
              v-bind:value="[address_data.mobile ? address_data.mobile : '']"
            />
          </div>
        </li>
      </div>
      <div class="cot">收货地址</div>
      <div class="forms">
        <li>
          <div class="name n2">详细地址</div>
          <div class="input w2">
            <input
              type="text"
              placeholder="请输入您的详细地址"
              id="address"
              name="address"
              ref="address"
              v-bind:value="[address_data.address ? address_data.address : '']"
            />
          </div>
        </li>
        <li>
          <div class="name n2">补充信息</div>
          <div class="input w2">
            <input
              type="text"
              placeholder="单元/楼层/门牌号"
              id="note"
              name="note"
              ref="note"
              v-bind:value="[address_data.note ? address_data.note : '']"
            />
          </div>
        </li>
      </div>
    </div>
  </div>
</template>
<script>
import Error from "../../components/Error.vue";
import Tab from "../../components/Tab.vue";
import Config from "../../config/config.js";
import { Toast } from "mint-ui";
import Store from "../../store.js";

export default {
  components: {
    Error,
    Tab
  },
  data() {
    return {
      isError: false,
      error: "",
      address_data: [],
      isClass: 1,
      whoami: "user/whoami/",
      viewUrl: "address/view/",
      viewAddUrl: "address/add/",
      viewUpdateUrl: "address/update/"
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
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url;
    },
    getData(callback) {
      this.$http.post(this.viewUrl, { id: this.$route.params.id }).then(
        response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            this.address_data = ret["data"];
            this.isClass = ret["data"]["isClass"];
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

    addAdress: function() {
      var sex = 0;
      if (this.isClass) {
        sex = 1;
      } else {
        sex = 2;
      }
      var name = this.$refs.name.value;
      var mobile = this.$refs.mobile.value;
      var address = this.$refs.address.value;
      var note = this.$refs.note.value;
      if (!name) {
        Toast("称呼必须填写");
        return;
      } else if (!mobile) {
        Toast("手机号必须填写");
        return;
      } else if (!address) {
        Toast("详细地址必须填写");
        return;
      }
      this.getAdress(name, sex, mobile, address, note);
    },

    addChange: function(con) {
      this.isClass = con == 1 ? 1 : 0;
      this.address_data["name"] = this.$refs.name.value;
      this.address_data["mobile"] = this.$refs.mobile.value;
      this.address_data["address"] = this.$refs.address.value;
      this.address_data["note"] = this.$refs.note.value;
    },

    getAdress(name, sex, mobile, address, note) {
      this.$http
        .post(this.viewAddUrl, {
          name: name,
          sex: sex,
          mobile: mobile,
          address: address,
          note: note,
          id: this.$route.params.id
        })
        .then(response => {
          const ret = JSON.parse(response.data || "[]");
          if (ret && ret.code === 0) {
            Toast("添加成功");
            this.$router.replace("/address");
          } else {
            Toast("没有登录");
            this.error = (ret && ret.msg) || "";
            this.isError = true;
          }
        });
    }
  }
};
</script>
<style scoped>
.navTop .publish {
  display: inline-block;
  height: 0.45rem;
  color: #ffffff;
  font-size: 0.15rem;
  line-height: 0.45rem;
}
.pt45 {
  padding-top: 0.45rem;
  overflow: hidden;
}
.addr-add {
  display: block;
}
.addr-add .cot {
  padding: 0.1rem;
  overflow: hidden;
  color: #2d2d2d;
  font-size: 0.14rem;
  background: #f5f5f5;
}
.addr-add .forms li {
  height: 0.45rem;
  line-height: 0.45rem;
  overflow: hidden;
  width: 95%;
  margin: auto;
  border-bottom: #c0c0c0 1px solid;
}
.addr-add .forms li:last-child {
  border: none;
}
.addr-add .forms li .name {
  width: 0.55rem;
  float: left;
}
.addr-add .forms li .n2 {
  width: 0.65rem;
}
.addr-add .forms li .input {
  position: relative;
  margin-left: 0.5rem;
  overflow: hidden;
}
.addr-add .forms li .w2 {
  margin-left: 0.7rem;
}
.addr-add .forms li .input input {
  width: 100%;
  height: 0.4rem;
  border: none;
}
.addr-add .forms li .chk {
  margin-top: 0.12rem;
  margin-left: 0.5rem;
}
.addr-add .forms li .chk span {
  display: inline-block;
  width: 0.5rem;
  height: 0.2rem;
  line-height: 0.2rem;
  padding-left: 0.2rem;
  overflow: hidden;
  /* float: left; */
  background: url("../../assets/images/gchk1.png") left center no-repeat;
  background-size: 0.16rem 0.16rem;
  margin-right: 0.25rem;
}
.addr-add .forms li .chk span.current {
  background: url("../../assets/images/gchk2.png") left center no-repeat;
  background-size: 0.16rem 0.16rem;
}
</style>
