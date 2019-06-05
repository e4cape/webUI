<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看委外加工发料单</span>
        <!-- <span @click="$router.back(-1)" class="title text-btn fr">返回</span> -->
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" colspan="1" class="state-img">
                  <img src="@/assets/images/draft.png" v-if="detail.State === weiwStuffSendBasicState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === weiwStuffSendBasicState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === weiwStuffSendBasicState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === weiwStuffSendBasicState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === weiwStuffSendBasicState.Abandon || detail.State === weiwStuffSendBasicState.Cancel">
                  <div>{{weiwStuffSendBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.SendCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === weiwStuffSendBasicState.Audit || detail.State === weiwStuffSendBasicState.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">仓库</td>
                <td>{{detail.WarehouseName}}{{detail.ShelfName?'>'+detail.ShelfName:''}}</td>
                <td class="tit">加工原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="m-10">
          <ul class="tabs m-b-1">
            <li class="tab" :class="{active: currTabs == StuffType.Gold}" @click="changeTabs(StuffType.Gold)">金料</li>
            <li class="tab" :class="{active: currTabs == StuffType.Stone}" @click="changeTabs(StuffType.Stone)">石料</li>
            <li class="tab" :class="{active: currTabs == StuffType.Part}" @click="changeTabs(StuffType.Part)">配件</li>
          </ul>
          <el-table :data="tableData" element-loading-text="拼命加载中">
            <el-table-column prop="ItemId" label="序号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Gold" key="100" prop="GoldType" label="成色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.goldType.Types[scope.row.GoldType]}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="200" prop="StoneClassTypeEv" label="石类" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="201" prop="StonePackageNo" label="石号/包号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="202" prop="StoneWeightEv" label="石重范围" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="203" prop="StoneColor" label="颜色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.StoneColor?StoneColor.Types[scope.row.StoneColor]:''}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="204" prop="StoneClarity" label="净度" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.StoneClarity?StoneClarity.Types[scope.row.StoneClarity]:''}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="205" prop="StoneCut" label="切工" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{StoneCut.Types[scope.row.StoneCut]}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="206" prop="StoneSpec" label="规格" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Part" key="300" prop="PartTypeEv" label="配件名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="重量" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight, 3)}}{{currTabs == StuffType.Stone? 'ct':'g'}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
            
            <el-table-column v-if="currTabs == StuffType.Stone" key="208" prop="StonePrice2" label="重单价" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.StonePrice2)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="207" prop="StonePrice1" label="数单价" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.StonePrice1)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Part" key="302" prop="PartPrice2" label="重单价" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.PartPrice2)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Part" key="301" prop="PartPrice1" label="数单价" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.PartPrice1)}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Gold" key="101" prop="GoldPrice" label="金价(元/克)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.GoldPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="Price" label="金额" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.Price)}}
              </template>
            </el-table-column>
          </el-table>
          <pagination :pg="parameters.PageIndex" :size="parameters.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template>
        <router-link v-if="detail.State == weiwStuffSendBasicState.Draft||detail.State == weiwStuffSendBasicState.Reject" :to="{path:'/depot/outSSend/edit',query:{id:detail.SendId}}">
          <el-button type="primary">编辑</el-button>
        </router-link>
      </template>
      <el-button v-if="detail.State == weiwStuffSendBasicState.Wait" type="primary" @click="auditDialog = true">审核</el-button>
      <el-button v-if="detail.State == weiwStuffSendBasicState.Audit" @click="cancelDialog = true">取消审核</el-button>
      <el-button v-if="detail.State == weiwStuffSendBasicState.Draft||detail.State == weiwStuffSendBasicState.Reject" @click="abandonDialog = true">作废</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- @module Dialog·审核 -->
    <auditDialog title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="[detail]" @listenAuditDialog="listenAuditDialog"></auditDialog>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandonDialog title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="[detail]" @listenAbandonDialog="listenAbandonDialog"></abandonDialog>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancelDialog title="取消审核" v-if="cancelDialog" :cancelDialog="cancelDialog" :data="[detail]" @listenCancelDialog="listenCancelDialog"></cancelDialog>
    <!-- End Dialog·取消审核 -->
  </div>
</template>

<script>
import {
  WeiwStuffSendBasicState,
  StoneColor,
  StoneClarity,
  StoneCut
} from '@/enums/stocking.js'
import {
  StuffType,
  YNStatus
} from '@/enums/common.js'
import {
  STOCKING_API_WEIW_STUFF_SEND_BASIC_GET,
  STOCKING_API_WEIW_STUFF_SEND_ITEM_GETS
} from '@/apis/stocking.js'

import abandonDialog from './abandon'
import auditDialog from './audit'
import cancelDialog from './cancel'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      YNStatus,
      StuffType,
      StoneColor,
      StoneClarity,
      StoneCut,
      tableData: [], // 货品数据
      weiwStuffSendBasicState: WeiwStuffSendBasicState,
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      indexPageSize: 20, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      SendId: '',
      detail: {},
      currTabs: StuffType.Gold,
      total: 0,
      parameters: {
        PageIndex: 1,
        PageSize: 20
      },
      goodsId: '', // 选中的货品id
      editDialog: false,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.SendId = Number(query.id)||0
      if (!this.SendId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
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
      STOCKING_API_WEIW_STUFF_SEND_BASIC_GET({
        SendId: this.SendId
      }).then(res => {
        if(res.data.Code === 'CORRECT'){
          this.detail = res.data.Data
          this.editForm = Object.assign({}, this.detail)
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_WEIW_STUFF_SEND_ITEM_GETS({
        SendId: this.SendId, 
        StuffType: this.currTabs,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.parameters.PageIndex,
        PageSize: this.parameters.PageSize
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if(res.data.Code == 'CORRECT'){
          this.tableData = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
      })
    },
    changeTabs(type){
      this.currTabs = type
      this.parameters.PageIndex = 1
      this.parameters.PageSize = 20
      this.total = 0
      this.getGoods()
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
      this.parameters.PageIndex = val,
      this.getGoods()
    },
    sizeChange(val){
      this.parameters.PageIndex = 1,
      this.parameters.PageSize = val
      this.getGoods()
    },
    getEnums() {
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_STONE_TYPE')
      this.$store.dispatch('GET_PART_TYPE')
      this.$store.dispatch('GET_STONEWEIGHT')
    },
  },
  created(){
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  components:{
    abandonDialog,
    auditDialog,
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
