/**
* 余额变动类型
*/
export const BalanceLogTypes = {
  Expend: '1',
  Recharge: '2',
  Refund: '3',
  Types: [
    {
      key: '1', title: '消费' 
    },
    {
      key: '2', title: '充值' 
    },
    {
      key: '3', title: '退款' 
    }
  ]
}

/**
* 发送类型
*/
export const SendTypes = {
  Immediatly: '1',
  Ontime: '2',
  Types: [
    {
      key: '1', title: '即时发送' 
    },
    {
      key: '2', title: '定时发送' 
    }
  ]
}

/**
* 发送对象类型
*/
export const SendGroupTypes = {
  Imported: '1',
  InputNumber: '2',
  CustomSelect: '4',
  AllStore: '8',
  AllMember: '16',
  BirthMember: '32',
  OldMember: '64',
  Types: [
    {
      key: '1', title: '外部对象' 
    },
    {
      key: '2', title: '手输号码' 
    },
    {
      key: '4', title: '自定义对象' 
    },
    {
      key: '8', title: '所有门店' 
    },
    {
      key: '16', title: '所有会员' 
    },
    {
      key: '32', title: '生日会员' 
    },
    {
      key: '64', title: '老会员' 
    }
  ]
}

/**
* 是否系统固定短信
*/
export const TemplateStaticTypes = {
  Normal: '0',
  Static: '1',
  Types: [
    {
      key: '0', title: 'Normal' 
    },
    {
      key: '1', title: 'Static' 
    }
  ]
}

/**
* 短信通道选项功能
*/
export const ChannelOptions = {
  None: '0',
  Schedule: '1',
  MMS: '2',
  DigitMS: '4',
  Types: [
    {
      key: '0', title: 'None' 
    },
    {
      key: '1', title: 'Schedule' 
    },
    {
      key: '2', title: 'MMS' 
    },
    {
      key: '4', title: 'DigitMS' 
    }
  ]
}

/**
* 短信通道状态
*/
export const ChannelStatus = {
  Normal: '1',
  Invalid: '2',
  Warn: '3',
  LowBalance: '4',
  Types: [
    {
      key: '1', title: '正常' 
    },
    {
      key: '2', title: '不启用' 
    },
    {
      key: '3', title: '已达预警' 
    },
    {
      key: '4', title: '余额不足' 
    }
  ]
}

/**
* 充值付款状态
*/
export const RechargeOrderStatus = {
  PendingPay: '1',
  Complate: '2',
  Types: [
    {
      key: '1', title: '待付款' 
    },
    {
      key: '2', title: '已付款' 
    }
  ]
}

/**
* 短信发送状态
*/
export const SendStatus = {
  Unsent: '1',
  Sent: '2',
  SubmitFailed: '3',
  Success: '4',
  Failed: '5',
  Unknown: '6',
  Types: [
    {
      key: '1', title: '未发送' 
    },
    {
      key: '2', title: '已发送' 
    },
    {
      key: '3', title: '提交失败' 
    },
    {
      key: '4', title: '发送成功' 
    },
    {
      key: '5', title: '发送失败' 
    },
    {
      key: '6', title: '未知' 
    }
  ]
}

/**
* 审核状态
*/
export const AuditStatus = {
  Creating: '1',
  Pending: '2',
  Pass: '3',
  NotPass: '4',
  Invalid: '5',
  Failed: '6',
  Types: [
    {
      key: '1', title: '创建中' 
    },
    {
      key: '2', title: '待审核' 
    },
    {
      key: '3', title: '已通过' 
    },
    {
      key: '4', title: '未通过' 
    },
    {
      key: '5', title: '已作废' 
    },
    {
      key: '6', title: '创建失败' 
    }
  ]
}

/**
* 模板自动发送短信设置
*/
export const AutoSendStatus = {
  Disable: '0',
  Auto: '1',
  Types: [
    {
      key: '0', title: 'Disable' 
    },
    {
      key: '1', title: 'Auto' 
    }
  ]
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
    {
      key: '1', title: '零成本平台管控中心' 
    },
    {
      key: '2', title: '集团总部管控中心' 
    },
    {
      key: '3', title: '公司总部管理中心' 
    },
    {
      key: '5', title: '门店管理中心' 
    },
    {
      key: '7', title: '供应商管理中心' 
    }
  ]
}

