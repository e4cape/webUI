<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看委外拆卸结算单</span>
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
                <td v-if="detail.State === weiwStuffSettleBasicState.Audit || detail.State === weiwStuffSettleBasicState.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">结算类型</td>
                <td>{{weiwGjunkSettleBasicSourceType.Types[detail.SourceType]}}</td>
                <td class="tit">相关单号</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">应付款</td>
                <td>￥{{detail.Preprice}}</td>
              </tr>
              <tr>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
                <td class="tit">备注</td>
                <td class="note" colspan="3">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="m-10">
          <ul class="tabs m-b-1">
            <li class="tab" v-if="detail.SourceType == weiwGjunkSettleBasicSourceType.Goods" 
            :class="{active: currTabs == 0}" @click="changeTabs(0)">投入成品</li>
            <li class="tab" v-else :class="{active: currTabs == 1}" @click="changeTabs(1)">投入旧货</li>
            <li class="tab" :class="{active: currTabs == 2}" @click="changeTabs(2)">产出金料</li>
            <li class="tab" :class="{active: currTabs == 3}" @click="changeTabs(3)">产出石料</li>
            <li class="tab" :class="{active: currTabs == 4}" @click="changeTabs(4)">产出配件</li>
            <li class="tab" :class="{active: currTabs == 5}" @click="changeTabs(5)">工费</li>
          </ul>
          <el-table class="fixed-tr" :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="num" label="序号" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
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
            <el-table-column v-if="currTabs == 0" key="05" prop="Stone1Weight" label="主石重(g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Stone1Weight, 3)}}ct
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 0" key="06" prop="Stone1Qty" label="主石数" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 0" key="07" prop="Price" label="成本价" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.Price, 3)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 0" key="08" prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>

            <el-table-column v-if="currTabs == 1" key="10" prop="JunkCode" label="旧货编码" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 1" key="11" prop="JunkName" label="旧货名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 1" key="12" prop="IsGold" label="类型" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.IsGold == YNStatus.Yes?'素金':'非素'}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="13" prop="GoldWeight" label="金重(g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="15" prop="StoneWeight" label="主石重(ct)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.StoneWeight, 3)}}ct
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="16" prop="StoneColor" label="主石颜色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{StoneColor.Types[scope.row.StoneColor]}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 1" key="17" prop="StoneClarity" label="主石净度" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{StoneClarity.Types[scope.row.StoneClarity]}}
              </template>
            </el-table-column>
            
            <el-table-column v-if="currTabs == 2" key="20" prop="GoldType" label="*成色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.goldType.Types[scope.row.GoldType]}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="30" prop="StoneClassTypeEv" label="*石类" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == 3" key="31" prop="StonePackageNo" label="*石号/包号" min-width="100"></el-table-column>
            <el-table-column v-if="currTabs == 3" key="32" prop="StoneWeightEv" label="石重范围" min-width="100"></el-table-column>
            <el-table-column v-if="currTabs == 3" key="33" prop="StoneColor" label="颜色" min-width="100">
              <template slot-scope="scope">
                {{StoneColor.Types[scope.row.StoneColor]}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="34" prop="StoneClarity" label="净度" min-width="100">
              <template slot-scope="scope">
                {{StoneClarity.Types[scope.row.StoneClarity]}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="35" prop="StoneCut" label="切工" min-width="130">
              <template slot-scope="scope">
                {{scope.row.StoneCut?StoneCut.Types[scope.row.StoneCut]:''}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 3" key="36" prop="StoneSpec" label="规格" min-width="130"></el-table-column>
            <el-table-column v-if="currTabs == 4" key="40" prop="PartTypeEk" label="*配件名称" min-width="130">
              <template slot-scope="scope">
                {{$store.getters.part.Types[scope.row.PartTypeEk]}}
              </template>
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
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.Price)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == 5" key="52" prop="Note" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
          </el-table>
          <pagination :pg="PageIndex" :size="PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template v-if="detail.State === weiwStuffSettleBasicState.Draft||detail.State === weiwStuffSettleBasicState.Reject">
        <router-link :to="{path:'/depot/outSDismountBalance/edit',query:{id:$route.query.id}}">
          <el-button type="primary" name="btnEdit">编辑</el-button>
        </router-link>
        <el-button @click="abandonDialog = true" name="btnAbandon">作废</el-button>
      </template>
      <el-button v-if="detail.State === weiwStuffSettleBasicState.Wait" type="primary" @click="auditDialog = true" name="btnAudit">审核</el-button>
      <el-button v-if="detail.State === weiwStuffSettleBasicState.Audit" @click="cancelDialog = true" name="btnCancel">取消审核</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- @module Dialog·审核 -->
    <auditDialog title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="[detail]" @listenAuditDialog="listenAuditDialog"></auditDialog>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandonDialog title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="[detail]" :abandonPurchase="detail" @listenAbandonDialog="listenAbandonDialog"></abandonDialog>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancelDialog title="取消审核" v-if="cancelDialog" :cancelDialog="cancelDialog" :data="[detail]" @listenCancelDialog="listenCancelDialog"></cancelDialog>
    <!-- End Dialog·取消审核 -->

  </div>
</template>

<script>
import {
  YNStatus,
  StuffType,
} from '@/enums/common.js'
import {
  FeeType,
  StoneCut,
  StoneColor,
  StoneClarity,
  WeiwStuffSettleBasicState,
  WeiwGjunkSettleBasicSourceType,
  SettingEnumeratorEnumeratorType
} from '@/enums/stocking.js'

import {
  STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_GET,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYGOODS,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYJUNK,
  STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_GETS
} from '@/apis/stocking.js'

import auditDialog from './audit'
import abandonDialog from './abandon'
import cancelDialog from './cancel'
import pagination from '@/components/pagination'

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
      weiwGjunkSettleBasicSourceType: WeiwGjunkSettleBasicSourceType,
      weiwStuffSettleBasicState: WeiwStuffSettleBasicState,
      PageSize: 20, // 分页数据条数
      PageIndex: 1, // 当前页面位置
      total: 0, // 总数据条数
      SettleId: '',
      detail: {},
      tableData: [],
      goodsId: '', // 选中的货品id
      editDialog: false,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false,
      printDialog: false,
      currTabs: 1
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.SettleId = Number(query.id)||0
      if (!this.SettleId) {
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
      STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_GET({SettleId: this.SettleId}).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.detail = res.data.Data
          this.detail.Preprice = this.$root.toFloat(this.detail.Preprice)
          if(this.detail.SourceType == this.weiwGjunkSettleBasicSourceType.Goods){
            this.currTabs = 0
          }else{
            this.currTabs = 1
          }
          this.getGoods()
        }
      })
    },
    getGoods() {
      let obj = {}
      let apiMethod = ''
      switch(this.currTabs){
        case 0:
          obj = {
            SplitId: this.detail.PreviousId,
            OrderBy: 0,
            IsAsced: this.YNStatus.No,
            PageIndex: this.PageIndex,
            PageSize: this.PageSize
          }
          apiMethod = STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYGOODS 
          break
        case 1:
          obj = {
            SplitId: this.detail.PreviousId,
            OrderBy: 0,
            IsAsced: this.YNStatus.No,
            PageIndex: this.PageIndex,
            PageSize: this.PageSize
          }
          apiMethod = STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYJUNK
          break
        case 2:
          obj.SettleId = this.SettleId
          obj.StuffType = this.StuffType.Gold
          obj.PageIndex = this.PageIndex
          obj.PageSize = this.PageSize
          this.currStuffType = this.StuffType.Gold
          apiMethod = STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_GETS 
          break
        case 3:
          obj.SettleId = this.SettleId
          obj.StuffType = this.StuffType.Stone
          obj.PageIndex = this.PageIndex
          obj.PageSize = this.PageSize
          this.currStuffType = this.StuffType.Stone
          apiMethod = STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_GETS 
          break
        case 4:
          obj = {}
          obj.SettleId = this.SettleId
          obj.StuffType = this.StuffType.Part
          obj.PageIndex = this.PageIndex
          obj.PageSize = this.PageSize
          this.currStuffType = this.StuffType.Part
          apiMethod = STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_GETS 
          break
        default:
          break
      }
      if(this.currTabs != 5){
        apiMethod(obj).then(res => {
          console.log('res.data', res.data)
          if(res.data.Code == 'CORRECT'){
            this.tableData = res.data.Data.Rows||[]
            this.total = res.data.Data.Count||0
          }
        })
      }else{
        if(this.detail.CraftNote&&JSON.parse(this.detail.CraftNote).length>0){
          this.tableData = JSON.parse(this.detail.CraftNote)
        }else{
          this.tableData = []
        }
      }
    },
    changeTabs(index){
      this.tableData = []
      this.currTabs = index
      this.PageIndex = 1
      this.PageSize = 20
      this.total = 0
      console.log('this.currTabs', this.currTabs, typeof this.currTabs)
      this.getGoods()
    },
    listenEditDialog(data) {
      this.detail = data
      this.editDialog = false
    },
    listenAuditDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.auditDialog = false
    },
    listenAbandonDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.abandonDialog = false
    },
    listenCancelDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.cancelDialog = false
    },
    currentChange(val){
      this.PageIndex = val
      this.getGoods()
    },
    sizeChange(val){
      this.PageSize = val
      this.PageIndex = 1
      this.getGoods()
    },
    getEnums() {
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_STONE_TYPE')
      this.$store.dispatch('GET_PART_TYPE')
      this.$store.dispatch('GET_STONEWEIGHT') 
    },
    formatter(row, column, val){
      switch(column.property){
        case 'Stone1Weight':
        case 'Weight':
        case 'GoldWeight':
          return this.$root.toFloat(val, 3)
        default:
          return this.$root.toFloat(val)
      }
    }
  },
  created(){
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  components: {
    auditDialog,
    abandonDialog,
    cancelDialog,
    pagination
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
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
.m-b-1{
  margin-bottom: 1px;
}
</style>
