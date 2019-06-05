<template>
  <div class="content">
    <el-form :model="form" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <el-row type="flex" class="search-box">
        <el-col class="search-form">
          <!-- 公共搜索项 -->
          <el-form-item prop="CheckTimeRange" label="日期">
            <el-date-picker
              name="CheckTimeRange"
              v-model="form.CheckTimeRange"
              @change="dateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="CheckTime1" v-show="false">
            <el-input name="CheckTime1" v-model="form.CheckTime1"></el-input>
          </el-form-item>
          <el-form-item prop="CheckTime2" v-show="false">
            <el-input name="CheckTime2" v-model="form.CheckTime2"></el-input>
          </el-form-item>
          <!-- 总部搜索项 -->
          <el-form-item label="门店名称：" v-if="characterType == CharacterType.Company" prop="CharacterId">
            <el-select name="CharacterId" v-model="form.CharacterId">
              <el-option v-for="(item, index) in $store.getters.stores" :key="index" :label="item.Value" :value="item.CharacterId"></el-option>
            </el-select>
          </el-form-item>
          <!-- 平台搜索项 -->
          <template v-if="characterType == CharacterType.Lingcb">
            <el-form-item label="地区" prop="Areas">
              <el-cascader :options="$store.getters.areas" name="Areas" v-model="form.Areas" @change="getAreas"></el-cascader>
            </el-form-item>
            <el-form-item v-show="false" prop="ProvinceId">
              <el-input name="ProvinceId" v-model="form.ProvinceId"></el-input>
            </el-form-item>
            <el-form-item v-show="false" prop="CityId">
              <el-input name="CityId" v-model="form.CityId"></el-input>
            </el-form-item>
            <el-form-item v-show="false" prop="TownId">
              <el-input name="TownId" v-model="form.TownId"></el-input>
            </el-form-item>
            <el-form-item label="消费类型" prop="PackageType">
              <el-select name="PackageType" v-model="form.PackageType">
                <el-option v-for="(item, key) in PackageType.Types" :key="key" :label="item" :value="parseInt(key)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司编码" prop="CompanyCode">
              <el-input name="CompanyCode" v-model="form.CompanyCode" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="公司名称" prop="CompanyName">
              <el-input name="CompanyName" v-model="form.CompanyName" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="门店编号" prop="StoreCode">
              <el-input name="StoreCode" v-model="form.StoreCode" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="门店名称" prop="StoreName">
              <el-input name="StoreName" v-model="form.StoreName" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </template>
        </el-col>
        <div class="search-btn">
          <el-button name="btnsearch" type="primary" @click="search">搜索</el-button>
          <el-button name="btnreset" type="default" @click="reset">重置</el-button>
          <el-button name="btnexportReport" type="default" @click="exportReport">导出Excel</el-button>
        </div>
      </el-row>
    </el-form>
    <div class="store" v-if="characterType == CharacterType.Store">
      <store-report :summary="summary" :form="parameter" v-loading="isLoading"></store-report>
    </div>
    <div class="company-lingcb" v-else>
      <other-report :summary="summary" :form="parameter" :characterType="characterType" v-loading="isLoading"></other-report>
    </div>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import storeReport from './storeReport.vue'
import otherReport from './otherReport'
import { PackageType } from '@/enums/marketing.js'
import { CharacterType } from '@/enums/common'
import {
  MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYDATE,
  MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYSTORE,
  MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYDATEEXPORT,
  MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYSTOREEXPORT
} from '@/apis/marketing'
export default {
  components: {
    pagination,
    storeReport,
    otherReport
  },
  data() {
    return {
      PackageType,
      CharacterType,
      form: {
        CheckTimeRange: [],
        Areas: [''],
        ProvinceId: '',
        CityId: '',
        TownId: '',
        CheckTime1: '',
        CheckTime2: '',
        CharacterId: 0,
        PackageType: 0,
        CompanyCode: '',
        CompanyName: '',
        StoreCode: '',
        StoreName: '',
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      total: 0,
      summary: {},
      isLoading: true
    }
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  watch: {
    $route: 'init'
  },
  methods: {
    api(api) {
      this.isLoading = true
      api(this.parameter).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.summary = res.data.Data
          this.summary.Details = this.summary.Details || []
          this.total = this.summary.TotalStoreCount || 0
        }
      })
    },
    getData() {
      if (this.characterType == CharacterType.Store) {
        this.api(MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYSTORE)
      } else if (
        this.characterType == CharacterType.Company ||
        this.characterType == CharacterType.Lingcb
      ) {
        this.api(MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYDATE)
      } else {
        this.$router.back()
      }
    },
    init() {
      let query = this.$route.query
      this.form.CharacterId = parseInt(query.CharacterId) || 0
      this.form.CheckTime1 = query.CheckTime1 || ''
      this.form.CheckTime2 = query.CheckTime2 || ''
      this.form.PackageType = parseInt(query.PackageType || '0')
      this.form.ProvinceId = query.ProvinceId || ''
      this.form.CityId = query.CityId || ''
      this.form.TownId = query.TownId || ''
      this.form.CompanyCode = query.CompanyCode || ''
      this.form.CompanyName = query.CompanyName || ''
      this.form.StoreCode = query.StoreCode || ''
      this.form.StoreName = query.StoreName || ''
      this.form.CheckTimeRange = query.CheckTimeRange || []
      this.form.Areas = query.Areas || ['']
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/report/expendreport/index',
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
    dateChange(value) {
      if (value) {
        this.form.CheckTime1 = value[0]
        this.form.CheckTime2 = value[1]
      } else {
        this.form.CheckTime1 = ''
        this.form.CheckTime2 = ''
      }
    },
    getAreas(value) {
      this.form.ProvinceId = value[0]
      this.form.CityId = value[1]
      this.form.TownId = value[2]
    },
    getEnums() {
      this.$store.dispatch('GET_STORES_DROPLIST')
      this.$store.dispatch('GET_AREAS_DROPLIST')
    },
    exportReport() {
      if (this.characterType == CharacterType.Store) {
        this.getExportData(
          MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYSTOREEXPORT
        )
      } else {
        this.getExportData(
          MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYDATEEXPORT
        )
      }
    },
    getExportData(api) {
      api(this.parameter).then(res => {
        if (res.data.Code == 'CORRECT') {
          setTimeout(() => {
            window.open(res.data.Data.FilePath, '_blank')
          }, 3000)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.search-box {
  border: none;
  padding: 0;
  margin: 0;
}
.search-btn {
  width: 240px !important;
}
.search-form {
  width: 1%;
  flex: 1;
}
</style>
