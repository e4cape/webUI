<template>
  <div class="content">
    <ul class="tabs">
      <router-link
        name="linkInfo"
        class="tab"
        tag="li"
        :to="{path:'/market/coupon/salecardsonlinebasic/'+paramsId}"
      >卡券信息</router-link>
      <router-link
        name="linkSale"
        class="tab active"
        tag="li"
        to
      >卡券销售</router-link>
      <router-link
        name="linkUse"
        class="tab"
        :to="{path:'/market/coupon/salecardsonlineitem/'+paramsId}"
      >使用统计</router-link>
    </ul>
    <div
      class="p-20"
      style="border:1px #e5e5e5 solid;"
    >
      <ul class="link-tabs">
        <router-link
          name="linkOrderManage"
          tag="li"
          class="active"
          to
        >订单管理</router-link>
        <router-link
          name="linkCouponrewardstatics"
          tag="li"
          :to="{path: '/market/coupon/couponrewardstatics/'+paramsId,query: {couponSaleType:CouponSaleType.Online}}"
        >奖励统计</router-link>
      </ul>
      <el-row
        type="flex"
        :gutter="10"
        class="m-t-10"
      >
        <el-col>
          <h2 class="table-header">已成交</h2>
          <el-table
            :show-header="false"
            :data="[analysisObj]"
          >
            <el-table-column prop="OrderAmt">
              <template slot-scope="scoped">订单数：{{scoped.row.OrderAmt}}</template>
            </el-table-column>
            <el-table-column prop="OrderCouponAmt">
              <template slot-scope="scoped">卡券数：{{scoped.row.OrderCouponAmt}}</template>
            </el-table-column>
            <el-table-column prop="OrderSalePrice">
              <template slot-scope="scoped">销售额：{{$root.toFloat(scoped.row.OrderSalePrice)}}</template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col>
          <h2 class="table-header">已退款</h2>
          <el-table
            :show-header="false"
            :data="[analysisObj]"
          >
            <el-table-column prop="UnOrderAmt">
              <template slot-scope="scoped">订单数：{{scoped.row.UnOrderAmt}}</template>
            </el-table-column>
            <el-table-column prop="UnOrderCouponAmt">
              <template slot-scope="scoped">卡券数：{{scoped.row.UnOrderCouponAmt}}</template>
            </el-table-column>
            <el-table-column prop="UnOrderSalePrice">
              <template slot-scope="scoped">退款额：{{$root.toFloat(scoped.row.UnOrderSalePrice)}}</template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-form
        inline
        :model="form"
        ref="search"
        class="item-lh-26"
      >
        <el-row
          class="search-box m-t-10"
          type="flex"
        >
          <el-col class="search-form">
            <el-form-item
              name="datePickerCreateTime"
              label="销售时间"
              prop="createTime"
            >
              <el-date-picker
                v-model="createTime"
                @change="dateChange"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="$root.datePickrOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              label="销售单号"
              prop="OrderId"
            >
              <el-input
                name="inputOrderId"
                v-model="form.OrderId"
                @keyup.enter.native="onSearch"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="会员昵称"
              prop="NickName"
            >
              <el-input
                name="inputNickName"
                v-model="form.NickName"
                @keyup.enter.native="onSearch"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="姓名"
              prop="TrueName"
            >
              <el-input
                name="inputTrueName"
                v-model="form.TrueName"
                @keyup.enter.native="onSearch"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="手机"
              prop="Mobile"
            >
              <el-input
                name="inputMobile"
                v-model="form.Mobile"
                @keyup.enter.native="onSearch"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="销售人"
              prop="UserName"
            >
              <el-input
                name="inputUserName"
                v-model="form.UserName"
                @keyup.enter.native="onSearch"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="交易状态"
              prop="PayStatus"
            >
              <el-select
                name="selectPayStatus"
                v-model="form.PayStatus"
              >
                <el-option
                  :value="0"
                  label="全部"
                ></el-option>
                <template v-for="(item,key) in CouponPayStatus.Types">
                  <el-option
                    :key="key"
                    :value="parseInt(key)"
                    :label="item"
                    v-if="key != CouponPayStatus.NoPay"
                  ></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item
              label="门店："
              prop="CharacterId"
            >
              <el-select
                name="selectCharacterId"
                v-model="form.CharacterId"
                filterable
              >
                <el-option
                  label="全部"
                  :value="0"
                ></el-option>
                <el-option
                  v-for="item in storeArr"
                  :key="item.CharacterId"
                  :label="item.Value"
                  :value="item.CharacterId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="search-btn">
            <el-button
              name="btnOnSearch"
              type="primary"
              @click="onSearch"
            >搜索</el-button>
            <el-button
              name="btnOnReset"
              type="default"
              @click="onReset"
            >重置</el-button>
            <el-button
              name="btnExportData"
              type="info"
              @click="exportData"
            >导出Excel</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="tableData"
        class="m-t-10"
        v-loading="$store.getters.tb_loading"
      >
        <el-table-column
          prop="CreateTime"
          label="销售时间"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
        </el-table-column>
        <el-table-column
          prop="OrderId"
          label="销售单号"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="SalePrice"
          label="售价"
          :formatter="formatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="Amt"
          label="数量"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="Price"
          label="金额"
          :formatter="formatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="NickName"
          label="会员昵称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="TrueName"
          label="姓名"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="Mobile"
          label="手机"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="ItemIds"
          label="卡券编号"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column prop="SaleCode" label="销售代码"></el-table-column> -->
        <el-table-column
          prop="UserName"
          label="销售人"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="StoreName"
          label="门店"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="PayStatus"
          label="交易状态"
          :formatter="formatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-button
              type="text"
              v-if="scoped.row.SourceType != CouponOrderSourceType.Spread && scoped.row.PayStatus==CouponPayStatus.Pay&&characterType!=CharacterType.Lingcb"
              @click="showRefundForm(scoped.row)"
            >退款</el-button>
            <el-button
              type="text"
              v-if="scoped.row.PayStatus==CouponPayStatus.Refund"
              @click="showreFundDetail(scoped.row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :pg="form.PageIndex"
        :size="form.PageSize"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      ></pagination>
    </div>
    <!-- 退款对话框 -->
    <el-dialog
      title="退款"
      :visible.sync="refundVisible"
      width="430px"
      @close="resetRefundForm"
    >
      <el-form
        label-width="100px"
        :model="refundForm"
        ref="refundForm"
        :rules="rules"
        class="fix-w"
      >
        <el-form-item
          label="退款原因："
          prop="CheckNote"
        >
          <el-input
            name="inputCheckNote"
            type="textarea"
            v-model="refundForm.CheckNote"
            placeholder="退款原因"
          ></el-input>
        </el-form-item>
        <el-form-item label="应退金额：">{{refundForm.AwaitPrice}}</el-form-item>
        <el-form-item
          label="实退金额："
          prop="ReturnPrice"
        >
          <el-input
            name="inputReturnPrice"
            v-model="refundForm.ReturnPrice"
            placeholder="实退金额"
            @change="editReturnPrice"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="退款方式："
          prop="PaymentType"
        >
          <el-select
            name="selectPaymentType"
            v-model="refundForm.PaymentType"
          >
            <el-option
              v-for="(item,key) in PaymentType.Types"
              :key="key"
              :value="key"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="支付备注："
          prop="PaymentNote"
        >
          <el-input
            name="inputPaymentNote"
            type="textarea"
            v-model="refundForm.PaymentNote"
            placeholder="请输入退款流水号等"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          name="btnOnRefund"
          type="primary"
          @click="onRefund"
        >确定</el-button>
        <el-button
          name="btnRefundVisible"
          type="default"
          @click="refundVisible = false"
        >取消</el-button>
      </div>
    </el-dialog>
    <!-- 退货详情 -->
    <el-dialog
      title="退款详情"
      :visible.sync="refundDetailVisible"
      width="430px"
    >
      <table class="table">
        <tr>
          <td>退款原因</td>
          <td class="much-text">{{refundDetail.CheckNote}}</td>
        </tr>
        <tr>
          <td>应退金额</td>
          <td>{{$root.toFloat(refundDetail.AwaitPrice)}}</td>
        </tr>
        <tr>
          <td>实退金额</td>
          <td>{{$root.toFloat(refundDetail.ReturnPrice)}}</td>
        </tr>
        <tr>
          <td>退款方式</td>
          <td>{{PaymentType.Types[refundDetail.PaymentType]}}</td>
        </tr>
        <tr>
          <td>支付备注</td>
          <td class="much-text">{{refundDetail.PaymentNote}}</td>
        </tr>
      </table>
      <div slot="footer">
        <el-button
          name="btnRefundDetailVisible"
          type="primary"
          @click="refundDetailVisible=false"
        >关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import {
  SCORING_API_COUPON_ORDER_ORDERLISTEXPORT, // 订单管理(电子-导出)
  SCORING_API_COUPON_ORDER_GETS, // 卡券销售 - 检索
  SCORING_API_COUPON_ORDER_GETANALYSIS, // 卡券销售 - 统计
  SCORING_API_COUPON_ORDER_REFUND // 卡券销售 - 卡券退款
} from '@/apis/scoring'

