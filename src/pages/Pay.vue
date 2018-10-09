<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" v-on:click="goBack()">&#xe609;</i>
      <span class="navCon">支付订单</span>
    </div>
    <div class="pay-page pt45">
      <div class="top-price">
        <div class="photo"><img v-bind:src="[company['picture']?fullUrl(company['picture']):defaultPicUrl()]" class="w101"/></div>
        <div class="right">
            <div class="p1">¥{{payment['totalfee']}}</div>
            <div class="p2">{{company['name']}} - {{payment['outkey']}}</div>
        </div>
      </div>
      <div class="pay-list">
        <ul>
          <li>
             <div class="logo">
                <i class="iconfont weChatIcon">&#xe60e;</i>
             </div>
             <div class="name">微信支付</div>
             <div class="chk" v-bind:class="[isClass ? 'current' : '']" v-on:click="addChange('con1')"></div>
          </li>
          <li class="dn">
             <div class="logo"><img src="../assets/images/alipay.png" class="w101"/></div>
             <div class="name">支付宝支付</div>
             <div class="chk" v-bind:class="[isClass ? '' : 'current']" v-on:click="addChange('con2')"></div>
          </li>
        </ul>
      </div>
      <div class="pay-btn" v-on:click="getPay()">确认支付 <span>¥{{payment['totalfee']}}</span></div>
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
      email:'',
      payment:[],
      company:[],
      isClass:1,
      whoami: 'user/whoami/',
      weixin: 'pay/weixin/',
      viewUrl:'payment/viewone/'
    }
  },
  beforeMount: function(){
    if(Store.getAuthUid()){
      this.$http.get(this.whoami,{}).
      then((response) => {
        const ret = JSON.parse(response.data);
        if(ret && ret['code'] === 0){
           const id = +(this.$route.params.id);
           if(id > 0){
               this.getData()
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
  watch: {
    '$route' (to, from){
       this.getData(()=> window.scrollTo(0,0))
    }
  },
  methods: {
    fullUrl: function(url) {
      return Config.baseUrl + url
    },

   defaultPicUrl:function(){
      return Config.defaultPic
    },

    addChange: function(con){
       this.isClass = con == 'con1' ? 1 : 0
    },
   getPay: function(){
     if(this.isClass){
         this.getWeixinData()
       }else{

      }

   },
   goBack: function(event){
      Toast('订单没有支付')
      this.$router.replace({path:'/orderlist?tab=hide'})
    },

    getData( callback ) {
     this.$http.post(this.viewUrl,{id: this.$route.params.id} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
         this.payment = ret['data']['payment']    
         this.company = ret['data']['company']
       }else{
         this.error = (ret && ret.msg) || ""
         this.isError = true
       }
       if( typeof callback === 'function' ){
          callback.call(this)
       }

     },(response) => {

       this.isError = true
       this.error = ""
       if( typeof callback === 'function' ){
           callback.call(this)
       }
     });
    },
    getWeixinData() {
     this.$http.post(this.weixin,{id: this.$route.params.id} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
        var weChatPay = {
            action: 'weChatPay',
            partnerId: ret['data']['partnerid'],
            prepayId: ret['data']['prepayid'],
            nonceStr: ret['data']['noncestr'],
            timeStamp:ret['data']['timestamp'],
            package:ret['data']['package'],
            sign:ret['data']['sign'],
            id:this.$route.params.id
         }
         if(window.postMessage) window.postMessage(JSON.stringify(weChatPay),'*');
         return true
       }else if(ret && ret.code === 2){
          Toast('该订单已经支付过')
          this.$router.replace({path:'/orderlist'})
       }else{
         this.error = (ret && ret.msg) || ""
         this.isError = true
       }

     },(response) => {

       this.isError = true
       this.error = ""
     });
    }
  }
}
</script>
<style scoped>
.pt45{ padding-top:0.45rem; overflow:hidden;}
.pay-page{ overflow:hidden; font-size:0.14rem; background:#f5f5f5;}
.pay-page .top-price{ padding:0.1rem; overflow:hidden; background:#ffffff; }
.pay-page .top-price .photo{ float:left;;width:0.5rem; height:0.5rem; border-radius:0.5rem; overflow:hidden;}
.pay-page .top-price .right{ margin-left:0.6rem; overflow:hidden;}
.pay-page .top-price .right .p1{ font-size:0.22rem; margin-top:0.02rem; }
.pay-page .top-price .right .p2 { color:#636363; }
.pay-page .pay-list{ overflow:hidden; margin-top:0.1rem;}
.pay-page .pay-list li{ padding:0.2rem 0.15rem; overflow:hidden; border-bottom:#eeeeee 1px solid; background:#ffffff;}
.pay-page .pay-list li .logo{ width:0.25rem; float:left;}
.weChatIcon { color: green; }
.pay-page .pay-list li .name{ margin-left:0.1rem; float:left;}
.pay-page .pay-list li .chk{ width:0.2rem; height:0.2rem; float:right; background:url("../assets/images/gchk1.png") center center no-repeat;background-size:0.2rem 0.2rem;}
.pay-page .pay-list li .current { width:0.2rem; height:0.2rem; float:right; background:url("../assets/images/gchk2.png") center center no-repeat;background-size:0.2rem 0.2rem; }
.pay-page .pay-btn{ width:93%; margin:auto; margin-top:0.1rem; height:0.4rem; border-radius:0.05rem;line-height:0.4rem; color:#ffffff;background:#fa550f; text-align:center; font-size:0.16rem;}
.w101 { max-height: 100%; }
</style>
