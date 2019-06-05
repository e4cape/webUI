<template>
  <div class="cre-sto">
    <h2
      v-if="!isStore"
      class="search-title"
    >添加商户消息模板</h2>
    <h2
      v-else
      class="search-title"
    >添加门店消息模板</h2>
    <div class="border-1px p-20">
      <el-form
        class="fix-w"
        label-width="120px"
        :model="form"
        :rules="rules"
        ref="form"
      >
        <el-form-item
          label="角色序号："
          prop="CharacterId"
          v-if="isStore"
        >
          <el-input
            name="CharacterId"
            disabled
            v-model="form.CharacterId"
          ></el-input>
          <el-button
            v-if="!$route.query.CharacterId"
            type="primary"
            @click="getStoreList"
          >门店查询</el-button>
        </el-form-item>
        <el-form-item
          label="门店名称："
          v-if="isStore"
          prop="StoreTitle"
        >
          <el-input
            name="StoreTitle"
            disabled
            v-model="form.StoreTitle"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色序号："
          v-if="!isStore"
          prop="CharacterId"
        >
          <el-input
            name="CharacterId"
            disabled
            v-model="form.CharacterId"
          ></el-input>
          <el-button
            v-if="!$route.query.CharacterId"
            type="primary"
            @click="getCompanyList"
          >商户查询</el-button>
        </el-form-item>
        <el-form-item
          label="商户名称："
          v-if="!isStore"
          prop="CompanyTitle"
        >
          <el-input
            name="CompanyTitle"
            disabled
            v-model="form.CompanyTitle"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="微信模板ID："
          prop="TemplateNO"
        >
          <el-input
            name="TemplateNO"
            v-model="form.TemplateNO"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="模板类型："
          prop="TemplateType"
        >
          <el-select
            name="TemplateType"
            v-model="form.TemplateType"
            @change="exchangeTemplateType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in TemplateTypeOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="模板内容："
          prop="TemplateNote"
        >
          <el-input
            name="TemplateNote"
            type="textarea"
            disabled
            v-model="form.TemplateNote"
            class="w-238"
            :autosize="{ minRows: 8}"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="form.TemplateType !== WxTemplateType.Overdue && form.TemplateType !== WxTemplateType.Consumption && form.TemplateType !== WxTemplateType.MemberCard && form.TemplateType != WxTemplateType.MemberGradeChange"
          label="发送设置："
          prop="SendType"
        >
          <el-select
            name="SendType"
            v-model="form.SendType"
            @change="changeSendType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in WxSendTypeOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="form.TemplateType === WxTemplateType.Consumption || form.TemplateType === WxTemplateType.MemberCard || form.TemplateType === WxTemplateType.MemberGradeChange"
          label="发送设置："
          prop="SendType"
        >
          <span>即时发送</span>
        </el-form-item>
        <el-form-item
          v-if="form.SendType === WxSendType.Timing && form.TemplateType !== WxTemplateType.Overdue"
          label="发送时间"
          prop="SendTime"
          key="SendTime"
        >
          <el-date-picker
            name="SendTime"
            v-model="form.SendTime"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          >></el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="form.SendType === WxSendType.Regular"
          class="items-send"
          key="SubmitDay"
        >
          <span>消费单提交后</span>
          <el-form-item
            prop="SubmitDay"
            class="mb0"
          >
            <el-input
              name="SubmitDay"
              class="w-80"
              v-model="form.SubmitDay"
            ></el-input>
          </el-form-item>
          <span>天发送，下次发送间隔</span>
          <el-form-item
            prop="IntervalDay"
            class="mb0"
          >
            <el-input
              name="IntervalDay"
              class="w-80"
              v-model="form.IntervalDay"
            ></el-input>
          </el-form-item>
          <span>天。</span>
          <span v-if="form.TemplateType == WxTemplateType.Gains">收益提醒间隔不能小于7天</span>
          <span v-if="form.TemplateType == WxTemplateType.Maintenance">保养提醒间隔不能小于60天</span>
        </el-form-item>
        <el-form-item>
          <el-button
            name="formSave"
            :loadding="$store.getters.is_loading"
            type="primary"
            @click="formSubmit('form')"
          >保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      :title="isStore?'门店查询':'商户查询：'"
      :visible.sync="dialogFormVisible"
      width="80%"
    >
      <div class="p-x-10 p-t-10 search-box border-bottom-none">
        <el-form
          :inline="true"
          ref="formInline"
          :model="formInline"
          @keyup.enter.native="isStore?getStoreList(true):getCompanyList(true)"
          class="demo-form-inline"
        >
          <el-form-item
            v-if="isStore"
            label="门店编号："
          >
            <el-input
              name="StoreCode"
              v-model="formInline.StoreCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-else
            label="商户编号："
          >
            <el-input
              name="CompanyCode"
              v-model="formInline.CompanyCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="isStore"
            label="门店名称："
          >
            <el-input
              name="StoreName"
              v-model="formInline.StoreName"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-else
            label="商户名称："
          >
            <el-input
              name="CompanyName"
              v-model="formInline.CompanyName"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input
              name="Contact"
              v-model="formInline.Contact"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机：">
            <el-input
              name="Phone"
              v-model="formInline.Phone"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              name="getStoreListSearch"
              v-if="isStore"
              type="primary"
              @click="getStoreList(true)"
            >搜索</el-button>
            <el-button
              name="getCompanyListSearch"
              v-else
              type="primary"
              @click="getCompanyList(true)"
            >搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        class="m-t-10"
        :data="tableData"
        :loadding="$store.getters.tb_loading"
      >
        <el-table-column
          prop="CharacterId"
          label="ID"
        ></el-table-column>
        <!-- <el-table-column v-else prop="CompanyId" label="ID"></el-table-column> -->
        <el-table-column
          prop="StoreCode"
          v-if="isStore"
          label="门店编号"
        ></el-table-column>
        <el-table-column
          prop="CompanyCode"
          v-else
          label="商户编号"
        ></el-table-column>
        <el-table-column
          prop="StoreName"
          v-if="isStore"
          label="门店名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="CompanyName"
          v-else
          label="商户名称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="Contact"
          label="联系人"
        ></el-table-column>
        <el-table-column
          prop="Phone"
          label="手机号码"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="Address"
          v-if="isStore"
          label="联系地址"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="Address"
          v-else
          label="联系地址"
        ></el-table-column>
        <el-table-column
          :formatter="formatter"
          prop="State"
          label="账户状态"
        ></el-table-column>
        <el-table-column
          prop="OpenTime"
          :formatter="formatter"
          v-if="isStore"
          label="开店日期"
        ></el-table-column>
        <el-table-column
          prop="CreateTime"
          :formatter="formatter"
          v-else
          label="创建时间"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button
              name="addShopping"
              type="text"
              class="table-tool"
              @click="addShopping(scoped.row)"
            >添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :pg="page.PageIndex"
        :size="page.PageSize"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      ></pagination>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import {
  MARKETING_API_WEB_CHAT_CREATECOMPANYTEMPLATE, //  微信管理 - 总部模版(创建)
  MARKETING_API_WEB_CHAT_CREATESTORETEMPLATE // 微信管理 - 门店消息模版(创建)
} from '@/apis/marketing.js'

