import App from './pages/App.vue'
/**
 * AboutUs Route
 */
import Aboutus from './pages/AboutUs/Aboutus.vue'
/**
 * Address Route
 */
import Address from './pages/Address/Address.vue'
import AddressAdd from './pages/Address/AddressAdd.vue'
/**
 * Charity Route
 */
import Charity from './pages/Charity/Charity.vue'
import CharityList from './pages/Charity/CharityList.vue'
/**
 * CheckAll Route
 */
import CheckAll from './pages/CheckAll/CheckAll.vue'
/**
 * Cooperate Route
 */
import Cooperate from './pages/Cooperate/Cooperate.vue'
import CooperateHome from './pages/Cooperate/CooperateHome.vue'
/**
 * Film Route
 */
import FilmTv from './pages/Film/FilmTv.vue'
import FilmList from './pages/Film/FilmList.vue'
import FilmDetail from './pages/Film/FilmDetail.vue'
/**
 * Forum Route
 */
import ActLabel from './pages/Forum/ActLabel.vue'
import ActPlace from './pages/Forum/ActPlace.vue'
import Community from './pages/Forum/Community.vue'
import Details from './pages/Forum/Details.vue'
import EndDate from './pages/Forum/EndDate.vue'
import Module from './pages/Forum/Module.vue'
import PostActivity from './pages/Forum/PostActivity.vue'
import PostComment from './pages/Forum/PostComment.vue'
import PostCommon from './pages/Forum/PostCommon.vue'
import PostType from './pages/Forum/PostType.vue'
import QqSend from './pages/Forum/QqSend.vue'
import Reply from './pages/Forum/Reply.vue'
import StartDate from './pages/Forum/StartDate.vue'
import WeChatSend from './pages/Forum/WechatSend.vue'

import NotFound from './pages/NotFound.vue'
import FunList from './pages/Fun/FunList.vue'
import FunCat from './pages/Fun/FunCat.vue'
import Fun from './pages/Fun/Fun.vue'
import Service from './pages/Service.vue'
import Thing from './pages/Thing.vue'
import Category from './pages/Category.vue'
import New from './pages/News/New.vue'
import NewList from './pages/News/NewList.vue'
import Convenient from './pages/Convenient.vue'
import Government from './pages/Goverment/Government.vue'
import Ask from './pages/Goverment/Ask.vue'
import AskList from './pages/Goverment/AskList.vue'
import AskDetail from './pages/Goverment/AskDetail.vue'
import Nearby from './pages/Nearby/Nearby.vue'
import Discount from './pages/Discount.vue'
import Trade from './pages/Trade.vue'
import User from './pages/User.vue'
import Mail from './pages/Mail.vue'
import Feedback from './pages/Feedback.vue'
import Userset from './pages/Userset.vue'
import Myset from './pages/Myset.vue'
import Gold from './pages/Gold.vue'
import Signature from './pages/Signature.vue'
import Nick from './pages/Nick.vue'
import Pic from './pages/Pic.vue'
import Search from './pages/Search.vue'
import Comment from './pages/News/Comment.vue'
import Product from './pages/SpecialOffer/Product.vue'
import Company from './pages/Company.vue'
import Collect from './pages/Collect.vue'
import Message from './pages/Message.vue'
import MsgSet from './pages/MsgSet.vue'
import Order from './pages/Order/Order.vue'
import OrderList from './pages/Order/OrderList.vue'
import OrderDetail from './pages/Order/OrderDetail.vue'
import Pay from './pages/Pay.vue'
import Explain from './pages/Explain.vue'
import Ccomment from './pages/Fun/Ccomment.vue'
import Notice from './pages/Notice.vue'
import Tel from './pages/Tel.vue'
import Success from './pages/Success.vue'
import Wjs from './pages/Wjs.vue'
import Answer from './pages/Goverment/Answer.vue'
import SendComment from './pages/News/SendComment.vue'
import ProductList from './pages/SpecialOffer/ProductList.vue'
import ProductDetail from './pages/SpecialOffer/ProductDetail.vue'
import CommentDetail from './pages/SpecialOffer/CommentDetail.vue'
import OfferOrder from './pages/SpecialOffer/OfferOrder.vue'
import BeforeLogin from './pages/Login/BeforeLogin.vue'
import FastLogin from './pages/Login/FastLogin.vue'
import LoginVerify from './pages/Login/LoginVerify.vue'
import RegisterProtocol from './pages/Login/RegisterProtocol.vue'

