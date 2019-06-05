<template>
  <el-row class="content">
    <div class="panel">
      <div class="panel-hd">
        <!-- <el-tooltip :content="'（'+stuffType.Types[$route.query.StuffType]+'）盘点（位置：'+(detail.WarehouseName || '仓库') + '，范围：' + arroundType +'）'" v-if="arroundType&&arroundType.length > 50" placement="bottom" effect="light">
          <span class="title">({{stuffType.Types[$route.query.StuffType]}})盘点（位置：{{detail.WarehouseName || '仓库'}}，范围：{{arroundType}}）</span>
        </el-tooltip> -->
        <span class="title">查看盘点单（{{stuffType.Types[$route.query.StuffType]}}）</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="3" class="state-img">
                  <img src="@/assets/images/taking.png" v-if="detail.State === stuffCountOrderBasicState.Taking">
                  <img src="@/assets/images/audited.png" v-if="detail.State === stuffCountOrderBasicState.Finish">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === stuffCountOrderBasicState.Cancel">
                  <div>{{stuffCountOrderBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.CountCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">结束</td>
                
                <td v-if="detail.State !== stuffCountOrderBasicState.Taking">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">盘点位置</td>
                <td>{{detail.WarehouseName}} > {{detail.PositionNote}}</td>
                <td class="tit">盘点范围</td>
                <td colspan="4">{{arroundType}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <!-- <i class="icon-list"></i> -->
              <span class="title">货品列表</span>
            </el-col>
            <el-col :span="12" class="count">
              <span class="detail-info-num-item">
                应盘：<b class="num">{{detail.Quantity1}}/{{$root.toFloat(detail.Weight1,3)}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</b>
              </span>
              <span class="detail-info-num-item">
                实盘：<b class="num">{{detail.Quantity2}}/{{$root.toFloat(detail.Weight2,3)}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</b>
              </span>
              <span class="detail-info-num-item">
                盘亏：<b class="num">{{detail.Quantity3}}/{{$root.toFloat(detail.Weight3,3)}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</b>
              </span>
              <span class="detail-info-num-item">
                盘盈：<b class="num">{{detail.Quantity4}}/{{$root.toFloat(detail.Weight4,3)}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <!-- Data Table -->
        <div class="p-x-10">
          <el-table :data="dataTable" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column v-if="$route.query.StuffType == stuffType.Gold" :key="10" prop="GoldType" label="成色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.goldType.Types[scope.row.GoldType]}}
              </template>
            </el-table-column>
            <el-table-column v-if="$route.query.StuffType == stuffType.Stone" :key="11" prop="StoneClassTypeEv" label="石类" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="$route.query.StuffType == stuffType.Stone" :key="12" prop="StonePackageNo" label="包号/石号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="$route.query.StuffType == stuffType.Part" :key="13" prop="PartTypeEv" label="配件名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity1" label="应盘数量" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight1" label="应盘重量" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.Weight1}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity2" label="实盘数量" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight2" label="实盘重量" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.Weight2}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}
              </template>
            </el-table-column>
          </el-table>
          <!-- Pagination -->
          <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
        </div>
      </div>
    </div>
    <el-row class="buttons">
      <el-col :span="11">
        <template v-if="detail.State === stuffCountOrderBasicState.Taking">
          <router-link :to="{path:'/depot/taking/edit',query:{id: CountId,StuffType:$route.query.StuffType}}" name="btnTakingEdit">
            <el-button type="primary">
              继续盘点
            </el-button>
          </router-link>
          <el-button @click="takingCancel($event)" name="btnTakingCancel">取消盘点</el-button>
        </template>
        <el-button type="primary" @click="takingLogVisible = true" v-if="detail.State === stuffCountOrderBasicState.Finish" name="btnReport">盘点报告</el-button>
        <el-button @click="$router.back(-1)">返回</el-button>
      </el-col>
      <el-col :span="13">
        <span class="red tr">
          注：“应盘数量”是创建盘点单时的账面库存数量，盘点的过程中出入库不改变该数量。
        </span>
      </el-col>
    </el-row>
    <!-- @module 盘点报告 -->
    <taking-log title="盘点报告" v-if="takingLogVisible" :takingLogVisible.sync="takingLogVisible" :takingData="detail" @listenLogDialog="listenLogDialog"></taking-log>
    <!-- End 盘点报告 -->
  </el-row>
</template>

<script>
import {
  StuffCountOrderBasicState
} from '@/enums/stocking.js'
import {
  StuffType,
  YNStatus
} from '@/enums/common.js'
import {
  STOCKING_API_STUFF_COUNT_ORDER_BASIC_GET,
  STOCKING_API_STUFF_COUNT_ORDER_ITEM_GETS,
  STOCKING_API_STUFF_COUNT_ORDER_BASIC_CANCEL
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import takingLog from './takingLog'

export default {
  data() {
    return {
      YNStatus,
      stuffType: StuffType,
      stuffCountOrderBasicState: StuffCountOrderBasicState,
      CountId: '',
      detail: {
      },
      dataTable: [],
      pg: 1,
      size: 20,
      total: 0,
      totalCount: {
        TotalGoodsQty: '',
        TotalFinanceQty: '',
        TotalTakingQty: '',
        TotalLossQty: '',
        TotalOverQty: ''
      },
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      takingLogVisible: false, // 盘点报告弹窗
      printDialog: false
    }
  },
  computed: {
    arroundType() {
      let result = []
      let arr = []
      
      switch (Number(this.$route.query.StuffType)) {
        case this.stuffType.Gold:
          arr = this.detail.GoldTypes ? this.detail.GoldTypes.split(',') : []
          arr.forEach(a => {
            if(this.$store.getters.goldType.Types[a]){
              result.push(this.$store.getters.goldType.Types[a])
            }
          })
          break
        case this.stuffType.Stone:
          return typeof this.detail.StoneClassTypeEvs=='string'?this.detail.StoneClassTypeEvs.replace(/^,/,''):''
        case this.stuffType.Part:
          return typeof this.detail.PartTypeEvs=='string'?this.detail.PartTypeEvs.replace(/^,/,''):''
        default:
          break
      }
      return result.join('，') || '全部'
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.pg = query.pg || '1'
      this.size = query.size || '20'
      this.CountId = query.id
      if (!this.CountId) {
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
      STOCKING_API_STUFF_COUNT_ORDER_BASIC_GET({
        CountId: this.CountId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.getGoods()
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_STUFF_COUNT_ORDER_ITEM_GETS({
        CountId: this.CountId,
        DelfId: 0,
        State: this.detail.State,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dataTable = res.data.Data.Rows||[]
          this.dataTable.forEach(item => {
            item.Weight1 = this.$root.toFloat(item.Weight1,3)
            item.Weight2 = this.$root.toFloat(item.Weight2,3)
          })
          
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    listenLogDialog() {
      this.takingLogVisible = false
    },
    takingCancel($event) {
      $event.currentTarget.blur()
      this.$confirm('确定取消盘点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        STOCKING_API_STUFF_COUNT_ORDER_BASIC_CANCEL({
          CountId: this.detail.CountId,
          CheckNote: this.detail.CheckNote,
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message(res.data.Message, 'success')
            this.init()
          }
        })
      })
        .catch(() => {})
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
    },
    getStoreAllType() {
      this.$store.dispatch('GET_GOLD_TYPE')
    },
    pageChange(val) {
      this.pg = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.pg = 1
      this.size = val
      this.getGoods()
    },
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    takingLog
  },
  watch: {
    $route() {
      let query = this.$route.query
      this.pg = query.pg || '1'
      this.size = query.size || '20'
      this.getGoods()
    }
  }
}
</script>

<style lang="scss" scoped>
.count {
  padding-right: 15px;
  line-height: 36px;
  text-align: right;
  font-size: 14px;
}
</style>
