<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看分秤单({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" class="state-img">
                  <img
                    src="@/assets/images/draft.png"
                    v-if="detail.State === HalfChangeOrderBasicState.Draft"
                  >
                  <img
                    src="@/assets/images/auditing.png"
                    v-if="detail.State === HalfChangeOrderBasicState.Wait"
                  >
                  <img
                    src="@/assets/images/audited.png"
                    v-if="detail.State === HalfChangeOrderBasicState.Audit"
                  >
                  <img
                    src="@/assets/images/auditBack.png"
                    v-if="detail.State === HalfChangeOrderBasicState.Reject"
                  >
                  <img
                    src="@/assets/images/abandon.png"
                    v-if="detail.State === HalfChangeOrderBasicState.Abandon || detail.State === HalfChangeOrderBasicState.Cancel"
                  >
                  <div>{{HalfChangeOrderBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.ChangeCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                <td class="tit">审核</td>
                <td
                  v-if="detail.State === HalfChangeOrderBasicState.Audit || detail.State === HalfChangeOrderBasicState.Reject"
                >{{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime | filterDateMinutes}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
                <td class="tit">半成品数量</td>
                <td>{{detail.Quantity1}}</td>
                <td class="tit">半成品重量</td>
                <td>{{$root.toFloat(detail.Weight1, 3)}}g</td>
              </tr>
              <tr>
                <td class="tit">业务日期</td>
                <td>{{detail.ActualDate | filterDate}}</td>
                <td class="tit">半成品位置</td>
                <td>{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
                <td class="tit">备注</td>
                <td>{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <span class="order-list-text">
            <i class="el-icon-caret-bottom"></i>分秤列表
          </span>
          <div class="fr">
            <span class="detail-info-num-item">
              分秤总数量：
              <b class="num">{{detail.Quantity2}}</b>
            </span>
            <span class="detail-info-num-item">
              分秤总重量：
              <b class="num">{{$root.toFloat(detail.Weight2, 3)}}g</b>
            </span>
            <span class="detail-info-num-item">
              分秤差异：
              <b class="num">{{detail.Quantity1}}件/+{{$root.toFloat(detail.Weight2, 3)}}g</b>
            </span>
          </div>
        </div>
        <div
          class="goods-wrapper"
          v-loading="$store.getters.tb_loading"
          element-loading-text="拼命加载中"
        >
          <div class="goods-left">
            <!-- 货品列表 -->
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>半成品名称</th>
                  <th>选货数量</th>
                  <th>选货重量</th>
                  <!-- <th>操作</th> -->
                </tr>
              </thead>
              <tbody>
                <tr
                  name="rowSelect"
                  v-for="(item, index) in goodsData"
                  :key="index"
                  :class="{active:item.HalfItid === halfForm.HalfItid}"
                  @click="rowSelect(item)"
                >
                  <td :title="item.StoreBarCode">{{item.HalfName}}</td>
                  <td :title="item.GoodsName">{{item.Quantity1}}</td>
                  <td>{{$root.toFloat(item.Weight1, 3)}}g</td>
                  <!-- <td>
                    <el-button
                      size="small"
                      type="text"
                      :key="item.HalfItid"
                      @click.prevent="goodsDel($event, item)"
                      name="btnGoodsDel"
                    >删除</el-button>
                  </td> -->
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar">
              <div class="myPagination-bar">
                <el-select
                  filterable
                  v-model="parameters.PageSize"
                  placeholder="20"
                  name="PageSize"
                  @change="paginationSizesChange"
                >
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button
                    name="btnPrev"
                    class="prev-btn"
                    @click="prevPage"
                    :disabled="parameters.PageIndex === 1"
                    :class="{'isDisabled': parameters.PageIndex === 1}"
                  >
                    <i class="el-icon-arrow-left"></i>
                  </button>
                  <span class="current-page">{{parameters.PageIndex}}/{{pages}}</span>
                  <button
                    name="btnNext"
                    class="next-btn"
                    @click="nextPage"
                    :disabled="parameters.PageIndex === pages"
                    :class="{'isDisabled': parameters.PageIndex === pages}"
                  >
                    <i class="el-icon-arrow-right"></i>
                  </button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
              <div class="count-bar">
                <span class="fl">总数量：{{detail.Quantity1}}</span>
                <span class="fr">
                  总重量：
                  <b>{{$root.toFloat(detail.Weight1, 3)}}g</b>
                </span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <!-- 货品详情 -->
            <viewGoodTable v-if="option.KindTypeEk" :goodsData="data" :option="option"/>
            <pagination
              :pg="halfForm.PageIndex"
              :size="halfForm.PageSize"
              :total="total"
              @currentChange="currentChange"
              @sizeChange="sizeChange"
            ></pagination>
            <div class="check-page">
              <span class="detail-info-num-item">
                分秤总数量：
                <b class="num">{{orderInfo.Quantity2}}</b>
              </span>
              <span class="detail-info-num-item">
                分秤总重量：
                <b class="num">{{$root.toFloat(orderInfo.Weight2, 3)}}g</b>
              </span>
              <span class="detail-info-num-item">
                分秤差异：
                <b class="num">{{orderInfo.Quantity2}}件/+{{$root.toFloat(orderInfo.Weight2, 3)}}g</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template
        v-if="detail.State == HalfChangeOrderBasicState.Draft || detail.State == HalfChangeOrderBasicState.Reject"
      >
        <router-link
          :to="{path:'/purchase/pointsBalance/pointsBalanceEdit',query:{id:detail.ChangeId}}"
          name="btnEdit"
        >
          <el-button type="primary">编辑</el-button>
        </router-link>
        <el-button name="btnInvalid" @click="cancelAudit('invalid')">作废</el-button>
      </template>
      <el-button
        name="btnAudit"
        @click="showAudit"
        v-if="detail.State === HalfChangeOrderBasicState.Wait"
      >审核</el-button>
      <el-button
        name="btnCancel"
        @click="cancelAudit('cancel')"
        v-if="detail.State === HalfChangeOrderBasicState.Audit"
      >取消审核</el-button>
      <el-button
        name="btnExportDetails"
        @click="goodsExportVisible = true"
        v-if="data.length !== 0"
      >导出货品详情</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </div>
    <!-- @module 审核 -->
    <el-dialog title="审核" :visible.sync="auditCheck" width="580px">
      <el-form
        label-position="right"
        label-width="80px"
        :model="detail"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item label="单据编号：">
          <span>{{detail.ChangeCode}}</span>
        </el-form-item>
        <el-form-item label="创建：">
          <span>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</span>
        </el-form-item>
        <el-form-item label="审核结果：">
          <el-radio-group name="stateCheck" v-model="stateCheck">
            <el-radio :label="HalfChangeOrderBasicState.Audit">审核通过</el-radio>
            <el-radio :label="HalfChangeOrderBasicState.Reject">审核退回</el-radio>
            <el-input
              name="checkNote"
              style="width:178px;"
              v-model="checkNote"
              :disabled="stateCheck === HalfChangeOrderBasicState.Audit"
              placeholder="退回原因备注"
              maxlength="200"
            ></el-input>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnIsAudit" type="primary" @click="isAudit">确定</el-button>
        <el-button name="btnClose" @click="auditCheck = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 审核 -->
    <!-- @module 取消审核/作废确认 -->
    <el-dialog
      :title="cancelName === 'cancel' ? '取消审核' : '作废确认'"
      :visible.sync="cancelCheck"
      width="580px"
    >
      <el-form label-position="right" label-width="100px" :model="detail" @submit.native.prevent>
        <el-row>
          <el-col :span="10">
            <el-form-item label="单据编号：">
              <span>{{detail.ChangeCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="创建：">
              <span>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="cancelName === 'cancel' ? '取消原因：' : '作废原因：'">
          <el-input
            name="checkNote"
            v-model="checkNote"
            :placeholder="cancelName === 'cancel' ? '取消原因备注' : '作废原因备注'"
            @keyup.enter="isCancel"
            maxlength="200"
          ></el-input>
        </el-form-item>
        <div>{{cancelName === 'cancel' ? '取消审核后该单据所产生的库存等业务数据也将回退，确定取消审核？' : '作废后该单据所产生的库存等业务数据也将回退，确定作废？'}}</div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnIsChcek" type="primary" @click="isCancel">确定</el-button>
        <el-button name="btnClose" @click="cancelCheck = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 取消审核/作废确认 -->
    <!-- @module 导出货品详情 -->
    <export-goods-detail
      v-if="option.KindTypeEk"
      :visible.sync="goodsExportVisible"
      @submit="downLoadGoods"
      :option="option"
    />
    <!-- End 导出货品详情 -->
  </div>
</template>

<script>
import {
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  SettingCustomizedFieldSmallType,
  HalfChangeOrderBasicState
} from '@/enums/stocking'
import { YNStatus, EnableState } from '@/enums/common'
import {
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_GET,
  STOCKING_API_HALF_CHANGE_ORDER_HALF_GETS,
  STOCKING_API_HALF_CHANGE_ORDER_GOODS_GETS,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_AUDIT,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_REJECT,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_CANCEL,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_ABANDON,
  STOCKING_API_HALF_CHANGE_ORDER_HALF_DELETE,
  STOCKING_API_HALF_CHANGE_ORDER_GOODS_EXPORTGETSRESULT
} from '@/apis/stocking.js'
import goodsDetails from '@/components/erp/goodsDetails'
import exportGoodsDetail from '@/components/erp/exportGoodsDetail'
import viewGoodTable from '@/components/purchase/viewGoodTable'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      HalfChangeOrderBasicState,
      YNStatus,
      goodsData: [], // 货品数据
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      parameters: {
        ChangeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageSize: 20, // 分页数据条数
        PageIndex: 1 // 当前页面位置
      },
      halfForm: {
        HalfItid: '',
        ChangeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageSize: 20, // 分页数据条数
        PageIndex: 1 // 当前页面位置
      },
      totalCount: 0, // 总数据条数
      total: 0,
      detail: {},
      goodsItem: {}, // 选中的半成品
      orderInfo: {},
      data: [],
      checkNote: '',
      auditCheck: false,
      cancelCheck: false,
      cancelName: 'cancel',
      stateCheck: 5, // 审核结果
      goodsExportVisible: false,
      option: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudHalfChangeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: SettingCustomizedFieldSmallType.Basic,
        KindTypeEk: 0,
        IsEnable: EnableState.Enable
      }
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.parameters.PageSize === 0
          ? this.totalCount / this.parameters.PageSize
          : parseInt(this.totalCount / this.parameters.PageSize) + 1) || 1
      )
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.parameters.ChangeId = this.halfForm.ChangeId = parseInt(query.id)
      if (!this.parameters.ChangeId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      STOCKING_API_HALF_CHANGE_ORDER_BASIC_GET({
        ChangeId: this.parameters.ChangeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.option.KindTypeEk = this.detail.KindTypeEk
          this.getGoods()
        }
      })
    },
    getGoods() {
      STOCKING_API_HALF_CHANGE_ORDER_HALF_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.halfForm.HalfItid =
            this.goodsData &&
            this.goodsData.length &&
            this.goodsData[0].HalfItid
          this.orderInfo = this.goodsData[0] || {}
          if (this.halfForm.HalfItid) {
            this.getHalfData()
          }
        } else {
          this.$message.error(res.data.Message)
          this.goodsData = []
        }
      })
    },
    getHalfData() {
      STOCKING_API_HALF_CHANGE_ORDER_GOODS_GETS(this.halfForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    rowSelect(item) {
      this.halfForm.HalfItid = item.HalfItid
      this.orderInfo = item
      this.getHalfData()
    },
    paginationSizesChange() {
      this.parameters.PageIndex = 1
      this.getGoods()
    },
    prevPage() {
      this.parameters.PageIndex -= 1
      this.getGoods()
    },
    nextPage() {
      this.parameters.PageIndex += 1
      this.getGoods()
    },
    cancelAudit(v) {
      this.cancelName = v
      this.cancelCheck = true
    },
    showAudit() {
      this.checkNote = ''
      this.stateCheck = HalfChangeOrderBasicState.Audit
      this.auditCheck = true
    },
    isAudit() {
      if (this.stateCheck === HalfChangeOrderBasicState.Audit) {
        STOCKING_API_HALF_CHANGE_ORDER_BASIC_AUDIT({
          ChangeId: this.detail.ChangeId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('审核成功')
            this.auditCheck = false
            this.getDetail()
          }
        })
      } else {
        STOCKING_API_HALF_CHANGE_ORDER_BASIC_REJECT({
          ChangeId: this.detail.ChangeId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('退回成功')
            this.auditCheck = false
            this.getDetail()
          }
        })
      }
    },
    isCancel() {
      // 取消、作废
      if (this.cancelName === 'cancel') {
        STOCKING_API_HALF_CHANGE_ORDER_BASIC_CANCEL({
          ChangeId: this.detail.ChangeId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('取消成功')
            this.cancelCheck = false
            this.getDetail()
          }
        })
      } else {
        STOCKING_API_HALF_CHANGE_ORDER_BASIC_ABANDON({
          ChangeId: this.detail.ChangeId,
          CheckNote: this.checkNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('作废成功')
            this.cancelCheck = false
            this.getDetail()
          }
        })
      }
    },
    goodsDel($event, item) {
      $event.currentTarget.blur()
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          STOCKING_API_HALF_CHANGE_ORDER_HALF_DELETE({
            HalfItid: item.HalfItid,
            ChangeId: item.ChangeId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message(res.data.Message, 'success')
              this.getGoods()
              this.getDetail()
            } else {
              this.$message.error(res.data.Message)
            }
            this.$store.commit('SET_FULL_LOADING', false)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getData()
    },
    downLoadGoods(column) {
      STOCKING_API_HALF_CHANGE_ORDER_GOODS_EXPORTGETSRESULT({
        HalfItid: this.orderInfo.HalfItid,
        ChangeId: this.parameters.ChangeId,
        State: this.orderInfo.State,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 0,
        ExportColumns: column
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            setTimeout(() => {
              window.open(
                this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data
              )
            }, 1000)
          } else {
            this.$router.push('/setter/userConfig/download')
          }
        }
        this.goodsExportVisible = false
      })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    pageIndex: 'getGoods',
    pageSize() {
      this.parameters.PageIndex = 1
      this.getGoods()
    }
  },
  components: {
    goodsDetails,
    exportGoodsDetail,
    viewGoodTable,
    pagination
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>

<style lang="scss" scoped>
.order-list-text {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}
.check-page {
  font-size: 12px;
  text-align: right;
  padding-right: 5px;
}
.goods-wrapper .goods-left .goods-table tr > :first-child {
  padding-left: 2%;
}
.goods-wrapper .goods-right {
  overflow: auto;
  border-top: none;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
</style>
