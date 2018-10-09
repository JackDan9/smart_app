<template>
    <div>
        <div class="communityNav">
            <i class="iconfont back" v-on:click="goBack()">&#xe609;</i>
            <span class="title">嘿咻社区</span>
            <i class="iconfont posting" v-on:click="post()">&#xe6c7;</i>
        </div>
        <div class="communityPage">
            <div class="area">
                <p class="title">
                    <span class="left">专区 <i class="en">AREA</i></span>
                    <span class="right">是老司机就亮出你的车技</span>
                </p>
                <ul class="modules">
                    <li class="first" v-on:click="game()"></li>
                    <li class="second" v-on:click="food()"></li>
                    <li class="third" v-on:click="outdoor()"></li>
                    <li class="fourth" v-on:click="brokenews()"></li>
                    <li class="fifth" v-on:click="photo()"></li>
                    <li class="sixth" v-on:click="chat()"></li>
                </ul>
            </div>
            <div class="stick">
                <div class="officialAct" v-on:click="goDetail(index)" v-for="(item, index) in stickList" :key="index">
                    <i class="iconOff">
                        <img v-bind:src="[item.u_picture ? fullUrl(item.u_picture) : defaultPicUrl()]" />
                    </i>
                    <i v-bind:class="typeClassList[item.type]">{{typeList[item.type]}}</i>
                    <span v-bind:class="[item.type == 3 ? 'offConOther' : 'offCon']">{{item.title}}</span>
                </div>
            </div>
            <div class="comprehensive">
                <div class="title">
                    <span class="ch">综合<i class="en">ALL</i></span>
                    <span class="comprehensiveCon">
                        <i v-bind:class="[ !isActive ? 'dn' : 'iconfont']" v-on:click="choose()">&#xe636;</i>
                        <i v-bind:class="[ !isActive ? 'iconfont fontColor' : 'dn']" v-on:click="choose()">&#xe606;</i>
                        <span class="see">只看活动帖</span>
                    </span>
                </div>
                <ul class="actInfo" v-infinite-scroll="loadMoreCommunity" infinite-scroll-disabled="isLoading" infinite-scroll-distance="10">
                    <li v-on:click="goDetail(index)"
                        v-for="(item, index) in barList" :key="index"
                        v-show="item.type != 3 || isActive"
                        v-bind:class="[(item.title && item.content) ? 'actInfoFir' : 'dn']">
                        <p class="person">
                            <i class="personIcon">
                                <img v-bind:src="item.u_picture ? fullUrl(item.u_picture) : defaultPicUrl()"/>
                            </i>
                            <span class="name">{{item.username}}</span>
                            <span class="time">{{item.addtime}}</span>
                        </p>
                        <p class="labelFir">
                            <i v-bind:class="typeClassList[item.type]">{{typeList[item.type]}}</i>
                            <span v-bind:class="[item.type != 3 ? 'actTitle' : 'actNotTitle']">{{item.title}}</span>
                        </p>
                        <p class="labelSec">
                            <span class="Con">{{item.content}}</span>
                        </p>
                        <ul v-bind:class="[item.pics.length !== 0 ? 'photo' : 'dn']">
                            <li v-bind:class="[item.pics.length === 1 ? 'photoInfoLong' : 'photoInfoShort']" v-for="(itemPic, indexPic) in item.pics" :key="indexPic">
                                <img class="index" v-bind:src="fullUrl(itemPic.picture) + '!640.200'" alt="智慧信阳欢迎您!" />
                            </li>
                        </ul>
                        <div class="bottom">
                            <div class="left">
                                <span v-for="(itemTag, indexTag) in item.tags" :key="indexTag">
                                    <i class="actLabel" v-bind:style="{background: itemTag.color }">{{itemTag.title}}</i>
                                </span>
                            </div>
                            <div class="right">
                                <span class="join">
                                    <i class="joinIcon"></i>
                                    <span class="joinNum">{{item.enrollNum}}</span>
                                </span>
                                <span class="comment">
                                    <i class="commentIcon"></i>
                                    <span class="commentNum">{{item.commentNum}}</span>
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <tab :index=3 />
    </div>
