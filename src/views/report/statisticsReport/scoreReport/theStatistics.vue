
<template>
  <div class="statement">
    <el-form
      :model="form"
      ref="search"
      label-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item
            label="时间："
            prop="CreateTime"
          >
            <el-date-picker
              name="CreateTime"
              type="daterange"
              v-model="form.CreateTime"
              value-format="yyyy-MM-dd"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :unlink-panels="true"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            name="storeCode"
            label="门店编码："
            :maxlength="50"
            prop="storeCode"
            @keyup.native.enter="onSearch"
          >
            <el-input
              name="inputStoreCode"
              v-model="form.storeCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            name="storeName"
            label="门店名称："
            :maxlength="50"
            prop="storeName"
            @keyup.native.enter="onSearch"
          >
            <el-input
              name="inputStoreName"
              v-model="form.storeName"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店类型："
            prop="storeType"
          >
            <el-select
              name="storeType"
              v-model="form.storeType"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                v-for="item in EnumStoreType.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnonSearch" type="primary" @click="onSearch">搜索</el-button>
          <el-button name="btnonReset" type="default" @click="onReset">重置</el-button>
          <el-button
            name="btnExport"
            @click="eOpen = true"
          >导出</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="total">
      <ul
        class="clearfix"
        v-loading="loadingTop"
      >
        <li
          v-for="(item,index) in cardDataTotal"
          :key="index"
        >
          <card
            :name="item.name"
            :num="item.num"
          ></card>
        </li>
      </ul>
    </div>
    <el-table
      :data="tableData"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="门店编码"
        prop="storeCode"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="门店名称"
        prop="storeName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="门店类型"
        prop="storeTypeText"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="积分赠送数量"
        prop="scoreGiveTotal"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="礼金赠送数量"
        prop="goldenRiceGiveTotal"
        min-width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="积分兑换数量"
        prop="scoreExchangeTotal"
        min-width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="礼金兑换数量"
        prop="goldenRiceExchangeTotal"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <div class="p-t-10">
      <p>赠送数量 = 销售赠送 + 手工赠送 + 历史积分 - 销售退货 - 手工扣减 - 赠送到期</p>
      <p class="p-t-10">兑换数量 = 礼品兑换 - 取消礼品订单 - 作废礼品订单</p>
    </div>
    <export-field-setter @submit="handleSubmit" :visible.sync="eOpen" :apiKey="apiKey" :api="eApi" :uploading="uploading"/>
  </div>
</template>
<script>
import {
  MEMBERSHIP_API_REPORTMEMBERBALANCELOG_COUNTPOINTS, // 列表
  MEMBERSHIP_API_STOREEXPORTER_GETEXPORTFIELDS,
  MEMBERSHIP_API_STOREEXPORTER_EXPORTTOFILE
} from '@/apis/membership'

import { DOMAIN_TEMP } from '@/configs/appSettings'
import { StoreType, CharacterType } from '@/enums/common'
import card from '../templateCard'
import ExportFieldSetter from '@/components/exportFieldSetter'

let date = new Date()
export default {
  data() {
    return {
      characterType: CharacterType,
      loadingTop: false,
      cardDataTotal: [
        {
          name: '积分赠送数量',
          num: ''
        },
        {
          name: '礼金赠送数量',
          num: ''
        },
        {
          name: '积分兑换数量',
          num: ''
        },
        {
          name: '礼金兑换数量',
          num: ''
        }
      ],
      // 表格分页相关
      form: {
        CreateTime: [],
        storeCode: '', // 门店编码
        storeName: '', // 门店名称
        storeType: '', // 门店类型
        scoreType: '' // 变动类型
      },
      parameter: {},
      tableData: [],
      apiKey: 'REPORTMEMBERBALANCELOG_COUNTPOINTS',
      eOpen: false,
      eApi: MEMBERSHIP_API_STOREEXPORTER_GETEXPORTFIELDS,
      uploading: false
    }
  },
  computed: {
    EnumStoreType() {
      return StoreType
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  methods: {
    // 表格分页相关
    init() {
      const { query } = this.$route
      this.parameter.CreateTime = query.CreateTime || [this.$options.filters.filterAllDate(`${date.getFullYear()}-${date.getMonth()+1}-01`), this.$options.filters.filterAllDate(Date.parse(`${date.getFullYear()}-${date.getMonth()+2}-01`)-24*3600*1000)]
      this.parameter.storeCode = query.storeCode || ''
      this.parameter.storeName = query.storeName || ''
      this.parameter.storeType = query.storeType || ''
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.loadingTop = true
      const { CreateTime } = this.parameter
      const param = Object.assign(this.form, this.parameter, {
        timeStart: CreateTime[0] || '',
        timeEnd: CreateTime[1] || ''
      })
      MEMBERSHIP_API_REPORTMEMBERBALANCELOG_COUNTPOINTS(param)
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.tableData = res.data.Data || []
            this.getCardDataTotal(this.tableData)
          }
          this.$store.commit('SET_TB_LOADING', false)
          this.loadingTop = false
        })
        .catch(() => (this.loadingTop = false))
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
      this.$refs['search'].resetFields()
      this.form.CreateTime = [this.$options.filters.filterAllDate(`${date.getFullYear()}-${date.getMonth()+1}-01`), this.$options.filters.filterAllDate(Date.parse(`${date.getFullYear()}-${date.getMonth()+2}-01`)-24*3600*1000)]
      this.form.storeType = ''
      this.onSearch()
    },
    getCardDataTotal(tableData) {
      const tableDataArr = tableData
      let scoreGiveTotal = 0,
        goldenRiceGiveTotal = 0,
        scoreExchangeTotal = 0,
        goldenRiceExchangeTotal = 0
      tableDataArr.forEach(item => {
        scoreGiveTotal += item.scoreGiveTotal
        goldenRiceGiveTotal += item.goldenRiceGiveTotal
        scoreExchangeTotal += item.scoreExchangeTotal
        goldenRiceExchangeTotal += item.goldenRiceExchangeTotal
      })
      // 统计总
      const totalArr = [
        scoreGiveTotal,
        goldenRiceGiveTotal,
        scoreExchangeTotal,
        goldenRiceExchangeTotal
      ]
      this.cardDataTotal.map((item, i) => {
        item.num = Math.abs(totalArr[i])
      })
    },
    onSimpleSearch(e) {
      this.parameter.storeType = e
      this.onSearch()
    },
    handleSubmit(exportFields) {
      const apiParameter = this.parameter
      const para = {
        exportFields,
        apiKey: this.apiKey,
        exportType: 1,
        apiParameter
      }
      MEMBERSHIP_API_STOREEXPORTER_EXPORTTOFILE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          setTimeout(() => {
            const downloadUrl = `${DOMAIN_TEMP}${res.data.Data}`
            window.location.href = downloadUrl
            this.eOpen = false
          }, 1000)
        }
      })
    }
  },
  components: {
    card,
    ExportFieldSetter
  }
}
</script>

<style lang="scss" scoped>
.statement {
  .total {
    padding: 10px 0;
    ul {
      li {
        float: left;
        width: 24.25%;
        margin-left: 1%;
        background: $bg-color;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
.item-lh-26 .search-btn {
  width: 240px;
}
</style>