/**
* 短信模版类型
*/
export const TemplateTypes = {
  Notification: '1',
  Marketing: '2',
  Types: [
    {
      key: '1', title: '通知类' 
    },
    {
      key: '2', title: '营销类' 
    }
  ]
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
    {
      key: '1', title: '营销系统' 
    },
    {
      key: '3', title: '薪酬绩效系统' 
    },
    {
      key: '5', title: '积分卡券系统' 
    },
    {
      key: '7', title: '短信系统' 
    },
    {
      key: '9', title: 'ERP系统' 
    },
    {
      key: '11', title: 'CRM系统' 
    },
    {
      key: '13', title: '营销活动系统' 
    },
    {
      key: '15', title: '礼品商城系统' 
    },
    {
      key: '17', title: '商学院' 
    }
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
    {
      key: '1', title: '黄金' 
    },
    {
      key: '3', title: '银饰' 
    },
    {
      key: '5', title: '3D硬金' 
    },
    {
      key: '7', title: '铂金' 
    },
    {
      key: '9', title: '钯金' 
    },
    {
      key: '11', title: '钻石' 
    },
    {
      key: '13', title: 'K金' 
    },
    {
      key: '15', title: '彩宝' 
    },
    {
      key: '17', title: '金镶玉' 
    },
    {
      key: '19', title: '珍珠宝石' 
    },
    {
      key: '21', title: '天然木饰' 
    },
    {
      key: '23', title: '时尚饰品' 
    },
    {
      key: '25', title: '珠宝配饰' 
    },
    {
      key: '27', title: '翡翠玉石' 
    },
    {
      key: '97', title: '配件' 
    },
    {
      key: '99', title: '其它' 
    }
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
    {
      key: '1001', title: '零成本平台管控中心' 
    },
    {
      key: '1101', title: '零成本分公司' 
    },
    {
      key: '2001', title: '集团总部管控中心' 
    },
    {
      key: '2101', title: '公司总部管理中心' 
    },
    {
      key: '2201', title: '门店管理中心' 
    },
    {
      key: '3001', title: '礼品供应商管理中心' 
    },
    {
      key: '3101', title: '供应链供应商管理中心' 
    }
  ]
}

/**
* 微信配置
*/
export const CompanyBasicWechatSettingType = {
  Company: '1',
  Store: '3',
  Types: [
    {
      key: '1', title: '公司总部' 
    },
    {
      key: '3', title: '门店设置' 
    }
  ]
}

/**
* 支付授权
*/
export const CompanyBasicPaymentSettingType = {
  Company: '1',
  Store: '3',
  Types: [
    {
      key: '1', title: '公司总部' 
    },
    {
      key: '3', title: '门店设置' 
    }
  ]
}

/**
* 应用类型
*/
export const AppTypes = {
  ActiveMp: '0',
  Wx: '1',
  Types: [
    {
      key: '0', title: 'ActiveMp' 
    },
    {
      key: '1', title: 'Wx' 
    }
  ]
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
    {
      key: '0', title: '全部' 
    },
    {
      key: '1', title: '免费开通' 
    },
    {
      key: '3', title: '试用' 
    },
    {
      key: '5', title: '按量付费' 
    },
    {
      key: '7', title: '按期付费' 
    },
    {
      key: '9', title: '未开通' 
    }
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
    {
      key: '1', title: '营销系统' 
    },
    {
      key: '3', title: '薪酬绩效系统' 
    },
    {
      key: '5', title: '积分卡券系统' 
    },
    {
      key: '7', title: '短信系统' 
    },
    {
      key: '9', title: 'ERP系统' 
    },
    {
      key: '11', title: 'CRM系统' 
    },
    {
      key: '13', title: '营销活动系统' 
    },
    {
      key: '15', title: '礼品商城系统' 
    },
    {
      key: '99', title: '系统设置' 
    }
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
    {
      key: '1', title: '男' 
    },
    {
      key: '3', title: '女' 
    },
    {
      key: '5', title: '无' 
    }
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
    {
      key: '1', title: '银行转账' 
    },
    {
      key: '3', title: '支付宝' 
    },
    {
      key: '5', title: '微信' 
    },
    {
      key: '7', title: '银联' 
    },
    {
      key: '9', title: '现金' 
    },
    {
      key: '99', title: '系统' 
    }
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
    {
      key: '3', title: '尚未消费' 
    },
    {
      key: '5', title: '部分消费' 
    },
    {
      key: '7', title: '全部消费' 
    }
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
    {
      key: '1', title: '草稿' 
    },
    {
      key: '2', title: '待审核' 
    },
    {
      key: '3', title: '审核通过' 
    },
    {
      key: '4', title: '审核退回' 
    },
    {
      key: '5', title: '已作废' 
    }
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
    {
      key: '1', title: '已作废' 
    },
    {
      key: '3', title: '待审核' 
    },
    {
      key: '5', title: '已可用' 
    },
    {
      key: '7', title: '已锁定' 
    },
    {
      key: '9', title: '已结束' 
    }
  ]
}

