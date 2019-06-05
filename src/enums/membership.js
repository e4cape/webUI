/**
 * 比较方式
 */

export const SqlCompareTypes = {
  None: '0',
  Equals: '1',
  Between: '2',
  Types: [
    { key: '0', title: 'None' },
    { key: '1', title: 'Equals' },
    { key: '2', title: 'Between' }
  ]
}

/**
 * 数据类型
 */

export const DataTypes = {
  Empty: '0',
  Int32: '9',
  Decimal: '15',
  String: '18',
  Types: [
    { key: '0', title: 'Empty' },
    { key: '9', title: '32位整数' },
    { key: '15', title: '小数' },
    { key: '18', title: '字符串' }
  ]
}

/**
 * 会员类型分组(报表中使用，1粉丝、3微信会员(线上会员)、18线下会员)
 */

export const MemberTypeGroup = {
  Fans: '1',
  OnlineVip: '3',
  OfflineVip: '18',
  Types: [
    { key: '1', title: '粉丝' },
    { key: '3', title: '微信会员' },
    { key: '18', title: '线下会员' }
  ]
}

/**
 * 活动赠送类型(1=只送礼金,3=送积分和礼金,5=送积分/礼金 礼金优先)
 */

export const ActivityGiveType = {
  GoldenRice: '1',
  GoldenRiceAndScore: '3',
  GoldenRiceOrScore: '5',
  Types: [
    { key: '1', title: '只送礼金' },
    { key: '3', title: '送积分和礼金' },
    { key: '5', title: '送礼金或积分,优先送礼金' }
  ]
}

/**
 * 会员身份定义()
 */

export const MemberTypes = {
  Tourist: '0',
  Fans: '1',
  Vip: '2',
  Applet: '4',
  WeChat: '8',
  Offline: '16',
  OnlineVip: '3',
  AppletFans: '5',
  AppletVip: '7',
  WeChatFans: '9',
  WeChatVip: '11',
  OfflineVip: '18',
  Types: [
    { key: '0', title: 'Tourist' },
    { key: '1', title: 'Fans' },
    { key: '2', title: 'Vip' },
    { key: '4', title: 'Applet' },
    { key: '8', title: 'WeChat' },
    { key: '16', title: 'Offline' },
    { key: '3', title: 'OnlineVip' },
    { key: '5', title: '小程序粉丝' },
    { key: '7', title: '小程序会员' },
    { key: '9', title: '公众号粉丝' },
    { key: '11', title: '公众号会员' },
    { key: '18', title: '线下会员' }
  ]
}

/**
 * 会员身份归属(一号多店的时候使用)
 */

export const MemberBelongTypes = {
  Add: '1',
  Sales: '2',
  Types: [{ key: '1', title: '来源归属' }, { key: '2', title: '销售归属' }]
}

/**
 * 会员注册类型()
 */

export const MemberRegisterTypes = {
  EnglishID: '1',
  MobileID: '3',
  EmailID: '5',
  QQID: '7',
  WechatID: '9',
  WeiboID: '11',
  ActiveMP: '12',
  Types: [
    { key: '1', title: '用户名' },
    { key: '3', title: '手机' },
    { key: '5', title: '邮箱' },
    { key: '7', title: 'QQ' },
    { key: '9', title: '微信' },
    { key: '11', title: '微博' },
    { key: '12', title: '活动和礼品商城小程序' }
  ]
}

/**
 * 注册来源类型
 */

export const MemberPlatTypes = {
  WechatUI: '1',
  OtherUI: '99',
  Types: [{ key: '1', title: '微信入口端' }, { key: '99', title: '其他入口端' }]
}

/**
 * 关注来源(1扫码关注,2分享关注,3支付关注,4活动关注,5其它)
 */

export const SubscrFromTypes = {
  ScanCode: '1',
  Share: '2',
  Pay: '3',
  Activity: '4',
  Other: '5',
  Types: [
    { key: '1', title: '扫码关注' },
    { key: '2', title: '分享关注' },
    { key: '3', title: '支付关注' },
    { key: '4', title: '活动关注' },
    { key: '5', title: '其它' }
  ]
}

/**
 * 是否已关注(取消关注1,已关注3)
 */

export const SubscribeTypes = {
  Not: '1',
  Yes: '3',
  Types: [{ key: '1', title: '取消关注' }, { key: '3', title: '已关注' }]
}

/**
 * 是否是农历生日(1否，3是)
 */

export const LunarCalendarTypes = {
  Not: '1',
  Yes: '3',
  Types: [{ key: '1', title: '公历' }, { key: '3', title: '农历' }]
}

/**
 * 会员选项(按位运算0无,1是否验证手机号)
 */

export const MemberOpitonTypes = {
  Default: '0',
  VerifiedMobile: '1',
  ReceivedVipCard: '2',
  Types: [
    { key: '0', title: 'Default' },
    { key: '1', title: 'VerifiedMobile' },
    { key: '2', title: 'ReceivedVipCard' }
  ]
}

