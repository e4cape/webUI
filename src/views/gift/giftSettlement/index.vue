<template>
  <div class="content">
    <!-- @module 筛选条件 -->
    <el-form v-if="StoreCharacterType == characterType.Lingcb" :model="queryForm" lable-width="120px" class="item-lh-26" :inline="true" ref="queryForm">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button name="btnCreate" type="primary" @click="wantCreate">新建</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="status">
            <el-dropdown name="btnSelectState" @command="selectState">
              <el-button type="default" style="width: 100px">
                {{activeState}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="''">所有状态</el-dropdown-item>
                <el-dropdown-item v-for="item in brandStatus.Types" :key="item.key" :command="item.key">{{item.title}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-input name="billCode" v-model="queryForm.billCode" placeholder="单据编号" @keyup.enter.native="onSearch">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="单据编号：" prop="billCode">
            <el-input name="billCode" v-model="queryForm.billCode" :maxlength="25" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="供应商编码：" prop="supplierCode">
            <el-input name="supplierCode"  v-model="queryForm.supplierCode" :maxlength="25" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="供应商名称：" prop="supplierName">
            <el-input name="supplierName" v-model="queryForm.supplierName" :maxlength="25" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="createTime">
            <el-date-picker name="createTime" type="daterange" v-model="queryForm.createTime" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="$root.datePickerOptions" :unlink-panels="true"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- End 筛选条件 -->
    <!-- @module 数据表格 -->
    <el-table :data="data" class="no-border" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @sort-change="sortChange">
      <el-table-column prop="billCode" fixed label="单据编号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="supplierCode" label="供应商编码" min-width="100" show-overflow-tooltip v-if="StoreCharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" min-width="100" show-overflow-tooltip v-if="StoreCharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="wholesalePrice" label="批发金额" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="rateText" label="平台提点比率" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ratePrice" label="平台提点金额" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" label="结算金额" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderCode" label="结算日期" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.btime.substring(0, scope.row.btime.length - 9) + '至' + scope.row.etime.substring(0, scope.row.btime.length - 9)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" min-width="140" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="statusText" fixed="right" label="状态" min-width="80" show-overflow-tooltip v-if="StoreCharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="140">
        <template slot-scope="scope">
          <template v-if="StoreCharacterType == characterType.Lingcb">
            <router-link name="btnLink" :to="{path:'/gift/giftSettlement/settlementCheck',query:{monthlyBillId:scope.row.monthlyBillId}}" class="btn-link el-button el-button--text">查看</router-link>
            <el-button name="btnUpdate"  type="text" @click="updateOrderState(scope.row.monthlyBillId)" v-if="scope.row.status == brandStatus.NotAudit">审核</el-button>
            <el-button name="btnDelete" type="text" @click="deleteBtn(scope.row)" v-if="scope.row.status != brandStatus.Nullify" >作废</el-button>
          </template>
          <template v-else>
            <router-link name="btnLinkCheck" :to="{path:'/gift/giftSettlement/settlementCheck',query:{monthlyBillId:scope.row.monthlyBillId}}" class="btn-link el-button el-button--text">查看</router-link>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <!-- 分页 -->
    <pagination :pg="queryForm.pageIndex" :size="queryForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- End 分页 -->
    <!-- @module 新建结算单 -->
    <el-dialog title="新建结算单" :visible.sync="showSettlement" width="1152px" v-if="showSettlement" @close="resetShowSettlement">
      <el-form :model="searchForm" class="settlement" ref="searchForm" lable-width="100px" :inline="true">
        <el-row class="total-panel">
            <el-form-item label="供应商编码：" prop="supplierCode">
              <el-input name="supplierCode" v-model="searchForm.supplierCode" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="供应商名称：" prop="supplierName">
              <el-input name="supplierName"  v-model="searchForm.supplierName" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="上次结算日期：" prop="lastBillTime">
              <el-date-picker name="lastBillTime" type="daterange" v-model="lastBillTime" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="$root.datePickerOptions" unlink-panels value-format="yyyy-MM-dd HH:mm:dd"></el-date-picker>
            </el-form-item>
            <el-button name="btnShowSearch" type="primary" @click="search">搜索</el-button>
        </el-row>
      </el-form>
      <!-- @module 数据表格 -->
      <el-table :data="settlesData" v-loading="tbLoading" element-loading-text="拼命加载中" @sort-change="addSortChange">
        <el-table-column prop="supplierCode" fixed label="供应商编码" sortable="custom" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="lastBillTime" label="上次结算日期" sortable="custom" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.lastBillTime || '-'}}
          </template>
        </el-table-column>
        <el-table-column label="上次结算账期" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{(scope.row.lastBillBtime.substring(0, scope.row.lastBillBtime.length - 9) || '-' )+ '至' + (scope.row.lastBillEtime.substring(0, scope.row.lastBillEtime.length - 9) || '-')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="waitBillPrice" label="待结算货品批发金额" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button name="btnShowDetail" type="text" @click="showDetail(scope.row)">创建结算单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- End 数据表格 -->
      <!-- 分页 -->
      <div class="p10">
        <pagination :pg="searchForm.pageIndex" :size="searchForm.pageSize" :total="settlesTotal" @currentChange="settlesCurrentChange" @sizeChange="settlesSizeChange"></pagination>
      </div>
      <!-- End 分页 -->
    </el-dialog>
    <!-- End 新建结算单 -->
    <!-- @module 新建结算单2 -->
    <el-dialog title="新建结算单" :visible.sync="showSettleDetail" width="520px" v-if="showSettleDetail">
      <el-form :model="settleDetail" label-position="right" label-width="100px">
        <el-form-item label="礼品供应商：" prop="supplierName">{{settleDetail.supplierName}}</el-form-item>
        <el-form-item label="上次结算时间：" prop="lastBillTime">{{settleDetail.lastBillTime || '-'}}</el-form-item>
        <el-form-item label="上次结算账期：" prop="lastBillTime">
          {{settleDetail.lastBillBtime.substring(0, settleDetail.lastBillBtime.length - 9) || '-'}}至{{settleDetail.lastBillEtime.substring(0, settleDetail.lastBillEtime.length - 9) || '-'}}
        </el-form-item>
        <el-form-item label="待结算金额：" prop="waitBillPrice">{{settleDetail.waitBillPrice}}</el-form-item>
        <el-form-item label="本次结算账期：">
          <el-col :span="11">
            <el-date-picker name="dateStart" type="date" placeholder="选择日期" v-model="settleDetail.dateStart" disabled value-format="yyyy-MM-dd HH:mm:dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker name="dateEnd" type="date" placeholder="选择日期" v-model="settleDetail.dateEnd" value-format="yyyy-MM-dd HH:mm:dd" :picker-options="pickerOptions" @change="dateEndChange" style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="货品批发金额：" prop="waitBillPrice">
          <span class="fw">{{monthlyPrice}}</span>（根据以上结算账期时间内发货的货品计算）
        </el-form-item>
        <el-form-item label="平台提点比率：" prop="waitBillPrice">
          <span class="fw">{{settleDetail.taxesText}}</span>（根据以上结算账期时间内发货的货品计算）
        </el-form-item>
        <el-form-item label="平台提点金额：" prop="waitBillPrice">
          <span class="fw">{{platPrice.toFixed(2)}}</span>（根据以上结算账期时间内发货的货品计算）
        </el-form-item>
        <el-form-item label="应结算金额：" prop="waitBillPrice">
          <span class="fw">{{clearingPrice}}</span>（根据以上结算账期时间内发货的货品计算）
        </el-form-item>
        <el-form-item label="备注：">
          <el-input name="remark" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnAddSettle" type="primary" @click="addSettle">确 定</el-button>
        <el-button name="btnCancel" @click="showSettleDetail = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- End 新建结算单2 -->
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import {
  BrandStatus 
} from '@/enums/gifting.js'
import { CharacterType, YNStatus } from '@/enums/common'
import {
  GIFTING_API_FINANCEMONTHLYBILL_SEARCH,
  GIFTING_API_FINANCEMONTHLYBILL_AUDIT,
  GIFTING_API_FINANCEMONTHLYBILL_INVALID,
  GIFTING_API_FINANCEMONTHLYBILL_SEARCHSETTLES,
  GIFTING_API_FINANCEMONTHLYBILL_GETMONTHLYPRICE,
  GIFTING_API_FINANCEMONTHLYBILL_CREATEFINANCEMONTHLYBILL
} from '@/apis/gifting'
export default {
  data() {
    return {
      brandStatus: BrandStatus,
      characterType: CharacterType,
      activeState: '所有状态', // 显示状态
      parameter: {
      },
      data: [],
      queryForm: {
        status: this.$store.getters.user_session.CharacterType == CharacterType.Supplier?BrandStatus.Audited:'',
        billCode: '',
        supplierCode: '' ,
        supplierName: '',
        createTime: '',
        orderField: 'createTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      searchForm: {
        supplierCode: '' ,
        supplierName: '' ,
        lastBillTimeStart: '' ,
        lastBillTimeEnd: '' ,
        orderField: 'lastBillTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 10
      },
      showSettlement: false,
      lastBillTime: [''], // 上次结算时间
      settlesData: [], // 结算账期列表
      settlesTotal: 0, // 结算账期列表条数
      showSettleDetail: false,
      settleDetail: {
        dateEnd: new Date(new Date().getTime() - 3600 * 1000 * 24)
      },
      addForm: {
        characterId: 0,
        // supplierName: '',
        billEtimeEnd: '',
        remark: ''
      }, // 新建参数
      monthlyPrice: 0, // 批发金额,
      platPrice: 0, // 平台提点金额
      clearingPrice: 0, // 应结算金额,
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() > new Date(new Date().getTime() - 3600 * 1000 * 24)
          )
        }
      },
      tbLoading: false,
    }
  },
  computed: {
    StoreCharacterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.status = this.$store.getters.user_session.CharacterType == CharacterType.Supplier?BrandStatus.Audited:(query.status || '')
      this.parameter.createTime = query.createTime || ['', '']
      this.parameter.billCode = query.billCode || ''
      this.parameter.supplierName = query.supplierName || ''
      this.parameter.orderField = query.orderField || 'createTime'
      this.parameter.orderField = query.orderField || 0
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 20
      this.activeState = !query.status
        ? '所有状态'
        : this.brandStatus.Types.filter(item => item.key == query.status)[0]
          .title
      this.getData()
    },
    getData() {
      let parameter = Object.assign(this.queryForm, this.parameter, {
        createTimeStart: this.parameter.createTime[0],
        createTimeEnd: this.parameter.createTime[1],
      })
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_FINANCEMONTHLYBILL_SEARCH(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        this.data = res.data.Data.rows
        this.total = res.data.Data.total
      })
    },
    getSettles() {
      if (!this.lastBillTime) {
        this.lastBillTime = ['', '']
      }
      this.searchForm.lastBillTimeStart = this.lastBillTime[0]
      this.searchForm.lastBillTimeEnd = this.lastBillTime[1] ? this.lastBillTime[1] : ''
      this.tbLoading = true
      GIFTING_API_FINANCEMONTHLYBILL_SEARCHSETTLES(this.searchForm).then(
        res => {
          this.tbLoading = false
          if (res.data.Code == 'CORRECT') {
            this.settlesData = res.data.Data.rows
            this.settlesTotal = res.data.Data.total
          }
        }
      )
    },
    selectState(v) {
      this.parameter.pageIndex = 1
      this.parameter.status = v
      this.initRoute()
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.parameter = Object.assign({
      }, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.queryForm = {
        createTime: ['', ''],
        billCode: '',
        supplierCode: '' ,
        supplierName: '' ,
        lastBillTimeStart: '' ,
        lastBillTimeEnd: '' ,
        orderField: 'createTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20
      }
      this.onSearch()
    },
    sortChange(sort) {
      // 表单排序
      this.queryForm.orderField = sort.prop
      this.queryForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    settlesCurrentChange (val) {
      this.searchForm.pageIndex = val
      this.getSettles()
    },
    settlesSizeChange (val) {
      this.searchForm.pageIndex = 1
      this.searchForm.pageSize = val
      this.getSettles()
    },
    addSortChange (sort) {
      // 新建表单排序
      this.searchForm.orderField = sort.prop
      this.searchForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.search()
    },
    updateOrderState(id) {
      // 审核
      this.$confirm('确认审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        GIFTING_API_FINANCEMONTHLYBILL_AUDIT({
          monthlyBillId: id 
        }).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.$message.success('审核成功')
            this.getData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核通过'
        })
      })
    },
    deleteBtn(row) {
      // 作废
      this.$confirm('确认作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        GIFTING_API_FINANCEMONTHLYBILL_INVALID({
          monthlyBillId: row.monthlyBillId
        }).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.$message.success('作废成功')
            this.getData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    search() {
      // 新建结算单搜索
      this.searchForm.pageIndex = 1
      this.getSettles()
    },
    wantCreate() {
      this.search()
      this.showSettlement=true
    },
    getMonthlyPrice() {
      GIFTING_API_FINANCEMONTHLYBILL_GETMONTHLYPRICE({
        characterId: this.settleDetail.characterId,
        dateStart: this.settleDetail.dateStart,
        dateEnd: this.settleDetail.dateEnd
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.monthlyPrice = res.data.Data
          this.platPrice = (parseFloat(res.data.Data) * parseFloat(this.settleDetail.taxes)).toFixed(2)
          this.clearingPrice = (parseFloat(res.data.Data) * parseFloat(1 - this.settleDetail.taxes)).toFixed(2)
        }
      })
    },
    showDetail(row) {
      this.data.forEach(item => {
        if (
          item.characterId == row.characterId &&
          item.status == this.brandStatus.NotAudit
        ) {
          return this.$message.error(
            '该供应商有未审核的结算单，请先审核或作废后再创建'
          )
        }
      })
      this.showSettleDetail = true
      this.settleDetail = Object.assign(this.settleDetail, row)
      this.settleDetail.dateStart = new Date(
        new Date(row.lastBillEtime).getTime() + 24 * 3600 * 1000
      )
      this.getMonthlyPrice()
    },
    dateEndChange() {
      if (
        new Date(this.settleDetail.dateEnd) <
        new Date(this.settleDetail.dateStart)
      ) {
        return this.$message.error('结束时间应该大于开始时间')
      }
      this.getMonthlyPrice()
    },
    addSettle() {
      this.addForm.characterId = this.settleDetail.characterId
      // this.addForm.supplierName = this.settleDetail.supplierName;
      this.addForm.billEtimeEnd =
        typeof this.settleDetail.dateEnd == 'object'
          ? this.settleDetail.dateEnd.toLocaleDateString()
          : this.settleDetail.dateEnd
      GIFTING_API_FINANCEMONTHLYBILL_CREATEFINANCEMONTHLYBILL(
        this.addForm
      ).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.showSettleDetail = this.showSettlement = false
          this.getData()
        }
      })
    },
    resetShowSettlement() {
      this.$refs.searchForm.resetFields()
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
.settlement /deep/ .el-date-editor--daterange.el-input__inner {
  width: 220px;
}
.line {
  text-align: center;
}
.fw {
  font-size: 16px;
  font-weight: 700;
}
</style>
