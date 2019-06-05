<template>
  <el-row>
    <el-form :model="queryForm" label-width="100px" ref="queryForm" :inline="true" class="item-lh-26 p10">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="进货时间：" prop="CreateTime">
            <el-date-picker name="CreateTime" v-model="queryForm.CreateTime" @change="onSearch" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="进货单号：" prop="StoreStyleNumber">
            <el-input name="StoreStyleNumber" v-model="queryForm.StoreStyleNumber" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <p class="fr m-t-10 grey">注：以下统计为整个公司的进货数量和总库存</p>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20" class="total-panel m-b-10">
      <el-col :span="4">
        <div class="total qty">
          <div class="number">{{summary.TotalSaleNum || 0}}</div>
          <div class="name">进货数量</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="total qty">
          <div class="number">{{summary.TotalSaleNum || 0}}</div>
          <div class="name">当前库存数量</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="total weight">
          <div class="number">{{summary.TotalGoldWeight || 0}}g</div>
          <div class="name">进货金重</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="total weight">
          <div class="number">{{summary.TotalGoldWeight || 0}}g</div>
          <div class="name">当前库存金重</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="total price">
          <div class="number">￥{{summary.TotalApplyAmount || 0}}</div>
          <div class="name">进货金额(标签价)</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="total price">
          <div class="number">￥{{summary.TotalApplyAmount || 0}}</div>
          <div class="name">当前库存金额(标签价)</div>
        </div>
      </el-col>
    </el-row>
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="StoreBarCode" label="条码" sortable="custom" min-width="120" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="StoreStyleNumber" label="款号" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Weight" label="货重" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoldWeight" label="净金重" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StoneWeight" label="主石重" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StoneWeight" label="标签价" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sTime" label="进货时间" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sTime" label="进货入库单号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sTime" label="进货数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sTime" label="零售数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sTime" label="退货数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sTime" label="报损数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sTime" label="报溢数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sTime" label="当前库存" sortable="custom" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sTime" label="最后操作时间" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
    </el-table>
  </el-row>
</template>

<script>
import {
  STOCKING_API_REPORT_BYSTOCKQTYTURNOVER,
} from '@/apis/stocking'
import {
  YNStatus
} from '@/enums/common'
export default {
  data() {
    return {
      summary: {
      },
      queryForm: {
        StoreStyleNumber: '',
        CreateTime: [],
        OrderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {
      },
      data: [],
      total: 0
    }
  },
  methods: {
    getData() {
      let createTime =  this.queryForm.CreateTime && this.queryForm.CreateTime.length ? this.queryForm.CreateTime : [
        '1900-01-01',
        '1900-01-01'
      ]
      let lastSaleTime = this.queryForm.LastSaleTime && this.queryForm.LastSaleTime.length ? this.queryForm.LastSaleTime : [
        '1900-01-01',
        '1900-01-01'
      ]
      this.$store.commit('SET_TB_LOADING', true)
      this.queryForm = Object.assign(this.queryForm, this.parameters, {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        LastSaleTime1: lastSaleTime[0],
        LastSaleTime2: lastSaleTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_BYSTOCKQTYTURNOVER(
        this.queryForm
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
          this.total = this.data.length && this.data[0].TOTALCOUNT
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sortChange(sort) {
      // 0=入库日期 1==条码 2==款号 3==最近销售日期
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'StoreBarCode':
          this.queryForm.OrderBy = 1
          break
        case 'StoreStyleNumber':
          this.queryForm.OrderBy = 2
          break
        case 'LastSaleTime':
          this.queryForm.OrderBy = 3
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsc = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    onSearch() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.queryForm.PageIndex = 1
          this.parameters = JSON.parse(JSON.stringify(this.queryForm))
          this.getData()
        }
      })
    },
  },
  beforeMount() {
  },
  mounted() {
    this.getData()
  },
  watch: {
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
.grey {
  color: #aaa;
}
</style>