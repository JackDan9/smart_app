<template>
  <div>
    <div class="navTop">
        <router-link :to="{path:'/user'}">
            <i class="iconfont back">&#xe609;</i>
        </router-link>
        <span class="navCon">个人中心</span>
    </div>
    <div class="ask pt45">
      <router-link :to="{path:'/pic'}"  class="mint-cell">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <div>
              <span class="cell_right">头像</span>
              <span  class="cell_ft"><img :src="picture" class="w60"></span>
            </div>
          </div>
        </div>
        <i class="mint-cell-allow-right"></i>
      </router-link>
      <div class="mint-cell">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <div>
              <span class="cell_right">用户名</span>
              <span  class="cell_ft">{{username}}</span>
            </div>
          </div> 
        </div>
      </div>
      <div class="mint-cell">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <div>
              <span class="cell_right">性别</span>
              <i v-bind:class="[parseInt(this.sex) === 1 ? 'icon-male' : 'icon-female']"></i>
              <span  class="cell_ft">{{sexName}}</span>
            </div>
          </div> 
        </div>
      </div>
      <router-link :to="{path:'/nick'}" class="mint-cell">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <div>
              <span class="cell_right">昵称</span>
              <span  class="cell_ft">{{nickname}}</span>
            </div>
          </div> 
        </div>
        <i class="mint-cell-allow-right"></i>
      </router-link>
      <router-link :to="{path:'/sign'}" class="mint-cell">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <div>
              <span class="cell_right">签名</span>
              <span  class="cell_ft">{{sign}}</span>
            </div>
          </div> 
        </div>
        <i class="mint-cell-allow-right"></i>
      </router-link>
      <router-link :to="{path:'/mail'}" class="mint-cell">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <div>
              <span class="cell_right">邮箱</span>
              <span  class="cell_ft">{{email}}</span>
            </div>
          </div> 
        </div>
        <i class="mint-cell-allow-right"></i>
      </router-link>
      <div class="mint-cell">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <div>
              <span class="cell_right">手机号</span>
              <span  class="cell_ft">{{mobile}}</span>
            </div>
          </div> 
        </div>
      </div>
      <div class="btn-wrap" id="woyaodp" v-on:click="exitOut()">
        <div class="sub"><span>退出登录</span></div>
      </div>
    </div>
  </div>
</template>
<script>
import {Toast} from 'mint-ui'
import { MessageBox } from 'mint-ui';
import Config from '../config.js'
import Store from '../store.js'
export default {
  data () {
    return {
      whoami: 'user/whoami/',
      username:'',
      gold:0,
      mobile:'',
      email:'',
      sign:'',
      nickname:'',
      sex:0,
      sexName:'',
      picture:''
    }
  },

  beforeMount: function(){
    if(Store.getAuthUid()){
      this.$http.get(this.whoami,{}).
      then((response) => {
        const ret = JSON.parse(response.data);
        if(ret && ret['code'] === 0){
          this.gold = ret['gold']
          this.username = ret['username']
          if(!ret['picture']){
              if(ret['wx_picture']){
                 this.picture = ret['wx_picture']
             }else{
                 this.picture = Config.defaultPic
             }
          }else{
             this.picture = Config.baseUrl + ret['picture']
          }
          this.mobile = ret['mobile']
          this.email = ret['email']
          this.sign = ret['sign']
          this.nickname = ret['nickname']
	      this.sex = ret['sex']
	      this.sexName = this.sex > 0 ? this.sex == 1 ? '男':'女':'无';
        }else{
           this.$router.replace('/login')
           return
        }
      })
    }else{
      this.$router.replace('/login')
      return
    }
  },

  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url
    },

    defaultPicUrl:function(){
      return Config.defaultPic
    },

   clickApp:function(){
      var share = {
         action: 'quitAccount',
      }
      if(window.postMessage) window.postMessage(JSON.stringify(share),'*');
      return true
   },

   exitOut: function(){
     MessageBox.confirm('确定执行此操作?').then(action => {
         Store.setAuthIid('')
         this.$router.replace('/')
         this.clickApp()
      })
    }
  }
}
</script>
<style scoped>
.pt45{ padding-top:0.46rem; overflow:hidden;}
.ask{ overflow:hidden;}
.w60{border-radius: 0.8rem;width: 0.8rem;height: 0.8rem;overflow: hidden;border: 1px solid #28b4aa;}
.mint-cell-title{line-height:50px;}
.cell_right{font-size:20px;}
.icon-male {display: inline-block;position: absolute; left: 73%; top:28%; width: 0.2rem;height: 0.2rem; border-radius: 0.2rem;background: url("../assets/images/user/icon-male.png") center center no-repeat;background-size: 0.12rem, 0.12rem; background-color:#28b4aa;}
.icon-female {display: inline-block;position: absolute; left: 73%; top:28%;width: 0.2rem;height: 0.2rem; border-radius: 0.2rem;background: url("../assets/images/user/icon-female.png") center center no-repeat;background-size: 0.12rem, 0.12rem; background-color:#f0149b;}
.cell_ft {text-align: right;color: #888;margin-right:40px;float:right;width:200px;}
.btn-wrap {display: -webkit-box;overflow: hidden;margin: 5% 15%;}
.btn-wrap .sub {width: 100%;height: 55px;line-height: 55px;margin-top: 15px;border-radius: 5px;background: #F35632;text-align: center;}
.btn-wrap .sub span {color: #fff;margin-left: 5px;font-size: 15px;}
</style>