/**
 * 会员动态类型(位运算)，1消费、2退货、4使用卡券、8进店记录、16回访记录、32添加备注
 */

export const MemberOperateLogTypes = {
  Consume: '1',
  Returned: '2',
  Card: '4',
  EnterLog: '8',
  VisitLog: '16',
  Remark: '32',
  Types: [
    { key: '1', title: '消费' },
    { key: '2', title: '退货' },
    { key: '4', title: '使用卡券' },
    { key: '8', title: '进店记录' },
    { key: '16', title: '回访记录' },
    { key: '32', title: '添加备注' }
  ]
}

/**
 * 选项类型(0未知，1会员备注项目，2回访任务类型，3话术类型，4回访方式, 5会员分组, 6会员等级,7赠送积分原因类型,8赠送优惠券原因)
 */

export const SettingOptionTypes = {
  UnKnown: '0',
  MemberRemark: '1',
  VisitTaskType: '2',
  VisitBookType: '3',
  VisitMethod: '4',
  MemberGroup: '5',
  MemberLevel: '6',
  GiveScoreCause: '7',
  GiveCouponCause: '8',
  DeductScoreCause: '9',
  Types: [
    { key: '0', title: 'UnKnown' },
    { key: '1', title: 'MemberRemark' },
    { key: '2', title: 'VisitTaskType' },
    { key: '3', title: 'VisitBookType' },
    { key: '4', title: 'VisitMethod' },
    { key: '5', title: 'MemberGroup' },
    { key: '6', title: 'MemberLevel' },
    { key: '7', title: '赠送积分原因类型' },
    { key: '8', title: 'GiveCouponCause' },
    { key: '9', title: '扣减积分礼金原因' }
  ]
}

/**
 * 标签类型(1~99表示报表的范围,100~199客户标签组，200~299固定标签，300~为自定义标签)
 */

export const SettingTagTypes = {
  ReportFigureAge: '1',
  ReportFigureScore: '2',
  ReportFigureExpend: '3',
  ReportExpendTimeSpan: '4',
  ReportExpendPriceSpan: '5',
  MemberTag: '100',
  SexType: '200',
  MemberType: '201',
  SubscribeType: '212',
  MemberLevel: '202',
  MemberGroup: '203',
  NotBuyMaterial: '204',
  NotBuyCategory: '205',
  NotMarketing: '206',
  BuyMaterial: '207',
  BuyCategory: '208',
  Marketing: '209',
  CouponAvailable: '210',
  MarriageStatus: '211',
  JoinDay: '300',
  SubscrDay: '301',
  LastConsumeDay: '302',
  LastMarketingDay: '303',
  ConsumeMoneyTotal: '304',
  ConsumeCountTotal: '305',
  ReturnCountTotal: '306',
  BirthdayDay: '307',
  Age: '308',
  ScoreTotal: '309',
  Activity: '310',
  Buying: '311',
  Loyalty: '312',
  Identity: '313',
  Behaviour: '314',
  NotBuyGoldWeight: '315',
  NotBuyDiamondWeight: '316',
  BuyGoldWeight: '317',
  BuyDiamondWeight: '318',
  IncentiveMoneyExpireDay: '319',
  ShoppingMoneyExpireDay: '320',
  ExchangeMoneyExpireDay: '321',
  CouponsMoneyExpireDay: '322',
  IncentiveMoney: '323',
  ShoppingMoney: '324',
  ExchangeMoney: '325',
  CouponsMoney: '326',
  ScoreBalance: '327',
  RiceBalance: '328',
  CouponUniversalExpireDay: '329',
  CouponVoucherExpireDay: '330',
  CouponOnlineExpireDay: '331',
  CouponOfflineExpireDay: '332',
  MarriageDay: '333',
  Types: [
    { key: '1', title: '画像分析年龄范围' },
    { key: '2', title: '画像分析综合评分范围' },
    { key: '3', title: '画像分析消费金额范围' },
    { key: '4', title: '首次进店与达成交易相差' },
    { key: '5', title: '达成交易金额与预算相差的金额' },
    { key: '100', title: '客户标签' },
    { key: '200', title: '性别' },
    { key: '201', title: '客户身份' },
    { key: '212', title: '粉丝状态' },
    { key: '202', title: '会员等级' },
    { key: '203', title: '会员分组' },
    { key: '204', title: '未购买材质' },
    { key: '205', title: '未购买品类' },
    { key: '206', title: '未参加营销' },
    { key: '207', title: '已购买材质' },
    { key: '208', title: '已购买品类' },
    { key: '209', title: '已参加营销' },
    { key: '210', title: '可用卡券' },
    { key: '211', title: '婚姻状态' },
    { key: '300', title: '距今入会时间' },
    { key: '301', title: '距今关注时间' },
    { key: '302', title: '最近消费时间' },
    { key: '303', title: '最近短信营销时间' },
    { key: '304', title: '累计消费金额' },
    { key: '305', title: '累计消费' },
    { key: '306', title: '累计退货' },
    { key: '307', title: '距今生日' },
    { key: '308', title: '年龄' },
    { key: '309', title: '综合评分' },
    { key: '310', title: '活跃度分值' },
    { key: '311', title: '购买力分值' },
    { key: '312', title: '忠诚度分值' },
    { key: '313', title: '身份分值' },
    { key: '314', title: '行为分值' },
    { key: '315', title: '未购买黄金重量' },
    { key: '316', title: '未购买钻石大小' },
    { key: '317', title: '已购买黄金重量' },
    { key: '318', title: '已购买钻石大小' },
    { key: '319', title: '鼓励金到期未用时间' },
    { key: '320', title: '购物金到期未用时间' },
    { key: '321', title: '置换金到期未用时间' },
    { key: '322', title: '抵用金到期未用时间' },
    { key: '323', title: '鼓励金剩余金额(元)' },
    { key: '324', title: '购物金剩余金额(元)' },
    { key: '325', title: '置换金剩余金额(元)' },
    { key: '326', title: '抵用金剩余金额(元)' },
    { key: '327', title: '积分余额' },
    { key: '328', title: '礼金余额' },
    { key: '329', title: '通用券到期时间' },
    { key: '330', title: '人情券到期时间' },
    { key: '331', title: '电子可售卡券到期时间' },
    { key: '332', title: '纸质可售卡券到期时间' },
    { key: '333', title: '距今纪念日时间' }
  ]
}

