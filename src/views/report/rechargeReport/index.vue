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
            <el-form-item label="公司编码" prop="CompanyCode">
              <el-input name="CompanyCode" v-model="form.CompanyCode" @keyup.enter.native="advancedSearch"></el-input>
            </el-form-item>
            <el-form-item label="公司名称" prop="CompanyName">
              <el-input name="CompanyName" v-model="form.CompanyName" @keyup.enter.native="advancedSearch"></el-input>
            </el-form-item>
            <el-form-item label="门店编号" prop="EnglishID">
              <el-input name="EnglishID" v-model="form.EnglishID" @keyup.enter.native="advancedSearch"></el-input>
            </el-form-item>
            <el-form-item label="门店名称" prop="StoreTitle">
              <el-input name="StoreTitle" v-model="form.StoreTitle" @keyup.enter.native="advancedSearch"></el-input>
            </el-form-item>
          </template>
        </el-col>
        <div class="search-btn">
          <el-button name="btnadvancedSearch" type="primary" @click="advancedSearch">搜索</el-button>
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
import {
  CharacterType
} from '@/enums/common'
import {
  MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYDATE,
  MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYSTORE,
  MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYDATEEXPORT,
  MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYSTOREEXPORT
} from '@/apis/marketing'
export default {
  components: {
    pagination,
    storeReport,
    otherReport
  },
  data() {
    return {
      CharacterType,
      form: {
        CheckTimeRange: [],
        CheckTime1: '',
        CheckTime2: '',
        CharacterId: 0,
        CompanyCode: '',
        CompanyName: '',
        EnglishID: '',
        StoreTitle: '',
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {
      },
      total: 0,
      summary: {
      },
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
          this.total = res.data.Data.TotalOrderCount
        }
      })
    },
    getData() {
      if (this.characterType == CharacterType.Store) {
        this.api(MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYSTORE)
      } else if (
        this.characterType == CharacterType.Company ||
        this.characterType == CharacterType.Lingcb
      ) {
        this.api(MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYDATE)
      } else {
        this.$router.back()
      }
    },
    init() {
      let query = this.$route.query
      this.form.CharacterId = parseInt(query.CharacterId) || 0
      this.form.CheckTime1 = query.CheckTime1 || ''
      this.form.CheckTime2 = query.CheckTime2 || ''
      this.form.CompanyCode = query.CompanyCode || ''
      this.form.CompanyName = query.CompanyName || ''
      this.form.EnglishID = query.EnglishID || ''
      this.form.StoreTitle = query.StoreTitle || ''
      this.form.CheckTimeRange = query.CheckTimeRange || []
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/report/rechargereport/index',
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
    dateChange(value) {
      if (value) {
        this.form.CheckTime1 = value[0]
        this.form.CheckTime2 = value[1]
      } else {
        this.form.CheckTime1 = ''
        this.form.CheckTime2 = ''
      }
    },
    getEnums() {
      this.$store.dispatch('GET_STORES_DROPLIST')
    },
    exportReport() {
      if (this.characterType == CharacterType.Store) {
        this.getExportData(MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYSTOREEXPORT)
      } else {
        this.getExportData(MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYDATEEXPORT)
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