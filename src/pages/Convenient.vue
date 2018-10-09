<template>
    <div>
        <div class="navTop">
            <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
            <span class="navCon">便民服务</span>
        </div>
        <div class="convenient">
            <div class="box">
                <div class="t"><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b1t.png"/><span>交通出行</span></router-link></div>
                <div class="con">
                    <ul>
                        <li><a v-on:click="changeClick('http://m.8684.cn/xinyang_bus')"> <img src="../assets/images/b1a1.png"/> <span>智能自行车</span></a></li>
                        <li><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b1a2.png"/> <span>公共自行车</span></router-link></li>
                        <li><a v-on:click="changeClick('http://m.12308.com/')"> <img src="../assets/images/b1a3.png"/> <span>汽车购票</span></a></li>
                        <li><a v-on:click="changeClick('http://trains.ctrip.com/TrainBooking/SearchTrain.aspx')"> <img src="../assets/images/b1a4.png"/> <span>火车票</span></a></li>
                        <li><a v-on:click="changeClick('http://flights.ctrip.com/')"> <img src="../assets/images/b1a5.png"/> <span>飞机票</span></a></li>
                    </ul>
                </div>
            </div>
            <div class="box">
                <div class="t"><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b2t.png"/><span>生活缴费</span> </router-link></div>
                <div class="con">
                    <ul>
                        <li><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b2a1.png"/> <span>水电费查询缴费</span></router-link></li>
                        <li  class="dn"><router-link :to="{ path: '/tel/'}"><img src="../assets/images/b2a2.png"/> <span>移动联通电信充值</span></router-link></li>
                        <li><a v-on:click="changeClick('http://96266.henancatv.com:8888/roma.wap/')"> <img src="../assets/images/b2a3.png"/> <span>有线电视充值缴费</span></a></li>
                    </ul>
                </div>
            </div>
            <div class="box">
                <div class="t">
                    <router-link :to="{ path: '/wjs'}"><img src="../assets/images/b3t.png"/><span>车主服务</span> </router-link>
                </div>
                <div class="con">
                    <ul>
                        <li><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b3a1.png"/> <span>机动车违章查询</span></router-link></li>
                        <li><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b3a2.png"/> <span>代驾服务</span></router-link></li>
                    </ul>
                </div>
            </div>
            <div class="box">
                <div class="t">
                    <router-link :to="{ path: '/wjs'}"><img src="../assets/images/b4t.png"/><span>查询服务</span> </router-link>
                </div>
                <div class="con">
                    <ul>
                        <li><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b4a1.png"/> <span>便民热线</span></router-link></li>
                        <li><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b4a2.png"/> <span>法律服务</span></router-link></li>
                        <li><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b4a3.png"/> <span>社保账单</span></router-link></li>
                        <li><a v-on:click="changeClick('http://wsdt.ha-l-tax.gov.cn/sword?ctrl=WwSscxFpzwcxCtrl_init')"> <img src="../assets/images/b4a4.png"/> <span>真伪发票</span></a></li>
                        <li><a v-on:click="changeClick('http://wap.guoguo-app.com/')"> <img src="../assets/images/b4a5.png"/> <span>快递查询</span></a></li>
                    </ul>
                </div>
            </div>
            <div class="box">
                <div class="t">
                    <router-link :to="{ path: '/wjs'}"><img src="../assets/images/b5t.png"/><span>家庭服务</span> </router-link>
                </div>
                <div class="con">
                    <ul>
                        <li v-on:click="goTo()"><img src="../assets/images/b5a1.png"/> <span>家政服务</span></li>
                        <li><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b5a2.png"/> <span>搬家服务</span></router-link></li>
                    </ul>
                </div>
            </div>
            <div class="box">
                <div class="t"><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b6t.png"/><span>其他</span></router-link></div>
                <div class="con">
                    <ul>
                        <li><a v-on:click="changeClick('https://www.quyiyuan.com/hospitals/id/3760003')"> <img src="../assets/images/b6a1.png"/> <span>预约挂号</span></a></li>
                        <li><router-link :to="{ path: '/wjs'}"><img src="../assets/images/b6a2.png"/> <span>搬家服务</span></router-link></li>
                    </ul>
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
      error: ''
    }
  },
  
 methods: {
   changeClick:function(url){
      var share = {
         action: 'thirdURL',
         url:url
      }
      if(window.postMessage) window.postMessage(JSON.stringify(share),'*');
      return true
   },
    goTo: function() {
        this.$router.push('/community/')
    }
  }
}
</script>
<style scoped>
.mt45{ margin-top: 0.45rem;}
.bgf{ background:#ffffff; overflow:hidden; padding:0.1rem 0;  }
.convenient{ overflow:hidden;background:#f1f1f1; padding-top:0.45rem;}
.convenient .box{ background:#ffffff; margin-bottom:0.1rem; overflow:hidden;}
.convenient .box .t{ padding:0.05rem 0.1rem; height:0.3rem; line-height:0.3rem;}
.convenient .box .t img{ width:0.18rem;}
.convenient .box .t span{ padding-left:0.1rem; font-size:0.16rem;}
.convenient .box .con{ overflow:hidden;}
.convenient .box .con ul{ width:102%; border-top:#ecedee 1px solid; }
.convenient .box .con li{ width:49%; float:left; overflow:hidden; padding:0.1rem 0; line-height:0.3rem; height:0.3rem;border-bottom:#ecedee 1px solid; border-right:#ecedee 1px solid;}
.convenient .box .con li img{  display:inline-block; width:0.25rem; margin-left:0.1rem; padding-right:0.05rem;}
.convenient .box .con li a{ font-size:0.14rem;}
</style>
