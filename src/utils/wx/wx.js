//微信分享
import wx from 'weixin-js-sdk'
import Config from '@/config/config'
export default {
    wxinit: function (sObj) {
        wx.config({
            debug: false,
            appId: sObj.appId,
            timestamp: sObj.timestamp,
            nonceStr: sObj.nonceStr,
            signature: sObj.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareQZone'
            ]
        });
        wx.ready(function () {
            var shareObj = {
                title: sObj.title,
                desc: sObj.desc,
                link: sObj.url,
                imgUrl: Config.baseUrl + sObj.imgUrl
            };
            wx.onMenuShareTimeline({
                title: shareObj.title,
                desc: shareObj.desc,
                link: shareObj.link,
                imgUrl: shareObj.imgUrl,
                success: function (res) { },
                cancel: function (res) { }
            });
            //分享到好友
            wx.onMenuShareAppMessage({
                title: shareObj.title, // 标题
                desc: shareObj.desc, // 描述
                link: shareObj.link, // 链接
                imgUrl: shareObj.imgUrl, // 图片
                success: function (res) { },
                cancel: function (res) { },
            });
            wx.onMenuShareQQ({
                title: shareObj.title,
                desc: shareObj.desc,
                link: shareObj.link,
                imgUrl: shareObj.imgUrl,
                success: function (res) { },
                cancel: function (res) { }
            });
            wx.onMenuShareQZone({
                title: shareObj.title,
                desc: shareObj.desc,
                link: shareObj.link,
                imgUrl: shareObj.imgUrl,
                success: function (res) { },
                cancel: function (res) { }
            });
        });
    },
}