/**
 * 卡券类型
 */

export const CouponAvailableType = {
  Universal: '1',
  Voucher: '2',
  Online: '301',
  Offline: '303',
  Types: [
    { key: '1', title: '通用券' },
    { key: '2', title: '人情券' },
    { key: '301', title: '电子可售卡券' },
    { key: '303', title: '纸质可售卡券' }
  ]
}

/**
 * 评分类型(1活跃,3购买,5忠诚,7身份,9行为)
 */

export const MemberScoreLogType = {
  Activity: '1',
  Buying: '3',
  Loyalty: '5',
  Identity: '7',
  Behaviour: '9',
  Types: [
    { key: '1', title: 'Activity' },
    { key: '3', title: 'Buying' },
    { key: '5', title: 'Loyalty' },
    { key: '7', title: 'Identity' },
    { key: '9', title: 'Behaviour' }
  ]
}

/**
 * 选择方式(1单选，2多选)
 */

export const SelectionTypes = {
  Single: '1',
  Multiple: '2',
  Types: [{ key: '1', title: '单选' }, { key: '2', title: '多选' }]
}

/**
 * 发送类型
 */

export const SendTypes = {
  Immediatly: '1',
  Ontime: '2',
  Types: [{ key: '1', title: '即时发送' }, { key: '2', title: '定时发送' }]
}

/**
 * 消费力分析，年份类型(1累计,2今年,3去年,4前年)
 */

export const StatisticsExpendDateTypes = {
  Total: '1',
  ThisYear: '2',
  LastYear: '3',
  BeforeLastYear: '4',
  Types: [
    { key: '1', title: '累计' },
    { key: '2', title: '今年' },
    { key: '3', title: '去年' },
    { key: '4', title: '前年' }
  ]
}

/**
 * 消费力分析，付款类型(1应付,2实付)
 */

export const StatisticsExpendPriceTypes = {
  OrderPrice: '1',
  ActualPrice: '2',
  Types: [{ key: '1', title: '应付' }, { key: '2', title: '实付' }]
}

/**
 * 会员升级方式(0人工升级,1累积消费金额自动升级,2累积积分值自动升级)
 */

export const MemberUpgradeTypes = {
  Manual: '0',
  ExpendTotal: '1',
  ScoreTotal: '2',
  Types: [
    { key: '0', title: '人工升级' },
    { key: '1', title: '累积消费金额自动升级' },
    { key: '2', title: '累积积分值自动升级' }
  ]
}

/**
 * 会员更新类型（0=不更新，1=批量更新(允许降级)，2=批量更新（不降级））
 */

export const MemberUpdateLevelTypes = {
  NotUpdate: '0',
  Downgrade: '1',
  NotDowngrade: '2',
  Types: [
    { key: '0', title: '不更新' },
    { key: '1', title: '批量更新(允许降级)' },
    { key: '2', title: '批量更新（不降级）' }
  ]
}

/**
 * 会员状态(1已停用，3已启用)
 */

export const MemberAccountStatus = {
  Disable: '1',
  Enable: '3',
  Types: [{ key: '1', title: '已停用' }, { key: '3', title: '已启用' }]
}

/**
 * 回访任务状态(1草稿,2待审核,3审核通过,4审核退回,5已作废,6已取消)
 */