</template>
<script>
import Loading from '../../components/Loading.vue'
import Tab from '../../components/Tab.vue'
import Config from '../../config.js'
import {Toast} from 'mint-ui'
export default {
    components: {
        Tab,
        Loading
    },
    data () {
        return {
            isActive: true,
            isLoading: false,
            isShow: false,
            id: 0,
            categoryId: 0,
            typeClassList: ['',  'iconOffAct', 'iconAct', 'dn'],
            typeList: ['', '官方活动', '活动'],
            stickList: [],
            barList: [],
            viewList: 'bar/viewlist/',
        }
    },
    mounted () {
        this.getDataList()
    },
    methods: {
        fullUrl: function(url) {
            return Config.baseUrl + url
        },
        defaultPicUrl: function() {
            return Config.defaultPic
        },
        choose: function () {
            this.isActive  = !this.isActive;
        },
        goBack: function () {
            this.$router.push('/')
        },
        post:  function () {
           this.$router.push('/posttype/')
        },
        game: function () {
            this.categoryId = 1
            this.$router.push('/module/' + this.categoryId)
        },
        food: function () {
            this.categoryId = 2
            this.$router.push('/module/' + this.categoryId)
        },
        outdoor: function () {
            this.categoryId = 3
            this.$router.push('/module/' + this.categoryId)
        },
        brokenews: function () {
            this.categoryId = 4
            this.$router.push('/module/' + this.categoryId)
        },
        photo: function () {
            this.categoryId = 5
            this.$router.push('/module/' + this.categoryId)
        },
        chat: function () {
            this.categoryId = 6
            this.$router.push('/module/' + this.categoryId)
        },
        loadMoreCommunity() {
            this.getDataList()
        },
        goDetail: function(index) {
            let len = index
            this.id = this.barList[len].id
            let categoryId = this.barList[len].categoryid
            console.log(this.id)
            this.$router.push('/details/' + categoryId + '/' + this.id)
        },
        getDataList () {
            this.$http.post(this.viewList, {page:this.page}).then((response) => {
                const ret = JSON.parse(response.data || "[]")
                if(ret && ret.code === 0) {
                    this.page = ret.data.page
                    this.stickList = ret.data.zd
                    if(this.page == 1) {
                       this.barList = ret.data.bar
                    } else {
                        let barList_new = ret.data.bar
                        if(barList_new && (barList_new.length !== 0)) {
                            for(let i = 0; i < barList_new.length; i++) {
                                this.barList.push(barList_new[i])
                            }
                        }
                    }
                    this.total = ret.data.total
                    if(this.page <= this.total) {
                        this.page = this.page + 1
                    }
                } else {
                    Toast(ret.msg)
                }
            })
        }
    }
}

