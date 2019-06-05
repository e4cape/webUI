<template>
  <el-row>
    <el-row class="m-b-10">
      <el-dropdown @command="yearChange">
        <el-button type="primary">
          {{year}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index) in years" :key="index" :command="item">{{item}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <!-- @module 数据表格 -->
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="SettleMonth" label="结账月份" min-width="120" show-overflow-tooltip fixed>
        <template slot-scope="scope">{{ scope.row.SettleMonth | filterMonth('YYYY年MM月') }}</template>
      </el-table-column>
      <el-table-column prop="SettleEtime" label="结账日期" min-width="180" show-overflow-tooltip fixed>
        <template slot-scope="scope">{{ scope.row.SettleBtime | filterDate }} 至 {{scope.row.SettleEtime | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="LastTime" label="操作时间" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="scope.row.State === SettleMonthlyBillBasicState.Wait">-</template>
          <template v-else>{{ scope.row.LastTime | filterDateMinutes }}</template>
        </template>
      </el-table-column>
      <el-table-column prop="LastUser" label="操作人" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="scope.row.State === SettleMonthlyBillBasicState.Wait">-</template>
          <template v-else>{{scope.row.LastUser}}</template>
        </template>
      </el-table-column>
      <el-table-column prop="InputPrice" label="收款金额" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="scope.row.State === SettleMonthlyBillBasicState.Wait">-</template>
          <template v-else>{{scope.row.InputPrice | initPrice}}</template>
        </template>
      </el-table-column>
      <el-table-column prop="OutPrice" label="付款金额" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="scope.row.State === SettleMonthlyBillBasicState.Wait">-</template>
          <template v-else>{{scope.row.OutPrice | initPrice}}</template>
        </template>
      </el-table-column>
      <el-table-column prop="JoiningPrice" label="加盟商结算金额" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="scope.row.State === SettleMonthlyBillBasicState.Wait">-</template>
          <template v-else>{{scope.row.JoiningPrice | initPrice}}</template>
        </template>
      </el-table-column>
      <el-table-column prop="AgentPrice" label="受托代销结算金额" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="scope.row.State === SettleMonthlyBillBasicState.Wait">-</template>
          <template v-else>{{scope.row.AgentPrice | initPrice}}</template>
        </template>
      </el-table-column>
      <el-table-column prop="State" label="状态" min-width="100" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">{{SettleMonthlyBillBasicState.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push({path: '/fmis/fmisMonthEnd/check', query: {id: scope.row.BillId}})" v-if="scope.row.State == SettleMonthlyBillBasicState.Done">查看</el-button>
          <el-button type="text" @click="showSettle(scope.row)" v-if="SettleMonthlyBillBasicState.Wait == scope.row.State">结账</el-button>
          <el-button type="text" @click="cancel(scope.row.BillId)" v-if="scope.row.State == SettleMonthlyBillBasicState.Done">取消结账</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <el-alert type="warning" title="注：只能按月结账，可以逐月取消结账。结账后，当月的单据不能修改，如需修改需要取消结账。" :closable="false"></el-alert>

    <!-- @module Dialog·结账 -->
    <el-dialog v-if="settleVisible" title="结账" width="620px" :visible.sync="settleVisible">
      <el-row>
        <el-row class="m-b-10">
          <span style="font-weight: bold;">结账月份：{{settleItem.SettleMonth | filterMonth('YYYY年MM月')}}</span>
          <span>({{ settleItem.SettleBtime | filterDate }}-{{settleItem.SettleEtime | filterDate}})</span>
        </el-row>
        <el-alert type="warning" title="
          请确认本月所有的单据已处理完毕，所有人都未操作本月出入库单据再做结账处理，结账后将不能再编辑或取消审核已结账月份的单据。建议每个月月初对上个月结账。" :closable="false"></el-alert>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="settle" :loading="$store.getters.is_loading" name="btnCreateReturn">开始结账</el-button>
        <el-button @click="settleVisible = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·结账 -->
  </el-row>
</template>

<script>
import {
  STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_GETS,
  STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_SETTLEDATE,
  STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_CANCLE,
  STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_SETTLE
} from '@/apis/stocking.js'
import { SettleMonthlyBillBasicState } from '@/enums/stocking'

export default {
  data() {
    return {
      SettleMonthlyBillBasicState,
      years: [],
      year: new Date().getFullYear(),
      data: [],
      settleVisible: false,
      settleItem: {}
    }
  },
  methods: {
    yearChange(value) {
      this.year = value
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_GETS({
        SettleYear: this.year
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
        }
      })
    },
    cancel(id) {
      this.$confirm('确定取消结算?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_CANCLE({
          BillId: id
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('取消成功')
            this.getData()
          }
        })
      })
    },
    showSettle(item) {
      console.log(item)
      this.settleItem = item
      this.settleVisible = true
    },
    settle() {
      this.$confirm('确定开始结账?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_SETTLE({
          BillId: this.settleItem.BillId
        }).then(res => {
          this.$store.commit('SET_BTN_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('结账成功')
            this.settleVisible = false
            this.getData()
          }
        })
      })
    },
    getDefaultYears () {
      STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_SETTLEDATE().then(res => {
        if (res.data.Code === 'CORRECT' && res.data.Data) {
          this.year = res.data.Data
          this.getData()
        }
      })
    }
  },
  beforeMount() {
    let nYear = new Date().getFullYear()
    for (let i = 2016; i <= nYear; i++) {
      this.years.push(i)
    }
    this.getDefaultYears()
  },
  mounted() {},
  watch: {},
  components: {}
}
</script>