export const VisitTaskStatus = {
  Draft: '1',
  Pending: '2',
  Pass: '3',
  Returned: '4',
  Invalid: '5',
  Cancel: '6',
  Types: [
    { key: '1', title: '草稿' },
    { key: '2', title: '待审核' },
    { key: '3', title: '审核通过' },
    { key: '4', title: '审核退回' },
    { key: '5', title: '已作废' },
    { key: '6', title: '已取消' }
  ]
}

/**
 * 回访任务完成情况(1未开始,2未完成,3已完成)
 */

export const VisitTaskFinishStatus = {
  NotStarted: '1',
  InComplete: '2',
  Complete: '3',
  Types: [
    { key: '1', title: '未开始' },
    { key: '2', title: '未完成' },
    { key: '3', title: '已完成' }
  ]
}

/**
 * 回访任务分配完成情况(1待回访,2已结束))
 */

export const VisitMemberTaskStatus = {
  Pending: '1',
  Complete: '2',
  Types: [{ key: '1', title: '待回访' }, { key: '2', title: '已结束' }]
}

/**
 * 回访记录状态(1已删除,3正常)
 */

export const VisitLogStatus = {
  Deleted: '1',
  Normal: '3',
  Types: [{ key: '1', title: '已删除' }, { key: '3', title: '正常' }]
}

/**
 * 回访话术状态(1停用,3启用)
 */

export const VisitBookStatus = {
  Disable: '1',
  Enable: '3',
  Types: [{ key: '1', title: '停用' }, { key: '3', title: '启用' }]
}

/**
 * 短信营销任务完成状态(1未开始,2未完成,3已完成)
 */

export const MessageTaskFinishStatus = {
  NotStarted: '1',
  InComplete: '2',
  Complete: '3',
  Types: [
    { key: '1', title: '未开始' },
    { key: '2', title: '未完成' },
    { key: '3', title: '已完成' }
  ]
}

/**
 * 短信营销任务状态(1草稿,2待审核,3审核通过,4审核退回,5已作废)
 */

export const MessageTaskStatus = {
  Draft: '1',
  Pending: '2',
  Pass: '3',
  Returned: '4',
  Invalid: '5',
  Types: [
    { key: '1', title: '草稿' },
    { key: '2', title: '待审核' },
    { key: '3', title: '审核通过' },
    { key: '4', title: '审核退回' },
    { key: '5', title: '已作废' }
  ]
}

/**
 * 短信发送状态(未发送1,已发送2,提交失败3,发送成功4,发送失败5,未知6)
 */

export const MessageSendStatus = {
  Unsent: '1',
  Sent: '2',
  SubmitFailed: '3',
  Success: '4',
  Failed: '5',
  Unknown: '6',
  Types: [
    { key: '1', title: '未发送' },
    { key: '2', title: '已发送' },
    { key: '3', title: '提交失败' },
    { key: '4', title: '发送成功' },
    { key: '5', title: '发送失败' },
    { key: '6', title: '未知' }
  ]
}

/**
 * 会员升级状态（未升级 1,可升级 2,已升级 3 ）
 */

export const MemberUpgradeStatus = {
  UnUpgrade: '1',
  CanUpgrade: '2',
  Upgrade: '3',
  Types: [
    { key: '1', title: '未升级' },
    { key: '2', title: '可升级' },
    { key: '3', title: '已升级' }
  ]
}

/**
 * 手工赠送优惠券状态(1草稿,2待审核,3审核通过,4审核退回,5已作废)
 */

export const GiveCouponStatus = {
  Draft: '1',
  Pending: '2',
  Pass: '3',
  Returned: '4',
  Invalid: '5',
  Types: [
    { key: '1', title: '草稿' },
    { key: '2', title: '待审核' },
    { key: '3', title: '审核通过' },
    { key: '4', title: '审核退回' },
    { key: '5', title: '已作废' }
  ]
}

/**
 * 手工赠送明细状态
 */

export const GiveCouponItemStatus = {
  Normal: '0',
  Given: '1',
  Failed: '3',
  Types: [
    { key: '0', title: '' },
    { key: '1', title: '' },
    { key: '3', title: '赠送失败' }
  ]
}

/**
 * 积分消费明细状态
 */

export const MemberBalanceExpireCostItemStatus = {
  Normal: '0',
  Returned: '1',
  Types: [{ key: '0', title: 'Normal' }, { key: '1', title: 'Returned' }]
}

/**
 * 变动情况（方式）
 */

export const ChangeWay = {
  Add: '1',
  Subtract: '2',
  Types: [{ key: '1', title: '增加' }, { key: '2', title: '扣减' }]
}

/**
 * 平台类型
 */

