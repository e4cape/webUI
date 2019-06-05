<template>
  <el-row>
    <div class="panel" v-loading="$store.getters.tb_loading">
      <div class="panel-hd">
        <span class="title">质检({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">来源单号</td>
                <td>{{detail.IntakeCode}}</td>
                <td class="tit">送货单号</td>
                <td>{{detail.ExpressCode}}</td>
                <td class="tit">完成时间</td>
                <td>{{detail.CheckTime | filterDateMinutes}}</td>
              </tr>
              <tr>
                <td class="tit">入库数量</td>
                <td>{{detail.ItemQty}}</td>
                <td class="tit">入库重量</td>
                <td>{{$root.toFloat(detail.Weight, 3)}}g</td>
                <td class="tit"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <div class="fr">
            <span class="detail-info-num-item">
              入库数量：
              <b class="num">{{detail.ItemQty}}</b>
            </span>
            <span class="detail-info-num-item">
              入库重量：
              <b class="num">{{$root.toFloat(detail.Weight, 3)}}g</b>
            </span>
            <span class="detail-info-num-item">
              次品数量：
              <b class="num">{{detail.WeekQty}}</b>
            </span>
            <span class="detail-info-num-item">
              次品重量：
              <b class="num">{{$root.toFloat(detail.WeekWgt, 3)}}g</b>
            </span>
          </div>
        </div>
        <div class="p-x-10">
          <el-table
            :data="data"
            class="m-b-10 edit-table"
            element-loading-text="拼命加载中"
            ref="halfTable"
            @current-change="handleCurrentChange"
            highlight-current-row
          >
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column prop="HalfName" label="半成品名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="重量(g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.Weight + 'g'}}</template>
            </el-table-column>
            <el-table-column prop="WeekQty" label="次品数量" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input
                  name="WeekQty"
                  v-model="scope.row.WeekQty"
                  @keyup.native="scope.row.WeekQty = $root.toFixed(scope.row.WeekQty, 0)"
                  @focus="handleFocus(scope.row)"
                  maxlength="9"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.WeekQty" :precision="0" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="WeekWgt" label="次品重量" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input
                  name="WeekWgt"
                  v-model="scope.row.WeekWgt"
                  @keyup.native="scope.row.WeekWgt = $root.toFixed(scope.row.WeekWgt, 3)"
                  @focus="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
                <!-- <el-input-number v-model="scope.row.WeekWgt" :precision="3" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
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
      <el-button name="btnSave" type="primary" @click="save" :loading="loading" v-if="isSaved">保存</el-button>
      <el-button name="btnSubmit" type="primary" @click="submit" v-else>完成并提交</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </el-row>
  </el-row>
</template>

<script>
import {
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_GET,
  STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_FINISHQUALITY,
  STOCKING_API_HALF_INTAKE_ORDER_ITEM_QUALITY
} from '@/apis/stocking'
import { HalfIntakeOrderBasicQualityState } from '@/enums/stocking'
import { YNStatus } from '@/enums/common'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      HalfIntakeOrderBasicQualityState,
      detail: {
        state: 1,
        largeType: 1
      },
      data: [],
      total: 0,
      parameters: {
        IntakeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      currentRow: {},
      isSaved: false,
      loading: false
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_GET({
        IntakeId: this.parameters.IntakeId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
        }
      })
    },
    getData() {
      STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
          this.data.forEach(item => {
            item.Weight = this.$root.toFloat(item.Weight, 3)
            item.WeekWgt = this.$root.toFloat(item.WeekWgt, 3)
          })
        }
      })
    },
    handleCurrentChange(row, oldRow) {
      this.currentRow = row ? row : oldRow
      this.isSaved = true
      if (oldRow) {
        if (row === null) {
          return
        }
        // if (oldRow.WeekQty == 0 || oldRow.WeekWgt == 0) {
        //   return this.$message.error('次品数量和次品重量不能为零')
        // }
        if (oldRow.WeekQty > oldRow.Quantity) {
          return this.$message.error('次品数量不能大于入库数量')
        }
        if (oldRow.WeekWgt > parseFloat(oldRow.Weight)) {
          return this.$message.error('次品重量不能大于入库重量')
        }
        this.loading = true
        STOCKING_API_HALF_INTAKE_ORDER_ITEM_QUALITY({
          ItemId: oldRow.ItemId,
          IntakeId: oldRow.IntakeId,
          Quantity: oldRow.WeekQty,
          Weight: oldRow.WeekWgt
        }).then(res => {
          this.loading = false
          if (res.data.Code === 'CORRECT') {
            this.$message.success('保存成功')
            this.getDetail()
          }
        })
      }
    },
    handleFocus(row) {
      this.$refs.halfTable.setCurrentRow(row)
      this.isSaved = true
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
    save() {
      // if (this.currentRow.WeekQty == 0 || this.currentRow.WeekWgt == 0) {
      //   return this.$message.error('次品数量和次品重量不能为零')
      // }
      console.log(this.currentRow.WeekWgt, this.currentRow.Weight)
      if (this.currentRow.WeekQty > this.currentRow.Quantity) {
        return this.$message.error('次品数量不能大于入库数量')
      }
      if (this.currentRow.WeekWgt > parseFloat(this.currentRow.Weight)) {
        return this.$message.error('次品重量不能大于入库重量')
      }
      this.loading = true
      STOCKING_API_HALF_INTAKE_ORDER_ITEM_QUALITY({
        ItemId: this.currentRow.ItemId,
        IntakeId: this.parameters.IntakeId,
        Quantity: parseInt(this.currentRow.WeekQty),
        Weight: this.$root.toInt(this.currentRow.WeekWgt)
      }).then(res => {
        this.loading = false
        if (res.data.Code === 'CORRECT') {
          this.$message.success('保存完成')
          this.getDetail()
          this.isSaved = false
        }
      })
    },
    submit() {
      // 完成并提交
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_FINISHQUALITY({
        items: [{ IntakeId: this.parameters.IntakeId }]
      }).then(res => {
        this.loading = false
        if (res.data.Code === 'CORRECT') {
          this.$message.success('提交完成')
          this.$router.push('/purchase/semifinishedQuality/index')
        }
      })
    }
  },
  created() {
    this.parameters.IntakeId = parseInt(this.$route.query.id)
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
</style>
