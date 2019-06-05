<template>
  <div class="content">
    <div v-if="goodsSourceType === SettingParameterGoodsSourceType.MarketingCloud">
      <el-form :model="form" ref="search" class="item-lh-26" :inline="true">
        <search-panel @onSearch="advancedSearch" @onReset="reset">
          <template slot="btnBox">
            <el-form-item>
              <el-button name="btnAdd" type="primary" @click="$router.push('/market/product/add')">添加</el-button>
            </el-form-item>
            <el-form-item class="del-btn">
              <el-button name="btnBatchDelete" class="btn-color-r" @click="batchDelete">删除</el-button>
            </el-form-item>
          </template>
          <template slot="simpleSearch">
            <el-form-item prop="ProductNO">
              <el-input name="ProductNO" v-model="form.ProductNO" placeholder="请输入条码" @keyup.enter.native="search">
                <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </el-form-item>
          </template>
          <template slot="seniorSearch">
            <el-form-item label="条码：" prop="ProductNO">
              <el-input name="ProductNO" v-model="form.ProductNO" @keyup.enter.native="advancedSearch"></el-input>
            </el-form-item>
            <el-form-item label="商品名称：" prop="ProductTitle">
              <el-input name="ProductTitle" v-model="form.ProductTitle" @keyup.enter.native="advancedSearch"></el-input>
            </el-form-item>
            <el-form-item label="证书编号：" prop="CertSeriesID">
              <el-input name="CertSeriesID" v-model="form.CertSeriesID" @keyup.enter.native="advancedSearch"></el-input>
            </el-form-item>
            <el-form-item label="材质类型：" prop="MaterialType">
              <el-select name="selectMaterialType" v-model="form.MaterialType">
                <el-option :value="0" label="全部"></el-option>
                <el-option v-for="(item, index) in $store.getters.materialType.Types" :key="item" :value="parseInt(index)" :label="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item name="datePickerPacreateTimeRange" label="日期：" prop="PacreateTimeRange">
              <el-date-picker
                v-model="form.PacreateTimeRange"
                type="daterange"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="$root.datePickerOptions"
                @change="dateChange"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item v-show="false" prop="CreateTime1">
              <el-input name="CreateTime1" v-model="form.CreateTime1"></el-input>
            </el-form-item>
            <el-form-item v-show="false" prop="CreateTime2">
              <el-input name="CreateTime2" v-model="form.CreateTime2"></el-input>
            </el-form-item>
          </template>
        </search-panel>
      </el-form>
      <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column prop="ProductId" type="selection" width="40"></el-table-column>
        <el-table-column prop="ProductNO" label="条码" width="120" show-overflow-tooltip fixed></el-table-column>
        <el-table-column prop="ProductTitle" label="商品名称" width="160" show-overflow-tooltip fixed></el-table-column>
        <el-table-column prop="CertSeriesID" label="证书号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="MaterialType" label="材质类型" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoldType" label="品类" :formatter="formatter" width="160"></el-table-column>
        <el-table-column prop="GoldWeight" label="金重(克)" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SpecTitle" label="规格" show-overflow-tooltip></el-table-column>
        <el-table-column prop="LabelPrice" label="标签价" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="WorkPrice" label="计价工费（件）" width="120" :formatter="formatter"></el-table-column>
        <el-table-column prop="Discount" label="折扣(%)" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ProductPrice" label="商品售价" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" :formatter="formatter" label="提交日期" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scoped">
            <el-button type="text" name="btnModify" @click="$router.push({path:'/market/product/edit/'+scoped.row.ProductId})">修改</el-button>
            <el-button type="text" name="btnDeleteCurrent" @click="deleteCurrent(scoped.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <div v-else class="full-wrapper">
      <div class="nofound-box">
        <img src="../../../assets/images/product_icon_1.png">
        <p>抱歉，当前选择的销售商品数据来源为ERP，不能在此管理商品！</p>
        <p>
          点击
          <router-link to="/setter/basic/parameter">这里</router-link>修改销售商品数据来源
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import { SettingParameterGoodsSourceType } from '@/enums/merchant'
import {
  MARKETING_API_STORE_PRODUCT_BASIC_GETS,
  MARKETING_API_STORE_PRODUCT_BASIC_DELETE
} from '@/apis/marketing'
import { MERCHANT_API_SETTING_PARAMETER_GET } from '@/apis/merchant'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      SettingParameterGoodsSourceType,
      form: {
        IsSenior: false,
        MaterialType: 0,
        ProductNO: '',
        ProductTitle: '',
        CertSeriesID: '',
        CreateTime1: '',
        CreateTime2: '',
        PacreateTimeRange: [],
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      parameter: {},
      loading: false,
      multipleSelection: [],
      tableData: [],
      goodsSourceType: SettingParameterGoodsSourceType.MarketingCloud
    }
  },
  created() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
    this.$store.dispatch('GET_GOLD_TYPE')
    this.getAuth()
  },
  mounted() { },
  watch: {
    $route: 'init'
  },
  methods: {
    getAuth() {
      MERCHANT_API_SETTING_PARAMETER_GET({
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsSourceType = res.data.Data.GoodsSourceType
          if (
            this.goodsSourceType ===
            SettingParameterGoodsSourceType.MarketingCloud
          ) {
            this.init()
          }
        }
      })
    },
    getData() {
      this.loading = true
      MARKETING_API_STORE_PRODUCT_BASIC_GETS(this.parameter).then(res => {
        this.loading = false
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.tableData = res.data.Data.Rows
        }
      })
    },
    init() {
      let query = this.$route.query
      this.form.IsSenior = query.IsSenior === 'true' ? true : false
      this.form.MaterialType = parseInt(query.MaterialType) || 0
      this.form.ProductNO = query.ProductNO || ''
      this.form.ProductTitle = query.ProductTitle || ''
      this.form.CertSeriesID = query.CertSeriesID || ''
      this.form.CreateTime1 = query.CreateTime1 || ''
      this.form.CreateTime2 = query.CreateTime2 || ''
      this.form.PacreateTimeRange = query.PacreateTimeRange || []
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/market/product/index',
        query: this.parameter
      })
    },
    search() {
      this.form.PageIndex = 1
      this.parameter = {
        ...this.form
      }
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    advancedSearch() {
      this.form.IsSenior = true
      this.search()
    },
    reset() {
      this.$refs['search'].resetFields()
      this.search()
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
    formatter(row, column, cellValue) {
      switch (column.property) {
        case 'CreateTime':
          return this.$options.filters.filterDate(cellValue)
        case 'MaterialType':
          return this.$store.getters.materialType.Types[cellValue]
        case 'GoldType':
          return cellValue == 0
            ? '-'
            : this.$store.getters.goldType.Types[cellValue]
        case 'Discount':
          return `${this.$root.toFloat(arguments[2] * 100, 1)}%`
        case 'LabelPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'WorkPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'ProductPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'GoldWeight':
          return `${this.$root.toFloat(arguments[2], 3)}g`
        default:
          break
      }
    },
    dateChange(value) {
      if (value) {
        this.form.CreateTime1 = value[0]
        this.form.CreateTime2 = value[1]
      } else {
        this.form.CreateTime1 = ''
        this.form.CreateTime2 = ''
      }
    },
    deleteCurrent(row) {
      this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MARKETING_API_STORE_PRODUCT_BASIC_DELETE({ Ids: [row.ProductId] }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.init()
            }
            // else if (res.data.Code === 'ERROR') {
            //   this.$message.error(res.data.Message);
            // }
          })
        })
        .catch(() => { })
    },
    batchDelete() {
      if (this.multipleSelection.length > 0) {
        this.$confirm('此操作将永久删除所选产品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            MARKETING_API_STORE_PRODUCT_BASIC_DELETE({
              Ids: this.multipleSelection
            }).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.init()
              }
            })
          })
          .catch(() => { })
      } else {
        this.$message({
          type: 'warning',
          message: '请勾选需要删除的商品!'
        })
      }
    },
    handleSelectionChange(value) {
      this.multipleSelection = []
      value.forEach(item => {
        this.multipleSelection.push(item.ProductId)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.full-wrapper {
  width: 100%;
  height: 700px;
  .nofound-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    img {
      display: block;
    }
    p {
      padding-top: 20px;
      color: #888;
    }
  }
}
</style>
