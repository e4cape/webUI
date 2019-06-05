<template>
  <div class="content">
    <el-form :model="form" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <el-row type="flex" class="search-box">
        <el-col class="search-form">
          <!-- 公共搜索项 -->
          <el-form-item prop="CreatTimeRange" label="日期">
            <el-date-picker
              name="CreatTimeRange"
              v-model="form.CreatTimeRange"
              @change="dateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateTime1" v-show="false">
            <el-input name="CreateTime1" v-model="form.CreateTime1"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime2" v-show="false">
            <el-input name="CreateTime2" v-model="form.CreateTime2"></el-input>
          </el-form-item>
          <!-- 总部搜索项 -->
          <el-form-item label="门店名称：" v-if="characterType == CharacterType.Company" prop="characterId">
            <el-select name="characterId" v-model="form.characterId">
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
            <el-form-item label="门店编号" prop="StoreCode">
              <el-input name="StoreCode" v-model="form.StoreCode" @keyup.enter.native="advancedSearch"></el-input>
            </el-form-item>
            <el-form-item label="门店名称" prop="StoreName">
              <el-input name="StoreName" v-model="form.StoreName" @keyup.enter.native="advancedSearch"></el-input>
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
      <store-report :summary="summary" :form="parameter" :characterType="characterType" v-loading="isLoading"></store-report>
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
} from '@/enums/common.js'
import {
  MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYDATE,
  MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYSTORE,
  MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYSTOREEXPORT,
  MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYDATEEXPORT,
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
        CreatTimeRange: [],
        CreateTime1: '',
        CreateTime2: '',
        CharacterId: 0,
        CompanyCode: '',
        CompanyName: '',
        StoreCode: '',
        StoreName: '',
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {
      },
      total: 0,
      summary: {
      },
      isLoading: true,
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
          this.total = res.data.Data.Details?res.data.Data.Details[0].TOTALCOUNT:0
        }
      })
    },
    getData() {
      if (this.characterType == CharacterType.Store) {
        this.api(MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYSTORE)
      } else if (this.characterType == CharacterType.Company || this.characterType == CharacterType.Lingcb) {
        this.api(MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYDATE)
      } else {
        this.$router.back()
      }
    },
    init() {
      let query = this.$route.query
      this.form.CharacterId = parseInt(query.characterId) || 0
      this.form.CreateTime1 = query.CreateTime1 || ''
      this.form.CreateTime2 = query.CreateTime2 || ''
      this.form.CompanyCode = query.CompanyCode || ''
      this.form.CompanyName = query.CompanyName || ''
      this.form.StoreCode = query.StoreCode || ''
      this.form.StoreName = query.StoreName || ''
      this.form.CreatTimeRange = query.CreatTimeRange || []
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/report/assessemployeereport/index', query: this.parameter
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
        this.form.CreateTime1 = value[0]
        this.form.CreateTime2 = value[1]
      } else {
        this.form.CreateTime1 = ''
        this.form.CreateTime2 = ''
      }

    },

    getEnums() {
      this.$store.dispatch('GET_STORES_DROPLIST')
    },
    exportReport() {
      if (this.characterType == CharacterType.Store) {
        this.getExportData(MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYSTOREEXPORT )
      } else {
        this.getExportData(MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYDATEEXPORT)
      }
    },
    getExportData(api) {
      api(this.parameter).then(res => {
        if (res.data.Code == 'CORRECT') {
          window.open(res.data.Data.FilePath, '_blank')
        }
      })
    },
  },
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