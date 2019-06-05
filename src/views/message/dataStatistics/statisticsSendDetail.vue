<template>
  <div class="panel">
    <div class="p-10 clearfix">
      <div class="fl" v-if="info.imageUrl">
        <img :src="$root.settings.DOMAIN_IMAGE + info.imageUrl" alt="" width="80" height="80">
      </div>
      <el-form label-width="50px" class="fl p-l-10 form-title">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="类型:">{{info.characterTypeText}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ID:">
              {{info.characterId}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称:">
              {{info.storeName}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button name="btnLinkBack" type="primary" icon="el-icon-arrow-left" class="fr" @click="$router.back(-1)">返回</el-button>
    </div>
    <el-row class="total-num-show" v-loading="$store.getters.tb_loading">
      <el-col :span="12">
        <span>发送条数：</span>
        <span class="fw-b text-warning">{{info.rangeCount == undefined ? '-' : info.rangeCount}}</span>
      </el-col>
      <el-col :span="12">
        <span>累积发送条数：</span>
        <span class="fw-b text-warning">{{info.totalCount || '-'}}</span>
      </el-col>
    </el-row>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline" label-width="80px">
      <el-form-item label="手机号：">
        <el-input name="btnEnterMobile" v-model="searchForm.mobile" placeholder="输入手机号" @keyup.enter.native="onSearch"></el-input>
      </el-form-item>
      <el-form-item label="模版类型：">
        <el-select name="btnSelectTemplateType" v-model="searchForm.templateType">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in templateTypes.Types" :key="item.key" :value="item.key" :label="item.title"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="m-l-10">
        <el-button name="btnOnSearch" type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="sendTime" label="时间" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="templateTypeText" label="模板类型" width="70" show-overflow-tooltip></el-table-column>
      <el-table-column prop="templateName" label="模板名称" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="smsContent" label="短信内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" width="110" show-overflow-tooltip></el-table-column>
    </el-table>
    <pagination :total="total" :pg="searchForm.pageIndex" :size="searchForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import {
  TemplateTypes 
} from '@/enums/message'
import pagination from '@/components/pagination.vue'
import {
  MESSAGE_API_SENDLOG_SEARCHSTOREDETAILLIST,
  MESSAGE_API_SENDLOG_SEARCHTOTAL
} from '@/apis/message'
export default {
  data() {
    return {
      templateTypes: TemplateTypes,
      info: {
        characterId: '',
        storeName: '',
        rangeCount: '',
        imageUrl: '',
        totalCount: ''
      },
      data: [],
      searchForm: {
        mobile: '',
        templateType: '',
        startTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      parameter: {
      }
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/message/dataStatistics/statisticsSendDetail',
        query: this.parameter
      })
    },
    initData() {
      let query = this.$route.query || {
      }
      query = Object.entries(query)
        .filter(([k, v]) => {
          return typeof v === 'object' ? Object.keys(v).length > 0 : !!v
        })
        .reduce((p, c) => {
          const [k, v] = c
          p[k] = v
          return p
        }, {
        })
      if (!query.characterId && query.characterId != 0) {
        return
      }
      this.parameter.characterId = query.characterId || ''
      this.parameter.mobile = query.mobile || ''
      this.parameter.templateType = query.templateType || ''
      this.parameter.startTime = query.startTime || ''
      this.parameter.endTime = query.endTime || ''
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 20
      this.$store.commit('SET_TB_LOADING', true)
      MESSAGE_API_SENDLOG_SEARCHTOTAL({
        characterId: this.parameter.characterId,
        startTime: this.parameter.startTime,
        endTime: this.parameter.endTime
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.info = res.data.Data
          this.getData()
        }
      })
    },
    getData() {
      MESSAGE_API_SENDLOG_SEARCHSTOREDETAILLIST(
        Object.assign(this.searchForm, this.parameter)
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.searchForm.pageIndex = 1
      this.parameter = Object.assign({
      }, this.searchForm)
      this.initRoute()
    }
  },
  mounted() {
    this.initData()
  },
  watch: {
    $route: 'initData'
  },
  components: {
    pagination
  }
}
</script>

<style lang="scss" scoped>
.form-title {
  width: 800px;
}
</style>
