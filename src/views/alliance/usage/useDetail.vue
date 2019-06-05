<template>
  <div class="content">
    <div class="times">
      <span>珠宝商编码：</span>
      <span>珠宝商名称：</span>
      <span>珠宝商类型：</span>
      <span>截至时间：</span>
      
    </div>
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
      <el-form-item prop="Multitype" label="审核状态：">
        <el-select name="State" v-model="queryForm.Multitype" placeholder="全部">
          <el-option label="全部" :value="'0'"></el-option>
          <el-option v-for="(item, index) in ticketBasicState.Types" :key="index" :label="item" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="Multitype" label="结算状态：">
        <el-select name="State" v-model="queryForm.Multitype" placeholder="全部">
          <el-option label="全部" :value="'0'"></el-option>
          <el-option v-for="(item, index) in  ticketSettleState.Types" :key="index" :label="item" :value="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" class="table">
      <el-table-column show-overflow-tooltip min-width="60" fixed prop="StoreCode" label="卡券ID"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="StoreName" label="卡券名称"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="MultiType" label="投放日期">
        <template slot-scope="scope">{{scope.row.MultiType | filterDate}}~{{scope.row.MultiType | filterDate}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="HasTicket" label="投放数量"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="HasTicket" label="卡券类型">
        <template></template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="HasTicket" label="有效期">
        <template slot-scope="scope">{{scope.row.HasTicket == 0 ? '即时生效':'领取后' + scope.row.HasTicket + '天生效'}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="HasTicket" label="联盟商数"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="HasTicket" label="推广奖励"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="HasTicket" label="审核状态"></el-table-column>
    </el-table>
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
     
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <el-form-item prop="Multitype" label="状态：">
        <el-select name="State" v-model="queryForm.Multitype" placeholder="全部">
          <el-option label="全部" :value="'0'"></el-option>
          <el-option v-for="(item, index) in ticketNeiborRewaidState .Types" :key="index" :label="item" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="Multitype" label="来源：">
        <el-select name="State" v-model="queryForm.Multitype" placeholder="全部">
          <el-option label="全部" :value="'0'"></el-option>
          <!-- <el-option v-for="(item, index) in securityPackBasicMultiType.Types" :key="index" :label="item" :value="index"></el-option> -->
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip min-width="60" fixed prop="StoreCode" label="联盟商编号"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="StoreName" label="账号"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="MultiType" label="联盟商"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="HasTicket" label="类型"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="TicketAmt" label="联系人"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="TicketAmt" label="联系人手机"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="TicketAmt" label="固定电话"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="TicketAmt" label="地址"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="TicketAmt" label="状态"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="60" prop="TicketAmt" label="来源"></el-table-column>
    </el-table>
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import { TicketBasicState, TicketSettleState, TicketNeiborRewaidState } from '@/enums/alliance'
import pagination from '@/components/pagination'
export default {
  data() {

    return {
      ticketBasicState: TicketBasicState,
      ticketSettleState: TicketSettleState,
      ticketNeiborRewaidState: TicketNeiborRewaidState,
      queryForm: {
        PageIndex: 1,
        PageSize: 20,
        MultiType: ''
      },
      total: 0,
      tableData: [],
      parameters: {},
      exprotLoading: false,

    }
  },
  methods: {
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
  components: {
    pagination

  }
}
</script>

<style lang="scss" scoped>
.content {
  border: 1px solid #ccc;
  .times{
    width: 100%;
    height: 64px;
    line-height: 64px;
    padding-left: 15px;
    border-bottom: 1px dashed #666;
    span{
      margin-right: 300px;
    }
  }
  .table{
    margin-bottom: 30px;
  }
  .settlement {
    height: 105px;
   
    margin-bottom: 30px;
    margin-top: 30px;
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