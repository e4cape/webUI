// 应用类型;
export const AppTypes = {
  ActiveMp: 0,
  Wx: 1,
  Types: {
    '0': '活动和礼品商城小程序',
    '1': '微信公众号'
  },
  TypeArray: [
    { KeyId: '0', Value: '活动和礼品商城小程序' },
    { KeyId: '1', Value: '微信公众号' }
  ]
}
// 商户菜单的响应类型;
export const WxMenuType = {
  Type1: 1,
  Type2: 3,
  Type3: 5,
  Type4: 7,
  Type5: 9,
  Type6: 11,
  Type7: 13,
  Types: {
    '1': '跳转的网址',
    '3': '消息关键词',
    '5': '微信扫一扫',
    '7': '小程序菜单',
    '9': '点击事件',
    '11': '拍照',
    '13': '拍照相册'
  },
  TypeArray: [
    { KeyId: '1', Value: '跳转的网址' },
    { KeyId: '3', Value: '消息关键词' },
    { KeyId: '5', Value: '微信扫一扫' },
    { KeyId: '7', Value: '小程序菜单' },
    { KeyId: '9', Value: '点击事件' },
    { KeyId: '11', Value: '拍照' },
    { KeyId: '13', Value: '拍照相册' }
  ]
}
// 素材类型;
export const LiteratureType = {
  Image: 0,
  Voice: 1,
  Video: 2,
  Thumb: 3,
  Types: {
    '0': '图片',
    '1': '声音',
    '2': '视频',
    '3': '缩略图'
  },
  TypeArray: [
    { KeyId: '0', Value: '图片' },
    { KeyId: '1', Value: '声音' },
    { KeyId: '2', Value: '视频' },
    { KeyId: '3', Value: '缩略图' }
  ]
}
// 微信触发事件;
export const WxEventType = {
  NONEEVENT: 1101,
  Types: {
    '1101': '常用事件-普通消息'
  },
  TypeArray: [{ KeyId: '1101', Value: '常用事件-普通消息' }]
}
// 微信关键词的匹配模式;
export const WxMatchType = {
  AllOf: 1,
  PartOf: 3,
  Types: {
    '1': '完全匹配',
    '3': '部分匹配'
  },
  TypeArray: [
    { KeyId: '1', Value: '完全匹配' },
    { KeyId: '3', Value: '部分匹配' }
  ]
}
// 微信的回复模式;
export const WxModeType = {
  Random: 1,
  AllOf: 3,
  Types: {
    '1': '随机回复',
    '3': '全部回复'
  },
  TypeArray: [
    { KeyId: '1', Value: '随机回复' },
    { KeyId: '3', Value: '全部回复' }
  ]
}
// 微信的回复类型;
export const WxReplyType = {
  Subscribe: 1,
  AutoRpl: 3,
  Keyword: 5,
  Types: {
    '1': '被关注回复',
    '3': '自动回复',
    '5': '关键字回复'
  },
  TypeArray: [
    { KeyId: '1', Value: '被关注回复' },
    { KeyId: '3', Value: '自动回复' },
    { KeyId: '5', Value: '关键字回复' }
  ]
}
// 微信的内容类型;
export const WxNoteType = {
  Text: 1,
  Image: 3,
  Voice: 5,
  Video: 7,
  Music: 9,
  News: 11,
  Types: {
    '1': '文字',
    '3': '图片',
    '5': '语音',
    '7': '视频',
    '9': '音乐',
    '11': '图文'
  },
  TypeArray: [
    { KeyId: '1', Value: '文字' },
    { KeyId: '3', Value: '图片' },
    { KeyId: '5', Value: '语音' },
    { KeyId: '7', Value: '视频' },
    { KeyId: '9', Value: '音乐' },
    { KeyId: '11', Value: '图文' }
  ]
}
// 授权公众号类型;
export const WxAuthorizerServiceType = {
  Type1: 1,
  Type2: 3,
  Type3: 5,
  Type4: 7,
  Types: {
    '1': '订阅号',
    '3': '由历史老帐号升级后的订阅号',
    '5': '服务号',
    '7': '小程序'
  },
  TypeArray: [
    { KeyId: '1', Value: '订阅号' },
    { KeyId: '3', Value: '由历史老帐号升级后的订阅号' },
    { KeyId: '5', Value: '服务号' },
    { KeyId: '7', Value: '小程序' }
  ]
}
// 消息模板来源类型;
export const TemplateSourceType = {
  WxTemplate: 1,
  WxAppletTemplate: 3,
  Types: {
    '1': '微信消息模板',
    '3': '小程序消息模板'
  },
  TypeArray: [
    { KeyId: '1', Value: '微信消息模板' },
    { KeyId: '3', Value: '小程序消息模板' }
  ]
}
// 小程序消息模板发送类型;
export const TemplateSendType = {
  Success: 1,
  Cancel: 3,
  Send: 5,
  Collage: 7,
  Integral: 9,
  Bargain: 11,
  Types: {
    '1': '订单支付成功通知',
    '3': '订单取消通知',
    '5': '订单发货提醒',
    '7': '拼团结果通知',
    '9': '积分兑换成功通知',
    '11': '砍价进度通知'
  },
  TypeArray: [
    { KeyId: '1', Value: '订单支付成功通知' },
    { KeyId: '3', Value: '订单取消通知' },
    { KeyId: '5', Value: '订单发货提醒' },
    { KeyId: '7', Value: '拼团结果通知' },
    { KeyId: '9', Value: '积分兑换成功通知' },
    { KeyId: '11', Value: '砍价进度通知' }
  ]
}
// 授权公众号认证类型;
export const WxAuthorizerVerifyType = {
  Type01: 1,
  Type03: 3,
  Type05: 5,
  Type07: 7,
  Type09: 9,
  Type11: 11,
  Type13: 13,
  Types: {
    '1': '未认证',
    '3': '微信认证',
    '5': '新浪微博认证',
    '7': '腾讯微博认证',
    '9': '已资质认证通过但还未通过名称认证',
    '11': '已资质认证通过、还未通过名称认证, 但通过了新浪微博认证',
    '13': '已资质认证通过、还未通过名称认证，但通过了腾讯微博认证'
  },
  TypeArray: [
    { KeyId: '1', Value: '未认证' },
    { KeyId: '3', Value: '微信认证' },
    { KeyId: '5', Value: '新浪微博认证' },
    { KeyId: '7', Value: '腾讯微博认证' },
    { KeyId: '9', Value: '已资质认证通过但还未通过名称认证' },
    {
      KeyId: '11',
      Value: '已资质认证通过、还未通过名称认证, 但通过了新浪微博认证'
    },
    {
      KeyId: '13',
      Value: '已资质认证通过、还未通过名称认证，但通过了腾讯微博认证'
    }
  ]
}
// 授权公众号状态;
export const WxAuthorizerStatus = {
  Unauth: 1,
  Auth: 3,
  Types: {
    '1': '已取消授权',
    '3': '已认证授权'
  },
  TypeArray: [
    { KeyId: '1', Value: '已取消授权' },
    { KeyId: '3', Value: '已认证授权' }
  ]
}
// 微信消息类型;
export const WxMessageType = {
  Text: 0,
  Image: 1,
  Voice: 2,
  Video: 3,
  ShortVideo: 4,
  Location: 5,
  Link: 6,
  Event: 7,
  Types: {
    '0': '文本消息',
    '1': '图片消息',
    '2': '语音消息',
    '3': '视频消息',
    '4': '小视频消息',
    '5': '地理位置消息',
    '6': '链接消息',
    '7': '事件推送'
  },
  TypeArray: [
    { KeyId: '0', Value: '文本消息' },
    { KeyId: '1', Value: '图片消息' },
    { KeyId: '2', Value: '语音消息' },
    { KeyId: '3', Value: '视频消息' },
    { KeyId: '4', Value: '小视频消息' },
    { KeyId: '5', Value: '地理位置消息' },
    { KeyId: '6', Value: '链接消息' },
    { KeyId: '7', Value: '事件推送' }
  ]
}
// 响应结果的数据格式;
export const WxMediaType = {
  Text: 1,
  XML: 3,
  Types: {
    '1': '文本',
    '3': 'XML'
  },
  TypeArray: [{ KeyId: '1', Value: '文本' }, { KeyId: '3', Value: 'XML' }]
}
// 响应结果的数据格式;
export const WxTemplateType = {
  Gains: 1,
  Consumption: 5,
  Maintenance: 7,
  MemberCard: 11,
  MemberGradeChange: 13,
  Types: {
    '1': '收益提醒',
    '5': '消费成功',
    '7': '保养提醒',
    '11': '会员卡',
    '13': '会员变更'
  },
  TypeArray: [
    { KeyId: '1', Value: '收益提醒' },
    { KeyId: '5', Value: '消费成功' },
    { KeyId: '7', Value: '保养提醒' },
    { KeyId: '11', Value: '会员卡' },
    { KeyId: '13', Value: '会员变更' }
  ]
}
// 响应结果的数据格式;
export const WxSendType = {
  Immediately: 1,
  Timing: 3,
  Regular: 5,
  Types: {
    '1': '即时发送',
    '3': '定时发送',
    '5': '定期发送'
  },
  TypeArray: [
    { KeyId: '1', Value: '即时发送' },
    { KeyId: '3', Value: '定时发送' },
    { KeyId: '5', Value: '定期发送' }
  ]
}
// 性别类型;
export const SexyType = {
  Male: 1,
  Female: 3,
  Secret: 5,
  Types: {
    '1': '男士',
    '3': '女士',
    '5': '保密'
  },
  TypeArray: [
    { KeyId: '1', Value: '男士' },
    { KeyId: '3', Value: '女士' },
    { KeyId: '5', Value: '保密' }
  ]
}
// 授权力度(枚举);
export const WxAuthorizerType = {
  Group: 1,
  Compony: 3,
  Store: 5,
  Career: 7,
  AppletGroup: 9,
  AppletCompony: 11,
  AppletStore: 13,
  Types: {
    '1': '授权公众号(集团)',
    '3': '授权公众号(商户)',
    '5': '授权公众号(门店)',
    '7': '授权公众号(合伙人)',
    '9': '授权小程序(集团)',
    '11': '授权小程序(商户)',
    '13': '授权小程序(门店)'
  },
  TypeArray: [
    { KeyId: '1', Value: '授权公众号(集团)' },
    { KeyId: '3', Value: '授权公众号(商户)' },
    { KeyId: '5', Value: '授权公众号(门店)' },
    { KeyId: '7', Value: '授权公众号(合伙人)' },
    { KeyId: '9', Value: '授权小程序(集团)' },
    { KeyId: '11', Value: '授权小程序(商户)' },
    { KeyId: '13', Value: '授权小程序(门店)' }
  ]
}
// 微信的消息回复类型;
export const WxReplyMessageType = {
  Customized: 1,
  Keyword: 3,
  Types: {
    '1': '自定义回复',
    '3': '关键字回复'
  },
  TypeArray: [
    { KeyId: '1', Value: '自定义回复' },
    { KeyId: '3', Value: '关键字回复' }
  ]
}
// 员工账户状态;
export const SecurityUserStatus = {
  Abandon: 1,
  Origin: 3,
  Audit: 5,
  Types: {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核'
  },
  TypeArray: [
    { KeyId: '1', Value: '已作废' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '已审核' }
  ]
}
// 事件类型;
export const ClickType = {
  Text: 1,
  Image: 3,
  Types: {
    '1': '文字',
    '3': '图片'
  },
  TypeArray: [{ KeyId: '1', Value: '文字' }, { KeyId: '3', Value: '图片' }]
}
// 是否发送模板消息通知微信公众号粉丝;
export const NotifyUsers = {
  No: 0,
  Yes: 1,
  Types: {
    '0': '否',
    '1': '是'
  },
  TypeArray: [{ KeyId: '0', Value: '否' }, { KeyId: '1', Value: '是' }]
}
// 是否展示公众号主页中;
export const ShowProfile = {
  No: 0,
  Yes: 1,
  Types: {
    '0': '否',
    '1': '是'
  },
  TypeArray: [{ KeyId: '0', Value: '否' }, { KeyId: '1', Value: '是' }]
}
// 绑定平台;
export const PlatformBind = {
  No: 0,
  Yes: 1,
  Types: {
    '0': '未绑',
    '1': '已绑'
  },
  TypeArray: [{ KeyId: '0', Value: '未绑' }, { KeyId: '1', Value: '已绑' }]
}
// 小程序发布代码审核状态;
export const WxAppletStatus = {
  Audit: 0,
  Failed: 1,
  Progress: 2,
  Wait: 3,
  PublishedSuccess: 4,
  PublishedFailed: 5,
  UnKnow: 6,
  Types: {
    '0': '审核成功',
    '1': '审核失败',
    '2': '审核中',
    '3': '待提交',
    '4': '发布成功',
    '5': '发布失败',
    '6': '未知'
  },
  TypeArray: [
    { KeyId: '0', Value: '审核成功' },
    { KeyId: '1', Value: '审核失败' },
    { KeyId: '2', Value: '审核中' },
    { KeyId: '3', Value: '待提交' },
    { KeyId: '4', Value: '发布成功' },
    { KeyId: '5', Value: '发布失败' },
    { KeyId: '6', Value: '未知' }
  ]
}
// 小程序关联状态;
export const WxAppletUnStatus = {
  UnKnow: 0,
  Related: 1,
  WaitApplet: 2,
  Refuse: 3,
  WaitWechat: 12,
  Types: {
    '0': '未知',
    '1': '已关联',
    '2': '等待小程序管理员确认中',
    '3': '小程序管理员拒绝关联',
    '12': '等到公众号管理员确认中'
  },
  TypeArray: [
    { KeyId: '0', Value: '未知' },
    { KeyId: '1', Value: '已关联' },
    { KeyId: '2', Value: '等待小程序管理员确认中' },
    { KeyId: '3', Value: '小程序管理员拒绝关联' },
    { KeyId: '12', Value: '等到公众号管理员确认中' }
  ]
}
// 微信会员卡背景颜色;
export const BackgRoundColor = {
  Color010: 1,
  Color020: 2,
  Color030: 3,
  Color040: 4,
  Color050: 5,
  Color060: 6,
  Color070: 7,
  Color080: 8,
  Color081: 9,
  Color082: 10,
  Color090: 11,
  Color100: 12,
  Color101: 13,
  Color102: 14,
  Types: {
    '1': '#63b359',
    '2': '#2c9f67',
    '3': '#509fc9',
    '4': '#5885cf',
    '5': '#9062c0',
    '6': '#d09a45',
    '7': '#e4b138',
    '8': '#ee903c',
    '9': '#f08500',
    '10': '#a9d92d',
    '11': '#dd6549',
    '12': '#cc463d',
    '13': '#cf3e36',
    '14': '#5E6671'
  },
  TypeArray: [
    { KeyId: '1', Value: '#63b359' },
    { KeyId: '2', Value: '#2c9f67' },
    { KeyId: '3', Value: '#509fc9' },
    { KeyId: '4', Value: '#5885cf' },
    { KeyId: '5', Value: '#9062c0' },
    { KeyId: '6', Value: '#d09a45' },
    { KeyId: '7', Value: '#e4b138' },
    { KeyId: '8', Value: '#ee903c' },
    { KeyId: '9', Value: '#f08500' },
    { KeyId: '10', Value: '#a9d92d' },
    { KeyId: '11', Value: '#dd6549' },
    { KeyId: '12', Value: '#cc463d' },
    { KeyId: '13', Value: '#cf3e36' },
    { KeyId: '14', Value: '#5E6671' }
  ]
}
// Code展示类型;
export const CodeType = {
  CODE_TYPE_TEXT: 1,
  CODE_TYPE_BARCODE: 3,
  CODE_TYPE_QRCODE: 5,
  CODE_TYPE_ONLY_QRCODE: 7,
  CODE_TYPE_ONLY_BARCODE: 9,
  CODE_TYPE_NONE: 11,
  Types: {
    '1': '文本 ',
    '3': '一维码',
    '5': '二维码',
    '7': '仅显示二维码',
    '9': '仅显示一维码',
    '11': '不显示任何码型'
  },
  TypeArray: [
    { KeyId: '1', Value: '文本 ' },
    { KeyId: '3', Value: '一维码' },
    { KeyId: '5', Value: '二维码' },
    { KeyId: '7', Value: '仅显示二维码' },
    { KeyId: '9', Value: '仅显示一维码' },
    { KeyId: '11', Value: '不显示任何码型' }
  ]
}
// 微信会员卡状态;
export const MemberCardBasicStatus = {
  Abandon: 5,
  Types: {
    '5': '已作废'
  },
  TypeArray: [{ KeyId: '5', Value: '已作废' }]
}
// 微信会员卡状态(每一张);
export const MemberCardItemStatus = {
  Receive: 1,
  Activation: 3,
  Abandon: 5,
  Types: {
    '1': '已领取',
    '3': '已激活',
    '5': '已作废'
  },
  TypeArray: [
    { KeyId: '1', Value: '已领取' },
    { KeyId: '3', Value: '已激活' },
    { KeyId: '5', Value: '已作废' }
  ]
}