/**
* 类别状态(0已删除,1正常)
*/
export const IsDeleteStatus = {
  Deleted: '0',
  Normal: '1',
  Types: [
    {
      key: '0', title: '已删除' 
    },
    {
      key: '1', title: '正常' 
    }
  ]
}

/**
* 是否状态枚举(否1，是3)
*/
export const YNStatus = {
  No: '1',
  Yes: '3',
  Types: [
    {
      key: '1', title: '否' 
    },
    {
      key: '3', title: '是' 
    }
  ]
}

/**
* 打印模板类型(礼品快递单7101,礼品订单7103)
*/
export const StoreSettingPrintingType = {
  GiftingCloudGiftExpressOrder: '7101',
  GiftingCloudGiftSaleOrder: '7103',
  Types: [
    {
      key: '7101', title: '礼品快递单' 
    },
    {
      key: '7103', title: '礼品订单' 
    }
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
    {
      key: '1', title: '无赠送' 
    },
    {
      key: '3', title: '固定赠送' 
    },
    {
      key: '5', title: '阶梯赠送' 
    },
    {
      key: '9', title: '其它' 
    }
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
    {
      key: '1', title: '顺丰' 
    },
    {
      key: '2', title: '申通' 
    },
    {
      key: '3', title: '中通' 
    },
    {
      key: '4', title: '圆通' 
    },
    {
      key: '5', title: '韵达' 
    },
    {
      key: '6', title: 'EMS' 
    },
    {
      key: '7', title: '宅急送' 
    },
    {
      key: '8', title: '德邦' 
    },
    {
      key: '9', title: '天天快递' 
    },
    {
      key: '10', title: '百世快递' 
    },
    {
      key: '101', title: '其它' 
    }
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
    {
      key: '0', title: '在途' 
    },
    {
      key: '1', title: '揽件' 
    },
    {
      key: '2', title: '疑难' 
    },
    {
      key: '3', title: '签收' 
    },
    {
      key: '4', title: '退签' 
    },
    {
      key: '5', title: '派件' 
    },
    {
      key: '6', title: '退回' 
    },
    {
      key: '10', title: '待清关' 
    },
    {
      key: '11', title: '清关中' 
    },
    {
      key: '12', title: '已清关' 
    },
    {
      key: '13', title: '清关异常' 
    },
    {
      key: '14', title: '收件人拒签' 
    }
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
    {
      key: '1', title: '购物赠送礼金' 
    },
    {
      key: '2', title: '购物赠送积分' 
    },
    {
      key: '3', title: '礼金到期' 
    },
    {
      key: '4', title: '积分到期' 
    },
    {
      key: '5', title: '取消销售单' 
    },
    {
      key: '6', title: '退货' 
    },
    {
      key: '7', title: '礼品兑换' 
    },
    {
      key: '8', title: '取消礼品订单' 
    },
    {
      key: '9', title: '作废礼品订单' 
    },
    {
      key: '10', title: '手工赠送积分' 
    },
    {
      key: '11', title: '手工赠送礼金' 
    },
    {
      key: '12', title: '历史积分' 
    },
    {
      key: '13', title: '人情券赠送' 
    },
    {
      key: '14', title: '手工扣减积分' 
    },
    {
      key: '15', title: '手工扣减礼金' 
    }
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
    {
      key: '1', title: '手工赠送' 
    },
    {
      key: '2', title: '消费赠送' 
    },
    {
      key: '3', title: '历史积分' 
    },
    {
      key: '4', title: '人情券赠送' 
    }
  ]
}

/**
* 积分类型(兑换方式,1积分,2礼金,按位运算))
*/
export const ScoreTypes = {
  Score: '1',
  GoldenRice: '2',
  Types: [
    {
      key: '1', title: '积分' 
    },
    {
      key: '2', title: '礼金' 
    }
  ]
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
    {
      key: '1', title: '订单支付成功通知' 
    },
    {
      key: '3', title: '订单取消通知' 
    },
    {
      key: '5', title: '订单发货提醒' 
    },
    {
      key: '7', title: '拼团结果通知' 
    },
    {
      key: '9', title: '积分兑换成功通知' 
    },
    {
      key: '11', title: '砍价进度通知' 
    }
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
    {
      key: '1', title: '未用完' 
    },
    {
      key: '2', title: '已用完' 
    },
    {
      key: '3', title: '已过期' 
    },
    {
      key: '4', title: '已取消' 
    }
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
    {
      key: '1', title: '草稿' 
    },
    {
      key: '2', title: '待审核' 
    },
    {
      key: '3', title: '审核通过' 
    },
    {
      key: '4', title: '审核退回' 
    },
    {
      key: '5', title: '已作废' 
    }
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
    {
      key: '0', title: '应付' 
    },
    {
      key: '1', title: '实付' 
    },
    {
      key: '2', title: '固定值' 
    }
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
    {
      key: '0', title: '赠送规则开关' 
    },
    {
      key: '1', title: '扣除手工旧货开关' 
    },
    {
      key: '2', title: '会员升级方式' 
    },
    {
      key: '3', title: '活动时间开关' 
    },
    {
      key: '4', title: '会员升级' 
    }
  ]
}

