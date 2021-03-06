// ROOT-URI For API;
let DOMAIN_APIS
// ROOT-URI For Image-resources;
let DOMAIN_IMAGE
// ROOT-URI For Image-resources;
let DOMAIN_TEMP
// ROOT-URI For Image-resources;
let DOMAIN_FILE
// ROOT-URI For Print;
let DOMAIN_PRINT
// ROOT-URI For Mobile Site;
let DOMAIN_BASE
// 图片、文件
let DOMAIN_IMG_FILE
// EXCEL文件
let DOMAIN_EXCEL = 'http://xlsx.lingcb.com'
const protocol = window.location.protocol
if (process.env.NODE_ENV === 'test') {
  // development
  const deveUrlEnd = '1.com'
  DOMAIN_APIS = {
    Alliance: `${protocol}//alliance.webapi.lazhun${deveUrlEnd}`,
    Spread: `${protocol}//spread.webapi.lingcb${deveUrlEnd}`,
    Analysis: `${protocol}//analysis.webapi.lingcb${deveUrlEnd}`,
    College: `${protocol}//college.webapi.lingcb${deveUrlEnd}`,
    Careerist: `${protocol}//careerist.webapi.lingcb${deveUrlEnd}`,
    Cluster: `${protocol}//cluster.webapi.lingcb${deveUrlEnd}`,
    Component: `${protocol}//component.webapi.lingcb${deveUrlEnd}`,
    Gifting: `${protocol}//gifting.webapi.lingcb${deveUrlEnd}`,
    Marketing: `${protocol}//marketing.webapi.lingcb${deveUrlEnd}`,
    Membership: `${protocol}//membership.webapi.lingcb${deveUrlEnd}`,
    Merchant: `${protocol}//merchant.webapi.lingcb${deveUrlEnd}`,
    Message: `${protocol}//message.webapi.lingcb${deveUrlEnd}`,
    Order: `${protocol}//order.webapi.lingcb${deveUrlEnd}`,
    Payment: `${protocol}//payment.webapi.lingcb${deveUrlEnd}`,
    Payment1: `${protocol}//payment1.webapi.lingcb${deveUrlEnd}`,
    Kpis: `${protocol}//performance.webapi.lingcb${deveUrlEnd}`,
    Scoring: `${protocol}//scoring.webapi.lingcb${deveUrlEnd}`,
    Stocking: `${protocol}//stocking.webapi.lingcb${deveUrlEnd}`,
    Trafficflow: `${protocol}//trafficflow.webapi.lingcb${deveUrlEnd}`,
    Bulking: `${protocol}//bulking.webapi.lingcb${deveUrlEnd}`,
    Cloudcomponentapi: `${protocol}//cloudcomponentapi.lingcb${deveUrlEnd}`,
    Common: `${protocol}//common.webapi.lingcb${deveUrlEnd}`
  }
  DOMAIN_IMAGE = `${protocol}//image.ingcb${deveUrlEnd}`
  DOMAIN_TEMP = `${protocol}//temp.ingcb${deveUrlEnd}`
  DOMAIN_FILE = `${protocol}//file.ingcb${deveUrlEnd}`
  DOMAIN_PRINT = `${protocol}//printingui.ingcb${deveUrlEnd}`
  DOMAIN_BASE = {
    vip: `http://wxvipui.mkt.ingcb${deveUrlEnd}`,
    cardVip: `http://wxvipui.sco.ingcb${deveUrlEnd}`,
    codeImg: `http://cloudcomponentapi.ingcb${deveUrlEnd}`,
    store: `http://wxstoreui.mkt.ingcb${deveUrlEnd}`
  }
  DOMAIN_IMG_FILE = 'http://lingcb-test.oss-cn-shanghai.aliyuncs.com'
} else if (process.env.NODE_ENV === 'development') {
  DOMAIN_APIS = {
    Alliance: `${protocol}//alliance.webapi.lazhun.net`,
    Spread: `${protocol}//spread.webapi.lingcb.net`,
    Analysis: `${protocol}//analysis.webapi.lingcb.net`,
    College: `${protocol}//college.webapi.lingcb.net`,
    Careerist: `${protocol}//careerist.webapi.lingcb.net`,
    Cluster: `${protocol}//cluster.webapi.lingcb.net`,
    Component: `${protocol}//component.webapi.lingcb.net`,
    Gifting: `${protocol}//gifting.webapi.lingcb.net`,
    Marketing: `${protocol}//marketing.webapi.lingcb.net`,
    Membership: `${protocol}//membership.webapi.lingcb.net`,
    Merchant: `${protocol}//merchant.webapi.lingcb.net`,
    Message: `${protocol}//message.webapi.lingcb.net`,
    Order: `${protocol}//order.webapi.lingcb.net`,
    Payment: `${protocol}//payment.webapi.lingcb.net`,
    Payment1: `${protocol}//payment1.webapi.lingcb.net`,
    Kpis: `${protocol}//performance.webapi.lingcb.net`,
    Scoring: `${protocol}//scoring.webapi.lingcb.net`,
    Stocking: `${protocol}//stocking.webapi.lingcb.net`,
    Trafficflow: `${protocol}//trafficflow.webapi.lingcb.net`,
    Bulking: `${protocol}//bulking.webapi.lingcb.net`,
    Cloudcomponentapi: `${protocol}//cloudcomponentapi.lingcb.net`,
    Common: `${protocol}//common.webapi.lingcb.net`
  }
  DOMAIN_IMAGE = `${protocol}//image.lingcb.net`
  DOMAIN_TEMP = `${protocol}//temp.lingcb.net`
  DOMAIN_FILE = `${protocol}//file.lingcb.net`
  DOMAIN_PRINT = `${protocol}//printingui.lingcb.net`
  DOMAIN_BASE = {
    vip: 'http://wxvipui.mkt.lingcb.net',
    cardVip: 'http://wxvipui.sco.lingcb.net',
    codeImg: 'http://cloudcomponentapi.lingcb.net',
    store: 'http://wxstoreui.mkt.lingcb.net'
  }
  DOMAIN_IMG_FILE = 'http://lingcb-test.oss-cn-shanghai.aliyuncs.com'
} else if (process.env.NODE_ENV === 'dev') {
  DOMAIN_APIS = {
    Alliance: `${protocol}//alliance.webapi.lazhun1.com`,
    Spread: `${protocol}//spread.webapi.lingcb1.com`,
    Analysis: `${protocol}//analysis.webapi.lingcb1.com`,
    College: `${protocol}//college.webapi.lingcb1.com`,
    Careerist: `${protocol}//careerist.webapi.lingcb1.com`,
    Cluster: `${protocol}//cluster.webapi.lingcb1.com`,
    Component: `${protocol}//component.webapi.lingcb1.com`,
    Gifting: `${protocol}//gifting.webapi.lingcb1.com`,
    Marketing: `${protocol}//marketing.webapi.lingcb1.com`,
    Membership: `${protocol}//membership.webapi.lingcb1.com`,
    Merchant: `${protocol}//merchant.webapi.lingcb1.com`,
    Message: `${protocol}//message.webapi.lingcb1.com`,
    Order: `${protocol}//order.webapi.lingcb1.com`,
    Payment: `${protocol}//payment.webapi.lingcb1.com`,
    Payment1: `${protocol}//payment1.webapi.lingcb1.com`,
    Kpis: `${protocol}//performance.webapi.lingcb1.com`,
    Scoring: `${protocol}//scoring.webapi.lingcb1.com`,
    Stocking: `${protocol}//stocking.webapi.lingcb1.com`,
    Trafficflow: `${protocol}//trafficflow.webapi.lingcb1.com`,
    Bulking: `${protocol}//bulking.webapi.lingcb1.com`,
    Cloudcomponentapi: `${protocol}//cloudcomponentapi.lingcb1.com`,
    Common: `${protocol}//common.webapi.lingcb1.com`
  }
  DOMAIN_IMAGE = `${protocol}//image.lingcb1.com`
  DOMAIN_TEMP = `${protocol}//temp.lingcb1.com`
  DOMAIN_FILE = `${protocol}//file.lingcb1.com`
  DOMAIN_PRINT = `${protocol}//printingui.lingcb1.com`
  DOMAIN_BASE = {
    vip: 'http://wxvipui.mkt.lingcb1.com',
    cardVip: 'http://wxvipui.sco.lingcb1.com',
    codeImg: 'http://pp1883.hn3.mofasuidao.cn',
    store: 'http://wxstoreui.mkt.lingcb1.com'
  }
  DOMAIN_IMG_FILE = 'http://lingcb-test.oss-cn-shanghai.aliyuncs.com'
} else {
  DOMAIN_APIS = {
    Alliance: `${protocol}//alliance.webapi.lazhun.com`,
    Spread: `${protocol}//spread.webapi.lingcb.com`,
    Analysis: `${protocol}//analysis.webapi.lingcb.com`,
    Careerist: `${protocol}//careerist.webapi.lingcb.com`,
    Cluster: `${protocol}//cluster.webapi.lingcb.com`,
    Component: `${protocol}//component.webapi.lingcb.com`,
    Gifting: `${protocol}//gifting.webapi.lingcb.com`,
    Marketing: `${protocol}//marketing.webapi.lingcb.com`,
    Membership: `${protocol}//membership.webapi.lingcb.com`,
    Merchant: `${protocol}//merchant.webapi.lingcb.com`,
    Message: `${protocol}//message.webapi.lingcb.com`,
    Order: `${protocol}//order.webapi.lingcb.com`,
    Payment: `${protocol}//payment.webapi.lingcb.com`,
    Payment1: `${protocol}//payment1.webapi.lingcb.com`,
    Kpis: `${protocol}//performance.webapi.lingcb.com`,
    Scoring: `${protocol}//scoring.webapi.lingcb.com`,
    Stocking: `${protocol}//stocking.webapi.lingcb.com`,
    Trafficflow: `${protocol}//trafficflow.webapi.lingcb.com`,
    Bulking: `${protocol}//bulking.webapi.lingcb.com`,
    Cloudcomponentapi: `${protocol}//cloudcomponentapi.lingcb.com`,
    Common: `${protocol}//common.webapi.lingcb.com`
  }
  DOMAIN_IMAGE = `${protocol}//image.lingcb.com`
  DOMAIN_TEMP = `${protocol}//temp.lingcb.com`
  DOMAIN_FILE = `${protocol}//file.lingcb.com`
  DOMAIN_PRINT = `${protocol}//printingui.lingcb.com`
  DOMAIN_BASE = {
    vip: 'http://wxvipui.mkt.lingcb.com',
    cardVip: 'http://wxvipui.sco.lingcb.com',
    codeImg: 'http://wxopenapi.lingcb.com',
    store: 'http://wxstoreui.mkt.lingcb.com'
  }
  DOMAIN_IMG_FILE = 'http://lingcb-test.oss-cn-shanghai.aliyuncs.com'
}

export {
  DOMAIN_APIS,
  DOMAIN_IMAGE,
  DOMAIN_TEMP,
  DOMAIN_FILE,
  DOMAIN_BASE,
  DOMAIN_PRINT,
  DOMAIN_IMG_FILE,
  DOMAIN_EXCEL
}
