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
          <el-form-item prop="queryForm.State">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" @change="onSearch">
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in settleTicketBillBasicState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="TicketName">
            <el-input name="TicketName" v-model="TicketName" placeholder="卡卷名称" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="CreateTime1" label="创建日期：">
            <el-date-picker v-model="queryForm.CreateTime1" :unlink-panels="true" type="daterange" format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="ActualDate1" label="结算日期：">
            <el-date-picker v-model="queryForm.ActualDate1" :unlink-panels="true" type="daterange" format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="NeiborCode" label="联盟商编号：">
            <el-input name="TicketCode" v-model="queryForm.NeiborCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="NeiborName" label="联盟商：">
            <el-input name="TicketCode" v-model="queryForm.NeiborName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TicketName" label="卡券名称：">
            <el-input name="TicketCode" v-model="queryForm.Unitenote" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TicketCode" label="卡券ID：">
            <el-input name="TicketCode" v-model="queryForm.Unitenote" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="BillType" label="结算单类型：">
            <el-select name="State" v-model="queryForm.BillType" placeholder="全部" @change="onSearch">
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in settleTicketBillBasicBillType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" :summary-method="getSummaries" show-summary v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip min-width="120" prop="CreateTime1" label="创建时间">
        <template slot-scope="scope">{{scope.row.CreateTimel | filterDateMintes}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="BillCode" label="结算单号"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="BillType" label="结算单类型"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="TicketCode" label="联盟商编号"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="NeiborName" label="联盟商"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="TicketCode" label="卡券ID"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="TicketName" label="卡券名称"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="BillPrice" label="应结算金额"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="State" label="结算状态"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="PaidPrice" label="实际结算金额"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="ActualDate1" label="结算时间">
        <template slot-scope="scope">{{scope.row.ActualDate1 | filterDateMinutes}}</template>
      
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { SettleTicketBillBasicBillType, SettleTicketBillBasicState } from '@/enums/alliance'
import {
  ALLIANCE_API_SETTLETICKETBILLBASIC_GETS,
  ALLIANCE_API_SETTLETICKETBILLBASIC_EXPORT
} from '@/apis/alliance'
import searchPanel from '@/components/searchPanel.vue'
export default {
  beforeMount() { },
  data() {
    return {
      settleTicketBillBasicBillType: SettleTicketBillBasicBillType,
      settleTicketBillBasicState: SettleTicketBillBasicState,
      queryForm: {
        BillCode: '',
        BillType: '0',
        ActualDate1: '',
        ActualDate2: '',
        NeiborCode: '',
        NeiborName: '',
        TicketCode: '',
        TicketName: '',
        PaidNo: '',
        CreateTime1: '',
        CreateTime2: '',
        State: '0',
        Orderby: '0',
        IsAsced: '1',
        PageIndex: 1,
        PageSize: 20,
      },

      total: 0,
      TicketName: '',
      TicketCode: '',
      BillPrice: '',
      PaidPrice: '',
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
          BillCode: '',
          BillType: '0',
          ActualDate1: '',
          ActualDate2: '',
          NeiborCode: '',
          NeiborName: '',
          TicketCode: '',
          TicketName: '',
          PaidNo: '',
          CreateTime1: '',
          CreateTime2: '',
          State: '0',
          Orderby: '0',
          IsAsced: '1',
          PageIndex: 1,
          PageSize: 20,
        },
        query
      )
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      ALLIANCE_API_SETTLETICKETBILLBASIC_GETS(this.queryForm).then(res => {
        console.log(res)

        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Total
        }
      })
    },
    exportData() {
      this.exprotLoading = true
      ALLIANCE_API_SETTLETICKETBILLBASIC_EXPORT(this.queryForm)
        .then(res => {
          this.exprotLoading = false
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Rows
            this.total = res.data.Data.Total
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
        BillCode: '',
        BillType: '0',
        ActualDate1: '',
        ActualDate2: '',
        NeiborCode: '',
        NeiborName: '',
        TicketCode: '',
        TicketName: '',
        PaidNo: '',
        CreateTime1: '',
        CreateTime2: '',
        State: '0',
        Orderby: '0',
        IsAsced: '1',
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
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          sums[index] = '-'
        }
      })

      return sums
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {

    searchPanel
  }
}
</script>

<style lang="scss" scoped>
.content {
  border: 1px solid #ccc;
  .settlement {
    height: 105px;
    border-bottom: 2px solid #555;
    margin-bottom: 10px;
    .today {
      width: 48%;
      height: 75px;
      //   border: 1px solid #ccc;
      float: left;
      margin: 10px 10px;
      background-color: rgb(57, 160, 229);
      color: #fff;
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
      // border: 1px solid #ccc;
      float: right;
      margin: 10px 10px;
      background-color: rgb(94, 127, 172);
      color: #fff;
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
  // .button {
  //   height: 76px;
  //   line-height: 76px;
  //   padding: 0 10px;
  //   .input {
  //     width: 120px;

  //   }
  //   .inputs {
  //     width: 60px;
  //   }
  //   .search {
  //     margin-left: 40px;
  //   }
  //   .el-col {
  //     line-height: 50px;
  //   }
  //   .input-class {
  //     .el-input__inner {
  //       width: 50px;
  //     }
  //   }
  // }
  // .paging {
  //   float: right;
  // }
}
</style>
