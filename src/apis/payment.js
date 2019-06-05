import fetch from '@/utilities/fetch'

// - 微信支付授权; {WxMchAppId:string 授权公众号的AppId;WxMchId:string 商户号";WxMchKey:string 商户密钥;WxMchCert:string 证书路径;WxIsPay:int32 是否开通企业付款;CharacterId:int64 角色序号}
export const PAYMENT_API_WXH5_AUTH_BYWX = parameters => {
  return fetch({
    cloud: 'Payment',
    url: '/WxH5/PaymentAuthByWx',
    method: 'post',
    data: parameters
  })
}
// - 小程序支付授权; {WxaMchAppId:string 授权小程序的AppId;WxaMchId:string 商户号;WxaMchKey:string 商户密钥;WxaMchCert:string 证书路径;WxaIsPay:int32 门店小程序支付是否已开通}
export const PAYMENT_API_WXH5_AUTH_BYWXAPPLET = parameters => {
  return fetch({
    cloud: 'Payment',
    url: '/WxH5/PaymentAuthByWxApplet',
    method: 'post',
    data: parameters
  })
}
// - 加载授权信息; {CharacterId:int64 角色序号}
export const PAYMENT_API_WXH5_GET = parameters => {
  return fetch({
    cloud: 'Payment',
    url: '/WxH5/Get',
    method: 'get',
    params: parameters
  })
}