import md5 from 'js-md5'

const base64 = require('js-base64').Base64

export default {
  // install;
  install (Vue) {
    // MD5加密;
    Vue.prototype.md5Encode = value => md5(value)
    // BASE64加密;
    Vue.prototype.base64Encode = value => base64.encode(value)
    // BASE64加密(网址);
    Vue.prototype.base64EncodeURI = value => base64.encodeURI(value)
    // BASE64解密;
    Vue.prototype.base64Decode = value => base64.decode(value)
  }
}