/**
* 积分赠送特定日期倍数设定枚举(0=客户生日,1=自定义，2=纪念日)
*/
export const RateRuleTypes = {
  Birthday: '0',
  Commemorate: '1',
  Custom: '100',
  Types: [
    {
      key: '0', title: '客户生日' 
    },
    {
      key: '1', title: '纪念日' 
    },
    {
      key: '100', title: '自定义' 
    }
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
    {
      key: '1', title: '未知' 
    },
    {
      key: '2', title: '未婚' 
    },
    {
      key: '3', title: '已婚' 
    },
    {
      key: '4', title: '离异' 
    }
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
    {
      key: '1', title: '通用券' 
    },
    {
      key: '2', title: '人情券' 
    },
    {
      key: '3', title: '可售卡券' 
    }
  ]
}

/**
* 可售卡券类型
*/
export const CouponSaleType = {
  Online: '1',
  Offline: '3',
  Types: [
    {
      key: '1', title: '电子可售卡券' 
    },
    {
      key: '3', title: '纸质可售卡券' 
    }
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
    {
      key: '1', title: 'CategoryType' 
    },
    {
      key: '3', title: 'MaterialType' 
    },
    {
      key: '5', title: 'GoldType' 
    }
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
    {
      key: '0', title: 'PendingPay' 
    },
    {
      key: '1', title: 'Probation' 
    },
    {
      key: '2', title: 'Opened' 
    }
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
    {
      key: '0', title: '应付' 
    },
    {
      key: '1', title: '实付' 
    },
    {
      key: '2', title: '固定值' 
    }
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
    {
      key: '1', title: '已删除' 
    },
    {
      key: '3', title: '已启用' 
    },
    {
      key: '5', title: '设计中' 
    }
  ]
}

/**
* 供应商启用状态
*/
export const GiftingSupplierStatus = {
  Disable: '1',
  Enable: '3',
  Types: [
    {
      key: '1', title: '未启用' 
    },
    {
      key: '3', title: '已启用' 
    }
  ]
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
    {
      key: '1', title: '鼓励金' 
    },
    {
      key: '3', title: '置换金' 
    },
    {
      key: '5', title: '购物金' 
    },
    {
      key: '7', title: '抵用金' 
    }
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
    {
      key: '1', title: '营销系统' 
    },
    {
      key: '3', title: '手工创建' 
    },
    {
      key: '5', title: 'ERP' 
    }
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
    {
      key: '1', title: '收银台' 
    },
    {
      key: '3', title: '微信端' 
    },
    {
      key: '5', title: 'PC端' 
    },
    {
      key: '7', title: '小程序' 
    }
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
    {
      key: '3', title: '待审核' 
    },
    {
      key: '5', title: '审核通过' 
    },
    {
      key: '19', title: '已作废' 
    }
  ]
}

/**
* 零售单的新品子单的退货状态
*/
export const RetailOrderSellBasicReturnState = {
  NoneOfRma: '1',
  ReturnOrder: '3',
  Types: [
    {
      key: '1', title: '未退货' 
    },
    {
      key: '3', title: '已退货' 
    }
  ]
}

/**
* 
*/
export const OrderLogTypes = {
  Create: '0',
  Pay: '1',
  Audit: '2',
  Received: '3',
  Cancel: '4',
  Invalid: '5',
  Delivery: '11',
  ReDelivery: '12',
  MemberDelete: '13',
  Types: [
    {
      key: '0', title: 'Create' 
    },
    {
      key: '1', title: 'Pay' 
    },
    {
      key: '2', title: 'Audit' 
    },
    {
      key: '3', title: 'Received' 
    },
    {
      key: '4', title: 'Cancel' 
    },
    {
      key: '5', title: 'Invalid' 
    },
    {
      key: '11', title: 'Delivery' 
    },
    {
      key: '12', title: 'ReDelivery' 
    },
    {
      key: '13', title: 'MemberDelete' 
    }
  ]
}
