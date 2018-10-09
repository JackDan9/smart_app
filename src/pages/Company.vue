<template>
    <div>
        <div class="navTop">
            <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
            <!--下面class加love2为红心-->
            <span class="right">
                <i  v-bind:class="[company['isLike'] ? 'iconfont Liked' : 'iconfont noLiked']" v-on:click="addLike(company['id'],company['isLike'])" v-bind:id="company['id']">&#xe607;</i>
                <i class="iconfont share" v-on:click="shareLink(company.name,fullUrl(company.picture))">&#xe60f;</i>
            </span>
        </div>
        <div class="banner" v-infinite-scroll="loadMore">
            <mt-swipe :auto="4000" class="swipe" v-if="ads">
                <template v-for="ad in ads">
                    <mt-swipe-item class="swipe-item">
                        <a v-bind:href="ad['url']" >
                            <img v-if="ad['picture']" :src="fullUrl(ad['picture'])" />
                        </a>
                    </mt-swipe-item>
                </template>
            </mt-swipe>
            <div class="icon-mess "> <div class="red"></div> </div>
        </div>
        <div class="product-tc">
            <div class="info">
                <p class="p1"> <span>{{company['name']}}</span> <img v-if="company['issend']" src="../assets/images/tco.png" alt=""/></p>
                <p class="p2">
                    <span>{{company['notice']}}</span>
                    <span class="dn" v-on:click="checkOut()">结账</span>
                </p>
                <p class="p3"><span>营业时间</span><em>{{company['opentime']}}</em></p>
                <p class="p3" v-if="company['sendtime']"><span>配送时间</span><em>{{company['sendtime']}}</em></p>
                <a v-on:click="phoneClick(company.mobile)"><div class="bot tel"><a type="tel">{{company['contact']}}：{{company['mobile']}} <i class="tel-ico"></i> </a></div></a>
                <div v-bind:class="[(company.lat && company.lng) ? 'bot addr' : 'addr']" v-on:click="mapLink(company.lat,company.lng,company.name,company.address)">
                    <span>{{company['address']}}</span>
                    <i v-bind:class="[(company.lat && company.lng) ? 'map-ico' : 'dn']"></i>
                </div>
            </div>
            <div class="gray-line"></div>
            <div class="dis-list">
                <ul>
                    <li class="p1 dn">
                        <div class="fl">特惠商品限时8折</div>
                        <div class="fr">已享6154</div>
                    </li>
                    <li class="p2">
                        <i class="iconfont discountIcon">&#xe62f;</i>
                        <span class="discountMoney">本店商品全场{{company['teamprice']}}折</span>
                        <span class="discountNum">已享{{company['total_salenum']}}</span>
                    </li>
                    <li class="p3 dn">
                        <div class="fl">特惠商品限时8折</div>
                        <div class="fr">已享6154</div>
                    </li>
                </ul>
            </div>
            <div class="gray-line"></div>
            <div class="w-tab">
                <li v-bind:class="[isClass ? 'current' : '']" v-on:click="addChange2('con1')"><span>商品</span></li>
                <li v-bind:class="[isClass ? '' : 'current']" v-on:click="addChange2('con2')"><span>评价</span></li>
            </div>
            <div class="product-box pro-tab-con" v-bind:class="[isClass ? '' : 'dn']" id="con" >
                <div class="left">
                    <div class="tab">
                        <i class="iconfont hot">&#xe605;</i>
                        <span>热销榜</span>
                    </div>
                    <ul>
                        <template v-for="category in categorys">
                            <li v-bind:class="[category['isClass'] ? 'current' : '']"  v-on:click="addChange(category['id'])">
                                {{category['name']}}<span class="num" :id="category.id" v-bind:class="[category.category_num >0 ? '' : 'dn']">{{category['category_num']}}</span>
                            </li>
                        </template>
                    </ul>
                </div>
                <div class="con">
                    <div class="t1 dn">天天新特惠，{{company['teamprice']}}折限时抢</div>
                    <div class="t2 dn">（不与其他活动同享）</div>
                    <template v-for="category in categorys">
                        <ul  v-bind:class="[category['isClass'] ? '' : 'dn']">
                            <template v-for="product in category['product']">
                                <li>
                                    <router-link :to="{path:'/product/'+product['id'] ,query:{tab:'hide'}}">
                                        <div class="img"><img v-if="product['picture']" :src="fullUrl(product['picture'])+'!114.114'"  class="w101"/></div>
                                    </router-link>
                                    <div class="det">
                                        <div class="p1">{{product['name']}}</div>
                                        <div class="p2">{{product['model']}}</div>
                                        <div class="p3">月售{{product['salenum']}}份 评分{{product['commentstar']}} 库存{{product['stock']}}</div>
                                        <div class="p4">
                                            <div class="fl"><small>￥</small><em>{{product['price']}}</em> <span>￥{{product['price1']}}</span></div>
                                            <div class="fr">
                                                <i class="iconfont sub" v-on:click="addNum('sub',product.id,category.id,product.price,product.collect_num,category.category_num)">&#xe621;</i>
                                                <span class="num" :id="product.id">{{product['collect_num']}}</span>
                                                <i class="iconfont add" v-on:click="addNum('add',product.id,category.id,product.price,product.collect_num,category.category_num)" >&#xe610;</i>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </template>
                        </ul>
                    </template>
                </div>
            </div>
            <div class="product-box pro-tab-dis" v-bind:class="[isClass ? 'dn' : '']">
                <div class="sum">
                    <div class="fl">
                        <div class="p1">{{company['star']}}</div>
                        <div class="p2">综合评分</div>
                        <div class="p3">与周边商家持平</div>
                    </div>
                    <div class="right">
                        <div class="item">
                            <div class="name">商家服务</div>
                            <div class="redstars " >
                                <!--  20% 为1颗星，40%为2颗星，以此类推  -->
                                <span v-bind:class="[company['star_x'] ? 'rw'+company['star_x'] : 'rw5']"><img src="../assets/images/star-red2.png" alt=""/></span>
                            </div>
                            <div class="num">{{company['star']}}分</div>
                        </div>
                    </div>
                </div>
                <div class="gray-line"></div>
                <div class="taglist">
                    <span class="b1">全部({{commentTotalNum}})</span>
                </div>
                <div class="filter">
                    <i class="chk current"></i> <span>只看有内容的评价</span>
                </div>
                <div class="comm">
                    <ul>
                        <template v-for="comment in comments">
                            <li>
                                <div class="img"><img v-bind:src="[comment['picture']?fullUrl(comment['picture']):defaultPicUrl()]" class="w100"/></div>
                                <div class="det">
                                    <div class="p1">
                                        <div class="name fl">{{comment['username']}}</div>
                                        <div class="time fr">{{comment['addtime']}}</div>
                                    </div>
                                    <div class="p2">
                                        <div class="redstars fl">
                                            <!--  20% 为1颗星，40%为2颗星，以此类推  -->
                                            <span v-bind:class="[comment['star'] ? 'rw'+comment['star'] : 'rw5']"><img src="../assets/images/star-red2.png" alt=""/></span>
                                        </div>
                                        <div class="txt">{{comment['content']}}</div>
                                    </div>
                                    <div class="p3">
                                        <div class="digg"></div>
                                        <div class="box">
                                            <template v-for="product_name in comment['product']">
                                                <span>{{product_name}}</span> 
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
            <div class="size6"></div>
            <div class="pro-bot">
                <div class="bg">
                    <div class="pri">¥<span id="total_price">{{total_price}}</span></div>
                    <div class="pay" v-on:click="pay()">去结算</div>
                </div>
                <div class="logo2">
                    <div class="num" id="company_total_num">{{company_num}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Loading from '../components/Loading.vue'
    import Error from '../components/Error.vue'
    import Config from '../config.js'
    import Store from '../store.js'
    import {Toast} from 'mint-ui'
    import WxShare from '../wx.js'
    export default {
            components: {
                Error
            },
            data () {
                return {
                    company: [],
                    ads: [],
                    categorys:[],
                    isLoading: false,
                    isError: false,
                    error: '',
                    isClass:1,
                    viewUrl:'company/view/',
                    collectUrl:'collect/add/',
                    likeUrl:'like/add/',
                    whoami: 'user/whoami/',
                    wxShareUrl:'share/',
                    comments:[],
                    commentTotalNum:0,
                    company_num:0,
                    total_price:0,
                    username:'',
                }
            },
            mounted() {
                if(Store.getAuthUid()){
                    this.$http.get(this.whoami,{}).
                        then((response) => {
                        const ret = JSON.parse(response.data);
                        if(ret && ret['code'] === 0){
                            this.username = ret['nickname']?ret['nickname']:ret['username']
                        }
                    })
                }
                const id = +(this.$route.params.id)
                if( !id ) {
                    this.isError = true
                    this.error = '参数错误'
                } else {
                    this.isLoading = true
                    this.getData(()=> window.scrollTo(0,0))
                }
                this.getWx()
            },
            
            watch: {
                '$route' (to, from){
                    this.getData()
                }
            },

            methods: {
                fullUrl: function(url) {
                    return Config.baseUrl + url
                },
               getWx:function(){
                    this.$http.post(this.wxShareUrl,{url:window.location.href,id:this.$route.params.id,type:1}).then( (response) => {
                       const ret = JSON.parse(response.data);
                        if(ret && ret.code == 0){
                             WxShare.wxinit(ret['data'])
                        }else{
                           this.error = (ret && ret.msg) || ""
                           this.isError = true
                        }
                    })
                },
                phoneClick:function(mobile){
                    var share = {
                        action: 'call',
                        phoneNum:mobile
                    }
                    if(window.postMessage) window.postMessage(JSON.stringify(share),'*');
                    return true
                },
                /* 结账 */
               checkOut:function() {
                   this.$router.push('/settleaccounts/' + this.company['id'])
               },

                /* 选中商品去结算 */
                pay:function(){
                    if(this.company_num <= 0){
                        Toast('没有选择产品!')
                    }else{
                        this.$router.push('/order/'+this.company['id'])
                    }
                },
                
                shareLink: function(text,pic){
                    var share = {
                        action: 'share',
                        url: window.location.href,
                        title: text,
                        img: pic
                    }
                    if(window.postMessage) window.postMessage(JSON.stringify(share),'*');
                    return true
                },
                
                mapLink: function(lat,lng,name,address){
                    var map = {
                        action: 'locMap',
                        lat: lat,
                        lng: lng,
                        address:address,
                        storeName: name
                    }
                    if(window.postMessage) window.postMessage(JSON.stringify(map),'*');
                    return true
                },

                addNum: function(name,id,categoryid,price,collect_num,category_num){
                    if(!this.username){
                        this.$router.push('/login')
                        return
                    }
                    var num = collect_num
                    var categoryid_num = category_num
                    var company_total_num =  this.company_num
                    var total_price = this.total_price
                    if(name == 'add'){
                        num++
                        categoryid_num++
                        company_total_num++
                        total_price = total_price * 1 + price * 1
                    }else if(name == 'sub'){
                        if(num == 0) return;
                        num--
                        categoryid_num--
                        company_total_num--
                        total_price = total_price * 1 - price * 1
                    }
                    if( num <= 0 ){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                        num = 0;
                    }
                    if( categoryid_num <= 0 ){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                        categoryid_num = 0;
                    }
                    if( company_total_num <= 0 ){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                        company_total_num = 0;
                    }
                    if( total_price <= 0 ){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                        total_price = 0;
                    }
                    var flag = false
                    if(this.categorys && this.categorys.length){
                        for (var i = 0; i < this.categorys.length; i++) {
                            if(this.categorys[i]['id'] == categoryid){
                                this.categorys[i]['category_num'] = categoryid_num
                                if(this.categorys[i]['product'] && this.categorys[i]['product'].length){
                                    for(var ii = 0; ii < this.categorys[i]['product'].length; ii++){
                                        if(this.categorys[i]['product'][ii]['id'] == id){
                                            if(this.categorys[i]['product'][ii]['stock'] >= num){
                                                this.categorys[i]['product'][ii]['collect_num'] = num
                                            }else{
                                                if(name == 'add'){
                                                    this.categorys[i]['category_num'] = categoryid_num*1-1
                                                }
                                                flag = true
                                            }
                                            
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(flag){
                        Toast('库存不够')
                        return;
                    }
                    this.company_num = company_total_num
                    this.total_price = total_price.toFixed(2)
                    this.getCollect(id,num)
                },
                addChange: function(con){
                    if(this.categorys && this.categorys.length){
                        for (var i = 0; i < this.categorys.length; i++) {
                            if(this.categorys[i]['id'] == con){
                                this.categorys[i]['isClass'] = 1
                            }else{
                                this.categorys[i]['isClass'] = 0
                            }
                        }
                    }
                },
                
                addChange2: function(con){
                    var isClass = con == 'con1' ? 1 : 0
                    this.isClass = isClass
                },
                
                defaultPicUrl:function(){
                    return Config.defaultPic
                },

                loadMore(){
                  document.addEventListener('scroll',this.winScroll(),false)
                },
                
               winScroll:function(){
                   var scrollTop = document.body.scrollTop > 100 ? 100 : document.body.scrollTop
                   document.getElementsByClassName('navTop')[0].style.background = "rgba(0,0,0,"+ scrollTop/100 +")"
                },

                addLike: function(linkid,isLike){
                    if(!this.username){
                        this.$router.push('/login')
                        return
                    }
                    var updown = isLike == 1 ? 2 : 1
                    if(this.company['id'] == linkid){
                        this.company['isLike'] = updown === 1 ? 1 : 0;
                        this.company['vote'] = updown === 1 ? this.company['vote']*1+1:this.company['vote']*1-1
                    }
                    this.getLike(linkid,updown)
                },
                
                getCollect( itemid,num ) {
                    this.$http.post(this.collectUrl,{itemid: itemid,num:num,t:1} ).then( (response) => {
                        const ret = JSON.parse(response.data || "[]")
                        if(ret && ret.code === 0){
                            
                        }else{
                            this.error = (ret && ret.msg) || ""
                            this.isError = true
                        }
                    });
                },
                getData( callback ) {
                    this.$http.post(this.viewUrl,{id: this.$route.params.id} ).then( (response) => {
                        const ret = JSON.parse(response.data || "[]")
                        if(ret && ret.code === 0){
                            this.company = ret['data']
                            this.company_num = this.company['company_num']
                            this.total_price = this.company['company_price']
                            this.ads = ret['data']['pics'];
                            this.categorys = ret['data']['category'];
                            this.comments = ret['data']['comment'];
                            this.commentTotalNum = ret['data']['commentTotalNum'];
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
                getLike(linkid,updown) {
                    this.$http.post(this.likeUrl,{linkid:linkid,updown:updown,type:8} ).then( (response) => {
                        const ret = JSON.parse(response.data || "[]")
                        if(ret && ret.code === 0){
                            if(updown == 1){
                                Toast('收藏成功!')
                            }else{
                                Toast('取消收藏!')
                            }
                        }else{
                            Toast(ret.msg)
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
.navTop { z-index: 12345; }
.navTop .right { overflow: hidden; float: right; }
.navTop .Liked { margin-right: 0.1rem; color: #ff4b0f; }
.navTop .noLiked { margin-right: 0.1rem; color: #C0C0C0; }
.banner { position:relative; width:100%; height:auto; overflow:hidden; }
.swipe { height:1.7rem; color:#ffffff; font-size:30px; text-align:center; }
.banner img { width:100% }
.product-tc .info { background:#ffffff; width:95%; margin:auto; padding-bottom:0.1rem; text-align:center; margin-top:0.1rem; font-size:0.14rem; }
.product-tc .info p { padding-bottom:0.1rem; }
.product-tc .info .p1 { font-size:0.2rem; }
.product-tc .info .p1 span { vertical-align:middle }
.product-tc .info .p1 img { vertical-align:middle; width:0.22rem; }
.product-tc .info .p2 { font-size:0.12rem; color:#b8b8b8; height: 0.28rem; }
.product-tc .info .p2 span { padding:0 0.1rem }
.product-tc .info .p2 .accounts {display: inline-block; float: right; overflow: hidden; width: 0.4rem; height: 0.28rem;line-height: 0.28rem; border-radius: 4px; background: #FFFF00; font-size: 0.14rem; color: #000000; cursor: pointer;}
.product-tc .info .p3 span { color:#646464; margin-right:0.05rem; }
.product-tc .info .p3 em { color:#acacac; }
.product-tc .info .bot { text-align:left; color:#9c9c9c; padding:0.03rem 0; overflow:hidden; line-height:0.3rem; }
.product-tc .info .tel { margin-top:0.1rem; }
.product-tc .info a { color:#9c9c9c; }
.product-tc .info .addr { text-align: left; }
.product-tc .info .addr span { display:inline-block; width:80%; line-height: 0.22rem; color: #9c9c9c; }
.product-tc .info .bot i { float:right; display:inline-block; width:0.3rem; height:0.3rem; border-radius:0.25rem; border:#eeeeee 1px solid; }
.product-tc .info .bot .tel-ico { background:url("../assets/images/ico-tel.png") center center no-repeat; background-size:0.14rem 0.19rem; }
.product-tc .info .bot .map-ico { background:url("../assets/images/ico-map.png") center center no-repeat; background-size:0.14rem 0.19rem; }
.gray-line { width:100%; height:0.1rem; overflow:hidden; background:#f7f7f7; }
.product-tc .dis-list { overflow:hidden; padding:0.15rem 0.1rem; }
.product-tc .dis-list li { height:0.3rem; line-height:0.3rem; color:#000000; font-size:0.13rem;; }
.product-tc .dis-list .discountIcon { overflow: hidden; float: left; color: #ff4b0f; }
.product-tc .dis-list li .discountMoney { display: inline-block; width: 72%; margin-left: 0.1rem; }
.product-tc .dis-list li .discountNum { color: #898989; }
/*
.product-tc .dis-list li .fl { padding-left:0.25rem; }
.product-tc .dis-list li .fr { color:#898989; }
.product-tc .dis-list .p1 .fl { background:url("../assets/images/hhi.png") left center no-repeat; background-size:0.18rem 0.18rem; }
.product-tc .dis-list .p2 .fl { background:url("../assets/images/dis.png") left center no-repeat; background-size:0.18rem 0.18rem; }
.product-tc .dis-list .p3 .fl { background:url("../assets/images/ssi.png") left center no-repeat; background-size:0.18rem 0.18rem; }
*/
.product-tc .w-tab { width:100%; height:0.4rem; display:-webkit-box; background:#ffffff; border-bottom:#d9d9d9 1px solid; }
.product-tc .w-tab li { -webkit-box-flex:1; text-align:center; font-size:0.16rem; }
.product-tc .w-tab li span { display:inline-block; margin-top:0.07rem; }
.product-tc .w-tab li.current { color:#fc3756 }
.product-tc .w-tab li.current span { border-bottom:#fc3756 3px solid; }
.product-tc .pro-tab-con { overflow:hidden; font-size:0.14rem; height:3.65rem; box-sizing: border-box;}
.product-tc .pro-tab-con .left { position: relative; width:0.8rem; float:left;height: 100%; overflow-y: auto; -webkit-overflow-scrolling: touch;}
.product-tc .pro-tab-con .left .tab { text-align:center; background:#f8f8f8; padding:0.2rem 0.1rem; overflow:hidden; border-bottom:#eaeaea 1px solid; }
.product-tc .pro-tab-con .left .tab .hot { color: #ff4b0f; font-size: 0.12rem; }
/*
.product-tc .pro-tab-con .left .t img { width:0.13rem; height:0.13rem; display:inline-block; vertical-align:middle }
*/
.product-tc .pro-tab-con .left .tab span { vertical-align:middle; margin-left:0.02rem; }
.product-tc .pro-tab-con .left li { color:#666666; position:relative; padding:0.13rem 0.2rem; overflow:hidden; text-align:center; border-bottom:#eaeaea 1px solid; background:#f8f8f8 }
.product-tc .pro-tab-con .left li .num { position:absolute; right:0.1rem; top:0.1rem; padding:0 0.05rem; height:0.14rem; line-height:0.14rem; overflow:hidden; background:#ff461d; color:#ffffff;; border-radius:0.1rem; }
.product-tc .pro-tab-con .con {position: relative; height: 100%; overflow-y: auto; margin-left:0.8rem; -webkit-overflow-scrolling: touch;}
.product-tc .pro-tab-con .con .t1 { padding:0.1rem; overflow:hidden; color:#666666; background:#f8f8f8; }
.product-tc .pro-tab-con .con .t2 { color:#f69826; font-size:0.12rem; padding:0.05rem 0.08rem; overflow:hidden; background:#fff8d5; }
.product-tc .pro-tab-con .con li { padding:0.15rem 0.1rem; overflow:hidden; border-bottom:#eeeeee 1px solid; }
.product-tc .pro-tab-con .con li .img { width:0.6rem; height: 0.6rem; float:left; overflow:hidden; border-radius: 0.6rem; }
.product-tc .pro-tab-con .con li .w101 {width: 100%; height: 100%;}
.product-tc .pro-tab-con .con li .p1 { font-size:0.15rem; color:#333333; }
.product-tc .pro-tab-con .con li .p2 { font-size:0.12rem; color:#b0b0b0; margin-top:0.01rem; }
.product-tc .pro-tab-con .con li .p3 { font-size:0.12rem; color:#666666; margin-top:0.01rem; }
.product-tc .pro-tab-con .con li .det { margin-left:0.7rem; line-height: 0.2rem;}
.product-tc .pro-tab-con .con li .p4 { color:#ff6000; margin-top:0.05rem; }
.product-tc .pro-tab-con .con li .p4 .fl em { font-size:0.18rem; font-weight:bold; }
.product-tc .pro-tab-con .con li .p4 .fl span { font-size:0.1rem; vertical-align:0.04rem; color:#999999; text-decoration:line-through }
.product-tc .pro-tab-con .con li .p4 i { display:inline-block; width:0.18rem; height:0.18rem; }
/*
.product-tc .pro-tab-con .con li .p4 .fr { margin-top:0.02rem; }
.product-tc .pro-tab-con .con li .p4 .add { float:right; background:url("../assets/images/add.png") center center no-repeat; background-size:contain; }
*/
.product-tc .pro-tab-con .con li .p4 .add { float: right; color: #ff4b0f; }
.product-tc .pro-tab-con .con li .p4 .num { font-size:0.2rem; text-align:center; }
/*
.product-tc .pro-tab-con .con li .p4 .sub { float:right; background:url("../assets/images/sub.png") center center no-repeat; background-size:contain }
*/
.product-tc .pro-tab-con .con li .p4 .sub { color: #ff4b0f; font-size: 0.2rem; }
.pro-bot { z-index:12345; position:fixed; left:0; bottom:0; width:100%; height:0.5rem; overflow:hidden; }
.pro-bot .bg { width:100%; height: 0.45rem; position:absolute; bottom:0; left:0; background:#434343; }
.pro-bot .logo2 { position:relative; z-index:12; width:0.5rem; height:0.5rem; margin-left:0.1rem; background:url("../assets/images/prologo.png") center center no-repeat; background-size:contain; }
.pro-bot .pri { float:left; color:#ffffff; margin-left:0.7rem; margin-top:0.1rem; font-size:0.22rem; }
.pro-bot .pay { width:35%; height:0.45rem; float:right; text-align:center; background:#fa500f; font-size:0.18rem; color:#ffffff; line-height:0.4rem; }
.size6 { width:100%; height:0.6rem; overflow:hidden; }
.pro-bot .logo2 .num { height:0.16rem; position:absolute; right:-0.05rem; top:0; color:#ffffff; z-index:123; background:#19a7ff; padding:0 0.06rem; border-radius:0.1rem; vertical-align:middle }
.pro-tab-dis { overflow:hidden; }
.pro-tab-dis .sum { padding:0.1rem; overflow:hidden; border-bottom:#d9d9d9 1px solid }
.pro-tab-dis .sum .fl { width:35%; float:left; overflow:hidden; height:0.7rem; text-align:center; border-right:#d9d9d9 1px solid; }
.pro-tab-dis .sum .fl .p1 { font-size:0.23rem; color:#fa500f; margin-top:0.03rem; }
.pro-tab-dis .sum .fl .p2 { font-size:0.12rem; color:#333333; margin-top:0.03rem; }
.pro-tab-dis .sum .fl .p3 { font-size:0.12rem; color:#999999;; }
.pro-tab-dis .sum .right { width:64%; float:left; overflow:hidden; }
.pro-tab-dis .sum .right .item { width:100%; overflow:hidden; text-align:center; margin-top:0.05rem; }
.redstars { display:inline-block; vertical-align:middle; position:relative; width:0.68rem; height:0.13rem; overflow:hidden; background:url("../assets/images/star-gray.png") top left no-repeat; background-size:0.68rem 0.13rem }
.redstars span { display:block; position:absolute; overflow:hidden; left:0; top:0; width:100%; height:0.14rem; }
.redstars img { display:block; width:0.68rem; height:0.12rem; }
.redstars .rw1 { width:20%; }
.redstars .rw2{ width:40%; }
.redstars .rw3 { width:60%; }
.redstars .rw4 { width:80%; }
.redstars .rw5 { width:100%; }
.pro-tab-dis .sum .right .item .name { margin-right:0.05rem; vertical-align:middle; display:inline-block; color:#666666; font-size:0.12rem; }
.pro-tab-dis .sum .right .item .num { margin-left:0.05rem; vertical-align:middle; display:inline-block; color:#ff6432; font-size:0.12rem; }
.product-tc .taglist { width:95%; margin:auto; padding-bottom:0.08rem; border-bottom:#e6e6e6 1px dashed; }
.product-tc .taglist span { display:inline-block; padding:0.07rem 0.09rem; overflow:hidden; border-radius:0.03rem; color:#ffffff; margin-right:0.05rem; margin-top:0.03rem; }
.product-tc .taglist .b1 { background:#fa500f; }
.product-tc .taglist .b2 { background:#fc8d63; }
.product-tc .taglist .b3 { background:#f5f5f5; color:#b4b4b4; }
.product-tc .filter { padding:0.1rem 0; width:95%; margin:auto; overflow:hidden; border-bottom:#e6e6e6 1px solid }
.product-tc .filter .chk { vertical-align:middle; width:0.14rem; height:0.14rem; overflow:hidden; display:inline-block; background:url("../assets/images/sele1.png") center center no-repeat; background-size:contain; }
.product-tc .filter .current { background:url("../assets/images/sele2.png") center center no-repeat; background-size:contain; }
.product-tc .filter span { vertical-align:middle; font-size:0.14rem; }
.product-tc .comm { overflow:hidden; }
.product-tc .comm li { width:95%; margin:auto; padding:0.1rem 0; overflow:hidden; border-bottom:#eeeeee 1px solid; }
.product-tc .comm li .img { float:left; width:0.5rem; height:0.5rem; border-radius:0.5rem; overflow:hidden; }
.product-tc .comm li .det { margin-left:0.6rem; overflow:hidden; font-size:0.14rem; }
.product-tc .comm li .p1 { overflow:hidden; }
.product-tc .comm li .p2 { overflow:hidden; margin-top:0.05rem; }
.product-tc .comm li .p2 .txt { padding-left:0.1rem; overflow:hidden; color:#666666; font-size:0.12rem; }
.product-tc .comm li .p3 { overflow:hidden; margin-top:0.05rem;min-height:0.16rem;}
.product-tc .comm li .p3 .digg { width:0.15rem; height:0.15rem; overflow:hidden; float:left; background:url("../assets/images/digg5.png") center center no-repeat; background-size:contain; }
.product-tc .comm li .p3 .box { margin-left:0.16rem; overflow:hidden; }
.product-tc .comm li .p3 .box span { display:inline-block; overflow:hidden; width:0.8rem; height:0.24rem; margin-bottom:0.03rem;; line-height:0.24rem; margin-left:0.05rem; border-radius:0.03rem; border:#dedede 1px solid; color:#9f9f9f; text-align:center; font-size:0.12rem; }
.product-tc .pro-tab-con .left li.current{background: #ffffff;}
.product-tc .pro-tab-con .left li.current:after{ content:' '; position:absolute; left:0; top:0; width:5px; height:100%; background:#ff461d;}
</style>
