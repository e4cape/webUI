<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <div class="title">{{(packetId ? '编辑' : '新建') + '微信红包'}}</div>
      </div>
      <div class="panel-bd">
        <el-row class="m-10">
          <el-col :span="20">
            <el-form label-position="right" ref="timeForm" label-width="120px" :rules="rules" :model="form">
              <el-form-item label="发放日期" required class="clearfix">
                <div class="red-input-item fl">
                  <el-row :span="24">
                    <el-col :span="24" v-if="!checked">
                      <el-col :span="11">
                        <el-form-item name="datePickerGrantStart" prop="GrantStart" class="no-margin">
                          <el-date-picker
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions"
                            type="date"
                            placeholder="选择开始日期"
                            v-model="form.GrantStart"
                            style="width: 100%;"
                            @change="getTableData"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col class="tc" :span="2">-</el-col>
                      <el-col :span="11">
                        <el-form-item name="datePickerpickerOptions" prop="GrantStop" class="no-margin">
                          <el-date-picker
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions"
                            type="date"
                            placeholder="选择结束时间"
                            v-model="form.GrantStop"
                            style="width: 100%;"
                            @change="getTableData"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-col>
                    <el-col :span="24" v-else>
                      <el-col :span="24">
                        <el-form-item name="datePickerpickerOptionss" prop="GrantStart" class="no-margin">
                          <el-date-picker
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions"
                            type="date"
                            placeholder="选择开始日期"
                            v-model="form.GrantStart"
                            style="width: 100%;"
                            @change="getTableData"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-col>
                  </el-row>
                </div>
                <div class="fl m-l-10">
                  <el-checkbox name="checkboxChecked" v-model="checked">不限结束时间</el-checkbox>
                </div>
              </el-form-item>
            </el-form>
            <el-form label-position="right" ref="form" label-width="120px" :rules="rules" :model="form">
              <el-form-item label="活动名称" prop="ActivityName">
                <el-input name="inputActivityName" class="red-input-item" v-model="form.ActivityName" maxlength="10" placeholder="不超过10个汉字, 含标点符号"></el-input>
              </el-form-item>
              <el-form-item label="祝福语" prop="Blessings">
                <el-input name="inputBlessings" class="red-input-item" maxlength="20" placeholder="不超过20个汉字, 含标点符号" v-model="form.Blessings"></el-input>
              </el-form-item>
              <el-form-item label="红包总数" prop="Qty">
                <el-input name="inputQty" class="red-input-item" v-model="form.Qty" maxlength="6" @keyup.native="form.Qty= $root.toFixed(form.Qty, 0)" placeholder="请输入红包总数"></el-input>
              </el-form-item>
              <el-form-item label="金额类型" class="fix-w" prop="PriceType">
                <el-radio-group name="radioGroupPriceType" v-model="form.PriceType" @change="changePriceType">
                  <el-radio class="m-r-10" :label="paymentRedPacketPriceType.Fixed">固定金额</el-radio>
                  <el-radio class="m-r-10" :label="paymentRedPacketPriceType.Random">随机金额</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="固定金额" class="fix-w" prop="Price" v-if="form.PriceType === paymentRedPacketPriceType.Fixed">
                <el-input name="inputPrice" class="red-input-item" v-model="form.Price" maxlength="6" @keyup.native="form.Price= $root.toFixed(form.Price, 2)" placeholder="请输入红包金额"></el-input>
              </el-form-item>
              <el-form-item label="随机金额" prop="MinPrice" class="no-margin" v-else-if="form.PriceType === paymentRedPacketPriceType.Random">
                <el-row :gutter="2">
                  <el-col :span="16">
                    <el-col :span="11">
                      <el-form-item prop="MinPrice">
                        <el-input name="inputMinPrice" v-model="form.MinPrice" maxlength="6" @keyup.native="form.MinPrice= $root.toFixed(form.MinPrice, 2)" placeholder="请输入最小红包金额"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col class="tc" :span="2">~</el-col>
                    <el-col :span="11">
                      <el-form-item prop="MaxPrice">
                        <el-input name="inputMaxPrice" v-model="form.MaxPrice" maxlength="6" @keyup.native="form.MaxPrice= $root.toFixed(form.MaxPrice, 2)" placeholder="请输入最大红包金额"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="备注" prop="Note">
                <el-input name="inputNote" class="red-input-item" maxlength="20" v-model="form.Note" placeholder="不超过20个汉字, 含标点符号"></el-input>
              </el-form-item>
              <el-form-item label="触发事件" prop="EventType">
                <div>
                  <el-select name="selectEventType" class="red-input-item" v-model="form.EventType">
                    <el-option v-for="(item, index) in paymentRedPacketEventType.Types" :key="index" :label="item" :value="index"></el-option>
                  </el-select>
                  <span>{{eventTypeMessage}}</span>
                </div>
              </el-form-item>
              <el-form-item v-if="form.EventType == paymentRedPacketEventType.Buy">
                <el-form-item label="消费材质：" prop="MaterialTypes">
                  <el-checkbox-group name="checkboxGroupMaterialTypes" v-model="form.MaterialTypes">
                    <el-checkbox style="margin-left: 0; margin-right:30px;" v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="String(item.Id)">{{item.Value}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="消费金额：" prop="CashType" class="fix-w">
                  <el-radio-group name="radioGroupCashType" v-model="form.CashType">
                    <el-radio v-for="(item, index) in paymentRedPacketOrderCashType.Types" :key="index" :label="parseInt(index)">{{item}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="消费满：" prop="CashPrice" class="fix-w" v-if="form.CashType === paymentRedPacketOrderCashType.CashPrice">
                  <el-input name="inputCashPrice" v-model="form.CashPrice" maxlength="9" @keyup.native="form.CashPrice= $root.toFixed(form.CashPrice, 2)"></el-input>
                  <span>(元)</span>
                </el-form-item>
                <el-form-item label="单据来源：" prop="TerminalTypes">
                  <el-checkbox-group name="checkboxGroupTerminalTypes" v-model="form.TerminalTypes">
                    <el-checkbox v-for="(item,index) in paymentRedPacketOrderSourceType.Types" :key="index" :label="parseInt(index)" style="margin-right:10px">{{item}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="补录发放设置：" class="fix-w" prop="IsSend">
                  <p>手动补录的消费单是否发放红包（包括微信端补录、PC端补录、收银机手动录入）</p>
                  <el-radio-group name="radioGroupIsSend" v-model="form.IsSend">
                    <el-radio v-for="(item, index) in YNStatus.Types" :key="index" :label="parseInt(index)">{{index == YNStatus.No? '不发放红包' : '发放红包'}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form-item>
              <el-form-item v-if="form.EventType == paymentRedPacketEventType.Included">
                <span>请选择参与活动赠送卡券，红包将与参与活动赠送卡券一起发放！</span>
                <el-table :data="tableData" ref="redPacket" @selection-change="selectionChange">
                  <el-table-column type="selection" fixed></el-table-column>
                  <el-table-column prop="CouponId" label="卡券ID" min-width="80" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="CouponName" label="卡券名称" min-width="100" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="Price" label="卡券面额" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.GivePriceType == givePriceType['Random'] ? givePriceType.Types['3'] : $root.toFloat(scope.row.Price)}}</template>
                  </el-table-column>
                  <el-table-column prop="EventType" label="赠送规则" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">{{ eventType.Types[scope.row.EventType]}}</template>
                  </el-table-column>
                  <el-table-column prop="Expireb" label="投放时间" min-width="240" show-overflow-tooltip>
                    <template slot-scope="scope">{{filterDate1(scope.row.Expireb)}} - {{filterDate1(scope.row.Expiree)}}</template>
                  </el-table-column>
                  <el-table-column prop="CheckStatus" label="审核状态" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">{{ couponAuditStatus.Types[scope.row.CheckStatus]}}</template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item>
                <el-button name="btnOnSubmit" type="primary" :loading="$store.getters.is_loading" @click="onSubmit">提交</el-button>
                <el-button name="btnBack" :loading="$store.getters.is_loading" @click="$router.go(-1)">返回</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
  
<script>
const messageList = {
  '1': '即首次关注微信公众号向用户发放红包。',
  '3': '即用户到门消费成功发放红包（线上消费除外）。',
  '5': '即用户参与线下门店活动后发放红包，与参与活动赠送卡券有关联。',
  '7': '即转赠人情券被人领取成功后发放红包。',
  '9': '即系统将生成二维码，让用户扫码即可领取发放的红包。'
}

import { YNStatus } from '@/enums/common.js'
import { EventType, CouponAuditStatus, GivePriceType } from '@/enums/scoring'
import {
  PaymentRedPacketEventType,
  PaymentRedPacketOrderSourceType,
  PaymentRedPacketOrderCashType,
  PaymentRedPacketPriceType
} from '@/enums/payment'

import {
  PAYMENT_API_RED_PACKET_BASIC_GET,
  PAYMENT_API_RED_PACKET_BASIC_CREATE,
  PAYMENT_API_RED_PACKET_BASIC_UPDATE
} from '@/apis/payment1'

import { SCORING_API_COUPON_BASIC_GETS } from '@/apis/scoring'

export default {
  data() {
    return {
      YNStatus,
      packetId: '',
      paymentRedPacketEventType: PaymentRedPacketEventType,
      paymentRedPacketOrderSourceType: PaymentRedPacketOrderSourceType,
      paymentRedPacketOrderCashType: PaymentRedPacketOrderCashType,
      eventType: EventType,
      couponAuditStatus: CouponAuditStatus,
      paymentRedPacketPriceType: PaymentRedPacketPriceType,
      givePriceType: GivePriceType,
      form: {
        ActivityName: '', // 活动标题
        Blessings: '', // 祝福语
        Qty: '', // 红包发放总人数
        Price: '', // 红包金额
        Note: '', // 备注
        EventType: '', // 触发事件(枚举, 事件点)
        MaterialTypes: [], // 参与条件
        CashType: 0, // 消费类型
        CashPrice: '', // 消费金额满?
        TerminalTypes: [], // 事件类型(来源,枚举)
        CouponIds: '', // 优惠券序号(逗号分隔,)
        GrantStart: '', // 发放开始时间
        GrantStop: '', // 发放结束时间
        PriceType: '',
        MaxPrice: '',
        MinPrice: '',
        IsSend: YNStatus.No
      },
      eventTypeMessage: '', // 事件信息提示
      couponIds: [],
      checked: false,
      tableData: [],
      rules: {
        ActivityName: {
          required: true,
          message: '请输入活动名称',
          trigger: 'blur'
        },
        Blessings: {
          required: true,
          message: '请输入祝福语',
          trigger: 'blur'
        },
        Qty: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (parseInt(value) != 0 && !value) {
                callback(new Error('请输入红包总数'))
              } else if (this.form.Qty && 1.0 > parseFloat(this.form.Qty)) {
                callback(new Error('红包总数最小为1'))
              }
              callback()
            }
          }
        ],
        Note: {
          required: true,
          message: '请输入备注',
          trigger: 'blur'
        },
        MaterialTypes: {
          type: 'array',
          required: true,
          message: '请至少选择一个材质',
          trigger: 'change'
        },
        CashPrice: {
          required: true,
          message: '请输入消费金额',
          trigger: 'blur'
        },
        CashType: {
          required: true,
          message: '请选择消费金额',
          trigger: 'change'
        },
        TerminalTypes: {
          type: 'array',
          required: true,
          message: '请选择单据来源',
          trigger: 'change'
        },
        PriceType: {
          required: true,
          message: '请选择红包金额类型',
          trigger: 'change'
        },
        IsSend: {
          required: true,
          message: '请选择补录发放设置',
          trigger: 'change'
        },
        Price: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (parseFloat(value) != 0 && !value) {
                callback(new Error('请输入红包金额'))
              } else if (
                this.form.Price &&
                (1.0 > parseFloat(this.form.Price) ||
                  parseFloat(this.form.Price) > 200.0)
              ) {
                callback(new Error('金额要求大于等于1.00且小于等于200.00'))
              }
              callback()
            }
          }
        ],
        MinPrice: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (parseInt(value) != 0 && !value) {
                callback(new Error('请输入最小红包金额'))
              } else if (
                this.form.MinPrice &&
                (1.0 > parseFloat(this.form.MinPrice) ||
                  parseFloat(this.form.MinPrice) > 200.0)
              ) {
                callback(new Error('金额要求大于等于1.00且小于等于200.00'))
              } else if (
                this.form.MinPrice &&
                this.form.MaxPrice &&
                Number(this.form.MinPrice) >= Number(this.form.MaxPrice)
              ) {
                callback(new Error('最小金额不能大于等于最大金额'))
              }
              callback()
            }
          }
        ],
        MaxPrice: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (parseInt(value) != 0 && !value) {
                callback(new Error('请输入最大红包金额'))
              } else if (
                this.form.MaxPrice &&
                (1.0 > parseFloat(this.form.MaxPrice) ||
                  parseFloat(this.form.MaxPrice) > 200.0)
              ) {
                callback(new Error('金额要求大于等于1.00且小于等于200.00'))
              } else if (
                this.form.MinPrice &&
                this.form.MaxPrice &&
                Number(this.form.MinPrice) >= Number(this.form.MaxPrice)
              ) {
                callback(new Error('最大金额不能小于等于最小金额'))
              }
              callback()
            }
          }
        ],
        EventType: {
          required: true,
          message: '请选择触发事件',
          trigger: 'change'
        },
        GrantStart: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请选择开始时间'))
              } else if (
                this.form.GrantStop &&
                new Date(value).getTime() >
                new Date(this.form.GrantStop).getTime()
              ) {
                callback(new Error('开始时间不能大于结束时间'))
              }
              callback()
            }
          }
        ],
        GrantStop: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请选择结束时间'))
              } else if (
                this.form.GrantStart &&
                new Date(value).getTime() <
                new Date(this.form.GrantStart).getTime()
              ) {
                callback(new Error('结束时间不能小于开始时间'))
              }
              callback()
            }
          }
        ]
      },
      pickerOptions: {
        disabledDate(date) {
          let now = new Date()
          return (
            Date.parse(date) <
            Date.parse(
              now.getFullYear() +
              '/' +
              (now.getMonth() + 1) +
              '/' +
              now.getDate()
            )
          )
        }
      }
    }
  },
  created() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
  },
  mounted() {
    var query = this.$route.query
    if (query.id) {
      this.packetId = query.id
      this.getDetail()
    }
  },
  methods: {
    getDetail() {
      PAYMENT_API_RED_PACKET_BASIC_GET({
        PacketId: this.packetId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          this.form.MaterialTypes = res.data.Data.MaterialTypes.split(',')
          this.form.TerminalTypes = res.data.Data.TerminalTypes
            ? res.data.Data.TerminalTypes.split(',')
            : ''
          this.form.TerminalTypes = this.form.TerminalTypes && this.form.TerminalTypes.map(m => parseInt(m))
          this.couponIds = res.data.Data.CouponIds
            ? res.data.Data.CouponIds.split(',')
            : ''
          if (
            res.data.Data.GrantStop == '2100/01/01 00:00:00' ||
            res.data.Data.GrantStop == '1900/01/01 00:00:00' ||
            res.data.Data.GrantStop == '1900/01/01 23:59:59'
          ) {
            this.checked = true
            this.form.GrantStop = ''
          }
          this.form.Price = this.$root.toFloat(this.form.Price)
          this.form.MinPrice = this.$root.toFloat(this.form.MinPrice)
          this.form.MaxPrice = this.$root.toFloat(this.form.MaxPrice)
          this.form.CashPrice = this.$root.toFloat(this.form.CashPrice)
          this.form.EventType = String(res.data.Data.EventType) // 触发事件(枚举, 事件点)
        }
      })
    },
    onSubmit() {
      this.$refs['timeForm'].validate(valid => {
        if (valid) {
          // 检测时间
          this.$refs['form'].validate(valid => {
            // 检测form
            if (valid) {
              if (
                this.form.EventType ==
                this.paymentRedPacketEventType.Included &&
                !this.couponIds.length
              ) {
                this.$message.error(
                  '触发事件为(参与活动)时,最少选择一项活动卡券!'
                )
                return false
              }
              this.form.CashPrice =
                this.form.CashType ===
                  this.paymentRedPacketOrderCashType.CashPrice
                  ? this.form.CashPrice
                  : 0
              var params = {
                ActivityName: this.form.ActivityName, // 活动标题
                Blessings: this.form.Blessings, // Blessings祝福语
                Qty: parseInt(this.form.Qty), // 红包发放总人数
                Price: this.$root.toInt(this.form.Price), // 红包金额
                Note: this.form.Note, // 备注
                EventType: Number(this.form.EventType), // 触发事件(枚举, 事件点)
                MaterialTypes: this.form.MaterialTypes.join(','), // 参与条件
                CashType: this.form.CashType, // 消费类型
                CashPrice: this.$root.toInt(this.form.CashPrice), // 消费金额满?
                TerminalTypes:this.form.TerminalTypes.join(','), // 事件类型(来源,枚举)
                CouponIds: this.couponIds.length
                  ? this.couponIds.join(',')
                  : '', // 优惠券序号(逗号分隔,)
                GrantStart: this.form.GrantStart, // 发放开始时间
                GrantStop: !this.checked ? this.form.GrantStop : '', // 发放结束时间
                PriceType: this.form.PriceType,
                MinPrice: this.$root.toInt(this.form.MinPrice),
                MaxPrice: this.$root.toInt(this.form.MaxPrice),
                IsSend: this.form.IsSend
              }
              this.$store.commit('SET_BTN_LOADING', true)
              var apiName = PAYMENT_API_RED_PACKET_BASIC_CREATE
              if (this.packetId) {
                apiName = PAYMENT_API_RED_PACKET_BASIC_UPDATE
                params.PacketId = parseInt(this.packetId)
              }
              apiName(params).then(res => {
                if (res.data.Code === 'CORRECT') {
                  this.$router.push('/market/redPacket/index')
                }
                this.$store.commit('SET_BTN_LOADING', false)
              })
            }
          })
        }
      })
    },
    selectionChange(rows) {
      var arr = []
      rows.forEach(res => {
        arr.push(res.CouponId)
      })
      this.couponIds = arr
    },
    getTableData() {
      console.log(this.form.EventType,this.paymentRedPacketEventType.Included,'1231')
      if (this.form.EventType != this.paymentRedPacketEventType.Included) {
        return false
      }
      SCORING_API_COUPON_BASIC_GETS({
        couponSaleType: 0,
        CheckStatus: this.couponAuditStatus.Audit,
        CouponType: 1,
        EventType: this.eventType.Included,
        Expireb: !this.checked ? this.form.GrantStart : '1900/01/01 00:00:00',
        Expiree: !this.checked ? this.form.GrantStop : '2100/01/01 00:00:00',
        PageIndex: 1,
        PageSize: 1000
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          console.log(res.data.Data.Rows)
          if (this.packetId && this.couponIds.length) {
            this.couponIds.forEach(res => {
              this.tableData.forEach((val, key) => {
                if (res === val.CouponId) {
                  setTimeout(() => {
                    this.$refs.redPacket.toggleRowSelection(this.tableData[key])
                  }, 1)
                }
              })
            })
          }
        }
      })
    },
    getTableList() {
      this.eventTypeMessage = messageList[this.form.EventType]
      if (this.form.EventType == this.paymentRedPacketEventType.Included) {
        this.getTableData()
      }
      if (this.form.EventType != this.paymentRedPacketEventType.Buy) {
        this.form.MaterialTypes = []
        this.form.CashType = 0
        this.form.CashPrice = ''
        this.form.TerminalTypes = []
      }
    },
    changePriceType() {
      this.form.Price = ''
      this.form.MinPrice = ''
      this.form.MaxPrice = ''
    },
    filterDate1 (value) {
      return value === '2100/01/01 00:00:00' || value === '2100/01/01 23:59:59'
        ? '不限结束时间'
        : this.$options.filters.filterAllDate(value)
    }
  },
  watch: {
    'form.EventType': 'getTableList',
    checked () {
      this.form.GrantStop = ''
      this.getTableList()
    },
    'form.GrantStart'() {
      this.$refs['timeForm'].validate(() => { })
    },
    'form.GrantStop'() {
      this.$refs['timeForm'].validate(() => { })
    }
  }
}
</script>

<style >
.red-input-item {
  width: 350px;
}

.red-input-item2 {
  width: 160px;
}
</style>
