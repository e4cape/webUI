<template>
  <div class="content">
    <el-form
      :model="form"
      ref="search"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel :isSenior="false">
        <template slot="btnBox">
          <el-form-item>
            <el-radio-group
              name="rangeSelecte"
              v-model="rangeSelecte"
              @change="changeRange"
            >
              <el-radio-button :label="1">近7天</el-radio-button>
              <el-radio-button :label="3">近15天</el-radio-button>
              <el-radio-button :label="5">近30天</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button
              name="btnexportReport"
              type="default"
              round
              @click="exportReport"
            >导出Excel</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-date-picker
              name="dateRange"
              v-model="dateRange"
              @change="dateChange"
              :picker-options="option"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:230px"
            >
            </el-date-picker>
          </el-form-item>
          <el-button
            name="btnsearch"
            type="primary"
            @click="search"
          >搜索</el-button>
        </template>

      </search-panel>
    </el-form>
    <el-alert
      type="warning"
      :closable="false"
      title="说明"
    >
      <div>1、当天只能查询昨天及以前的数据，暂不支持查询当天的数据。</div>
      <div>2、最长查询时间不能超过30天</div>
    </el-alert>
    <el-table
      :data="tableData"
      v-loading="$store.getters.tb_loading"
      class="member-card-list m-t-10"
    >
      <el-table-column
        label="日期"
        prop="ref_date"
      ></el-table-column>
      <el-table-column label="浏览">
        <el-table-column
          label="人数"
          prop="view_user"
        ></el-table-column>
        <el-table-column
          label="次数"
          prop="view_cnt"
        ></el-table-column>
      </el-table-column>
      <el-table-column label="领取">
        <el-table-column
          label="人数"
          prop="receive_user"
        ></el-table-column>
        <el-table-column
          label="次数"
          prop="receive_cnt"
        ></el-table-column>
      </el-table-column>
      <!-- <el-table-column label="使用" >
        <el-table-column label="人数" prop="verify_user"></el-table-column>
        <el-table-column label="次数" prop="verify_cnt"></el-table-column>
      </el-table-column> -->
      <el-table-column
        label="新增会员"
        prop="new_user"
      ></el-table-column>
    </el-table>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import {
  SCORING_API_WX_CARD_GETCARDMEMBERCARDDETAIL, // 会员卡管理 - 查看单张会员卡概况
  SCORING_API_WX_CARD_EPORTCARDMEMBERCARDDETAIL // 会员卡管理 - 导出单张会员卡概况
} from '@/apis/scoring.js'

import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
export default {
  components: {
    searchPanel,
    pagination
  },
  data() {
    return {
      form: {
        DateStart: dayjs()
          .subtract(7, 'days')
          .format('YYYY-MM-DD'),
        DateEnd: dayjs()
          .subtract(1, 'days')
          .format('YYYY-MM-DD')
      },
      endTime: '',
      option: {
        disabledDate: date => {
          return date > dayjs().subtract(1, 'days')
        }
      },
      dateRange: [
        dayjs()
          .subtract(7, 'days')
          .format('YYYY-MM-DD'),
        dayjs()
          .subtract(1, 'days')
          .format('YYYY-MM-DD')
      ],
      tableData: [],
      isLoading: false,
      rangeSelecte: 1
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$store.commit('SET_TB_LOADING', true)
      SCORING_API_WX_CARD_GETCARDMEMBERCARDDETAIL(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data || []
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    search() {
      this.init()
    },
    dateChange(val) {
      if (val) {
        this.form.DateStart = val[0]
        this.form.DateEnd = val[1]
      } else {
        this.form.DateStart = ''
        this.form.DateEnd = ''
      }
    },
    changeRange(val) {
      let DateStart, endDate
      switch (val) {
        case 1:
          DateStart = dayjs()
            .subtract(7, 'days')
            .format('YYYY-MM-DD')
          endDate = dayjs()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
          break
        case 3:
          DateStart = dayjs()
            .subtract(15, 'days')
            .format('YYYY-MM-DD')
          endDate = dayjs()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
          break
        default:
          DateStart = dayjs()
            .subtract(30, 'days')
            .format('YYYY-MM-DD')
          endDate = dayjs()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
          break
      }
      this.form.DateStart = DateStart
      this.form.DateEnd = endDate
      this.$set(this.dateRange, 0, DateStart)
      this.$set(this.dateRange, 1, endDate)
      this.init()
    },
    exportReport() {
      SCORING_API_WX_CARD_EPORTCARDMEMBERCARDDETAIL(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(res.data.Data.FilePath, '_blank')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.member-card-list {
  &.el-table--border,
  .el-table--group {
    border-left: none;
    &::after {
      content: '';
      display: none;
    }
    .el-table_1_column_8 {
      border-right: none;
    }
  }
}
</style>