const routes = [
    {path: '/',component: App, name: "主页"},
    {path: '/checkall',component: CheckAll, name: "查看更多"},
    {path: '/notfound',component: NotFound, name: "找不到"},
    {path: '/wjs',component: Wjs, name: "未建设"},
    {path: '/funlist', component: FunList, name: "好玩"},
    {path: '/funcat/:type', component: FunCat, name: "好玩分类"},
    {path: '/thing/:id', component: Thing, name: "好物物品"},
    {path: '/fun/:id', component: Fun, name: "好玩好物"},
    {path: '/service', component: Service, name: "服务"},
    {path: '/charity/:id', component: Charity, name: "慈善详情"},
    {path: '/charity/', component: CharityList, name: "慈善列表"},
    {path: '/category/', component: Category, name: "分类列表"},
    {path: '/new/', component: NewList, name: "新闻列表"},
    {path: '/new/:id', component: New, name: "新闻详情"},
    {path: '/convenient/', component: Convenient, name: "便民服务"},
    {path: '/government/', component: Government, name: "智慧政务"},
    {path: '/ask/', component: Ask, name: "互动问答"},
    {path: '/asklist/', component: AskList, name: "互动列表"},
    {path: '/asklist/:id', component: AskDetail, name: "互动详情"},
    {path: '/nearby/:categoryid', component: Nearby, name: "附近好店"},
    {path: '/discount/', component: Discount, name: "天天特惠"},
    {path: '/trade/', component: Trade, name: "商圈"},
    {path: '/user/', component: User, name: "我的"},
    {path: '/cooperate/', component: Cooperate, name: "合作入驻"},
    {path: '/cooperateHome', component: CooperateHome, name: "合作入驻首页"},
    {path: '/mail/', component: Mail, name: "邮箱"},
    {path: '/feedback/', component: Feedback, name: "意见反馈"},
    {path: '/userset/', component: Userset, name: "个人中心"},
    {path: '/myset/', component: Myset, name: "我的设置"},
    {path: '/gold/', component: Gold, name: "鲸豆"},
    {path: '/sign/', component: Signature, name: "签名"},
    {path: '/about/', component: Aboutus, name: "关于我们"},
    {path: '/nick/', component: Nick, name: "昵称"},
    {path: '/pic/', component: Pic, name: "图片"},
    {path: '/search/:type', component: Search, name: "查找"},
    {path: '/comment/:id', component: Comment, name: "评论详情"},
    {path: '/company/:id', component: Company, name: "店铺详情"},
    {path: '/collect/', component: Collect, name: "收藏"},
    {path: '/message/', component: Message, name: "消息提醒"},
    {path: '/msgset/', component: MsgSet, name: "消息提醒设置"},
    {path: '/orderlist/', component: OrderList, name: "订单列表"},
    {path: '/orderlist/:id', component: OrderDetail, name: "订单详情"},
    {path: '/order/:id', component: Order, name: "支付页面"},
    {path: '/address/', component: Address, name: "订单地址"},
    {path: '/addressadd/:id', component: AddressAdd, name: "添加订单地址"},
    {path: '/pay/:id', component: Pay, name: "支付"},
    {path: '/explain/', component: Explain, name: "说明"},
    {path: '/ccomment/:id', component: Ccomment, name: "公司评论"},
    {path: '/notice/:type', component: Notice, name: "消息列表"},
    {path: '/filmtv/', component: FilmTv, name: "视频首页"},
    {path: '/filmlist/:category/:type', component: FilmList, name: "视频列表"},
    {path: '/filmdetail/:id', component: FilmDetail, name: "视频详情"},
    {path: '/tel/', component:Tel, name: "电话充值"},
    {path: '/success/:id', component:Success, name: "支付成功的页面"},
    {path: '/answer/:id', component: Answer, name: "疑问解答"},
    {path: '/sendcomment/:id', component: SendComment, name: "新闻评论"},
    {path: '/product/:id', component: Product, name: "产品详情"},
    {path: '/productlist/', component: ProductList, name: "产品列表"},
    {path: '/productdetail/:id', component: ProductDetail, name: "折扣产品详情"},
    {path: '/commentdetail/:id', component: CommentDetail, name: "评论页面"},
    {path: '/offerorder/:id', component: OfferOrder, name: "特惠订单"},
    {path: '/login/', component: BeforeLogin, name: "登录之前"},
    {path: '/register', component: BeforeLogin, name: "注册"},
    {path: '/fastlogin/', component: FastLogin, name: "快速登录"},
    {path: '/phoneverify/', component: LoginVerify, name: "手机验证"},
    {path: '/protocol/', component: RegisterProtocol, name: "注册协议书"},
    {path: '/community/', component: Community, name: "论坛"},
    {path: '/module/:id', component: Module, name: "类型页面"},
    {path: '/details/:id/:detailsid/', component: Details, name: "帖子详情页面"},
    {path: '/postcomment/:id/:detailsid/:commentid/', component: PostComment, name: "发表评论页面"},
    {path: '/reply/:id/:detailsid/:commentid/', component: Reply, name: "评论的回复页面"},
    {path: '/posttype/', component: PostType, name: "发帖类型"},
    {path: '/postactivity/:id', component: PostActivity, name: "活动贴发布"},
    {path: '/postcommon/:id', component: PostCommon, name: "普通贴发布"},
    {path: '/starttime/:id', component: StartDate, name: "开始时间"},
    {path: '/endtime/:id', component: EndDate, name: "结束时间"},
    {path: '/actplace/:id', component: ActPlace, name: "活动地点"},
    {path: '/actlabel/:id', component: ActLabel, name: "活动标签"},
    {path: '/qq/:id', component: QqSend, name: "QQ信息"},
    {path: '/wechat/:id', component: WeChatSend, name: "微信信息"},
];

export default routes
