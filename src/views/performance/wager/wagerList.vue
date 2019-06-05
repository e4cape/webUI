<template>
  <div class="content">
    <el-form :model="form" ref="search" lable-width="120px" class="item-lh-26" :inline="true" @keyup.enter.native="onSearch">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnAdd" type="primary" @click="btnAdd" icon="fa fa-plus">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button name="btnAbout" type="text" @click="dialogAbout = true" class="el-icon-information">什么是业绩对赌</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="Status">
            <el-select name="Status" v-model="form.Status" @change="onSearch">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in auditStatus.TypeArray" :key="parseInt(item.KeyId)" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="UserName">
            <el-input name="UserName" v-model="form.UserName" :value="form.UserName" :maxlength="20" placeholder="请输入姓名">
              <el-button name="btnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="姓名：" prop="UserName">
            <el-input name="UserName" v-model="form.UserName" :maxlength="20" :value="form.UserName"></el-input>
          </el-form-item>
          <el-form-item label="对赌类型：" prop="WagerType">
            <el-select name="WagerType" v-model="form.WagerType" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in WagerType.TypeArray" :key="parseInt(item.KeyId)" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="Status">
            <el-select name="Status" v-model="form.Status" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in auditStatus.TypeArray" :key="parseInt(item.KeyId)" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column prop="UserName" label="姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WagerType" label="对赌类型" show-overflow-tooltip>
        <template slot-scope="{row}">{{WagerType.Types[row.WagerType]}}</template>
      </el-table-column>
      <el-table-column prop="Department" label="对赌业绩团队" show-overflow-tooltip width="120">
        <template slot-scope="{row}">{{row.Department !== '' ? row.Department : '-'}}</template>
      </el-table-column>
      <el-table-column prop="TargetPrice" label="对赌业绩目标" :formatter="priceFormatter" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="BasicPrice" label="对赌金额" :formatter="priceFormatter" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="RewardPrice" label="业绩完成奖励金额" :formatter="priceFormatter" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CycleMonths" label="对赌周期" show-overflow-tooltip>
        <template slot-scope="{row}">{{row.CycleMonths ? row.CycleMonths + '个月' : ''}}</template>
      </el-table-column>
      <el-table-column prop="DecredPrice" label="每月扣减金额" :formatter="priceFormatter" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Expireb" width="100" label="开始日期" show-overflow-tooltip>
        <template slot-scope="{row}">{{row.Expireb | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="Status" label="状态" width="90" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span :class="row.Status | findKey(auditStatus)">{{auditStatus.Types[row.Status]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="120">
        <template slot-scope="scope">
          <el-button name="btnDetail" type="text" @click="dialogDetail(scope.row.WagerId)">详情</el-button>
          <el-button name="btnEdit" type="text" v-if="scope.row.Status==auditStatus.Draft||scope.row.Status==auditStatus.Reject" @click="btnEdit(scope.row.WagerId)">修改</el-button>
          <el-button name="btnAudit" type="text" v-if="scope.row.Status==auditStatus.Wait" @click="btnAudit(scope.row.WagerId)">审核</el-button>
          <el-button name="btnInvalid" type="text" v-if="scope.row.Status==auditStatus.Wait||scope.row.Status==auditStatus.Draft" @click="btnAbandon(scope.row.WagerId)">作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <el-dialog title="什么是业绩对赌" :visible.sync="dialogAbout" :before-close="handleClose">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="1、什么是业绩对赌？" name="1">
          <div>业绩对赌是指企业员工自愿支付指定金额对赌其能完成业绩目标的一种绩效激励方式。</div>
        </el-collapse-item>
        <el-collapse-item title="2、业绩完成怎么奖励，业绩未完成有惩罚吗？" name="2">
          <div>对赌业绩完成，可获得对赌金额指定倍率的奖励，同时退回对赌金额；对赌业绩未完成，对赌金额将作为惩罚不予退回。</div>
        </el-collapse-item>
        <el-collapse-item title="3、中途离职，对赌金额可以退吗？" name="3">
          <div>中途离职或对赌业绩未完成，对赌金额不予退回，且对赌人不得追究和要求公司退回已支付的对赌金额。</div>
        </el-collapse-item>
        <el-collapse-item title="4、对赌金额是一次性支付还是按月分期支付？" name="4">
          <div>对赌金额的支付可按公司与对赌人双方的约定执行，可一次性支付，也可按月分期支付。</div>
        </el-collapse-item>
      </el-collapse>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnClose" type="primary" @click="dialogAbout = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="审核" :visible.sync="dialogAuditVisible" width="400px" :before-close="handleClose" @close="resetAudit">
      <el-form :model="formAudit" ref="formAudit" :rules="rules" class="demo-form-inline">
        <el-form-item prop="Status">
          <el-radio-group name="Status" v-model="formAudit.Status">
            <el-radio :label="auditStatus.Audit">审核通过</el-radio>
            <el-radio :label="auditStatus.Reject">审核退回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="CheckNote" v-if="formAudit.Status == auditStatus.Reject">
          <el-input name="CheckNote" v-model="formAudit.CheckNote" placeholder="退回原因" :maxlength="20" @blur="checkNoteTrim('formAudit')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnEnterAudit" type="primary" @click="audit">确 定</el-button>
        <el-button name="btnCancel" @click="dialogAuditVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="作废" :visible.sync="dialogAbandon" width="400px" @close="formAbandon.CheckNote = ''">
      <el-form :model="formAbandon" ref="formAbandon" :rules="abandonRules">
        <el-form-item prop="CheckNote">
          <el-input name="CheckNote" type="textarea" v-model="formAbandon.CheckNote" placeholder="作废原因" :maxlength="200" @blur="checkNoteTrim('formAbandon')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnAbandon" type="primary" @click="abandon('formAbandon')">确 定</el-button>
        <el-button name="btnCancel" @click="dialogAbandon = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="dialogDetailVisible" width="480px" :before-close="handleClose">
      <div>
        <WagerDetail :Detail="Details"></WagerDetail>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnClose" type="primary" @click="dialogDetailVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { JunkInnOrderBasicState } from '@/enums/marketing'
import { WagerType } from '@/enums/performance'
import {
  KPIS_API_WAGER_GETS,
  KPIS_API_WAGER_GET,
  KPIS_API_WAGER_REJECT,
  KPIS_API_WAGER_AUDIT,
  KPIS_API_WAGER_ABANDON
} from '@/apis/performance'
import WagerDetail from './wagerDetail.vue'
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
export default {
  data() {
    return {
      form: {
        UserName: '',
        WagerType: '',
        Status: '',
        PageSize: 20,
        PageIndex: 1
      },
      formAudit: {
        Status: '',
        BriefNote: '',
        DataId: '',
      },
      parameter: {},
      total: 0,
      dialogVisible: false,
      dialogDetailVisible: false,
      dialogAbout: false,
      dialogEdit: false,
      dialogAuditVisible: false,
      dialogAuditHidden: '',
      activeNames: ['1', '2', '3', '4'],
      auditStatus: JunkInnOrderBasicState,
      WagerType,
      tableData: [],
      Details: {},
      loading: true,
      formAbandon: {
        Abandon: '',
        WagerId: '',
      },
      dialogAbandon: false,
      abandonId: '',
      rules: {
        CheckNote: [
          {
            required: true,
            message: '退回原因是必填项',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '字数不可以超过200字！',
            trigger: 'blur'
          }
        ]
      },
      abandonRules:{
        CheckNote: [
          {
            required: true,
            message: '作废原因是必填项',
            trigger: 'blur'
          },
          {
            max: 200,
            message: '字数不可以超过200字！',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
    WagerDetail,
    pagination,
    searchPanel
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$route.path,
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.UserName = query.UserName || ''
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.Status = parseInt(query.Status) || ''
      this.parameter.WagerType = parseInt(query.WagerType) || ''
      this.form = Object.assign(this.form, this.parameter)
      this.getData()
    },
    getData() {
      this.loading = true
      KPIS_API_WAGER_GETS(this.form).then(res => {
        this.loading = false
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.form.PageIndex = 1
      this.form.isSenior = true
      this.parameter = Object.assign({}, this.form)
      this.initRoute(this.parameter)
    },
    onReset() {
      this.$refs.search.resetFields()
      this.onSearch()
    },
    handleSelect(item) {
      this.$data.form.NameId = item.Id
      this.$data.form.NameVal = item.value
    },
    handleClose(done) {
      done()
    },
    btnEdit(id) {
      this.$router.push({
        path: '/performance/wager/wageredit/' + id
      })
    },
    btnAdd() {
      this.$router.push('/performance/wager/wagercreate')
    },
    btnAudit(id){
      this.formAudit.WagerId = id
      this.formAudit.Status = this.auditStatus.Audit
      this.dialogAuditVisible = true
    },
    dialogDetail(value) {
      this.$data.dialogDetailVisible = true
      KPIS_API_WAGER_GET({
        WagerId: value
      }).then(res => {
        if(res.data.Code === 'CORRECT'){
          this.Details = res.data.Data
        }else{
          this.$message.error('获取详情失败！')
          this.$data.dialogDetailVisible = false
        }
      })
    },
    audit() {
      if (this.formAudit.Status == this.auditStatus.Reject) {
        this.$refs['formAudit'].validate(valid => {
          if (valid) {
            let params = Object.assign({},this.formAudit)
            params.DataId = this.formAudit.WagerId + ''
            delete params.WagerId
            KPIS_API_WAGER_REJECT(params).then(res => {
              this.dialogAuditVisible = false
              if (res.data.Code === 'CORRECT') {
                this.dialogFormVisible = true
                this.$message({
                  type: 'success',
                  message: res.data.Message,
                })
                this.getData()
              }
            })
          }
        })
      } else {
        KPIS_API_WAGER_AUDIT({DataId: this.formAudit.WagerId + '',CharacterId:this.$store.getters.user_session.CharacterId}).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.dialogAuditVisible = false
            this.$message({
              type: 'success',
              message: res.data.Message,
            })
            this.getData()
          }
        })
      }
    },
    // 重置表单
    resetAudit() {
      this.$refs['formAudit'].resetFields()
    },
    btnAbandon (id) {
      this.dialogAbandon = true
      this.abandonId = id
    },
    abandon(){
      this.$refs['formAbandon'].validate((valid) => {
        if (valid) {
          KPIS_API_WAGER_ABANDON({DataId: this.abandonId + '',CharacterId:this.$store.getters.user_session.CharacterId,CheckNote:this.formAbandon.CheckNote}).then(res => {
            this.dialogAbandon = false
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message,
              })
              this.getData()
            }
          })
        }
      })
    },
    priceFormatter(row, column, value) {
      return '￥' + this.$root.toFloat(value)
    },
    checkNoteTrim(formName){
      if(this[formName].CheckNote && this[formName].CheckNote.length > 0){
        this[formName].CheckNote = this[formName].CheckNote.trim()
      }
    }
  }
}
</script>
