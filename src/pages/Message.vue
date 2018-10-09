<template>
  <div>
    <div class="page-topnav">
     <div class="navTop">
       <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
       <span class="navCon">消息通知</span>
      </div>
    </div>
    <div class="message-list">
      <ul>
        <li class="dn">
          <div class="ico"><img src="../assets/images/me1.png" alt=""/></div>
          <div class="txt">
            <div class="p1">优惠活动</div>
            <div class="p2">（推送店铺）连接→店铺列表页</div>
          </div>
        </li>
        <li>
          <router-link :to="{ path: '/notice/2'}">
            <div v-bind:class="[isRead2 ? 'ico red' : 'ico']"><img src="../assets/images/me2.png" alt=""/></div>
            <div class="txt">
              <div class="p1">鲸豆消息</div>
              <div class="p2">{{gold}}</div>
            </div>
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/notice/3'}">
            <div v-bind:class="[isRead3 ? 'ico red' : 'ico']"><img src="../assets/images/me3.png" alt=""/></div>
            <div class="txt">
              <div class="p1">订单通知</div>
              <div class="p2">{{order}}</div>
            </div>
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/notice/4'}">
            <div v-bind:class="[isRead4 ? 'ico red' : 'ico']"><img src="../assets/images/me4.png" alt=""/></div>
            <div class="txt">
              <div class="p1">评价互动</div>
              <div class="p2">{{comment}}</div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Error from '../components/Error.vue'
import Tab from '../components/Tab.vue'
import Config from '../config.js'
import Store from '../store.js'
import {Toast} from 'mint-ui'

export default {
  components: {
    Error
  },
  data () {
    return {
      gold: '暂无消息',
      order:'暂无消息',
      comment:'暂无消息',
      isError: false,
      error: '',
      isRead2:0,
      isRead3:0,
      isRead4:0,
      whoami: 'user/whoami/',
      viewUrl:'basic_notice/message/'
    }
  },
  mounted() {
    this.type = +(this.$route.params.type)
    if(Store.getAuthUid()){
        this.$http.get(this.whoami,{}).
         then((response) => {
           const ret = JSON.parse(response.data);
           if(ret && ret['code'] === 0){
             this.getData()
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
   loadMore(){
      if(this.page <= this.total){
         this.getData()
      }
      if(this.page == this.total){
          this.page = this.page + 1
      }
    },

    getData( callback ) {
     this.$http.get(this.viewUrl).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
         if(ret['data']['g']){
            this.gold = ret['data']['g']['reply_user']+':'+ret['data']['g']['content']
            this.isRead2 = ret['data']['g']['isread']
         }
        if(ret['data']['o']){
            this.order = ret['data']['o']['reply_user']+':'+ret['data']['o']['content']
            this.isRead3 = ret['data']['o']['isread']
         }    
         if(ret['data']['c']){
            this.comment = ret['data']['c']['reply_user']+':'+ret['data']['c']['content']
             this.isRead4 = ret['data']['c']['isread']
         }
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
    }
  }
}
</script>
<style scoped>
.message-list{ overflow:hidden; padding-top:0.45rem; background:#eeeeee;}
.message-list li{ padding:0.07rem 0.1rem; overflow:hidden; background:#ffffff;}
.message-list li .red {position: relative;}
 .message-list li .red:after{ content:''; position:absolute; width:15px; height:15px; border-radius:15px; background:red;right:0.02rem; top:0.02rem;}
.message-list li .ico{ width:0.5rem; overflow:hidden; float:left;}
.message-list li .ico img{ width:100%;}
.message-list li .txt{ margin-left:0.6rem; overflow:hidden; padding-bottom:0.17rem; border-bottom:#e1e1e1 1px solid; }
.message-list li:last-child .txt{ border:none;}
.message-list li .txt .p1 { font-size:0.16rem;  color:#333333 ; margin-top:0.03rem;}
.message-list li .txt .p2 { font-size:0.12rem; color:#666666; margin-top:0.05rem;}
.page-topnav .set{ background:url("../assets/images/set.png") center center no-repeat;background-size:0.25rem 0.25rem; margin-left:0.35rem;}
</style>
