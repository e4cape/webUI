// 优惠券状态;
export const CouponStatus = {
  Origin: 3,
  Give: 5,
  Locked: 7,
  Finish: 9,
  Expired: 11,
  Types: {
    '3': '未使用',
    '5': '已转赠',
    '7': '已锁定',
    '9': '已使用',
    '11': '已过期'
  },
  TypeArray: [
    { KeyId: '3', Value: '未使用' },
    { KeyId: '5', Value: '已转赠' },
    { KeyId: '7', Value: '已锁定' },
    { KeyId: '9', Value: '已使用' },
    { KeyId: '11', Value: '已过期' }
  ]
}
// 优惠券投放状态;
export const CouponLaunchStatus = {
  Origin: 3,
  Audit: 5,
  Finish: 7,
  Types: {
    '3': '未投放',
    '5': '已投放',
    '7': '投放结束'
  },
  TypeArray: [
    { KeyId: '3', Value: '未投放' },
    { KeyId: '5', Value: '已投放' },
    { KeyId: '7', Value: '投放结束' }
  ]
}
// 优惠券审核状态;
export const CouponAuditStatus = {
  Abandon: 1,
  Origin: 3,
  Audit: 5,
  Terminal: 7,
  Types: {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
    '7': '已终止'
  },
  TypeArray: [
    { KeyId: '1', Value: '已作废' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '已审核' },
    { KeyId: '7', Value: '已终止' }
  ]
}
// 卡券赠送状态;
export const CouponGiveRecordStatus = {
  Abandon: 1,
  Origin: 3,
  Audit: 5,
  Types: {
    '1': '已失效',
    '3': '待领取',
    '5': '已领取'
  },
  TypeArray: [
    { KeyId: '1', Value: '已失效' },
    { KeyId: '3', Value: '待领取' },
    { KeyId: '5', Value: '已领取' }
  ]
}
// 优惠券类型状态;
export const CouponTypeStatus = {
  Abandon: 1,
  Disable: 3,
  Enable: 5,
  Types: {
    '1': '已作废',
    '3': '未启用',
    '5': '已启用'
  },
  TypeArray: [
    { KeyId: '1', Value: '已作废' },
    { KeyId: '3', Value: '未启用' },
    { KeyId: '5', Value: '已启用' }
  ]
}
// 卡券类型;
export const CouponSettingType = {
  Universal: 1,
  Voucher: 2,
  Sale: 3,
  Types: {
    '1': '通用券',
    '2': '人情券',
    '3': '可售卡券'
  },
  TypeArray: [
    { KeyId: '1', Value: '通用券' },
    { KeyId: '2', Value: '人情券' },
    { KeyId: '3', Value: '可售卡券' }
  ]
}
// 可售卡券类型;
export const CouponSaleType = {
  Online: 1,
  Offline: 3,
  Types: {
    '1': '电子可售卡券',
    '3': '纸质可售卡券'
  },
  TypeArray: [
    { KeyId: '1', Value: '电子可售卡券' },
    { KeyId: '3', Value: '纸质可售卡券' }
  ]
}
// 卡券销售状态;
export const CouponOrderStatus = {
  Unsold: 1,
  Sold: 3,
  Refund: 5,
  Types: {
    '1': '未售',
    '3': '已售',
    '5': '已退'
  },
  TypeArray: [
    { KeyId: '1', Value: '未售' },
    { KeyId: '3', Value: '已售' },
    { KeyId: '5', Value: '已退' }
  ]
}
// 可使用人类型;
export const CouponAvailableType = {
  Self: 1,
  Other: 3,
  Types: {
    '1': '领取人',
    '3': '被转赠人'
  },
  TypeArray: [
    { KeyId: '1', Value: '领取人' },
    { KeyId: '3', Value: '被转赠人' }
  ]
}
// 领取方式;
export const ReceiveType = {
  System: 1,
  Give: 3,
  Sale: 5,
  Types: {
    '1': '系统赠送',
    '3': '朋友转赠',
    '5': '购买'
  },
  TypeArray: [
    { KeyId: '1', Value: '系统赠送' },
    { KeyId: '3', Value: '朋友转赠' },
    { KeyId: '5', Value: '购买' }
  ]
}
// 赠送规则;
export const EventType = {
  FirstAttention: 1,
  RepeatedBuy: 3,
  RepeatedCount: 5,
  Share: 7,
  Included: 9,
  Gifted: 11,
  Material: 13,
  Manual: 15,
  Types: {
    '1': '首次关注公众号赠送',
    '3': '复购赠送',
    '5': '复购达指定次数赠送',
    '7': '分享成功领取',
    '9': '参与活动赠送',
    '11': '消费达指定金额赠送',
    '13': '购买指定材质赠送',
    '15': '其他手动赠送'
  },
  TypeArray: [
    { KeyId: '1', Value: '首次关注公众号赠送' },
    { KeyId: '3', Value: '复购赠送' },
    { KeyId: '5', Value: '复购达指定次数赠送' },
    { KeyId: '7', Value: '分享成功领取' },
    { KeyId: '9', Value: '参与活动赠送' },
    { KeyId: '11', Value: '消费达指定金额赠送' },
    { KeyId: '13', Value: '购买指定材质赠送' },
    { KeyId: '15', Value: '其他手动赠送' }
  ]
}
// 有效期;
export const ExpireType = {
  Fixed: 1,
  Designated: 3,
  Types: {
    '1': '固定有效期',
    '3': '指定有效期'
  },
  TypeArray: [
    { KeyId: '1', Value: '固定有效期' },
    { KeyId: '3', Value: '指定有效期' }
  ]
}
// 卡券订单来源;
export const CouponOrderSourceType = {
  Offline: 1,
  WeChat: 3,
  Spread: 5,
  Types: {
    '1': '线下',
    '3': '微信',
    '5': '活动'
  },
  TypeArray: [
    { KeyId: '1', Value: '线下' },
    { KeyId: '3', Value: '微信' },
    { KeyId: '5', Value: '活动' }
  ]
}
// 券面金额类型;
export const GivePriceType = {
  Fixed: 1,
  Random: 3,
  Rate: 5,
  Types: {
    '1': '固定金额',
    '3': '随机金额',
    '5': '购买金额倍率'
  },
  TypeArray: [
    { KeyId: '1', Value: '固定金额' },
    { KeyId: '3', Value: '随机金额' },
    { KeyId: '5', Value: '购买金额倍率' }
  ]
}
// 奖励类型;
export const CouponRewardType = {
  Fixed: 1,
  Step: 3,
  Types: {
    '1': '固定奖励',
    '3': '阶梯奖励'
  },
  TypeArray: [
    { KeyId: '1', Value: '固定奖励' },
    { KeyId: '3', Value: '阶梯奖励' }
  ]
}
// 使用设置;
export const RuleType = {
  Indefinitely: 1,
  Reached: 3,
  Types: {
    '1': '无门槛，无低消',
    '3': '消费满指定金额可用'
  },
  TypeArray: [
    { KeyId: '1', Value: '无门槛，无低消' },
    { KeyId: '3', Value: '消费满指定金额可用' }
  ]
}
// 卡券交易状态;
export const CouponPayStatus = {
  NoPay: 1,
  Pay: 3,
  Refund: 5,
  Types: {
    '1': '未支付',
    '3': '已支付',
    '5': '已退款'
  },
  TypeArray: [
    { KeyId: '1', Value: '未支付' },
    { KeyId: '3', Value: '已支付' },
    { KeyId: '5', Value: '已退款' }
  ]
}
// 卡券状态;
export const CardStatus = {
  Abandon: 1,
  Origin: 3,
  Audit: 5,
  Locked: 7,
  Finish: 9,
  Types: {
    '1': '已作废',
    '3': '待审核',
    '5': '已可用',
    '7': '已锁定',
    '9': '已结束'
  },
  TypeArray: [
    { KeyId: '1', Value: '已作废' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '已可用' },
    { KeyId: '7', Value: '已锁定' },
    { KeyId: '9', Value: '已结束' }
  ]
}
// 卡券审核状态;
export const CardAuditStatus = {
  Abandon: 1,
  Origin: 3,
  Audit: 5,
  Terminal: 7,
  Types: {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
    '7': '已终止'
  },
  TypeArray: [
    { KeyId: '1', Value: '已作废' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '已审核' },
    { KeyId: '7', Value: '已终止' }
  ]
}
// 卡券消费状态;
export const CardExpendStatus = {
  NoneOf: 3,
  PartOf: 5,
  AllOf: 7,
  Types: {
    '3': '尚未消费',
    '5': '部分消费',
    '7': '全部消费'
  },
  TypeArray: [
    { KeyId: '3', Value: '尚未消费' },
    { KeyId: '5', Value: '部分消费' },
    { KeyId: '7', Value: '全部消费' }
  ]
}
// 卡券类型;
export const CardType = {
  Gond: 5,
  Equiv: 7,
  Types: {
    '5': '购物金',
    '7': '抵用金'
  },
  TypeArray: [{ KeyId: '5', Value: '购物金' }, { KeyId: '7', Value: '抵用金' }]
}
// 抵扣材质类型;
export const CardDRateType = {
  Default: 1,
  Customized: 3,
  Types: {
    '1': '默认值',
    '3': '自定义'
  },
  TypeArray: [{ KeyId: '1', Value: '默认值' }, { KeyId: '3', Value: '自定义' }]
}
