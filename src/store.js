

export default {
  AUTH_UID: 'authuid',
  INDEX_SAVE: 'index',
  USERNAME:'username',
  COMPANYID:'companyid',
  POINT:'point',
  INTOPAGE:'intopage',
  VERSION:'version',
  getAuthUid: function(){
    return localStorage.getItem(this.AUTH_UID) || ""//|| 'UjAECwFXAlJWB1oGDwwHXVRXBV8EUQFXBAdQWgwDWQsCVQ'
  },
  setAuthIid: function(authuid){
    localStorage.setItem(this.AUTH_UID,authuid)
  },

  getIndex: function(){
    return JSON.parse(localStorage.getItem(this.INDEX_SAVE))
  },
  setIndex: function( data ){
    var str = data;
    if( typeof data === 'object' ){
      str = JSON.stringify(data)
    }
    return localStorage.setItem(this.INDEX_SAVE,str)
  },
  
  setPOINT: function(point){
    var str = point;
    if(typeof point === 'object'){
       str = JSON.stringify(point);
    }
    return localStorage.setItem(this.POINT,str)
  },
  
  getPOINT: function(){
     try{
       return JSON.parse(localStorage.getItem(this.POINT))
      }catch(e){
        console.log(e.toLocaleString())
     }
  },
  
  getUserName: function(){
    return localStorage.getItem(this.USERNAME) || ""
  },
  setUserName: function(username){
    localStorage.setItem(this.USERNAME,username)
  },
  
  getCompanyid: function(){
    return localStorage.getItem(this.COMPANYID) || ""
  },
  setCompanyid: function(companyid){
    localStorage.setItem(this.COMPANYID,companyid)
  },
  getIntoPage: function(){
    return localStorage.getItem(this.INTOPAGE) || ""
  },
  setIntoPage: function(intopage){
    localStorage.setItem(this.INTOPAGE,intopage)
  },
  getVersion: function(){
    return localStorage.getItem(this.VERSION) || ""
  },
  setVersion: function(version){
    localStorage.setItem(this.VERSION,version)
  },

  getUserMessage:function(username,despass,authuid){
     var tags = [username,"aa"]
     var share = {
        action: 'getUserMessage',
        Authorization: 'Xyapp ' + authuid,
        tags: tags,
        user:despass,
        deviceWIFI:'http://117.158.161.250',
        url: 'http://www.baidu.com?'+new Date().getTime()
     }
     if(window.postMessage) window.postMessage(JSON.stringify(share),'*');
     return true
  }
}
