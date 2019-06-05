<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看委外加工结算单</span>
        <!-- <span @click="$router.back(-1)" class="title text-btn fr">返回</span> -->
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" colspan="1" class="state-img">
                  <img src="@/assets/images/draft.png" v-if="detail.State === weiwStuffSettleBasicState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === weiwStuffSettleBasicState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === weiwStuffSettleBasicState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === weiwStuffSettleBasicState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === weiwStuffSettleBasicState.Abandon || detail.State === weiwStuffSettleBasicState.Cancel">
                  <div>{{weiwStuffSettleBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.SettleCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === weiwStuffSettleBasicState.Audit || detail.State === weiwStuffSettleBasicState.Reject">{{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}</td>
                <td v-else></td>
              </tr>
              <tr>
                <td class="tit">结算类型</td>
                <td>{{weiwStuffSettleBasicSourceType.Types[detail.SourceType]}}</td>
                <td class="tit">相关单号</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">应付款</td>
                <td>￥{{detail.Preprice}}</td>
              </tr>
              <tr>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="m-10">
          <ul class="tabs m-b-1">
            <li
              class="tab"
              v-if="detail.SourceType == weiwStuffSettleBasicSourceType.GoodsIntakeOrderBasic
            ||detail.SourceType == weiwStuffSettleBasicSourceType.GoodsReturnOrderBasic"
              :class="{active: currTabs == 0}"
              @click="changeTabs(0)"
            >产出成品</li>
            <li class="tab" v-else :class="{active: currTabs == 1}" @click="changeTabs(1)">产出半成品</li>
            <li class="tab" :class="{active: currTabs == 2}" @click="changeTabs(2)">投入金料</li>
            <li class="tab" :class="{active: currTabs == 3}" @click="changeTabs(3)">投入石料</li>
            <li class="tab" :class="{active: currTabs == 4}" @click="changeTabs(4)">投入配件</li>
            <li class="tab" :class="{active: currTabs == 5}" @click="changeTabs(5)">工费</li>
          </ul>
          <el-table class="fixed-tr" :data="tableData" ref="halfTable" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="num" label="序号" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.$index + 1}}</template>
            </el-table-column>
            <el-table-column v-if="currTabs == 0" key="01" prop="BarCode" label="条码" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 0" key="02" prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 0" key="03" prop="Weight" label="货重(g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 0" key="04" prop="GoldWeight" label="金重(g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 0" key="05" prop="Stone1Weight" label="主石重(ct)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Stone1Weight, 3)}}ct
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 0" key="06" prop="Stone1Qty" label="主石数" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 0" key="07" prop="CostPrice" label="成本价" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.CostPrice)}}</template>
            </el-table-column>
            <el-table-column v-if="currTabs == 0" key="08" prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>

            <el-table-column v-if="currTabs == 1" key="10" prop="HalfName" label="半成品名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 1" key="11" prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 1" key="12" prop="Weight" label="重量" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="13" prop="GoldPrice" label="金价(元/克)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.GoldPrice)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="15" prop="CraftFee1" label="工费①计价(元/克)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.CraftFee1)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="16" prop="CraftFee2" label="工费②计件(元/件)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.CraftFee2)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="17" prop="OtherFee" label="其他费用" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.OtherFee)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="18" prop="CostPrice" label="成本" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.CostPrice)}}
              </template>
            </el-table-column>

            <el-table-column v-if="currTabs == 2" key="20" prop="GoldType" label="*成色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{$store.getters.goldType.Types[scope.row.GoldType]}}</template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="30" prop="StoneClassTypeEk" label="*石类" min-width="100">
              <template slot-scope="scope">{{$store.getters.stone.Types[scope.row.StoneClassTypeEk]}}</template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="31" prop="StonePackageNo" label="*石号/包号" min-width="100"></el-table-column>
            <el-table-column v-if="currTabs == 3" key="32" prop="StoneWeightEk" label="石重范围" min-width="100">
              <template slot-scope="scope">{{$store.getters.stoneWeight.Types[scope.row.StoneWeightEk]}}</template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="33" prop="StoneColor" label="颜色" min-width="100">
              <template slot-scope="scope">{{StoneColor.Types[scope.row.StoneColor]}}</template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="34" prop="StoneClarity" label="净度" min-width="100">
              <template slot-scope="scope">{{StoneClarity.Types[scope.row.StoneClarity]}}</template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="35" prop="StoneCut" label="切工" min-width="130">
              <template slot-scope="scope">{{scope.row.StoneCut?StoneCut.Types[scope.row.StoneCut]:''}}</template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="36" prop="StoneSpec" label="规格" min-width="130"></el-table-column>
            <el-table-column v-if="currTabs == 4" key="40" prop="PartTypeEk" label="*配件名称" min-width="130">
              <template slot-scope="scope">{{$store.getters.part.Types[scope.row.PartTypeEk]}}</template>
            </el-table-column>
            <el-table-column v-if="currTabs == 2||currTabs == 3||currTabs == 4" prop="Weight" :label="currTabs == 3?'重量(ct)':'重量(g)'" min-width="130">
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight, 3)}}{{currTabs == 3?'ct':'g'}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 2||currTabs == 3||currTabs == 4" prop="Quantity" label="数量" min-width="130"></el-table-column>

            <el-table-column v-if="currTabs == 3" key="38" prop="StonePrice2" label="重单价" min-width="130">
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.StonePrice2)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="37" prop="StonePrice1" label="数单价" min-width="130">
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.StonePrice1)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 4" key="42" prop="PartPrice2" label="重单价" min-width="130">
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.PartPrice2)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 4" key="41" prop="PartPrice1" label="数单价" min-width="130">
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.PartPrice1)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 2" key="21" prop="GoldPrice" label="金价(元/克)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.GoldPrice)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 2||currTabs == 3||currTabs == 4" prop="Price" label="金额" min-width="130">
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.Price)}}
              </template>
            </el-table-column>

            <el-table-column v-if="currTabs == 5" key="50" prop="CraftType" label="*工费类型" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 5" key="51" prop="Price" label="金额" min-width="80">
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.Price)}}</template>
            </el-table-column>
            <el-table-column v-if="currTabs == 5" key="52" prop="Note" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
          </el-table>
          <pagination :pg="PageIndex" :size="PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
          <!-- 分页 end -->
        </div>
      </div>
    </div>
    <div class="buttons">
      <template>
        <router-link v-if="detail.State == weiwStuffSettleBasicState.Draft||detail.State == weiwStuffSettleBasicState.Reject" :to="{path:'/depot/outSBalance/edit',query:{id:detail.SettleId}}">
          <el-button type="primary">编辑</el-button>
        </router-link>
      </template>
      <el-button v-if="detail.State == weiwStuffSettleBasicState.Wait" type="primary" @click="auditDialog = true">审核</el-button>
      <el-button v-if="detail.State == weiwStuffSettleBasicState.Audit" @click="cancelDialog = true">取消审核</el-button>
      <el-button v-if="detail.State == weiwStuffSettleBasicState.Draft||detail.State == weiwStuffSettleBasicState.Reject" @click="abandonDialog = true">作废</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- @module Dialog·审核 -->
    <auditDialog title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="[detail]" @listenAuditDialog="listenDialog"></auditDialog>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandonDialog title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="[detail]" :abandonPurchase="detail" @listenAbandonDialog="listenDialog"></abandonDialog>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancelDialog title="取消审核" v-if="cancelDialog" :data="[detail]" :cancelDialog="cancelDialog" @listenCancelDialog="listenDialog"></cancelDialog>
    <!-- End Dialog·取消审核 -->
  </div>
