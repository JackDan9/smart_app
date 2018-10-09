<template>
  <div>
    <div class="navTop">
      <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
      <span class="navCon">{{title}}</span>
    </div>
    <div class="addr-choice  pt45">
      <div class="addr-list" >
        <ul>
          <template v-for="notice in notices">
            <li>
              <div class="left">
                <p class="p1">{{notice['addtime']}}</p>
                <p class="p2"><span class="p22" v-show="notice['reply_user']">{{notice['reply_user']}}:</span><span class="p23">{{notice['content']}}</span></p>
              </div>
              <div class="fr">
                <div class="ico dele" v-on:click="delOrder(notice.id)"></div>
                <div class="line fr"></div>
              </div>
            </li>
          </template>
        </ul>
        <img v-bind:class="[total > 0 ? 'dn' : '']" src="../assets/images/400.png" class="w100" />
      </div>
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
      notices: [],
      isError: false,
      error: '',
      whoami: 'user/whoami/',
      page:0,
      total:0,
      title:'',
      type:0,
      delUrl:'basic_notice/del/',
      viewUrl:'basic_notice/viewlist/'
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

    delOrder:function(id){
       for (var i = 0,len = this.notices.length; i < len; i++) {
          if(this.notices[i]['id'] == id){
              this.notices.splice(i,1);
              break;
            }
       }
      this.$http.post(this.delUrl,{'id':id} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
          Toast('删除成功')
          this.$router.push('/notice/'+this.type)
       }else{
         Toast('没有登录')
         this.error = (ret && ret.msg) || ""
         this.isError = true
       }
     });
    },

    getData( callback ) {
     this.$http.post(this.viewUrl,{type:this.type,page:this.page} ).then( (response) => {
       const ret = JSON.parse(response.data || "[]")
       if(ret && ret.code === 0){
         this.title = ret['data']['title']
         this.notices = ret['data']['notice']
         this.page = ret['data']['page'];
         if(this.page == 1){
            this.notices = ret['data']['notice']
         }else{
           var notices_new =  ret['data']['notice'];
           if(notices_new && notices_new.length){
             for (var i = 0; i < notices_new.length; i++) {
               this.notices.push(notices_new[i])
             }
           }
         }
         this.total = ret['data']['total'];
         if(this.page <= this.total){
           this.page = this.page + 1
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
.pt45 { padding-top:0.45rem; overflow:hidden; }
.addr-choice { overflow:hidden; font-size:0.14rem; background:#f5f5f5; }
.addr-choice .addr-list { overflow:hidden; margin-top:0.1rem; background:#ffffff; }
.addr-choice .addr-list .w100{margin-top:-20px;}
.addr-choice .addr-list li { padding:0.1rem; overflow:hidden; border-bottom:#f7f7f7 1px solid; }
.addr-choice .addr-list li p { line-height:0.24rem; }
.addr-choice .addr-list li.current { background:url("../assets/images/addr-select.png") left top no-repeat; background-size:0.2rem 0.2rem; }
.addr-choice .addr-list li .left { width:70%; float:left; overflow:hidden; }
.addr-choice .addr-list li .left .p1{color:#cccccc;}
.addr-choice .addr-list li .left .p2 .p22{padding-top:8px;line-height:20px;font-size:16px;color:#a9a9a9;}
.addr-choice .addr-list li .left .p2 .p23{padding-top:8px;line-height:20px;font-size:16px;}
.addr-choice .addr-list li .fr { width:20%;}
.addr-choice .addr-list li .fr .line { width:1px; height:0.4rem; margin-top:0.03rem; background:#cccccc; }
.addr-choice .addr-list li .fr .ico { width:0.2rem; height:0.2rem; margin-top:0.1rem; overflow:hidden; float:right; }
.addr-choice .addr-list li .fr .dele { margin-left:0.1rem; background:url("../assets/images/addr-delet.png") center center no-repeat; background-size:0.18rem 0.18rem; }
.addr-choice .addr-list li .fr .edit { margin-right:0.1rem; background:url("../assets/images/op-edit.png") center center no-repeat; background-size:0.18rem 0.18rem; }
</style>