export const PlatformTypes = {
  Lingcb: '1',
  Group: '2',
  Company: '3',
  Store: '5',
  Supplier: '7',
  Types: [
    { key: '1', title: '零成本平台管控中心' },
    { key: '2', title: '集团总部管控中心' },
    { key: '3', title: '公司总部管理中心' },
    { key: '5', title: '门店管理中心' },
    { key: '7', title: '供应商管理中心' }
  ]
}

/**
 * 短信模版类型
 */

export const TemplateTypes = {
  Notification: '1',
  Marketing: '2',
  Types: [{ key: '1', title: '通知类' }, { key: '2', title: '营销类' }]
}

/**
 * 门店系统类型
 */

export const StoreSystemType = {
  MarketingCloud: '1',
  PerformanceCloud: '3',
  ScoringCloud: '5',
  MessageCloud: '7',
  StockingCloud: '9',
  MembershipCloud: '11',
  SpreadCloud: '13',
  GiftingCloud: '15',
  CollegeCloud: '17',
  Types: [
    { key: '1', title: '营销系统' },
    { key: '3', title: '薪酬绩效系统' },
    { key: '5', title: '积分卡券系统' },
    { key: '7', title: '短信系统' },
    { key: '9', title: 'ERP系统' },
    { key: '11', title: 'CRM系统' },
    { key: '13', title: '营销活动系统' },
    { key: '15', title: '礼品商城系统' },
    { key: '17', title: '商学院' }
  ]
}

/**
 * 材质类型(小类)
 */

export const MaterialTypes = {
  Goldlion: '1',
  Silver: '3',
  HardGold3D: '5',
  Platinum: '7',
  Palladium: '9',
  Diamond: '11',
  KGoldlion: '13',
  Gemstone: '15',
  GoldWithJade: '17',
  PearlStone: '19',
  Wood: '21',
  Fashion: '23',
  Jewelry: '25',
  Jadeite: '27',
  Fitting: '97',
  Other: '99',
  Types: [
    { key: '1', title: '黄金' },
    { key: '3', title: '银饰' },
    { key: '5', title: '3D硬金' },
    { key: '7', title: '铂金' },
    { key: '9', title: '钯金' },
    { key: '11', title: '钻石' },
    { key: '13', title: 'K金' },
    { key: '15', title: '彩宝' },
    { key: '17', title: '金镶玉' },
    { key: '19', title: '珍珠宝石' },
    { key: '21', title: '天然木饰' },
    { key: '23', title: '时尚饰品' },
    { key: '25', title: '珠宝配饰' },
    { key: '27', title: '翡翠玉石' },
    { key: '97', title: '配件' },
    { key: '99', title: '其它' }
  ]
}

/**
 * 平台角色类型(枚举)
 */

export const CharacterType = {
  Lingcb: '1001',
  BranchLingcb: '1101',
  Group: '2001',
  Company: '2101',
  Store: '2201',
  Supplier: '3001',
  Provider: '3101',
  Types: [
    { key: '1001', title: '零成本平台管控中心' },
    { key: '1101', title: '零成本分公司' },
    { key: '2001', title: '集团总部管控中心' },
    { key: '2101', title: '公司总部管理中心' },
    { key: '2201', title: '门店管理中心' },
    { key: '3001', title: '礼品供应商管理中心' },
    { key: '3101', title: '供应链供应商管理中心' }
  ]
}

/**
 * 门店类型
 */

export const StoreType = {
  Direct: '1',
  Joining: '2',
  Union: '3',
  Types: [
    { key: '1', title: '直营店' },
    { key: '2', title: '加盟店' },
    { key: '3', title: '联营店' }
  ]
}

/**
 * 微信配置
 */

export const CompanyBasicWechatSettingType = {
  Company: '1',
  Store: '3',
  Types: [{ key: '1', title: '公司总部' }, { key: '3', title: '门店设置' }]
}

/**
 * 支付授权
 */

export const CompanyBasicPaymentSettingType = {
  Company: '1',
  Store: '3',
  Types: [{ key: '1', title: '公司总部' }, { key: '3', title: '门店设置' }]
}

/**
 * 应用类型
 */

export const AppTypes = {
  ActiveMp: '0',
  Wx: '1',
  Types: [{ key: '0', title: 'ActiveMp' }, { key: '1', title: 'Wx' }]
}

/**
 * 套餐类型
 */

export const StorePackageType = {
  All: '0',
  Free: '1',
  Try: '3',
  Flow: '5',
  Date: '7',
  None: '9',
  Types: [
    { key: '0', title: '全部' },
    { key: '1', title: '免费开通' },
    { key: '3', title: '试用' },
    { key: '5', title: '按量付费' },
    { key: '7', title: '按期付费' },
    { key: '9', title: '未开通' }
  ]
}

/**
 * 系统菜单的子系统类型
 */

