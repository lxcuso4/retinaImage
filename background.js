/**
 * Created by liux on 17/11/25.
 */

class retina {
  constructor(){
    this.urlMap={}
  }
 init(){
   this.event();
   this.onRequest();
 }
 event(){
   //图标被点击,toggle当前页面功能
   chrome.browserAction.onClicked.addListener( ()=> {
     this.sendRequest({getUrl:true},this.setUrl.bind(this))
   });
   //选中的table发生变化
   chrome.tabs.onSelectionChanged.addListener( id=> {
     this.sendRequest({getUrl:true},this.setIcon.bind(this),id)
   })
   //table url更新
   chrome.tabs.onUpdated.addListener( id=> {
     this.sendRequest({getUrl:true},this.setIcon.bind(this),id)
   })
   //当标签附着在窗口上
   // chrome.tabs.onAttached.addListener(id=>{
   //   this.sendRequest({getUrl:true},this.setIcon.bind(this),id)
   // });
   //脱离窗口
   chrome.tabs.onDetached.addListener(id=>{
     this.sendRequest({getUrl:true},this.setIcon.bind(this),id)
   })
   //移动
   chrome.tabs.onMoved.addListener(id=>{
     this.sendRequest({getUrl:true},this.setIcon.bind(this),id)
   })
   //创建新的窗口
   chrome.tabs.onCreated.addListener(() =>{
     this.setIcon()
   })
 }
//根据当前url是否开启设置，icon
 setIcon(data){
   data = data || {}
   var url = data.url;
   var index = '';
     if (url && this.urlMap[url]){
       index = 1;
       this.sendRequest({enable:1})
     }
   chrome.browserAction.setIcon({path:"icon" + index + ".png"});
 }
 //根据当前页面url，设置或取消当前页面功能
 setUrl(data){
   if (data.url){
     var enable = this.urlMap[data.url]
     if (enable){
       this.sendRequest({enable:0})
       delete  this.urlMap[data.url]
     }else {
       this.sendRequest({enable:1})
       this.urlMap[data.url] = 1
     }
     this.setIcon(data)
   }
 }
 //像当前table发送数据{getUrl:true}为获取当前页面的url，{enable:1}使能当前页面
  sendRequest(data,cb,id){
   if (id){
     chrome.tabs.sendRequest(id,data,cb)
   }else {
     chrome.tabs.getSelected(null,function(tab){
       chrome.tabs.sendRequest(tab.id,data,cb)
     })
   }
  }
  //监听来自页面的查询，当前页面是否使能
  onRequest(){
    chrome.extension.onRequest.addListener(
      (request, sender, sendResponse)=> {
        var enable = this.urlMap[request.url];
        sendResponse({enable:enable})
      });
  }
}
new retina().init();
