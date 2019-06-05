<!--付款-->
<template>
  <div class="content">
    <!-- 搜索条件 -->
    <el-form :model="queryForm" label-position="right" label-width="100px" :inline="true" class="item-lh-26 p-10" ref="search">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item prop="ObjectNote" label="付款对象：">
            <el-input name="ObjectNote" v-model="queryForm.ObjectNote" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item prop="ObjectType" label="付款对象：">
            <el-select name="objectType" v-model="queryForm.ObjectType" placeholder="全部">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item,index) in settleIOBillBasicObjectTypes.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button name="btnonSearch" type="primary" @click="onSearch">搜索</el-button>
          <el-button name="btnonReset" @click="onReset">重置</el-button>
          <el-button name="btnExport" @click="exportData" :disabled="!data.length">导出</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- END 搜索条件 -->
    <!-- Data Table -->
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @sort-change="sortChange">
      <el-table-column prop="PaidCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip fixed>
        <template slot-scope="scope">
          <el-button type="text" name="btnLinkPreviousType" @click="$router.push({path: '/fmis/paymentorder/paymentorderCheck', query: {id: scope.row.PaidId}})">{{scope.row.PaidCode}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ObjectNote" label="付款对象" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ObjectType" label="对象类型" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{settleIOBillBasicObjectTypes.Types[scope.row.ObjectType]}}</template>
      </el-table-column>
      <el-table-column prop="BillCode" label="来源单号" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" name="btnLinkPreviousType" @click="$router.push({path: '/fmis/payment/paymentCheck', query: {id: scope.row.BillId}})">{{scope.row.BillCode}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="PaidPrice" label="付款金额" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.PaidPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column prop="BankTypeDv" label="付款账户" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PaymentTypeEv" label="付款方式" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="100" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column prop="CheckTime" label="确认时间" min-width="100" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.CheckTime | filterDateTime }}</template>
      </el-table-column>
    </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p-10">
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <!-- 分页 end -->
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import { YNStatus } from '@/enums/common'
import {
  SettleIOBillPaidState,
  SettleIOBillBasicObjectType,
  SettleIOBillPaidType
} from '@/enums/stocking'
import {
  STOCKING_API_SETTLE_IO_BILL_PAID_GETS,
  STOCKING_API_SETTLE_IO_BILL_PAID_EXPORT
} from '@/apis/stocking'
import previousTypeLink from '@/datas/previous/previousTypeLink'
export default {
  props: {
    startTime: {
      default: '',
      type: String
    },
    endTime: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      settleIOBillPaidStates: SettleIOBillPaidState,
      settleIOBillBasicObjectTypes: SettleIOBillBasicObjectType,
      previousTypeLink: previousTypeLink,
      queryForm: {
        PaidType: SettleIOBillPaidType.Paid,
        ObjectNote: '',
        ObjectType: '0',
        State: SettleIOBillPaidState.Audit,
        PageIndex: 1,
        PageSize: 10
      },
      parameters: {},
      total: 0,
      data: []
    }
  },
  methods: {
    getData() {
      if (!this.startTime && !this.endTime) {
        return
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, {
        ActualDate1: this.startTime,
        ActualDate2: this.endTime
      })
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_SETTLE_IO_BILL_PAID_GETS(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsc =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.getData()
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getData()
    },
    exportData() {
      STOCKING_API_SETTLE_IO_BILL_PAID_EXPORT(
        Object.assign({}, this.queryForm, this.parameters, {
          ActualDate1: this.startTime,
          ActualDate2: this.endTime,
          ObjectType: parseInt(this.queryForm.ObjectType),
          ExportColumns: [
            {
              FieldEnName: 'PaidCode',
              FieldCnName: '单据编号'
            },
            {
              FieldEnName: 'ObjectNote',
              FieldCnName: '付款对象'
            },
            {
              FieldEnName: 'ObjectTypeName',
              FieldCnName: '对象类型'
            },
            {
              FieldEnName: 'BillCode',
              FieldCnName: '来源单号',
              Precision: 2
            },
            {
              FieldEnName: 'PaidPrice',
              FieldCnName: '付款金额',
              Precision: 2
            },
            {
              FieldEnName: 'BankTypeDv',
              FieldCnName: '付款账户'
            },
            {
              FieldEnName: 'PaymentTypeEv',
              FieldCnName: '付款方式'
            },
            {
              FieldEnName: 'CreateTime',
              FieldCnName: '创建时间'
            },
            {
              FieldEnName: 'CheckTime',
              FieldCnName: '确认时间'
            }
          ]
        })
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            setTimeout(() => {
              window.open(
                this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data
              )
            }, 1000)
          } else {
            this.$router.push('/setter/userConfig/download')
          }
        }
      })
    }
  },
  beforeMount() {
    this.getData()
  },
  mounted() {},
  components: {
    pagination
  },
  watch: {
    startTime: 'getData',
    endTime: 'getData'
  }
}
</script>