<template>
  <div class="content">
    <el-form
      ref="search"
      lable-width="120px"
      class="item-lh-26"
      @keyup.enter.native="onSearch"
      @submit.native.prevent
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
        :isSenior="false"
      >
        <template slot="btnBox">
          <el-form-item>
            <el-button
              name="noticeCreate"
              type="primary"
              @click="$router.push('/setter/settingList/noticecreate')"
            >添加</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input
              v-model="form.NoticeTitle"
              placeholder="公告标题"
            >
              <el-button
                name="search"
                @click="onSearch"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <el-table
      :data="tableData"
      v-loading="loading"
    >
      <el-table-column
        label="序号"
        prop="NoticeId"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="标题"
        prop="NoticeTitle"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="发送范围"
        prop="RangeIds"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{showRangeIds(scope.row.RangeIds)}}</template>
      </el-table-column>
      <el-table-column
        label="创建人"
        prop="CreateUser"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="CreateTime"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="Status"
        :formatter="formatData"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <el-button
            name="detail"
            type="text"
            @click="detail(scope.row.NoticeId)"
          >详情</el-button>
          <el-button
            name="edit"
            v-if="noticeStatus.Reject==scope.row.Status||noticeStatus.Origin==scope.row.Status"
            type="text"
            @click="edit(scope.row.NoticeId)"
          >修改</el-button>
          <el-button
            name="audit"
            v-if="noticeStatus.Origin==scope.row.Status"
            type="text"
            @click="audit($event,scope.row.NoticeId)"
          >审核</el-button>
          <el-button
            name="reject"
            v-if="noticeStatus.Origin==scope.row.Status"
            type="text"
            @click="reject($event,scope.row.NoticeId)"
          >拒绝</el-button>
          <el-button
            name="abandon"
            v-if="noticeStatus.Origin==scope.row.Status"
            type="text"
            @click="abandon($event,scope.row.NoticeId)"
          >作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="form.PageIndex"
      :size="form.PageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import { SettingNoticeType, SettingHelpStatus } from '@/enums/marketing'
import { CharacterType } from '@/enums/common'
import {
  MARKETING_API_SETTING_NOTICE_GETS,
  MARKETING_API_SETTING_NOTICE_AUDIT,
  MARKETING_API_SETTING_NOTICE_REJECT,
  MARKETING_API_SETTING_NOTICE_ABANDON
} from '@/apis/marketing.js'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      characterType: CharacterType,
      noticeStatus: SettingHelpStatus,
      tableData: [],
      form: {
        NoticeTitle: '',
        PageIndex: 1,
        PageSize: 10
      },
      total: 0,
      loading: false
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/setter/settinglist/noticeList',
        query: this.form
      })
    },
    onSearch() {
      // 搜索相关
      this.form.PageIndex = 1
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.init()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    init() {
      this.loading = true
      let query = this.$route.query
      this.form.NoticeTitle = query.NoticeTitle || ''
      this.form.CharacterType = this.$store.getters.user_session.CharacterType
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 10
      MARKETING_API_SETTING_NOTICE_GETS(
        Object.assign({ SortBy: 'CreateTime' }, this.form)
      ).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.total = res.data.Data.Count
          this.tableData = res.data.Data.Rows
          this.loading = false
        }
      })
    },
    formatData(row, column) {
      switch (column.property) {
        case 'NoticeType':
          return SettingNoticeType.Types[row[column.property]]
        case 'Status':
          return this.noticeStatus.Types[row[column.property]]
        default:
      }
    },
    detail(id) {
      this.$router.push({
        path: `/setter/settingList/noticedetail?NoticeId=${id}`
      })
    },
    edit(id) {
      this.$router.push(`/setter/settingList/noticeedit?NoticeId=${id}`)
    },
    audit(e, id) {
      e.currentTarget.blur()
      this.$confirm('确定要审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MARKETING_API_SETTING_NOTICE_AUDIT({
            NoticeId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.init()
            }
          })
        })
        .catch(() => {})
    },
    reject(e, id) {
      e.currentTarget.blur()
      this.$confirm('确定要拒绝吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MARKETING_API_SETTING_NOTICE_REJECT({
            NoticeId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.init()
            }
          })
        })
        .catch(() => {})
    },
    abandon(e, id) {
      e.currentTarget.blur()
      this.$confirm('确定要作废吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MARKETING_API_SETTING_NOTICE_ABANDON({
            NoticeId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.init()
            }
          })
        })
        .catch(() => {})
    },
    sizeChange(val) {
      this.form.PageSize = val
      this.form.PageIndex = 1
      this.initRoute()
    },
    currentChange(val) {
      this.form.PageIndex = val
      this.initRoute()
    },
    showRangeIds(data) {
      let arr = []
      let arr1 = []
      arr = data.split(',')
      for (let m in this.characterType.Types) {
        arr.forEach(item => {
          if (parseInt(m) == parseInt(item)) {
            arr1.push(this.characterType.Types[m])
          }
        })
      }
      return arr1.join('、')
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