export const SecurityMenuSubsetType = {
  MarketingCloud: '1',
  PerformanceCloud: '3',
  ScoringCloud: '5',
  MessageCloud: '7',
  StockingCloud: '9',
  MembershipCloud: '11',
  SpreadCloud: '13',
  GiftingCloud: '15',
  SystemSetting: '99',
  Types: [
    { key: '1', title: '营销系统' },
    { key: '3', title: '薪酬绩效系统' },
    { key: '5', title: '积分卡券系统' },
    { key: '7', title: '短信系统' },
    { key: '9', title: 'ERP系统' },
    { key: '11', title: 'CRM系统' },
    { key: '13', title: '营销活动系统' },
    { key: '15', title: '礼品商城系统' },
    { key: '99', title: '系统设置' }
  ]
}

/**
 * 性别类型，男：1，女：3，无：5
 */

export const SexyTypes = {
  Male: '1',
  Female: '3',
  Unknown: '5',
  Types: [
    { key: '1', title: '男' },
    { key: '3', title: '女' },
    { key: '5', title: '无' }
  ]
}

/**
 * 支付方式(1银行转账,3支付宝,5微信,7银联,9现金,99系统)
 */

export const PaymentTypes = {
  BankPay: '1',
  AliPay: '3',
  WechatPay: '5',
  UnionPay: '7',
  CashPay: '9',
  SysPay: '99',
  Types: [
    { key: '1', title: '银行转账' },
    { key: '3', title: '支付宝' },
    { key: '5', title: '微信' },
    { key: '7', title: '银联' },
    { key: '9', title: '现金' },
    { key: '99', title: '系统' }
  ]
}

/**
 * 卡券消费状态
 */

export const CardExpendStatus = {
  NoneOf: '3',
  PartOf: '5',
  AllOf: '7',
  Types: [
    { key: '3', title: '尚未消费' },
    { key: '5', title: '部分消费' },
    { key: '7', title: '全部消费' }
  ]
}

/**
 * 扣减单状态枚举（1=草稿，2=待审核，3=审核通过，4=审核退回，5=已作废）
 */

export const DeductOrderStatus = {
  Draft: '1',
  Pending: '2',
  Pass: '3',
  Returned: '4',
  Invalid: '5',
  Types: [
    { key: '1', title: '草稿' },
    { key: '2', title: '待审核' },
    { key: '3', title: '审核通过' },
    { key: '4', title: '审核退回' },
    { key: '5', title: '已作废' }
  ]
}

/**
 * 钱包卡券状态
 */

export const WalletCouponStatus = {
  Abandon: '1',
  Origin: '3',
  Audit: '5',
  Locked: '7',
  Finish: '9',
  Types: [
    { key: '1', title: '已作废' },
    { key: '3', title: '待审核' },
    { key: '5', title: '已可用' },
    { key: '7', title: '已锁定' },
    { key: '9', title: '已结束' }
  ]
}

/**
 * 类别状态(0已删除,1正常)
 */

export const IsDeleteStatus = {
  Deleted: '0',
  Normal: '1',
  Types: [{ key: '0', title: '已删除' }, { key: '1', title: '正常' }]
}

/**
 * 是否状态枚举(否1，是3)
 */

export const YNStatus = {
  No: '1',
  Yes: '3',
  Types: [{ key: '1', title: '否' }, { key: '3', title: '是' }]
}

/**
 * 打印模板类型(礼品快递单7101,礼品订单7103)
 */

export const StoreSettingPrintingType = {
  GiftingCloudGiftExpressOrder: '7101',
  GiftingCloudGiftSaleOrder: '7103',
  Types: [
    { key: '7101', title: '礼品快递单' },
    { key: '7103', title: '礼品订单' }
  ]
}

/**
 * 公司充值类型
 */

export const SettingRechargeType = {
  None: '1',
  Rate: '3',
  Step: '5',
  Else: '9',
  Types: [
    { key: '1', title: '无赠送' },
    { key: '3', title: '固定赠送' },
    { key: '5', title: '阶梯赠送' },
    { key: '9', title: '其它' }
  ]
}

/**
 * 快递类型(快递公司)
 */

export const ExpressTypes = {
  SF: '1',
  STO: '2',
  ZTO: '3',
  YTO: '4',
  YUNDA: '5',
  EMS: '6',
  ZJS: '7',
  DEPPON: '8',
  TTKDEX: '9',
  BESTEX: '10',
  OTHER: '101',
  Types: [
    { key: '1', title: '顺丰' },
    { key: '2', title: '申通' },
    { key: '3', title: '中通' },
    { key: '4', title: '圆通' },
    { key: '5', title: '韵达' },
    { key: '6', title: 'EMS' },
    { key: '7', title: '宅急送' },
    { key: '8', title: '德邦' },
    { key: '9', title: '天天快递' },
    { key: '10', title: '百世快递' },
    { key: '101', title: '其它' }
  ]
}

/**
 * 物流状态
 */

