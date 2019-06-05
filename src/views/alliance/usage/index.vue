<template>
  <div class="content">
    <div class="settlement">
      <div class="today">
        <div class="left">
          <p class="big">7400.00</p>
          <p>今日结算金额</p>
        </div>
        <div class="right">
          <p>推广奖励：2400.00</p>
          <p>转化奖励：5000.00</p>
        </div>
      </div>
      <div class="cumulative">
        <div class="left">
          <p class="big">10000.00</p>
          <p>累计结算金额</p>
        </div>
        <div class="right">
          <p>推广奖励：2400.00</p>
          <p>转化奖励：5000.00</p>
        </div>
      </div>
    </div>
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button type="primary" v-loading="exprotLoading" @click="exportData">导出</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" @change="onSearch">
              <el-option label="全部" :value="'0'"></el-option>
               <el-option v-for="(item, index) in securityPackBasicMultiType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="TicketName">
            <el-input name="TicketName" v-model="queryForm.TicketName" placeholder="卡卷名称" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="Unitenote" label="关键字：" aria-placeholder="珠宝商编码/名称">
            <el-input name="TicketCode" v-model="queryForm.Unitenote" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="Multitype" label="珠宝商类型：">
            <el-select name="State" v-model="queryForm.Multitype" placeholder="全部" @change="onSearch">
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in securityPackBasicMultiType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="HasTicket" label="是否创建联盟券：">
            <el-select name="State" v-model="queryForm.HasTicket" placeholder="全部" @change="onSearch">
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in yNStatus.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" border>
      <el-table-column show-overflow-tooltip min-width="60" fixed prop="StoreCode" label="珠宝商编码"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="StoreName" label="珠宝商名称"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="MultiType" label="珠宝商类型">
        <template slot-scope="scope">{{scope.row.MultiType === 1?'一号一店':'一号多店'}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="HasTicket" label="是否创建联盟券">
        <template slot-scope="scope">{{scope.row.HasTicket === 1?'否':'是'}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" sortable="custom" prop="TicketAmt" label="联盟券数"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="TicketCode" label="操作">
        <template>
          <el-button type="text" @click="$router.push({path:'/alliance/usage/useDetail'})">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import { SecurityPackBasicMultiType } from '@/enums/merchant.js'
import {
  ALLIANCE_API_CHARACTERTALLY_GETS,
  ALLIANCE_API_CHARACTERTALLY_EXPORT,
} from '@/apis/alliance'
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'

export default {
  beforeMount() { },
  data() {
    return {
      yNStatus:YNStatus,
      securityPackBasicMultiType: SecurityPackBasicMultiType,
      queryForm: {
        UniteNote: '',
        MultiType: '0',
        HasTicket: '0',
        Orderby: 1,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,

      },
      total: 0,
      tableData: [],
      parameters: {},
      exprotLoading: false,
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(
        this.queryForm,
        {
          UniteNote: '',
          MultiType: '0',
          HasTicket: '0',
          Orderby: '0',
          IsAsced: YNStatus.No,
          PageIndex: 1,
          PageSize: 20,
        },
        query
      )
      this.getData()
    },

    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      ALLIANCE_API_CHARACTERTALLY_GETS(this.queryForm).then(res => {
        console.log(res)
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
      })
    },
    exportData() {
      this.exprotLoading = true
      ALLIANCE_API_CHARACTERTALLY_EXPORT(this.queryForm)
        .then(res => {
          this.exprotLoading = false
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Subset
            this.total = res.data.Data.Count
          }
        })
        .catch(() => {
          this.exprotLoading = false
        })
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.queryForm = {
        UniteNote: '',
        MultiType: '0',
        HasTicket: '0',
        Orderby: '0',
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
      }
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    searchPanel
  }

}
</script>

<style lang="scss" scoped>
.content {
  border: 1px solid #ccc;
  .settlement {
    height: 105px;
    border-bottom: 1px dashed #666;
    margin-bottom: 10px;
    .today {
      width: 48%;
      height: 75px;
      border: 1px solid #ccc;
      float: left;
      margin: 10px 10px;
      .left {
        float: left;
        width: 50%;
        height: 75px;
        border-right: 1px solid #ccc;
        text-align: center;
        padding-top: 20px;
        .big {
          font-weight: 600;
          font-size: 25px;
        }
      }
      .right {
        float: right;
        width: 49%;
        height: 75px;
        text-align: center;
        padding-top: 10px;
        p {
          margin-top: 10px;
        }
      }
    }
    .cumulative {
      width: 48%;
      height: 75px;
      border: 1px solid #ccc;
      float: right;
      margin: 10px 10px;
      .left {
        float: left;
        width: 50%;
        height: 75px;
        border-right: 1px solid #ccc;
        text-align: center;
        padding-top: 20px;
        .big {
          font-weight: 600;
          font-size: 25px;
        }
      }
      .right {
        float: right;
        width: 49%;
        height: 75px;
        text-align: center;
        padding-top: 10px;
        p {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
