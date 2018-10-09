<template>
    <div>
        <div class="navTop">
            <i class="iconfont back" v-on:click="goBack()">&#xe609;</i>
            <span class="navCon">全部</span>
        </div>
        <div class="allPage">
            <router-link :to="{path:'/government'}">
                <img src="../../assets/images/app/all/government.png" alt="智慧信阳欢迎您!" />
            </router-link>
            <router-link :to="{path:'/convenient'}">
                <img src="../../assets/images/app/all/convenient.png" alt="智慧信阳欢迎您!" />
            </router-link>
            <router-link :to="{path:'/wjs'}">
                <img src="../../assets/images/app/all/nuts.png" alt="智慧信阳欢迎您!" />
            </router-link>
            <router-link :to="{path:'/company/1717'}" class="dn" >
                <img src="../../assets/images/app/all/fruit.png" alt="智慧信阳欢迎您!" />
            </router-link>
            <router-link :to="{path:'/company/1711'}" class="dn" >
                <img src="../../assets/images/app/all/cross.png" alt="智慧信阳欢迎您!" />
            </router-link>
            <router-link :to="{path:'/company/1705'}" class="dn" >
                <img src="../../assets/images/app/all/maner.png" alt="智慧信阳欢迎您!" />
            </router-link>
            <router-link :to="{path:'/filmtv'}" class="filmTv" >
                <img src="../../assets/images/app/all/filmTvAll.png" alt="智慧信阳欢迎您!" />
            </router-link>
            <router-link :to="{path: '/productlist'}" class="productList" >
                <img src="../../assets/images/app/all/productListAll.png" alt="智慧信阳欢迎您!" />
            </router-link>
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
            goBack: function() {
                this.$router.go(-1)
            }
        }
    }
</script>
<style>
/* 主页 */
.allPage { display: block; padding: 0.5rem 0.1rem; }
.allPage a { display: inline-block; width: 49%; margin-top: 0.05rem; }
.allPage a img { display: inline-block; width: 100%; }
</style>