export const ExpressStatus = {
  InTransit: '0',
  PickedUp: '1',
  InTrouble: '2',
  Delivered: '3',
  Return: '4',
  Delivering: '5',
  GoBack: '6',
  PreCustomsClearance: '10',
  InCustomsClearance: '11',
  PassCustomsClearance: '12',
  CustomsClearancException: '13',
  Reject: '14',
  Types: [
    { key: '0', title: '在途' },
    { key: '1', title: '揽件' },
    { key: '2', title: '疑难' },
    { key: '3', title: '签收' },
    { key: '4', title: '退签' },
    { key: '5', title: '派件' },
    { key: '6', title: '退回' },
    { key: '10', title: '待清关' },
    { key: '11', title: '清关中' },
    { key: '12', title: '已清关' },
    { key: '13', title: '清关异常' },
    { key: '14', title: '收件人拒签' }
  ]
}

/**
 * 积分变更类型
 */

export const ScoreRecordTypes = {
  GiveGoldenRice: '1',
  GiveScore: '2',
  ExpiredGoldenRice: '3',
  ExpiredScore: '4',
  CancelOrder: '5',
  ReturnGoods: '6',
  GiftExchange: '7',
  CancelGiftOrder: '8',
  InvalidGiftOrder: '9',
  ScoreManualOrder: '10',
  GoldenRiceManualOrder: '11',
  HistoryScore: '12',
  VoucherScore: '13',
  ScoreDeductOrder: '14',
  GoldenDeductOrder: '15',
  Types: [
    { key: '1', title: '购物赠送礼金' },
    { key: '2', title: '购物赠送积分' },
    { key: '3', title: '礼金到期' },
    { key: '4', title: '积分到期' },
    { key: '5', title: '取消销售单' },
    { key: '6', title: '退货' },
    { key: '7', title: '礼品兑换' },
    { key: '8', title: '取消礼品订单' },
    { key: '9', title: '作废礼品订单' },
    { key: '10', title: '手工赠送积分' },
    { key: '11', title: '手工赠送礼金' },
    { key: '12', title: '历史积分' },
    { key: '13', title: '人情券赠送' },
    { key: '14', title: '手工扣减积分' },
    { key: '15', title: '手工扣减礼金' }
  ]
}

/**
 * 赠送积分类型 手工赠送 1,消费赠送 2
 */

export const ScoreExpireTypes = {
  Manual: '1',
  Consume: '2',
  History: '3',
  Voucher: '4',
  Types: [
    { key: '1', title: '手工赠送' },
    { key: '2', title: '消费赠送' },
    { key: '3', title: '历史积分' },
    { key: '4', title: '人情券赠送' }
  ]
}

/**
 * 积分类型(兑换方式,1积分,2礼金,按位运算))
 */

export const ScoreTypes = {
  Score: '1',
  GoldenRice: '2',
  Types: [{ key: '1', title: '积分' }, { key: '2', title: '礼金' }]
}

/**
 *
 */

export const TemplateSendType = {
  Success: '1',
  Cancel: '3',
  Send: '5',
  Collage: '7',
  Integral: '9',
  Bargain: '11',
  Types: [
    { key: '1', title: '订单支付成功通知' },
    { key: '3', title: '订单取消通知' },
    { key: '5', title: '订单发货提醒' },
    { key: '7', title: '拼团结果通知' },
    { key: '9', title: '积分兑换成功通知' },
    { key: '11', title: '砍价进度通知' }
  ]
}

/**
 * 赠送积分状态(默认为1,2=未用完,3=已用完,4=已到期,5=已取消)
 */

export const GiveScoreStatus = {
  Unfinished: '1',
  Exhausted: '2',
  Expired: '3',
  Cancel: '4',
  Types: [
    { key: '1', title: '未用完' },
    { key: '2', title: '已用完' },
    { key: '3', title: '已过期' },
    { key: '4', title: '已取消' }
  ]
}

/**
 * 礼品状态(1=草稿,2=待审核,3=审核通过,4=审核退回,5=已作废)
 */

export const GiftStatus = {
  Draft: '1',
  Pending: '2',
  Pass: '3',
  Returned: '4',
  Invalid: '5',
  Types: [
    { key: '1', title: '草稿' },
    { key: '2', title: '待审核' },
    { key: '3', title: '审核通过' },
    { key: '4', title: '审核退回' },
    { key: '5', title: '已作废' }
  ]
}

/**
 * 支付类型 0=实付 ,1=应付 ,2=固定值
 */

export const GiveTypes = {
  OrderPrice: '0',
  ActualPrice: '1',
  Fixed: '2',
  Types: [
    { key: '0', title: '应付' },
    { key: '1', title: '实付' },
    { key: '2', title: '固定值' }
  ]
}

/**
 * 配置信息 (0=赠送规则 ,1=扣除手工旧货,2=会员升级方式,3=活动时间开关, 4=会员升级)
 */

