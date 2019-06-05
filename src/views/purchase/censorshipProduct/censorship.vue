<template>
  <el-row>
    <div class="panel">
      <div class="panel-hd">
        <span class="title">送检({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">来源</td>
                <td>{{GoodsQualityOrderBasicQualityType.Types[detail.QualityType]}}</td>
                <td class="tit">来源单号</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">送货单号</td>
                <td>{{detail.ExpressCode}}</td>
              </tr>
              <tr>
                <td class="tit">完成时间</td>
                <td>{{detail.SendTime | filterDateMinutes}}</td>
                <td class="tit"></td>
                <td></td>
                <td class="tit"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <!-- <el-button type="primary" @click="batchCensorship($event, true)" name="btnBatchCensorship">批量送检</el-button>
          <el-button @click="batchCensorship($event, false)" name="btnOffBatchCensorship">批量不送检</el-button>-->
          <div class="fr">
            <span class="detail-info-num-item">
              一码一货数量：
              <b class="num">{{perYard || '-'}}</b>
            </span>
            <span class="detail-info-num-item">
              送检数量：
              <b class="num">{{detail.SendQty || '-'}}</b>
            </span>
          </div>
        </div>
        <div class="p-x-10">
          <el-table
            class="m-b-10 edit-table"
            ref="sentTable"
            :data="data"
            v-loading="$store.getters.tb_loading"
            element-loading-text="拼命加载中"
            @selection-change="handleSelectionChange"
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <!-- <el-table-column type="selection" width="45"></el-table-column> -->
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="BarCode" label="条码" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="StyleCode" label="款号" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="货重" min-width="60" show-overflow-tooltip>
              <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
            </el-table-column>
            <el-table-column prop="Stone1Color" label="主石颜色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{stoneColor.Types[scope.row.Stone1Color]}}</template>
            </el-table-column>
            <el-table-column prop="Stone1Clarity" label="主石净度" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{stoneClarity.Types[scope.row.Stone1Clarity]}}</template>
            </el-table-column>
            <el-table-column prop="Stone1Cut" label="主石切工" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{stoneCut.Types[scope.row.Stone1Cut]}}</template>
            </el-table-column>
            <el-table-column prop="GoodQty" label="质检情况" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.WeekQty > 0 ? '次品' : '良品'}}</template>
            </el-table-column>
            <!-- <el-table-column prop="Cert1Number" label="是否有证书" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.Cert1Number && scope.row.Cert2Number ? '有' : '无'}}
              </template>
            </el-table-column>-->
            <el-table-column prop="IsSended" label="是否送检" min-width="120">
              <template slot-scope="scope">
                <el-select
                  filterable
                  name="IsSended"
                  v-model="scope.row.IsSended"
                  placeholder="请选择"
                  @change="handleFocus(scope.row)"
                >
                  <el-option label="送检" :value="YNStatus.Yes"></el-option>
                  <el-option label="不送检" :value="YNStatus.No"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="SendNote" label="备注" min-width="120">
              <template slot-scope="scope">
                <el-input
                  name="SendNote"
                  v-model="scope.row.SendNote"
                  @input="handleFocus(scope.row)"
                  :maxlength="200"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :pg="parameters.PageIndex"
            :size="parameters.PageSize"
            :total="total"
            @currentChange="currentChange"
            @sizeChange="sizeChange"
          ></pagination>
        </div>
      </div>
    </div>
    <el-row style="margin-top: 10px; text-align: left; border: 0;">
      <el-button name="save" type="primary" @click="save" v-if="isSaved" :loading="saveLoading">保存</el-button>
      <el-button name="btnCompleted" type="primary" v-else @click="orderSubmit($event)">完成并提交</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
      <p class="fr">注：仅支持一码一货的货品送检</p>
    </el-row>
  </el-row>
</template>

<script>
import {
  GoodsQualityOrderBasicQualityType,
  GoodsQualityOrderBasicStepState,
  GoodsType,
  StoneColor,
  StoneClarity,
  StoneCut
} from '@/enums/stocking'
import { YNStatus } from '@/enums/common'
import {
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATESEND
} from '@/apis/stocking'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      YNStatus,
      GoodsQualityOrderBasicStepState,
      GoodsQualityOrderBasicQualityType,
      stoneColor: StoneColor,
      stoneClarity: StoneClarity,
      stoneCut: StoneCut,
      detail: {},
      perYard: 0, // 一码一货数量
      data: [],
      parameters: {
        QualityId: '',
        GoodsType: GoodsType.Single,
        IsSended: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      selectedId: [],
      total: 0,
      currentRow: {},
      isSaved: false,
      saveLoading: false
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET({
        QualityId: this.parameters.QualityId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
        }
      })
    },
    getData() {
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.perYard = res.data.Data.Count
          this.total = res.data.Data.Count
        }
      })
    },
    batchCensorship($event, flag) {
      // 是否批量送检
      $event.currentTarget.blur()
      let str
      if (flag) {
        str = ''
      } else {
        str = '不'
      }
      this.$confirm(`是否${str}送检?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '送检成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消送检'
          })
        })
    },
    handleFocus(row) {
      this.$refs.sentTable.setCurrentRow(row)
      this.isSaved = true
    },
    handleCurrentChange(row, oldRow) {
      this.currentRow = row ? row : oldRow
      if (oldRow) {
        this.saveLoading = true
        STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATESEND({
          QualityId: this.parameters.QualityId,
          Items: [
            {
              ItemId: oldRow.ItemId,
              IsSended: oldRow.IsSended,
              SendNote: oldRow.SendNote
            }
          ]
        }).then(res => {
          this.saveLoading = false
          if (res.data.Code === 'CORRECT') {
            this.getDetail()
            this.$message.success(res.data.Message)
          }
        })
      }
    },
    save() {
      if (JSON.stringify(this.currentRow) !== '{}') {
        this.saveLoading = true
        STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATESEND({
          QualityId: this.parameters.QualityId,
          Items: [
            {
              ItemId: this.currentRow.ItemId,
              IsSended: this.currentRow.IsSended,
              SendNote: this.currentRow.SendNote
            }
          ]
        }).then(res => {
          this.saveLoading = false
          if (res.data.Code === 'CORRECT') {
            this.$message.success('保存成功')
            this.getDetail()
            this.isSaved = false
          }
        })
      }
    },
    orderSubmit($event) {
      $event.currentTarget.blur()
      this.$confirm('是否提交送检?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
            QualityId: this.parameters.QualityId,
            SendState: GoodsQualityOrderBasicStepState.Finish
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.$router.push('/purchase/censorshipProduct/index')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          })
        })
    },
    handleSelectionChange(val) {
      this.selectedId = []
      val.forEach(item => {
        this.selectedId.push(item.QualityId)
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
    }
  },
  created() {
    this.parameters.QualityId = parseInt(this.$route.query.id)
    this.getDetail()
  },
  mounted() {
    this.getData()
  },
  components: {
    pagination
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.num-statistical {
  float: right;
  font-size: 14px;
  span + span {
    margin-left: 10px;
  }
  i {
    font-size: 18px;
    font-style: normal;
  }
}
</style>
