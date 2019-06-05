<template>
  <div class="content">
    <el-form
      :model="form"
      ref="search"
      lable-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @exChangeState="exChangeState"
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="btnBox">
          <el-form-item v-if="characterType == CharacterType.Company || wechatSettingType == CompanyBasicWechatSettingType.Store">
            <el-button
              name="btnAdd"
              v-if="$route.path!=='/market/coupon/salecardslist'"
              type="primary"
              @click="add"
            >新建卡券</el-button>
            <el-button
              name="btnSalecardsCreate"
              v-if="$route.path=='/market/coupon/salecardslist'"
              type="primary"
              @click="$router.push('/market/coupon/salecardsCreate/1')"
            >添加电子可售卡券</el-button>
            <el-button
              name="btnSalecardsCreates"
              v-if="$route.path=='/market/coupon/salecardslist'"
              type="default"
              @click="$router.push('/market/coupon/salecardsCreate/2')"
            >添加纸质可售卡券</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="CheckStatus">
            <el-select
              name="selectCheckStatus"
              v-model="form.CheckStatus"
              @change="onSearch"
              placeholder="请选择审核状态"
            >
              <el-option
                v-for="item in CheckStatusOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CouponId">
            <el-input
              name="inputCouponId"
              v-model="form.CouponId"
              @keyup.enter.native="onSearch"
              placeholder="卡券ID"
              @keyup.enter="onSearch"
            >
              <el-button
                name="btnOnSearch"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            name="datePickerCreateTime"
            :label="$route.path=='/market/coupon/salecardslist'||$route.params.id==3?'销售时间':'投放时间'"
            prop="CreateTime"
          >
            <el-date-picker
              v-model="form.CreateTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickrOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="卡券ID："
            prop="CouponId"
          >
            <el-input
              name="inputCouponIds"
              v-model="form.CouponId"
              placeholder="卡券ID"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="卡券名称："
            prop="CouponName"
          >
            <el-input
              name="inputCouponName"
              v-model="form.CouponName"
              placeholder="卡券名称"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="类型："
            prop="CouponSaleType"
            v-if="$route.path=='/market/coupon/salecardslist'||$route.params.id==3"
          >
            <el-select
              name="selectCouponSaleType"
              v-model="form.CouponSaleType"
            >
              <el-option
                label="全部"
                :value="0"
              ></el-option>
              <el-option
                v-for="(item, key) in CouponSaleType.Types"
                :key="key"
                :label="item"
                :value="parseInt(key)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="赠送规则："
            prop="EventType"
            v-if="$route.path=='/market/coupon/index'"
          >
            <el-select
              name="selectEventType"
              v-model="form.EventType"
              placeholder="请选择赠送规则"
            >
              <el-option
                v-for="item in EventTypeOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$route.path=='/market/coupon/salecardslist'||$route.params.id==3?'销售状态':'投放状态'"
            prop="CouponStatus"
          >
            <el-select
              name="selectCouponStatus"
              v-model="form.CouponStatus"
              placeholder="请选择投放状态"
            >
              <el-option
                v-for="item in CouponStatusOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="审核状态："
            prop="CheckStatus"
          >
            <el-select
              name="selectCheckStatuss"
              v-model="form.CheckStatus"
              placeholder="请选择审核状态"
            >
              <el-option
                v-for="item in CheckStatusOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <div class="tool clearfix">
      <span class="text-type">
        <span class="text-type-h">操作流程：</span>
        <span class="grade-n">1</span>&nbsp; 新建卡券
        <span class="grade-n">2</span>&nbsp; 审核卡券
        <span class="grade-n">3</span>&nbsp; 审核通过
        <span class="grade-n">4</span>&nbsp; 投放卡券
      </span>
    </div>
    <el-table
      :data="tableData"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="卡券ID"
        prop="CouponId"
        show-overflow-tooltip
        min-width="150"
        fixed="left"
      ></el-table-column>
      <el-table-column
        label="卡券名称"
        prop="CouponName"
        min-width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        :formatter="formatter"
        label="卡券类型"
        prop="CouponType"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="数量"
        prop="GiveAmt"
        :formatter="formatter"
        v-if="$route.path=='/market/coupon/salecardslist'||$route.params.id==3"
        min-width="100"
        show-overflow-tooltip
        key="GiveAmt"
      ></el-table-column>
      <el-table-column
        label="卡券面额"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scoped">
          <el-button
            name="btnOnCheck"
            type="text"
            v-if="scoped.row.CouponType==CouponSettingType.Voucher&&scoped.row.IsHistory == YNStatus.No"
            @click="onCheck(scoped.row.CouponId)"
          >查看</el-button>
          <span v-else-if="scoped.row.CouponType==CouponSettingType.Sale">{{$root.toFloat(scoped.row.Price)}}</span>
          <span v-else>{{GivePriceType.Types[scoped.row.GivePriceType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$route.path!=='/market/coupon/salecardslist'&&$route.params.id!=3"
        label="赠送规则"
        min-width="150"
        show-overflow-tooltip
        key="gz"
      >
        <template slot-scope="scoped">{{scoped.row.CouponType == CouponSettingType.Voucher ? '购买指定材质达指定金额自动赠送' : EventType.Types[scoped.row.EventType]}}</template>
      </el-table-column>
      <el-table-column
        label="销售价"
        prop="SalePrice"
        v-if="$route.path=='/market/coupon/salecardslist'||$route.params.id==3"
        :formatter="formatter"
        min-width="100"
        show-overflow-tooltip
        key="SalePrice"
      ></el-table-column>
      <el-table-column
        label="有效期"
        min-width="160"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.ExpireType == ExpireType.Designated ? $options.filters.filterDate(scope.row.Expireb)+'至'+ (scope.row.ExpireStop.substring(0,4)=='2100' ? '长期' : $options.filters.filterDate(scope.row.ExpireStop)): scope.row.ExpireDays+ '天' }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$route.path=='/market/coupon/salecardslist'||$route.params.id==3?'销售时间':'投放时间'"
        min-width="160"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{$options.filters.filterDate(scope.row.Expireb)+'至'+ (scope.row.Expiree.substring(0,4)=='2100'? '长期': $options.filters.filterDate(scope.row.Expiree))}}
        </template>
      </el-table-column>
      <el-table-column
        :label="$route.path=='/market/coupon/salecardslist'||$route.params.id==3?'可售数量':'投放数量'"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.GiveAmt == 0?'不限':$route.path=='/market/coupon/salecardslist'?scope.row.GiveAmt-scope.row.PickedAmt:scope.row.GiveAmt}}</template>
      </el-table-column>
      <el-table-column
        :label="$route.path=='/market/coupon/salecardslist'||$route.params.id==3?'已售数量':'已赠送数'"
        prop="PickedAmt"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="已使用数"
        prop="UsedAmt"
        v-if="$route.path!='/market/coupon/salecardslist'&&$route.params.id!=3"
        min-width="100"
        show-overflow-tooltip
        key="UsedAmt"
      ></el-table-column>
      <el-table-column
        label="未使用数"
        v-if="$route.path!='/market/coupon/salecardslist'&&$route.params.id!=3"
        min-width="100"
        show-overflow-tooltip
        key="unUsedAmt"
      >
        <template slot-scope="scope">{{scope.row.PickedAmt-scope.row.UsedAmt-scope.row.LockedAmt-scope.row.OverAmt}}</template>
      </el-table-column>
      <el-table-column
        label="已锁定数"
        prop="LockedAmt"
        v-if="$route.path!='/market/coupon/salecardslist'&&$route.params.id!=3"
        min-width="100"
        show-overflow-tooltip
        key="LockedAmt"
      ></el-table-column>
      <el-table-column
        label="已过期数"
        prop="OverAmt"
        v-if="$route.path!='/market/coupon/salecardslist'&&$route.params.id!=3"
        min-width="100"
        show-overflow-tooltip
        key="OverAmt"
      ></el-table-column>
      <el-table-column
        :formatter="formatter"
        :label="$route.path=='/market/coupon/salecardslist'||$route.params.id==3?'销售状态':'投放状态'"
        prop="CouponStatus"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        :formatter="formatter"
        label="审核状态"
        min-width="100"
        prop="CheckStatus"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="操作"
        min-width="120"
        fixed="right"
      >
        <template slot-scope="scoped">
          <el-button
            name="linkCouponbasic"
            v-if="$route.path=='/market/coupon/index'||$route.params.id == 1"
            @click="$router.push(`/market/coupon/couponbasic/${scoped.row.CouponId}`)"
            type="text"
          >详情</el-button>
          <el-button
            name="linkGiftcouponbasic"
            v-else-if="$route.path=='/market/coupon/giftcoupon'||$route.params.id == 2"
            @click="$router.push(`/market/coupon/giftcouponbasic/${scoped.row.CouponId}`)"
            type="text"
          >详情</el-button>
          <el-button
            name="linkSalecards"
            v-else
            @click="$router.push('/market/coupon/'+(scoped.row.CouponSaleType==CouponSaleType.Online?'salecardsonlinebasic':'salecardsunlinebasic')+'/'+scoped.row.CouponId+'&'+scoped.row.CharacterId)"
            type="text"
          >详情</el-button>

          <template v-if="characterType == CharacterType.Company || wechatSettingType == CompanyBasicWechatSettingType.Store">
            <el-button
              name="btnOpenAuditDialog"
              type="text"
              @click="openAuditDialog(scoped.row.CouponId)"
              v-if="scoped.row.CheckStatus==CouponAuditStatus.Origin"
            >审核</el-button>

            <el-button
              name="btnTerminal"
              type="text"
              v-if="scoped.row.CheckStatus==CouponAuditStatus.Audit"
              @click="Terminal(scoped.row.CouponId,scoped.$index)"
            >终止投放</el-button>
          </template>
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
    <el-dialog
      title="卡券审核"
      :visible.sync="AuditVisble"
      width="1250px"
      top="20px"
    >
      <coupon-detail
        v-if="AuditVisble"
        :CouponId="CurrentCouponId"
      ></coupon-detail>
      <p class="fz-14 line-top">审核结果</p>
      <div style="padding: 10px">
        <el-form
          label-width="100"
          class="is-audit-form"
        >
          <el-radio-group
            name="radioGroupIsAudit"
            v-model="IsAudit"
          >
            <el-form-item>
              <el-radio :label="1">审核通过</el-radio>
            </el-form-item>
            <el-form-item>
              <el-radio :label="3">
                审核作废
                <el-input
                  v-model="AbandonForm.CheckNote"
                  placeholder="请输入原因"
                  style="width:213px"
                ></el-input>
              </el-radio>
            </el-form-item>
          </el-radio-group>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="btnAudit"
          type="primary"
          v-if="IsAudit==1"
          @click="Audit"
          :loading="sureBtnLoading"
        >确 定</el-button>
        <el-button
          name="btnAbandon"
          type="primary"
          v-else
          @click="Abandon"
          :loading="sureBtnLoading"
        >确 定</el-button>
        <el-button @click="AuditVisble = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="卡券面额"
      :visible.sync="amountOfMoneyVisible"
      width="800px"
    >
      <el-table
        :data="coponPrice"
        v-loading="loadingAmountOfMoney"
      >
        <el-table-column
          prop="MaxPrice"
          label="消费金额"
        >
          <template slot-scope="scoped">消费满 {{scoped.row.CashPrice}} 元</template>
        </el-table-column>
        <el-table-column
          prop="Price1"
          label="第一张"
        ></el-table-column>
        <el-table-column
          prop="Price2"
          label="第二张"
        ></el-table-column>
        <el-table-column
          prop="Price3"
          label="第三张"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import {
  SCORING_API_COUPON_BASIC_GETS, // 优惠券 - 检索
  SCORING_API_COUPON_BASIC_AUDIT, // 优惠券 - 审核
  SCORING_API_COUPON_BASIC_ABANDON, // 优惠券 - 作废
  SCORING_API_COUPON_BASIC_TERMINAL, // 优惠券 - 终止
  SCORING_API_COUPON_RANK_GETS
} from '@/apis/scoring'

