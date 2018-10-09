<template>
    <div>
        <div class="navTop">
            <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
            <span class="navCon">选择收货地址</span>
        </div>
        <div class="addr-choice  pt45">
            <div class="top-head">
                <router-link :to="{ path: '/addressadd/0/'}" replace>
                    <span class="ico">＋</span> <span>新增收货地址</span><em>NEW</em>
                </router-link>
            </div>
            <div class="addr-list">
                <ul>
                    <template v-for="address in addresss">
                        <li v-bind:class="[address['isdefault'] > 0 ? 'current' : '']" >>
                            <div class="left" v-on:click="addChange(address.id)">
                                <p class="p1">{{address['address']}}{{address['note']}}</p>
                                <p class="p2"><span>{{address['name']}}</span> <span>{{address['issex']}}</span> <span>{{address['mobile']}}</span></p>
                            </div>
                            <div class="fr">
                                <div class="ico dele" v-on:click="delAdress(address.id)"></div>
                                <div class="line fr"></div>
                                <router-link :to="{ path: '/addressadd/'+address.id ,query:{tab:'hide'} }">
                                    <div class="ico edit"></div>
                                </router-link>
                            </div>
                        </li>
                    </template>
                </ul>
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
      email:'',
      addresss:[],
      whoami: 'user/whoami/',
      delUrl:'address/del/',
      updateUrl:'address/update/',
      viewListUrl:'address/viewlist/',
    }
  },
  beforeMount: function(){
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
    fullUrl: function(url) {
      return Config.baseUrl + url
    },

    addChange: function(id){
      if(this.addresss && this.addresss.length){
       for (var i = 0; i < this.addresss.length; i++) {
          if(this.addresss[i]['id'] == id){
             this.addresss[i]['isdefault'] = 1
           }else{
             this.addresss[i]['isdefault'] = 0
          }
        }
      }
      this.getAdress(id)
    },

   getAdress(id) {
     this.$http.post(this.updateUrl,{'id':id} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
         this.$router.replace('/order/'+Store.getCompanyid())
       }else{
         Toast('没有登录')
         this.error = (ret && ret.msg) || ""
         this.isError = true
       }
     });
    },

    delAdress:function(id){
       for (var i = 0,len = this.addresss.length; i < len; i++) {
          if(this.addresss[i]['id'] == id){
              this.addresss.splice(i,1);
              break;
            }
       }
      this.$http.post(this.delUrl,{'id':id} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
          Toast('删除成功')
          this.$router.push('/address')
       }else{
         Toast('没有登录')
         this.error = (ret && ret.msg) || ""
         this.isError = true
       }
     });
    },

    getData() {
     this.$http.post(this.viewListUrl,{} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
          this.addresss = ret['data']['address'];
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
.pt45 { padding-top:0.45rem; overflow:hidden; }
.addr-choice { overflow:hidden; font-size:0.14rem; background:#f5f5f5; }
.addr-choice .top-head { padding:0.1rem; overflow:hidden; background:#ffffff; }
.addr-choice .top-head span.ico { font-size:0.16rem; }
.addr-choice .top-head em { color:#969696; font-size:0.14rem; margin-left:0.1rem; }
.addr-choice .addr-list { overflow:hidden; margin-top:0.1rem; background:#ffffff; }
.addr-choice .addr-list li { padding:0.1rem; overflow:hidden; border-bottom:#f7f7f7 1px solid; }
.addr-choice .addr-list li p { line-height:0.24rem; }
.addr-choice .addr-list li.current { background:url("../assets/images/addr-select.png") left top no-repeat; background-size:0.2rem 0.2rem; }
.addr-choice .addr-list li .left { width:70%; float:left; overflow:hidden; }
.addr-choice .addr-list li .fr { width:30%;; }
.addr-choice .addr-list li .fr .line { width:1px; height:0.4rem; margin-top:0.03rem; background:#cccccc; }
.addr-choice .addr-list li .fr .ico { width:0.2rem; height:0.2rem; margin-top:0.1rem; overflow:hidden; float:right; }
.addr-choice .addr-list li .fr .dele { margin-left:0.1rem; background:url("../assets/images/addr-delet.png") center center no-repeat; background-size:0.18rem 0.18rem; }
.addr-choice .addr-list li .fr .edit { margin-right:0.1rem; background:url("../assets/images/op-edit.png") center center no-repeat; background-size:0.18rem 0.18rem; }
</style>
