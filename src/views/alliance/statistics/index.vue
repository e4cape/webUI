<template>
  <div class="content">
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
              <el-option v-for="(item, index) in settleTicketBillBasicBillType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="queryForm.TicketName">
            <el-input name="TicketName" v-model="queryForm.TicketName" placeholder="卡卷名称" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="queryForm.NeiborCode" label="联盟商编码：">
            <el-input name="TicketCode" v-model="queryForm.NeiborCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="queryForm.NeiborCode" label="联盟商ID：" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-input name="TicketCode" v-model="queryForm.NeiborName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="queryForm.NeiborName" label="联盟商：">
            <el-input name="TicketCode" v-model="queryForm.NeiborName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="queryForm.TicketCode" label="卡卷ID：">
            <el-input name="TicketCode" v-model="queryForm.TicketCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="queryForm.TicketName" label="卡卷名称：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
           <el-form-item prop="TicketCode" label="关键字：" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-input name="TicketCode" placeholder="珠宝商编码/名称" v-model="queryForm.TicketCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
            <el-form-item prop="HasTicket" label="联盟券统计：" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-select name="State" v-model="queryForm.HasTicket" placeholder="全部" @change="onSearch">
              <el-option label="全部" :value="'0'"></el-option>
              <!-- <el-option v-for="(item, index) in settleTicketBillBasicBillType.Types" :key="index" :label="item" :value="index"></el-option> -->
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip min-width="100" fixed prop="NeiborCode" label="联盟商编码"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="100" fixed prop="NeiborName" label="联盟商"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="130" prop="TicketCode" label="卡券ID"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="100" prop="TicketName" label="卡券名称"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="SharedQty" sortable label="推广数"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="UnusedQty" sortable label="未使用"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="LockedQty" sortable label="已锁定"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="TransfQty" sortable label="已使用"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="ReturnQty" sortable label="已退货"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="ExpiredQty" sortable label="已过期"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="Rate" sortable label="转化率">
        <template slot-scope="scope">{{scope.row.Rate | conversion}} </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="SharedPaidPrice" label="推广结算金额"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="80" prop="TransfPaidPrice" label="转化结算金额"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="120" prop="operation" label="结算明细">
         <template>
          <el-button type="text" @click="$router.push({path: '/alliance/statistics/seeDetail'})">查看</el-button>
        </template>
      </el-table-column>
      
    </el-table>
       <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
 
</template>

<script>
import { CharacterType, YNStatus } from '@/enums/common.js'
import { SettleTicketBillBasicBillType} from '@/enums/alliance'
import {
  ALLIANCE_API_TICKETNEIBOR_SCHSBYLCB,
  ALLIANCE_API_TICKETNEIBOR_EXPORT2,
  
} from '@/apis/alliance'
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'

export default {
  beforeMount() {},
  data() {
    return {
      settleTicketBillBasicBillType: SettleTicketBillBasicBillType,
      yNStatus:YNStatus,
      characterType:CharacterType,
      queryForm:{
        NeiborCode:'',
        NeiborName:'',
        TicketCode:'',
        TicketName:'',
        MultiType:'0',
        UniteNote:'',
        IsAsced:YNStatus.No,
        Orderby:'0',
        PageIndex: 1,
        PageSize: 20,
     
      },
      total: 0,
      exprotLoading: false,
      parameters: {},
      tableData: [],
      TicketCode:'',
      TicketName:''
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(
        this.queryForm,
        {
          NeiborCode:'',
          NeiborName:'',
          TicketCode:'',  
          TicketName:'',
          MultiType:'0',
          UniteNote:'',
          IsAsced:'1',
          Orderby:'0',
          PageIndex: 1,
          PageSize: 20,
        },
        query
      )
      this.getData()
    },

    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      ALLIANCE_API_TICKETNEIBOR_SCHSBYLCB(this.queryForm).then(res => {
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
      ALLIANCE_API_TICKETNEIBOR_EXPORT2(this.queryForm)
        .then(res => {
          console.log(res)
          
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
        NeiborCode:'',
        NeiborName:'',
        TicketCode:'',
        TicketName:'',
        MultiType:'0',
        UniteNote:'',
        IsAsced:'1',
        Orderby:'0',
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

</style>
