<template>
  <div class="content">
      <!-- @module 我的下载 -->
      <el-alert title="注：请及时下载到本地，下载到本地后将自动删除记录。每天晚上自动清空所有记录。" type="warning"></el-alert>
      <el-table class="m-t-10" :data="downloadTable" v-loading="$store.getters.is_loading">
        <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="margin-left: 5px">{{ scope.row.CreateTime | filterDateMinutes}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="SourceType" label="数据来源" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Note" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinishTime" label="完成时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="margin-left: 5px">{{ scope.row.FinishTime | filterDateMinutes}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="State" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{securityDownloadState.Types[scope.row.State]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="TrueName" label="操作">
          <template slot-scope="scope">
            <el-button name="download" size="small" v-if="scope.row.State === securityDownloadState.Done" type="text" @click="download(scope.row.FilePath)">下载</el-button>
            <!-- <el-button v-else type="text" size="small">导出中（无法操作）</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- End 我的下载 -->
  </div>

</template>

<script>
import {
  MERCHANT_API_SECURITY_DOWNLOAD_GETS
} from '@/apis/merchant'
import {
  SecurityDownloadState
} from '@/enums/merchant'
export default {
  data () {
    return {
      securityDownloadState: SecurityDownloadState,
      total: 0,
      pg: 1,
      size: 20,
      downloadTable: []
    }
  },
  methods: {
    init () {
      let query = this.$route.query
      this.pg = parseInt(query.pg) || 1
      this.size = parseInt(query.size) || 10
      this.getDownloadList()
    },
    getDownloadList () {
      this.$store.commit('SET_BTN_LOADING', true)
      MERCHANT_API_SECURITY_DOWNLOAD_GETS({
        SourceType: 0,
        // IsAsced: 1,
        OrderBy: 0,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.downloadTable = res.data.Data.Rows
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    download (path) {
      window.open(this.$root.settings.DOMAIN_TEMP + path)
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
.attention{
  display: block;
  color: red;
  text-align: left;
  padding: 12px 0 0 12px;
  font-size: 12px;
}
</style>
