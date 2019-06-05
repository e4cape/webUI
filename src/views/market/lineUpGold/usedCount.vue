<template>
  <div>
    <el-form inline :model="form" ref="search" class="item-lh-26" @keyup.enter.native="search">
      <div class="flex-box search-box no-border no-padding">
        <div class="search-form">
          <el-form-item name="datePickerUsedTimeRange" :mode="form" label="使用时间">
            <el-date-picker
              v-model="form.usedTimeRange"
              @change="hanldeUsedTime"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickrOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input name="inputAliasName" v-model="form.AliasName"></el-input>
          </el-form-item>
          <el-form-item label="使用状态">
            <el-select name="selectStatus" v-model="form.Status">
              <el-option :value="0" label="全部"></el-option>
              <el-option v-for="(value, key) in QueueReceiveGoldUsedStatus.Types" :key="key" :label="value" :value="parseInt(key)"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="search-btn">
          <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
          <el-button name="btnExportList" type="info" @click="exportList">导出Excel</el-button>
        </div>
      </div>
    </el-form>
    <el-table :data="tableData" v-loading="tableLoading" class="m-t-10">
      <el-table-column label="会员信息" width="200" fixed>
        <template slot-scope="scope">
          <div class="member-box">
            <div class="img">
              <img :src="scope.row.ImageUrl&&(scope.row.ImageUrl.substr(0,4) === 'http'?scope.row.ImageUrl:$root.settings.DOMAIN_IMAGE + scope.row.ImageUrl)" alt>
            </div>
            <div class="name">
              <p>{{scope.row.AliasName}}</p>
              <p>微信会员</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="Receive" label="已领黄金" :formatter="formatter" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="ReceiveTime" label="领取时间" :formatter="formatter" show-overflow-tooltip min-width="120"></el-table-column>
      <el-table-column prop="CouponPrice" label="折算金额" :formatter="formatter" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="Status" label="使用状态" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="UsedTime" label="使用时间" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="UsedOrder" label="使用单号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="DeductPrice" label="抵扣金额" :formatter="formatter" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="UsedStoreName" label="使用门店" show-overflow-tooltip></el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import { QueueReceiveGoldUsedStatus } from '@/enums/marketing.js'
import {
  CharacterType
} from '@/enums/common'
import {
  MARKETING_API_QUEUE_RECEICE_GOLD_COUPON_GETS,
  MARKETING_API_QUEUE_RECEICE_GOLD_COUPON_COUPONLISTEXPORT
} from '@/apis/marketing'
import pagination from '@/components/pagination.vue'
export default {
  components: {
    pagination
  },
  data() {
    return {
      CharacterType,
      QueueReceiveGoldUsedStatus,
      total: 0,
      tableData: [],
      tableLoading: true,
      form: {
        QueueId: '',
        UsedTime1: '',
        UsedTime2: '',
        UsedCharacterId: '',
        AliasName: '',
        Status: 0,
        PageIndex: 1,
        PageSize: 10
      }
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  created() {
    this.form.QueueId = this.$route.params.id
    this.getData()
  },
  methods: {
    exportList() {
      MARKETING_API_QUEUE_RECEICE_GOLD_COUPON_COUPONLISTEXPORT(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          location.href = res.data.Data.FilePath
        }
      })
    },
    hanldeUsedTime(val) {
      if (val) {
        this.form.UsedTime1 = val[0]
        this.form.UsedTime2 = val[1]
      } else {
        this.form.UsedTime1 = ''
        this.form.UsedTime2 = ''
      }
    },
    getData() {
      this.tableLoading = true
      MARKETING_API_QUEUE_RECEICE_GOLD_COUPON_GETS(this.form).then(res => {
        this.tableLoading = false
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.tableData = res.data.Data.Rows
        }
      })
    },
    search() {
      this.form.PageIndex = 1
      this.getData()
    },
    currentChange(val) {
      this.form.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      this.form.PageIndex = 1
      this.form.PageSize = val
      this.getData()
    },
    formatter(row, column, cellValue) {
      switch (column.property) {
        case 'ReceiveTime':
          return this.$options.filters.filterDateTime(cellValue)
        case 'UsedTime':
          return this.$options.filters.filterDateTime(cellValue)
        case 'Status':
          return QueueReceiveGoldUsedStatus.Types[cellValue]
        case 'Receive':
          return `${this.$root.toFloat(cellValue, 3)}g`
        case 'CouponPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'DeductPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        default:
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
  .search-btn {
    width: auto;
    text-align: right;
    white-space: nowrap;
  }
  .search-form {
    width: 1%;
    flex: 1;
  }
}
.member-box {
  position: relative;
  display: flex;
  display: -ms-flexbox;
  align-items: center;
  .receiving {
    position: absolute;
    left: -30px;
    width: 20px;
    height: 64px;
    background-color: #399fe5;
    color: #fff;
    -webkit-writing-mode: vertical-rl;
    -ms-writing-mode: bt-rl;
    writing-mode: vertical-rl;
    text-align: center;
  }
  .img {
    margin-right: 10px;
    width: 44px;
    height: 44px;
    img {
      width: 100%;
    }
  }
  .name {
    width: 1%;
    flex: 1;
    p {
      line-height: 1;
      &:first-child {
        padding-bottom: 5px;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &:last-child {
        width: 64px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        color: #fff;
        background-color: #ffa200;
      }
    }
  }
}
</style>
