<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button name="btncreateDialog" type="primary" @click="createDialog = true">新建</el-button>
          <el-dropdown @command="multiCheckPrint">
            <el-button name="btnmultiCheckPrint" type="default">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item name="dropdown">批量标记已打印</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="所有状态">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in junkPrintOrderBasicStates.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PrintCode">
            <el-input name="PrintCode" v-model="queryForm.PrintCode" :maxlength="50" placeholder="单据编号" @keyup.enter.native="onSearch">
              <el-button name="btnonSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="PrintCode" label="单据编号：">
            <el-input name="PrintCode" v-model="queryForm.PrintCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：">
            <el-date-picker name="CreateTime" v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateUserId" label="创建人：">
            <el-select name="CreateUserId" v-model="queryForm.CreateUserId" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in $store.getters.users">
                <el-option v-if="item.TrueName" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReasonTypeDk" label="所有原因">
            <el-select name="ReasonTypeDk" filterable v-model="queryForm.ReasonTypeDk" placeholder="所有原因">
              <el-option label="所有原因" value="0"></el-option>
              <el-option v-for="(item,index) in reasonData" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格 -->
    <el-table 
      :data="data"
      ref="tableData" 
      @sort-change="sortChange" 
      @selection-change="selectionChange" 
      v-loading="$store.getters.tb_loading" 
      element-loading-text="拼命加载中">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="PrintCode" label="单据编号" min-width="140" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.CreateTime | filterDateMinutes }}
        </template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReasonTypeDv" label="打印原因" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity" label="条码数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PrintQty" label="打印数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Note" label="备注" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="state" label="状态" min-width="100" fixed="right">
        <template slot-scope="scope">
          <span>{{junkPrintOrderBasicStates.Types[scope.row.State]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/junkPrint/check',query:{id:scope.row.PrintId}}" class="btn-link el-button el-button--text">查看</router-link>
          <template v-if="scope.row.State === junkPrintOrderBasicStates.Printing">
            <router-link :to="{path:'/depot/junkPrint/edit',query:{id:scope.row.PrintId}}" class="btn-link el-button el-button--text">编辑</router-link>
            <el-button name="btncheckPrint" type="text" @click="checkPrint(scope.row)">标记已打印</el-button>
          </template>
          <router-link :to="{path:'/depot/junkPrint/printing',query:{id:scope.row.PrintId}}" class="btn-link el-button el-button--text">打印</router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module Dialog·新建打印单 -->
    <el-dialog title="新建旧货打印单" :visible.sync="createDialog" @close="resetForm">
      <el-form label-position="right" label-width="100px" :model="createForm" :rules="createRules" ref="createForm">
        <el-form-item label="打印原因：" prop="ReasonTypeDk">
          <el-select name="ReasonTypeDk" v-model="createForm.ReasonTypeDk" filterable placeholder="请选择">
            <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
          <span name="reasonDialog" class="icon-set-item" @click="reasonDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" name="Note" v-model="createForm.Note" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btncreatePrint" type="primary" @click="createPrint" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="btncreateDialog" @click="createDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建打印单 -->

    <!-- @module Dialog·新建打印单原因 -->
    <dict-manage v-if="reasonDialog" :visible.sync="reasonDialog" :dicts="reasonData" :dialogTitle="dialogTitle" :dictType="settingDictionaryDictType.JunkPrintOrderBasicReasonType" @listenDictSave="listenDictSave"></dict-manage>
    <!-- End Dialog·新建打印单原因  -->

  </div>

</template>

<script>
import {
  YNStatus
} from '@/enums/common.js'
import {
  SettingDictionaryDictType,
  JunkPrintOrderBasicState
} from '@/enums/stocking.js'
import {
  STOCKING_API_JUNK_PRINT_ORDER_BASIC_GETS,
  STOCKING_API_JUNK_PRINT_ORDER_BASIC_AUDIT,
  STOCKING_API_JUNK_PRINT_ORDER_BASIC_AUDITS,
  STOCKING_API_JUNK_PRINT_ORDER_BASIC_CREATE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST 
} from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'

export default {
  data() {
    return {
      YNStatus,
      settingDictionaryDictType: SettingDictionaryDictType,
      junkPrintOrderBasicStates: JunkPrintOrderBasicState,
      queryForm: {
        // 查询表单数据
        PrintCode: '',
        ReasonTypeDk: '0',
        ReasonTypeDv: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        CreateUserId: '',
        State: '0',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      reasonData: [], // 打印原因 
      dialogTitle: '旧货标签打印原因',
      data: [],
      total: 0,
      selections: [], // 选中的数据
      createDialog: false,
      createForm: {
        ReasonTypeDk: '',
        Reasons: '',
        Note: ''
      },
      createRules: {
        ReasonTypeDk: [
          {
            type: 'number',
            required: true,
            message: '请选择打印原因',
            trigger: 'change'
          }
        ]
      },
      parameters: {
      },
      reasonDialog: false
    }
  },
  methods: {
    init() {
      let query = JSON.stringify(this.$route.query) !== '{}' ? this.$route.query : {
        PrintCode: '',
        ReasonTypeDk: '0',
        ReasonTypeDv: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        CreateUserId: '',
        State: '0',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.parameters = Object.assign({
      }, query)
      this.parameters.CreateTime = query.CreateTime || []
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.parameters.CreateTime.length ? this.parameters.CreateTime : ['', '']
      let param = {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1]
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_JUNK_PRINT_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'PrintCode':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    selectionChange(selection) {
      this.selections = selection
    },
    getCreators() {
      // 获取创建人
      this.$store.dispatch('GET_USERS_DROPLIST')
    },
    getPrintReasonValue(id) {
      let result = ''
      this.reasonData.forEach(item => {
        if (item.Id === id) {
          result = item.Value
          return false
        }
      })
      return result
    },
    getReasons() {
      // this.$store.dispatch('GET_REASONS_DROPLIST', {DictType: this.settingDictionaryDictType.JunkPrintOrderBasicReasonType, State: this.YNStatus.Yes})
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.JunkPrintOrderBasicReasonType,
        State: this.YNStatus.Yes
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.reasonData = res.data.Data.Rows||[]
          if(!this.reasonData.some(item => item.Id === this.createForm.ReasonTypeDk)){
            this.createForm.ReasonTypeDk = ''
            this.createForm.ReasonTypeDv = ''
          }
        }
      })
    },
    listenDictDialog() {
      this.reasonDialog = false
      this.getReasons()
    },
    listenDictSave() {
      this.getReasons()
    },
    createPrint() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_JUNK_PRINT_ORDER_BASIC_CREATE({
            ReasonTypeDk: this.createForm.ReasonTypeDk,
            ReasonTypeDv: this.getPrintReasonValue(this.createForm.ReasonTypeDk),
            Note: this.createForm.Note
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '提交成功！',
                type: 'success'
              })
              this.$refs['createForm'].resetFields()
              this.createDialog = false
              this.$store.commit('SET_BTN_LOADING', false)
              this.$router.push({
                path: '/depot/junkPrint/edit',
                query: {
                  id: res.data.Data 
                }
              })
            } else {
              this.$message.error(res.data.Message)
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    checkPrint(row) {
      this.selections = [row]
      this.multiCheckPrint()
    },
    multiCheckPrint() {
      let apiMethods = ''
      let obj = {}
      if (
        !this.selections.length ||
        this.selections.filter(item => {
          if (item.State === this.junkPrintOrderBasicStates.Printed) {
            return item
          }
        }).length > 0
      ) {
        this.$message.error('请选择未标记打印的打印单')
      } else {
        this.$confirm('确定标记为已打印？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(111, this.selections)
          // this.$message({
          //   type: 'success',
          //   message: '标记成功'
          // })
          let Items = []
          let PrintId
          
          if(this.selections.length&&this.selections.length>1){
            apiMethods = STOCKING_API_JUNK_PRINT_ORDER_BASIC_AUDITS
            this.selections.forEach(item => {
              Items.push({PrintId: item.PrintId})
            })
            obj = Object.assign({}, {Items: Items})
          }else{
            apiMethods = STOCKING_API_JUNK_PRINT_ORDER_BASIC_AUDIT
            PrintId = this.selections[0].PrintId
            obj = Object.assign({}, {PrintId: PrintId})
          }
          apiMethods(obj).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              this.selections = []
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }).catch(() => {
          this.selections = []
          this.$refs.tableData.clearSelection()
          this.$message({
            type: 'info',
            message: '已取消标记'
          })
        })
      }
    },
    resetForm() {
      this.createForm = {
        ReasonTypeDk: '',
        Reasons: '',
        Note: ''
      }
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
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
        path: this.$router.path, query: this.parameters 
      })
    }
  },
  beforeMount() {
    this.getReasons()
    this.getCreators()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    dictManage
  }
}
</script>