</script>
<style scoped>
/* 头部导航栏 */
.communityNav { position: fixed; left: 0; right: 0; z-index: 12345;  width: 100%; height: 0.5rem; line-height: 0.5rem;background: #000000;}
// .communityNav .back { display: inline-block; width: 0.2rem; height: 0.2rem; background: url(../../assets/images/forum/community/icon-back.png) center center no-repeat; background-size: contain; margin-top: 0.14rem; margin-left: 0.05rem;}
.communityNav .back { color: #fff; float: left; overflow: hidden;  margin-left: 0.1rem; }
.communityNav .title { display: inline-block; width: 78%; height: 0.5rem; font-size: 0.2rem; text-align: center; color: #fff; }
// .communityNav .posting { display: inline-block; width: 0.2rem; height: 0.2rem; background: url(../../assets/images/forum/community/posting-white.png) center center no-repeat; background-size: contain;}
.communityNav .posting { overflow: hidden; color: #fff; float: right; margin-right: 0.1rem; }
/* 主页面 */
.communityPage {padding-top: 0.5rem; width: 100%; height: 100%; }
/* 专区 */
.communityPage .area { display: block; }
.communityPage .area .title { display: block; width: 100%; height: 0.5rem; line-height: 0.5rem; font-size: 0.16rem; }
.left { display: inline-block; width: 34%; text-align: center; font-size: 0.18rem; }
.left .en { color: #C0C0C0; font-size: bold; }
.right { display: inline-block; width: 62%; text-align: right; }
/* 专区模块 */
.modules { display: block; width: 99%; margin: 0 auto; margin-left: 1%; }
.modules li { display: inline-block; overflow: hidden; width: 32%; height: 0.7rem; border-radius: 5%; }
.modules .first { background: url(../../assets/images/forum/community/modules/first.png) center center no-repeat; background-size: cover;  }
.modules .second { background: url(../../assets/images/forum/community/modules/second.png) center center no-repeat; background-size: cover; }
.modules .third { background: url(../../assets/images/forum/community/modules/third.png) center center no-repeat; background-size: cover;  }
.modules .fourth { background: url(../../assets/images/forum/community/modules/fourth.png) center center no-repeat; background-size: cover;}
.modules .fifth { background: url(../../assets/images/forum/community/modules/fifth.png) center center no-repeat; background-size: cover;}
.modules .sixth { background: url(../../assets/images/forum/community/modules/sixth.png) center center no-repeat; background-size: cover;}
/* 置顶 */
.stick { display: block; width: 100%; margin-top: 10px; border-top: 5px solid #f1f1f1; }
/* 官方活动 */
.officialAct { display: block; width: 99%; height: 0.5rem; line-height: 0.5rem; padding-left: 1%; overflow: hidden; }
.officialAct:nth-of-type(1) { border-bottom: 1px solid #f1f1f1; }
.officialAct .iconOff { float: left; display: inline-block; overflow: hidden; width: 0.4rem; height: 0.4rem; border-radius: 0.4rem; margin-top: 0.05rem; }
.iconOffAct { display: inline-block; width: 0.55rem; height: 0.2rem; margin-left: 0.03rem; font-size: 0.12rem; line-height: 0.2rem; color: #fff; text-align: center; background: red; }
.iconAct { display: inline-block; width: 0.5rem; height: 0.2rem; margin-left: 0.03rem; background: yellow; text-align: center; line-height: 0.2rem; }
.officialAct .offCon { display: inline-block; width: 69%; float: right; font-size: 0.13rem; }
.officialAct .offConOther { display: inline-block; width: 70%; font-size: 0.13rem; margin-left: 0.05rem; }
/* 综合 */
.comprehensive { display: block; width: 100%; border-top: 5px solid #f1f1f1; }
.comprehensive .title { height: 0.5rem; line-height: 0.5rem; font-size: 0.16rem; border-bottom: 1px solid #f1f1f1; }
.comprehensive .title .ch { font-size: 0.18rem; margin-left: 0.1rem; }
.comprehensive .title .en { font-size: 0.18rem; margin-left: 0.1rem; font-weight: bold; color: #C0C0C0; }
.comprehensive .title .comprehensiveCon { display: inline-block; width: 68%; text-align: right; }
.fontColor { color: green; }
.see { display: inline-block; float: right; height: 0.5rem; line-height: 0.5rem; }
/* 活动信息 */
.actInfo { display: block; width: 100%; margin-top: 0.3rem; }
.actInfo .actInfoFir { display: block; width: 96%; padding: 2%; border-bottom: 1px solid #f1f1f1; }
.actInfo .actInfoFir .person { display: block; height: 0.45rem; width: 100%; line-height: 0.23rem; }
.personIcon { display: inline-block; overflow: hidden; width: 0.45rem; height: 0.45rem; float: left; border-radius: 0.45rem; margin-right: 0.1rem; margin-left: 0.1rem; }
.person .name { display: inline-block; width: 70%; height: 0.22rem; font-size: 0.16rem; }
.person .time { display: inline-block; height: 0.22rem; font-size: 0.14rem; }
/*  第一个标签栏 */
.labelFir { display: block; width: 100%; height: auto; margin-top: 0.1rem; line-height: 0.18rem;  vertical-align: middle; }
.labelFir .act { display: inline-block; width: 0.6rem; height: 0.2rem; margin-left: 0.1rem; padding: 0.1rem 0; background: red; line-height: 0.2rem; text-align: center; font-size: 0.12rem; color: #fff; }
.labelFir .actTitle { display: inline-block; float: right; width: 80%;  font-size: 0.16rem; letter-spacing: 0.01rem; }
.labelFir .actNotTitle { display: inline-block; float: right; width: 100%; padding: 0.1rem 0; font-size: 0.16rem; font-weight: bold; letter-spacing: 0.01rem; }
/* 第二个标签栏 */
.labelSec { display: block; }
.labelSec .Con { display: inline-block; width: 98%; margin-left: 1%; font-size: 0.14rem; line-height: 0.22rem; letter-spacing: 0.005rem; }
/* 帖子图片 */
.photo { display: block; width: 100%; }
.photo .photoInfoLong { display: inline-block; overflow: hidden; width: 100%; height: 1.8rem; text-align: center; border-radius: 5px; }
.photo .photoInfoShort { display: inline-block; overflow: hidden; width: 48%; height: 1.8rem; margin-left: 0.05rem; text-align: center; border-radius: 5px; }
.photo .photoInfoShort .index { display: inline-block; width: 100%; height: 100%; }
.photo .photoInfoLong .index { display: inline-block; width: 100%; height: 100%; }
/* 底部标签 */
.bottom { display: block; width: 100%; height: 0.5rem; line-height: 0.5rem; vertical-align: middle; }
.bottom .left { display: inline-block;  float: left; width: 66%; height: 0.5rem; line-height: 0.05rem; text-align: left; }
.bottom .right { display: inline-block; width: 30%; }
.bottom .actLabel { display: inline-block; width: 0.6rem; height: 0.2rem; line-height: 0.2rem; margin-top: 0.15rem; margin-left: 0.1rem; font-size: 0.12rem; text-align: center; color: #fff; }
.bottom .join { display: inline-block; font-size: 0.16rem; }
.joinIcon { display: inline-block; overflow: hidden; float: left; width: 0.16rem; height: 0.16rem; margin-top: 0.15rem; margin-right: 0.05rem; background: url("../../assets/images/forum/community/bottom/join.png") center center no-repeat; background-size: contain; }
.bottom .comment { display: inline-block; font-size: 0.16rem; }
.commentIcon { display: inline-block; overflow: hidden; float: left; width: 0.16rem; height: 0.16rem; margin-top: 0.17rem; margin-right: 0.05rem; background: url("../../assets/images/forum/community/bottom/comment.png") center center no-repeat; background-size: contain;  }
</style>