import { CharacterType, YNStatus } from '@/enums/common'
import {
  CouponPayStatus,
  CouponSaleType,
  CouponOrderSourceType
} from '@/enums/scoring'
import { PaymentType } from '@/enums/marketing'

import pagination from '@/components/pagination.vue'

import { twoDecNumValid } from '@/rules/formValidate'
export default {
  data() {
    return {
      storeArr: [],
      analysisObj: {},
      CouponOrderSourceType,
      CouponSaleType,
      path: this.$route.path.split('/')[3],
      CouponPayStatus,
      PaymentType,
      CharacterType,
      form: {
        PayStatus: 0,
        CouponId: this.$route.params.id.split('&')[0],
        CreateTime1: '',
        CreateTime2: '',
        OrderId: '',
        NickName: '',
        TrueName: '',
        Mobile: '',
        UserName: '',
        CharacterId: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      refundForm: {
        OrderId: '',
        AwaitPrice: '',
        ReturnPrice: '',
        PaymentType: '',
        PaymentNote: '',
        CheckNote: ''
      },
      refundDetail: {},
      total: 0,
      parameter: {},
      createTime: [],
      tableData: [],
      refundVisible: false,
      refundDetailVisible: false,
      rules: {
        PaymentType: [
          {
            required: true,
            message: '退款方式不能为空！'
          }
        ],
        CheckNote: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            max: 50,
            message: '最多可以输入50个字！'
          }
        ],
        PaymentNote: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            max: 50,
            message: '最多可以输入50个字！'
          }
        ],
        ReturnPrice: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            validator: twoDecNumValid
          }
        ]
      }
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    paramsId() {
      return this.$route.params.id.split('&')[0]
    },
    companyId() {
      return this.$route.params.id&&this.$route.params.id.split('&')[1]
    }
  },
  async beforeMount() {
    const companyArr = await this.$store.dispatch('GET_COMPANYS_DROPLIST', {
      HasStore: 3,
      State: 0
    })
    if (companyArr && companyArr.length > 0) {
      const arr =
        companyArr.filter(item => item.CharacterId == this.companyId) || []
      this.storeArr = arr[0] ? arr[0].Childrens : []
    }
  },
  methods: {
    // 卡券销售统计-订单管理统计
    getAnalysis() {
      SCORING_API_COUPON_ORDER_GETANALYSIS({
        CouponId: this.paramsId
        // CouponId: 'c18112915130713581'
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.analysisObj = res.data.Data
        }
      })
    },
    exportData() {
      this.form = Object.assign(this.form, this.parameter)
      SCORING_API_COUPON_ORDER_ORDERLISTEXPORT(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(res.data.Data.FilePath, '_blank')
        }
      })
    },
    formatter(row, column, value) {
      switch (column.property) {
        case 'Price':
          return `￥${this.$root.toFloat(row.Amt * row.SalePrice)}`
        case 'SalePrice':
          return `￥${this.$root.toFloat(value)}`
        /*  case 'CreateTime':
          return value.substr(0, 4) === '1900'
            ? '-'
            : dayjs(new Date(value)).format('YYYY-MM-DD HH:mm:ss') */
        case 'PayStatus':
          return CouponPayStatus.Types[value]
        default:
      }
    },
    dateChange(value) {
      if (value && value.length > 0) {
        this.form.CreateTime1 = dayjs(value[0]).format('YYYY-MM-DD')
        this.form.CreateTime2 = dayjs(value[1]).format('YYYY-MM-DD')
      } else {
        this.form.CreateTime1 = ''
        this.form.CreateTime2 = ''
      }
    },
    initRoute() {
      this.$router.replace({
        path: this.$route.path,
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.PayStatus = parseInt(query.PayStatus) || 0
      this.parameter.OrderId = query.OrderId || ''
      this.parameter.NickName = query.NickName || ''
      this.parameter.TrueName = query.TrueName || ''
      this.parameter.Mobile = query.Mobile || ''
      this.parameter.UserName = query.UserName || ''
      this.parameter.CreateTime1 = query.CreateTime1 || ''
      this.parameter.CreateTime2 = query.CreateTime2 || ''
      this.createTime = query.CreateTime1
        ? [query.CreateTime1, query.CreateTime2]
        : []
      this.parameter.CharacterId = parseInt(query.CharacterId) || 0
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      SCORING_API_COUPON_ORDER_GETS(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs.search.resetFields()
      this.createTime = []
      this.form.CreateTime1 = ''
      this.form.CreateTime2 = ''
      this.onSearch()
    },
    onRefund() {
      this.$refs['refundForm'].validate(valid => {
        if (valid) {
          const { PaymentType, AwaitPrice, ReturnPrice } = this.refundForm
          SCORING_API_COUPON_ORDER_REFUND(
            Object.assign({}, this.refundForm, {
              PaymentType: +PaymentType,
              AwaitPrice: this.$root.toInt(AwaitPrice),
              ReturnPrice: this.$root.toInt(ReturnPrice)
            })
          ).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$message.success('退款成功！')
              this.getData()
            }
            this.refundVisible = false
          })
        }
      })
    },
    showRefundForm(row) {
      this.refundVisible = true
      this.refundForm.AwaitPrice = this.$root.toFloat(row.SalePrice * row.Amt)
      this.refundForm.OrderId = row.OrderId
      this.refundForm.ReturnPrice = this.$root.toFloat(row.SalePrice * row.Amt)
      this.refundForm.PaymentType = ''
      this.refundForm.PaymentNote = row.PaymentNote
    },
    resetRefundForm() {
      this.$refs.refundForm.resetFields()
    },
    editReturnPrice(val) {
      if (parseInt(val * 100) > parseInt(this.refundForm.AwaitPrice * 100)) {
        this.refundForm.ReturnPrice = ''
        this.$message.warning('实退金额不能大于应退金额！')
      }
    },
    showreFundDetail(row) {
      this.refundDetailVisible = true
      this.refundDetail = row
    }
  },
  mounted() {
    this.getAnalysis()
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination
  }
}
</script>
<style scoped lang="scss">
@import 'compass/css3';

.link-tabs {
  border-bottom: 1px #ddd solid;

  li {
    position: relative;
    cursor: pointer;
    @include display-flex(inline-flex);

    padding: 10px 15px;

    &:after {
      font-size: 0;
      content: '';
      display: none;
      height: 2px;
      width: 100%;
      line-height: 0;
      position: absolute;
      background: #399fe5;
      bottom: -1px;
      left: 0;
    }

    &.active {
      color: #399fe5;

      &:after {
        display: block;
      }
    }
  }
}

.table-header {
  color: #333;
  background: #f5f5f5;
  padding: 10px;
  border-top: 1px #e5e5e5 solid;
  font-weight: normal;
}

.table {
  font-size: 12px;
  tr {
    td {
      border-bottom: 1px #e5e5e5 solid;
      padding: 10px;
      white-space: nowrap;
      &.much-text {
        word-break: break-all;
        white-space: normal;
      }
    }
  }
}
.search-btn {
  width: 254px !important;
}
.search-form {
  width: 1%;
  flex: 1;
}
</style>
