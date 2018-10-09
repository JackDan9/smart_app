<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">图片</span>
      <span class="publish" v-on:click="updateUser()" style="display:none;">保存</span>
    </div>
    <div class="ask pt45">
      <div class="tips">
        <p class="tips_title">修改图片</p> 
      </div>
      <div class="text">
        <div id="app">
          <img :src="picture" width="600" height="800">
          <input type="hidden" id="picture" name="picture" value="picture" ref="picture"> 
          <div class="weui_uploader_input_wrp" v-on:click="changeUpload()"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Error from '../components/Error.vue'
import Tab from '../components/Tab.vue'
import Config from '../config.js'
import {Toast} from 'mint-ui'
import Store from '../store.js'

export default {
  components: {
    Error,
    Tab
  },
  data () {
    return {
      isError: false,
      error: '',
      picture:'',
      whoami: 'user/whoami/',
      govUrl:'user/update/'
    }
  },
  beforeMount: function(){
    if(Store.getAuthUid()){
      this.$http.get(this.whoami,{}).
      then((response) => {
        const ret = JSON.parse(response.data);
        if(ret && ret['code'] === 0){
          if(!ret['picture']){
            if(ret['wx_picture']){
                 this.picture = ret['wx_picture']
             }else{
                 this.picture = Config.defaultPic
             }
          }else{
             this.picture = Config.baseUrl + ret['picture']
          }
        }else{
           this.$router.push('/login')
           return
        }
      })
    }else{
      this.$router.push('/login')
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

   changeUpload:function(e){
      var share = {
         action: 'uploadImage',
         Authorization: 'Xyapp ' + Store.getAuthUid(),
         api: '/user/upload/'
      }
      if(window.postMessage) window.postMessage(JSON.stringify(share),'*');
      return true
   },

    updateUser: function(){
      var picture = this.$refs.picture.value
      this.getUpdate(picture)
    },

    getUpdate(picture) {
     this.$http.post(this.govUrl,{picture:picture} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
         Toast('操作成功!')
         this.$router.push('/userset')
       }else{
         Toast(ret.msg)
         this.error = (ret && ret.msg) || ""
         this.isError = true
       }
     },(response) => {
       this.isError = true
       this.error = ""
       if(callback) callback.call(this)
     });
    }
  }
}
</script>
<style scoped>
.navTop .publish{ height:0.45rem; padding-right:0.15rem; color:#ffffff; font-size:0.15rem; line-height:0.45rem;}
.pt45{ padding-top:0.45rem; overflow:hidden;}
.ask{ overflow:hidden; }
.ask .text{ overflow:hidden; padding:0.15rem;}
.ask .text textarea{ width:90%; padding:5%; overflow:hidden; border:none; outline:none; background:#ffffff;}
.ask .tips{ padding:0 0.15rem; overflow:hidden; color:#a5a5a5; font-size:0.12rem;background-color: #E8E5E5;padding-bottom:0.15rem;}
.tips .tips_title{font-size:20px;font-weight:500;padding-top:0.15rem;color:#000000}
ul { list-style: none outside none; margin:0; padding: 0; }
li { margin: 0 10px; display: inline; }
#app{overflow: hidden;text-align: center;}
img {overflow: hidden; width: 150px;height:150px; border-radius: 150px; border: 1px solid #284baa; margin: auto;float: left;display: inline;margin-bottom: 10px;}
.weui_uploader_input_wrp {float: right;position: relative;margin-right: 9px;margin-bottom: 9px;width: 77px; height: 77px;border: 1px solid #d9d9d9;}
.weui_uploader_input_wrp:before {width: 2px;height: 39.5px;}
.weui_uploader_input_wrp:after {width: 39.5px;height: 2px;}
.weui_uploader_input_wrp:before {content: " ";position: absolute;top: 50%;left: 50%;-webkit-transform: translate(-50%,-50%);transform: translate(-50%,-50%);background-color: #d9d9d9;}
.weui_uploader_input_wrp:after, .weui_uploader_input_wrp:before {content: " ";position: absolute; top: 50%;left: 50%;-webkit-transform: translate(-50%,-50%);transform: translate(-50%,-50%);background-color: #d9d9d9;}
.weui_uploader_input {position: absolute;z-index: 1;top: 0;left: 0;width: 100%;height: 100%;opacity: 0;-webkit-tap-highlight-color: rgba(0,0,0,0);}
.weui_uploader_file {float: left; margin-right: 9px;margin-bottom: 9px;width: 79px;height: 79px;background: no-repeat 50%;background-size: cover;}
#picture_uploadimg{float: right;}
.photoclose {position: absolute;display: block;right: 0;top: 0;margin: 2px 2px 0 0;width: 23px;background: #fff;}
.photoshow {display: block;float: left;position: relative;margin-right: 8px;margin-top: 8px;overflow: hidden;zoom: 1;}
 .contain {width:100%; height:300px;border:1px solid #ccc;}
</style>