export const SettingGlobalTypes = {
  GiveRule: '0',
  Deducted: '1',
  MemberUpgradeType: '2',
  Activity: '3',
  UpdateType: '4',
  Types: [
    { key: '0', title: '赠送规则开关' },
    { key: '1', title: '扣除手工旧货开关' },
    { key: '2', title: '会员升级方式' },
    { key: '3', title: '活动时间开关' },
    { key: '4', title: '会员升级' }
  ]
}

/**
 * 积分赠送特定日期倍数设定枚举(0=客户生日,1=纪念日,100=自定义)
 */

export const RateRuleTypes = {
  Birthday: '0',
  Commemorate: '1',
  Custom: '100',
  Types: [
    { key: '0', title: '客户生日' },
    { key: '1', title: '纪念日' },
    { key: '100', title: '自定义' }
  ]
}

/**
 * 婚姻状况（1=未知,2=未婚,3=已婚,4=离异）
 */

export const MarriageStatus = {
  Unknown: '1',
  Unmarried: '2',
  Married: '3',
  Divorce: '4',
  Types: [
    { key: '1', title: '未知' },
    { key: '2', title: '未婚' },
    { key: '3', title: '已婚' },
    { key: '4', title: '离异' }
  ]
}

/**
 * 卡券类型
 */

export const CouponSettingType = {
  Universal: '1',
  Voucher: '2',
  Sale: '3',
  Types: [
    { key: '1', title: '通用券' },
    { key: '2', title: '人情券' },
    { key: '3', title: '可售卡券' }
  ]
}

/**
 * 可售卡券类型
 */

export const CouponSaleType = {
  Online: '1',
  Offline: '3',
  Types: [
    { key: '1', title: '电子可售卡券' },
    { key: '3', title: '纸质可售卡券' }
  ]
}

/**
 * 品类设置的科目类型
 */

export const StoreSettingCategoryType = {
  CategoryType: '1',
  MaterialType: '3',
  GoldType: '5',
  Types: [
    { key: '1', title: 'CategoryType' },
    { key: '3', title: 'MaterialType' },
    { key: '5', title: 'GoldType' }
  ]
}

/**
 * 供应商情况类型
 */

export const GiftingSupplierSituationTypes = {
  PendingPay: '0',
  Probation: '1',
  Opened: '2',
  Types: [
    { key: '0', title: 'PendingPay' },
    { key: '1', title: 'Probation' },
    { key: '2', title: 'Opened' }
  ]
}

/**
 *
 */

export const GiftGiveTypes = {
  OrderPrice: '0',
  ActualPrice: '1',
  FixedPrice: '2',
  Types: [
    { key: '0', title: '应付' },
    { key: '1', title: '实付' },
    { key: '2', title: '固定值' }
  ]
}

/**
 * 打印模板状态（1已删除，3已启用，5设计中）
 */

export const StoreSettingPrintingState = {
  Deleted: '1',
  Normal: '3',
  Designing: '5',
  Types: [
    { key: '1', title: '已删除' },
    { key: '3', title: '已启用' },
    { key: '5', title: '设计中' }
  ]
}

/**
 * 供应商启用状态
 */

export const GiftingSupplierStatus = {
  Disable: '1',
  Enable: '3',
  Types: [{ key: '1', title: '未启用' }, { key: '3', title: '已启用' }]
}

/**
 * 卡券类型
 */

export const CouponTypes = {
  Agrece: '1',
  Agitate: '3',
  Gond: '5',
  Equiv: '7',
  Types: [
    { key: '1', title: '鼓励金' },
    { key: '3', title: '置换金' },
    { key: '5', title: '购物金' },
    { key: '7', title: '抵用金' }
  ]
}

/**
 * 商品来源
 */

export const ProductSourceTypes = {
  Marketing: '1',
  Manual: '3',
  ERP: '5',
  Types: [
    { key: '1', title: '营销系统' },
    { key: '3', title: '手工创建' },
    { key: '5', title: 'ERP' }
  ]
}

/**
 * 零售单的终端类型
 */

export const RetailOrderMasterTerminalType = {
  Cashier: '1',
  Wechat: '3',
  Website: '5',
  WxApplet: '7',
  Types: [
    { key: '1', title: '收银台' },
    { key: '3', title: '微信端' },
    { key: '5', title: 'PC端' },
    { key: '7', title: '小程序' }
  ]
}

/**
 * 零售单的退货子单状态
 */

export const RetailOrderReturnState = {
  Wait: '3',
  Audit: '5',
  Abandon: '19',
  Types: [
    { key: '3', title: '待审核' },
    { key: '5', title: '审核通过' },
    { key: '19', title: '已作废' }
  ]
}

/**
 * 零售单的新品子单的退货状态
 */

export const RetailOrderSellBasicReturnState = {
  NoneOfRma: '1',
  ReturnOrder: '3',
  Types: [{ key: '1', title: '未退货' }, { key: '3', title: '已退货' }]
}
