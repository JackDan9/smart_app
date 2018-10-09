<template>
    <div>
        <div class="navTop">
            <i class="iconfont back" onclick="javascript:history.go(-1)">&#xe609;</i>
            <span class="navCon">分类</span>
        </div>
        <div class="classify-page">
            <div class="item fl">
                <router-link :to="{ path: '/nearby/39' }">
                    <div class="img"><img src="../assets/images/c1.png"/></div>
                    <div class="mask"><span>餐吧</span></div>
                </router-link>
            </div>
            <div class="item fr">
                <router-link :to="{ path: '/nearby/38' }">
                    <div class="img"><img src="../assets/images/c2.png"/></div>
                    <div class="mask"><span>咖啡馆</span></div>
                </router-link>
            </div>
            <div class="item fl">
                <router-link :to="{ path: '/nearby/44' }">
                    <div class="img"><img src="../assets/images/c3.png"/></div>
                    <div class="mask"><span>旅舍</span></div>
                </router-link>
            </div>
            <div class="item fr">
                <router-link :to="{ path: '/nearby/62' }">
                    <div class="img"><img src="../assets/images/c4.png"/></div>
                    <div class="mask"><span>KTV</span></div>
                </router-link>
            </div>
            <div class="item fl">
                <router-link :to="{ path: '/nearby/45' }">
                    <div class="img"><img src="../assets/images/c5.jpg"/></div>
                    <div class="mask"><span>大排档</span></div>
                </router-link>
            </div>
            <div class="item fr">
                <router-link :to="{ path: '/nearby/63' }">
                    <div class="img"><img src="../assets/images/c11.png"/></div>
                    <div class="mask"><span>影吧</span></div>
                </router-link>
            </div>
            <div class="item fl">
                <router-link :to="{ path: '/nearby/60' }">
                    <div class="img"><img src="../assets/images/c8.png"/></div>
                    <div class="mask"><span>丽人</span></div>
                </router-link>
            </div>
            <div class="item fr">
                <router-link :to="{ path: '/nearby/46' }">
                    <div class="img"><img src="../assets/images/c5.png"/></div>
                    <div class="mask"><span>小酒馆</span></div>
                </router-link>
            </div>
            <div class="item fl">
                <router-link :to="{ path: '/nearby/56' }">
                    <div class="img"><img src="../assets/images/c6.png"/></div>
                    <div class="mask"><span>艺术空间</span></div>
                </router-link>
            </div>
            <div class="item fr">
                <router-link :to="{ path: '/nearby/59' }">
                    <div class="img"><img src="../assets/images/c7.png"/></div>
                    <div class="mask"><span>夜市</span></div>
                </router-link>
            </div>
            <div class="item fl">
                <router-link :to="{ path: '/nearby/61' }">
                    <div class="img"><img src="../assets/images/c9.png"/></div>
                    <div class="mask"><span>大保健</span></div>
                </router-link>
            </div>
            <div class="item fr">
                <router-link :to="{ path: '/nearby/64' }">
                    <div class="img"><img src="../assets/images/c12.png"/></div>
                    <div class="mask"><span>面包房</span></div>
                </router-link>
            </div>
            <div class="item fl">
                <router-link :to="{ path: '/nearby/52' }">
                    <div class="img"><img src="../assets/images/c13.png"/></div>
                    <div class="mask"><span>杂货铺</span></div>
                </router-link>
            </div>
            <div class="item fr">
                <router-link :to="{ path: '/nearby/65' }">
                    <div class="img"><img src="../assets/images/c14.png"/></div>
                    <div class="mask"><span>DIY手作</span></div>
                </router-link>
            </div>
            <div class="item fl">
                <router-link :to="{ path: '/nearby/66' }">
                    <div class="img"><img src="../assets/images/c16.png"/></div>
                    <div class="mask"><span>运动健身</span></div>
                </router-link>
            </div>
            <div class="item fr">
                <router-link :to="{ path: '/nearby/67' }">
                    <div class="img"><img src="../assets/images/c15.png"/></div>
                    <div class="mask"><span>山庄别院</span></div>
                </router-link>
            </div>
            <div class="item fl">
                <router-link :to="{ path: '/nearby/43' }">
                    <div class="img"><img src="../assets/images/c17.png"/></div>
                    <div class="mask"><span>花房</span></div>
                </router-link>
            </div>
            <div class="item fr">
                <router-link :to="{ path: '/nearby/57' }">
                    <div class="img"><img src="../assets/images/c18.png"/></div>
                    <div class="mask"><span>甜品铺</span></div>
                </router-link>
            </div>
            <div class="item fl">
                <router-link :to="{ path: '/nearby/55' }">
                    <div class="img"><img src="../assets/images/c19.png"/></div>
                    <div class="mask"><span>家饰馆</span></div>
                </router-link>
            </div>
            <div class="item fr">
                <router-link :to="{ path: '/nearby/45' }">
                    <div class="img"><img src="../assets/images/c20.png"/></div>
                    <div class="mask"><span>茶空间</span></div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<style scoped>
.navTop { z-index: 12345; }
.classify-page{ overflow:hidden; padding-top: 0.48rem; background:#ffffff; }
.classify-page .item{ position:relative; width:49.5%; margin-bottom:1%; overflow:hidden;}
.classify-page .item img{width:100%; border-radius: 2px;}
.classify-page .item .mask{ position:absolute; width:100%; height:100%; left:0; top:0; background:rgba(0,0,0,0.5); border-radius: 2px;}
.classify-page .item .mask span{ display:inline-block; width:100%; height:0.3rem; position:absolute; top:50%; left:0;margin-top:-0.16rem; color:#ffffff; font-size:0.2rem; line-height:0.3rem; text-align:center;}
</style>
