/**
 * Created by liux on 17/11/25.
 */
class inject {
  constructor() {
    this.retina = window.devicePixelRatio;
  }

  init() {
    this.query();
    this.onRequest();
  }

  reset(response) {
    var self = this;
    if (response.enable) {
      document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('load', function () {
          self.resetImg(this)
        })
        self.resetImg(img)
      })
    }
  }

  //重置图片大小，使其适合retina屏
  resetImg(img) {
    if (!img.naturalWidth)return;
    var w = img.naturalWidth / this.retina;
    var h = img.naturalHeight / this.retina;
    img.setAttribute('style', "width:" + w + "px!important;height:" + h + "px!important")
  }

  //查询当前域名是否使能此功能
  query() {
    chrome.extension.sendRequest({url: location.origin}, (response) => {
      this.reset(response)
    });
  }

  //监听background js 的消息，返回当前url或者重置图片
  onRequest() {
    chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
      if (request.getUrl) {
        sendResponse({url: location.origin})
      } else {
        this.reset(request)
      }
    });
  }
}
new inject().init();