import { YNStatus, CharacterType } from '@/enums/common'
import {
  CouponAuditStatus,
  CardType,
  ExpireType,
  GivePriceType,
  CouponLaunchStatus,
  EventType,
  CouponSettingType,
  CouponSaleType
} from '@/enums/scoring'
import { CompanyBasicWechatSettingType } from '@/enums/membership'
import CouponDetail from './couponDetail.vue'
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'

export default {
  data() {
    return {
      ExpireType,
      YNStatus,
      CouponSettingType,
      CharacterType,
      CompanyBasicWechatSettingType,
      form: {
        CharacterId: this.$route.query.CharacterId || 0,
        CouponType: 0,
        EventType: 0,
        CouponId: '',
        CouponName: '',
        UniteNote: '',
        Expireb: '',
        Expiree: '',
        CheckStatus: 0,
        CouponStatus: 0,
        CouponSaleType: 0,
        OrderBy: 0,
        IsAsced: 1,
        PageIndex: 1,
        PageSize: 20,
        CreateTime: []
      },
      parameter: {},
      tableData: [],
      total: 0,
      coponPrice: [],
      CurrentCouponId: '',
      num: 3,
      tableDataStatus: [
        {
          state: 1
        }
      ],
      AbandonForm: {
        CheckNote: ''
      },
      IsAudit: 1,
      loading: true,
      AuditVisble: false,
      CouponAuditStatus,
      CouponSaleType,
      GivePriceType,
      CardType,
      EventType,
      CheckStatusOpt: [
        {
          label: '全部',
          value: 0
        }
      ],
      CardTypeOpt: [
        {
          label: '全部',
          value: 0
        }
      ],
      EventTypeOpt: [
        {
          label: '全部',
          value: 0
        }
      ],
      CouponStatusOpt: [
        {
          label: '全部',
          value: 0
        }
      ],
      CouponTypeOpt: [
        {
          label: '全部',
          value: 0
        }
      ],
      page: {
        PageIndex: 1,
        PageSize: 10,
        total: 0
      },
      amountOfMoneyVisible: false,
      loadingAmountOfMoney: false,
      sureBtnLoading: false
    }
  },
  beforeMount() {
    if ((this.ifLingcb || this.ifLbranch) && !this.$route.query.CharacterId) {
      this.$router.back()
    }
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    wechatSettingType() {
      return this.$store.getters.wechatSettingType
    }
  },
  watch: {
    $route() {
      this.init()
    }
  },
  methods: {
    // 表格分页相关
    init() {
      let query = this.$route.query
      this.parameter.CouponSaleType = parseInt(query.CouponSaleType) || 0
      this.parameter.CharacterId = query.CharacterId || ''
      this.parameter.CheckStatus = parseInt(query.CheckStatus) || 0
      this.parameter.CouponId = query.CouponId || ''
      this.parameter.CouponName = query.CouponName || ''
      this.parameter.CouponType = this.$route.params.id
        ? this.$route.params.id
        : this.$route.path == '/market/coupon/index'
          ? CouponSettingType.Universal
          : this.$route.path == '/market/coupon/salecardslist'
            ? CouponSettingType.Sale
            : CouponSettingType.Voucher
      this.parameter.EventType = parseInt(query.EventType) || 0
      this.parameter.CouponStatus = parseInt(query.CouponStatus) || 0
      this.parameter.CreateTime = query.CreateTime || []
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20

      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: this.$route.path,
        query: this.parameter
      })
    },
    currentChange(val) {
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    onSearch() {
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.$refs.search.resetFields()
      this.form.CreateTime = []
      this.onSearch()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      const { CreateTime } = this.parameter
      this.form = Object.assign(this.form, this.parameter, {
        Expireb: CreateTime[0],
        Expiree: CreateTime[1] + ' 23:59:59'
      })
      SCORING_API_COUPON_BASIC_GETS(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },

    openAuditDialog(id) {
      this.IsAudit = 1
      this.AbandonForm.CheckNote = ''
      this.AuditVisble = true
      this.CurrentCouponId = id
    },
    onCheck(CouponId) {
      this.amountOfMoneyVisible = true
      this.loadingAmountOfMoney = true
      SCORING_API_COUPON_RANK_GETS({
        CouponId: CouponId
      })
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.coponPrice =
              res.data.Data.Rows &&
              res.data.Data.Rows.map(item => ({
                CashPrice: this.$root.toFloat(item.CashPrice),
                Price1: this.$root.toFloat(item.Price1),
                Price2: this.$root.toFloat(item.Price2),
                Price3: this.$root.toFloat(item.Price3)
              }))
          }
          this.loadingAmountOfMoney = false
        })
        .catch(() => (this.loadingAmountOfMoney = false))
    },
    showDetail() {},
    randomMoney() {},
    Terminal(id) {
      // 终止
      // this.CurrentCouponId = id
      this.$confirm(
        '终止后，将不能再赠送卡券，已发出的卡券仍然有效，确定要终止投放吗？',
        '终止投放',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          SCORING_API_COUPON_BASIC_TERMINAL({
            CouponId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '终止成功!'
              })
              this.getData()
            }
          })
        })
        .catch(() => false)
    },
    Abandon() {
      // 作废
      this.$confirm('确定要作废吗？', '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const reg = /^(.|\n|\r){1,200}$/
        if (
          this.AbandonForm.CheckNote != '' &&
          reg.test(this.AbandonForm.CheckNote)
        ) {
          this.sureBtnLoading = true
          SCORING_API_COUPON_BASIC_ABANDON({
            CouponId: this.CurrentCouponId,
            CheckNote: this.AbandonForm.CheckNote
          }).then(res => {
            this.sureBtnLoading = false
            this.AuditVisble = false
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '作废成功!'
              })
              this.getData()
            }
          })
        } else {
          if (this.AbandonForm.CheckNote == '') {
            this.$message.warning('请输入作废原因')
          } else {
            this.$message.warning('作废原因不能超过200字')
          }
        }
      })
    },
    Audit() {
      // 审核
      this.$confirm('确定要审核通过吗？', '审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sureBtnLoading = true
        SCORING_API_COUPON_BASIC_AUDIT({
          CouponId: this.CurrentCouponId
        }).then(res => {
          this.sureBtnLoading = false
          this.AuditVisble = false
          if (res.data.Code == 'CORRECT') {
            this.$message({
              type: 'success',
              message: '审核成功!'
            })
            this.getData()
          }
        })
      })
    },
    formatter(row, column, value) {
      // 格式化表格
      let tpr
      switch (column.property) {
        case 'CardType':
          tpr = CardType.Types[row['CardType']]
          break
        case 'GiveAmt':
          tpr = row['GiveAmt'] == 0 ? '不限' : row['GiveAmt']
          break
        case 'CouponStatus':
          if (
            row.CheckStatus == CouponAuditStatus.Abandon ||
            row.CheckStatus == CouponAuditStatus.Origin
          ) {
            tpr = '-'
          } else {
            if (
              this.$route.path == '/market/coupon/salecardslist' ||
              this.$route.params.id == 3
            ) {
              tpr =
                value == CouponLaunchStatus.Origin
                  ? '未开始'
                  : value == CouponLaunchStatus.Audit
                    ? '已开始'
                    : '已结束'
            } else {
              tpr = CouponLaunchStatus.Types[value]
            }
          }
          break
        case 'CheckStatus':
          tpr = CouponAuditStatus.Types[value]
          break
        case 'GivePriceType':
          tpr = GivePriceType.Types[value]
          break
        case 'CouponType':
          tpr =
            CouponSettingType.Sale != value
              ? CouponSettingType.Types[value]
              : CouponSaleType.Types[row.CouponSaleType]
          break
        case 'Price':
          tpr = `￥${this.$root.toFloat(value)}`
          break
        case 'SalePrice':
          tpr = `￥${this.$root.toFloat(value)}`
          break
        default:
          break
      }
      return tpr
    },
    getEnums() {
      // 获取select枚举
      for (let item in CouponAuditStatus.Types) {
        this.CheckStatusOpt.push({
          value: parseInt(item),
          label: CouponAuditStatus.Types[item]
        })
      }
      for (let item in CardType.Types) {
        this.CardTypeOpt.push({
          value: parseInt(item),
          label: CardType.Types[item]
        })
      }
      for (let item in CouponLaunchStatus.Types) {
        if (
          this.$route.path == '/market/coupon/salecardslist' ||
          this.$route.params.id == 3
        ) {
          this.CouponStatusOpt.push({
            value: parseInt(item),
            label:
              item == CouponLaunchStatus.Origin
                ? '未开始'
                : item == CouponLaunchStatus.Audit
                  ? '已开始'
                  : '已结束'
          })
        } else {
          this.CouponStatusOpt.push({
            value: parseInt(item),
            label: CouponLaunchStatus.Types[item]
          })
        }
      }
      for (let item in EventType.Types) {
        this.EventTypeOpt.push({
          value: parseInt(item),
          label: EventType.Types[item]
        })
      }
    },
    exChangeState(val) {
      this.form.isSenior = val
    },
    add() {
      // 添加活动跳转链接
      let path = '/market/coupon/couponcreate'
      if (this.$route.path.split('/')[3] == 'giftcoupon') {
        path = '/market/coupon/giftcouponcreate'
      }
      this.$router.push(path)
    }
  },
  components: {
    pagination,
    searchPanel,
    CouponDetail
  }
}
</script>
<style lang="scss" scoped>
.search-box-h {
  border: 1px solid #ddd;
}

.tab-box {
  display: inline-block;
  margin-right: 45px;
}

.grade-n {
  display: inline-block;
  width: 18px;
  height: 18px;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  background: #399fe5;
  margin-left: 10px;
}

.text-type {
  float: right;
  line-height: 28px;
  font-size: 12px;
  color: #333333;

  .text-type-h {
    color: #999999;
  }
}

.tool {
  padding-right: 10px;
  border-top: 1px solid #e5e5e5;
}

.border-bottom-none {
  border-bottom: none !important;
}

.line-top {
  background: #f5f5f5;
  font-weight: bold;
  padding: 10px;
}
</style>
<style lang="scss">
.tab-box thead.is-group tr {
  &:nth-of-type(2) {
    th {
      background: #ffffff !important;
    }
  }
}

.is-audit-form {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