import { EnableState, YNStatus } from '@/enums/common.js'
import {
  WxTemplateType,
  WxSendType,
  WxAuthorizerType
} from '@/enums/component.js'

import {
  MERCHANT_API_STORE_BASIC_GETS, // 门店基本资料 - 检索
  // MERCHANT_API_COMPANY_LIST,
  MERCHANT_API_COMPANY_BASIC_GETS //  商户服务 - 检索
} from '@/apis/merchant.js'

import pagination from '@/components/pagination.vue'
export default {
  components: {
    pagination
  },
  data() {
    return {
      form: {
        CharacterId: '',
        StoreTitle: '',
        CompanyTitle: '',
        AuthorizerType: '',
        TemplateNO: '',
        // TemplateType: WxTemplateType.Gains,
        TemplateType: 1,
        TemplateNote:
          '亲爱的会员，您当前可用换购总额为｛换购总额｝元，可直接进行珠宝换购抵扣，赶快来店换购吧！\n' +
          '订单号：｛消费单号｝\n' +
          '订单金额：｛商品金额｝\n' +
          '收益金额：｛当前可用金额 }\n' +
          '时间：｛当前时间 }\n',
        SendType: WxSendType.Timing,
        SendTime: '',
        SubmitDay: '',
        IntervalDay: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      parameter: {},
      isStore: false,
      WxSendType,
      WxTemplateType,
      WxAuthorizerType,
      rules: {
        CharacterId: [
          {
            required: true,
            message: '不能为空！'
          }
        ],
        StoreTitle: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符'
          }
        ],
        CompanyTitle: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符'
          }
        ],
        TemplateNO: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符'
          }
        ],
        TemplateType: [
          {
            required: true,
            message: '不能为空！'
          }
        ],
        SendType: [
          {
            required: true,
            message: '不能为空！'
          }
        ],
        SendTime: [
          {
            required: true,
            message: '不能为空！'
          }
        ],
        SubmitDay: [
          {
            required: true,
            message: '不能为空！',
            trigger: 'blur'
          },
          {
            validator: this.validator
          }
        ],
        IntervalDay: [
          {
            required: true,
            message: '不能为空！',
            trigger: 'blur'
          },
          {
            validator: this.validator1
          }
        ]
      },
      formInline: {
        IsAsced: YNStatus.No
      },
      page: {
        PageIndex: 1,
        PageSize: 20
      },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      addTemplate: true,
      settingSend: '',
      WxSendTypeOpts: [],
      WxSendTypeOpt: [],
      TemplateTypeOpt: [],
      SendTime: ''
    }
  },
  created() {
    this.isStore = this.$route.query.isStore == 'false' ? false : true
    if (this.isStore) {
      this.form.CharacterId = this.$route.query.CharacterId
      this.form.StoreTitle = this.$route.query.StoreTitle
    } else {
      this.form.CharacterId = this.$route.query.CharacterId
      this.form.CompanyTitle = this.$route.query.CompanyTitle
    }
  },
  mounted() {
    this.getEnums()
    /*     console.log(123)
    console.log(this.$store.getters) */
  },
  methods: {
    formatter() {
      let tpr
      switch (arguments[1].property) {
        case 'OpenTime':
          tpr = dayjs(new Date(arguments[2])).format('YYYY-MM-DD')
          break
        case 'CreateTime':
          tpr = dayjs(new Date(arguments[2])).format('YYYY-MM-DD')
          break
        default:
          tpr = EnableState.Types[arguments[2]]
          break
      }
      return tpr
    },
    getEnums() {
      for (let item in WxTemplateType.Types) {
        this.TemplateTypeOpt.push({
          label: WxTemplateType.Types[item],
          value: parseInt(item)
        })
      }
      for (let item in WxSendType.Types) {
        if (item != WxSendType.Immediately) {
          this.WxSendTypeOpts.push({
            label: WxSendType.Types[item],
            value: parseInt(item)
          })
        }
      }
      this.WxSendTypeOpt = [
        {
          label: WxSendType.Types[WxSendType.Immediately],
          value: WxSendType.Immediately
        }
      ]
    },
    handleClose() {},
    validator(rule, value, callback) {
      if (!this.intFloatTest(value)) {
        callback(new Error('请正确输入！'))
      } else {
        callback()
      }
    },
    validator1(rule, value, callback) {
      if (!this.intFloatTest(value)) {
        callback(new Error('请正确输入！'))
      } else if (this.form.SendType == this.WxSendType.Regular) {
        if (this.form.TemplateType == this.WxTemplateType.Gains) {
          if (value < 7) {
            callback(new Error('请正确输入！'))
          } else {
            callback()
          }
        }
        if (this.form.TemplateType == WxTemplateType.Maintenance) {
          if (value < 60) {
            callback(new Error('请正确输入！'))
          } else {
            callback()
          }
        }
        callback()
      }
    },
    intFloatTest(num) {
      const reg = /^(?!(0[0-9]$))[+]?[1-9]{1}[0-9]{0,8}$/g
      return reg.test(num)
    },
    formSubmit(formName) {
      this.$store.commit('SET_BTN_LOADING', true)
      let func
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { SubmitDay, CharacterId, IntervalDay } = this.form
          if (!this.isStore) {
            func = MARKETING_API_WEB_CHAT_CREATECOMPANYTEMPLATE(
              Object.assign({}, this.form, {
                AuthorizerType: +this.WxAuthorizerType.Compony,
                SubmitDay: +SubmitDay,
                CharacterId: +CharacterId,
                IntervalDay: +IntervalDay
              })
            )
          } else if (this.$route.query.CharacterId) {
            func = MARKETING_API_WEB_CHAT_CREATESTORETEMPLATE(
              Object.assign({}, this.form, {
                AuthorizerType: +this.WxAuthorizerType.Store,
                SubmitDay: +SubmitDay,
                wechatSettingType: 1,
                CharacterId: +CharacterId,
                IntervalDay: +IntervalDay
              })
            )
          } else {
            func = MARKETING_API_WEB_CHAT_CREATESTORETEMPLATE(
              Object.assign({}, this.form, {
                AuthorizerType: +this.WxAuthorizerType.Store,
                SubmitDay: +SubmitDay,
                wechatSettingType: 1,
                CharacterId: +CharacterId,
                IntervalDay: +IntervalDay
              })
            )
          }
          func.then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$message.success('保存成功！')
              this.$router.push(
                `/setter/wxpublic/wxtemplatelist?isStore=${this.isStore}`
              )
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    },
    addShopping(row) {
      if (!this.isStore) {
        this.form.CharacterId = row.CharacterId
        this.form.CompanyTitle = row.CompanyName
      } else {
        this.form.CharacterId = row.CharacterId
        this.form.StoreTitle = row.StoreName
      }

      this.dialogFormVisible = false
    },
    exchangeTemplateType(val) {
      switch (val) {
        case WxTemplateType.Gains:
          this.form.TemplateNote =
            '亲爱的会员，您当前可用换购总额为｛换购总额｝元，可直接进行珠宝换购抵扣，赶快来店换购吧！\n' +
            '订单号：｛消费单号｝\n' +
            '订单金额：｛商品金额｝\n' +
            '收益金额：｛当前可用金额 }\n' +
            '时间：｛当前时间 }\n'
          this.form.SendType = WxSendType.Timing
          break
        case WxTemplateType.Consumption:
          this.form.TemplateNote =
            '亲爱的会员，您在本店消费成功，您提交的消费单可获｛应赠送金｝赠送金！\n' +
            '订单号：｛消费单号｝\n' +
            '消费商品：｛商品名称｝\n' +
            '消费金额：｛商品金额｝\n' +
            '付款方式：｛付款方式｝\n' +
            '消费时间：｛消费单日期｝\n'
          this.form.SendType = WxSendType.Immediately
          break
        case WxTemplateType.Maintenance:
          this.form.TemplateNote =
            '亲爱的会员，您购买的｛商品名称｝已到保养期，请携相关单据到店可享受免费清洗或其它返修服务。\n' +
            '会员姓名：｛会员姓名｝*可为空\n' +
            '上次保养时间：｛上次保养时间｝\n' +
            '到期时间：｛到期保养时间｝\n'
          this.form.SendType = WxSendType.Timing
          break
        case WxTemplateType.Overdue:
          this.form.TemplateNote =
            '亲爱的会员，您的卡券即将到期失效，请尽快返店使用。人生该节约的，我们都不要浪费！\n' +
            '商户：{{门店名称}}\n' +
            '会员卡：{{卡券标题}}\n' +
            '余额：{{卡券金额}}\n' +
            '到期时间：{{到期时间}}'
          this.form.SendType = WxSendType.Immediately
          break
        case WxTemplateType.MemberCard:
          this.form.TemplateNote =
            '领取微信会员卡成功\n' +
            '{{当前时间}}\n' +
            '你已成功领取门店名称会员卡，点击查看详情！\n' +
            '会员卡号：{{会员卡号}} \n' +
            '会员等级：{{会员等级}} \n' +
            '积分余额：{{积分余额}} \n' +
            '使用渠道：{{公众号昵称}} \n' +
            '进入微信【我】>【卡包】查看领取的会员卡，还有优惠活动等您来.'
          this.form.SendType = WxSendType.Immediately
          break
        default:
          this.form.TemplateNote =
            '微信会员变更通知\n' +
            '{{当前时间}}\n' +
            '当前会员级别：{{当前会员级别}} \n' +
            '升级时间：{{升级时间}} \n'
          this.form.SendType = WxSendType.Immediately
          break
      }
    },
    changeSendType() {
      if (this.form.SendType == this.WxSendType.Regular) {
        if (this.form.TemplateType == WxTemplateType.Gains) {
          // 收益提醒下定期发送间隔默认7天
          this.form.IntervalDay = 7
        } else if (this.form.TemplateType == WxTemplateType.Maintenance) {
          // 保养提醒下定期发送间隔默认60天
          this.form.IntervalDay = 60
        }
      }
    },
    sizeChange(value) {
      // 切换每页显示数
      this.page.PageSize = value
      this.page.PageIndex = 1
      if (this.isStore) {
        this.getStoreList()
      } else {
        this.getCompanyList()
      }
    },
    currentChange(value) {
      // 切换当前页
      this.page.PageIndex = value
      if (this.isStore) {
        this.getStoreList()
      } else {
        this.getCompanyList()
      }
    },
    getStoreList(flag) {
      let obj, page
      if (!flag) {
        page = this.page
        obj = Object.assign(
          {},
          {
            OpenTime1: '',
            OpenTime2: '',
            MountWechat: YNStatus.Yes
          },
          this.formInline,
          page
        )
      } else {
        this.page = {
          PageIndex: 1,
          PageSize: 20
        }
        page = {
          PageIndex: 1,
          PageSize: 20
        }
        obj = Object.assign(
          {},
          {
            OpenTime1: '',
            OpenTime2: '',
            MountWechat: YNStatus.Yes
          },
          this.formInline,
          page
        )
      }
      this.dialogFormVisible = true
      // this.isStore = true
      this.$store.commit('SET_TB_LOADING', true)
      // const obj = Object.assign({}, this.formInline, this.page)
      MERCHANT_API_STORE_BASIC_GETS(obj).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    getCompanyList(flag) {
      if (flag) {
        this.page.PageIndex = 1
        this.page.PageSize = 20
      }
      this.dialogFormVisible = true
      // this.isStore = false
      const obj = Object.assign(
        {},
        this.formInline,
        {
          MountWechat: YNStatus.No
        },
        this.page
      )
      this.$store.commit('SET_TB_LOADING', true)
      MERCHANT_API_COMPANY_BASIC_GETS(obj).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    }
  },
  watch: {
    dialogFormVisible: function() {
      if (!this.dialogFormVisible) {
        this.formInline = {}
        this.tableData = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.m-l-120 {
  margin-left: 120px;
}

.cre-sto .el-dialog__title {
  font-size: 14px;
  color: #333333;
}

.items-send {
  height: 40px;
}
.w-238 {
  width: 238px;
}
.w-80 {
  width: 80px !important;
}

.mb0 {
  display: inline-block;
}
.search-title {
  font-size: 14px;
  color: #777777;
  background: #f5f5f5;
  margin: 0;
  padding: 10px 0 10px 30px;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}
</style>