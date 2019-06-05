<template>
  <el-row class="content">
    <div class="panel">
      <div class="panel-hd no-border-b">
        <el-tooltip class="item" effect="dark" :content="arroundType" placement="top-start">
          <span class="title">({{stuffType.Types[$route.query.StuffType]}})盘点（位置：{{detail.WarehouseName || '仓库'}}，范围：{{arroundType}}）</span>
        </el-tooltip>
        <!-- <span class="fr title">
          <el-button type="text" @click="$router.back(-1)">返回</el-button>
        </span> -->
      </div>
    </div>
    <el-row>
      <el-col class="m-t-10 tab-box" :span="8">
        <el-table :data="takingData" ref="takingPosition" highlight-current-row @current-change="handleCurrentChange">
          <el-table-column prop="ShelfName" label="盘点位置" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Weight1" label="应盘" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.Quantity1}}/{{scope.row.Weight1}}g</template>
          </el-table-column>
          <el-table-column prop="Weight2" label="实盘" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.Quantity2}}/{{scope.row.Weight2}}g</template>
          </el-table-column>
        </el-table>
        <ul class="wrap-box">
          <li class="title">盘点汇总</li>
          <li>应盘：{{gather1}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</li>
          <li>实盘：{{gather2}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</li>
          <li>盘亏：{{gather3}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</li>
          <li>盘盈：{{gather4}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</li>
        </ul>
      </el-col>
      <el-col :span="16">
        <div class="panel m-t-10 m-l-10 no-border-b">
          <div class="panel-hd">
            <span class="title">{{selectedData.ShelfName}}</span>
          </div>
          <div class="panel-bd">
            <el-row class="p-10">
              <el-col :span="4" class="tl">
                <el-popover placement="bottom" width="450" @hide="resetQuickAddForm" v-model="popoverVisible">
                  <el-form :model="quickAddForm" :rules="rules" ref="quickAddForm" label-width="80px" class="demo-quickAddForm">
                    <el-form-item v-if="$route.query.StuffType == stuffType.Gold" label="成色" prop="GoldType" required>
                      <el-select class="w238" v-model="quickAddForm.GoldType" filterable placeholder="请选择">
                        <template v-for="(item, index) in GoldTypes">
                          <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                        </template>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="$route.query.StuffType == stuffType.Stone" label="石料" prop="StoneClassTypeEk" required>
                      <el-select class="w238" v-model="quickAddForm.StoneClassTypeEk" filterable @change="changeStone" placeholder="请选择">
                        <template v-for="(item, index) in StoneTypes">
                          <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                        </template>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="$route.query.StuffType == stuffType.Stone" label="包号/石号" prop="StonePackageNo">
                      <el-input class="w238" :maxlength="30" v-model="quickAddForm.StonePackageNo" @blur="quickAddForm.StonePackageNo = quickAddForm.StonePackageNo.trim()"></el-input>
                    </el-form-item>
                    <el-form-item v-if="$route.query.StuffType == stuffType.Part" label="名称" prop="PartTypeEk" required>
                      <el-select class="w238" v-model="quickAddForm.PartTypeEk" filterable @change="changePart" placeholder="请选择">
                        <template v-for="(item, index) in PartTypes">
                          <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                        </template>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="数量" prop="Quantity2">
                      <el-input v-model="quickAddForm.Quantity2" :maxlength="8" :min="0" class="w238" @keyup.native="quickAddForm.Quantity2=$root.toFixed(quickAddForm.Quantity2,0)"></el-input>
                    </el-form-item>
                    <el-form-item label="重量" prop="Weight2">
                      <el-input v-model="quickAddForm.Weight2" class="w238" :maxlength="10" @keyup.native="quickAddForm.Weight2=$root.toFixed(quickAddForm.Weight2,3)"></el-input>
                    </el-form-item>
                  </el-form>
                  <div style="text-align: right; margin: 0">
                    <el-button type="primary" size="mini" @click="quickAdd('quickAddForm')">确定</el-button>
                    <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
                  </div>
                  <el-button type="primary" slot="reference">快速录入</el-button>
                </el-popover>
              </el-col>
              <el-col :span="20" class="tr">
                <span class="detail-info-num-item">
                  应盘：
                  <b class="num">{{selectedData.Quantity1}}/{{selectedData.Weight1}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</b>
                </span>
                <span class="detail-info-num-item">
                  实盘：
                  <b class="num">{{selectedData.Quantity2}}/{{selectedData.Weight2}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</b>
                </span>
                <span class="detail-info-num-item">
                  盘亏：
                  <b class="num">{{selectedData.Quantity3}}/{{selectedData.Weight3}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</b>
                </span>
                <span class="detail-info-num-item">
                  盘盈：
                  <b class="num">{{selectedData.Quantity4}}/{{selectedData.Weight4}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</b>
                </span>
              </el-col>
            </el-row>
            <!-- Data Table -->
            <el-table :data="dataTable" :row-class-name="tableRowClassName" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
              <el-table-column v-if="$route.query.StuffType == stuffType.Gold" :key="10" prop="GoldType" label="成色" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">{{$store.getters.goldType.Types[scope.row.GoldType]}}</template>
              </el-table-column>
              <el-table-column v-if="$route.query.StuffType == stuffType.Stone" :key="11" prop="StoneClassTypeEv" label="石类" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="$route.query.StuffType == stuffType.Stone" :key="12" prop="StonePackageNo" label="包号/石号" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column v-if="$route.query.StuffType == stuffType.Part" :key="13" prop="PartTypeEv" label="配件名称" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Quantity1" label="应盘数量" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Weight1" label="应盘重量" min-width="80" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Quantity2" label="实盘数量" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input class="init-input" v-model="scope.row.Quantity2" controls-position="right" :maxlength="8" :min="0" @input="enableSubmit = false" @keyup.native="scope.row.Quantity2=$root.toFixed(scope.row.Quantity2,0)" @blur="updateQty(scope.row, scope.$index)" name="Quantity2"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Weight2" label="实盘重量" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input class="init-input" :maxlength="10" v-model="scope.row.Weight2" @input="enableSubmit = false" @keyup.native="scope.row.Weight2=$root.toFixed(scope.row.Weight2,3)" @blur="updateQty(scope.row, scope.$index)" name="Weight2" :controls="false"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="buttons">
      <el-button type="primary" @click="takingCloseVisible = true" :loading="$store.getters.is_loading" name="btnCloseTaking">结束盘点</el-button>
      <el-button type="primary" @click="takingReset" name="takingReset($event)">重新盘点</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>
    <!-- dialog 结束盘点 -->
    <template v-if="takingCloseVisible">
      <taking-close :takingCloseVisible="takingCloseVisible" :lossQty="totalCount" @listenTakingClose="listenTakingClose"></taking-close>
    </template>
    <!-- End 结束盘点 -->
  </el-row>
</template>

<script>
import {
  STOCKING_API_STUFF_COUNT_ORDER_BASIC_GET,
  STOCKING_API_STUFF_COUNT_ORDER_DELF_GETS,
  STOCKING_API_STUFF_COUNT_ORDER_BASIC_RETAKE,
  STOCKING_API_STUFF_COUNT_ORDER_ITEM_CREATE,
  STOCKING_API_STUFF_COUNT_ORDER_ITEM_UPDATE,
  STOCKING_API_STUFF_COUNT_ORDER_ITEM_GETS
} from '@/apis/stocking.js'

import { StuffType, YNStatus } from '@/enums/common.js'

import takingClose from './takingClose'

export default {
  data() {
    return {
      YNStatus,
      CountId: '',
      detail: {},
      code: '',
      takingData: [],
      dataTable: [],
      selectedData: {},
      pg: 1,
      size: 20,
      total: 0,
      stuffType: StuffType,
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
      GoldTypes: [], // 金料下拉
      StoneTypes: [], // 石料下拉
      PartTypes: [], // 配件下拉
      takingCloseVisible: false, // 结束盘点对话框
      multiCodeVisible: false, // 批量录入条码弹窗
      takingAmendVisible: false, // 结束盘点对话框
      enableSubmit: true, // 控制请求一个一个提交
      popoverVisible: false, // 快速录入对话框
      quickAddForm: {
        Weight2: '',
        Quantity2: ''
      }, // 快速录入
      rules: {
        GoldType: [{ required: true, type: 'number', message: '成色不能为空' }],
        StoneClassTypeEk: [
          { required: true, type: 'number', message: '石料不能为空' }
        ],
        StonePackageNo: [{ required: true, message: '包号/石号不能为空' }],
        PartTypeEk: [
          { required: true, type: 'number', message: '配件名称不能为空' }
        ]
      }
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
    },
    gather1() {
      return this.gatherTable(1)
    },
    gather2() {
      return this.gatherTable(2)
    },
    gather3() {
      return this.gatherTable(3)
    },
    gather4() {
      return this.gatherTable(4)
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.pg = query.pg || '1'
      this.size = query.size || '20'
      this.CountId = Number(query.id) || 0
      if (!this.CountId) {
        this.dataError()
      } else {
        this.getDetail().then(() => {
          this.getGoods()
          this.getTotal()
        })
      }
    },
    tableRowClassName(row) {
      if (row.FinanceQty === row.TakingQty) {
        return 'info-row'
      }
      return ''
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
      return STOCKING_API_STUFF_COUNT_ORDER_BASIC_GET({
        CountId: this.CountId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getTotal() {
      STOCKING_API_STUFF_COUNT_ORDER_BASIC_GET({
        CountId: this.CountId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.totalCount = res.data.Data
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      return STOCKING_API_STUFF_COUNT_ORDER_DELF_GETS({
        CountId: this.CountId,
        IsAsced: this.YNStatus.No,
        OrderBy: 0,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.takingData = res.data.Data.Rows || []

          this.takingData.forEach(item => {
            item.Weight1 = this.$root.toFloat(item.Weight1, 3)
            item.Weight2 = this.$root.toFloat(item.Weight2, 3)
            item.Weight3 = this.$root.toFloat(item.Weight3, 3)
            item.Weight4 = this.$root.toFloat(item.Weight4, 3)
          })
          if (this.takingData.length > 0) {
            const arr = Object.keys(this.selectedData)
            if(arr.length>0){  
              this.$refs.takingPosition.setCurrentRow(this.takingData.find(item=>{return item.DelfId == this.selectedData.DelfId}))
            }else{
              this.$refs.takingPosition.setCurrentRow(this.takingData[0])
            }
          }
          // this.selectedData = res.data.Data.Rows[0]
          // this.getCurrShelf()
        }
        this.enableSubmit = true
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    getCurrShelf() {
      STOCKING_API_STUFF_COUNT_ORDER_ITEM_GETS({
        CountId: this.selectedData.CountId,
        DelfId: this.selectedData.DelfId,
        StoneClassTypeEks: this.detail.StoneClassTypeEks.split(','),
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.dataTable = res.data.Data.Rows || []
          this.GoldTypes = []
          this.StoneTypes = []
          this.PartTypes = []
          this.dataTable.forEach(item => {
            item.Weight1 = this.$root.toFloat(item.Weight1, 3)
            item.Weight2 = this.$root.toFloat(item.Weight2, 3)
            switch(Number(this.$route.query.StuffType)){
              case this.stuffType.Gold:
                this.$store.getters.goldType.TypeArray.map(m => {
                  if(m.Id == item.GoldType){
                    this.GoldTypes.push(m)
                  }
                })
                break
              case this.stuffType.Stone:
                this.$store.getters.stone.TypeArray.filter(m => {
                  if(m.Id == item.StoneClassTypeEk){
                    this.StoneTypes.push(m)
                  }
                })
                break
              case this.stuffType.Part:
                this.$store.getters.part.TypeArray.filter(m => {
                  if(m.Id == item.PartTypeEk){
                    this.PartTypes.push(m)
                  }
                })
                break
              default:
                break
            }
          })
          this.total = res.data.Data.Count || 0
          console.log(1, this.GoldTypes, this.StoneTypes, this.PartTypes)
        }
      })
    },
    gatherTable(state) {
      let a1 = 0 // 应盘
      let a2 = 0 // 实盘
      let a3 = 0 // 报损
      let a4 = 0 // 报溢
      let q1 = 0 // 总应盘
      let q2 = 0 // 总实盘
      let q3 = 0 // 总报损
      let q4 = 0 // 总报溢

      for (let i = 0; i < this.takingData.length; i++) {
        a1 += this.takingData[i].Weight1 - 0
        a2 += this.takingData[i].Weight2 - 0
        a3 += this.takingData[i].Weight3 - 0
        a4 += this.takingData[i].Weight4 - 0
        q1 += this.takingData[i].Quantity1
        q2 += this.takingData[i].Quantity2
        q3 += this.takingData[i].Quantity3
        q4 += this.takingData[i].Quantity4
      }
      let endVal
      switch (state) {
        case 1:
          endVal = q1 + '/' + a1
          break
        case 2:
          endVal = q2 + '/' + a2
          break
        case 3:
          endVal = q3 + '/' + a3
          break
        default:
          endVal = q4 + '/' + a4
      }
      return endVal
    },
    changeStone(e) {
      this.$store.getters.stone.TypeArray.forEach(item => {
        if (item.Id == e) {
          this.quickAddForm.StoneClassTypeEv = item.Value
        }
      })
    },
    changePart(e) {
      this.$store.getters.part.TypeArray.forEach(item => {
        if (item.Id == e) {
          this.quickAddForm.PartTypeEv = item.Value
        }
      })
    },
    handleCurrentChange(val) {
      if(val){
        this.selectedData = val
      }
      this.getCurrShelf()
    },
    quickAdd(quickAddForm) {
      this.$refs[quickAddForm].validate(valid => {
        if (valid) {
          if (
            (this.quickAddForm.Quantity2 === 0 &&
              this.quickAddForm.Weight2 === 0) ||
            (!this.quickAddForm.Quantity2 && !this.quickAddForm.Weight2)
          ) {
            return this.$message.error('重量或数量输入错误')
          }
          this.quickAddForm.Quantity2 = Number(this.quickAddForm.Quantity2) || 0
          this.quickAddForm.Weight2 = Number(this.quickAddForm.Weight2) || 0.0
          // this.dataTable.unshift({
          //   ...this.quickAddForm
          // })
          STOCKING_API_STUFF_COUNT_ORDER_ITEM_CREATE({
            CountId: this.CountId,
            DelfId: this.selectedData.DelfId,
            GoldType: this.quickAddForm.GoldType,
            PartTypeEk: this.quickAddForm.PartTypeEk,
            PartTypeEv: this.quickAddForm.PartTypeEv,
            StonePackageNo: this.quickAddForm.StonePackageNo,
            StoneClassTypeEk: this.quickAddForm.StoneClassTypeEk,
            StoneClassTypeEv: this.quickAddForm.StoneClassTypeEv,
            Quantity2: this.quickAddForm.Quantity2,
            Weight2: this.$root.toInt(this.quickAddForm.Weight2)
          }).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$message.success('提交成功！')
              this.popoverVisible = false
              this.getCurrShelf()
            }
          })
        }
      })
    },
    resetQuickAddForm() {
      // 清空数据
      this.quickAddForm = {}
      // 清除验证
      this.$refs.quickAddForm.resetFields()
    },
    listenTakingClose(type, flag) {
      if (flag) {
        this.$router.push({
          path: '/depot/taking/index'
        })
      }
      this[type] = false
    },
    takingReset($event) {
      $event.currentTarget.blur()
      this.$confirm(
        '重新盘点，所有的盘点数量将清空，确定要重新盘点？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          STOCKING_API_STUFF_COUNT_ORDER_BASIC_RETAKE({
            CountId: this.detail.CountId,
            CheckNote: this.detail.Note
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              this.getGoods()
              this.getTotal()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重新盘点'
          })
        })
    },
    updateQty(row, index) {
      let path = ''
      let param = {}
      // 判断创建和更新
      if (row.ItemId) {
        path = STOCKING_API_STUFF_COUNT_ORDER_ITEM_UPDATE
        param = row
      } else {
        path = STOCKING_API_STUFF_COUNT_ORDER_ITEM_CREATE
        param = Object.assign({}, row, {
          CountId: this.takingData[index].CountId,
          DelfId: this.takingData[index].DelfId
        })
      }
      // 防止对数据处理时，双向绑定显示在页面
      let obj = { ...param }
      obj.Weight2 = this.$root.toInt(obj.Weight2)
      obj.Quantity2 = Number(obj.Quantity2) || 0

      this.$store.commit('SET_BTN_LOADING', true)
      path(obj).then(res => {
        setTimeout(() => {
          this.$store.commit('SET_BTN_LOADING', false)
        }, 100)
        if (res.data.Code === 'ERROR') {
          this.$message.error(res.data.Message)
        } else {
          this.$message({
            message: '提交成功！',
            type: 'success'
          })
          this.getGoods()
          this.getTotal()
          this.enableSubmit = true
        }
      })
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
    getEnums() {
      switch (Number(this.$route.query.StuffType)) {
        case this.stuffType.Gold:
          this.$store.dispatch('GET_GOLD_TYPE')
          break
        case this.stuffType.Stone:
          this.$store.dispatch('GET_STONE_TYPE')
          break
        case this.stuffType.Part:
          this.$store.dispatch('GET_PART_TYPE')
          break
        default:
          break
      }
    },
    pageChange(val) {
      this.pg = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.pg = 1
      this.size = val
      this.getGoods()
    }
  },
  beforeMount() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  components: {
    takingClose
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
  white-space: nowrap;
}
.el-input-number {
  width: 100%;
}
.el-table tr.info-row > td,
.el-table tr.info-row {
  background-color: red !important;
}
.tab-box {
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
}
.no-border-b {
  border-bottom: none;
}
.wrap-box {
  padding: 20px 10px;
  line-height: 1.5;
  font-size: $base-font;
  color: $gray;
  .title {
    font-weight: bold;
    padding-bottom: 5px;
  }
}
.w238 {
  width: 238px;
}
</style>
