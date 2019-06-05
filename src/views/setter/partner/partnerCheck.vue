<template>
  <el-dialog title="查看单位" :visible.sync="visible" custom-class="supplier-dialog">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="基本资料" name="first"></el-tab-pane>
      <el-tab-pane label="账户信息" name="second"></el-tab-pane>
    </el-tabs>

    <el-form v-if="activeName == 'first'" :model="form" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位名称：">
            <span>{{form.PartnerName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位编码：">
            <span>{{form.PartnerCode}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位类型：">
            <span>{{partnerType.Types[form.PartnerType]}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在地区：">
            <span>{{form.areas}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="详细地址：">
            <span>{{form.Address}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="税率：">
            <span>{{form.Taxes ? $root.toFloat(form.Taxes * 100) + '%' : '0%'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司电话：">
            <span>{{form.Phone}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开户银行：">
            <span>{{form.BankName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行账号：">
            <span>{{form.AccountCode}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账户姓名：">
            <span>{{form.Surname}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="微信：">
            <span>{{form.Wechart}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人姓名：">
            <span>{{form.Contact}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人手机：">
            <span>{{form.Mobile}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人邮箱：">
            <span>{{form.Email}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人QQ：">
            <span>{{form.QQ}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="结算类型：">
            <span>{{partnerBasicSettleType.Types[form.SettleType]}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">
            <span>{{form.Note}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- Data Table -->
    <div v-if="activeName == 'second'">
      <el-table :data="logData" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column prop="SettleType" label="操作时间" sortable="custom" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateMinutes}}</template>
        </el-table-column>
        <el-table-column prop="CreateUser" label="操作人" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ObjectName" label="操作单位" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="EventType" label="操作类型" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{eventType.Types[scope.row.EventType]}}</template>
        </el-table-column>
        <el-table-column prop="PreviousCode" label="相关单据" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Taxes" label="账户余额变化" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.TotalCash2 - scope.row.TotalCash1 > 0 ?  '+' + $root.toFloat(scope.row.TotalCash2 - scope.row.TotalCash1) : $root.toFloat(scope.row.TotalCash2 - scope.row.TotalCash1)}}</template>
        </el-table-column>
        <el-table-column prop="Taxes" label="账户余额结存" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{ $root.toFloat(scope.row.TotalCash2)}}</template>
        </el-table-column>
        <el-table-column prop="Taxes" label="可用余额变化" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ValidCash2 - scope.row.ValidCash1 > 0 ?  '+' + $root.toFloat(scope.row.ValidCash2 - scope.row.ValidCash1) : $root.toFloat(scope.row.ValidCash2 - scope.row.ValidCash1)}}</template>
        </el-table-column>
        <el-table-column prop="Taxes" label="可用余额结存" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.ValidCash2)}}</template>
        </el-table-column>
        <el-table-column prop="CreateTime" label="锁定余额变化" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.LockCash2 - scope.row.LockCash1 > 0 ?  '+' + $root.toFloat(scope.row.LockCash2 - scope.row.LockCash1) : $root.toFloat(scope.row.LockCash2 - scope.row.LockCash1)}}</template>
        </el-table-column>
        <el-table-column prop="CreateTime" label="锁定余额结存" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.LockCash2)}}</template>
        </el-table-column>
        <el-table-column prop="Note" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- end Data Table -->
      <!-- Pagination -->
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <!-- End Panel -->

      <div class="m-10">账户余额: {{$root.toFloat(ValidCash + LockCash)}} ,可用余额: {{$root.toFloat(ValidCash)}}, 锁定余额: {{$root.toFloat(LockCash)}}</div>
    </div>
  </el-dialog>
</template>
<script>
import { PartnerType, YNStatus } from '@/enums/common.js'
import {
  PartnerBasicSettleType,
  PartnerBalanceLogEventType
} from '@/enums/stocking.js'
import {
  STOCKING_API_PARTNER_BASIC_GET,
  STOCKING_API_PARTNER_BALANCE_LOG_GETS
} from '@/apis/stocking.js'
import pagination from '@/components/pagination'

export default {
  props: {
    dialogCheckVisible: {
      defult: false,
      type: Boolean
    },
    partnerId: {
      defult: 0,
      type: Number
    }
  },
  data() {
    return {
      YNStatus,
      ValidCash: 0,
      LockCash: 0,
      eventType: PartnerBalanceLogEventType,
      logData: [],
      queryForm: {
        PartnerId: this.partnerId,
        PageIndex: 1,
        PageSize: 20,
        OrderBy: 0,
        IsAsced: YNStatus.No
      },
      total: 0,
      activeName: 'first',
      partnerType: PartnerType,
      partnerBasicSettleType: PartnerBasicSettleType,
      form: {},
      visible: this.dialogCheckVisible
    }
  },
  watch: {
    visible: function() {
      this.$emit('listenCheckVisible', false)
    }
  },
  methods: {
    getDetail() {
      STOCKING_API_PARTNER_BASIC_GET({
        PartnerId: this.partnerId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          this.form.areas =
            (this.form.ProvinceName ? this.form.ProvinceName : '') +
            (this.form.CityName ? '/' + this.form.CityName : '') +
            (this.form.TownName ? '/' + this.form.TownName : '')
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getData() {
      STOCKING_API_PARTNER_BALANCE_LOG_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.logData = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          if(this.queryForm.PageIndex !== 1 || this.logData.length < 1) { return}
          var length = this.queryForm.IsAsced == this.YNStatus.No ? 0 : this.logData.length - 1
          this.LockCash =
            this.logData[length]['LockCash2'] || 0
          this.ValidCash =
            this.logData[length]['ValidCash2'] || 0
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    sortChange(sort) {
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.getData()
    },
    currentChange(val) {
      // 切换当前页
      this.queryForm.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
      this.getData()
    }
  },
  components: {
    pagination
  },
  beforeMount() {
    this.getDetail()
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.el-form-item__content > span {
  word-break: break-all;
}
</style>