</template>

<script>
import {
  YNStatus,
  StuffType
} from '@/enums/common.js'
import {
  FeeType,
  StoneCut,
  StoneColor,
  StoneClarity,
  WeiwStuffSettleBasicState,
  WeiwStuffSettleBasicSourceType,
  SettingEnumeratorEnumeratorType
} from '@/enums/stocking.js'
import {
  STOCKING_API_WEIW_STUFF_SETTLE_BASIC_GET,
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GETS,
  STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS,
  STOCKING_API_WEIW_STUFF_SETTLE_ITEM_GETS,
  // STOCKING_API_GOODS_RETURN_ORDER_ITEM_GETS,
  // STOCKING_API_HALF_RETURN_ORDER_ITEM_GETS,
} from '@/apis/stocking.js'

import pagination from '@/components/pagination'
import auditDialog from './audit'
import abandonDialog from './abandon'
import cancelDialog from './cancel'

export default {
  data() {
    return {
      FeeType,
      YNStatus,
      StuffType,
      StoneCut,
      StoneColor,
      StoneClarity,
      goodsData: [], // 货品数据
      SettingEnumeratorEnumeratorType,
      weiwStuffSettleBasicSourceType: WeiwStuffSettleBasicSourceType,
      weiwStuffSettleBasicState: WeiwStuffSettleBasicState,
      PageSize: 20, // 分页数据条数
      PageIndex: 1, // 当前页面位置
      total: 0, // 总数据条数
      SettleId: '',
      currTabs: 0, // 当前选中的tabs
      detail: {},
      tableData: [],
      currStuffType: '',
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false,
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.SettleId = Number(query.id) || 0
      if (!this.SettleId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    getDetail() {
      STOCKING_API_WEIW_STUFF_SETTLE_BASIC_GET({ SettleId: this.SettleId }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.detail = res.data.Data
          this.detail.Preprice = this.$root.toFloat(this.detail.Preprice)
          if (this.detail.SourceType == this.weiwStuffSettleBasicSourceType.GoodsIntakeOrderBasic || this.detail.SourceType == this.weiwStuffSettleBasicSourceType.GoodsReturnOrderBasic) {
            this.currTabs = 0
          } else {
            this.currTabs = 1
          }
          this.getGoods()
        }
      })
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
    getGoods() {
      let obj = {
        IntakeId: this.detail.PreviousId,
        PageIndex: this.PageIndex,
        PageSize: this.PageSize
      }
      let apiMethod = ''
      switch (this.currTabs) {
        case 0:
          apiMethod = STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GETS
          // if(this.weiwStuffSettleBasicSourceType.GoodsIntakeOrderBasic == this.detail.SourceType){
          //   apiMethod = STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GETS
          // }else if(this.weiwStuffSettleBasicSourceType.GoodsReturnOrderBasic == this.detail.SourceType){
          //   apiMethod = STOCKING_API_GOODS_RETURN_ORDER_ITEM_GETS
          //   delete obj['CharacterId']
          //   obj.ReturnId = this.detail.PreviousId
          // }
          break
        case 1:
          apiMethod = STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS
          // if(this.weiwStuffSettleBasicSourceType.HalfIntakeOrderBasic == this.detail.SourceType){
          //   apiMethod = STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS
          // }else if(this.weiwStuffSettleBasicSourceType.HalfReturnOrderBasic == this.detail.SourceType){
          //   apiMethod = STOCKING_API_HALF_RETURN_ORDER_ITEM_GETS
          //   delete obj['CharacterId']
          //   obj.ReturnId = this.detail.PreviousId
          // }
          break
        case 2:
          obj = {}
          obj.SettleId = this.SettleId
          obj.StuffType = this.StuffType.Gold
          obj.PageIndex = this.PageIndex
          obj.PageSize = this.PageSize
          this.currStuffType = this.StuffType.Gold
          apiMethod = STOCKING_API_WEIW_STUFF_SETTLE_ITEM_GETS
          break
        case 3:
          obj = {}
          obj.SettleId = this.SettleId
          obj.StuffType = this.StuffType.Stone
          obj.PageIndex = this.PageIndex
          obj.PageSize = this.PageSize
          this.currStuffType = this.StuffType.Stone
          apiMethod = STOCKING_API_WEIW_STUFF_SETTLE_ITEM_GETS
          break
        case 4:
          obj = {}
          obj.SettleId = this.SettleId
          obj.StuffType = this.StuffType.Part
          obj.PageIndex = this.PageIndex
          obj.PageSize = this.PageSize
          this.currStuffType = this.StuffType.Part
          apiMethod = STOCKING_API_WEIW_STUFF_SETTLE_ITEM_GETS
          break
        default:
          break
      }
      if (this.currTabs != 5) {
        apiMethod(obj).then(res => {
          console.log('res.data', res.data)
          if (res.data.Code == 'CORRECT') {
            this.tableData = res.data.Data.Rows || []
            this.total = res.data.Data.Count || 0
          }
        })
      } else {
        if (this.detail.CraftNote && JSON.parse(this.detail.CraftNote).length > 0) {
          this.tableData = JSON.parse(this.detail.CraftNote)
        }
      }
    },
    changeTabs(index) {
      this.tableData = []
      this.currTabs = index
      this.PageIndex = 1
      this.PageSize = 20
      this.total = 0
      this.getGoods()
    },
    pageChange(val) {
      this.PageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.PageIndex = 1
      this.PageSize = val
      this.getGoods()
    },
    listenDialog(type, success) {
      if (success) {
        this.getDetail()
      }
      this[type] = false
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
      this.$store.dispatch('GET_STONE_TYPE')
      this.$store.dispatch('GET_PART_TYPE')
      this.$store.dispatch('GET_STONEWEIGHT')
    },
    // formatter(row, column, val) {
    //   switch (column.property) {
    //     case 'Weight':
    //     case 'GoldWeight':
    //       return this.$root.toFloat(val, 3)
    //     default:
    //       return this.$root.toFloat(val)
    //   }
    // }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    auditDialog,
    abandonDialog,
    cancelDialog
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
.fixed-tr .el-form-item {
  margin-bottom: 0px;
}
.fixed-tr .el-form-item--mini {
  margin-bottom: 0px;
}
</style>

<style lang="scss" scoped>
.import-purchase-dialog {
  .download-modflie {
    margin: 0 auto;
    padding: 10px 0;
    width: 360px;
    text-align: right;
    color: #20a0ff;
  }
  .el-dialog__body {
    padding: 10px 30px;
    .el-upload-dragger {
      margin: 0 0 20px;
    }
    .el-upload__tip {
      text-align: left;
    }
  }
}

.goods-wrapper .goods-left .toolsbar {
  height: 98px;
}
.goods-wrapper .goods-left .toolsbar .count-bar {
  border-bottom: 1px solid #ddd;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
.m-b-1 {
  margin-bottom: 1px;
}
.edit-btn {
  color: #399fe5 !important;
  cursor: pointer;
}
</style>
